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
                    'setFontSize,16'
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
                    'setFontSize,16'
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
                    'setFontSize,16'
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
                    'setFontSize,16'
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
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
                    'setFontSize,16'
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
                    'setFontSize,16'
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
                    'setFontSize,16'
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
                    'setFontSize,16'
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
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
                    'setFontSize,16'
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
                    'setFontSize,16'
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
                    'setFontSize,16'
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
                    'setFontSize,16'
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
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
                    'setFontSize,16'
                ];

                const onRowExporting = (e) => { e.rowCells[0].font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
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
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,20',
                    'text,long line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,20',
                    'text,long line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setFontSize,20',
                    'text,long line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,23',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setFontSize,20',
                    'text,long line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,23',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,30',
                    'text,big line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,30',
                    'text,big line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,34.5',
                    'setFontSize,30',
                    'text,big line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,34.5',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,34.5',
                    'setFontSize,30',
                    'text,big line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,34.5',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,20',
                    'text,long line long line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,20',
                    'text,long line\nlong line,110,33.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setFontSize,20',
                    'text,long line long line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,23',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,46',
                    'setFontSize,20',
                    'text,long line\nlong line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,46',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,30',
                    'text,big line big line,110,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,30',
                    'text,big line\nbig line,110,27.75,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,60',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,34.5',
                    'setFontSize,30',
                    'text,big line big line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,34.5',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setFontSize,30',
                    'text,big line\nbig line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,69',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,80',
                    'setFontSize,20',
                    'text,long line long line long line,110,55,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,80',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,80',
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,110,32,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,80',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setFontSize,20',
                    'text,long line long line long line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,23',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setFontSize,20',
                    'text,long line\nlong line\nlong line,110,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,69',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,90',
                    'setFontSize,30',
                    'text,big line big line big line,110,60,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,90',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,90',
                    'setFontSize,30',
                    'text,big line\nbig line\nbig line,110,25.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,90',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,34.5',
                    'setFontSize,30',
                    'text,big line big line big line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,34.5',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,103.5',
                    'setFontSize,30',
                    'text,big line\nbig line\nbig line,110,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,103.5',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setFontSize,30',
                    'text,big line big line big line,110,49.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,110,15,100,69',
                    'setFontSize,16'
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
                    'setLineWidth,1',
                    'rect,10,15,100,36.8',
                    'text,F1,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,51.8,100,18.4',
                    'text,f1_1 long line\nvery long line,10,79.4,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,140,36.8',
                    'text,F1,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,51.8,70,18.4',
                    'text,F2,80,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,51.8,70,18.4',
                    'text,f1_1 line,10,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,70.2,70,55.2',
                    'text,f2_1 line\nlong line\nlong line,80,79.4,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,210,18.4',
                    'text,F1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,70,18.4',
                    'text,F2,80,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,33.4,70,18.4',
                    'text,F3,150,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,150,33.4,70,18.4',
                    'text,f1_1 line,10,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,51.8,70,55.2',
                    'text,f2_1 line\nlong line\nlong line,80,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,51.8,70,55.2',
                    'text,f3,150,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,150,51.8,70,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ] }).then(() => {
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
                    'setLineWidth,1',
                    'rect,10,15,70,165.6',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'text,Band1_2,80,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,33.4,140,55.2',
                    'text,f5 long\nline very\nlong line\nlong line\nvery long\nline long\nline very\nlong line,220,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,33.4,70,147.2',
                    'text,f3 long line\nvery long\nline,80,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,88.6,80,92',
                    'text,f4 long\nline very\nlong line,160,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,88.6,60,92',
                    'text,f1_1 line,10,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,180.6,70,55.2',
                    'text,f3_1,80,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,180.6,80,55.2',
                    'text,f4_1\nvery\nlong line,160,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,180.6,60,55.2',
                    'text,f5_1 long\nline,220,199,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,70,165.6',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'text,Band1_2,80,78.9,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,33.4,140,91',
                    'text,f5 long\nline very\nlong line\nlong line\nvery long\nline long\nline very\nlong line,220,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,33.4,70,147.2',
                    'text,f3 long line\nvery long\nline,80,134.1,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,124.4,80,56.2',
                    'text,f4 long\nline very\nlong line,160,134.1,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,124.4,60,56.2',
                    'text,f1_1 line,10,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,180.6,70,55.2',
                    'text,f3_1,80,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,180.6,80,55.2',
                    'text,f4_1\nvery\nlong line,160,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,180.6,60,55.2',
                    'text,f5_1 long\nline,220,199,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,70,92',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'text,Band1_2,80,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,33.4,140,18.4',
                    'text,f5 long\nline very\nlong line,220,51.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,33.4,70,73.6',
                    'text,f3 long line\nvery long\nline,80,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,51.8,80,55.2',
                    'text,f4 long\nline very\nlong line,160,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,51.8,60,55.2',
                    'text,f1_1 line,10,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,107,70,55.2',
                    'text,f3_1,80,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,107,80,55.2',
                    'text,f4_1\nvery\nlong line,160,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,107,60,55.2',
                    'text,f5_1 long\nline,220,125.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,107,70,55.2'
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
                    'setLineWidth,1',
                    'rect,10,15,70,163.6',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,15,210,18.4',
                    'text,Band1_2,80,78.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,33.4,140,90',
                    'text,f5 long\nline very\nlong line,220,87.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,33.4,70,145.2',
                    'text,f3 long line\nvery long\nline,80,132.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,123.4,80,55.2',
                    'text,f4 long\nline very\nlong line,160,132.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,123.4,60,55.2',
                    'text,f1_1 line,10,206.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,178.6,70,55.2',
                    'text,f3_1,80,206.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,178.6,80,55.2',
                    'text,f4_1\nvery\nlong line,160,187.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,178.6,60,55.2',
                    'text,f5_1 long\nline,220,197,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,130,18.4',
                    'text,F1,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,60,55.2',
                    'text,Band1_2\nlong line,70,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,70,33.4,70,36.8',
                    'text,F2,70,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,70,70.2,70,18.4',
                    'text,f1_1 line\nlong line,10,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,88.6,60,73.6',
                    'text,f2_1_1\nvery long\nline very\nlong line,70,97.8,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,210,18.4',
                    'text,F1,10,88.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,60,110.4',
                    'text,Band1_2 long line\nvery long line very\nlong,70,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,70,33.4,150,55.2',
                    'text,F2,70,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,70,88.6,70,55.2',
                    'text,f3 long line\nvery long\nline,140,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,140,88.6,80,55.2',
                    'text,f1_1 line,10,180.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,143.8,60,73.6',
                    'text,f2_1_2\nvery long\nline very\nlong line,70,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,70,143.8,70,73.6',
                    'text,f3_1_2\nlong line,140,171.4,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,70,55.2',
                    'text,Band2\nlong line,80,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,15,80,36.8',
                    'text,F2,80,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,51.8,80,18.4',
                    'text,f1_1 line,10,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,70.2,70,73.6',
                    'text,f2_1 very\nlong line\nvery long\nline,80,79.4,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,70,55.2',
                    'text,Band2 line long line\nvery long line,80,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,15,140,36.8',
                    'text,F2,80,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,51.8,80,18.4',
                    'text,F3,160,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,51.8,60,18.4',
                    'text,f1_1 line,10,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,70.2,70,73.6',
                    'text,f2_1 very\nlong line\nvery long\nline,80,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,70.2,80,73.6',
                    'text,f3_1,160,107,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,70,55.2',
                    'text,Band2,80,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'text,f4 very\nlong line,220,33.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,15,70,55.2',
                    'text,F2,80,51.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,33.4,80,36.8',
                    'text,f3 long\nline,160,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,33.4,60,36.8',
                    'text,f1_1,10,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,70.2,70,73.6',
                    'text,f2_1 line\nvery long\nline very\nlong line,80,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,70.2,80,73.6',
                    'text,f3_1,160,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,70.2,60,73.6',
                    'text,f4_1 long\nline,220,97.8,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,70,331.2',
                    'text,Band1 line,80,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,15,350,18.4',
                    'text,F2,80,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,33.4,80,312.8',
                    'text,Band1_1 long line\nvery long line,160,88.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,33.4,130,128.8',
                    'text,Band1_2,290,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,290,33.4,90,128.8',
                    'text,f7 long\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong\nline,380,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,380,33.4,50,312.8',
                    'text,f3  long\nline,160,245,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,162.2,60,184',
                    'text,f4  long\nline very\nlong line,220,235.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,162.2,70,184',
                    'text,f5 long\nline\nvery\nlong\nline,290,217.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,290,162.2,50,184',
                    'text,F6,340,254.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,340,162.2,40,184',
                    'text,f1_1 line,10,392.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,346.2,70,92',
                    'text,f2_1 long\nline very\nlong line,80,373.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,346.2,80,92',
                    'text,f3_1,160,392.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,346.2,60,92',
                    'text,f4_1 very\nlong line\nvery long\nline very\nlong line,220,355.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,346.2,70,92',
                    'text,f5_1\nlong\nline,290,373.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,290,346.2,50,92',
                    'text,f6_1,340,392.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,340,346.2,40,92',
                    'text,f7_1\nline,380,383,{baseline:middle}',
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
    }
};

export { JSPdfWordWrapTests };
