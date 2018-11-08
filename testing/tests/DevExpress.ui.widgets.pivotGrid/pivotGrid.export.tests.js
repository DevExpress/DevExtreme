import "spa.css!";
import $ from "jquery";
import { isDefined } from "../../../js/core/utils/type.js";
import helper from '../../helpers/pivotGridExportTestsHelper.js';

QUnit.testStart(function() {
    var markup = '<div id="pivotGrid" style="width: 700px"></div>';
    $("#qunit-fixture").html(markup);
});

QUnit.module("PivotGrid export tests", {
    beforeEach: helper.beforeEachTest,
    afterEach: helper.afterEachTest,
});

QUnit.test("Export empty pivot", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>0</v></c><c r="B2" s="2" t="s" /></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Grand Total</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'Grand Total' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'Grand Total' },
            undefined,
        ];
    };

    helper.runTest(assert, {}, { getExpectedCells, styles, worksheet, sharedStrings });
});

QUnit.test("Export [string x string x number]", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>1</v></c><c r="B2" s="2" t="n"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'a' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'A' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string" },
                    { area: 'column', dataField: 'col1', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number" }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Export [string x string x number] with column grand totals", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>1</v></c><c r="B2" s="2" t="n"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'Grand Total' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'A' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: true,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number" }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Export [string x string x number] with row grand totals", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>1</v></c><c r="B2" s="2" t="n"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>Grand Total</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'a' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'Grand Total' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            dataSource: {
                fields: [
                    { area: 'column', dataField: 'col1', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number" }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Export [string x string x number] with 'format: currency'", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count=\"1\"><numFmt numFmtId=\"165\" formatCode=\"$#,##0_);\\($#,##0\\)\" /></numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>1</v></c><c r="B2" s="2" t="n"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'a' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'A' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string" },
                    { area: 'column', dataField: 'col1', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number", format: 'currency' }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Export [string x string/string x number]", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c><c r="C1" s="0" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="2" t="n" /><c r="B2" s="0" t="s"><v>1</v></c><c r="C2" s="0" t="s"><v>2</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="1" t="s"><v>3</v></c><c r="B3" s="2" t="n"><v>1</v></c><c r="C3" s="2" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>a1</t></si>' +
        '<si><t>a2</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'a' },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: undefined },
            { },
            { area: 'column', columnIndex: 0, rowIndex: 1, _excelCellValue: 'a1' },
            { area: 'column', columnIndex: 1, rowIndex: 1, _excelCellValue: 'a2' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'A' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
            { area: 'data', columnIndex: 1, rowIndex: 0, _excelCellValue: 2 },
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string" },
                    { area: 'column', dataField: 'col1', dataType: "string", expanded: true, showTotals: false },
                    { area: 'column', dataField: 'col2', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number" }
                ],
                store: [
                    { row1: 'A', col1: 'a', col2: 'a1' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Export [string x string/string x number] with column totals", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c><c r="C1" s="0" t="s" /><c r="D1" s="0" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="2" t="n" /><c r="B2" s="0" t="s"><v>2</v></c><c r="C2" s="0" t="s"><v>3</v></c><c r="D2" s="0" t="s" /></row>' +
        '<row r="3" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="1" t="s"><v>4</v></c><c r="B3" s="2" t="n"><v>1</v></c><c r="C3" s="2" t="n"><v>2</v></c><c r="D3" s="2" t="n"><v>3</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="3"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /><mergeCell ref="D1:D2" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="5" uniqueCount="5">' +
        '<si><t>a</t></si>' +
        '<si><t>a Total</t></si>' +
        '<si><t>a1</t></si>' +
        '<si><t>a2</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'a' },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: undefined },
            { area: 'column', columnIndex: 1, rowIndex: 0, _excelCellValue: 'a Total' },
            { },
            { area: 'column', columnIndex: 0, rowIndex: 1, _excelCellValue: 'a1' },
            { area: 'column', columnIndex: 1, rowIndex: 1, _excelCellValue: 'a2' },
            { area: 'column', columnIndex: 1, rowIndex: 0, _excelCellValue: undefined },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'A' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
            { area: 'data', columnIndex: 1, rowIndex: 0, _excelCellValue: 2 },
            { area: 'data', columnIndex: 2, rowIndex: 0, _excelCellValue: 3 },
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string" },
                    { area: 'column', dataField: 'col1', dataType: "string", expanded: true, showTotals: true },
                    { area: 'column', dataField: 'col2', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number" }
                ],
                store: [
                    { row1: 'A', col1: 'a', col2: 'a1' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Export [string/string x string x number]", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="1" topLeftCell="C2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="2" t="n" /><c r="C1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>1</v></c><c r="B2" s="1" t="s"><v>2</v></c><c r="C2" s="2" t="n"><v>1</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="1" t="s" /><c r="B3" s="1" t="s"><v>3</v></c><c r="C3" s="2" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:B1" /><mergeCell ref="A2:A3" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>A1</t></si>' +
        '<si><t>A2</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'a' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'A' },
            { area: 'row', columnIndex: 1, rowIndex: 0, _excelCellValue: 'A1' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: undefined },
            { area: 'row', columnIndex: 0, rowIndex: 1, _excelCellValue: 'A2' },
            { area: 'data', columnIndex: 0, rowIndex: 1, _excelCellValue: 2 },
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string", expanded: true, showTotals: false },
                    { area: 'row', dataField: 'row2' },
                    { area: 'column', dataField: 'col1', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number" }
                ],
                store: [
                    { row1: 'A', row2: 'A1', col1: 'a' },
                    { row1: 'A', row2: 'A2', col1: 'a' },
                    { row1: 'A', row2: 'A2', col1: 'a' },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Export [string/string x string x number] with row totals", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="1" topLeftCell="C2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="2" t="n" /><c r="C1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>1</v></c><c r="B2" s="1" t="s"><v>2</v></c><c r="C2" s="2" t="n"><v>1</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="1" t="s" /><c r="B3" s="1" t="s"><v>3</v></c><c r="C3" s="2" t="n"><v>2</v></c></row>' +
        '<row r="4" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" s="1" t="s"><v>4</v></c><c r="B4" s="1" t="s" /><c r="C4" s="2" t="n"><v>3</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="3"><mergeCell ref="A1:B1" /><mergeCell ref="A2:A3" /><mergeCell ref="A4:B4" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="5" uniqueCount="5">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>A1</t></si>' +
        '<si><t>A2</t></si>' +
        '<si><t>A Total</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'a' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'A' },
            { area: 'row', columnIndex: 1, rowIndex: 0, _excelCellValue: 'A1' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: undefined },
            { area: 'row', columnIndex: 0, rowIndex: 1, _excelCellValue: 'A2' },
            { area: 'data', columnIndex: 0, rowIndex: 1, _excelCellValue: 2 },
            { area: 'row', columnIndex: 0, rowIndex: 2, _excelCellValue: 'A Total' },
            { area: 'row', columnIndex: 0, rowIndex: 2, _excelCellValue: undefined },
            { area: 'data', columnIndex: 0, rowIndex: 2, _excelCellValue: 3 },
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string", expanded: true, showTotals: true },
                    { area: 'row', dataField: 'row2' },
                    { area: 'column', dataField: 'col1', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number" }
                ],
                store: [
                    { row1: 'A', row2: 'A1', col1: 'a' },
                    { row1: 'A', row2: 'A2', col1: 'a' },
                    { row1: 'A', row2: 'A2', col1: 'a' },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Export [string x string x number,number] with 'dataFieldArea:column'", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c><c r="C1" s="0" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="2" t="n" /><c r="B2" s="0" t="s"><v>1</v></c><c r="C2" s="0" t="s"><v>2</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="1" t="s"><v>3</v></c><c r="B3" s="2" t="n"><v>1</v></c><c r="C3" s="2" t="n"><v>42</v></c></row>' +
        '</sheetData><mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>Count</t></si>' +
        '<si><t>Data1 (Sum)</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'a' },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: undefined },
            { area: undefined, columnIndex: undefined, rowIndex: undefined, _excelCellValue: undefined },
            { area: 'column', columnIndex: 0, rowIndex: 1, _excelCellValue: 'Count' },
            { area: 'column', columnIndex: 1, rowIndex: 1, _excelCellValue: 'Data1 (Sum)' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'A' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
            { area: 'data', columnIndex: 1, rowIndex: 0, _excelCellValue: 42 }
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataFieldArea: 'column',
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string" },
                    { area: 'column', dataField: 'col1', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number" },
                    { area: 'data', dataField: 'data1', summaryType: 'sum', dataType: "number" }
                ],
                store: [
                    { row1: 'A', col1: 'a', data1: 42 },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Export [string x string x number,number] with 'dataFieldArea:row'", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="0" t="s" /><c r="B1" s="0" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="1" t="s"><v>1</v></c><c r="B2" s="2" t="n"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';
    const getExpectedCells = () => {
        return [
            { },
            { area: 'column', columnIndex: 0, rowIndex: 0, _excelCellValue: 'a' },
            { area: 'row', columnIndex: 0, rowIndex: 0, _excelCellValue: 'A' },
            { area: 'data', columnIndex: 0, rowIndex: 0, _excelCellValue: 1 },
        ];
    };

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataFieldArea: 'row',
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string" },
                    { area: 'column', dataField: 'col1', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number", caption: 'count1' },
                    { area: 'data', summaryType: 'count', dataType: "number", caption: 'count2' }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            },
        },
        { getExpectedCells, styles, worksheet, sharedStrings }
    );
});

QUnit.test("Check customizeExcelCell(e.component)", function(assert) {
    let customizeExcelCellComponent;
    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            export: {
                customizeExcelCell: e => {
                    customizeExcelCellComponent = e.component;
                }
            },
            onFileSaving: (e) => {
                assert.ok(isDefined(e.component), 'isDefined(e.component)');
                assert.ok(e.component === customizeExcelCellComponent, 'e.component === customizeExcelCellComponent');
            }
        }
    );
});

QUnit.test("Set customizeExcelCell(e.wrapTextEnabled: true) for column area cells", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="4">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="1" horizontal="center" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="0" t="s" />' +
        '<c r="B1" s="3" t="s"><v>0</v></c>' +
        '</row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="1" t="s"><v>1</v></c>' +
        '<c r="B2" s="2" t="n"><v>1</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';

    helper.runTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: "string" },
                    { area: 'column', dataField: 'col1', dataType: "string" },
                    { area: 'data', summaryType: 'count', dataType: "number" }
                ],
                store: [
                    { row1: 'row1', col1: 'col1' }
                ]
            },
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    if(e.gridCell.area === 'column') {
                        e.wrapTextEnabled = true;
                    }
                },
            },
        },
        { styles, worksheet }
    );
});

QUnit.test("PivotGrid.wordWrapEnabled: true is not exported into Excel file", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="3">' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="0" t="s" />' +
        '<c r="B1" s="0" t="s"><v>0</v></c>' +
        '</row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="1" t="s"><v>1</v></c>' +
        '<c r="B2" s="2" t="s"><v>2</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';

    helper.runTest(
        assert,
        {
            wordWrapEnabled: true,
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1' },
                    { area: 'column', dataField: 'col1' },
                    { area: 'data', summaryType: 'count' }
                ],
                store: [
                    { row1: 'row1', col1: 'col1' }
                ]
            },
            export: {
                enabled: true,
                ignoreExcelErrors: false,
            },
        },
        { styles, worksheet }
    );
});
