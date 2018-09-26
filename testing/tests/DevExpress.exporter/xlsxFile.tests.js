import typeUtils from "core/utils/type";
import XlsxFile from 'client_exporter/xlsx/xlsx_file';

function getExpectedFillsXml(expectedFillXmlArray) {
    if(!typeUtils.isDefined(expectedFillXmlArray)) {
        return `<fills count="1"><fill><patternFill patternType="none" /></fill></fills>`;
    } else {
        return `<fills count="${2 + expectedFillXmlArray.length}">` +
            '<fill><patternFill patternType="none" /></fill>' +
            '<fill><patternFill patternType="Gray125" /></fill>' +
            `${expectedFillXmlArray.join("")}</fills>`;
    }
}

function getFullXml(xlsxFile) {
    return xlsxFile.generateCellFormatsXml() + xlsxFile.generateFillsXml() + xlsxFile.generateFontsXml() + xlsxFile.generateNumberFormatsXml();
}

QUnit.test("Empty 1", function(assert) {
    const file = new XlsxFile();
    assert.equal(getFullXml(file), getExpectedFillsXml());
});

QUnit.test("Empty 2", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat(), undefined);
    assert.equal(file.registerCellFormat(null), undefined);
    assert.equal(file.registerCellFormat(undefined), undefined);
    assert.equal(file.registerCellFormat({}), undefined);
    assert.equal(file.registerCellFormat({ notSupported: 'a' }), undefined);
    assert.equal(getFullXml(file), getExpectedFillsXml());
});

QUnit.test("Empty numberFormat", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ numberFormat: undefined }), undefined);
    assert.equal(file.registerCellFormat({ numberFormat: null }), undefined);
    assert.equal(file.registerCellFormat({ numberFormat: { notSupported: 'a' } }), undefined);
    assert.equal(file.registerCellFormat({ numberFormat: { formatCode: undefined } }), undefined);
    assert.equal(file.registerCellFormat({ numberFormat: { formatCode: null } }), undefined);
    assert.equal(file.registerCellFormat({ numberFormat: { formatCode: '' } }), undefined);
    assert.equal(getFullXml(file), getExpectedFillsXml());
});

QUnit.test("Various numberFormat as identifiers of predefined formats", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ numberFormat: 0 }), 0);
    assert.equal(file.registerCellFormat({ numberFormat: 0 }), 0);
    assert.equal(file.registerCellFormat({ numberFormat: 1 }), 1);
    assert.equal(file.registerCellFormat({ numberFormat: 1 }), 1);
    assert.equal(file.registerCellFormat({ numberFormat: 2 }), 2);
    assert.equal(file.registerCellFormat({ numberFormat: 2 }), 2);
    assert.equal(getFullXml(file),
        '<cellXfs count="3">' +
        '<xf xfId="0" applyNumberFormat="0" numFmtId="0" />' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="1" />' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="2" />' +
        '</cellXfs>' +
        getExpectedFillsXml());
});

QUnit.test("Various numberFormat as custom format", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ numberFormat: { formatCode: 'a' } }), 0);
    assert.equal(file.registerCellFormat({ numberFormat: { formatCode: 'a' } }), 0);
    assert.equal(file.registerCellFormat({ numberFormat: { formatCode: 'b' } }), 1);
    assert.equal(file.registerCellFormat({ numberFormat: { formatCode: 'b' } }), 1);
    assert.equal(getFullXml(file),
        '<cellXfs count="2">' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="165" />' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="166" />' +
        '</cellXfs>' +
        getExpectedFillsXml() + '<numFmts count="2"><numFmt numFmtId="165" formatCode="a" /><numFmt numFmtId="166" formatCode="b" /></numFmts>');
});

QUnit.test("Empty alignments", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ alignment: undefined }), undefined);
    assert.equal(file.registerCellFormat({ alignment: null }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { vertical: undefined, wrapText: undefined, horizontal: undefined } }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { vertical: null, wrapText: null, horizontal: null } }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { notSupported: 'a' } }), undefined);
    assert.equal(getFullXml(file), getExpectedFillsXml());
});

QUnit.test("Various alignments", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ alignment: { vertical: 'top' } }), 0);
    assert.equal(file.registerCellFormat({ alignment: { vertical: 'top' } }), 0);
    assert.equal(file.registerCellFormat({ alignment: { vertical: 'bottom' } }), 1);
    assert.equal(file.registerCellFormat({ alignment: { wrapText: true } }), 2);
    assert.equal(file.registerCellFormat({ alignment: { wrapText: true } }), 2);
    assert.equal(file.registerCellFormat({ alignment: { wrapText: false } }), 3);
    assert.equal(file.registerCellFormat({ alignment: { horizontal: 'center' } }), 4);
    assert.equal(file.registerCellFormat({ alignment: { horizontal: 'center' } }), 4);
    assert.equal(file.registerCellFormat({ alignment: { horizontal: 'left' } }), 5);

    assert.equal(getFullXml(file),
        '<cellXfs count="6">' +
        '<xf xfId="0" applyAlignment="1"><alignment vertical="top" /></xf>' +
        '<xf xfId="0" applyAlignment="1"><alignment vertical="bottom" /></xf>' +
        '<xf xfId="0" applyAlignment="1"><alignment wrapText="1" /></xf>' +
        '<xf xfId="0" applyAlignment="1"><alignment wrapText="0" /></xf>' +
        '<xf xfId="0" applyAlignment="1"><alignment horizontal="center" /></xf>' +
        '<xf xfId="0" applyAlignment="1"><alignment horizontal="left" /></xf>' +
        '</cellXfs>' +
        getExpectedFillsXml());
});

QUnit.test("Empty fills", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.generateFillsXml(), getExpectedFillsXml());

    assert.equal(file.registerCellFormat({ fill: undefined }), undefined);
    assert.equal(file.registerCellFormat({ fill: null }), undefined);
    assert.equal(file.registerCellFormat({ fill: { notSupported: 0 } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: undefined } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: null } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: {} } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { notSupported: 0 } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: undefined } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, notSupported: null } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, backgroundColor: null } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, backgroundColor: {} } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, backgroundColor: { notSupported: null } } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, backgroundColor: { rgb: null } } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, foregroundColor: null } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, foregroundColor: {} } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, foregroundColor: { notSupported: null } } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, foregroundColor: { rgb: null } } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, backgroundColor: { rgb: '1' }, foregroundColor: { rgb: '1' } } } }), undefined);

    assert.equal(getFullXml(file), getExpectedFillsXml());
});

QUnit.test("Various fills", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1' } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1' } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: undefined } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: {} } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { rgb: undefined } } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { rgb: null } } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: undefined } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: {} } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: { rgb: undefined } } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: { rgb: null } } } }), 0);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '2' } } }), 1);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '2' } } }), 1);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { rgb: '1' } } } }), 2);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { rgb: '1' } } } }), 2);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { rgb: '1' }, foregroundColor: {} } } }), 2);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { rgb: '1' }, foregroundColor: { rgb: null } } } }), 2);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { theme: '1' } } } }), 3);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { theme: '1' } } } }), 3);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: { rgb: '1' } } } }), 4);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: { rgb: '1' } } } }), 4);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: { rgb: '1' }, backgroundColor: {} } } }), 4);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: { rgb: '1' }, backgroundColor: { rgb: null } } } }), 4);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: { theme: '1' } } } }), 5);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor: { theme: '1' } } } }), 5);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { rgb: '1' }, foregroundColor: { rgb: '1' } } } }), 6);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { rgb: '1' }, foregroundColor: { rgb: '1' } } } }), 6);

    assert.equal(getFullXml(file),
        '<cellXfs count="7">' +
        '<xf xfId="0" fillId="2" />' +
        '<xf xfId="0" fillId="3" />' +
        '<xf xfId="0" fillId="4" />' +
        '<xf xfId="0" fillId="5" />' +
        '<xf xfId="0" fillId="6" />' +
        '<xf xfId="0" fillId="7" />' +
        '<xf xfId="0" fillId="8" />' +
        '</cellXfs>' +
        getExpectedFillsXml([
            '<fill><patternFill patternType="1" /></fill>',
            '<fill><patternFill patternType="2" /></fill>',
            '<fill><patternFill patternType="1"><bgColor rgb="1" /></patternFill></fill>',
            '<fill><patternFill patternType="1"><bgColor theme="1" /></patternFill></fill>',
            '<fill><patternFill patternType="1"><fgColor rgb="1" /></patternFill></fill>',
            '<fill><patternFill patternType="1"><fgColor theme="1" /></patternFill></fill>',
            '<fill><patternFill patternType="1"><fgColor rgb="1" /><bgColor rgb="1" /></patternFill></fill>',
        ])
    );
});

QUnit.test("Fills with empty subitems", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: {}, foregroundColor: {} } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: { rgb: '1' }, foregroundColor: {} } } }), 1);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor: {}, foregroundColor: { rgb: '1' } } } }), 2);
    assert.equal(getFullXml(file),
        '<cellXfs count="3">' +
        '<xf xfId="0" fillId="2" />' +
        '<xf xfId="0" fillId="3" />' +
        '<xf xfId="0" fillId="4" />' +
        '</cellXfs>' +
        getExpectedFillsXml([
            '<fill><patternFill patternType="1" /></fill>',
            '<fill><patternFill patternType="1"><bgColor rgb="1" /></patternFill></fill>',
            '<fill><patternFill patternType="1"><fgColor rgb="1" /></patternFill></fill>',
        ])
    );
});

QUnit.test("Passed fills should be copied", function(assert) {
    const file = new XlsxFile();
    const format1 = { fill: { patternFill: { patternType: '1', backgroundColor: { rgb: '1', theme: '1' }, foregroundColor: { rgb: '1', theme: '1' } } } };
    file.registerCellFormat(format1);
    format1.fill.patternFill.backgroundColor.rgb = '2';
    format1.fill.patternFill.backgroundColor.theme = '1';
    format1.fill.patternFill.backgroundColor = null;
    format1.fill.patternFill.foregroundColor.rgb = '2';
    format1.fill.patternFill.foregroundColor.theme = '1';
    format1.fill.patternFill.foregroundColor = null;
    format1.fill.patternFill.patternType = '2';
    format1.fill.patternFill = {};
    format1.fill = {};

    assert.equal(getFullXml(file),
        '<cellXfs count="1">' +
        '<xf xfId="0" fillId="2" />' +
        '</cellXfs>' +
        getExpectedFillsXml([
            '<fill><patternFill patternType="1"><fgColor rgb="1" theme="1" /><bgColor rgb="1" theme="1" /></patternFill></fill>',
        ])
    );
});

QUnit.test("Empty fonts", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ font: undefined }), undefined);
    assert.equal(file.registerCellFormat({ font: null }), undefined);
    assert.equal(file.registerCellFormat({ font: { notSupported: 'a' } }), undefined);
    assert.equal(file.registerCellFormat({ font: { bold: null } }), undefined);
    assert.equal(file.registerCellFormat({ font: { bold: false } }), undefined);
    assert.equal(file.registerCellFormat({ font: { italic: null } }), undefined);
    assert.equal(file.registerCellFormat({ font: { italic: false } }), undefined);
    assert.equal(file.registerCellFormat({ font: { color: undefined } }), undefined);
    assert.equal(file.registerCellFormat({ font: { color: null } }), undefined);
    assert.equal(file.registerCellFormat({ font: { color: {} } }), undefined);
    assert.equal(file.registerCellFormat({ font: { color: { notSupported: 'a' } } }), undefined);

    assert.equal(getFullXml(file), getExpectedFillsXml());
});

QUnit.test("Various fonts", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ font: { bold: true } }), 0);
    assert.equal(file.registerCellFormat({ font: { bold: true } }), 0);
    assert.equal(file.registerCellFormat({ font: { size: 10 } }), 1);
    assert.equal(file.registerCellFormat({ font: { size: 10 } }), 1);
    assert.equal(file.registerCellFormat({ font: { size: 10, bold: false } }), 1);
    assert.equal(file.registerCellFormat({ font: { size: 10, italic: false } }), 1);
    assert.equal(file.registerCellFormat({ font: { size: 10, color: { notSupported: 'a' } } }), 1);
    assert.equal(file.registerCellFormat({ font: { size: 11 } }), 2);
    assert.equal(file.registerCellFormat({ font: { name: 'n1' } }), 3);
    assert.equal(file.registerCellFormat({ font: { name: 'n1' } }), 3);
    assert.equal(file.registerCellFormat({ font: { name: 'n2' } }), 4);
    assert.equal(file.registerCellFormat({ font: { family: 'f1' } }), 5);
    assert.equal(file.registerCellFormat({ font: { family: 'f1' } }), 5);
    assert.equal(file.registerCellFormat({ font: { family: 'f2' } }), 6);
    assert.equal(file.registerCellFormat({ font: { scheme: 's1' } }), 7);
    assert.equal(file.registerCellFormat({ font: { scheme: 's1' } }), 7);
    assert.equal(file.registerCellFormat({ font: { scheme: 's2' } }), 8);
    assert.equal(file.registerCellFormat({ font: { italic: true } }), 9);
    assert.equal(file.registerCellFormat({ font: { italic: true } }), 9);
    assert.equal(file.registerCellFormat({ font: { underline: 'single' } }), 10);
    assert.equal(file.registerCellFormat({ font: { underline: 'single' } }), 10);
    assert.equal(file.registerCellFormat({ font: { underline: 'double' } }), 11);
    assert.equal(file.registerCellFormat({ font: { color: { rgb: 'rgb1' } } }), 12);
    assert.equal(file.registerCellFormat({ font: { color: { rgb: 'rgb1' } } }), 12);
    assert.equal(file.registerCellFormat({ font: { color: { rgb: 'rgb2' } } }), 13);
    assert.equal(file.registerCellFormat({ font: { color: { theme: 't1' } } }), 14);
    assert.equal(file.registerCellFormat({ font: { color: { theme: 't1' } } }), 14);
    assert.equal(file.registerCellFormat({ font: { color: { theme: 't2' } } }), 15);

    assert.equal(getFullXml(file),
        '<cellXfs count="16">' +
        '<xf xfId="0" fontId="0" /><xf xfId="0" fontId="1" /><xf xfId="0" fontId="2" /><xf xfId="0" fontId="3" /><xf xfId="0" fontId="4" />' +
        '<xf xfId="0" fontId="5" /><xf xfId="0" fontId="6" /><xf xfId="0" fontId="7" /><xf xfId="0" fontId="8" /><xf xfId="0" fontId="9" />' +
        '<xf xfId="0" fontId="10" /><xf xfId="0" fontId="11" /><xf xfId="0" fontId="12" /><xf xfId="0" fontId="13" /><xf xfId="0" fontId="14" />' +
        '<xf xfId="0" fontId="15" />' +
        '</cellXfs>' +
        getExpectedFillsXml() +
        '<fonts count="16">' +
        '<font><b /></font>' +
        '<font><sz val="10" /></font>' +
        '<font><sz val="11" /></font>' +
        '<font><name val="n1" /></font>' +
        '<font><name val="n2" /></font>' +
        '<font><family val="f1" /></font>' +
        '<font><family val="f2" /></font>' +
        '<font><scheme val="s1" /></font>' +
        '<font><scheme val="s2" /></font>' +
        '<font><i /></font>' +
        '<font><u val="single" /></font>' +
        '<font><u val="double" /></font>' +
        '<font><color rgb="rgb1" /></font>' +
        '<font><color rgb="rgb2" /></font>' +
        '<font><color theme="t1" /></font>' +
        '<font><color theme="t2" /></font>' +
        '</fonts>');
});

QUnit.test("Fonts with empty subitems", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ font: { size: 10, color: { } } }), 0);

    assert.equal(getFullXml(file),
        '<cellXfs count="1">' +
        '<xf xfId="0" fontId="0" />' +
        '</cellXfs>' +
        getExpectedFillsXml() +
        '<fonts count="1">' +
        '<font><sz val="10" /></font>' +
        '</fonts>');
});

QUnit.test("Passed fonts should be copied", function(assert) {
    const file = new XlsxFile();
    const format1 = { font: { size: 1, color: { rgb: '1' } } };
    file.registerCellFormat(format1);
    format1.font.color.rgb = '2';
    format1.font.color = null;
    format1.font.size = 2;
    format1.font = null;

    assert.equal(getFullXml(file),
        '<cellXfs count="1">' +
        '<xf xfId="0" fontId="0" />' +
        '</cellXfs>' +
        getExpectedFillsXml() +
        '<fonts count="1">' +
        '<font><sz val="1" /><color rgb="1" /></font>' +
        '</fonts>');
});
