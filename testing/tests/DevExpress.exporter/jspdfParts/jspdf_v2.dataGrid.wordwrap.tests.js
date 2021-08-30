import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

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
                    'text,Band1_2,80,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,33.4,140,18.4',
                    'text,f5 long\nline very\nlong line\nlong line\nvery long\nline long\nline very\nlong line,220,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,33.4,70,147.2',
                    'text,f3 long line\nvery long\nline,80,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,51.8,80,128.8',
                    'text,f4 long\nline very\nlong line,160,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,51.8,60,128.8',
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
                    'text,Band1_2,80,78.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,33.4,140,90',
                    'text,f5 long\nline very\nlong line\nlong line\nvery long\nline long\nline very\nlong line,220,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,33.4,70,147.2',
                    'text,f3 long line\nvery long\nline,80,133.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,123.4,80,57.2',
                    'text,f4 long\nline very\nlong line,160,133.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,123.4,60,57.2',
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

            QUnit.test('[band1-[f1, f2]] - splitToTablesByColumns: [f2] height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 line 1', columns: ['f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1 long line', f2: 'f2_1 very long line very long line long line' }],
                });

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1\nline 1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,65,36.8',
                    'text,F1,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,51.8,65,18.4',
                    'text,f1_1\nlong line,10,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,70.2,65,92',
                    'addPage,',
                    'text,Band1 line\n1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,75,36.8',
                    'text,F2,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,51.8,75,18.4',
                    'text,f2_1 very\nlong line\nvery long\nline long\nline,10,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,70.2,75,92'
                ];

                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 },
                    columnWidths: [65, 75],
                    splitToTablesByColumns
                }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1], f2]] - splitToTablesByColumns: [f2] height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                { caption: 'Band1_1', columns: [ 'f1' ] },
                                'f2',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1 line', f2: 'f2_1 very long line very long line' }],
                });

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,18.4',
                    'text,Band1_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,70,18.4',
                    'text,F1,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,51.8,70,18.4',
                    'text,f1_1_1\nline,10,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,70.2,70,73.6',
                    'addPage,',
                    'text,Band1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F2,10,51.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,80,36.8',
                    'text,f2_1 very\nlong line\nvery long\nline,10,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,70.2,80,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], splitToTablesByColumns }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]] - splitToTablesByColumns: [f2,f3] height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                { caption: 'Band1_1 long line', columns: [ 'f1', 'f2' ] },
                                'f3',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1 very long line very long line', f2: 'f2_1_1 line', f3: 'f3_1 long line' }],
                });

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,60,18.4',
                    'text,Band1_\n1 long\nline,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,60,55.2',
                    'text,F1,10,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,88.6,60,18.4',
                    'text,f1_1_1\nvery\nlong line\nvery\nlong line,10,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,107,60,92',
                    'addPage,',
                    'text,Band1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,18.4',
                    'text,Band1_1\nlong line,10,51.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,70,55.2',
                    'text,F2,10,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,88.6,70,18.4',
                    'text,f2_1_1\nline,10,143.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,107,70,92',
                    'addPage,',
                    'text,Band1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F3,10,70.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,80,73.6',
                    'text,f3_1 long\nline,10,143.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,107,80,92'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], splitToTablesByColumns }).then(() => {
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

            QUnit.test('[f1, band2-[f2,f3]] - splitToTablesByColumns: [f3] height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        { caption: 'Band2 long line', columns: [ { dataField: 'f2', caption: 'f2 long line very long line' }, 'f3' ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1 very long line', f3: 'f3_1' }],
                });

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,92',
                    'text,Band2\nlong line,80,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,15,80,36.8',
                    'text,f2 long line\nvery long\nline,80,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,51.8,80,55.2',
                    'text,f1_1,10,125.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,107,70,36.8',
                    'text,f2_1 very\nlong line,80,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,80,107,80,36.8',
                    'addPage,',
                    'text,Band2\nlong line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,60,36.8',
                    'text,F3,10,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,51.8,60,55.2',
                    'text,f3_1,10,125.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,107,60,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], splitToTablesByColumns }).then(() => {
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

            QUnit.test('[f1, band2-[f2,f3], f4] - splitToTablesByColumns: [f2] height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1',
                        { caption: 'Band2 long line', columns: [ 'f2', { dataField: 'f3', caption: 'f3 line long line long line' } ] },
                        'f4'
                    ],
                    dataSource: [{ f1: 'f1_1 line long line', f2: 'f2_1 very long line very long line', f3: 'f3_1', f4: 'f4_1' }],
                });

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,51.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,73.6',
                    'text,f1_1 line\nlong line,10,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,88.6,70,73.6',
                    'addPage,',
                    'text,Band2 long line,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,140,18.4',
                    'text,F4,150,51.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,150,15,70,73.6',
                    'text,F2,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,80,55.2',
                    'text,f3 line\nlong line\nlong line,90,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,33.4,60,55.2',
                    'text,f2_1 very\nlong line\nvery long\nline,10,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,88.6,80,73.6',
                    'text,f3_1,90,125.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,88.6,60,73.6',
                    'text,f4_1,150,125.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,150,88.6,70,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], splitToTablesByColumns }).then(() => {
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
                    'text,Band1_1 long line\nvery long line,160,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,33.4,130,36.8',
                    'text,Band1_2,290,51.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,290,33.4,90,36.8',
                    'text,f7 long\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong\nline,380,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,380,33.4,50,312.8',
                    'text,f3  long\nline,160,199,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,70.2,60,276',
                    'text,f4  long\nline very\nlong line,220,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,70.2,70,276',
                    'text,f5 long\nline\nvery\nlong\nline,290,171.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,290,70.2,50,276',
                    'text,F6,340,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,340,70.2,40,276',
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

            QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]], customer height and height auto', function(assert) {
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
                    'text,Band1_1 long line\nvery long line,160,124.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,33.4,130,200',
                    'text,Band1_2,290,133.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,290,33.4,90,200',
                    'text,f7 long\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong li\nnelong\nline\nvery\nlong\nline,380,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,380,33.4,50,312.8',
                    'text,f3  long\nline,160,280.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,233.4,60,112.8',
                    'text,f4  long\nline very\nlong line,220,271.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,220,233.4,70,112.8',
                    'text,f5 long\nline\nvery\nlong\nline,290,253,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,290,233.4,50,112.8',
                    'text,F6,340,289.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,340,233.4,40,112.8',
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

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 200;
                    }
                };

                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 },
                    columnWidths: [70, 80, 60, 70, 50, 40, 50],
                    onRowExporting
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
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'text,F3,100,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'text,F1: f1 line line,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'text,f1_2 line\nlong line,20,70.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,80,55.2',
                    'text,f1_3 line\nlong line\nlong line,100,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,51.8,80,55.2',
                    'text,F1: f1 long line long line\nlong line,10,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,107,170,36.8',
                    'text,f2_2 line,20,171.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,143.8,80,55.2',
                    'text,f2_3 line\nlong line\nline,100,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,143.8,80,55.2'
                ];

                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 }, columnWidths: [90, 80], onRowExporting: () => {
                    }
                }).then(() => {
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
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'text,F3,100,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'text,F1: f1_1 long line,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'text,f1_2 long\nline long\nline long\nline,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,80,73.6',
                    'text,f1_3 line,100,88.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,51.8,80,73.6',
                    'text,F1: f2_1 long line long\nline long line,10,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,125.4,170,36.8',
                    'text,f2_2 line\nlong line,20,171.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,162.2,80,36.8',
                    'text,f2_3,100,180.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,162.2,80,36.8'
                ];

                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 }, columnWidths: [90, 80], onRowExporting: () => {
                    }
                }).then(() => {
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
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'text,F4,100,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'text,F1: f1 long line,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'text,F2: f2_2 long line long\nline long line long line,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,160,36.8',
                    'text,f2_3 long\nline long\nline,30,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,88.6,70,55.2',
                    'text,f2_4,100,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,88.6,80,55.2',
                    'text,F1: f1 long line long line\nlong line,10,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,143.8,170,36.8',
                    'text,F2: f1_2 long line,20,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,180.6,160,18.4',
                    'text,f1_3 line,30,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,199,70,18.4',
                    'text,f1_4,100,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,199,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 }, columnWidths: [90, 80], onRowExporting: () => {
                    }
                }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('WordWrap with summaries', moduleConfig, () => {

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
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'text,F4,180,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,180,15,80,18.4',
                    'text,F1: f1 line long line (Max: f1 line\nlong line),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,250,36.8',
                    'text,f2 line,20,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,70.2,70,55.2',
                    'text,f3 long line\nlong line\nlong line,90,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,70.2,90,55.2',
                    'text,f4 long line,180,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,180,70.2,80,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    'setLineWidth,1',
                    'rect,10,15,250,18.4',
                    'text,F4,260,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,15,100,18.4',
                    'text,F1: f1 long line long line long line\n(Max: f1 long line long line long\nline),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'line,10,33.4,260,33.4',
                    'line,10,33.4,10,88.6',
                    'line,10,88.6,260,88.6',
                    'text,Max: f4 long\nline long line,260,51.8,{baseline:middle}',
                    'setLineWidth,1',
                    'line,260,33.4,360,33.4',
                    'line,360,33.4,360,88.6',
                    'line,260,88.6,360,88.6',
                    'text,F2: f2 long line (Max of F1 is f1\nlong line long line long line),20,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'line,20,88.6,260,88.6',
                    'line,20,88.6,20,125.4',
                    'line,20,125.4,260,125.4',
                    'text,Max: f4 long\nline long line,260,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'line,260,88.6,360,88.6',
                    'line,360,88.6,360,125.4',
                    'line,260,125.4,360,125.4',
                    'text,f3 line,30,143.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,125.4,230,36.8',
                    'text,f4 long line\nlong line,260,134.6,{baseline:middle}',
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
                    'setLineWidth,1',
                    'rect,10,15,150,18.4',
                    'text,F3,160,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,15,90,18.4',
                    'text,F4,250,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,250,15,80,18.4',
                    'text,F1: f1 long line (Max: f1 long line),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,320,18.4',
                    'text,f2 very long line\nvery long line,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,140,36.8',
                    'text,f3 line,160,70.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,51.8,90,36.8',
                    'text,f4 long line,250,70.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,250,51.8,80,36.8',
                    'setLineWidth,1',
                    'rect,20,88.6,140,18.4',
                    'text,Max: f3 line,160,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,88.6,90,18.4',
                    'setLineWidth,1',
                    'rect,250,88.6,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    dataSource: [{ f1: 'f1 long line long line', f2: 'f2 line', f3: 'f3 long line', f4: 'f4 very very long line very long line' }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,150,18.4',
                    'text,F3,160,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,15,90,18.4',
                    'text,F4,250,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,250,15,80,18.4',
                    'text,F1: f1 long line long line (Max: f1 long line\nlong line),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,320,36.8',
                    'text,f2 line,20,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,70.2,140,73.6',
                    'text,f3 long line,160,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,70.2,90,73.6',
                    'text,f4 very\nvery long\nline very\nlong line,250,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,250,70.2,80,73.6',
                    'setLineWidth,1',
                    'rect,20,143.8,140,36.8',
                    'text,Max: f3 long\nline,160,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,143.8,90,36.8',
                    'setLineWidth,1',
                    'rect,250,143.8,80,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    dataSource: [{ f1: 'f1 long line', f2: 'f2 line', f3: 'f3 very very long line long line', f4: 'f4 line' }]
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,250,18.4',
                    'text,F4,260,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,15,100,18.4',
                    'text,F1: f1 long line (Max: f1 long line),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'line,10,33.4,260,33.4',
                    'line,10,33.4,10,51.8',
                    'line,10,51.8,260,51.8',
                    'text,Max: f4 line,260,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'line,260,33.4,360,33.4',
                    'line,360,33.4,360,51.8',
                    'line,260,51.8,360,51.8',
                    'text,F2: f2 line (Max of F1 is f1 long\nline),20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'line,20,51.8,260,51.8',
                    'line,20,51.8,20,88.6',
                    'line,20,88.6,260,88.6',
                    'text,Max: f4 line,260,70.2,{baseline:middle}',
                    'setLineWidth,1',
                    'line,260,51.8,360,51.8',
                    'line,360,51.8,360,88.6',
                    'line,260,88.6,360,88.6',
                    'text,f3 very very long line long line,30,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,88.6,230,18.4',
                    'text,f4 line,260,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,88.6,100,18.4'
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
                    dataSource: [{ f1: 'f1 line', f2: 'f2 very long line', f3: 'f3', f4: 'f4 very long line very long line' }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,150,18.4',
                    'text,F3,160,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,15,90,18.4',
                    'text,F4,250,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,250,15,80,18.4',
                    'text,F1: f1 line (Max: f1 line),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,320,18.4',
                    'text,f2 very long line,20,88.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,140,73.6',
                    'text,f3,160,88.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,51.8,90,73.6',
                    'text,f4 very\nlong line\nvery long\nline,250,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,250,51.8,80,73.6',
                    'setLineWidth,1',
                    'rect,20,125.4,140,18.4',
                    'text,Max: f3,160,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,125.4,90,18.4',
                    'setLineWidth,1',
                    'rect,250,125.4,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'text,F4,180,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,180,15,80,18.4',
                    'text,F1: f1 long line,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,250,18.4',
                    'text,f2 long\nline long\nline long\nline,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,70,73.6',
                    'text,f3 line long\nline long line,90,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,51.8,90,73.6',
                    'text,f4 line,180,88.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,180,51.8,80,73.6',
                    'setLineWidth,1',
                    'rect,20,125.4,70,55.2',
                    'text,Max: f3 line\nlong line\nlong line,90,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,125.4,90,55.2',
                    'setLineWidth,1',
                    'rect,180,125.4,80,55.2'
                ];

                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 10, y: 15 }, columnWidths: [80, 90, 80], onRowExporting: () => {
                    }
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
