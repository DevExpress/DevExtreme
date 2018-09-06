import XlsxFile from 'client_exporter/xlsx/xlsx_file';

QUnit.test("XlsxFile.ctor", function(assert) {
    new XlsxFile();
    assert.ok(true);
});

QUnit.test("registerCellFormat(empty format)", function(assert) {
    const file = new XlsxFile();
    assert.equal(file.generateCellFormatsXml(), '<cellXfs count="0"></cellXfs>');

    assert.equal(file.registerCellFormat(null), undefined);
    assert.equal(file.registerCellFormat(undefined), undefined);
    assert.equal(file.registerCellFormat({}), undefined);
    assert.equal(file.registerCellFormat({ numberFormatId: undefined }), undefined);
    assert.equal(file.registerCellFormat({ numberFormatId: null }), undefined);
    assert.equal(file.registerCellFormat({ alignment: undefined }), undefined);
    assert.equal(file.registerCellFormat({ alignment: null }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { vertical: undefined } }), undefined);
    assert.equal(file.registerCellFormat({ alignment: { vertical: null } }), undefined);
    assert.equal(file.generateCellFormatsXml(), '<cellXfs count="0"></cellXfs>');
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
