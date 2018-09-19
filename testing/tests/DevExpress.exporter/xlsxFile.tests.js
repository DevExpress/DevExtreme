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
    return xlsxFile.generateCellFormatsXml() + xlsxFile.generateFillsXml();
}

QUnit.test("Empty file", function(assert) {
    const file = new XlsxFile();
    assert.equal(getFullXml(file), '<cellXfs count="0" />' + getExpectedFillsXml());
});

QUnit.test("registerCellFormat( empty format )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat(), undefined);
    assert.equal(file.registerCellFormat(null), undefined);
    assert.equal(file.registerCellFormat(undefined), undefined);
    assert.equal(file.registerCellFormat({}), undefined);
    assert.equal(file.registerCellFormat({ notSupported: 'a' }), undefined);
    assert.equal(getFullXml(file), '<cellXfs count="0" />' + getExpectedFillsXml());
});

QUnit.test("registerCellFormat( empty numberFormatId )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ numberFormatId: undefined }), undefined);
    assert.equal(file.registerCellFormat({ numberFormatId: null }), undefined);
    assert.equal(getFullXml(file), '<cellXfs count="0" />' + getExpectedFillsXml());
});

QUnit.test("registerCellFormat( various numberFormatId )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ numberFormatId: 0 }), 0);
    assert.equal(file.registerCellFormat({ numberFormatId: 0 }), 0);
    assert.equal(file.registerCellFormat({ numberFormatId: 1 }), 1);
    assert.equal(file.registerCellFormat({ numberFormatId: 1 }), 1);
    assert.equal(getFullXml(file),
        '<cellXfs count="2">' +
        '<xf xfId="0" applyNumberFormat="0" numFmtId="0" />' +
        '<xf xfId="0" applyNumberFormat="1" numFmtId="1" />' +
        '</cellXfs>' +
        getExpectedFillsXml());
});

QUnit.test("registerCellFormat( empty alignment )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ alignment: undefined }), undefined);
    assert.equal(file.registerCellFormat({ alignment: null }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { vertical: undefined, wrapText: undefined, horizontal: undefined } }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { vertical: null, wrapText: null, horizontal: null } }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { notSupported: 'a' } }), undefined);
    assert.equal(getFullXml(file), '<cellXfs count="0" />' + getExpectedFillsXml());
});

QUnit.test("registerCellFormat( various alignment )", function(assert) {
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

QUnit.test("registerCellFormat( empty fill )", function(assert) {
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
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, backgroundColor_RGB: null } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, foregroundColor_RGB: null } } }), undefined);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: null, foregroundColor_RGB: '1', backgroundColor_RGB: '1' } } }), undefined);

    assert.equal(getFullXml(file), '<cellXfs count="0" />' + getExpectedFillsXml());
});

QUnit.test("registerCellFormat( various fill )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1' } } }), 0);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1' } } }), 0);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '2' } } }), 1);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '2' } } }), 1);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor_RGB: '1' } } }), 2);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor_RGB: '1' } } }), 2);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor_RGB: '1' } } }), 3);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', foregroundColor_RGB: '1' } } }), 3);

    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor_RGB: '1', foregroundColor_RGB: '1' } } }), 4);
    assert.equal(file.registerCellFormat({ fill: { patternFill: { patternType: '1', backgroundColor_RGB: '1', foregroundColor_RGB: '1' } } }), 4);

    assert.equal(getFullXml(file),
        '<cellXfs count="5">' +
        '<xf xfId="0" fillId="2" />' +
        '<xf xfId="0" fillId="3" />' +
        '<xf xfId="0" fillId="4" />' +
        '<xf xfId="0" fillId="5" />' +
        '<xf xfId="0" fillId="6" />' +
        '</cellXfs>' +
        getExpectedFillsXml([
            '<fill><patternFill patternType="1" /></fill>',
            '<fill><patternFill patternType="2" /></fill>',
            '<fill><patternFill patternType="1"><bgColor rgb="1" /></patternFill></fill>',
            '<fill><patternFill patternType="1"><fgColor rgb="1" /></patternFill></fill>',
            '<fill><patternFill patternType="1"><bgColor rgb="1" /><fgColor rgb="1" /></patternFill></fill>',
        ])
    );
});

QUnit.test("registerCellFormat( empty font )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ fontId: undefined }), undefined);
    assert.equal(file.registerCellFormat({ fontId: null }), undefined);

    assert.equal(getFullXml(file), '<cellXfs count="0" />' + getExpectedFillsXml());
});

QUnit.test("registerCellFormat( various font )", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.registerCellFormat({ fontId: 0 }), 0);
    assert.equal(file.registerCellFormat({ fontId: 0 }), 0);
    assert.equal(file.registerCellFormat({ fontId: 1 }), 1);
    assert.equal(file.registerCellFormat({ fontId: 1 }), 1);

    assert.equal(getFullXml(file),
        '<cellXfs count="2">' +
        '<xf xfId="0" fontId="0" /><xf xfId="0" fontId="1" />' +
        '</cellXfs>' +
        getExpectedFillsXml());
});
