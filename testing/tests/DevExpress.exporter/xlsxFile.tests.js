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

QUnit.test("XlsxFile.ctor", function(assert) {
    new XlsxFile();
    assert.ok(true);
});

QUnit.test("registerCellFormat(empty format)", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.generateCellFormatsXml(), '<cellXfs count="0" />');

    assert.equal(file.registerCellFormat(null), undefined);
    assert.equal(file.registerCellFormat(undefined), undefined);
    assert.equal(file.registerCellFormat({}), undefined);
    assert.equal(file.registerCellFormat({ notSupported: 0 }), undefined);
    assert.equal(file.registerCellFormat({ numberFormatId: undefined }), undefined);
    assert.equal(file.registerCellFormat({ numberFormatId: null }), undefined);
    assert.equal(file.registerCellFormat({ alignment: undefined }), undefined);
    assert.equal(file.registerCellFormat({ alignment: null }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { vertical: undefined } }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { vertical: null } }), undefined);
    assert.equal(file.generateCellFormatsXml(), '<cellXfs count="0" />');
});

QUnit.test("registerCellFormat( various numFmtId )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ numberFormatId: 0 }), 0);
    assert.equal(file.registerCellFormat({ numberFormatId: 0 }), 0);
    assert.equal(file.registerCellFormat({ numberFormatId: 1 }), 1);
    assert.equal(file.registerCellFormat({ numberFormatId: 1 }), 1);

    assert.equal(file.generateCellFormatsXml(),
        '<cellXfs count="2">' +
        '<xf xfId="0" applyNumberFormat="0" numFmtId="0" />' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="1" />' +
        '</cellXfs>');
});

QUnit.test("registerCellFormat( various fontId )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ fontId: 0 }), 0);
    assert.equal(file.registerCellFormat({ fontId: 0 }), 0);
    assert.equal(file.registerCellFormat({ fontId: 1 }), 1);
    assert.equal(file.registerCellFormat({ fontId: 1 }), 1);

    assert.equal(file.generateCellFormatsXml(),
        '<cellXfs count="2">' +
        '<xf xfId="0" fontId="0" />' +
        '<xf xfId="0" fontId="1" />' +
        '</cellXfs>');
});

QUnit.test("registerFill( empty fill )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.generateFillsXml(), getExpectedFillsXml());

    assert.equal(file.registerFill(), undefined);
    assert.equal(file.registerFill(undefined), undefined);
    assert.equal(file.registerFill(null), undefined);
    assert.equal(file.registerFill({ notSupported: 0 }), undefined);
    assert.equal(file.registerFill({ patternFill: undefined }), undefined);
    assert.equal(file.registerFill({ patternFill: null }), undefined);
    assert.equal(file.registerFill({ patternFill: {} }), undefined);
    assert.equal(file.registerFill({ patternFill: { notSupported: 0 } }), undefined);
    assert.equal(file.registerFill({ patternFill: { patternType: undefined } }), undefined);
    assert.equal(file.registerFill({ patternFill: { patternType: null } }), undefined);
    assert.equal(file.registerFill({ patternFill: { backgroundColor_RGB: null } }), undefined);
    assert.equal(file.registerFill({ patternFill: { foregroundColor_RGB: null } }), undefined);
    assert.equal(file.registerFill({ patternFill: { foregroundColor_RGB: '1', backgroundColor_RGB: '1' } }), undefined);

    assert.equal(file.generateFillsXml(), getExpectedFillsXml());
});

QUnit.test("registerFill( various patternFill )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerFill({ patternFill: { patternType: '1' } }), 2);
    assert.equal(file.registerFill({ patternFill: { patternType: '1' } }), 2);

    assert.equal(file.registerFill({ patternFill: { patternType: '2' } }), 3);
    assert.equal(file.registerFill({ patternFill: { patternType: '2' } }), 3);

    assert.equal(file.registerFill({ patternFill: { patternType: '1', backgroundColor_RGB: '1' } }), 4);
    assert.equal(file.registerFill({ patternFill: { patternType: '1', backgroundColor_RGB: '1' } }), 4);

    assert.equal(file.registerFill({ patternFill: { patternType: '1', foregroundColor_RGB: '1' } }), 5);
    assert.equal(file.registerFill({ patternFill: { patternType: '1', foregroundColor_RGB: '1' } }), 5);

    assert.equal(file.registerFill({ patternFill: { patternType: '1', backgroundColor_RGB: '1', foregroundColor_RGB: '1' } }), 6);
    assert.equal(file.registerFill({ patternFill: { patternType: '1', backgroundColor_RGB: '1', foregroundColor_RGB: '1' } }), 6);

    assert.equal(
        file.generateFillsXml(),
        getExpectedFillsXml([
            '<fill><patternFill patternType="1" /></fill>',
            '<fill><patternFill patternType="2" /></fill>',
            '<fill><patternFill patternType="1"><bgColor rgb="1" /></patternFill></fill>',
            '<fill><patternFill patternType="1"><fgColor rgb="1" /></patternFill></fill>',
            '<fill><patternFill patternType="1"><bgColor rgb="1" /><fgColor rgb="1" /></patternFill></fill>',
        ])
    );
});
