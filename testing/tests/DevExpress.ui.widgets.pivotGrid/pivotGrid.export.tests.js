import $ from 'jquery';
import helper from '../../helpers/pivotGridExportTestsHelper.js';
import JSZipMock from '../../helpers/jszipMock.js';
import excel_creator from 'exporter/excel_creator';

QUnit.testStart(function() {
    const markup = '<div id="pivotGrid" style="width: 700px"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('PivotGrid export tests', {
    beforeEach: helper.beforeEachTest,
    afterEach: helper.afterEachTest,
});

QUnit.test('Export empty pivot', function(assert) {
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

    helper.runGeneralTest(assert, {}, { styles, worksheet, sharedStrings });
});

QUnit.test('Export with async jsZip', function(assert) {
    const expectedData = { isZipData: true };
    class AsyncJSZipMock extends JSZipMock {
        constructor() {
            super();
            const promise = window.Promise ? new Promise(r => r(expectedData)) : $.Deferred().resolve(expectedData);
            this.generateAsync = () => promise;
        }
    }

    excel_creator.ExcelCreator.JSZip = AsyncJSZipMock;
    helper.runGeneralTest(assert, {}, { data: { isZipData: true } });
});

QUnit.test('Check header/data/total cell style/data type', function(assert) { // column headers, row headers, showColumnGrandTotals, showRowGrandTotals, column totals, row totals
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
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="2" topLeftCell="C3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="0" t="s" /><c r="B1" s="2" t="n" /><c r="C1" s="0" t="s" /><c r="D1" s="0" t="s" /><c r="E1" s="0" t="s" />' +
        '</row>' +
        '<row r="2" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="2" t="n" /><c r="B2" s="2" t="n" /><c r="C2" s="0" t="s" /><c r="D2" s="0" t="s" /><c r="E2" s="0" t="s" />' +
        '</row>' +
        '<row r="3" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A3" s="1" t="s" /><c r="B3" s="1" t="s" /><c r="C3" s="2" t="n" /><c r="D3" s="2" t="n" /><c r="E3" s="2" t="n" />' +
        '</row>' +
        '<row r="4" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A4" s="1" t="s" /><c r="B4" s="1" t="s" /><c r="C4" s="2" t="n" /><c r="D4" s="2" t="n" /><c r="E4" s="2" t="n" />' +
        '</row>' +
        '<row r="5" spans="1:5" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A5" s="1" t="s" /><c r="B5" s="1" t="s" /><c r="C5" s="2" t="n" /><c r="D5" s="2" t="n" /><c r="E5" s="2" t="n" />' +
        '</row>' +
        '</sheetData>' +
        '<mergeCells count="5"><mergeCell ref="A1:B2" /><mergeCell ref="D1:D2" /><mergeCell ref="E1:E2" /><mergeCell ref="A4:B4" /><mergeCell ref="A5:B5" /></mergeCells>' +
        '</worksheet>';

    helper.runGeneralTest(assert,
        {
            showColumnGrandTotals: true,
            showRowGrandTotals: true,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: true },
                    { area: 'row', dataField: 'row2' },
                    { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: true },
                    { area: 'column', dataField: 'col2', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', row2: 'A1', col1: 'a', col2: 'a1' },
                ]
            },
            export: { customizeExcelCell: e => e.value = undefined }
        },
        { styles, worksheet });
});

QUnit.test('Export [string x string x number]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="n"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string x string x number] & showColumnGrandTotals', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="n"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: true,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string x string x number] with row grand totals', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="n"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>Grand Total</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: true,
            dataSource: {
                fields: [
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string x string x number] with \'format: currency\'', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1"><numFmt numFmtId="165" formatCode="$#,##0_);\\($#,##0\\)" /></numFmts>' +
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

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number', format: 'currency' }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                ]
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Export [string x string x number,number] with \'dataFieldArea:column\'', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="n" /><c r="B2" t="s"><v>1</v></c><c r="C2" t="s"><v>2</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>3</v></c><c r="B3" t="n"><v>1</v></c><c r="C3" t="n"><v>42</v></c></row>' +
        '</sheetData><mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>Count</t></si>' +
        '<si><t>Data1 (Sum)</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataFieldArea: 'column',
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' },
                    { area: 'data', dataField: 'data1', summaryType: 'sum', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a', data1: 42 },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string x string x number,number] with \'dataFieldArea:row\'', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="1" topLeftCell="C2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="n" /><c r="C1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="s"><v>2</v></c><c r="C2" t="n"><v>1</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s" /><c r="B3" t="s"><v>3</v></c><c r="C3" t="n"><v>42</v></c></row>' +
        '</sheetData><mergeCells count="2"><mergeCell ref="A1:B1" /><mergeCell ref="A2:A3" /></mergeCells></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>Count</t></si>' +
        '<si><t>Data1 (Sum)</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataFieldArea: 'row',
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' },
                    { area: 'data', dataField: 'data1', summaryType: 'sum', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a', data1: 42 },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string x string/string(a1,a2) x None]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s" /><c r="B2" t="s"><v>1</v></c><c r="C2" t="s"><v>2</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>3</v></c><c r="B3" t="s" /><c r="C3" t="s" /></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>a1</t></si>' +
        '<si><t>a2</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'column', dataField: 'col2', dataType: 'string' },
                ],
                store: [
                    { row1: 'A', col1: 'a', col2: 'a1' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string x string/string(a1,a2) x number]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="n" /><c r="B2" t="s"><v>1</v></c><c r="C2" t="s"><v>2</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>3</v></c><c r="B3" t="n"><v>1</v></c><c r="C3" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>a1</t></si>' +
        '<si><t>a2</t></si>' +
        '<si><t>A</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'column', dataField: 'col2', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a', col2: 'a1' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string x string/string(a1,a2) x number] with column totals', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s" /><c r="D1" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="n" /><c r="B2" t="s"><v>2</v></c><c r="C2" t="s"><v>3</v></c><c r="D2" t="s" /></row>' +
        '<row r="3" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>4</v></c><c r="B3" t="n"><v>1</v></c><c r="C3" t="n"><v>2</v></c><c r="D3" t="n"><v>3</v></c></row>' +
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

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: true },
                    { area: 'column', dataField: 'col2', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a', col2: 'a1' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string/string(A1,A2) x string x None]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="1" topLeftCell="C2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s" /><c r="C1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="s"><v>2</v></c><c r="C2" t="s" /></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s" /><c r="B3" t="s"><v>3</v></c><c r="C3" t="s" /></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:B1" /><mergeCell ref="A2:A3" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>A1</t></si>' +
        '<si><t>A2</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'row', dataField: 'row2' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                ],
                store: [
                    { row1: 'A', row2: 'A1', col1: 'a' },
                    { row1: 'A', row2: 'A2', col1: 'a' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string/string(A1,A2) x string x number]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="1" topLeftCell="C2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="n" /><c r="C1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="s"><v>2</v></c><c r="C2" t="n"><v>1</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s" /><c r="B3" t="s"><v>3</v></c><c r="C3" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:B1" /><mergeCell ref="A2:A3" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>A1</t></si>' +
        '<si><t>A2</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'row', dataField: 'row2' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', row2: 'A1', col1: 'a' },
                    { row1: 'A', row2: 'A2', col1: 'a' },
                    { row1: 'A', row2: 'A2', col1: 'a' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string/string(A1,A2) x string x number] with row totals', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="1" topLeftCell="C2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="n" /><c r="C1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="s"><v>2</v></c><c r="C2" t="n"><v>1</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s" /><c r="B3" t="s"><v>3</v></c><c r="C3" t="n"><v>2</v></c></row>' +
        '<row r="4" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" t="s"><v>4</v></c><c r="B4" t="s" /><c r="C4" t="n"><v>3</v></c></row>' +
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

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: true },
                    { area: 'row', dataField: 'row2' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', row2: 'A1', col1: 'a' },
                    { row1: 'A', row2: 'A2', col1: 'a' },
                    { row1: 'A', row2: 'A2', col1: 'a' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string/string(A1,A2) x string/string(a1,a2) x None]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="2" topLeftCell="C3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s" /><c r="C1" t="s"><v>0</v></c><c r="D1" t="s" /></row>' +
        '<row r="2" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s" /><c r="B2" t="s" /><c r="C2" t="s"><v>1</v></c><c r="D2" t="s"><v>2</v></c></row>' +
        '<row r="3" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>3</v></c><c r="B3" t="s"><v>4</v></c><c r="C3" t="s" /><c r="D3" t="s" /></row>' +
        '<row r="4" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" t="s" /><c r="B4" t="s"><v>5</v></c><c r="C4" t="s" /><c r="D4" t="s" /></row>' +
        '</sheetData>' +
        '<mergeCells count="3"><mergeCell ref="A1:B2" /><mergeCell ref="C1:D1" /><mergeCell ref="A3:A4" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="6" uniqueCount="6">' +
        '<si><t>a</t></si>' +
        '<si><t>a1</t></si>' +
        '<si><t>a2</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>A1</t></si>' +
        '<si><t>A2</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'row', dataField: 'row2' },
                    { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'column', dataField: 'col2' },
                ],
                store: [
                    { row1: 'A', row2: 'A1', col1: 'a', col2: 'a1' },
                    { row1: 'A', row2: 'A2', col1: 'a', col2: 'a2' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string/string(A1,A2) x string/string(a1,a2) x Number]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="2" ySplit="2" topLeftCell="C3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="n" /><c r="C1" t="s"><v>0</v></c><c r="D1" t="s" /></row>' +
        '<row r="2" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="n" /><c r="B2" t="n" /><c r="C2" t="s"><v>1</v></c><c r="D2" t="s"><v>2</v></c></row>' +
        '<row r="3" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>3</v></c><c r="B3" t="s"><v>4</v></c><c r="C3" t="n"><v>1</v></c><c r="D3" t="n" /></row>' +
        '<row r="4" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" t="s" /><c r="B4" t="s"><v>5</v></c><c r="C4" t="n" /><c r="D4" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count="3"><mergeCell ref="A1:B2" /><mergeCell ref="C1:D1" /><mergeCell ref="A3:A4" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="6" uniqueCount="6">' +
        '<si><t>a</t></si>' +
        '<si><t>a1</t></si>' +
        '<si><t>a2</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>A1</t></si>' +
        '<si><t>A2</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'row', dataField: 'row2' },
                    { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'column', dataField: 'col2' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', row2: 'A1', col1: 'a', col2: 'a1' },
                    { row1: 'A', row2: 'A2', col1: 'a', col2: 'a2' },
                    { row1: 'A', row2: 'A2', col1: 'a', col2: 'a2' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x None x None]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s" /></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>0</v></c><c r="B2" t="s" /></row>' +
        '<row r="3" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>1</v></c><c r="B3" t="s" /></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1' },
                ],
                store: [
                    { row1: 'A' }, { row1: 'B' }
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x None x None] & showColumnGrandTotals', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="s" /></row>' +
        '<row r="3" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>2</v></c><c r="B3" t="s" /></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: true,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1' },
                ],
                store: [
                    { row1: 'A' }, { row1: 'B' }
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x None x number]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s" /></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>0</v></c><c r="B2" t="n" /></row>' +
        '<row r="3" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>1</v></c><c r="B3" t="n" /></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A' },
                    { row1: 'B' },
                    { row1: 'B' }
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x None x number] & showColumnGrandTotals', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="n"><v>1</v></c></row>' +
        '<row r="3" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>2</v></c><c r="B3" t="n"><v>2</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: true,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A' },
                    { row1: 'B' },
                    { row1: 'B' }
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x string x None]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="s" /></row>' +
        '<row r="3" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>2</v></c><c r="B3" t="s" /></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1' },
                    { area: 'column', dataField: 'col1' },
                ],
                store: [
                    { row1: 'A', col1: 'a' }, { row1: 'B', col1: 'a' }
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x string x number]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>1</v></c><c r="B2" t="n"><v>1</v></c></row>' +
        '<row r="3" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>2</v></c><c r="B3" t="n"><v>2</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>a</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1' },
                    { area: 'column', dataField: 'col1' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                    { row1: 'B', col1: 'a' },
                    { row1: 'B', col1: 'a' }
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x string(a,b) x None]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>2</v></c><c r="B2" t="s" /><c r="C2" t="s" /></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>3</v></c><c r="B3" t="s" /><c r="C3" t="s" /></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>b</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1' },
                    { area: 'column', dataField: 'col1' },
                ],
                store: [
                    { row1: 'A', col1: 'a' }, { row1: 'B', col1: 'b' }
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x string(a,b) x number]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s"><v>2</v></c><c r="B2" t="n"><v>1</v></c><c r="C2" t="n" /></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>3</v></c><c r="B3" t="n" /><c r="C3" t="n"><v>2</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>b</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1' },
                    { area: 'column', dataField: 'col1' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a' },
                    { row1: 'B', col1: 'b' },
                    { row1: 'B', col1: 'b' }
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x string/string(a1,a2) x None]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s" /><c r="B2" t="s"><v>1</v></c><c r="C2" t="s"><v>2</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>3</v></c><c r="B3" t="s" /><c r="C3" t="s" /></row>' +
        '<row r="4" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" t="s"><v>4</v></c><c r="B4" t="s" /><c r="C4" t="s" /></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="5" uniqueCount="5">' +
        '<si><t>a</t></si>' +
        '<si><t>a1</t></si>' +
        '<si><t>a2</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'column', dataField: 'col2', dataType: 'string' },
                ],
                store: [
                    { row1: 'A', col1: 'a', col2: 'a1' },
                    { row1: 'A', col1: 'a', col2: 'a2' },
                    { row1: 'B', col1: 'a', col2: 'a1' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x string/string(a1,a2) x None] & showColumnGrandTotals', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s" /><c r="D1" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="s" /><c r="B2" t="s"><v>2</v></c><c r="C2" t="s"><v>3</v></c><c r="D2" t="s" /></row>' +
        '<row r="3" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>4</v></c><c r="B3" t="s" /><c r="C3" t="s" /><c r="D3" t="s" /></row>' +
        '<row r="4" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" t="s"><v>5</v></c><c r="B4" t="s" /><c r="C4" t="s" /><c r="D4" t="s" /></row>' +
        '</sheetData>' +
        '<mergeCells count="3"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /><mergeCell ref="D1:D2" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="6" uniqueCount="6">' +
        '<si><t>a</t></si>' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>a1</t></si>' +
        '<si><t>a2</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: true,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'column', dataField: 'col2', dataType: 'string' },
                ],
                store: [
                    { row1: 'A', col1: 'a', col2: 'a1' },
                    { row1: 'B', col1: 'a', col2: 'a2' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export [string(A,B) x string/string(a1,a2) x Number]', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="2" topLeftCell="B3" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s" /></row>' +
        '<row r="2" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" t="n" /><c r="B2" t="s"><v>1</v></c><c r="C2" t="s"><v>2</v></c></row>' +
        '<row r="3" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" t="s"><v>3</v></c><c r="B3" t="n" /><c r="C3" t="n"><v>1</v></c></row>' +
        '<row r="4" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A4" t="s"><v>4</v></c><c r="B4" t="n"><v>2</v></c><c r="C4" t="n" /></row>' +
        '</sheetData>' +
        '<mergeCells count="2"><mergeCell ref="A1:A2" /><mergeCell ref="B1:C1" /></mergeCells>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="5" uniqueCount="5">' +
        '<si><t>a</t></si>' +
        '<si><t>a1</t></si>' +
        '<si><t>a2</t></si>' +
        '<si><t>A</t></si>' +
        '<si><t>B</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string', expanded: true, showTotals: false },
                    { area: 'column', dataField: 'col2', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [
                    { row1: 'A', col1: 'a', col2: 'a2' },
                    { row1: 'B', col1: 'a', col2: 'a1' },
                    { row1: 'B', col1: 'a', col2: 'a1' },
                ]
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Export with \'PivotGrid.wordWrapEnabled: true\'', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" t="s" />' +
        '<c r="B1" t="s"><v>0</v></c>' +
        '</row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" t="s"><v>1</v></c>' +
        '<c r="B2" t="s"><v>2</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
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
        },
        { worksheet }
    );
});

QUnit.test('Export with \'PivotGrid.dataSource.fields.wordWrapEnabled: true\'', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="1" topLeftCell="B2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" t="s" />' +
        '<c r="B1" t="s"><v>0</v></c>' +
        '</row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" t="s"><v>1</v></c>' +
        '<c r="B2" t="s"><v>2</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';

    helper.runGeneralTest(
        assert,
        {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            dataSource: {
                fields: [
                    { area: 'row', dataField: 'row1', wordWrapEnabled: true },
                    { area: 'column', dataField: 'col1', wordWrapEnabled: true },
                    { area: 'data', summaryType: 'count', wordWrapEnabled: true }
                ],
                store: [
                    { row1: 'row1', col1: 'col1' }
                ]
            },
        },
        { worksheet }
    );
});

[false, true].forEach(customizeYearGroupField => {
    QUnit.test(`Export [string x date x number], customizeYearGroupField: ${customizeYearGroupField}`, function(assert) {
        const worksheet = helper.WORKSHEET_HEADER_XML +
            '<sheetPr/><dimension ref="A1:C1"/>' +
            '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" xSplit="1" ySplit="3" topLeftCell="B4" /></sheetView></sheetViews>' +
            '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
            '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /></cols>' +
            '<sheetData>' +
            '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25">' +
            '<c r="A1" t="s" /><c r="B1" t="s"><v>0</v></c><c r="C1" t="s" /><c r="D1" t="s"><v>1</v></c>' +
            '</row>' +
            '<row r="2" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25">' +
            '<c r="A2" t="n" /><c r="B2" t="s"><v>2</v></c><c r="C2" t="s"><v>3</v></c><c r="D2" t="s" />' +
            '</row>' +
            '<row r="3" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25">' +
            '<c r="A3" t="n" /><c r="B3" t="s"><v>4</v></c><c r="C3" t="s" /><c r="D3" t="s" />' +
            '</row>' +
            '<row r="4" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25">' +
            '<c r="A4" t="s"><v>5</v></c><c r="B4" t="n"><v>1</v></c><c r="C4" t="n"><v>1</v></c><c r="D4" t="n"><v>1</v></c>' +
            '</row>' +
            '</sheetData>' +
            '<mergeCells count="4"><mergeCell ref="A1:A3" /><mergeCell ref="B1:C1" /><mergeCell ref="D1:D3" /><mergeCell ref="C2:C3" /></mergeCells>' +
            '</worksheet>';
        const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="6" uniqueCount="6">' +
            '<si><t>2019</t></si>' +
            '<si><t>2019 Total</t></si>' +
            '<si><t>Q1</t></si>' +
            '<si><t>Q1 Total</t></si>' +
            '<si><t>February</t></si>' +
            '<si><t>A</t></si>' +
            '</sst>';
        const dataSourceFields = [
            { area: 'row', dataField: 'row1', dataType: 'string' },
            { area: 'column', dataField: 'col1', dataType: 'date' },
            { area: 'data', summaryType: 'count', dataType: 'number' }
        ];

        if(customizeYearGroupField) {
            dataSourceFields.push({ groupName: 'col1', groupInterval: 'year', dataType: 'date', dataField: 'col1' });
        }

        helper.runGeneralTest(
            assert,
            {
                showColumnGrandTotals: false,
                showRowGrandTotals: false,
                dataSource: {
                    fields: dataSourceFields,
                    store: [
                        { row1: 'A', col1: new Date(2019, 1, 21) },
                    ]
                },
                onInitialized: (e) => {
                    e.component.getDataSource().expandAll('col1');
                },
                export: {
                    enabled: true
                }
            },
            { worksheet, sharedStrings }
        );
    });
});
