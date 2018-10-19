import $ from "jquery";
import helper from '../../helpers/dataGridExportTestsHelper.js';

QUnit.testStart(function() {
    var markup = '<div id="dataGrid"></div>';
    $("#qunit-fixture").html(markup);
});

QUnit.module("DataGrid customizeExcelCell tests", {
    beforeEach: helper.beforeEachTest,
    afterEach: helper.afterEachTest,
});

QUnit.test("Change horizontal alignment", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="7">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" fontId="1" applyNumberFormat="0" numFmtId="0" />' +
        '<xf xfId="0" fontId="0" applyNumberFormat="0" numFmtId="0" />' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane activePane="bottomLeft" state="frozen" ySplit="1" topLeftCell="A2" /></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="s"><v>0</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="6" t="s"><v>1</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>Field 1</t></si>' +
        '<si><t>str1_1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1" }],
            dataSource: [{ field1: 'str1_1' }],
            export: {
                enabled: true,
                customizeExcelCell: e => e.xlsxCell.style.alignment = null,
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change horizontal alignment by a property value of source object", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment horizontal="center" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>1</v></c><c r="B1" s="3" t="n"><v>1</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="n"><v>2</v></c><c r="B2" s="3" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: ['data1', 'data2'],
            dataSource: [
                { data1: 1, data2: 1, alignment: 'center' },
                { data1: 2, data2: 2, alignment: 'right' },
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                customizeExcelCell: e => {
                    if(e.gridCell.rowType === 'data' && e.gridCell.column.dataField === 'data1' && e.gridCell.value === 1 && e.gridCell.data.data1 === 1) {
                        e.xlsxCell.style.alignment = {
                            horizontal: e.gridCell.data.alignment
                        };
                    }
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change fill (simple format)", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML1 +
        '<fills count="3">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '<fill><patternFill patternType="Gray125" /></fill>' +
        '<fill><patternFill patternType="lightGrid"><fgColor rgb="FF00FF00" /><bgColor rgb="FFFFFF00" /></patternFill></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" fillId="2" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>42</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: ['field1'],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.style.backgroundColor = 'FFFFFF00';
                    e.xlsxCell.style.patternColor = 'FF00FF00';
                    e.xlsxCell.style.patternStyle = 'lightGrid';
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change fill (OOXML format)", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML1 +
        '<fills count="3">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '<fill><patternFill patternType="Gray125" /></fill>' +
        '<fill><patternFill patternType="darkVertical"><fgColor rgb="FF20FF60" /></patternFill></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" fillId="2" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>42</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1" }],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.style.fill = {
                        patternFill: {
                            patternType: 'darkVertical',
                            foregroundColor: {
                                rgb: 'FF20FF60'
                            }
                        }
                    };
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change fill by a property value of source object", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML1 +
        '<fills count="3">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '<fill><patternFill patternType="Gray125" /></fill>' +
        '<fill><patternFill patternType="darkVertical"><fgColor rgb="FF00FF00" /></patternFill></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" fillId="2" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>1</v></c><c r="B1" s="3" t="n"><v>1</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="n"><v>2</v></c><c r="B2" s="3" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: ['data1', 'data2'],
            dataSource: [
                { data1: 1, data2: 1, fillPattern: 'darkVertical', fillColor: 'FF00FF00' },
                { data1: 2, data2: 2, fillPattern: 'darkHorizontal', fillColor: 'FF0000FF' },
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                customizeExcelCell: e => {
                    if(e.gridCell.rowType === 'data' && e.gridCell.column.dataField === 'data1' && e.gridCell.value === 1 && e.gridCell.data.data1 === 1) {
                        e.xlsxCell.style.fill = {
                            patternFill: {
                                patternType: e.gridCell.data.fillPattern,
                                foregroundColor: {
                                    rgb: e.gridCell.data.fillColor
                                }
                            }
                        };
                    }
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change font", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<fonts count="3">' +
        '<font><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '<font><b /><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '<font><sz val="22" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '</fonts>' +
        '<fills count="1">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="2" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="s"><v>0</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>str1_1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "field1" }],
            dataSource: [{ field1: 'str1_1' }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                customizeExcelCell: e => e.xlsxCell.style.font.size = 22,
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change number format", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="3">' +
        '<numFmt numFmtId="165" formatCode="[$-9]M\\/d\\/yyyy" />' +
        '<numFmt numFmtId="166" formatCode="dd/mmm/yyyy hh:mm" />' +
        '<numFmt numFmtId="167" formatCode="#,##0.0000" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="11">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="4"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="22"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /><col width="13.57" min="6" max="6" /><col width="13.57" min="7" max="7" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:7" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="5" t="n"><v>43483.6875</v></c>' +
        '<c r="B1" s="6" t="n"><v>43484.6875</v></c>' +
        '<c r="C1" s="7" t="n"><v>43485.6875</v></c>' +
        '<c r="D1" s="8" t="n"><v>43486.6875</v></c>' +
        '<c r="E1" s="9" t="n"><v>43487.6875</v></c>' +
        '<c r="F1" s="10" t="n"><v>43488.6875</v></c>' +
        '<c r="G1" s="5" t="n"><v>43488.6875</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;
    const formats = [
        null, // General
        0, // General
        4, // #,##0.00
        22, // m/d/yy h:mm
        'dd/mmm/yyyy hh:mm',
        '#,##0.0000',
        { formatCode: 'not supported, assign string instead of object' }
    ];

    helper.runGeneralTest(
        assert,
        {
            columns: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7'],
            dataSource: [{
                f1: new Date(2019, 0, 18, 16, 30), // serialized as '43483.6875'
                f2: new Date(2019, 0, 19, 16, 30),
                f3: new Date(2019, 0, 20, 16, 30),
                f4: new Date(2019, 0, 21, 16, 30),
                f5: new Date(2019, 0, 22, 16, 30),
                f6: new Date(2019, 0, 23, 16, 30),
                f7: new Date(2019, 0, 23, 16, 30),
            }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.numberFormat = formats.shift();
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change number format for Number column to '0000', '0.00', '0.00E+00'", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="3">' +
        '<numFmt numFmtId="165" formatCode="0000" />' +
        '<numFmt numFmtId="166" formatCode="0.00" />' +
        '<numFmt numFmtId="167" formatCode="0.00E+00" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="8">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="167"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:3" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="5" t="n"><v>42</v></c><c r="B1" s="6" t="n"><v>43</v></c><c r="C1" s="7" t="n"><v>44</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    const columnFormats = { f1: '0000', f2: '0.00', f3: '0.00E+00' };
    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number' },
                { dataField: 'f2', dataType: 'number' },
                { dataField: 'f3', dataType: 'number' }
            ],
            dataSource: [
                { f1: 42, f2: 43, f3: 44 }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.numberFormat = columnFormats[e.gridCell.column.dataField];
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change number format for Number column when column.format is function", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1">' +
        '<numFmt numFmtId="165" formatCode="0000" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="5" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number', format: () => 'my_function' }],
            dataSource: [{
                f1: 42,
            }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.numberFormat = '0000';
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change number format for Number column cell", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="2">' +
        '<numFmt numFmtId="165" formatCode="#" />' +
        '<numFmt numFmtId="166" formatCode="0000" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="166"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="5" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: "f1", dataType: "number", format: "decimal" }],
            dataSource: [{ f1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.numberFormat = '0000';
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Change number format for Date column cell when column.format is function", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1">' +
        '<numFmt numFmtId="165" formatCode="dd/mmm/yyyy hh:mm" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="5" t="n"><v>43483</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'date', format: () => 'my_function' }],
            dataSource: [{
                f1: new Date(2019, 0, 18),
            }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.numberFormat = 'dd/mmm/yyyy hh:mm';
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Check event arguments for data row cell with various data types", function(assert) {
    const configurations = [
        { dataType: "number", values: [undefined, null, 0, 1] },
        { dataType: "string", values: [undefined, null, '', 's'] },
        { dataType: "date", values: [undefined, null, new Date(2018, 11, 1)] },
        { dataType: "datetime", values: [undefined, null, new Date(2018, 11, 1, 16, 10)] },
        { dataType: "boolean", values: [undefined, null, false, true] },
        {
            dataType: "lookup", values: [undefined, null, 1],
            lookup: {
                dataSource: {
                    store: { type: 'array', data: [{ id: 1, name: 'name1' }] },
                    key: 'id'
                },
                valueExpr: 'id',
                displayExpr: 'name'
            }
        },
    ];
    configurations.forEach(config => {
        const column = { dataField: 'f1', dataType: config.dataType, lookup: config.lookup },
            ds = config.values.map(item => { return { f1: item }; });

        helper.runCustomizeExcelCellTest(assert,
            {
                columns: [column],
                dataSource: ds,
                showColumnHeaders: false,
            },
            (grid) => {
                const result = [];
                for(let i = 0; i < config.values.length; i++) {
                    result.push({
                        rowType: 'data',
                        data: ds[i],
                        column: grid.columnOption(0),
                        value: config.values[i]
                    });
                }
                return result;
            }
        );
    });
});

QUnit.test("Check event arguments for data row cell with formatting", function(assert) {
    const ds = [{ f1: 1 }];
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [{ dataField: "f1", dataType: "number", format: "currency" }],
            dataSource: ds,
            showColumnHeaders: false,
        },
        (grid) => [
            { data: ds[0], column: grid.columnOption(0), rowType: 'data', value: ds[0].f1 },
        ]
    );
});

QUnit.test("Check event arguments for header", function(assert) {
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [{ dataField: "f1" }],
            dataSource: [],
        },
        (grid) => [
            { rowType: 'header', column: grid.columnOption(0) },
        ]
    );
});

QUnit.test("Check event arguments for bands", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2', f3: 'f3' }];
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [
                { dataField: "f1" },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: "f2" },
                        { dataField: "f3" },
                    ]
                }
            ],
            dataSource: ds,
        },
        (grid) => [
            { rowType: 'header', column: grid.columnOption(0) },
            { rowType: 'header', column: grid.columnOption(1) },
            { rowType: 'header', column: grid.columnOption(1) },
            { rowType: 'header', column: grid.columnOption(0) },
            { rowType: 'header', column: grid.columnOption(2) },
            { rowType: 'header', column: grid.columnOption(3) },
            { rowType: 'data', column: grid.columnOption(0), data: ds[0], value: ds[0].f1 },
            { rowType: 'data', column: grid.columnOption(2), data: ds[0], value: ds[0].f2 },
            { rowType: 'data', column: grid.columnOption(3), data: ds[0], value: ds[0].f3 },
        ]
    );
});

QUnit.test("Check event arguments for groupping 1 level", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2' }];
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2" },
            ],
            dataSource: ds,
        },
        (grid) => [
            { rowType: 'header', column: grid.columnOption(1) },
            { rowType: 'group', column: grid.columnOption(0) },
            { rowType: 'data', column: grid.columnOption(1), data: ds[0], value: ds[0].f2 },
        ]
    );
});

QUnit.test("Check event arguments for groupping 2 levels", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2', f3: 'f3' }];
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2", groupIndex: 1 },
                { dataField: "f3" },
            ],
            dataSource: ds,
        },
        (grid) => [
            { rowType: 'header', column: grid.columnOption(2) },
            { rowType: 'group', column: grid.columnOption(0) },
            { rowType: 'group', column: grid.columnOption(1) },
            { rowType: 'data', column: grid.columnOption(2), data: ds[0], value: ds[0].f3 },
        ]
    );
});

QUnit.test("Check event arguments for group summary", function(assert) {
    const ds = [{ f1: 'str1', f2: 1 }];
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2", },
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ column: 'f2', summaryType: 'sum' }]
            },
        },
        (grid) => [
            { rowType: 'header', column: grid.columnOption(1) },
            { rowType: 'group', column: grid.columnOption(0) },
            { rowType: 'data', column: grid.columnOption(1), data: ds[0], value: ds[0].f2 },
        ]
    );
});

QUnit.test("Check event arguments for group summary with alignByColumn", function(assert) {
    const ds = [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }];
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2", groupIndex: 1 },
                { dataField: "f3" },
                { dataField: "f4" },
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ column: 'f3', summaryType: 'count' }, { column: 'f4', summaryType: 'count', alignByColumn: true }]
            },
        },
        (grid) => [
            { column: grid.columnOption(2), rowType: 'header' },
            { column: grid.columnOption(3), rowType: 'header' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(1), rowType: 'group' },
            { column: grid.columnOption(1), rowType: 'group' },
            { column: grid.columnOption(2), rowType: 'data', data: ds[0], value: ds[0].f3 },
            { column: grid.columnOption(3), rowType: 'data', data: ds[0], value: ds[0].f4 },

        ]
    );
});

QUnit.test("Check event arguments for group summary with showInGroupFooter", function(assert) {
    const ds = [
        { f1: '1_f1', f2: '1_f2', f3: '1_f3', f4: '1_f4' },
        { f1: '2_f1', f2: '2_f2', f3: '2_f3', f4: '2_f4' }
    ];
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [
                { dataField: "f1", groupIndex: 0 },
                { dataField: "f2" },
                { dataField: "f3" },
                { dataField: "f4" },
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ column: 'f3', summaryType: 'count', showInGroupFooter: true }, { column: 'f4', summaryType: 'count', showInGroupFooter: true }]
            },
        },
        (grid) => [
            { column: grid.columnOption(1), rowType: 'header' },
            { column: grid.columnOption(2), rowType: 'header' },
            { column: grid.columnOption(3), rowType: 'header' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(1), rowType: 'data', data: ds[0], value: ds[0].f2 },
            { column: grid.columnOption(2), rowType: 'data', data: ds[0], value: ds[0].f3 },
            { column: grid.columnOption(3), rowType: 'data', data: ds[0], value: ds[0].f4 },
            { column: grid.columnOption(1), rowType: 'groupfooter' },
            { column: grid.columnOption(2), rowType: 'groupfooter' },
            { column: grid.columnOption(3), rowType: 'groupfooter' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(0), rowType: 'group' },
            { column: grid.columnOption(1), rowType: 'data', data: ds[1], value: ds[1].f2 },
            { column: grid.columnOption(2), rowType: 'data', data: ds[1], value: ds[1].f3 },
            { column: grid.columnOption(3), rowType: 'data', data: ds[1], value: ds[1].f4 },
            { column: grid.columnOption(1), rowType: 'groupfooter' },
            { column: grid.columnOption(2), rowType: 'groupfooter' },
            { column: grid.columnOption(3), rowType: 'groupfooter' },
        ]
    );
});

QUnit.test("Check event arguments for total summary", function(assert) {
    const ds = [{ f1: 1 }];
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [{ dataField: "f1", dataType: "number" }],
            dataSource: ds,
            summary: {
                totalItems: [{ column: 'f1', summaryType: 'sum' }]
            },
            showColumnHeaders: false,
        },
        (grid) => [
            { column: grid.columnOption(0), rowType: 'data', data: ds[0], value: ds[0].f1 },
            { column: grid.columnOption(0), rowType: 'totalFooter' },
        ]
    );
});

QUnit.test("Check event arguments for changes from customizeExportData", function(assert) {
    const ds = [{ f1: 'f1' }];
    helper.runCustomizeExcelCellTest(assert,
        {
            columns: [{ dataField: "f1", dataType: "string" }],
            dataSource: ds,
            customizeExportData: (columns, rows) => {
                rows.forEach(row => row.values.forEach((value, valueIndex) => row.values[valueIndex] += '+'));
            },
            showColumnHeaders: false,
        },
        (grid) => [
            { column: grid.columnOption(0), rowType: 'data', data: ds[0], value: 'f1+' },
        ]
    );
});

QUnit.test("Changes in 'e.xlsxCell.style' shouldn't modify a shared style object", function(assert) {
    const done = assert.async();
    let counter = 1;
    const gridOptions = {
        columns: [{ dataField: "f1" }],
        dataSource: [{ f1: 1 }, { f1: 2 }, { f1: 3 }],
        showColumnHeaders: false,
        loadingTimeout: undefined,
        export: {
            customizeExcelCell: e => {
                assert.step(e.xlsxCell.style.alignment.horizontal);
                e.xlsxCell.style.alignment.horizontal = counter++;
            },
        },
        onFileSaving: e => {
            assert.verifySteps(['right', 'right', 'right']);
            done();
            e.cancel = true;
        },
    };
    const dataGrid = $("#dataGrid").dxDataGrid(gridOptions).dxDataGrid("instance");
    dataGrid.exportToExcel();
});

QUnit.test("Change string value", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>1</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>b</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                customizeExcelCell: e => {
                    assert.strictEqual(e.xlsxCell.value, 'a');
                    e.xlsxCell.value = 'b';
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test("Change number value", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [{ f1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                customizeExcelCell: e => {
                    assert.strictEqual(e.xlsxCell.value, 42);
                    e.xlsxCell.value = 43;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test("Change date value", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43122.70486111111</v></c>' +
        '</row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="3" t="n"><v>43487.70486111111</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [
                { f1: new Date(2018, 0, 21, 16, 55) },
                { f1: new Date(2019, 0, 21, 16, 55) }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                customizeExcelCell: e => {
                    if(e.xlsxCell.value.getTime() === new Date(2018, 0, 21, 16, 55).getTime()) {
                        assert.deepEqual(e.xlsxCell.value, new Date(2018, 0, 21, 16, 55));
                        e.xlsxCell.value = new Date(2018, 0, 22, 16, 55);
                    } else {
                        assert.deepEqual(e.xlsxCell.value, new Date(2019, 0, 21, 16, 55));
                        e.xlsxCell.value = 43487.70486111111; // new Date(2019, 0, 22, 16, 55)
                    }
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test("Change boolean value", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="s"><v>0</v></c></row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:C2" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>true</t></si>' +
        '<si><t>false</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'boolean' }],
            dataSource: [
                { f1: true },
                { f1: false }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                customizeExcelCell: e => {
                    if(e.gridCell.value) {
                        assert.strictEqual(e.xlsxCell.value, 'true');
                        e.xlsxCell.value = 'false';
                    } else {
                        assert.strictEqual(e.xlsxCell.value, 'false');
                        e.xlsxCell.value = true;
                    }
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test("Change cell value data type", function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" /><col width="13.57" min="4" max="4" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:4" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" t="n"><v>1</v></c><c r="B1" t="s"><v>1</v></c><c r="C1" t="s"><v>2</v></c><c r="D1" t="n"><v>1</v></c>' +
        '</row>' +
        '</sheetData>' +
        '<ignoredErrors><ignoredError sqref="A1:D1" numberStoredAsText="1" /></ignoredErrors></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>a</t></si>' +
        '<si><t>one</t></si>' +
        '<si><t>my date</t></si>' +
        '<si><t>true</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'stringToNumber', dataType: 'string' },
                { dataField: 'numberToString', dataType: 'number' },
                { dataField: 'dateToString', dataType: 'date' },
                { dataField: 'boolToNumber', dataType: 'boolean' }
            ],
            dataSource: [{ stringToNumber: 'a', numberToString: 1, dateToString: new Date(2018, 0, 20), boolToNumber: true }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                customizeExcelCell: e => {
                    if(e.gridCell.column.dataField === 'stringToNumber') {
                        e.xlsxCell.value = 1;
                        e.xlsxCell.dataType = 'n';
                        e.xlsxCell.style = null;
                        e.xlsxCell.numberFormat = null;
                    } else if(e.gridCell.column.dataField === 'numberToString') {
                        e.xlsxCell.value = 'one';
                        e.xlsxCell.dataType = 's';
                        e.xlsxCell.style = null;
                        e.xlsxCell.numberFormat = null;
                    } else if(e.gridCell.column.dataField === 'dateToString') {
                        e.xlsxCell.value = 'my date';
                        e.xlsxCell.dataType = 's';
                        e.xlsxCell.style = null;
                        e.xlsxCell.numberFormat = null;
                    } else if(e.gridCell.column.dataField === 'boolToNumber') {
                        e.xlsxCell.value = 1;
                        e.xlsxCell.dataType = 'n';
                        e.xlsxCell.style = null;
                        e.xlsxCell.numberFormat = null;
                    }
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test("Clear reference to xlsx style record for header cell", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML + helper.BASE_STYLE_XML +
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
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" t="s"><v>0</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1"><si><t>F1</t></si></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: ['f1'],
            showColumnHeaders: true,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.style = null;
                    e.xlsxCell.numberFormat = null;
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Clear reference to xlsx style record for number value cell", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="5">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: ['f1'],
            dataSource: [{ f1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.style = null;
                    e.xlsxCell.numberFormat = null;
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test("Clear reference to xlsx style record and change number format for Number column", function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1">' +
        '<numFmt numFmtId="165" formatCode="0000" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="165" />' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="5" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [{ f1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.xlsxCell.style = null;
                    e.xlsxCell.numberFormat = '0000';
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});
