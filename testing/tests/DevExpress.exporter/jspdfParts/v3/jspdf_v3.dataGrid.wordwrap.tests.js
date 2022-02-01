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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line,56.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line,56.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line,55,65.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,56.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,56.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,56.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,56.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,55,71.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very long text,56.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very\n' +
'long text,56.667,79.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very long text,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very\n' +
'long text,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very\n' +
'long text,55,65.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line,56.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,56.667,73.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line,56.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,56.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,56.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,55,71.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,56',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very long line very long line,56.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,80',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line very long\n' +
'line,56.667,83.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,80',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very long line very long line,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line very long\n' +
'line,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line very long\n' +
'line,55,65.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,44.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line\n' +
'very long line very long line,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line\n' +
'very long line very\n' +
'long line,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line\n' +
'very long line very\n' +
'long line,55,65.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,44.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line long line,56.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,80',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,56.667,72,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,80',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line long line,56.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,56.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,55,71.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,56.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,55,71.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,vert long line,56.667,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,156.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,vert long line,56.667,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,156.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,vert long line,56.667,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,156.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,vert long line,56.667,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,156.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,vert long line,56.667,71.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,155,71.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,33',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,56.667,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line,156.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,56.667,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line,156.667,67.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,56.667,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line,156.667,77.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,56.667,94.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line,156.667,77.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,79.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,55,94.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line,155,77.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,79',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very long line,56.667,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line,156.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line,56.667,79.25,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,156.667,73.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very long line,56.667,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line,156.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line,56.667,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,156.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,56.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line,55,77.25,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,155,71.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,56',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,56',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line,56.667,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line,156.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,56.667,73.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line,156.667,33.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line,56.667,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line,156.667,77.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,56.667,117.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line,156.667,77.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,148.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,148.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,55,117.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line,155,77.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,148',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,148',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very long line very long line,56.667,95,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line long line,156.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,80',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,80',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line very long\n' +
'line,56.667,83.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,156.667,72,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,80',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,80',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very long line very long line,56.667,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line long line,156.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line very long\n' +
'line,56.667,83.333,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,156.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,79.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line very long\n' +
'line,55,83,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,155,71.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,79',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line long line,56.667,100,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line big line,156.667,100,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,90',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,90',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,56.667,77,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line\n' +
'big\n' +
'line,156.667,13.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,90',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,90',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line long line,56.667,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line big line,156.667,77.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,56.667,140.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line\n' +
'big\n' +
'line,156.667,77.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,217.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,217.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,55,140.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line\n' +
'big\n' +
'line,155,77.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,217',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,217',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very long text,56.667,85,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,200,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very long text,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,56.667,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line big line,156.667,94.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,79.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,55,71.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line big line,150,94.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,79',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,79',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very\n' +
'long text\n' +
'very long text\n' +
'very long text\n' +
'very long text,56.667,62,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very\n' +
'long text\n' +
'very long text\n' +
'very long text\n' +
'very long text,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,68.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long text very\n' +
'long text\n' +
'very long text\n' +
'very long text\n' +
'very long text,55,65.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,67.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very\n' +
'long line very long\n' +
'line,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,very long line very long line very long line,56.667,66.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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

            QUnit.test('1 col - 3 text lines, line1.fontStyle=bold,line2.fontStyle=italic,line3.fontStyle=normal', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
                    columns: [ { caption: 'caption: very long line very long line very long line', dataField: 'f1' } ],
                    dataSource: [{ f1: 'line1: sf sgfgsf gsdf sdf sfdg sdfgsfdg s' }, { f1: 'line2: sdfgnsf gfkjghgsf sdd jbfgjsfb sjf dsrg fgsfg sfg sfdgfs gfd sd' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFont,helvetica,bold,',
                    'setFontSize,20',
                    'text,cap\n' +
'tion\n' +
': ve\n' +
'ry l\n' +
'ong\n' +
'line \n' +
'ver\n' +
'y lo\n' +
'ng\n' +
'line \n' +
'ver\n' +
'y lo\n' +
'ng\n' +
'line,46.667,56.833,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,italic,',
                    'setFontSize,10',
                    'text,line1: sf\n' +
'sgfgsf\n' +
'gsdf sdf\n' +
'sfdg sdf\n' +
'gsfdg s,46.667,383.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'setFontSize,15',
                    'text,line2: \n' +
'sdfgn\n' +
'sf gfk\n' +
'jghgs\n' +
'f sdd \n' +
'jbfgjs\n' +
'fb sjf\n' +
'dsrg\n' +
'fgsfg\n' +
'sfg sf\n' +
'dgfs\n' +
'gfd\n' +
'sd,46.667,454.792,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,40,40,50,332.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,40,372.667,50,68.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,40,440.833,50,234.917',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.indexOf('caption') >= 0) {
                        pdfCell.font = { size: 20, style: 'bold' };
                    } else if(pdfCell.text.indexOf('line1') >= 0) {
                        pdfCell.font = { size: 10, style: 'italic' };
                    } else {
                        pdfCell.font = { size: 15, style: 'normal' };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 0 }, columnWidths: [ 50 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines, line1.fontStyle=italic,line2.fontStyle=bold,line3.fontStyle=normal', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
                    columns: [ { caption: 'caption: very long line very long line very long line', dataField: 'f1' } ],
                    dataSource: [{ f1: 'line1: sf sgfgsf gsdf sdf sfdg sdfgsfdg s' }, { f1: 'line2: sdfgnsf gfkjghgsf sdd jbfgjsfb sjf dsrg fgsfg sfg sfdgfs gfd sd' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFont,helvetica,italic,',
                    'setFontSize,20',
                    'text,cap\n' +
'tion\n' +
': ve\n' +
'ry l\n' +
'ong\n' +
'line \n' +
'ver\n' +
'y lo\n' +
'ng\n' +
'line \n' +
'ver\n' +
'y lo\n' +
'ng\n' +
'line,46.667,56.833,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,line1:\n' +
'sf\n' +
'sgfgsf\n' +
'gsdf\n' +
'sdf\n' +
'sfdg sd\n' +
'fgsfdg\n' +
's,46.667,383.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'setFontSize,15',
                    'text,line2: \n' +
'sdfgn\n' +
'sf gfk\n' +
'jghgs\n' +
'f sdd \n' +
'jbfgjs\n' +
'fb sjf\n' +
'dsrg\n' +
'fgsfg\n' +
'sfg sf\n' +
'dgfs\n' +
'gfd\n' +
'sd,46.667,489.292,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,40,40,50,332.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,40,372.667,50,102.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,40,475.333,50,234.917',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.indexOf('caption') >= 0) {
                        pdfCell.font = { size: 20, style: 'italic' };
                    } else if(pdfCell.text.indexOf('line1') >= 0) {
                        pdfCell.font = { size: 10, style: 'bold' };
                    } else {
                        pdfCell.font = { size: 15, style: 'normal' };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 0 }, columnWidths: [ 50 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 text lines, line1.fontStyle=normal,line2.fontStyle=bold,line3.fontStyle=italic', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
                    columns: [ { caption: 'caption: very long line very long line very long line', dataField: 'f1' } ],
                    dataSource: [{ f1: 'line1: sf sgfgsf gsdf sdf sfdg sdfgsfdg s' }, { f1: 'line2: sdfgnsf gfkjghgsf sdd jbfgjsfb sjf dsrg fgsfg sfg sfdgfs gfd sd' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,cap\n' +
'tion\n' +
': ve\n' +
'ry l\n' +
'ong\n' +
'line \n' +
'ver\n' +
'y lo\n' +
'ng\n' +
'line \n' +
'ver\n' +
'y lo\n' +
'ng\n' +
'line,46.667,56.833,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,line1:\n' +
'sf\n' +
'sgfgsf\n' +
'gsdf\n' +
'sdf\n' +
'sfdg sd\n' +
'fgsfdg\n' +
's,46.667,383.75,{baseline:middle}',
                    'setFont,helvetica,italic,',
                    'setFontSize,15',
                    'text,line2: \n' +
'sdfgn\n' +
'sf gfk\n' +
'jghgs\n' +
'f sdd \n' +
'jbfgjs\n' +
'fb sjf\n' +
'dsrg\n' +
'fgsfg\n' +
'sfg sf\n' +
'dgfs\n' +
'gfd\n' +
'sd,46.667,489.292,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,40,40,50,332.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,40,372.667,50,102.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,40,475.333,50,234.917',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.indexOf('caption') >= 0) {
                        pdfCell.font = { size: 20, style: 'normal' };
                    } else if(pdfCell.text.indexOf('line1') >= 0) {
                        pdfCell.font = { size: 10, style: 'bold' };
                    } else {
                        pdfCell.font = { size: 15, style: 'italic' };
                    }
                };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 0 }, columnWidths: [ 50 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 line1 line 2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 long line very\n' +
'long line,56.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,121.917,{baseline:middle}',
                    'text,f2_1 line\n' +
'long line\n' +
'long line,126.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,70,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,196.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,121.917,{baseline:middle}',
                    'text,f2_1 line\n' +
'long line\n' +
'long line,126.667,110.417,{baseline:middle}',
                    'text,f3,196.667,121.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,190,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,190,99.333,70,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,68.139,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,103.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,206.667,96.472,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3,126.667,147.194,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,180.25,{baseline:middle}',
                    'text,f3_1,126.667,180.25,{baseline:middle}',
                    'text,f4_1,206.667,180.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,114.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,26.278',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,81.278,80,43.944',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,81.278,60,87.889',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,125.222,80,43.944',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,169.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,169.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,169.167,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,56.667,71.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,102.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8,206.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3,126.667,154.167,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,190.917,{baseline:middle}',
                    'text,f3_1,126.667,190.917,{baseline:middle}',
                    'text,f4_1,206.667,190.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,124.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,51.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,77.167,60,102.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,128.5,80,51.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,179.833,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,179.833,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,179.833,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,56.667,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,90.444,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,206.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,126.667,117,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4,126.667,143.556,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,202.417,{baseline:middle}',
                    'text,f3_1_1,126.667,202.417,{baseline:middle}',
                    'text,f4_1,206.667,202.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,136.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,26.556',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,77.167,60,114.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,103.722,80,26.556',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,130.278,80,61.056',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,191.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,191.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,191.333,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,56.667,82.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,206.667,93.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,126.667,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,126.667,132.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,212.25,{baseline:middle}',
                    'text,f3_1_1,126.667,212.25,{baseline:middle}',
                    'text,f4_1,206.667,212.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,146.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,77.167,60,124',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,121.5,80,79.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,201.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,201.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,201.167,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,111.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,94.208,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line\n' +
'very long\n' +
'line long line\n' +
'very long\n' +
'line long line\n' +
'very long\n' +
'line,266.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,126.667,134.042,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 long\n' +
'line very\n' +
'long line,206.667,128.292,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,185.167,{baseline:middle}',
                    'text,f3_1,126.667,185.167,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line,206.667,179.417,{baseline:middle}',
                    'text,f5_1 long\n' +
'line,266.667,179.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,113.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,140,34.083',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,77.167,70,91.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,111.25,80,57.083',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,111.25,60,57.083',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,168.333,70,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,168.333,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,168.333,60,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,168.333,70,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,133.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,122.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line\n' +
'very long\n' +
'line long line\n' +
'very long\n' +
'line long line\n' +
'very long\n' +
'line,266.667,110.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,126.667,184,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 long\n' +
'line very\n' +
'long line,206.667,178.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,229.167,{baseline:middle}',
                    'text,f3_1,126.667,229.167,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line,206.667,223.417,{baseline:middle}',
                    'text,f5_1 long\n' +
'line,266.667,223.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,157.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,140,90',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,77.167,70,135.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,167.167,80,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,167.167,60,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,212.333,70,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,212.333,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,212.333,60,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,212.333,70,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,99.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line\n' +
'very long\n' +
'line,266.667,99.333,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,126.667,116.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 long\n' +
'line very\n' +
'long line,206.667,110.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,161.333,{baseline:middle}',
                    'text,f3_1,126.667,161.333,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line,206.667,155.583,{baseline:middle}',
                    'text,f5_1 long\n' +
'line,266.667,155.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,89.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,77.167,70,67.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,80,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,60,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,144.5,70,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,144.5,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,144.5,60,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,144.5,70,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,56.667,75.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,266.667,104.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,126.667,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,126.667,132.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,126.667,166.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3,206.667,154.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,199.917,{baseline:middle}',
                    'text,f3_1_1,126.667,199.917,{baseline:middle}',
                    'text,f4_1,206.667,199.917,{baseline:middle}',
                    'text,f5_1,266.667,199.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,133.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,77.167,70,111.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,121.5,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,143.667,80,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,143.667,60,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,188.833,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,188.833,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,188.833,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,188.833,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,89.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,266.667,94.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,126.667,112.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,126.667,134.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,126.667,157.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,206.667,157.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,180.25,{baseline:middle}',
                    'text,f3_1_1,126.667,180.25,{baseline:middle}',
                    'text,f4_1,206.667,180.25,{baseline:middle}',
                    'text,f5_1,266.667,180.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,114.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,210,22.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.833,140,22.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,77.833,70,91.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,100.667,140,22.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,123.5,140,22.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,146.333,80,22.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,146.333,60,22.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,169.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,169.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,169.167,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,169.167,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3,56.667,98.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,266.667,92.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,126.667,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,126.667,132.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,126.667,154.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,206.667,154.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,176.917,{baseline:middle}',
                    'text,f3_1_1,126.667,176.917,{baseline:middle}',
                    'text,f4_1,206.667,176.917,{baseline:middle}',
                    'text,f5_1,266.667,176.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,110.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,77.167,70,88.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,121.5,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,143.667,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,143.667,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,165.833,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,165.833,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,165.833,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,165.833,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,56.667,87.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,266.667,98.5,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,126.667,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3,126.667,132.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,126.667,189.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3,206.667,177.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,222.917,{baseline:middle}',
                    'text,f3_1_1,126.667,222.917,{baseline:middle}',
                    'text,f4_1,206.667,222.917,{baseline:middle}',
                    'text,f5_1,266.667,222.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,156.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,77.167,70,134.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,121.5,140,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,166.667,80,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,166.667,60,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,211.833,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,211.833,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,211.833,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,211.833,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,56.667,104.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,266.667,115.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,126.667,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3,126.667,132.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,126.667,206.5,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,206.667,177.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,257.417,{baseline:middle}',
                    'text,f3_1_1,126.667,257.417,{baseline:middle}',
                    'text,f4_1,206.667,257.417,{baseline:middle}',
                    'text,f5_1,266.667,257.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,191.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,77.167,70,169.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,121.5,140,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,166.667,80,79.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,166.667,60,79.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,246.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,246.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,246.333,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,246.333,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,133.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,126.667,122.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line\n' +
'very long\n' +
'line,266.667,133.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,126.667,184,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 long\n' +
'line very\n' +
'long line,206.667,178.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,229.167,{baseline:middle}',
                    'text,f3_1,126.667,229.167,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line,206.667,223.417,{baseline:middle}',
                    'text,f5_1 long\n' +
'line,266.667,223.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,157.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,140,90',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,77.167,70,135.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,167.167,80,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,167.167,60,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,212.333,70,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,212.333,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,212.333,60,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,212.333,70,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 line1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,105.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2\n' +
'long line,116.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,121.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line\n' +
'long line,56.667,155.583,{baseline:middle}',
                    'text,f2_1_1 very\n' +
'long line\n' +
'very long\n' +
'line,116.667,144.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,130,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,60,55.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,77.167,70,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,110.833,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,133,60,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,133,70,56.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,110.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2 long line very long\n' +
'line very long,116.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,127.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,186.667,121.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,172.833,{baseline:middle}',
                    'text,f2_1_2 very\n' +
'long line\n' +
'very long\n' +
'line,116.667,155.583,{baseline:middle}',
                    'text,f3_1_2 long\n' +
'line,186.667,167.083,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,60,67.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,77.167,150,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,110.833,70,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,110.833,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,144.5,60,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,144.5,70,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,144.5,80,56.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,82.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2 long\n' +
'line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,99.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,133.417,{baseline:middle}',
                    'text,f2_1 very long\n' +
'line very long\n' +
'line,126.667,121.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,55.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,88.667,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,110.833,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,110.833,80,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,82.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2 line long line very\n' +
'long line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,99.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,99.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,133.417,{baseline:middle}',
                    'text,f2_1 very long\n' +
'line very long\n' +
'line,126.667,121.917,{baseline:middle}',
                    'text,f3_1,206.667,133.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,55.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,88.667,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,88.667,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,110.833,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,110.833,80,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,110.833,60,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,82.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 very long\n' +
'line,266.667,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,94,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long\n' +
'line,206.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,133.417,{baseline:middle}',
                    'text,f2_1 line very\n' +
'long line very\n' +
'long line,126.667,121.917,{baseline:middle}',
                    'text,f3_1,206.667,133.417,{baseline:middle}',
                    'text,f4_1 long\n' +
'line,266.667,127.667,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,55.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,55,70,55.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,77.167,60,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,110.833,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,110.833,80,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,110.833,60,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,110.833,70,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,169.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,180.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1 long line very\n' +
'long line,206.667,114.333,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,336.667,120.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,f7 long\n' +
'line\n' +
'very\n' +
'long\n' +
'linelong\n' +
'line\n' +
'very\n' +
'long\n' +
'linelong\n' +
'line\n' +
'very\n' +
'long\n' +
'linelong\n' +
'line\n' +
'very\n' +
'long\n' +
'line,426.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3  long\n' +
'line,206.667,217.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4  long line\n' +
'very long\n' +
'line,266.667,211.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long\n' +
'line\n' +
'very\n' +
'long\n' +
'line,336.667,200.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,386.667,223.167,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,56.667,317.417,{baseline:middle}',
                    'text,f2_1 long line\n' +
'very long line,126.667,311.667,{baseline:middle}',
                    'text,f3_1,206.667,317.417,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line\n' +
'very long\n' +
'line very\n' +
'long line,266.667,294.417,{baseline:middle}',
                    'text,f5_1\n' +
'long\n' +
'line,336.667,305.917,{baseline:middle}',
                    'text,f6_1,386.667,317.417,{baseline:middle}',
                    'text,f7_1\n' +
'line,426.667,311.667,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,228.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,350,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,206.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,77.167,130,85.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,330,77.167,90,85.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,420,77.167,50,206.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,163,60,120.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,163,70,120.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,330,163,50,120.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,380,163,40,120.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,283.333,70,68.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,283.333,80,68.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,283.333,60,68.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,283.333,70,68.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,330,283.333,50,68.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,380,283.333,40,68.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,420,283.333,50,68.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 line line,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2 line long\n' +
'line,56.667,110.417,{baseline:middle}',
                    'text,f1_3 line long\n' +
'line long line,146.667,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long\n' +
'line,56.667,144.083,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2 line,56.667,183.5,{baseline:middle}',
                    'text,f2_3 line long\n' +
'line line,146.667,177.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,90,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,99.333,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,133,170,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,166.667,90,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,166.667,80,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 long line,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2 long line\n' +
'long line long line,56.667,110.417,{baseline:middle}',
                    'text,f1_3 line,146.667,116.167,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1 long line long line long\n' +
'line,56.667,144.083,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2 line long\n' +
'line,56.667,177.75,{baseline:middle}',
                    'text,f2_3,146.667,183.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,90,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,99.333,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,133,170,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,166.667,90,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,166.667,80,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line,56.667,88.25,{baseline:middle}',
                    'text,F2: f2_2 long line long line long\n' +
'line long line,56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_3 long line\n' +
'long line,56.667,144.083,{baseline:middle}',
                    'text,f2_4,146.667,149.833,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long\n' +
'line,56.667,177.75,{baseline:middle}',
                    'text,F2: f1_2 long line,56.667,211.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3 line,56.667,233.583,{baseline:middle}',
                    'text,f1_4,146.667,233.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,170,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,133,90,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,133,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,166.667,170,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,200.333,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,222.5,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,222.5,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 line long line (Max: f1 line long line),56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 line,56.667,116.167,{baseline:middle}',
                    'text,f3 long line long\n' +
'line long line,136.667,110.417,{baseline:middle}',
                    'text,f4 long line,226.667,116.167,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,80,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,99.333,90,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,99.333,80,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,306.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line (Max: f1 long\n' +
'line long line long line),56.667,88.25,{baseline:middle}',
                    'text,Max: f4 long line\n' +
'long line,306.667,88.25,{baseline:middle}',
                    'text,F2: f2 long line (Max of F1 is f1 long line long line\n' +
'long line),56.667,121.917,{baseline:middle}',
                    'text,Max: f4 long line\n' +
'long line,306.667,121.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3 line,56.667,161.333,{baseline:middle}',
                    'text,f4 long line long\n' +
'line,306.667,155.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,77.167,300,77.167',
                    'line,50,77.167,50,110.833',
                    'line,50,110.833,300,110.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,300,77.167,400,77.167',
                    'line,400,77.167,400,110.833',
                    'line,300,110.833,400,110.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,110.833,300,110.833',
                    'line,50,110.833,50,144.5',
                    'line,50,144.5,300,144.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,300,110.833,400,110.833',
                    'line,400,110.833,400,144.5',
                    'line,300,144.5,400,144.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,144.5,250,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,144.5,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line (Max: f1 long line),56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 very long line very long line,56.667,110.417,{baseline:middle}',
                    'text,f3 line,206.667,110.417,{baseline:middle}',
                    'text,f4 long line,296.667,110.417,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3\n' +
'line,206.667,136.033,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,121.5,150,47.467',
                    'setLineWidth,0.6666666666666666',
                    'rect,200,121.5,90,47.467',
                    'setLineWidth,0.6666666666666666',
                    'rect,290,121.5,80,47.467',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,320,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,99.333,80,22.167',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 long line\n' +
'long line long\n' +
'line,56.667,110.417,{baseline:middle}',
                    'text,f3 line long line\n' +
'long line,136.667,116.167,{baseline:middle}',
                    'text,f4 line,226.667,121.917,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3\n' +
'line long\n' +
'line long\n' +
'line,136.667,159.033,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,144.5,80,84.267',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,144.5,90,84.267',
                    'setLineWidth,0.6666666666666666',
                    'rect,220,144.5,80,84.267',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,80,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,99.333,90,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,99.333,80,45.167',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 very ling line very long\n' +
'line very long line,56.667,88.25,{baseline:middle}',
                    'text,F2: f2_1 line,56.667,121.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3line1\n' +
'line2\n' +
'line3\n' +
'line4,56.667,144.083,{baseline:middle}',
                    'text,f4,136.667,161.333,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max:\n' +
'f3line1\n' +
'line2\n' +
'line3\n' +
'line4,56.667,204.2,{baseline:middle}',
                    'text,Max:\n' +
'f3line1\n' +
'line2\n' +
'line3\n' +
'line4,56.667,306.867,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,F1: f1 very long line very long\n' +
'line,56.667,406.083,{baseline:middle}',
                    'text,F2: f2_2very long line very long\n' +
'line,56.667,439.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3very long\n' +
'line very long\n' +
'line,56.667,473.417,{baseline:middle}',
                    'text,f4,136.667,484.917,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max:\n' +
'f3very\n' +
'long line\n' +
'very long\n' +
'line,56.667,522.033,{baseline:middle}',
                    'text,Max:\n' +
'f3very\n' +
'long line\n' +
'very long\n' +
'line,56.667,624.7,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,189.667,80,102.667',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,189.667,90,102.667',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,292.333,80,102.667',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,292.333,90,102.667',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,507.5,80,102.667',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,507.5,90,102.667',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,610.167,80,102.667',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,610.167,90,102.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,110.833,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,133,80,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,133,90,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,395,170,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,428.667,170,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,462.333,80,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,462.333,90,45.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,51.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,51.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFontSize,16',
                    'text,Max:\n' +
'f3very\n' +
'long line\n' +
'very long\n' +
'line,56.667,76.7,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,#000000',
                    'rect,50,62.167,80,102.667',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,62.167,90,102.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,40,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,40,90,22.167',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 long\n' +
'line 1 ling\n' +
'line 2,56.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1\n' +
'line,56.667,111.25,{baseline:middle}',
                    'text,F2: f2_1\n' +
'line long\n' +
'line long\n' +
'line,56.667,144.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,100.167,70,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,133.833,70,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,190.5,70,0',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 long\n' +
'line 1 ling\n' +
'line 2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 line,126.667,77.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line (Max: f1_1\n' +
'line),56.667,111.25,{baseline:middle}',
                    'text,F2: f2_1 line long line long\n' +
'line (Max of F1 is f1_1 line),56.667,144.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,long line\n' +
'very long\n' +
'line,126.667,178.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,100.167,140,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,133.833,140,33.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,167.5,70,45.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,167.5,70,45.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 line,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1 long line very long\n' +
'line,56.667,120.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,206.667,125.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,f7 long\n' +
'line\n' +
'very\n' +
'long\n' +
'linelong\n' +
'line\n' +
'very\n' +
'long\n' +
'linelong\n' +
'line\n' +
'very\n' +
'long\n' +
'linelong\n' +
'line\n' +
'very\n' +
'long\n' +
'line,336.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3  long line,56.667,228.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4  long line\n' +
'very long line,126.667,223.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long\n' +
'line very\n' +
'long line,206.667,217.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,266.667,228.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line,56.667,294.417,{baseline:middle}',
                    'text,F2: f2_1 long line very long line,56.667,316.583,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3_1,56.667,356,{baseline:middle}',
                    'text,f4_1 very long\n' +
'line very long\n' +
'line very long\n' +
'line,126.667,338.75,{baseline:middle}',
                    'text,f5_1 long\n' +
'line,206.667,350.25,{baseline:middle}',
                    'text,f6_1,266.667,356,{baseline:middle}',
                    'text,f7_1\n' +
'line,336.667,350.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,330,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,150,97.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,77.167,130,97.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,330,77.167,50,206.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,174.5,70,108.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,174.5,80,108.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,174.5,60,108.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,174.5,70,108.833',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,283.333,330,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,305.5,330,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,327.667,70,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,327.667,80,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,327.667,60,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,327.667,70,56.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,330,327.667,50,56.667',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
