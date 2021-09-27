import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfWordWrapTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Wordwrap', moduleConfig, () => {
            QUnit.test('1 col - 1 text line. fontSize default', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'very long line' }]
                });

                const expectedLog = [
                    'text,very long line,10,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60'
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. fontSize default, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long line' }]
                });

                const expectedLog = [
                    'text,very long line,10,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60'
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. fontSize default, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'very long line' }]
                });

                const expectedLog = [
                    'text,very long line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. fontSize default, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long line' }]
                });

                const expectedLog = [
                    'text,very long line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. fontSize default, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long line' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,very long\nline,15,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,46.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,10,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. fontSize 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,10,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. fontSize 20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,10,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setFontSize,16',
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. fontSize 20, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,10,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setFontSize,16',
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. fontSize 20, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,15,31.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,33',
                    'setFontSize,16'
                ];

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.font = { size: 20 };
                    pdfCell.padding = 5;
                };

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize default', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'very long text very long text' }]
                });

                const expectedLog = [
                    'text,very long text very long text,10,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60'
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize default, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long text very long text' }]
                });

                const expectedLog = [
                    'text,very long text\nvery long text,10,35.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60'
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize default, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'very long text very long text' }]
                });

                const expectedLog = [
                    'text,very long text very long text,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize default, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long text very long text' }]
                });

                const expectedLog = [
                    'text,very long text\nvery long text,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize default, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long text very long text' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,very long\ntext very\nlong text,15,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,65.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line long line,10,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line,10,33.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize 20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line long line,10,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setFontSize,16',
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize 20, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line,10,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,46',
                    'setFontSize,16',
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize 20, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line,15,31.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,56',
                    'setFontSize,16'
                ];

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.font = { size: 20 };
                    pdfCell.padding = 5;
                };

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize default', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'very long line very long line very long line' }]
                });

                const expectedLog = [
                    'text,very long line very long line very long line,10,55,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,80'
                ];

                const onRowExporting = (e) => { e.rowHeight = 80; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize default, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long line very long line very long line' }]
                });

                const expectedLog = [
                    'text,very long line\nvery long line\nvery long line,10,36.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,80'
                ];

                const onRowExporting = (e) => { e.rowHeight = 80; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize default, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'very long line very long line very long line' }]
                });

                const expectedLog = [
                    'text,very long line very long line very long line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize default, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long line very long line very long line' }]
                });

                const expectedLog = [
                    'text,very long line\nvery long line\nvery long line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize default, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long line very long line very long line' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,very long\nline very\nlong line\nvery long\nline,15,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,102'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines with line breaks. fontSize default, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'very long line\nvery long line very long line' }]
                });

                const expectedLog = [
                    'text,very long line\nvery long line very long line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines with line breaks. fontSize default, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long line\nvery long line very long line' }]
                });

                const expectedLog = [
                    'text,very long line\nvery long line\nvery long line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines with line breaks. fontSize default, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long line\nvery long line very long line' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,very long\nline\nvery long\nline very\nlong line,15,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,102'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'long line long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line long line long line,10,55,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,80',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 80; };
                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,10,32,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,80',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 80; };
                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize 20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'long line long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line long line long line,10,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setFontSize,16',
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize 20, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,10,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setFontSize,16',
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize 20, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,15,31.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,79',
                    'setFontSize,16'
                ];

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.font = { size: 20 };
                    pdfCell.padding = 5;
                };

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. onRowExporting.setfontSize=20, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,10,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowCells[0].font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. onRowExporting.setfontSize=20, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'long line long line long line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,15,31.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,79',
                    'setFontSize,16'
                ];

                const onRowExporting = (e) => { e.rowCells[0].font = { size: 20 }; };
                const customizeCell = ({ pdfCell }) => { pdfCell.padding = 5; };

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'vert long line' },
                        { caption: 'long line' }
                    ]
                });

                const expectedLog = [
                    'text,vert long line,10,45,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16',

                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'vert long line' },
                        { caption: 'long line' }
                    ]
                });

                const expectedLog = [
                    'text,vert long line,10,45,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'vert long line' },
                        { caption: 'long line' }
                    ]
                });

                const expectedLog = [
                    'text,vert long line,10,26.5,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setLineWidth,1',
                    'rect,110,15,100,23',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'vert long line' },
                        { caption: 'long line' }
                    ]
                });

                const expectedLog = [
                    'text,vert long line,10,26.5,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setLineWidth,1',
                    'rect,110,15,100,23',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'vert long line' },
                        { caption: 'long line' }
                    ]
                });

                const expectedLog = [
                    'text,vert long line,10,31.5,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line,115,31.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,33',
                    'setLineWidth,1',
                    'rect,110,15,100,33',
                    'setFontSize,16'
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                        pdfCell.padding = 5;
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'long line' },
                        { caption: 'big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,10,45,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'long line' },
                        { caption: 'big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,10,45,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'long line' },
                        { caption: 'big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,10,32.25,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,34.5',
                    'setLineWidth,1',
                    'rect,110,15,100,34.5',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'long line' },
                        { caption: 'big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,10,32.25,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,34.5',
                    'setLineWidth,1',
                    'rect,110,15,100,34.5',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'long line' },
                        { caption: 'big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line,15,54.5,{baseline:middle}',
                    'setFontSize,30',
                    'text,big\nline,115,37.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,79',
                    'setLineWidth,1',
                    'rect,110,15,100,79',
                    'setFontSize,16'
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                    pdfCell.padding = 5;
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'very long line very long line' },
                        { caption: 'long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long line very long line,10,45,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line long line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'very long line very long line' },
                        { caption: 'long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long line\nvery long line,10,35.8,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line\nlong line,110,33.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'very long line very long line' },
                        { caption: 'long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long line very long line,10,26.5,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line long line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setLineWidth,1',
                    'rect,110,15,100,23',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'very long line very long line' },
                        { caption: 'long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long line\nvery long line,10,28.8,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line\nlong line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,46',
                    'setLineWidth,1',
                    'rect,110,15,100,46',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'very long line very long line' },
                        { caption: 'long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long\nline very\nlong line,15,29.2,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line\nlong line,115,36.1,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,65.2',
                    'setLineWidth,1',
                    'rect,110,15,100,65.2',
                    'setFontSize,16'
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                    pdfCell.padding = 5;
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'long line long line' },
                        { caption: 'big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line long line,10,45,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line big line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'long line long line' },
                        { caption: 'big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line,10,33.5,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line\nbig line,110,27.75,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'long line long line' },
                        { caption: 'big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line long line,10,32.25,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line big line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,34.5',
                    'setLineWidth,1',
                    'rect,110,15,100,34.5',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'long line long line' },
                        { caption: 'big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line,10,38,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line\nbig line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setLineWidth,1',
                    'rect,110,15,100,69',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'long line long line' },
                        { caption: 'big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line,15,77.5,{baseline:middle}',
                    'setFontSize,30',
                    'text,big\nline\nbig\nline,115,37.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,148',
                    'setLineWidth,1',
                    'rect,110,15,100,148',
                    'setFontSize,16'
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                    pdfCell.padding = 5;
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'very long line very long line very long line' },
                        { caption: 'long line long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long line very long line very long line,10,55,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line long line long line,110,55,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,80',
                    'setLineWidth,1',
                    'rect,110,15,100,80',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 80; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'very long line very long line very long line' },
                        { caption: 'long line long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long line\nvery long line\nvery long line,10,36.6,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,110,32,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,80',
                    'setLineWidth,1',
                    'rect,110,15,100,80',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 80; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'very long line very long line very long line' },
                        { caption: 'long line long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long line very long line very long line,10,26.5,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line long line long line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setLineWidth,1',
                    'rect,110,15,100,23',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'very long line very long line very long line' },
                        { caption: 'long line long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long line\nvery long line\nvery long line,10,31.1,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setLineWidth,1',
                    'rect,110,15,100,69',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'very long line very long line very long line' },
                        { caption: 'long line long line long line' }
                    ]
                });

                const expectedLog = [
                    'text,very long\nline very\nlong line\nvery long\nline,15,29.2,{baseline:middle}',
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,115,43,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,102',
                    'setLineWidth,1',
                    'rect,110,15,100,102',
                    'setFontSize,16'
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.column.index === 1) {
                        pdfCell.font = { size: 20 };
                    }
                    pdfCell.padding = 5;
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'long line long line long line' },
                        { caption: 'big line big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line long line long line,10,60,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line big line big line,110,60,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,90',
                    'setLineWidth,1',
                    'rect,110,15,100,90',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 90; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'long line long line long line' },
                        { caption: 'big line big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,10,37,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line\nbig line\nbig line,110,25.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,90',
                    'setLineWidth,1',
                    'rect,110,15,100,90',
                    'setFontSize,16',
                ];

                const onRowExporting = (e) => { e.rowHeight = 90; };
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [
                        { caption: 'long line long line long line' },
                        { caption: 'big line big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line long line long line,10,32.25,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line big line big line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,34.5',
                    'setLineWidth,1',
                    'rect,110,15,100,34.5',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'long line long line long line' },
                        { caption: 'big line big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,10,43.75,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line\nbig line\nbig line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,103.5',
                    'setLineWidth,1',
                    'rect,110,15,100,103.5',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto, padding, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'long line long line long line' },
                        { caption: 'big line big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,15,100.5,{baseline:middle}',
                    'setFontSize,30',
                    'text,big\nline\nbig\nline\nbig\nline,115,37.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,217',
                    'setLineWidth,1',
                    'rect,110,15,100,217',
                    'setFontSize,16'
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                    pdfCell.padding = 5;
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize default, width equals for 1 line', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long text very long text' }]
                });

                const expectedLog = [
                    'text,very long text very long text,10,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,60'
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 text lines. fontSize default, width equals for 1 line, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long text very long text' }]
                });

                const expectedLog = [
                    'text,very long text very long text,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize 20.wordWrap enabled, col2.fontSize: 30, height auto, wordWrap disabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'long line long line long line' },
                        { caption: 'big line big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,10,26.5,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line big line big line,110,49.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setLineWidth,1',
                    'rect,110,15,100,69',
                    'setFontSize,16',
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.wordWrapEnabled = gridCell.column.index === 0;
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 col - 3 text lines. col1.fontSize 20.wordWrap enabled col1.padding, col2.fontSize: 30, height auto, wordWrap disabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'long line long line long line' },
                        { caption: 'big line big line big line' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,15,31.5,{baseline:middle}',
                    'setFontSize,30',
                    'text,big line big line big line,110,54.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,79',
                    'setLineWidth,1',
                    'rect,110,15,100,79',
                    'setFontSize,16'
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.wordWrapEnabled = gridCell.column.index === 0;
                    pdfCell.font = {
                        size: gridCell.column.index === 0
                            ? 20
                            : 30
                    };
                    pdfCell.padding = gridCell.column.index === 0 ? 5 : 0;
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 5 text lines. fontSize default, wordWrap enabled multiline text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long text very long text\nvery long text\nvery long text\nvery long text' }]
                });

                const expectedLog = [
                    'text,very long text\nvery long text\nvery long text\nvery long text\nvery long text,10,8.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60'
                ];

                const onRowExporting = (e) => { e.rowHeight = 60; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 5 text lines. fontSize default, wordWrap enabled multiline text, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long text very long text\nvery long text\nvery long text\nvery long text' }]
                });

                const expectedLog = [
                    'text,very long text\nvery long text\nvery long text\nvery long text\nvery long text,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,92'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 5 text lines. fontSize default, wordWrap enabled multiline text, padding, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long text very long text\nvery long text\nvery long text\nvery long text' }]
                });

                const expectedLog = [
                    'text,very long\ntext very\nlong text\nvery long\ntext\nvery long\ntext\nvery long\ntext,15,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,175.6'
                ];

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.padding = 5;
                };

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize default, height auto, grid.wordWrap disabled, cell.wordWrap enabled. customizeCell has priority', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'very long line very long line very long line' }]
                });

                const expectedLog = [
                    'text,very long line\nvery long line\nvery long line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,55.2'
                ];
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.wordWrapEnabled = true;
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines. fontSize default, height auto, grid.wordWrap enabled, cell.wordWrap disabled. customizeCell has priority', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [{ caption: 'very long line very long line very long line' }]
                });

                const expectedLog = [
                    'text,very long line very long line very long line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4'
                ];
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.wordWrapEnabled = false;
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('WordWrap with Bands', moduleConfig, () => {
            QUnit.test('[band1-[f1]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        {
                            caption: 'Band1 line1 line 2',
                            columns: [ 'f1', ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1 long line very long line' }],
                });

                const expectedLog = [
                    'text,Band1 line1\nline 2,10,24.2,{baseline:middle}',
                    'text,F1,10,61,{baseline:middle}',
                    'text,f1_1 long line\nvery long line,10,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,36.8',
                    'setLineWidth,1',
                    'rect,10,51.8,100,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,100,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 long line 1 ling line 2', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 line long line long line' }],
                });

                const expectedLog = [
                    'text,Band1 long line 1\nling line 2,10,24.2,{baseline:middle}',
                    'text,F1,10,61,{baseline:middle}',
                    'text,F2,80,61,{baseline:middle}',
                    'text,f1_1 line,10,97.8,{baseline:middle}',
                    'text,f2_1 line\nlong line\nlong line,80,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,140,36.8',
                    'setLineWidth,1',
                    'rect,10,51.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,51.8,70,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,70,55.2',
                    'setLineWidth,1',
                    'rect,80,70.2,70,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2, f3]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 long line 1 ling line 2', columns: [ 'f1', 'f2', 'f3' ] }
                    ],
                    dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 line long line long line', f3: 'f3' }],
                });

                const expectedLog = [
                    'text,Band1 long line 1 ling line 2,10,24.2,{baseline:middle}',
                    'text,F1,10,42.6,{baseline:middle}',
                    'text,F2,80,42.6,{baseline:middle}',
                    'text,F3,150,42.6,{baseline:middle}',
                    'text,f1_1 line,10,79.4,{baseline:middle}',
                    'text,f2_1 line\nlong line\nlong line,80,61,{baseline:middle}',
                    'text,f3,150,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,210,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,70,18.4',
                    'setLineWidth,1',
                    'rect,150,33.4,70,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,70,55.2',
                    'setLineWidth,1',
                    'rect,80,51.8,70,55.2',
                    'setLineWidth,1',
                    'rect,150,51.8,70,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[f3,f4]]], short text height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { dataField: 'f3', caption: 'f3' },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6', dataField: 'f4' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1',
                            f4: 'f4_1'
                        }],
                });

                const expectedLog = [
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,10,24.2,{baseline:middle}',
                    'text,Band1 line,80,30.333,{baseline:middle}',
                    'text,Band1_2,80,79.4,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6,160,67.133,{baseline:middle}',
                    'text,f3,80,146.867,{baseline:middle}',
                    'text,f1_1,10,189.8,{baseline:middle}',
                    'text,f3_1,80,189.8,{baseline:middle}',
                    'text,f4_1,160,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,165.6',
                    'setLineWidth,1',
                    'rect,80,15,140,30.667',
                    'setLineWidth,1',
                    'rect,80,45.667,80,67.467',
                    'setLineWidth,1',
                    'rect,160,45.667,60,134.933',
                    'setLineWidth,1',
                    'rect,80,113.133,80,67.467',
                    'setLineWidth,1',
                    'rect,10,180.6,70,18.4',
                    'setLineWidth,1',
                    'rect,80,180.6,80,18.4',
                    'setLineWidth,1',
                    'rect,160,180.6,60,18.4'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[f3,f4]]], long text height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { dataField: 'f3', caption: 'f3' },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8', dataField: 'f4' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1',
                            f4: 'f4_1'
                        }],
                });

                const expectedLog = [
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,10,24.2,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,70.2,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8,160,42.6,{baseline:middle}',
                    'text,f3,80,143.8,{baseline:middle}',
                    'text,f1_1,10,189.8,{baseline:middle}',
                    'text,f3_1,80,189.8,{baseline:middle}',
                    'text,f4_1,160,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,165.6',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,80,73.6',
                    'setLineWidth,1',
                    'rect,160,33.4,60,147.2',
                    'setLineWidth,1',
                    'rect,80,107,80,73.6',
                    'setLineWidth,1',
                    'rect,10,180.6,70,18.4',
                    'setLineWidth,1',
                    'rect,80,180.6,80,18.4',
                    'setLineWidth,1',
                    'rect,160,180.6,60,18.4'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[band-[f3],f4]]], short text height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { caption: 'f1_2_3', columns: [ { dataField: 'f3', caption: 'line1\nline2\nline3\nline4' } ] },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f4' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1_1',
                            f4: 'f4_1'
                        }],
                });

                const expectedLog = [
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,10,33.4,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,51.8,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,160,42.6,{baseline:middle}',
                    'text,f1_2_3,80,88.6,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4,80,125.4,{baseline:middle}',
                    'text,f1_1,10,208.2,{baseline:middle}',
                    'text,f3_1_1,80,208.2,{baseline:middle}',
                    'text,f4_1,160,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,184',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,80,36.8',
                    'setLineWidth,1',
                    'rect,160,33.4,60,165.6',
                    'setLineWidth,1',
                    'rect,80,70.2,80,36.8',
                    'setLineWidth,1',
                    'rect,80,107,80,92',
                    'setLineWidth,1',
                    'rect,10,199,70,18.4',
                    'setLineWidth,1',
                    'rect,80,199,80,18.4',
                    'setLineWidth,1',
                    'rect,160,199,60,18.4'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[band-[f3],f4]]], long text height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { caption: 'f1_2_3', columns: [ { dataField: 'f3', caption: 'line1\nline2\nline3\nline4\nline5\nline6' } ] },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f4' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1_1',
                            f4: 'f4_1'
                        }],
                });

                const expectedLog = [
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,10,33.4,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,45.667,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,160,42.6,{baseline:middle}',
                    'text,f1_2_3,80,70.2,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6,80,94.733,{baseline:middle}',
                    'text,f1_1,10,208.2,{baseline:middle}',
                    'text,f3_1_1,80,208.2,{baseline:middle}',
                    'text,f4_1,160,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,184',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,80,24.533',
                    'setLineWidth,1',
                    'rect,160,33.4,60,165.6',
                    'setLineWidth,1',
                    'rect,80,57.933,80,24.533',
                    'setLineWidth,1',
                    'rect,80,82.467,80,116.533',
                    'setLineWidth,1',
                    'rect,10,199,70,18.4',
                    'setLineWidth,1',
                    'rect,80,199,80,18.4',
                    'setLineWidth,1',
                    'rect,160,199,60,18.4'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[f3,f4],f5]], long band text - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { dataField: 'f3', caption: 'f3 long line very long line' },
                                        { dataField: 'f4', caption: 'f4 long line very long line' },
                                    ]
                                },
                                {
                                    caption: 'f5 long line very long line long line very long line long line very long line',
                                    dataField: 'f5'
                                }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1 line',
                            f2: 'f2_1 long line very long line',
                            f3: 'f3_1',
                            f4: 'f4_1 very long line',
                            f5: 'f5_1 long line'
                        }],
                });

                const expectedLog = [
                    'text,F1,10,97.8,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,61,{baseline:middle}',
                    'text,f5 long\nline very\nlong line\nlong line\nvery long\nline long\nline very\nlong line,220,42.6,{baseline:middle}',
                    'text,f3 long line\nvery long\nline,80,116.2,{baseline:middle}',
                    'text,f4 long\nline very\nlong line,160,116.2,{baseline:middle}',
                    'text,f1_1 line,10,208.2,{baseline:middle}',
                    'text,f3_1,80,208.2,{baseline:middle}',
                    'text,f4_1\nvery\nlong line,160,189.8,{baseline:middle}',
                    'text,f5_1 long\nline,220,199,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,165.6',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,140,55.2',
                    'setLineWidth,1',
                    'rect,220,33.4,70,147.2',
                    'setLineWidth,1',
                    'rect,80,88.6,80,92',
                    'setLineWidth,1',
                    'rect,160,88.6,60,92',
                    'setLineWidth,1',
                    'rect,10,180.6,70,55.2',
                    'setLineWidth,1',
                    'rect,80,180.6,80,55.2',
                    'setLineWidth,1',
                    'rect,160,180.6,60,55.2',
                    'setLineWidth,1',
                    'rect,220,180.6,70,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[f3,f4],f5]], long band text, customer height and height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { dataField: 'f3', caption: 'f3 long line very long line' },
                                        { dataField: 'f4', caption: 'f4 long line very long line' },
                                    ]
                                },
                                {
                                    caption: 'f5 long line very long line long line very long line long line very long line',
                                    dataField: 'f5'
                                }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1 line',
                            f2: 'f2_1 long line very long line',
                            f3: 'f3_1',
                            f4: 'f4_1 very long line',
                            f5: 'f5_1 long line'
                        }],
                });

                const expectedLog = [
                    'text,F1,10,97.8,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,78.9,{baseline:middle}',
                    'text,f5 long\nline very\nlong line\nlong line\nvery long\nline long\nline very\nlong line,220,42.6,{baseline:middle}',
                    'text,f3 long line\nvery long\nline,80,134.1,{baseline:middle}',
                    'text,f4 long\nline very\nlong line,160,134.1,{baseline:middle}',
                    'text,f1_1 line,10,208.2,{baseline:middle}',
                    'text,f3_1,80,208.2,{baseline:middle}',
                    'text,f4_1\nvery\nlong line,160,189.8,{baseline:middle}',
                    'text,f5_1 long\nline,220,199,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,165.6',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,140,91',
                    'setLineWidth,1',
                    'rect,220,33.4,70,147.2',
                    'setLineWidth,1',
                    'rect,80,124.4,80,56.2',
                    'setLineWidth,1',
                    'rect,160,124.4,60,56.2',
                    'setLineWidth,1',
                    'rect,10,180.6,70,55.2',
                    'setLineWidth,1',
                    'rect,80,180.6,80,55.2',
                    'setLineWidth,1',
                    'rect,160,180.6,60,55.2',
                    'setLineWidth,1',
                    'rect,220,180.6,70,55.2'
                ];

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'Band1_2') {
                        e.rowHeight = 90;
                    }
                };
                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 },
                    columnWidths: [70, 80, 60, 70],
                    onRowExporting
                }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[f3,f4],f5]], short band text - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { dataField: 'f3', caption: 'f3 long line very long line' },
                                        { dataField: 'f4', caption: 'f4 long line very long line' },
                                    ]
                                },
                                { caption: 'f5 long line very long line', dataField: 'f5' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1 line',
                            f2: 'f2_1 long line very long line',
                            f3: 'f3_1',
                            f4: 'f4_1 very long line',
                            f5: 'f5_1 long line'
                        }],
                });

                const expectedLog = [
                    'text,F1,10,61,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,42.6,{baseline:middle}',
                    'text,f5 long\nline very\nlong line,220,51.8,{baseline:middle}',
                    'text,f3 long line\nvery long\nline,80,61,{baseline:middle}',
                    'text,f4 long\nline very\nlong line,160,61,{baseline:middle}',
                    'text,f1_1 line,10,134.6,{baseline:middle}',
                    'text,f3_1,80,134.6,{baseline:middle}',
                    'text,f4_1\nvery\nlong line,160,116.2,{baseline:middle}',
                    'text,f5_1 long\nline,220,125.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,92',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,140,18.4',
                    'setLineWidth,1',
                    'rect,220,33.4,70,73.6',
                    'setLineWidth,1',
                    'rect,80,51.8,80,55.2',
                    'setLineWidth,1',
                    'rect,160,51.8,60,55.2',
                    'setLineWidth,1',
                    'rect,10,107,70,55.2',
                    'setLineWidth,1',
                    'rect,80,107,80,55.2',
                    'setLineWidth,1',
                    'rect,160,107,60,55.2',
                    'setLineWidth,1',
                    'rect,220,107,70,55.2'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], short text in bands height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { caption: 'f1_2_3', columns: [
                                            { caption: 'line1', columns: [
                                                { dataField: 'f3' },
                                                { dataField: 'f4', caption: 'line1\nline2\nline3' }
                                            ] },
                                        ] },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6', dataField: 'f5' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1_1',
                            f4: 'f4_1',
                            f5: 'f5_1',
                        }],
                });

                const expectedLog = [
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,10,24.2,{baseline:middle}',
                    'text,Band1 line,80,27.88,{baseline:middle}',
                    'text,Band1_2,80,53.64,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6,220,64.68,{baseline:middle}',
                    'text,f1_2_3,80,79.4,{baseline:middle}',
                    'text,line1,80,105.16,{baseline:middle}',
                    'text,F3,80,149.32,{baseline:middle}',
                    'text,line1\nline2\nline3,160,130.92,{baseline:middle}',
                    'text,f1_1,10,189.8,{baseline:middle}',
                    'text,f3_1_1,80,189.8,{baseline:middle}',
                    'text,f4_1,160,189.8,{baseline:middle}',
                    'text,f5_1,220,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,165.6',
                    'setLineWidth,1',
                    'rect,80,15,210,25.76',
                    'setLineWidth,1',
                    'rect,80,40.76,140,25.76',
                    'setLineWidth,1',
                    'rect,220,40.76,70,139.84',
                    'setLineWidth,1',
                    'rect,80,66.52,140,25.76',
                    'setLineWidth,1',
                    'rect,80,92.28,140,25.76',
                    'setLineWidth,1',
                    'rect,80,118.04,80,62.56',
                    'setLineWidth,1',
                    'rect,160,118.04,60,62.56',
                    'setLineWidth,1',
                    'rect,10,180.6,70,18.4',
                    'setLineWidth,1',
                    'rect,80,180.6,80,18.4',
                    'setLineWidth,1',
                    'rect,160,180.6,60,18.4',
                    'setLineWidth,1',
                    'rect,220,180.6,70,18.4'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], f4.shortText, f3.shortText,f5.longText in bands height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { caption: 'f1_2_3', columns: [
                                            { caption: 'line1', columns: [
                                                { dataField: 'f3' },
                                                { dataField: 'f4', caption: 'line1' }
                                            ] },
                                        ] },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6', dataField: 'f5' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1_1',
                            f4: 'f4_1',
                            f5: 'f5_1',
                        }],
                });

                const expectedLog = [
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,10,24.2,{baseline:middle}',
                    'text,Band1 line,80,27.88,{baseline:middle}',
                    'text,Band1_2,80,58.24,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6,220,64.68,{baseline:middle}',
                    'text,f1_2_3,80,93.2,{baseline:middle}',
                    'text,line1,80,128.16,{baseline:middle}',
                    'text,F3,80,163.12,{baseline:middle}',
                    'text,line1,160,163.12,{baseline:middle}',
                    'text,f1_1,10,189.8,{baseline:middle}',
                    'text,f3_1_1,80,189.8,{baseline:middle}',
                    'text,f4_1,160,189.8,{baseline:middle}',
                    'text,f5_1,220,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,165.6',
                    'setLineWidth,1',
                    'rect,80,15,210,25.76',
                    'setLineWidth,1',
                    'rect,80,40.76,140,34.96',
                    'setLineWidth,1',
                    'rect,220,40.76,70,139.84',
                    'setLineWidth,1',
                    'rect,80,75.72,140,34.96',
                    'setLineWidth,1',
                    'rect,80,110.68,140,34.96',
                    'setLineWidth,1',
                    'rect,80,145.64,80,34.96',
                    'setLineWidth,1',
                    'rect,160,145.64,60,34.96',
                    'setLineWidth,1',
                    'rect,10,180.6,70,18.4',
                    'setLineWidth,1',
                    'rect,80,180.6,80,18.4',
                    'setLineWidth,1',
                    'rect,160,180.6,60,18.4',
                    'setLineWidth,1',
                    'rect,220,180.6,70,18.4'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], f1.shortText, f4.shortText, f3.shortText,f5.longText in bands height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { caption: 'f1_2_3', columns: [
                                            { caption: 'line1', columns: [
                                                { dataField: 'f3' },
                                                { dataField: 'f4', caption: 'line1' }
                                            ] },
                                        ] },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6', dataField: 'f5' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1_1',
                            f4: 'f4_1',
                            f5: 'f5_1',
                        }],
                });

                const expectedLog = [
                    'text,line1\nline2\nline3,10,61,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,47.2,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6,220,42.6,{baseline:middle}',
                    'text,f1_2_3,80,74.8,{baseline:middle}',
                    'text,line1,80,102.4,{baseline:middle}',
                    'text,F3,80,130,{baseline:middle}',
                    'text,line1,160,130,{baseline:middle}',
                    'text,f1_1,10,153,{baseline:middle}',
                    'text,f3_1_1,80,153,{baseline:middle}',
                    'text,f4_1,160,153,{baseline:middle}',
                    'text,f5_1,220,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,128.8',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,140,27.6',
                    'setLineWidth,1',
                    'rect,220,33.4,70,110.4',
                    'setLineWidth,1',
                    'rect,80,61,140,27.6',
                    'setLineWidth,1',
                    'rect,80,88.6,140,27.6',
                    'setLineWidth,1',
                    'rect,80,116.2,80,27.6',
                    'setLineWidth,1',
                    'rect,160,116.2,60,27.6',
                    'setLineWidth,1',
                    'rect,10,143.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,143.8,80,18.4',
                    'setLineWidth,1',
                    'rect,160,143.8,60,18.4',
                    'setLineWidth,1',
                    'rect,220,143.8,70,18.4'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], short text height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { caption: 'f1_2_3', columns: [
                                            { caption: 'line1\nline2\nline3', columns: [
                                                { dataField: 'f3' },
                                                { dataField: 'f4', caption: 'line1\nline2\nline3' }
                                            ] },
                                        ] },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f5' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1_1',
                            f4: 'f4_1',
                            f5: 'f5_1',
                        }],
                });

                const expectedLog = [
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,10,33.4,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,44.9,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,220,42.6,{baseline:middle}',
                    'text,f1_2_3,80,67.9,{baseline:middle}',
                    'text,line1\nline2\nline3,80,90.9,{baseline:middle}',
                    'text,F3,80,169.1,{baseline:middle}',
                    'text,line1\nline2\nline3,160,150.7,{baseline:middle}',
                    'text,f1_1,10,208.2,{baseline:middle}',
                    'text,f3_1_1,80,208.2,{baseline:middle}',
                    'text,f4_1,160,208.2,{baseline:middle}',
                    'text,f5_1,220,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,184',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,140,23',
                    'setLineWidth,1',
                    'rect,220,33.4,70,165.6',
                    'setLineWidth,1',
                    'rect,80,56.4,140,23',
                    'setLineWidth,1',
                    'rect,80,79.4,140,59.8',
                    'setLineWidth,1',
                    'rect,80,139.2,80,59.8',
                    'setLineWidth,1',
                    'rect,160,139.2,60,59.8',
                    'setLineWidth,1',
                    'rect,10,199,70,18.4',
                    'setLineWidth,1',
                    'rect,80,199,80,18.4',
                    'setLineWidth,1',
                    'rect,160,199,60,18.4',
                    'setLineWidth,1',
                    'rect,220,199,70,18.4'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], long text height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { caption: 'f1_2_3', columns: [
                                            { caption: 'line1\nline2\nline3', columns: [
                                                { dataField: 'f3' },
                                                { dataField: 'f4', caption: 'line1\nline2\nline3\nline4\nline5\nline6' }
                                            ] },
                                        ] },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f5' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1_1',
                            f4: 'f4_1',
                            f5: 'f5_1',
                        }],
                });

                const expectedLog = [
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,10,51.8,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,42.6,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,220,61,{baseline:middle}',
                    'text,f1_2_3,80,61,{baseline:middle}',
                    'text,line1\nline2\nline3,80,79.4,{baseline:middle}',
                    'text,F3,80,180.6,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6,160,134.6,{baseline:middle}',
                    'text,f1_1,10,245,{baseline:middle}',
                    'text,f3_1_1,80,245,{baseline:middle}',
                    'text,f4_1,160,245,{baseline:middle}',
                    'text,f5_1,220,245,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,220.8',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,140,18.4',
                    'setLineWidth,1',
                    'rect,220,33.4,70,202.4',
                    'setLineWidth,1',
                    'rect,80,51.8,140,18.4',
                    'setLineWidth,1',
                    'rect,80,70.2,140,55.2',
                    'setLineWidth,1',
                    'rect,80,125.4,80,110.4',
                    'setLineWidth,1',
                    'rect,160,125.4,60,110.4',
                    'setLineWidth,1',
                    'rect,10,235.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,235.8,80,18.4',
                    'setLineWidth,1',
                    'rect,160,235.8,60,18.4',
                    'setLineWidth,1',
                    'rect,220,235.8,70,18.4'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[f3,f4],f5]], short band text - customer height and height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { dataField: 'f3', caption: 'f3 long line very long line' },
                                        { dataField: 'f4', caption: 'f4 long line very long line' },
                                    ]
                                },
                                { caption: 'f5 long line very long line', dataField: 'f5' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1 line',
                            f2: 'f2_1 long line very long line',
                            f3: 'f3_1',
                            f4: 'f4_1 very long line',
                            f5: 'f5_1 long line'
                        }],
                });

                const expectedLog = [
                    'text,F1,10,96.8,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,Band1_2,80,78.4,{baseline:middle}',
                    'text,f5 long\nline very\nlong line,220,87.6,{baseline:middle}',
                    'text,f3 long line\nvery long\nline,80,132.6,{baseline:middle}',
                    'text,f4 long\nline very\nlong line,160,132.6,{baseline:middle}',
                    'text,f1_1 line,10,206.2,{baseline:middle}',
                    'text,f3_1,80,206.2,{baseline:middle}',
                    'text,f4_1\nvery\nlong line,160,187.8,{baseline:middle}',
                    'text,f5_1 long\nline,220,197,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,163.6',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,140,90',
                    'setLineWidth,1',
                    'rect,220,33.4,70,145.2',
                    'setLineWidth,1',
                    'rect,80,123.4,80,55.2',
                    'setLineWidth,1',
                    'rect,160,123.4,60,55.2',
                    'setLineWidth,1',
                    'rect,10,178.6,70,55.2',
                    'setLineWidth,1',
                    'rect,80,178.6,80,55.2',
                    'setLineWidth,1',
                    'rect,160,178.6,60,55.2',
                    'setLineWidth,1',
                    'rect,220,178.6,70,55.2'
                ];
                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'Band1_2') {
                        e.rowHeight = 90;
                    }
                };
                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 },
                    columnWidths: [70, 80, 60, 70],
                    onRowExporting
                }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2]]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        {
                            caption: 'Band1 line1',
                            columns: [
                                'f1',
                                { caption: 'Band1_2 long line', columns: [ 'f2' ] }
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1 line long line', f2: 'f2_1_1 very long line very long line' }],
                });

                const expectedLog = [
                    'text,Band1 line1,10,24.2,{baseline:middle}',
                    'text,F1,10,61,{baseline:middle}',
                    'text,Band1_2\nlong line,70,42.6,{baseline:middle}',
                    'text,F2,70,79.4,{baseline:middle}',
                    'text,f1_1 line\nlong line,10,116.2,{baseline:middle}',
                    'text,f2_1_1\nvery long\nline very\nlong line,70,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,130,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,60,55.2',
                    'setLineWidth,1',
                    'rect,70,33.4,70,36.8',
                    'setLineWidth,1',
                    'rect,70,70.2,70,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,60,73.6',
                    'setLineWidth,1',
                    'rect,70,88.6,70,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2, f3]]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                'f1',
                                { caption: 'Band1_2 long line very long line very long', columns: [ 'f2', { dataField: 'f3', caption: 'f3 long line very long line' } ] }
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1 line', f2: 'f2_1_2 very long line very long line', f3: 'f3_1_2 long line' }],
                });

                const expectedLog = [
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,F1,10,88.6,{baseline:middle}',
                    'text,Band1_2 long line\nvery long line very\nlong,70,42.6,{baseline:middle}',
                    'text,F2,70,116.2,{baseline:middle}',
                    'text,f3 long line\nvery long\nline,140,97.8,{baseline:middle}',
                    'text,f1_1 line,10,180.6,{baseline:middle}',
                    'text,f2_1_2\nvery long\nline very\nlong line,70,153,{baseline:middle}',
                    'text,f3_1_2\nlong line,140,171.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,210,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,60,110.4',
                    'setLineWidth,1',
                    'rect,70,33.4,150,55.2',
                    'setLineWidth,1',
                    'rect,70,88.6,70,55.2',
                    'setLineWidth,1',
                    'rect,140,88.6,80,55.2',
                    'setLineWidth,1',
                    'rect,10,143.8,60,73.6',
                    'setLineWidth,1',
                    'rect,70,143.8,70,73.6',
                    'setLineWidth,1',
                    'rect,140,143.8,80,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        { caption: 'Band2 long line', columns: [ 'f2' ] }
                    ],
                    dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 very long line very long line' }],
                });

                const expectedLog = [
                    'text,F1,10,42.6,{baseline:middle}',
                    'text,Band2\nlong line,80,24.2,{baseline:middle}',
                    'text,F2,80,61,{baseline:middle}',
                    'text,f1_1 line,10,107,{baseline:middle}',
                    'text,f2_1 very\nlong line\nvery long\nline,80,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,55.2',
                    'setLineWidth,1',
                    'rect,80,15,80,36.8',
                    'setLineWidth,1',
                    'rect,80,51.8,80,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,70,73.6',
                    'setLineWidth,1',
                    'rect,80,70.2,80,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        { caption: 'Band2 line long line very long line', columns: [ 'f2', 'f3' ] }
                    ],
                    dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 very long line very long line', f3: 'f3_1' }],
                });

                const expectedLog = [
                    'text,F1,10,42.6,{baseline:middle}',
                    'text,Band2 line long line\nvery long line,80,24.2,{baseline:middle}',
                    'text,F2,80,61,{baseline:middle}',
                    'text,F3,160,61,{baseline:middle}',
                    'text,f1_1 line,10,107,{baseline:middle}',
                    'text,f2_1 very\nlong line\nvery long\nline,80,79.4,{baseline:middle}',
                    'text,f3_1,160,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,55.2',
                    'setLineWidth,1',
                    'rect,80,15,140,36.8',
                    'setLineWidth,1',
                    'rect,80,51.8,80,18.4',
                    'setLineWidth,1',
                    'rect,160,51.8,60,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,70,73.6',
                    'setLineWidth,1',
                    'rect,80,70.2,80,73.6',
                    'setLineWidth,1',
                    'rect,160,70.2,60,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2', { caption: 'f3 long line', dataField: 'f3' } ] },
                        { caption: 'f4 very long line', dataField: 'f4' }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1 line very long line very long line', f3: 'f3_1', f4: 'f4_1 long line' }],
                });

                const expectedLog = [
                    'text,F1,10,42.6,{baseline:middle}',
                    'text,Band2,80,24.2,{baseline:middle}',
                    'text,f4 very\nlong line,220,33.4,{baseline:middle}',
                    'text,F2,80,51.8,{baseline:middle}',
                    'text,f3 long\nline,160,42.6,{baseline:middle}',
                    'text,f1_1,10,107,{baseline:middle}',
                    'text,f2_1 line\nvery long\nline very\nlong line,80,79.4,{baseline:middle}',
                    'text,f3_1,160,107,{baseline:middle}',
                    'text,f4_1 long\nline,220,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,55.2',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,220,15,70,55.2',
                    'setLineWidth,1',
                    'rect,80,33.4,80,36.8',
                    'setLineWidth,1',
                    'rect,160,33.4,60,36.8',
                    'setLineWidth,1',
                    'rect,10,70.2,70,73.6',
                    'setLineWidth,1',
                    'rect,80,70.2,80,73.6',
                    'setLineWidth,1',
                    'rect,160,70.2,60,73.6',
                    'setLineWidth,1',
                    'rect,220,70.2,70,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        {
                            caption: 'Band1 line',
                            columns: [
                                'f2',
                                {
                                    caption: 'Band1_1 long line very long line',
                                    columns: [
                                        { dataField: 'f3', caption: 'f3  long line' },
                                        { dataField: 'f4', caption: 'f4  long line very long line' }
                                    ]
                                },
                                {
                                    caption: 'Band1_2',
                                    columns: [{ dataField: 'f5', caption: 'f5 long line very long line' }, 'f6']
                                },
                                {
                                    caption: 'f7 long line very long linelong line very long linelong line very long linelong line very long line',
                                    dataField: 'f7'
                                }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1 line',
                            f2: 'f2_1 long line very long line',
                            f3: 'f3_1',
                            f4: 'f4_1 very long line very long line very long line',
                            f5: 'f5_1 long line', f6: 'f6_1', f7: 'f7_1 line'
                        }],
                });

                const expectedLog = [
                    'text,F1,10,180.6,{baseline:middle}',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'text,F2,80,189.8,{baseline:middle}',
                    'text,Band1_1 long line\nvery long line,160,88.6,{baseline:middle}',
                    'text,Band1_2,290,97.8,{baseline:middle}',
                    'text,f7 long\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong\nline,380,42.6,{baseline:middle}',
                    'text,f3  long\nline,160,245,{baseline:middle}',
                    'text,f4  long\nline very\nlong line,220,235.8,{baseline:middle}',
                    'text,f5 long\nline\nvery\nlong\nline,290,217.4,{baseline:middle}',
                    'text,F6,340,254.2,{baseline:middle}',
                    'text,f1_1 line,10,392.2,{baseline:middle}',
                    'text,f2_1 long\nline very\nlong line,80,373.8,{baseline:middle}',
                    'text,f3_1,160,392.2,{baseline:middle}',
                    'text,f4_1 very\nlong line\nvery long\nline very\nlong line,220,355.4,{baseline:middle}',
                    'text,f5_1\nlong\nline,290,373.8,{baseline:middle}',
                    'text,f6_1,340,392.2,{baseline:middle}',
                    'text,f7_1\nline,380,383,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,331.2',
                    'setLineWidth,1',
                    'rect,80,15,350,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,80,312.8',
                    'setLineWidth,1',
                    'rect,160,33.4,130,128.8',
                    'setLineWidth,1',
                    'rect,290,33.4,90,128.8',
                    'setLineWidth,1',
                    'rect,380,33.4,50,312.8',
                    'setLineWidth,1',
                    'rect,160,162.2,60,184',
                    'setLineWidth,1',
                    'rect,220,162.2,70,184',
                    'setLineWidth,1',
                    'rect,290,162.2,50,184',
                    'setLineWidth,1',
                    'rect,340,162.2,40,184',
                    'setLineWidth,1',
                    'rect,10,346.2,70,92',
                    'setLineWidth,1',
                    'rect,80,346.2,80,92',
                    'setLineWidth,1',
                    'rect,160,346.2,60,92',
                    'setLineWidth,1',
                    'rect,220,346.2,70,92',
                    'setLineWidth,1',
                    'rect,290,346.2,50,92',
                    'setLineWidth,1',
                    'rect,340,346.2,40,92',
                    'setLineWidth,1',
                    'rect,380,346.2,50,92'
                ];

                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 },
                    columnWidths: [70, 80, 60, 70, 50, 40, 50]
                }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('WordWrap with grouping', moduleConfig, () => {
            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        {
                            f1: 'f1 line line',
                            f2: 'f1_2 line long line',
                            f3: 'f1_3 line long line long line'
                        },
                        {
                            f1: 'f1 long line long line long line',
                            f2: 'f2_2 line',
                            f3: 'f2_3 line long line line'
                        },
                    ],
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,100,24.2,{baseline:middle}',
                    'text,F1: f1 line line,10,42.6,{baseline:middle}',
                    'text,f1_2 line\nlong line,20,70.2,{baseline:middle}',
                    'text,f1_3 line\nlong line\nlong line,100,61,{baseline:middle}',
                    'text,F1: f1 long line long line\nlong line,10,116.2,{baseline:middle}',
                    'text,f2_2 line,20,171.4,{baseline:middle}',
                    'text,f2_3 line\nlong line\nline,100,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,80,55.2',
                    'setLineWidth,1',
                    'rect,100,51.8,80,55.2',
                    'setLineWidth,1',
                    'rect,10,107,170,36.8',
                    'setLineWidth,1',
                    'rect,20,143.8,80,55.2',
                    'setLineWidth,1',
                    'rect,100,143.8,80,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [90, 80] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1 long line',
                            f2: 'f1_2 long line long line long line',
                            f3: 'f1_3 line'
                        },
                        {
                            f1: 'f2_1 long line long line long line',
                            f2: 'f2_2 line long line',
                            f3: 'f2_3'
                        },
                    ],
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,100,24.2,{baseline:middle}',
                    'text,F1: f1_1 long line,10,42.6,{baseline:middle}',
                    'text,f1_2 long\nline long\nline long\nline,20,61,{baseline:middle}',
                    'text,f1_3 line,100,88.6,{baseline:middle}',
                    'text,F1: f2_1 long line long\nline long line,10,134.6,{baseline:middle}',
                    'text,f2_2 line\nlong line,20,171.4,{baseline:middle}',
                    'text,f2_3,100,180.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,80,73.6',
                    'setLineWidth,1',
                    'rect,100,51.8,80,73.6',
                    'setLineWidth,1',
                    'rect,10,125.4,170,36.8',
                    'setLineWidth,1',
                    'rect,20,162.2,80,36.8',
                    'setLineWidth,1',
                    'rect,100,162.2,80,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [90, 80] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                    ],
                    dataSource: [
                        {
                            f1: 'f1 long line long line long line',
                            f2: 'f1_2 long line',
                            f3: 'f1_3 line',
                            f4: 'f1_4'
                        },
                        {
                            f1: 'f1 long line',
                            f2: 'f2_2 long line long line long line long line',
                            f3: 'f2_3 long line long line',
                            f4: 'f2_4'
                        },
                    ],
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,100,24.2,{baseline:middle}',
                    'text,F1: f1 long line,10,42.6,{baseline:middle}',
                    'text,F2: f2_2 long line long\nline long line long line,20,61,{baseline:middle}',
                    'text,f2_3 long\nline long\nline,30,97.8,{baseline:middle}',
                    'text,f2_4,100,116.2,{baseline:middle}',
                    'text,F1: f1 long line long line\nlong line,10,153,{baseline:middle}',
                    'text,F2: f1_2 long line,20,189.8,{baseline:middle}',
                    'text,f1_3 line,30,208.2,{baseline:middle}',
                    'text,f1_4,100,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,160,36.8',
                    'setLineWidth,1',
                    'rect,30,88.6,70,55.2',
                    'setLineWidth,1',
                    'rect,100,88.6,80,55.2',
                    'setLineWidth,1',
                    'rect,10,143.8,170,36.8',
                    'setLineWidth,1',
                    'rect,20,180.6,160,18.4',
                    'setLineWidth,1',
                    'rect,30,199,70,18.4',
                    'setLineWidth,1',
                    'rect,100,199,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [90, 80] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('WordWrap with summaries and totals', moduleConfig, () => {
            QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    summary: {
                        groupItems: [ { column: 'f1', summaryType: 'max' } ]
                    },
                    dataSource: [{ f1: 'f1 line long line', f2: 'f2 line', f3: 'f3 long line long line long line', f4: 'f4 long line' }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,90,24.2,{baseline:middle}',
                    'text,F4,180,24.2,{baseline:middle}',
                    'text,F1: f1 line long line (Max: f1 line\nlong line),10,42.6,{baseline:middle}',
                    'text,f2 line,20,97.8,{baseline:middle}',
                    'text,f3 long line\nlong line\nlong line,90,79.4,{baseline:middle}',
                    'text,f4 long line,180,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'setLineWidth,1',
                    'rect,180,15,80,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,250,36.8',
                    'setLineWidth,1',
                    'rect,20,70.2,70,55.2',
                    'setLineWidth,1',
                    'rect,90,70.2,90,55.2',
                    'setLineWidth,1',
                    'rect,180,70.2,80,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1, f3, f4], groupItems: [f1, {f4, alignByColumn}] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 0 },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f1', summaryType: 'max' },
                            { column: 'f4', summaryType: 'max', alignByColumn: true }
                        ]
                    },
                    dataSource: [{ f1: 'f1 long line long line long line', f2: 'f2 long line', f3: 'f3 line', f4: 'f4 long line long line' }]
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,260,24.2,{baseline:middle}',
                    'text,F1: f1 long line long line long line\n(Max: f1 long line long line long\nline),10,42.6,{baseline:middle}',
                    'text,Max: f4 long\nline long line,260,51.8,{baseline:middle}',
                    'text,F2: f2 long line (Max of F1 is f1\nlong line long line long line),20,97.8,{baseline:middle}',
                    'text,Max: f4 long\nline long line,260,97.8,{baseline:middle}',
                    'text,f3 line,30,143.8,{baseline:middle}',
                    'text,f4 long line\nlong line,260,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,250,18.4',
                    'setLineWidth,1',
                    'rect,260,15,100,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,260,33.4',
                    'line,10,33.4,10,88.6',
                    'line,10,88.6,260,88.6',
                    'setLineWidth,1',
                    'line,260,33.4,360,33.4',
                    'line,360,33.4,360,88.6',
                    'line,260,88.6,360,88.6',
                    'setLineWidth,1',
                    'line,20,88.6,260,88.6',
                    'line,20,88.6,20,125.4',
                    'line,20,125.4,260,125.4',
                    'setLineWidth,1',
                    'line,260,88.6,360,88.6',
                    'line,360,88.6,360,125.4',
                    'line,260,125.4,360,125.4',
                    'setLineWidth,1',
                    'rect,30,125.4,230,36.8',
                    'setLineWidth,1',
                    'rect,260,125.4,100,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, showInGroupFooter }] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f1', summaryType: 'max' },
                            { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                        ]
                    },
                    dataSource: [{ f1: 'f1 long line', f2: 'f2 very long line very long line', f3: 'f3 line', f4: 'f4 long line' }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,160,24.2,{baseline:middle}',
                    'text,F4,250,24.2,{baseline:middle}',
                    'text,F1: f1 long line (Max: f1 long line),10,42.6,{baseline:middle}',
                    'text,f2 very long line\nvery long line,20,61,{baseline:middle}',
                    'text,f3 line,160,70.2,{baseline:middle}',
                    'text,f4 long line,250,70.2,{baseline:middle}',
                    'text,Max: f3 line,160,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,150,18.4',
                    'setLineWidth,1',
                    'rect,160,15,90,18.4',
                    'setLineWidth,1',
                    'rect,250,15,80,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,320,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,140,36.8',
                    'setLineWidth,1',
                    'rect,160,51.8,90,36.8',
                    'setLineWidth,1',
                    'rect,250,51.8,80,36.8',
                    'setLineWidth,1',
                    'rect,20,88.6,140,18.4',
                    'setLineWidth,1',
                    'rect,160,88.6,90,18.4',
                    'setLineWidth,1',
                    'rect,250,88.6,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    summary: {
                        groupItems: [{ column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }]
                    },
                    dataSource: [{
                        f1: 'f1 long line',
                        f2: 'f2 long line long line long line',
                        f3: 'f3 line long line long line',
                        f4: 'f4 line'
                    }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,90,24.2,{baseline:middle}',
                    'text,F4,180,24.2,{baseline:middle}',
                    'text,F1: f1 long line,10,42.6,{baseline:middle}',
                    'text,f2 long\nline long\nline long\nline,20,61,{baseline:middle}',
                    'text,f3 line long\nline long line,90,79.4,{baseline:middle}',
                    'text,f4 line,180,88.6,{baseline:middle}',
                    'text,Max: f3 line\nlong line\nlong line,90,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'setLineWidth,1',
                    'rect,180,15,80,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,250,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,70,73.6',
                    'setLineWidth,1',
                    'rect,90,51.8,90,73.6',
                    'setLineWidth,1',
                    'rect,180,51.8,80,73.6',
                    'setLineWidth,1',
                    'rect,20,125.4,70,55.2',
                    'setLineWidth,1',
                    'rect,90,125.4,90,55.2',
                    'setLineWidth,1',
                    'rect,180,125.4,80,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [80, 90, 80] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3], 2 groups, height auto, wordWrapEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f3', summaryType: 'max' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1 very ling line very long line very long line', f2: 'f2_1 line', f3: 'f3line1\nline2\nline3\nline4', f4: 'f4' },
                        { f1: 'f1 very long line very long line', f2: 'f2_2very long line very long line', f3: 'f3very long line very long line', f4: 'f4' }
                    ]
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,90,24.2,{baseline:middle}',
                    'text,F1: f1 very ling line very\nlong line very long line,10,42.6,{baseline:middle}',
                    'text,F2: f2_1 line,20,79.4,{baseline:middle}',
                    'text,f3line1\nline2\nline3\nline4,30,97.8,{baseline:middle}',
                    'text,f4,90,125.4,{baseline:middle}',
                    'text,Max:\nf3line1\nline2\nline3\nline4,30,171.4,{baseline:middle}',
                    'text,Max:\nf3line1\nline2\nline3\nline4,20,263.4,{baseline:middle}',
                    'text,F1: f1 very long line\nvery long line,10,355.4,{baseline:middle}',
                    'text,F2: f2_2very long line\nvery long line,20,392.2,{baseline:middle}',
                    'text,f3very\nlong line\nvery\nlong line,30,429,{baseline:middle}',
                    'text,f4,90,456.6,{baseline:middle}',
                    'text,Max:\nf3very\nlong line\nvery\nlong line,30,502.6,{baseline:middle}',
                    'text,Max:\nf3very\nlong line\nvery long\nline,20,594.6,{baseline:middle}',
                    'text,Max:\nf3very long\nline very\nlong line,10,686.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,170,36.8',
                    'setLineWidth,1',
                    'rect,20,70.2,160,18.4',
                    'setLineWidth,1',
                    'rect,30,88.6,60,73.6',
                    'setLineWidth,1',
                    'rect,90,88.6,90,73.6',
                    'setLineWidth,1',
                    'rect,30,162.2,60,92',
                    'setLineWidth,1',
                    'rect,90,162.2,90,92',
                    'setLineWidth,1',
                    'rect,20,254.2,70,92',
                    'setLineWidth,1',
                    'rect,90,254.2,90,92',
                    'setLineWidth,1',
                    'rect,10,346.2,170,36.8',
                    'setLineWidth,1',
                    'rect,20,383,160,36.8',
                    'setLineWidth,1',
                    'rect,30,419.8,60,73.6',
                    'setLineWidth,1',
                    'rect,90,419.8,90,73.6',
                    'setLineWidth,1',
                    'rect,30,493.4,60,92',
                    'setLineWidth,1',
                    'rect,90,493.4,90,92',
                    'setLineWidth,1',
                    'rect,20,585.4,70,92',
                    'setLineWidth,1',
                    'rect,90,585.4,90,92',
                    'setLineWidth,1',
                    'rect,10,677.4,80,73.6',
                    'setLineWidth,1',
                    'rect,90,677.4,90,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('WordWrap with summaries, totals and bands', moduleConfig, () => {
            QUnit.test('[band1-[f1, f2]], f1.groupIndex=0,f2.groupIndex=0 - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 long line 1 ling line 2', columns: [
                            { dataField: 'f1', groupIndex: 0 },
                            { dataField: 'f2', groupIndex: 0 }
                        ] }
                    ],
                    dataSource: [
                        { f1: 'f1_1 line', f2: 'f2_1 line long line long line' }],
                });

                const expectedLog = [
                    'text,Band1\nlong line\n1 ling line\n2,10,24.2,{baseline:middle}',
                    'text,F1: f1_1\nline,10,97.8,{baseline:middle}',
                    'text,F2: f2_1\nline long\nline long\nline,20,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,73.6',
                    'setLineWidth,1',
                    'rect,10,88.6,70,36.8',
                    'setLineWidth,1',
                    'rect,20,125.4,60,73.6',
                    'setLineWidth,1',
                    'rect,30,199,50,0'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2], f3], f1.groupIndex=0,f2.groupIndex=1, summary: groupItems:f1 - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 long line 1 ling line 2', columns: [
                            { dataField: 'f1', groupIndex: 0 },
                            { dataField: 'f2', groupIndex: 1 }
                        ] },
                        { dataField: 'f3', caption: 'f3 line' }
                    ],
                    summary: {
                        groupItems: [ { column: 'f1', summaryType: 'max' } ]
                    },
                    dataSource: [
                        { f1: 'f1_1 line', f2: 'f2_1 line long line long line', f3: 'long line very long line' }],
                });

                const expectedLog = [
                    'text,Band1\nlong line\n1 ling line\n2,10,24.2,{baseline:middle}',
                    'text,f3 line,80,51.8,{baseline:middle}',
                    'text,F1: f1_1 line (Max:\nf1_1 line),10,97.8,{baseline:middle}',
                    'text,F2: f2_1 line long\nline long line (Max\nof F1 is f1_1 line),20,134.6,{baseline:middle}',
                    'text,long line\nvery long\nline,80,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,73.6',
                    'setLineWidth,1',
                    'rect,80,15,70,73.6',
                    'setLineWidth,1',
                    'rect,10,88.6,140,36.8',
                    'setLineWidth,1',
                    'rect,20,125.4,130,55.2',
                    'setLineWidth,1',
                    'rect,30,180.6,50,55.2',
                    'setLineWidth,1',
                    'rect,80,180.6,70,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]], f1.groupIndex:0, f2.groupIndex 1 - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        {
                            caption: 'Band1 line',
                            columns: [
                                { dataField: 'f2', groupIndex: 1 },
                                {
                                    caption: 'Band1_1 long line very long line',
                                    columns: [
                                        { dataField: 'f3', caption: 'f3  long line' },
                                        { dataField: 'f4', caption: 'f4  long line very long line' }
                                    ]
                                },
                                {
                                    caption: 'Band1_2',
                                    columns: [{ dataField: 'f5', caption: 'f5 long line very long line' }, 'f6']
                                },
                                {
                                    caption: 'f7 long line very long linelong line very long linelong line very long linelong line very long line',
                                    dataField: 'f7'
                                }
                            ]
                        }
                    ],
                    dataSource: [{
                        f1: 'f1_1 line',
                        f2: 'f2_1 long line very long line',
                        f3: 'f3_1',
                        f4: 'f4_1 very long line very long line very long line',
                        f5: 'f5_1 long line', f6: 'f6_1', f7: 'f7_1 line'
                    }],
                });

                const expectedLog = [
                    'text,Band1 line,10,24.2,{baseline:middle}',
                    'text,Band1_1 long line\nvery long line,10,97.8,{baseline:middle}',
                    'text,Band1_2,160,107,{baseline:middle}',
                    'text,f7 long\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong\nline,290,42.6,{baseline:middle}',
                    'text,f3  long\nline,10,254.2,{baseline:middle}',
                    'text,f4  long\nline very\nlong line,80,245,{baseline:middle}',
                    'text,f5 long\nline very\nlong line,160,245,{baseline:middle}',
                    'text,F6,220,263.4,{baseline:middle}',
                    'text,F1: f1_1 line,10,355.4,{baseline:middle}',
                    'text,F2: f2_1 long line very long line,20,373.8,{baseline:middle}',
                    'text,f3_1,30,429,{baseline:middle}',
                    'text,f4_1 very\nlong line\nvery long\nline very\nlong line,80,392.2,{baseline:middle}',
                    'text,f5_1\nlong line,160,419.8,{baseline:middle}',
                    'text,f6_1,220,429,{baseline:middle}',
                    'text,f7_1\nline,290,419.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,330,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,150,147.2',
                    'setLineWidth,1',
                    'rect,160,33.4,130,147.2',
                    'setLineWidth,1',
                    'rect,290,33.4,50,312.8',
                    'setLineWidth,1',
                    'rect,10,180.6,70,165.6',
                    'setLineWidth,1',
                    'rect,80,180.6,80,165.6',
                    'setLineWidth,1',
                    'rect,160,180.6,60,165.6',
                    'setLineWidth,1',
                    'rect,220,180.6,70,165.6',
                    'setLineWidth,1',
                    'rect,10,346.2,330,18.4',
                    'setLineWidth,1',
                    'rect,20,364.6,320,18.4',
                    'setLineWidth,1',
                    'rect,30,383,50,92',
                    'setLineWidth,1',
                    'rect,80,383,80,92',
                    'setLineWidth,1',
                    'rect,160,383,60,92',
                    'setLineWidth,1',
                    'rect,220,383,70,92',
                    'setLineWidth,1',
                    'rect,290,383,50,92'
                ];

                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 },
                    columnWidths: [70, 80, 60, 70, 50]
                }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfWordWrapTests };
