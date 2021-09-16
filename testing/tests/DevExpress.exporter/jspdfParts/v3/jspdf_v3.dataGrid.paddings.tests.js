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

            QUnit.test('[{f1, padding: { left: 10, top: 5, right: 10, bottom: 5 }}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1' ],
                    dataSource: [{ f1: 'f1_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        pdfCell.padding = { left: 10, top: 5, right: 10, bottom: 5 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,f1_1,20,47.6,{baseline:middle}',
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

            QUnit.test('[{f1, padding: { left: 10, right: 10 }}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1' ],
                    dataSource: [{ f1: 'f1_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        pdfCell.padding = { left: 10, right: 10 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,f1_1,20,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,18.4'
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

            QUnit.test('[{f1, padding: { left: 10, top: 5, right: 10, bottom: 5 }}, {f2}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{ f1: 'f1_1', f2: 'f1_2' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data' && gridCell.column.index === 0) {
                        pdfCell.padding = { left: 10, top: 5, right: 10, bottom: 5 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,f1_1,20,47.6,{baseline:middle}',
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

            QUnit.test('[{f1, padding: { left: 10, right: 10 }}, {f2}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{ f1: 'f1_1', f2: 'f1_2' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data' && gridCell.column.index === 0) {
                        pdfCell.padding = { left: 10, right: 10 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,f1_1,20,42.6,{baseline:middle}',
                    'text,f1_2,110,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,18.4',
                    'setLineWidth,1',
                    'rect,110,33.4,100,18.4'
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

            QUnit.test('[{f1, padding: { top: 5 }}, {f2, padding: { top: 15 }}]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ 'f1', 'f2' ],
                    dataSource: [{ f1: 'f1_1', f2: 'f1_2' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'data') {
                        pdfCell.padding = gridCell.column.index === 0 ? { top: 5 } : { top: 15 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,f1_1,10,52.6,{baseline:middle}',
                    'text,f1_2,110,57.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,100,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,33.4',
                    'setLineWidth,1',
                    'rect,110,33.4,100,33.4'
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

            QUnit.test('[band1-[f1, f2]] - band1 - padding 5, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 Band1 Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'header' && gridCell.column.index === 0) {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,Band1 Band1\nBand1,15,29.2,{baseline:middle}',
                    'text,F1,10,71,{baseline:middle}',
                    'text,F2,80,71,{baseline:middle}',
                    'text,f1_1,10,89.4,{baseline:middle}',
                    'text,f2_1,80,89.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,140,46.8',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,10,80.2,70,18.4',
                    'setLineWidth,1',
                    'rect,80,80.2,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]] - band1 - padding 15, fontSize 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 Band1 Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'header' && gridCell.column.index === 0) {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,Band1 Band1\nBand1,15,31.5,{baseline:middle}',
                    'setFontSize,16',
                    'text,F1,10,80.2,{baseline:middle}',
                    'text,F2,80,80.2,{baseline:middle}',
                    'text,f1_1,10,98.6,{baseline:middle}',
                    'text,f2_1,80,98.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,140,56',
                    'setLineWidth,1',
                    'rect,10,71,70,18.4',
                    'setLineWidth,1',
                    'rect,80,71,70,18.4',
                    'setLineWidth,1',
                    'rect,10,89.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,89.4,70,18.4'
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

            QUnit.test('[f1, band1-[f2, f3]] - f1 - padding 15, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { fieldName: 'f1', caption: 'F1 wrap' },
                        { caption: 'Band1', columns: [ 'f2', 'f3', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'header' && gridCell.column.index === 0) {
                        pdfCell.padding = 15;
                    }
                };

                const expectedLog = [
                    'text,F1\nwrap,25,39.2,{baseline:middle}',
                    'text,Band1,80,28.8,{baseline:middle}',
                    'text,F2,80,62.2,{baseline:middle}',
                    'text,F3,150,62.2,{baseline:middle}',
                    'text,f2_1,80,91,{baseline:middle}',
                    'text,f3_1,150,91,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,66.8',
                    'setLineWidth,1',
                    'rect,80,15,140,27.6',
                    'setLineWidth,1',
                    'rect,80,42.6,70,39.2',
                    'setLineWidth,1',
                    'rect,150,42.6,70,39.2',
                    'setLineWidth,1',
                    'rect,10,81.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,81.8,70,18.4',
                    'setLineWidth,1',
                    'rect,150,81.8,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, f3]] - f1 - padding 15, fontSize 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { fieldName: 'f1', caption: 'F1 wrap' },
                        { caption: 'Band1', columns: [ 'f2', 'f3', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'header' && gridCell.column.index === 0) {
                        pdfCell.padding = 15;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,F1 \nwra\np,25,41.5,{baseline:middle}',
                    'setFontSize,16',
                    'text,Band1,80,36.85,{baseline:middle}',
                    'text,F2,80,86.35,{baseline:middle}',
                    'text,F3,150,86.35,{baseline:middle}',
                    'text,f2_1,80,123.2,{baseline:middle}',
                    'text,f3_1,150,123.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,99',
                    'setLineWidth,1',
                    'rect,80,15,140,43.7',
                    'setLineWidth,1',
                    'rect,80,58.7,70,55.3',
                    'setLineWidth,1',
                    'rect,150,58.7,70,55.3',
                    'setLineWidth,1',
                    'rect,10,114,70,18.4',
                    'setLineWidth,1',
                    'rect,80,114,70,18.4',
                    'setLineWidth,1',
                    'rect,150,114,70,18.4'
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

            QUnit.test('[f1, band1-[f2, f3]] - f2 - padding 5, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1', {
                            caption: 'Band1', columns: [
                                {
                                    fieldName: 'f2', caption: 'F2 wrap wrap'
                                },
                                'f3',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'header' && gridCell.column.fieldName === 'f2') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,F1,10,47.6,{baseline:middle}',
                    'text,Band1,80,24.2,{baseline:middle}',
                    'text,F2 wrap\nwrap,85,47.6,{baseline:middle}',
                    'text,F3,150,56.8,{baseline:middle}',
                    'text,f1_1,10,89.4,{baseline:middle}',
                    'text,f3_1,150,89.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,65.2',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,70,46.8',
                    'setLineWidth,1',
                    'rect,150,33.4,70,46.8',
                    'setLineWidth,1',
                    'rect,10,80.2,70,18.4',
                    'setLineWidth,1',
                    'rect,80,80.2,70,18.4',
                    'setLineWidth,1',
                    'rect,150,80.2,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, f3]] - f2 - padding 5, fontSize 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1', {
                            caption: 'Band1', columns: [
                                {
                                    fieldName: 'f2', caption: 'F2 wrap wrap'
                                },
                                'f3',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'header' && gridCell.column.fieldName === 'f2') {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,63.7,{baseline:middle}',
                    'text,Band1,80,24.2,{baseline:middle}',
                    'setFontSize,20',
                    'text,F2\nwrap\nwrap,85,49.9,{baseline:middle}',
                    'setFontSize,16',
                    'text,F3,150,72.9,{baseline:middle}',
                    'text,f1_1,10,121.6,{baseline:middle}',
                    'text,f3_1,150,121.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,97.4',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,70,79',
                    'setLineWidth,1',
                    'rect,150,33.4,70,79',
                    'setLineWidth,1',
                    'rect,10,112.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,112.4,70,18.4',
                    'setLineWidth,1',
                    'rect,150,112.4,70,18.4'
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

            QUnit.test('[f1, band1-[f2, f3]] - f3 - padding 5, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1', {
                            caption: 'Band1', columns: [
                                'f2', {
                                    fieldName: 'f3', caption: 'F3 wrap wrap'
                                },
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'header' && gridCell.column.fieldName === 'f3') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'text,F1,10,47.6,{baseline:middle}',
                    'text,Band1,80,24.2,{baseline:middle}',
                    'text,F2,80,56.8,{baseline:middle}',
                    'text,F3 wrap\nwrap,155,47.6,{baseline:middle}',
                    'text,f1_1,10,89.4,{baseline:middle}',
                    'text,f2_1,80,89.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,65.2',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,70,46.8',
                    'setLineWidth,1',
                    'rect,150,33.4,70,46.8',
                    'setLineWidth,1',
                    'rect,10,80.2,70,18.4',
                    'setLineWidth,1',
                    'rect,80,80.2,70,18.4',
                    'setLineWidth,1',
                    'rect,150,80.2,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, f3]] - f3 - padding 5, fontSize 20, wordWrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        'f1', {
                            caption: 'Band1', columns: [
                                'f2',
                                { fieldName: 'f3', caption: 'F3 wrap wrap' },
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'header' && gridCell.column.fieldName === 'f3') {
                        pdfCell.padding = 5;
                        pdfCell.font = { size: 20 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,63.7,{baseline:middle}',
                    'text,Band1,80,24.2,{baseline:middle}',
                    'text,F2,80,72.9,{baseline:middle}',
                    'setFontSize,20',
                    'text,F3\nwrap\nwrap,155,49.9,{baseline:middle}',
                    'setFontSize,16',
                    'text,f1_1,10,121.6,{baseline:middle}',
                    'text,f2_1,80,121.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,97.4',
                    'setLineWidth,1',
                    'rect,80,15,140,18.4',
                    'setLineWidth,1',
                    'rect,80,33.4,70,79',
                    'setLineWidth,1',
                    'rect,150,33.4,70,79',
                    'setLineWidth,1',
                    'rect,10,112.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,112.4,70,18.4',
                    'setLineWidth,1',
                    'rect,150,112.4,70,18.4'
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
