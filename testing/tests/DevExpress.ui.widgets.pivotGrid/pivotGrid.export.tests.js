QUnit.testStart(function() {
    var markup = '<div id="pivotGrid" style="width: 700px"></div>';
    $("#qunit-fixture").html(markup);
});

require("spa.css!");

require("common.css!");
require("generic_light.css!");

require("ui/pivot_grid/ui.pivot_grid");

var $ = require("jquery"),
    internals = require("client_exporter").excel.__internals,
    SHARED_STRINGS_HEADER_XML = internals.XML_TAG + '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"',
    STYLESHEET_HEADER_XML = internals.XML_TAG + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    STYLESHEET_FOOTER_XML = '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0" /></cellStyles></styleSheet>';

function testConfiguration(assert, options, { styles = "", worksheet = "", sharedStrings = "" } = {}) {
    const done = assert.async(3);
    options.loadingTimeout = undefined;
    options.onFileSaving = e => {
        e._zip.folder(internals.XL_FOLDER_NAME).file(internals.STYLE_FILE_NAME).async("string").then(content => {
            assert.strictEqual(content, styles, "styles");
            done();
        });
        e._zip.folder(internals.XL_FOLDER_NAME).folder(internals.WORKSHEETS_FOLDER).file(internals.WORKSHEET_FILE_NAME).async("string").then(content => {
            assert.strictEqual(content, worksheet, "worksheet");
            done();
        });
        e._zip.folder(internals.XL_FOLDER_NAME).file(internals.SHAREDSTRING_FILE_NAME).async("string").then(content => {
            assert.strictEqual(content, sharedStrings, "sharedStrings");
            done();
        });

        // TODO: $.when([deferred1, deferred2, deferred3, deferred4]).done(done); - avoid async, use another event
        e.cancel = true;
    };
    const pivot = $("#pivotGrid").dxPivotGrid(options).dxPivotGrid('instance');
    pivot.exportToExcel();
};

QUnit.test("Empty pivot", function(assert) {
    const styles = STYLESHEET_HEADER_XML +
        '<numFmts count=\"0\"></numFmts>' +
        internals.BASE_STYLE_XML +
        '<cellXfs count=\"3\">' +
        '<xf xfId=\"0\" applyAlignment=\"1\" fontId=\"0\" applyNumberFormat=\"0\" numFmtId=\"0\"><alignment vertical=\"top\" wrapText=\"0\" horizontal=\"center\" /></xf>' +
        '<xf xfId=\"0\" applyAlignment=\"1\" fontId=\"0\" applyNumberFormat=\"0\" numFmtId=\"0\"><alignment vertical=\"top\" wrapText=\"0\" horizontal=\"left\" /></xf>' +
        '<xf xfId=\"0\" applyAlignment=\"1\" fontId=\"0\" applyNumberFormat=\"0\" numFmtId=\"0\"><alignment vertical=\"top\" wrapText=\"0\" horizontal=\"right\" /></xf>' +
        '</cellXfs>' +
        STYLESHEET_FOOTER_XML;
    const worksheet = internals.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane=\"bottomLeft\" state=\"frozen\" xSplit=\"1\" ySplit=\"1\" topLeftCell=\"B2\" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width=\"13.57\" min=\"1\" max=\"1\" /><col width=\"13.57\" min=\"2\" max=\"2\" /></cols>' +
        '<sheetData>' +
        '<row r=\"1\" spans=\"1:2\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A1\" s=\"0\" t=\"s\" /><c r=\"B1\" s=\"0\" t=\"s\"><v>0</v></c></row>' +
        '<row r=\"2\" spans=\"1:2\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A2\" s=\"1\" t=\"s\"><v>0</v></c><c r=\"B2\" s=\"2\" t=\"s\" /></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Grand Total</t></si>' +
        '</sst>';

    testConfiguration(assert, {}, { styles, worksheet, sharedStrings });
});

QUnit.test("Rows: string, Columns: string, Data: sum as currency", function(assert) {
    const styles = STYLESHEET_HEADER_XML +
        '<numFmts count="1"><numFmt numFmtId="165" formatCode="$#,##0_);\\($#,##0\\)" /></numFmts>' +
        internals.BASE_STYLE_XML +
        '<cellXfs count=\"3\">' +
        '<xf xfId=\"0\" applyAlignment=\"1\" fontId=\"0\" applyNumberFormat=\"0\" numFmtId=\"0\"><alignment vertical=\"top\" wrapText=\"0\" horizontal=\"center\" /></xf>' +
        '<xf xfId=\"0\" applyAlignment=\"1\" fontId=\"0\" applyNumberFormat=\"0\" numFmtId=\"0\"><alignment vertical=\"top\" wrapText=\"0\" horizontal=\"left\" /></xf>' +
        '<xf xfId=\"0\" applyAlignment=\"1\" fontId=\"0\" applyNumberFormat=\"1\" numFmtId=\"165\"><alignment vertical=\"top\" wrapText=\"0\" horizontal=\"right\" /></xf>' +
        '</cellXfs>' +
        STYLESHEET_FOOTER_XML;
    const worksheet = internals.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane=\"bottomLeft\" state=\"frozen\" xSplit=\"1\" ySplit=\"1\" topLeftCell=\"B2\" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width=\"13.57\" min=\"1\" max=\"1\" />' +
        '<col width=\"13.57\" min=\"2\" max=\"2\" />' +
        '<col width=\"13.57\" min=\"3\" max=\"3\" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r=\"1\" spans=\"1:3\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A1\" s=\"0\" t=\"s\" /><c r=\"B1\" s=\"0\" t=\"s\"><v>0</v></c><c r=\"C1\" s=\"0\" t=\"s\"><v>1</v></c></row>' +
        '<row r=\"2\" spans=\"1:3\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A2\" s=\"1\" t=\"s\"><v>2</v></c><c r=\"B2\" s=\"2\" t=\"n\"><v>42</v></c><c r=\"C2\" s=\"2\" t=\"n\"><v>42</v></c></row>' +
        '<row r=\"3\" spans=\"1:3\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A3\" s=\"1\" t=\"s\"><v>1</v></c><c r=\"B3\" s=\"2\" t=\"n\"><v>42</v></c><c r=\"C3\" s=\"2\" t=\"n\"><v>42</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C3" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>str2</t></si>' +
        '<si><t>Grand Total</t></si>' +
        '<si><t>str1</t></si>' +
        '</sst>';

    testConfiguration(
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
        '<numFmts count=\"0\"></numFmts>' +
        internals.BASE_STYLE_XML +
        '<cellXfs count=\"3\">' +
        '<xf xfId=\"0\" applyAlignment=\"1\" fontId=\"0\" applyNumberFormat=\"0\" numFmtId=\"0\"><alignment vertical=\"top\" wrapText=\"0\" horizontal=\"center\" /></xf>' +
        '<xf xfId=\"0\" applyAlignment=\"1\" fontId=\"0\" applyNumberFormat=\"0\" numFmtId=\"0\"><alignment vertical=\"top\" wrapText=\"0\" horizontal=\"left\" /></xf>' +
        '<xf xfId=\"0\" applyAlignment=\"1\" fontId=\"0\" applyNumberFormat=\"0\" numFmtId=\"0\"><alignment vertical=\"top\" wrapText=\"0\" horizontal=\"right\" /></xf>' +
        '</cellXfs>' +
        STYLESHEET_FOOTER_XML;
    const worksheet = internals.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane=\"bottomLeft\" state=\"frozen\" xSplit=\"2\" ySplit=\"2\" topLeftCell=\"C3\" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols>' +
        '<col width=\"13.57\" min=\"1\" max=\"1\" />' +
        '<col width=\"13.57\" min=\"2\" max=\"2\" />' +
        '<col width=\"13.57\" min=\"3\" max=\"3\" />' +
        '<col width=\"13.57\" min=\"4\" max=\"4\" />' +
        '<col width=\"13.57\" min=\"5\" max=\"5\" />' +
        '</cols>' +
        '<sheetData>' +
        '<row r=\"1\" spans=\"1:5\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A1\" s=\"0\" t=\"s\" /><c r=\"B1\" s=\"2\" t=\"s\" /><c r=\"C1\" s=\"0\" t=\"s\"><v>0</v></c><c r=\"D1\" s=\"0\" t=\"s\"><v>1</v></c><c r=\"E1\" s=\"0\" t=\"s\"><v>2</v></c></row>' +
        '<row r=\"2\" spans=\"1:5\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A2\" s=\"2\" t=\"s\" /><c r=\"B2\" s=\"2\" t=\"s\" /><c r=\"C2\" s=\"0\" t=\"s\"><v>3</v></c><c r=\"D2\" s=\"0\" t=\"s\" /><c r=\"E2\" s=\"0\" t=\"s\" /></row>' +
        '<row r=\"3\" spans=\"1:5\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A3\" s=\"1\" t=\"s\"><v>4</v></c><c r=\"B3\" s=\"1\" t=\"s\"><v>5</v></c><c r=\"C3\" s=\"2\" t=\"s\"><v>6</v></c><c r=\"D3\" s=\"2\" t=\"s\"><v>6</v></c><c r=\"E3\" s=\"2\" t=\"s\"><v>6</v></c></row>' +
        '<row r=\"4\" spans=\"1:5\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A4\" s=\"1\" t=\"s\"><v>7</v></c><c r=\"B4\" s=\"1\" t=\"s\" /><c r=\"C4\" s=\"2\" t=\"s\"><v>6</v></c><c r=\"D4\" s=\"2\" t=\"s\"><v>6</v></c><c r=\"E4\" s=\"2\" t=\"s\"><v>6</v></c></row>' +
        '<row r=\"5\" spans=\"1:5\" outlineLevel=\"0\" x14ac:dyDescent=\"0.25\"><c r=\"A5\" s=\"1\" t=\"s\"><v>2</v></c><c r=\"B5\" s=\"1\" t=\"s\" /><c r=\"C5\" s=\"2\" t=\"s\"><v>6</v></c><c r=\"D5\" s=\"2\" t=\"s\"><v>6</v></c><c r=\"E5\" s=\"2\" t=\"s\"><v>6</v></c></row>' +
        '</sheetData>' +
        '<mergeCells count=\"5\"><mergeCell ref=\"A1:B2\" /><mergeCell ref=\"D1:D2\" /><mergeCell ref=\"E1:E2\" /><mergeCell ref=\"A4:B4\" /><mergeCell ref=\"A5:B5\" /></mergeCells>' +
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

    testConfiguration(
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
