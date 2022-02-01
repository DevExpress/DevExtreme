import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfMultilineTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Multiline text', moduleConfig, () => {
            QUnit.test('1 col - 1 text line. fontSize default', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [{ caption: 'line1' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1,56.667,85,{baseline:middle}',
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
                    columns: [{ caption: 'line1' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1,56.667,66.083,{baseline:middle}',
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

            QUnit.test('1 col - 1 text line. fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [{ caption: 'line1' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1,56.667,85,{baseline:middle}',
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
                    columns: [{ caption: 'line1' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1,56.667,71.833,{baseline:middle}',
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

            QUnit.test('1 col - 1 text line. fontSize 20, height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [{ caption: 'line1' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1,55,71.5,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2,56.667,79.25,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2,56.667,66.083,{baseline:middle}',
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

            QUnit.test('1 col - 2 text lines. fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [{ caption: 'line1\nline2' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2,56.667,73.5,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2,56.667,71.833,{baseline:middle}',
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

            QUnit.test('1 col - 2 text lines. fontSize 20, height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [{ caption: 'line1\nline2' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2,55,71.5,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2\nline3' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3,56.667,83.5,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2\nline3' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3,56.667,66.083,{baseline:middle}',
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

            QUnit.test('1 col - 3 text lines. fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [{ caption: 'line1\nline2\nline3' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2\n' +
'line3,56.667,72,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2\nline3' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2\n' +
'line3,56.667,71.833,{baseline:middle}',
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

            QUnit.test('1 col - 3 text lines. fontSize 20, height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [{ caption: 'line1\nline2\nline3' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2\n' +
'line3,55,71.5,{baseline:middle}',
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

            QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'line1' },
                        { caption: 'line1' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1,56.667,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1,156.667,85,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1' },
                        { caption: 'line1' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1,56.667,71.833,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1,156.667,71.833,{baseline:middle}',
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

            QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'line1' },
                        { caption: 'line1' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1,56.667,85,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,line1,156.667,85,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1' },
                        { caption: 'line1' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1,56.667,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,line1,156.667,77.583,{baseline:middle}',
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

            QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto, padding 5', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'line1' },
                        { caption: 'line1' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1,55,77.25,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,line1,155,77.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,44.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,44.5',
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
                    columns: [
                        { caption: 'line1\nline2' },
                        { caption: 'line1\nline2' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2,56.667,79.25,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2,156.667,73.5,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2' },
                        { caption: 'line1\nline2' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2,56.667,77.583,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2,156.667,71.833,{baseline:middle}',
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

            QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'line1\nline2' },
                        { caption: 'line1\nline2' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2,56.667,73.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,line1\n' +
'line2,156.667,67.75,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2' },
                        { caption: 'line1\nline2' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2,56.667,83.333,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,line1\n' +
'line2,156.667,77.583,{baseline:middle}',
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

            QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto, padding 5', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'line1\nline2' },
                        { caption: 'line1\nline2' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2,55,83,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,line1\n' +
'line2,155,77.25,{baseline:middle}',
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

            QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'line1\nline2\nline3' },
                        { caption: 'line1\nline2\nline3' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3,56.667,83.5,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2\n' +
'line3,156.667,72,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2\nline3' },
                        { caption: 'line1\nline2\nline3' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3,56.667,83.333,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2\n' +
'line3,156.667,71.833,{baseline:middle}',
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

            QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'line1\nline2\nline3' },
                        { caption: 'line1\nline2\nline3' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2\n' +
'line3,56.667,77,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,line1\n' +
'line2\n' +
'line3,156.667,65.5,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2\nline3' },
                        { caption: 'line1\nline2\nline3' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2\n' +
'line3,56.667,89.083,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,line1\n' +
'line2\n' +
'line3,156.667,77.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,114.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,114.167',
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

            QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto, padding 5', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'line1\nline2\nline3' },
                        { caption: 'line1\nline2\nline3' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line1\n' +
'line2\n' +
'line3,55,88.75,{baseline:middle}',
                    'setTextColor,128',
                    'setFontSize,30',
                    'text,line1\n' +
'line2\n' +
'line3,155,77.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,113.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,150,55,100,113.5',
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
        });
    }
};

export { JSPdfMultilineTests };
