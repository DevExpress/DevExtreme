import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfPaddingsTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Paddings', moduleConfig, () => {
            QUnit.test('[{f1, padding: 5}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1' ],
                    dataSource: [{ f1: 'f1_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,f1_1,15,47.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,28.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5, fontSize 20}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1' ],
                    dataSource: [{ f1: 'f1_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'setFontSize,20',
                    'text,f1_1,15,49.9,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,33',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5}] - wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [ 'f1' ],
                    dataSource: [{ f1: 'very long line very long line very long line' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,very long\nline very\nlong line\nvery long\nline,15,47.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,102'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5, fontSize 20}] - wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [ 'f1' ],
                    dataSource: [{ f1: 'very long line very long line very long line' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'setFontSize,20',
                    'text,very long\nline very\nlong line\nvery long\nline,15,49.9,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,125',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5}, {f2}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{ f1: 'f1_1', f2: 'f1_2' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data' && gridCell.column.index === 0) {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,f1_1,15,47.6,{baseline:middle}',
                    'text,f1_2,110,47.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,28.4',
                    'setLineWidth,1',
                    'rect,110,33.4,100,28.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5, fontSize 20}, {f2}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{ f1: 'f1_1', f2: 'f1_2' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data' && gridCell.column.index === 0) {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'setFontSize,20',
                    'text,f1_1,15,49.9,{baseline:middle}',
                    'setFontSize,16',
                    'text,f1_2,110,49.9,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,33',
                    'setLineWidth,1',
                    'rect,110,33.4,100,33'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5}, {f2}] - wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{ f1: 'very long line very long line very long line', f2: 'f1_2' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data' && gridCell.column.index === 0) {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,very long\nline very\nlong line\nvery long\nline,15,47.6,{baseline:middle}',
                    'text,f1_2,110,84.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,102',
                    'setLineWidth,1',
                    'rect,110,33.4,100,102'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5}, fontSize 20, {f2}] - wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{ f1: 'very long line very long line very long line', f2: 'f1_2' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data' && gridCell.column.index === 0) {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'setFontSize,20',
                    'text,very long\nline very\nlong line\nvery long\nline,15,49.9,{baseline:middle}',
                    'setFontSize,16',
                    'text,f1_2,110,95.9,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,125',
                    'setLineWidth,1',
                    'rect,110,33.4,100,125'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5}, {f2, padding: 10}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{ f1: 'f1_1', f2: 'f1_2' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        pdfCell.padding = gridCell.column.index === 0 ? 5 : 10;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,f1_1,15,52.6,{baseline:middle}',
                    'text,f1_2,120,52.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,38.4',
                    'setLineWidth,1',
                    'rect,110,33.4,100,38.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5}, {f2, padding: 10, fontSize 20}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{ f1: 'f1_1', f2: 'f1_2' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        if(gridCell.column.index === 0) {
                            pdfCell.padding = 5;
                        } else {
                            pdfCell.padding = 10;
                            pdfCell.font = { size: 20 };
                        }
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,f1_1,15,54.9,{baseline:middle}',
                    'setFontSize,20',
                    'text,f1_2,120,54.9,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,43',
                    'setLineWidth,1',
                    'rect,110,33.4,100,43',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5}, {f2, padding: 10}] - wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{
                        f1: 'very long line very long line very long line',
                        f2: 'very long line very long line very long line'
                    }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        pdfCell.padding = gridCell.column.index === 0 ? 5 : 10;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,very long\nline very\nlong line\nvery long\nline,15,52.6,{baseline:middle}',
                    'text,very long\nline very\nlong line\nvery long\nline,120,52.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,112',
                    'setLineWidth,1',
                    'rect,110,33.4,100,112'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, padding: 5}, {f2, padding: 10, fontSize 20}] - wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{
                        f1: 'very long line very long line very long line',
                        f2: 'very long line very long line very long line'
                    }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        if(gridCell.column.index === 0) {
                            pdfCell.padding = 5;
                        } else {
                            pdfCell.padding = 10;
                            pdfCell.font = { size: 20 };
                        }
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,very long\nline very\nlong line\nvery long\nline,15,75.6,{baseline:middle}',
                    'setFontSize,20',
                    'text,very\nlong line\nvery\nlong line\nvery\nlong line,120,54.9,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,158',
                    'setLineWidth,1',
                    'rect,110,33.4,100,158',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]] - band1 - padding 5', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'Band1') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,Band1,15,29.2,{baseline:middle}',
                    'text,F1,10,52.6,{baseline:middle}',
                    'text,F2,80,52.6,{baseline:middle}',
                    'text,f1_1,10,71,{baseline:middle}',
                    'text,f2_1,80,71,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,140,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,43.4,70,18.4',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,61.8,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]] - band1 - padding 15, fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'Band1') {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,Band1,15,31.5,{baseline:middle}',
                    'setFontSize,16',
                    'text,F1,10,57.2,{baseline:middle}',
                    'text,F2,80,57.2,{baseline:middle}',
                    'text,f1_1,10,75.6,{baseline:middle}',
                    'text,f2_1,80,75.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,140,33',
                    'setLineWidth,1',
                    'rect,10,48,70,18.4',
                    'setLineWidth,1',
                    'rect,80,48,70,18.4',
                    'setLineWidth,1',
                    'rect,10,66.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,66.4,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, f3]] - f1 - padding 15', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band1', columns: [ 'f2', 'f3', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'F1') {
                        pdfCell.padding = 15;
                    }
                };

                const expectedLog = [
                    'text,F1,25,39.2,{baseline:middle}',
                    'text,Band1,80,27.1,{baseline:middle}',
                    'text,F2,80,51.3,{baseline:middle}',
                    'text,F3,150,51.3,{baseline:middle}',
                    'text,f1_1,10,72.6,{baseline:middle}',
                    'text,f2_1,80,72.6,{baseline:middle}',
                    'text,f3_1,150,72.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,48.4',
                    'setLineWidth,1',
                    'rect,80,15,140,24.2',
                    'setLineWidth,1',
                    'rect,80,39.2,70,24.2',
                    'setLineWidth,1',
                    'rect,150,39.2,70,24.2',
                    'setLineWidth,1',
                    'rect,10,63.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,63.4,70,18.4',
                    'setLineWidth,1',
                    'rect,150,63.4,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, f3]] - f1 - padding 15, fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band1', columns: [ 'f2', 'f3', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'F1') {
                        pdfCell.padding = 15;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,F1,25,41.5,{baseline:middle}',
                    'setFontSize,16',
                    'text,Band1,80,28.25,{baseline:middle}',
                    'text,F2,80,54.75,{baseline:middle}',
                    'text,F3,150,54.75,{baseline:middle}',
                    'text,f1_1,10,77.2,{baseline:middle}',
                    'text,f2_1,80,77.2,{baseline:middle}',
                    'text,f3_1,150,77.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,53',
                    'setLineWidth,1',
                    'rect,80,15,140,26.5',
                    'setLineWidth,1',
                    'rect,80,41.5,70,26.5',
                    'setLineWidth,1',
                    'rect,150,41.5,70,26.5',
                    'setLineWidth,1',
                    'rect,10,68,70,18.4',
                    'setLineWidth,1',
                    'rect,80,68,70,18.4',
                    'setLineWidth,1',
                    'rect,150,68,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, f3]] - f2 - padding 5', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band1', columns: [ 'f2', 'f3', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'F2') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,F1,10,38.4,{baseline:middle}',
                    'text,Band1,80,24.2,{baseline:middle}',
                    'text,F2,85,47.6,{baseline:middle}',
                    'text,F3,150,47.6,{baseline:middle}',
                    'text,f1_1,10,71,{baseline:middle}',
                    'text,f2_1,80,71,{baseline:middle}',
                    'text,f3_1,150,71,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,46.8',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,70,28.4',
                    'setLineWidth,1',
                    'rect,150,33.4,70,28.4',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,150,61.8,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, f3]] - f2 - padding 5, fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band1', columns: [ 'f2', 'f3', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'F2') {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,40.7,{baseline:middle}',
                    'text,Band1,80,24.2,{baseline:middle}',
                    'setFontSize,20',
                    'text,F2,85,49.9,{baseline:middle}',
                    'setFontSize,16',
                    'text,F3,150,49.9,{baseline:middle}',
                    'text,f1_1,10,75.6,{baseline:middle}',
                    'text,f2_1,80,75.6,{baseline:middle}',
                    'text,f3_1,150,75.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,51.4',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,70,33',
                    'setLineWidth,1',
                    'rect,150,33.4,70,33',
                    'setLineWidth,1',
                    'rect,10,66.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,66.4,70,18.4',
                    'setLineWidth,1',
                    'rect,150,66.4,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, f3]] - f3 - padding 5', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band1', columns: [ 'f2', 'f3', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'F3') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,F1,10,38.4,{baseline:middle}',
                    'text,Band1,80,24.2,{baseline:middle}',
                    'text,F2,80,47.6,{baseline:middle}',
                    'text,F3,155,47.6,{baseline:middle}',
                    'text,f1_1,10,71,{baseline:middle}',
                    'text,f2_1,80,71,{baseline:middle}',
                    'text,f3_1,150,71,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,46.8',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,70,28.4',
                    'setLineWidth,1',
                    'rect,150,33.4,70,28.4',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,150,61.8,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, f3]] - f3 - padding 5, fontSize 20', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band1', columns: [ 'f2', 'f3', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(pdfCell.text === 'F3') {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,40.7,{baseline:middle}',
                    'text,Band1,80,24.2,{baseline:middle}',
                    'text,F2,80,49.9,{baseline:middle}',
                    'setFontSize,20',
                    'text,F3,155,49.9,{baseline:middle}',
                    'setFontSize,16',
                    'text,f1_1,10,75.6,{baseline:middle}',
                    'text,f2_1,80,75.6,{baseline:middle}',
                    'text,f3_1,150,75.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,51.4',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,70,33',
                    'setLineWidth,1',
                    'rect,150,33.4,70,33',
                    'setLineWidth,1',
                    'rect,10,66.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,66.4,70,18.4',
                    'setLineWidth,1',
                    'rect,150,66.4,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfPaddingsTests };
