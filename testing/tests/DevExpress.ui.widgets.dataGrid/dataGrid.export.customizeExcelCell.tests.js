import $ from 'jquery';
import helper from '../../helpers/dataGridExportTestsHelper.js';
import { isDefined } from '../../../js/core/utils/type.js';

QUnit.testStart(function() {
    var markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('DataGrid customizeExcelCell tests', {
    beforeEach: helper.beforeEachTest,
    afterEach: helper.afterEachTest,
});

QUnit.test('Check e.component', function(assert) {
    let onCellPreparedComponent;
    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'field1', dataType: 'string' }],
            dataSource: [{ field1: 'str1' }],
            showColumnHeaders: false,
            onCellPrepared: e => onCellPreparedComponent = e.component,
            export: {
                customizeExcelCell: e => {
                    assert.ok(isDefined(onCellPreparedComponent));
                    assert.ok(e.component === onCellPreparedComponent);
                }
            },
        }
    );
});

QUnit.test('Change alignment', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1"><alignment vertical="distributed" wrapText="1" horizontal="centerContinuous" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>42</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'field1' }],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.clearStyle();
                    e.horizontalAlignment = 'centerContinuous';
                    e.verticalAlignment = 'distributed';
                    e.wrapTextEnabled = true;
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Set alignment to null', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" fontId="0" applyNumberFormat="0" numFmtId="0" />' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML +
        '<sheetPr/><dimension ref="A1:C1"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>42</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'field1' }],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.horizontalAlignment = null;
                    e.verticalAlignment = null;
                    e.wrapTextEnabled = null;
                }
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Check default alignment by column.alignment', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'field1', alignment: 'center' }],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: true,
            export: {
                customizeExcelCell: e => {
                    assert.strictEqual(e.horizontalAlignment, 'center');
                    assert.strictEqual(e.verticalAlignment, 'top');
                }
            },
        }
    );
});

QUnit.test('Check default wrapTextEnabled by DataGrid.wordWrapEnabled if there is no export.excelWrapTextEnabled value', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: [ 'field1' ],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: true,
            wordWrapEnabled: true,
            export: {
                customizeExcelCell: e => {
                    assert.strictEqual(e.wrapTextEnabled, true);
                }
            },
        }
    );
});

QUnit.test('Check default wrapTextEnabled from export.excelWrapTextEnabled value (it overrides wordWrapEnabled value)', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: [ 'field1' ],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: true,
            wordWrapEnabled: false,
            export: {
                excelWrapTextEnabled: true,
                customizeExcelCell: e => {
                    assert.strictEqual(e.wrapTextEnabled, true);
                }
            },
        }
    );
});

QUnit.test('Change fill', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML1 +
        '<fills count="3">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '<fill><patternFill patternType="Gray125" /></fill>' +
        '<fill><patternFill patternType="lightGrid"><fgColor rgb="AAFF00FF" /><bgColor rgb="FFFFFF00" /></patternFill></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" fillId="2" />' +
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
                    e.clearStyle();
                    e.backgroundColor = '#FFFF00';
                    e.fillPatternColor = '#FF00FFAA';
                    e.fillPatternType = 'lightGrid';
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Set fill to null', function(assert) {
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
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="n"><v>42</v></c></row>' +
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
                    e.backgroundColor = null;
                    e.fillPatternColor = null;
                    e.fillPatternType = null;
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Check default fill', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: ['field1'],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: true,
            export: {
                customizeExcelCell: e => {
                    assert.strictEqual(e.backgroundColor, undefined);
                    assert.strictEqual(e.fillPatternColor, undefined);
                    assert.strictEqual(e.fillPatternType, undefined);
                },
            },
        }
    );
});

QUnit.test('Change font', function(assert) {
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
        '<cellXfs count="7">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" fontId="2" />' +
        '<xf xfId="0" fontId="0" />' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>42</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="6" t="n"><v>43</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1' }],
            dataSource: [{ f1: 42 }, { f1: 43 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.horizontalAlignment = null;
                    e.verticalAlignment = null;
                    e.wrapTextEnabled = null;
                    e.numberFormat = null;
                    if(e.gridCell.data && e.gridCell.data.f1 === 42) {
                        e.font.size = 22;
                    }
                }
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Change font: create new font', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<fonts count="3">' +
        '<font><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '<font><b /><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '<font><b /><sz val="22" /><color rgb="FF00FF00" /><name val="name 1" /><family val="3" /><scheme val="scheme 1" /><i /><u val="underline 1" /></font>' +
        '</fonts>' +
        '<fills count="1">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" fontId="2" />' +
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
            columns: [{ dataField: 'field1' }],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.clearStyle();
                    e.font = {
                        bold: true,
                        color: '#00FF00',
                        family: 3,
                        italic: true,
                        name: 'name 1',
                        scheme: 'scheme 1',
                        size: 22,
                        underline: 'underline 1',
                    };
                }
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Set font to null', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<fonts count="2">' +
        '<font><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '<font><b /><sz val="11" /><color theme="1" /><name val="Calibri" /><family val="2" /><scheme val="minor" /></font>' +
        '</fonts>' +
        '<fills count="1">' +
        '<fill><patternFill patternType="none" /></fill>' +
        '</fills>' +
        helper.BASE_STYLE_XML2 +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
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
            columns: [{ dataField: 'field1' }],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => e.font = null,
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Check default font', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'field1' }],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: false,
            export: {
                customizeExcelCell: e => {
                    assert.strictEqual(e.font.bold, false);
                    assert.strictEqual(e.font.color.theme, 1);
                    assert.strictEqual(e.font.family, 2);
                    assert.strictEqual(e.font.italic, undefined);
                    assert.strictEqual(e.font.name, 'Calibri');
                    assert.strictEqual(e.font.scheme, 'minor');
                    assert.strictEqual(e.font.size, 11);
                    assert.strictEqual(e.font.underline, undefined);
                }
            },
        }
    );
});

QUnit.test('Check default header font', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'field1' }],
            dataSource: [],
            showColumnHeaders: true,
            export: {
                customizeExcelCell: e => {
                    assert.strictEqual(e.font.bold, true);
                    assert.strictEqual(e.font.color.theme, 1);
                    assert.strictEqual(e.font.family, 2);
                    assert.strictEqual(e.font.italic, undefined);
                    assert.strictEqual(e.font.name, 'Calibri');
                    assert.strictEqual(e.font.scheme, 'minor');
                    assert.strictEqual(e.font.size, 11);
                    assert.strictEqual(e.font.underline, undefined);
                }
            },
        }
    );
});

QUnit.test('Change number format', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="3">' +
        '<numFmt numFmtId="165" formatCode="[$-9]M\\/d\\/yyyy" />' +
        '<numFmt numFmtId="166" formatCode="dd/mmm/yyyy hh:mm" />' +
        '<numFmt numFmtId="167" formatCode="#,##0.0000" />' +
        '</numFmts>' +
        helper.BASE_STYLE_XML +
        '<cellXfs count="10">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="1" numFmtId="165"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyNumberFormat="0" numFmtId="0" />' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="4" />' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="22" />' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="166" />' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="167" />' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /><col width="13.57" min="3" max="3" />' +
        '<col width="13.57" min="4" max="4" /><col width="13.57" min="5" max="5" /><col width="13.57" min="6" max="6" /><col width="13.57" min="7" max="7" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:7" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" t="n"><v>43483.6875</v></c>' +
        '<c r="B1" s="5" t="n"><v>43484.6875</v></c>' +
        '<c r="C1" s="6" t="n"><v>43485.6875</v></c>' +
        '<c r="D1" s="7" t="n"><v>43486.6875</v></c>' +
        '<c r="E1" s="8" t="n"><v>43487.6875</v></c>' +
        '<c r="F1" s="9" t="n"><v>43488.6875</v></c>' +
        '<c r="G1" t="n"><v>43488.6875</v></c>' +
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
                    e.clearStyle();
                    e.numberFormat = formats.shift();
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Set number format to null', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="5" t="n"><v>1</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [{ f1: 1 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.numberFormat = null;
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Set number format for Number column to \'0000\', \'0.00\', \'0.00E+00\'', function(assert) {
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
                    e.numberFormat = columnFormats[e.gridCell.column.dataField];
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Set number format for Number column when column.format is function', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="1">' +
        '<numFmt numFmtId="165" formatCode="#,##0" />' +
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
                    e.numberFormat = '#,##0';
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Set number format for Number column when column.format is \'decimal\'', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        '<numFmts count="2">' +
        '<numFmt numFmtId="165" formatCode="#" />' +
        '<numFmt numFmtId="166" formatCode="#,##0" />' +
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
            columns: [{ dataField: 'f1', dataType: 'number', format: 'decimal' }],
            dataSource: [{ f1: 42 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.numberFormat = '#,##0';
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Set number format for Date column cell when column.format is function', function(assert) {
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
                    e.numberFormat = 'dd/mmm/yyyy hh:mm';
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Check default number format for String column', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'field1', dataType: 'string' }],
            dataSource: [{ field1: 'str1' }],
            showColumnHeaders: false,
            export: {
                customizeExcelCell: e => {
                    assert.strictEqual(e.numberFormat, 0);
                }
            },
        }
    );
});

QUnit.test('Check default number format for Number column', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'field1', dataType: 'number' }],
            dataSource: [{ field1: 42 }],
            showColumnHeaders: false,
            export: {
                customizeExcelCell: e => {
                    assert.strictEqual(e.numberFormat, 0);
                }
            },
        }
    );
});

QUnit.test('Check default number format for Date column', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'field1', dataType: 'date' }],
            dataSource: [{ field1: new Date(2019, 0, 18) }],
            showColumnHeaders: false,
            export: {
                customizeExcelCell: e => {
                    assert.strictEqual(e.numberFormat, '[$-9]M\\/d\\/yyyy');
                }
            },
        }
    );
});

QUnit.test('Check default number format for [Number|Number|Date] columns', function(assert) {
    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number' },
                { dataField: 'f2', dataType: 'number' },
                { dataField: 'f3', dataType: 'date' },
            ],
            dataSource: [{ f1: 41, f2: 42, f3: new Date(2019, 0, 1) }],
            showColumnHeaders: false,
            export: {
                customizeExcelCell: e => {
                    if(e.gridCell.column.dataField === 'f1' || e.gridCell.column.dataField === 'f2') {
                        assert.strictEqual(e.numberFormat, 0);
                    } else {
                        assert.strictEqual(e.numberFormat, '[$-9]M\\/d\\/yyyy');
                    }
                }
            },
        }
    );
});

[
    {
        dataType: 'number',
        gridCellValues: [undefined, null, 0, 1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
        callbackValues: [undefined, null, 0, 1, 'NaN', 'Infinity', '-Infinity']
    },
    {
        dataType: 'string',
        gridCellValues: [undefined, null, '', 's'],
        callbackValues: [undefined, undefined, undefined, 's'],
    },
    {
        dataType: 'date',
        gridCellValues: [undefined, null, new Date(2018, 11, 1)],
        callbackValues: [undefined, undefined, new Date(2018, 11, 1)],
    },
    {
        dataType: 'datetime',
        gridCellValues: [undefined, null, new Date(2018, 11, 1, 16, 10)],
        callbackValues: [undefined, undefined, new Date(2018, 11, 1, 16, 10)]
    },
    {
        dataType: 'boolean',
        gridCellValues: [undefined, null, false, true],
        callbackValues: [undefined, undefined, 'false', 'true']
    },
    {
        dataType: 'lookup',
        gridCellValues: [undefined, null, 1],
        callbackValues: [undefined, undefined, 'name1'],
        lookup: {
            dataSource: {
                store: { type: 'array', data: [{ id: 1, name: 'name1' }] },
                key: 'id'
            },
            valueExpr: 'id',
            displayExpr: 'name'
        }
    }
].forEach(config => {
    QUnit.test(`Check arguments for data cells - ${config.dataType}`, function(assert) {
        const column = { dataField: 'f1', dataType: config.dataType, lookup: config.lookup },
            ds = config.gridCellValues.map(item => { return { f1: item }; });

        helper.runGeneralTest(assert,
            {
                columns: [column],
                dataSource: ds,
                showColumnHeaders: false,
            },
            {
                getExpectedArgs: (grid) => {
                    const result = [];
                    for(let i = 0; i < config.gridCellValues.length; i++) {
                        result.push({
                            value: config.callbackValues[i],
                            gridCell: {
                                rowType: 'data',
                                data: ds[i],
                                column: grid.columnOption(0),
                                value: config.gridCellValues[i]
                            }
                        });
                    }
                    return result;
                }
            }
        );
    });
});

QUnit.test('Check arguments for header', function(assert) {
    helper.runGeneralTest(assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [],
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F1', gridCell: { rowType: 'header', column: grid.columnOption(0) } },
            ]
        }
    );
});

QUnit.test('Check arguments for bands', function(assert) {
    const ds = [{ f1: 1001, f2: 1002, f3: 1003, f4: 1004 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number' },
                {
                    caption: 'Band1',
                    columns: [
                        { dataField: 'f2', dataType: 'number' },
                        { dataField: 'f3', dataType: 'number' },
                    ]
                }
            ],
            dataSource: ds,
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F1', gridCell: { rowType: 'header', column: grid.columnOption(0) } },
                { value: 'Band1', gridCell: { rowType: 'header', column: grid.columnOption(1) } },
                { value: undefined, gridCell: { rowType: 'header', column: grid.columnOption(1) } },
                { value: undefined, gridCell: { rowType: 'header', column: grid.columnOption(0) } },
                { value: 'F2', gridCell: { rowType: 'header', column: grid.columnOption(2) } },
                { value: 'F3', gridCell: { rowType: 'header', column: grid.columnOption(3) } },
                { value: 1001, gridCell: { rowType: 'data', column: grid.columnOption(0), data: ds[0], value: ds[0].f1 } },
                { value: 1002, gridCell: { rowType: 'data', column: grid.columnOption(2), data: ds[0], value: ds[0].f2 } },
                { value: 1003, gridCell: { rowType: 'data', column: grid.columnOption(3), data: ds[0], value: ds[0].f3 } }
            ]
        }
    );
});

QUnit.test('Check arguments for groupping', function(assert) {
    const ds = [{ f1: 1001, f2: 1002, f3: 1003 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number' },
                { dataField: 'f3', dataType: 'number' }
            ],
            dataSource: ds,
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F2', gridCell: { rowType: 'header', column: grid.columnOption(1) } },
                { value: 'F3', gridCell: { rowType: 'header', column: grid.columnOption(2) } },
                { value: 'F1: ' + ds[0].f1, gridCell: { rowType: 'group', groupIndex: 0, column: grid.columnOption(0), value: ds[0].f1 } },
                { value: undefined, gridCell: { rowType: 'group', groupIndex: 0, column: grid.columnOption(2), value: undefined } },
                { value: ds[0].f2, gridCell: { rowType: 'data', column: grid.columnOption(1), data: ds[0], value: ds[0].f2 } },
                { value: ds[0].f3, gridCell: { rowType: 'data', column: grid.columnOption(2), data: ds[0], value: ds[0].f3 } }
            ]
        }
    );
});

QUnit.test('Check arguments for groupping with null', function(assert) {
    const ds = [{ f1: null, f2: 1002, f3: 1003 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number' },
                { dataField: 'f3', dataType: 'number' }
            ],
            dataSource: ds,
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F2' }, { value: 'F3' },
                { value: 'F1: ', gridCell: { groupIndex: 0, rowType: 'group', column: grid.columnOption(0), value: ds[0].f1 } },
                { value: undefined, gridCell: { groupIndex: 0, rowType: 'group', column: grid.columnOption(2) } },
                { value: ds[0].f2 }, { value: ds[0].f3 }
            ]
        }
    );
});

QUnit.test('Check arguments for groupping 2 level', function(assert) {
    const ds = [{ f1: 1001, f2: 1002, f3: 1003, f4: 1004 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number', groupIndex: 1 },
                { dataField: 'f3', dataType: 'number' },
                { dataField: 'f4', dataType: 'number' },
            ],
            dataSource: ds,
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F3', gridCell: { rowType: 'header', column: grid.columnOption(2) } },
                { value: 'F4', gridCell: { rowType: 'header', column: grid.columnOption(3) } },
                { value: 'F1: ' + ds[0].f1, gridCell: { groupIndex: 0, rowType: 'group', column: grid.columnOption(0), value: ds[0].f1 } },
                { value: undefined, gridCell: { groupIndex: 0, rowType: 'group', column: grid.columnOption(3), value: undefined } },
                { value: 'F2: ' + ds[0].f2, gridCell: { groupIndex: 1, rowType: 'group', column: grid.columnOption(1), value: ds[0].f2 } },
                { value: undefined, gridCell: { groupIndex: 1, rowType: 'group', column: grid.columnOption(3), value: undefined } },
                { value: ds[0].f3, gridCell: { rowType: 'data', column: grid.columnOption(2), data: ds[0], value: ds[0].f3 } },
                { value: ds[0].f4, gridCell: { rowType: 'data', column: grid.columnOption(3), data: ds[0], value: ds[0].f4 } }
            ]
        }
    );
});

QUnit.test('Check arguments for groupping 3 level & 2 column', function(assert) {
    const ds = [{ f1: 1001, f2: 1002, f3: 1003, f4: 1004, f5: 1005 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number', groupIndex: 1 },
                { dataField: 'f3', dataType: 'number', groupIndex: 2 },
                { dataField: 'f4', dataType: 'number' },
                { dataField: 'f5', dataType: 'number' }
            ],
            dataSource: ds
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F4', gridCell: { rowType: 'header', column: grid.columnOption(3) } },
                { value: 'F5', gridCell: { rowType: 'header', column: grid.columnOption(4) } },
                { value: 'F1: ' + ds[0].f1, gridCell: { groupIndex: 0, rowType: 'group', column: grid.columnOption(0), value: ds[0].f1 } },
                { value: undefined, gridCell: { groupIndex: 0, rowType: 'group', column: grid.columnOption(4), value: undefined } },
                { value: 'F2: ' + ds[0].f2, gridCell: { groupIndex: 1, rowType: 'group', column: grid.columnOption(1), value: ds[0].f2 } },
                { value: undefined, gridCell: { groupIndex: 1, rowType: 'group', column: grid.columnOption(4), value: undefined } },
                { value: 'F3: ' + ds[0].f3, gridCell: { groupIndex: 2, rowType: 'group', column: grid.columnOption(2), value: ds[0].f3 } },
                { value: undefined, gridCell: { groupIndex: 2, rowType: 'group', column: grid.columnOption(4), value: undefined } },
                { value: ds[0].f4, gridCell: { rowType: 'data', column: grid.columnOption(3), data: ds[0], value: ds[0].f4 } },
                { value: ds[0].f5, gridCell: { rowType: 'data', column: grid.columnOption(4), data: ds[0], value: ds[0].f5 } }
            ]
        }
    );
});

QUnit.test('Check arguments for group summary', function(assert) {
    const ds = [{ f1: 1001, f2: 1002 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number' }
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ name: 1, column: 'f2', summaryType: 'max' }]
            },
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F2', gridCell: { rowType: 'header', column: grid.columnOption(1) } },
                { value: `F1: ${ds[0].f1 } (Max of F2 is ${ds[0].f2})`, gridCell: { rowType: 'group', groupIndex: 0, column: grid.columnOption(0), value: ds[0].f1, groupSummaryItems: [{ name: 1, value: ds[0].f2 }] } },
                { value: ds[0].f2, gridCell: { rowType: 'data', column: grid.columnOption(1), data: ds[0], value: ds[0].f2 } }
            ]
        }
    );
});

QUnit.test('Check arguments for group summary with null', function(assert) {
    const ds = [{ f1: 1001, f2: null }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number' }
            ],
            dataSource: ds,
            summary: {
                groupItems: [{ name: 1, column: 'f2', summaryType: 'max', skipEmptyValues: false }]
            },
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F2' },
                { value: `F1: ${ds[0].f1 } (Max of F2 is )`, gridCell: { rowType: 'group', groupIndex: 0, column: grid.columnOption(0), value: ds[0].f1, groupSummaryItems: [{ name: 1, value: ds[0].f2 }] } },
                { value: ds[0].f2 }
            ]
        }
    );
});

QUnit.test('Check arguments for group summary with alignByColumn', function(assert) {
    const ds = [{ f1: 1001, f2: 1002, f3: 1003, f4: 1004 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number' },
                { dataField: 'f3', dataType: 'number' },
            ],
            dataSource: ds,
            summary: {
                groupItems: [
                    { name: 1, column: 'f3', summaryType: 'max', alignByColumn: true },
                    { name: 2, column: 'f3', summaryType: 'count', alignByColumn: true }
                ]
            },
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F2', gridCell: { column: grid.columnOption(1), rowType: 'header' } },
                { value: 'F3', gridCell: { column: grid.columnOption(2), rowType: 'header' } },
                { value: `F1: ${ds[0].f1}`, gridCell: { column: grid.columnOption(0), rowType: 'group', groupIndex: 0, value: ds[0].f1 } },
                { value: `Max: ${ds[0].f3} \n Count: 1`, gridCell: { column: grid.columnOption(2), rowType: 'group', groupIndex: 0, groupSummaryItems: [{ name: 1, value: ds[0].f3 }, { name: 2, value: 1 }] } },
                { value: ds[0].f2, gridCell: { column: grid.columnOption(1), rowType: 'data', data: ds[0], value: ds[0].f2 } },
                { value: ds[0].f3, gridCell: { column: grid.columnOption(2), rowType: 'data', data: ds[0], value: ds[0].f3 } }
            ]
        }
    );
});

QUnit.test('Check arguments for group summary with showInGroupFooter', function(assert) {
    const ds = [
        { f1: 1001, f2: 1002, f3: 1003, f4: 1004 },
        { f1: 2001, f2: 2002, f3: 2003, f4: 2004 },
    ];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number' },
                { dataField: 'f3', dataType: 'number' },
                { dataField: 'f4', dataType: 'number' },
            ],
            dataSource: ds,
            summary: {
                groupItems: [
                    { column: 'f3', summaryType: 'max', showInGroupFooter: true },
                    { column: 'f4', summaryType: 'max', showInGroupFooter: true }
                ]
            },
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'F2', gridCell: { column: grid.columnOption(1), rowType: 'header' } },
                { value: 'F3', gridCell: { column: grid.columnOption(2), rowType: 'header' } },
                { value: 'F4', gridCell: { column: grid.columnOption(3), rowType: 'header' } },
                { value: 'F1: ' + ds[0].f1, gridCell: { column: grid.columnOption(0), rowType: 'group', groupIndex: 0, value: ds[0].f1 } },
                { value: undefined, gridCell: { column: grid.columnOption(2), rowType: 'group', groupIndex: 0, value: undefined } },
                { value: undefined, gridCell: { column: grid.columnOption(3), rowType: 'group', groupIndex: 0, value: undefined } },
                { value: ds[0].f2, gridCell: { column: grid.columnOption(1), rowType: 'data', data: ds[0], value: ds[0].f2 } },
                { value: ds[0].f3, gridCell: { column: grid.columnOption(2), rowType: 'data', data: ds[0], value: ds[0].f3 } },
                { value: ds[0].f4, gridCell: { column: grid.columnOption(3), rowType: 'data', data: ds[0], value: ds[0].f4 } },
                { value: undefined, gridCell: { column: grid.columnOption(1), rowType: 'groupFooter', groupIndex: undefined, value: undefined } },
                { value: 'Max: ' + ds[0].f3, gridCell: { column: grid.columnOption(2), rowType: 'groupFooter', value: ds[0].f3 } },
                { value: 'Max: ' + ds[0].f4, gridCell: { column: grid.columnOption(3), rowType: 'groupFooter', value: ds[0].f4 } },
                { value: 'F1: ' + ds[1].f1, gridCell: { column: grid.columnOption(0), rowType: 'group', groupIndex: 0, value: ds[1].f1 } },
                { value: undefined, gridCell: { column: grid.columnOption(2), rowType: 'group', groupIndex: 0, value: undefined } },
                { value: undefined, gridCell: { column: grid.columnOption(3), rowType: 'group', groupIndex: 0, value: undefined } },
                { value: ds[1].f2, gridCell: { column: grid.columnOption(1), rowType: 'data', data: ds[1], value: ds[1].f2 } },
                { value: ds[1].f3, gridCell: { column: grid.columnOption(2), rowType: 'data', data: ds[1], value: ds[1].f3 } },
                { value: ds[1].f4, gridCell: { column: grid.columnOption(3), rowType: 'data', data: ds[1], value: ds[1].f4 } },
                { value: undefined, gridCell: { column: grid.columnOption(1), rowType: 'groupFooter', groupIndex: undefined, value: undefined } },
                { value: 'Max: ' + ds[1].f3, gridCell: { column: grid.columnOption(2), rowType: 'groupFooter', value: ds[1].f3 } },
                { value: 'Max: ' + ds[1].f4, gridCell: { column: grid.columnOption(3), rowType: 'groupFooter', value: ds[1].f4 } },
            ]
        }
    );
});

QUnit.test('Check arguments for total summary', function(assert) {
    const ds = [{ f1: 1001, f2: 1002 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number' },
                { dataField: 'f2', dataType: 'number' }
            ],
            dataSource: ds,
            summary: {
                totalItems: [{ name: 1, column: 'f1', summaryType: 'max' }]
            },
            showColumnHeaders: false,
        },
        {
            getExpectedArgs: (grid) => [
                { value: ds[0].f1, gridCell: { column: grid.columnOption(0), rowType: 'data', data: ds[0], value: ds[0].f1 } },
                { value: ds[0].f2, gridCell: { column: grid.columnOption(1), rowType: 'data', data: ds[0], value: ds[0].f2 } },
                { value: `Max: ${ds[0].f1}`, gridCell: { column: grid.columnOption(0), rowType: 'totalFooter', value: ds[0].f1, totalSummaryItemName: 1 } },
                { value: undefined, gridCell: { column: grid.columnOption(1), rowType: 'totalFooter', value: undefined, totalSummaryItemName: undefined } }
            ]
        }
    );
});

QUnit.test('Check arguments for total summary (2 totals for 1 column)', function(assert) {
    const ds = [{ f1: 1001 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { name: 1, column: 'f1', summaryType: 'max' },
                    { name: 2, column: 'f1', summaryType: 'count' }
                ]
            },
            showColumnHeaders: false,
        },
        {
            getExpectedArgs: (grid) => [
                { value: ds[0].f1, gridCell: { column: grid.columnOption(0), rowType: 'data', data: ds[0], value: ds[0].f1 } },
                { value: `Max: ${ds[0].f1}`, gridCell: { column: grid.columnOption(0), rowType: 'totalFooter', value: ds[0].f1, totalSummaryItemName: 1 } },
                { value: 'Count: 1', gridCell: { column: grid.columnOption(0), rowType: 'totalFooter', value: 1, totalSummaryItemName: 2 } }
            ]
        }
    );
});

QUnit.test('Check arguments for total summary with showInColumn', function(assert) {
    const ds = [{ f1: 1001, f2: 1002 }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number' },
                { dataField: 'f2', dataType: 'number' }
            ],
            dataSource: ds,
            summary: {
                totalItems: [{ column: 'f1', summaryType: 'max', showInColumn: 'f2' }]
            },
            showColumnHeaders: false,
        },
        {
            getExpectedArgs: (grid) => [
                { value: ds[0].f1, gridCell: { column: grid.columnOption(0), rowType: 'data', data: ds[0], value: ds[0].f1 } },
                { value: ds[0].f2, gridCell: { column: grid.columnOption(1), rowType: 'data', data: ds[0], value: ds[0].f2 } },
                { value: undefined, gridCell: { column: grid.columnOption(0), rowType: 'totalFooter', value: undefined } },
                { value: `Max of F1 is ${ds[0].f1}`, gridCell: { column: grid.columnOption(1), rowType: 'totalFooter', value: ds[0].f1 } }
            ]
        }
    );
});

QUnit.test('Check arguments for total summary with null/undefined', function(assert) {
    const ds = [{ f1: null, f2: undefined, f3: null, f4: undefined }];
    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number' },
                { dataField: 'f2', dataType: 'number' },
                { dataField: 'f3', dataType: 'number' },
                { dataField: 'f4', dataType: 'number' },
            ],
            dataSource: ds,
            summary: {
                totalItems: [
                    { name: 1, column: 'f1', summaryType: 'max', skipEmptyValues: false },
                    { name: 2, column: 'f2', summaryType: 'max', skipEmptyValues: false },
                    { name: 3, column: 'f3', summaryType: 'max', skipEmptyValues: true },
                    { name: 4, column: 'f4', summaryType: 'max', skipEmptyValues: true }
                ]
            },
            showColumnHeaders: false,
        },
        {
            getExpectedArgs: (grid) => [
                { value: null }, { value: undefined }, { value: null }, { value: undefined },
                { value: 'Max: ', gridCell: { column: grid.columnOption(0), rowType: 'totalFooter', value: ds[0].f1, totalSummaryItemName: 1 } },
                { value: 'Max: ', gridCell: { column: grid.columnOption(1), rowType: 'totalFooter', value: ds[0].f2, totalSummaryItemName: 2 } },
                { value: undefined, gridCell: { column: grid.columnOption(2), rowType: 'totalFooter', value: undefined } },
                { value: undefined, gridCell: { column: grid.columnOption(3), rowType: 'totalFooter', value: undefined } }
            ]
        }
    );
});

QUnit.test('Check arguments for changes from customizeExportData', function(assert) {
    const ds = [{ f1: 'f1' }];
    helper.runGeneralTest(assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: ds,
            customizeExportData: (columns, rows) => {
                rows[0].values[0] += '+';
            },
            showColumnHeaders: false,
        },
        {
            getExpectedArgs: (grid) => [
                { value: 'f1+', gridCell: { column: grid.columnOption(0), rowType: 'data', data: ds[0], value: 'f1+' } }
            ]
        }
    );
});

QUnit.test('Check customizeExcelCell(args): change horizontalAlignment depending on data row values', function(assert) {
    const styles = helper.STYLESHEET_HEADER_XML +
        helper.BASE_STYLE_XML +
        '<cellXfs count="6">' +
        helper.STYLESHEET_STANDARDSTYLES +
        '<xf xfId="0" applyAlignment="1" fontId="0" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="right" /></xf>' +
        '<xf xfId="0" applyAlignment="1" fontId="1" applyNumberFormat="0" numFmtId="0"><alignment vertical="top" wrapText="0" horizontal="left" /></xf>' +
        '<xf xfId="0" applyAlignment="1"><alignment horizontal="centerContinuous" /></xf>' +
        '</cellXfs>' +
        helper.STYLESHEET_FOOTER_XML;
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="5" t="n"><v>1</v></c><c r="B1" s="3" t="n"><v>1</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="n"><v>2</v></c><c r="B2" s="3" t="n"><v>2</v></c></row>' +
        '</sheetData>' +
        '</worksheet>';
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
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    if(e.gridCell.rowType === 'data' && e.gridCell.column.dataField === 'data1' && e.gridCell.value === 1 && e.gridCell.data.data1 === 1) {
                        e.clearStyle();
                        e.horizontalAlignment = 'centerContinuous';
                    }
                },
            },
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Change string undefined to string', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>0</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>a</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: undefined }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = 'a';
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string undefined to number', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: undefined }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = 42;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string null to string', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>0</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>a</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: null }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = 'a';
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string null to number', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: null }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = 42;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string value to undefined', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s" />' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>a</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = undefined;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string value to null', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s" />' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>a</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = null;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string value to string', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>1</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
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
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = 'b';
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string value to number', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>a</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = 42;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string value to Number.NaN', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>1</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>NaN</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = Number.NaN;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string value to Number.POSITIVE_INFINITY', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>1</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>Infinity</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = Number.POSITIVE_INFINITY;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string value to Number.NEGATIVE_INFINITY', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>1</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>a</t></si>' +
        '<si><t>-Infinity</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = Number.NEGATIVE_INFINITY;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string value to date', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43122.70486111111</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>a</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = new Date(2018, 0, 22, 16, 55);
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change string value to boolean', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="b"><v>true</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>a</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'string' }],
            dataSource: [{ f1: 'a' }],
            showColumnHeaders: false,
            export: {
                ignoreExcelErrors: false,
                enabled: true,
                customizeExcelCell: e => {
                    e.value = true;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number undefined to number', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [{ f1: undefined }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = 42;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number null to number', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'number' }],
            dataSource: [{ f1: null }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = 42;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number value to undefined', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n" />' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

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
                    e.value = undefined;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number value to null', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n" />' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

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
                    e.value = null;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number value to string', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>0</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>a</t></si>' +
        '</sst>';

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
                    e.value = 'a';
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number value to number', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43</v></c>' +
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
                    e.value = 43;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number value to number.NaN', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>0</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>NaN</t></si>' +
        '</sst>';

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
                    e.value = Number.NaN;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number value to number.POSITIVE_INFINITY', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>0</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>Infinity</t></si>' +
        '</sst>';

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
                    e.value = Number.POSITIVE_INFINITY;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number value to number.NEGATIVE_INFINITY', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>0</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>-Infinity</t></si>' +
        '</sst>';

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
                    e.value = Number.NEGATIVE_INFINITY;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number value to date', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43122.70486111111</v></c>' +
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
                    e.value = new Date(2018, 0, 22, 16, 55);
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change number value to boolean', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="b"><v>true</v></c>' +
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
                    e.value = true;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change date undefined to date', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43487.70486111111</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [
                { f1: undefined }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = new Date(2019, 0, 22, 16, 55);
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change date null to date', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43487.70486111111</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="0" uniqueCount="0"></sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [
                { f1: null }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = new Date(2019, 0, 22, 16, 55);
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change date value to string', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>0</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>a</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [
                { f1: new Date(2018, 0, 21, 16, 55) }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = 'a';
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change date value to undefined', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n" />' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [
                { f1: new Date(2018, 0, 21, 16, 55) },
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = undefined;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change date value to null', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n" />' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [
                { f1: new Date(2018, 0, 21, 16, 55) },
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = undefined;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change date value to number', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [
                { f1: new Date(2018, 0, 21, 16, 55) },
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = 42;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change date value to date', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43122.70486111111</v></c>' +
        '</row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A2" s="3" t="n"><v>43487.70486111111</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [
                { f1: new Date(2018, 0, 21, 16, 55) },
                { f1: new Date(2019, 0, 21, 16, 55) }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    if(e.value.getTime() === new Date(2018, 0, 21, 16, 55).getTime()) {
                        e.value = new Date(2018, 0, 22, 16, 55);
                    } else {
                        e.value = 43487.70486111111; // new Date(2019, 0, 22, 16, 55)
                    }
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change date value to boolean', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="b"><v>true</v></c>' +
        '</row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_EMPTY;

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'date' }],
            dataSource: [
                { f1: new Date(2018, 0, 21, 16, 55) },
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = true;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change boolean value to string', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="s"><v>1</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>true</t></si>' +
        '<si><t>a</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'boolean' }],
            dataSource: [
                { f1: true }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = 'a';
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change boolean value to number', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>42</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>true</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'boolean' }],
            dataSource: [
                { f1: true }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = 42;
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change boolean value to date', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25">' +
        '<c r="A1" s="3" t="n"><v>43122.70486111111</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>true</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [{ dataField: 'f1', dataType: 'boolean' }],
            dataSource: [
                { f1: true }
            ],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    e.value = new Date(2018, 0, 22, 16, 55);
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change boolean value to boolean', function(assert) {
    const worksheet = helper.WORKSHEET_HEADER_XML1 +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="3" t="b"><v>true</v></c></row>' +
        '</sheetData></worksheet>';
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
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    if(e.gridCell.value) {
                        e.value = 'false';
                    } else {
                        e.value = true;
                    }
                },
            },
        },
        { worksheet, sharedStrings }
    );
});

QUnit.test('Change group cell value', function(assert) {
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
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="4" t="n"><v>1011</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A2" s="3" t="n"><v>1002</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="1" uniqueCount="1">' +
        '<si><t>F1: 1001</t></si>' +
        '</sst>';

    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number' }
            ],
            dataSource: [{ f1: 1001, f2: 1002 }],
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    if(e.gridCell !== undefined && e.gridCell.rowType === 'group' && e.gridCell.column.dataField === 'f1') {
                        e.value = e.gridCell.value + 10;
                    }
                },
            },
        },
        { worksheet, sharedStrings, styles }
    );
});

QUnit.test('Change group summary cell value with alignByColumn', function(assert) {
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
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="4" t="s"><v>0</v></c><c r="B1" s="2" t="s"><v>2</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A2" s="3" t="n"><v>1002</v></c><c r="B2" s="3" t="n"><v>1003</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="3" uniqueCount="3">' +
        '<si><t>F1: 1001</t></si>' +
        '<si><t>Max: 1003 \n Count: 1</t></si>' +
        '<si><t>item1: 1003\nitem2: 1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number' },
                { dataField: 'f3', dataType: 'number' }
            ],
            dataSource: [{ f1: 1001, f2: 1002, f3: 1003, f4: 1004 }],
            summary: {
                groupItems: [
                    { name: 'item1', column: 'f3', summaryType: 'max', alignByColumn: true },
                    { name: 'item2', column: 'f3', summaryType: 'count', alignByColumn: true }
                ]
            },
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    if(e.gridCell !== undefined && e.gridCell.rowType === 'group' && e.gridCell.column.dataField === 'f3') {
                        e.value = e.gridCell.groupSummaryItems.map(item => `${item.name}: ${item.value}`).join('\n');
                    }
                },
            }
        },
        { styles, worksheet, sharedStrings }
    );
});

QUnit.test('Change group cell with group summary items value', function(assert) {
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
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:1" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="4" t="s"><v>1</v></c></row>' +
        '<row r="2" spans="1:1" outlineLevel="1" x14ac:dyDescent="0.25"><c r="A2" s="3" t="n"><v>1002</v></c></row>' +
        '</sheetData></worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="2" uniqueCount="2">' +
        '<si><t>F1: 1001 (Max: 1001, Count: 1)</t></si>' +
        '<si><t>Total: 1001 (item1: 1001, item2: 1)</t></si>' +
        '</sst>';

    helper.runGeneralTest(assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number', groupIndex: 0 },
                { dataField: 'f2', dataType: 'number' }
            ],
            dataSource: [{ f1: 1001, f2: 1002, f3: 1003, f4: 1004 }],
            summary: {
                groupItems: [
                    { name: 'item1', column: 'f1', summaryType: 'max' },
                    { name: 'item2', column: 'f1', summaryType: 'count' },
                ]
            },
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    if(e.gridCell !== undefined && e.gridCell.rowType === 'group' && e.gridCell.column.dataField === 'f1') {
                        const groupSummaryText = e.gridCell.groupSummaryItems.map(item => `${item.name}: ${item.value}`).join(', ');
                        e.value = 'Total: ' + e.gridCell.value + ' (' + groupSummaryText + ')';
                    }
                },
            }
        },
        { worksheet, sharedStrings, styles }
    );
});

QUnit.test('Change total summary cell value', function(assert) {
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
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0"></sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15" outlineLevelRow="0" x14ac:dyDescent="0.25"/>' +
        '<cols><col width="13.57" min="1" max="1" /><col width="13.57" min="2" max="2" /></cols>' +
        '<sheetData>' +
        '<row r="1" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A1" s="3" t="n"><v>1001</v></c><c r="B1" s="3" t="n"><v>1002</v></c></row>' +
        '<row r="2" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A2" s="2" t="s" /><c r="B2" s="2" t="s"><v>1</v></c></row>' +
        '<row r="3" spans="1:2" outlineLevel="0" x14ac:dyDescent="0.25"><c r="A3" s="2" t="s" /><c r="B3" s="2" t="s"><v>3</v></c></row>' +
        '</sheetData>' +
        '</worksheet>';
    const sharedStrings = helper.SHARED_STRINGS_HEADER_XML + ' count="4" uniqueCount="4">' +
        '<si><t>Max: 1002</t></si>' +
        '<si><t>total1: 1002</t></si>' +
        '<si><t>Count: 1</t></si>' +
        '<si><t>total2: 1</t></si>' +
        '</sst>';

    helper.runGeneralTest(
        assert,
        {
            columns: [
                { dataField: 'f1', dataType: 'number' },
                { dataField: 'f2', dataType: 'number' }
            ],
            dataSource: [{ f1: 1001, f2: 1002 }],
            summary: {
                totalItems: [
                    { name: 'total1', column: 'f2', summaryType: 'max' },
                    { name: 'total2', column: 'f2', summaryType: 'count' }
                ]
            },
            showColumnHeaders: false,
            export: {
                enabled: true,
                ignoreExcelErrors: false,
                customizeExcelCell: e => {
                    if(e.gridCell !== undefined && e.gridCell.rowType === 'totalFooter' && e.gridCell.column.dataField === 'f2') {
                        e.value = e.gridCell.totalSummaryItemName + ': ' + e.gridCell.value;
                    }
                }
            }
        },
        { styles, worksheet, sharedStrings }
    );
});
