import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

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
                    'text,line1,10,45,{baseline:middle}',
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
                    columns: [{ caption: 'line1' }]
                });

                const expectedLog = [
                    'text,line1,10,24.2,{baseline:middle}',
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
                    columns: [{ caption: 'line1' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1,10,45,{baseline:middle}',
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
                    columns: [{ caption: 'line1' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1,10,26.5,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2' }]
                });

                const expectedLog = [
                    'text,line1\nline2,10,35.8,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2' }]
                });

                const expectedLog = [
                    'text,line1\nline2,10,24.2,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1\nline2,10,33.5,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1\nline2,10,26.5,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2\nline3' }]
                });

                const expectedLog = [
                    'text,line1\nline2\nline3,10,36.6,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2\nline3' }]
                });

                const expectedLog = [
                    'text,line1\nline2\nline3,10,24.2,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2\nline3' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1\nline2\nline3,10,32,{baseline:middle}',
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
                    columns: [{ caption: 'line1\nline2\nline3' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1\nline2\nline3,10,26.5,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1' },
                        { caption: 'line1' }
                    ]
                });

                const expectedLog = [
                    'text,line1,10,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,20',
                    'text,line1,110,45,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1' },
                        { caption: 'line1' }
                    ]
                });

                const expectedLog = [
                    'text,line1,10,26.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                    'setFontSize,20',
                    'text,line1,110,26.5,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1' },
                        { caption: 'line1' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1,10,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,30',
                    'text,line1,110,45,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1' },
                        { caption: 'line1' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1,10,32.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,34.5',
                    'setFontSize,30',
                    'text,line1,110,32.25,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2' },
                        { caption: 'line1\nline2' }
                    ]
                });

                const expectedLog = [
                    'text,line1\nline2,10,35.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,20',
                    'text,line1\nline2,110,33.5,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2' },
                        { caption: 'line1\nline2' }
                    ]
                });

                const expectedLog = [
                    'text,line1\nline2,10,28.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,46',
                    'setFontSize,20',
                    'text,line1\nline2,110,26.5,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2' },
                        { caption: 'line1\nline2' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1\nline2,10,33.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,60',
                    'setFontSize,30',
                    'text,line1\nline2,110,27.75,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2' },
                        { caption: 'line1\nline2' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1\nline2,10,38,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setFontSize,30',
                    'text,line1\nline2,110,32.25,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2\nline3' },
                        { caption: 'line1\nline2\nline3' }
                    ]
                });

                const expectedLog = [
                    'text,line1\nline2\nline3,10,36.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,80',
                    'setFontSize,20',
                    'text,line1\nline2\nline3,110,32,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2\nline3' },
                        { caption: 'line1\nline2\nline3' }
                    ]
                });

                const expectedLog = [
                    'text,line1\nline2\nline3,10,31.1,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,69',
                    'setFontSize,20',
                    'text,line1\nline2\nline3,110,26.5,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2\nline3' },
                        { caption: 'line1\nline2\nline3' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1\nline2\nline3,10,37,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,90',
                    'setFontSize,30',
                    'text,line1\nline2\nline3,110,25.5,{baseline:middle}',
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
                    columns: [
                        { caption: 'line1\nline2\nline3' },
                        { caption: 'line1\nline2\nline3' }
                    ]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line1\nline2\nline3,10,43.75,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,103.5',
                    'setFontSize,30',
                    'text,line1\nline2\nline3,110,32.25,{baseline:middle}',
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
        });
    }
};

export { JSPdfMultilineTests };
