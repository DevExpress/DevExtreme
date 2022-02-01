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
                    'text,very long line,55.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,very long line,55.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,very long line,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,very long line,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
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
                    'text,long line,55.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,long line,55.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,long line,55.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,long line,55.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
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
                    'text,very long text very long text,55.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
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
'long text,55.333,79.25,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,very long text very long text,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
'long text,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
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
                    'text,long line long line,55.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
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
'long line,55.333,73.5,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,long line long line,55.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
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
'long line,55.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
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
                    'text,very long line very long line very long line,55.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
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
'line,55.333,83.5,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,very long line very long line very long line,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
'line,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
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
'very long line very long line,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
'long line,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
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
                    'text,long line long line long line,55.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
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
'long line,55.333,72,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,long line long line long line,55.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
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
'long line,55.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
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
'long line,55.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
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
                    'text,vert long line,55.333,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,155.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6',
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
                    'text,vert long line,55.333,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,155.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6',
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
                    'text,vert long line,55.333,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,155.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setLineWidth,0.6',
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
                    'text,vert long line,55.333,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,155.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setLineWidth,0.6',
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
                    'text,vert long line,55.333,71.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line,155,71.5,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,33',
                    'setLineWidth,0.6',
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
                    'text,long line,55.333,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line,155.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6',
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
                    'text,long line,55.333,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line,155.333,67.75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6',
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
                    'text,long line,55.333,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line,155.333,77.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,45.167',
                    'setLineWidth,0.6',
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
                    'text,long line,55.333,94.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line,155.333,77.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,79.667',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,79',
                    'setLineWidth,0.6',
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
                    'text,very long line very long line,55.333,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line,155.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6',
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
'long line,55.333,79.25,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,155.333,73.5,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6',
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
                    'text,very long line very long line,55.333,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line,155.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setLineWidth,0.6',
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
'long line,55.333,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line,155.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,56.667',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,56',
                    'setLineWidth,0.6',
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
                    'text,long line long line,55.333,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line,155.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6',
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
'long line,55.333,73.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line,155.333,33.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,60',
                    'setLineWidth,0.6',
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
                    'text,long line long line,55.333,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line,155.333,77.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,45.167',
                    'setLineWidth,0.6',
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
'long line,55.333,117.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line,155.333,77.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,148.667',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,148',
                    'setLineWidth,0.6',
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
                    'text,very long line very long line very long line,55.333,95,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line long line,155.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,80',
                    'setLineWidth,0.6',
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
'line,55.333,83.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,155.333,72,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,80',
                    'setLineWidth,0.6',
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
                    'text,very long line very long line very long line,55.333,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line long line long line,155.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setLineWidth,0.6',
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
'line,55.333,83.333,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,long line\n' +
'long line\n' +
'long line,155.333,71.833,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,79.667',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,79',
                    'setLineWidth,0.6',
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
                    'text,long line long line long line,55.333,100,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line big line,155.333,100,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,90',
                    'setLineWidth,0.6',
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
'long line,55.333,77,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line\n' +
'big\n' +
'line,155.333,13.75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,90',
                    'setLineWidth,0.6',
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
                    'text,long line long line long line,55.333,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line big line,155.333,77.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,45.167',
                    'setLineWidth,0.6',
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
'long line,55.333,140.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big\n' +
'line\n' +
'big\n' +
'line\n' +
'big\n' +
'line,155.333,77.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,217.667',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,217',
                    'setLineWidth,0.6',
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
                    'text,very long text very long text,55.333,85,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,very long text very long text,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
'long line,55.333,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,big line big line big line,155.333,94.833,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,79.667',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,79',
                    'setLineWidth,0.6',
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
'very long text,55.333,62,{baseline:middle}',
                    'setLineWidth,0.6',
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
'very long text,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'setLineWidth,0.6',
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
'line,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
                    'text,very long line very long line very long line,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
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
'line,45.333,56.833,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,italic,',
                    'setFontSize,10',
                    'text,line1: sf\n' +
'sgfgsf\n' +
'gsdf sdf\n' +
'sfdg\n' +
'sdfgsfdg\n' +
's,45.333,383.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'setFontSize,15',
                    'text,line2: \n' +
'sdfgn\n' +
'sf gfkj\n' +
'ghgsf\n' +
'sdd j\n' +
'bfgjsf\n' +
'b sjf\n' +
'dsrg\n' +
'fgsfg\n' +
'sfg sf\n' +
'dgfs\n' +
'gfd\n' +
'sd,45.333,466.292,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,40,50,332.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,372.667,50,79.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,452.333,50,234.917',
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
                    'text,capt\n' +
'ion:\n' +
'very\n' +
'long\n' +
'line\n' +
'very\n' +
'long\n' +
'line\n' +
'very\n' +
'long\n' +
'line,45.333,56.833,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,line1: sf\n' +
'sgfgsf\n' +
'gsdf sdf\n' +
'sfdg sdf\n' +
'gsfdg s,45.333,314.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'setFontSize,15',
                    'text,line2: \n' +
'sdfgn\n' +
'sf gfkj\n' +
'ghgsf\n' +
'sdd j\n' +
'bfgjsf\n' +
'b sjf\n' +
'dsrg\n' +
'fgsfg\n' +
'sfg sf\n' +
'dgfs\n' +
'gfd\n' +
'sd,45.333,385.792,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,40,50,263.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,303.667,50,68.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,371.833,50,234.917',
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
                    'text,capt\n' +
'ion:\n' +
'very\n' +
'long\n' +
'line\n' +
'very\n' +
'long\n' +
'line\n' +
'very\n' +
'long\n' +
'line,45.333,56.833,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,line1: sf\n' +
'sgfgsf\n' +
'gsdf sdf\n' +
'sfdg sdf\n' +
'gsfdg s,45.333,314.75,{baseline:middle}',
                    'setFont,helvetica,italic,',
                    'setFontSize,15',
                    'text,line2: \n' +
'sdfgn\n' +
'sf gfkj\n' +
'ghgsf\n' +
'sdd j\n' +
'bfgjsf\n' +
'b sjf\n' +
'dsrg\n' +
'fgsfg\n' +
'sfg sf\n' +
'dgfs\n' +
'gfd\n' +
'sd,45.333,385.792,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,40,50,263.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,303.667,50,68.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,371.833,50,234.917',
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
                    'text,Band1 line1 line 2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,55.333,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 long line very\n' +
'long line,55.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,100,22.167',
                    'setLineWidth,0.6',
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
                    'text,Band1 long line 1 ling line 2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,55.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,125.333,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,116.167,{baseline:middle}',
                    'text,f2_1 line long\n' +
'line long line,125.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,70,33.667',
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
                    'text,Band1 long line 1 ling line 2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,55.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,125.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,195.333,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,116.167,{baseline:middle}',
                    'text,f2_1 line long\n' +
'line long line,125.333,110.417,{baseline:middle}',
                    'text,f3,195.333,116.167,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,190,77.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,190,99.333,70,33.667',
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
'line9,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,68.139,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,103.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,205.333,96.472,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3,125.333,147.194,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,180.25,{baseline:middle}',
                    'text,f3_1,125.333,180.25,{baseline:middle}',
                    'text,f4_1,205.333,180.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,114.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,140,26.278',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,81.278,80,43.944',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.278,60,87.889',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,125.222,80,43.944',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,169.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,169.167,80,22.167',
                    'setLineWidth,0.6',
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
'line9,55.333,71.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,102.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8,205.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3,125.333,154.167,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,190.917,{baseline:middle}',
                    'text,f3_1,125.333,190.917,{baseline:middle}',
                    'text,f4_1,205.333,190.917,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,124.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,80,51.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,77.167,60,102.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,128.5,80,51.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,179.833,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,179.833,80,22.167',
                    'setLineWidth,0.6',
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
'line9,55.333,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,90.444,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,205.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,125.333,117,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4,125.333,143.556,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,202.417,{baseline:middle}',
                    'text,f3_1_1,125.333,202.417,{baseline:middle}',
                    'text,f4_1,205.333,202.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,136.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,80,26.556',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,77.167,60,114.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,103.722,80,26.556',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,130.278,80,61.056',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,191.333,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,191.333,80,22.167',
                    'setLineWidth,0.6',
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
'line9,55.333,82.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,205.333,93.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,125.333,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,125.333,132.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,212.25,{baseline:middle}',
                    'text,f3_1_1,125.333,212.25,{baseline:middle}',
                    'text,f4_1,205.333,212.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,146.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,77.167,60,124',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,121.5,80,79.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,201.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,201.167,80,22.167',
                    'setLineWidth,0.6',
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
                    'text,F1,55.333,105.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,91.333,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line\n' +
'very long line\n' +
'long line very\n' +
'long line long\n' +
'line very long\n' +
'line,265.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,125.333,125.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 long line\n' +
'very long\n' +
'line,205.333,119.667,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,173.667,{baseline:middle}',
                    'text,f3_1,125.333,173.667,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line,205.333,167.917,{baseline:middle}',
                    'text,f5_1 long line,265.333,173.667,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,101.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,140,28.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,77.167,70,79.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,105.5,80,51.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,105.5,60,51.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,156.833,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,156.833,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,156.833,60,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,156.833,70,33.667',
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
                    'text,F1,55.333,133.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,122.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line\n' +
'very long line\n' +
'long line very\n' +
'long line long\n' +
'line very long\n' +
'line,265.333,116,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,125.333,184,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 long line\n' +
'very long\n' +
'line,205.333,178.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,229.167,{baseline:middle}',
                    'text,f3_1,125.333,229.167,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line,205.333,223.417,{baseline:middle}',
                    'text,f5_1 long line,265.333,229.167,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,157.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,140,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,77.167,70,135.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,167.167,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,167.167,60,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,212.333,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,212.333,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,212.333,60,33.667',
                    'setLineWidth,0.6',
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
                    'text,F1,55.333,99.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line\n' +
'very long line,265.333,105.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,125.333,116.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 long line\n' +
'very long\n' +
'line,205.333,110.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,161.333,{baseline:middle}',
                    'text,f3_1,125.333,161.333,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line,205.333,155.583,{baseline:middle}',
                    'text,f5_1 long line,265.333,161.333,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,89.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,77.167,70,67.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,99.333,60,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,144.5,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,144.5,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,144.5,60,33.667',
                    'setLineWidth,0.6',
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
'line9,55.333,75.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,265.333,104.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,125.333,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,125.333,132.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,125.333,166.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3,205.333,154.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,199.917,{baseline:middle}',
                    'text,f3_1_1,125.333,199.917,{baseline:middle}',
                    'text,f4_1,205.333,199.917,{baseline:middle}',
                    'text,f5_1,265.333,199.917,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,133.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,77.167,70,111.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,121.5,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,143.667,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,143.667,60,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,188.833,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,188.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,188.833,60,22.167',
                    'setLineWidth,0.6',
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
'line9,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,89.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,265.333,94.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,125.333,112.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,125.333,134.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,125.333,157.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,205.333,157.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,180.25,{baseline:middle}',
                    'text,f3_1_1,125.333,180.25,{baseline:middle}',
                    'text,f4_1,205.333,180.25,{baseline:middle}',
                    'text,f5_1,265.333,180.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,114.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,210,22.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.833,140,22.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,77.833,70,91.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,100.667,140,22.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,123.5,140,22.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,146.333,80,22.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,146.333,60,22.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,169.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,169.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,169.167,60,22.167',
                    'setLineWidth,0.6',
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
'line3,55.333,98.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,265.333,92.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,125.333,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,125.333,132.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,125.333,154.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1,205.333,154.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,176.917,{baseline:middle}',
                    'text,f3_1_1,125.333,176.917,{baseline:middle}',
                    'text,f4_1,205.333,176.917,{baseline:middle}',
                    'text,f5_1,265.333,176.917,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,110.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,77.167,70,88.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,121.5,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,143.667,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,143.667,60,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,165.833,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,165.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,165.833,60,22.167',
                    'setLineWidth,0.6',
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
'line9,55.333,87.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,265.333,98.5,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,125.333,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3,125.333,132.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,125.333,189.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3,205.333,177.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,222.917,{baseline:middle}',
                    'text,f3_1_1,125.333,222.917,{baseline:middle}',
                    'text,f4_1,205.333,222.917,{baseline:middle}',
                    'text,f5_1,265.333,222.917,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,156.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,77.167,70,134.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,121.5,140,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,166.667,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,166.667,60,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,211.833,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,211.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,211.833,60,22.167',
                    'setLineWidth,0.6',
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
'line9,55.333,104.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,265.333,115.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,125.333,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3,125.333,132.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,125.333,206.5,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,205.333,177.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,257.417,{baseline:middle}',
                    'text,f3_1_1,125.333,257.417,{baseline:middle}',
                    'text,f4_1,205.333,257.417,{baseline:middle}',
                    'text,f5_1,265.333,257.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,191.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,77.167,70,169.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,121.5,140,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,166.667,80,79.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,166.667,60,79.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,246.333,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,246.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,246.333,60,22.167',
                    'setLineWidth,0.6',
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
                    'text,F1,55.333,133.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,125.333,122.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line\n' +
'very long line,265.333,139,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,125.333,184,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 long line\n' +
'very long\n' +
'line,205.333,178.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,229.167,{baseline:middle}',
                    'text,f3_1,125.333,229.167,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line,205.333,223.417,{baseline:middle}',
                    'text,f5_1 long line,265.333,229.167,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,157.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,140,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,77.167,70,135.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,167.167,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,167.167,60,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,212.333,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,212.333,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,212.333,60,33.667',
                    'setLineWidth,0.6',
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
                    'text,Band1 line1,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,55.333,105.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2\n' +
'long line,115.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,115.333,121.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line\n' +
'long line,55.333,149.833,{baseline:middle}',
                    'text,f2_1_1 very\n' +
'long line very\n' +
'long line,115.333,144.083,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,130,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,60,55.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,77.167,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,110.833,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,133,60,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,133,70,45.167',
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
                    'text,Band1,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,55.333,110.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2 long line very long\n' +
'line very long,115.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,115.333,127.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line\n' +
'very long line,185.333,121.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,167.083,{baseline:middle}',
                    'text,f2_1_2 very\n' +
'long line very\n' +
'long line,115.333,155.583,{baseline:middle}',
                    'text,f3_1_2 long\n' +
'line,185.333,161.333,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,210,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,60,67.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,77.167,150,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,110.833,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,180,110.833,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,144.5,60,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,144.5,70,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,180,144.5,80,45.167',
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
                    'text,F1,55.333,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2 long line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,125.333,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,121.917,{baseline:middle}',
                    'text,f2_1 very long\n' +
'line very long\n' +
'line,125.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,70,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,80,45.167',
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
                    'text,F1,55.333,82.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2 line long line very\n' +
'long line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,125.333,99.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,99.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,133.417,{baseline:middle}',
                    'text,f2_1 very long\n' +
'line very long\n' +
'line,125.333,121.917,{baseline:middle}',
                    'text,f3_1,205.333,133.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,55.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,140,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,88.667,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,88.667,60,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,110.833,70,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,110.833,80,45.167',
                    'setLineWidth,0.6',
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
                    'text,F1,55.333,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4 very long\n' +
'line,265.333,71.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,125.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 long line,205.333,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,121.917,{baseline:middle}',
                    'text,f2_1 line very\n' +
'long line very\n' +
'long line,125.333,110.417,{baseline:middle}',
                    'text,f3_1,205.333,121.917,{baseline:middle}',
                    'text,f4_1 long line,265.333,121.917,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,55,70,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,77.167,60,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,70,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,99.333,60,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,99.333,70,45.167',
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
                    'text,F1,55.333,140.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,125.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,125.333,151.5,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1 long line very\n' +
'long line,205.333,105.708,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,335.333,111.458,{baseline:middle}',
                    'setTextColor,128',
                    'text,f7 long\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long line,425.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3  long\n' +
'line,205.333,180.042,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4  long line\n' +
'very long line,265.333,180.042,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long\n' +
'line very\n' +
'long line,335.333,174.292,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,385.333,185.792,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,55.333,254.167,{baseline:middle}',
                    'text,f2_1 long line\n' +
'very long line,125.333,248.417,{baseline:middle}',
                    'text,f3_1,205.333,254.167,{baseline:middle}',
                    'text,f4_1 very\n' +
'long line very\n' +
'long line very\n' +
'long line,265.333,236.917,{baseline:middle}',
                    'text,f5_1\n' +
'long line,335.333,248.417,{baseline:middle}',
                    'text,f6_1,385.333,254.167,{baseline:middle}',
                    'text,f7_1 line,425.333,254.167,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,170.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,350,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,80,148.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,77.167,130,68.583',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,330,77.167,90,68.583',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,420,77.167,50,148.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,145.75,60,80.083',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,145.75,70,80.083',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,330,145.75,50,80.083',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,380,145.75,40,80.083',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,225.833,70,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,225.833,80,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,225.833,60,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,225.833,70,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,330,225.833,50,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,380,225.833,40,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,420,225.833,50,56.667',
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
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,145.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 line line,55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2 line long line,55.333,116.167,{baseline:middle}',
                    'text,f1_3 line long\n' +
'line long line,145.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line,55.333,144.083,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2 line,55.333,172,{baseline:middle}',
                    'text,f2_3 line long\n' +
'line line,145.333,166.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,90,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,99.333,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,133,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,155.167,90,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,155.167,80,33.667',
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
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,145.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 long line,55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2 long line\n' +
'long line long line,55.333,110.417,{baseline:middle}',
                    'text,f1_3 line,145.333,116.167,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1 long line long line long\n' +
'line,55.333,144.083,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2 line long line,55.333,177.75,{baseline:middle}',
                    'text,f2_3,145.333,177.75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,90,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,99.333,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,133,170,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,166.667,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,166.667,80,22.167',
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
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,145.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line,55.333,88.25,{baseline:middle}',
                    'text,F2: f2_2 long line long line long\n' +
'line long line,55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_3 long line\n' +
'long line,55.333,144.083,{baseline:middle}',
                    'text,f2_4,145.333,149.833,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line,55.333,177.75,{baseline:middle}',
                    'text,F2: f1_2 long line,55.333,199.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3 line,55.333,222.083,{baseline:middle}',
                    'text,f1_4,145.333,222.083,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,170,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,133,90,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,133,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,166.667,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,188.833,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,211,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,211,80,22.167',
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
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 line long line (Max: f1 line long line),55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 line,55.333,116.167,{baseline:middle}',
                    'text,f3 long line long\n' +
'line long line,135.333,110.417,{baseline:middle}',
                    'text,f4 long line,225.333,116.167,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,33.667',
                    'setLineWidth,0.6',
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
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,305.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line (Max: f1 long\n' +
'line long line long line),55.333,88.25,{baseline:middle}',
                    'text,Max: f4 long line\n' +
'long line,305.333,88.25,{baseline:middle}',
                    'text,F2: f2 long line (Max of F1 is f1 long line long line\n' +
'long line),55.333,121.917,{baseline:middle}',
                    'text,Max: f4 long line\n' +
'long line,305.333,121.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3 line,55.333,155.583,{baseline:middle}',
                    'text,f4 long line long line,305.333,155.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,77.167,300,77.167',
                    'line,50,77.167,50,110.833',
                    'line,50,110.833,300,110.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,300,77.167,400,77.167',
                    'line,400,77.167,400,110.833',
                    'line,300,110.833,400,110.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,110.833,300,110.833',
                    'line,50,110.833,50,144.5',
                    'line,50,144.5,300,144.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,300,110.833,400,110.833',
                    'line,400,110.833,400,144.5',
                    'line,300,144.5,400,144.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,144.5,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,144.5,100,22.167',
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
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line (Max: f1 long line),55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 very long line very long line,55.333,110.417,{baseline:middle}',
                    'text,f3 line,205.333,110.417,{baseline:middle}',
                    'text,f4 long line,295.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3 line,205.333,132.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,320,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,121.5,80,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
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
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line,55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 long line\n' +
'long line long\n' +
'line,55.333,110.417,{baseline:middle}',
                    'text,f3 line long line\n' +
'long line,135.333,116.167,{baseline:middle}',
                    'text,f4 line,225.333,121.917,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3 line long\n' +
'line long line,135.333,155.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,99.333,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,144.5,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,144.5,90,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,144.5,80,33.667',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
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
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 very ling line very long line\n' +
'very long line,55.333,88.25,{baseline:middle}',
                    'text,F2: f2_1 line,55.333,121.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55.333,144.083,{baseline:middle}',
                    'text,f4,135.333,161.333,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55.333,200.75,{baseline:middle}',
                    'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55.333,257.417,{baseline:middle}',
                    'text,F1: f1 very long line very long\n' +
'line,55.333,314.083,{baseline:middle}',
                    'text,F2: f2_2very long line very long\n' +
'line,55.333,347.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3very long line\n' +
'very long line,55.333,381.417,{baseline:middle}',
                    'text,f4,135.333,387.167,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3very\n' +
'long line very\n' +
'long line,55.333,415.083,{baseline:middle}',
                    'text,Max: f3very\n' +
'long line very\n' +
'long line,55.333,460.25,{baseline:middle}',
                    'text,Max: f3very\n' +
'long line very\n' +
'long line,55.333,505.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,110.833,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,133,80,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,133,90,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,189.667,80,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,189.667,90,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,246.333,80,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,246.333,90,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,303,170,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,336.667,170,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,370.333,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,370.333,90,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,404,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,404,90,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,449.167,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,449.167,90,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,494.333,80,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,494.333,90,45.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
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
'line 2,55.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line,55.333,111.25,{baseline:middle}',
                    'text,F2: f2_1 line\n' +
'long line\n' +
'long line,55.333,133.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,100.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,122.333,70,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,167.5,70,0',
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
'line 2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 line,125.333,77.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line (Max: f1_1\n' +
'line),55.333,111.25,{baseline:middle}',
                    'text,F2: f2_1 line long line long\n' +
'line (Max of F1 is f1_1 line),55.333,144.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,long line very\n' +
'long line,125.333,178.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,70,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,55,70,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,100.167,140,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,133.833,140,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,167.5,70,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,167.5,70,33.667',
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
                    'text,Band1 line,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1 long line very long\n' +
'line,55.333,105.708,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,205.333,111.458,{baseline:middle}',
                    'setTextColor,128',
                    'text,f7 long\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long line,335.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3  long line,55.333,185.792,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4  long line\n' +
'very long line,125.333,180.042,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line\n' +
'very long\n' +
'line,205.333,174.292,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,265.333,185.792,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line,55.333,236.917,{baseline:middle}',
                    'text,F2: f2_1 long line very long line,55.333,259.083,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3_1,55.333,298.5,{baseline:middle}',
                    'text,f4_1 very long\n' +
'line very long\n' +
'line very long\n' +
'line,125.333,281.25,{baseline:middle}',
                    'text,f5_1 long\n' +
'line,205.333,292.75,{baseline:middle}',
                    'text,f6_1,265.333,298.5,{baseline:middle}',
                    'text,f7_1 line,335.333,298.5,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,330,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,150,68.583',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,77.167,130,68.583',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,330,77.167,50,148.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,145.75,70,80.083',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,145.75,80,80.083',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,145.75,60,80.083',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,145.75,70,80.083',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,225.833,330,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,248,330,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,270.167,70,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,270.167,80,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,270.167,60,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,260,270.167,70,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,330,270.167,50,56.667',
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
