import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfBorderColorsTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        QUnit.module('Styles - Border color', moduleConfig, () => {
            const rowOptions = {
                rowHeight: 16
            };

            QUnit.test('Simple - [{f1, f2] - Custom border HEX color for one header cell', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header' && gridCell.column.index === 1) {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,180,15,90,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'rect,100,15,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border GRAY color for one header cell', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header' && gridCell.column.index === 1) {
                        pdfCell.borderColor = 128;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,180,15,90,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,128',
                    'rect,100,15,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border RGB color for one header cell', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header' && gridCell.column.index === 1) {
                        pdfCell.borderColor = { ch1: 0, ch2: 255, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,180,15,90,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,255,0',
                    'rect,100,15,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border SMYC color for one header cell', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header' && gridCell.column.index === 1) {
                        pdfCell.borderColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,180,15,90,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,0,1,0',
                    'rect,100,15,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border HEX color for header cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'rect,180,15,90,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border GRAY color for header cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = 128;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,128',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,128',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,128',
                    'rect,180,15,90,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border RGB color for header cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = { ch1: 0, ch2: 255, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,255,0',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,255,0',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,255,0',
                    'rect,180,15,90,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border SMYC color for header cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,0,1,0',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,0,1,0',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,0,1,0',
                    'rect,180,15,90,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Different border HEX colors for header cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const colors = ['#ff0000', '#00ff00', '#0000ff'];
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = colors[gridCell.column.index];
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#ff0000',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#00ff00',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#0000ff',
                    'rect,180,15,90,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Different border GRAY colors for header cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const colors = [80, 128, 255];
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = colors[gridCell.column.index];
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,80',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,128',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,255',
                    'rect,180,15,90,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Different border RGB colors for header cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const colors = [{ ch1: 255, ch2: 0, ch3: 0 }, { ch1: 0, ch2: 255, ch3: 0 }, { ch1: 0, ch2: 0, ch3: 255 }];
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = colors[gridCell.column.index];
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,255,0,0',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,255,0',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,0,255',
                    'rect,180,15,90,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Different border SMYC colors for header cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                    ],
                });

                const colors = [{ ch1: 1, ch2: 0, ch3: 0, ch4: 0 }, { ch1: 0, ch2: 1, ch3: 0, ch4: 0 }, { ch1: 0, ch2: 0, ch3: 1, ch4: 0 }];
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = colors[gridCell.column.index];
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,1,0,0,0',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,1,0,0',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,0,1,0',
                    'rect,180,15,90,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2, f3] - Custom border color for center cell', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(pdfCell.text === 'f1_2') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'text,f2_1,10,61,',
                    'text,f2_2,100,61,',
                    'text,f2_3,180,61,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'rect,180,15,90,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,90,18.4',
                    'setLineWidth,1',
                    'rect,100,51.8,80,18.4',
                    'setLineWidth,1',
                    'rect,180,51.8,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'rect,100,33.4,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2, f3] - Custom border color for column cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.column.dataField === 'f2') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'text,f2_1,10,61,',
                    'text,f2_2,100,61,',
                    'text,f2_3,180,61,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,180,15,90,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,90,18.4',
                    'setLineWidth,1',
                    'rect,180,51.8,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'rect,100,51.8,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2, f3] - Different border colors for column cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const colors = ['#ff0000', '#00ff00', '#0000ff'];
                let rowIndex = 0;
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.column.dataField === 'f2') {
                        pdfCell.borderColor = colors[rowIndex];
                        rowIndex += 1;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,F3,180,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'text,f1_3,180,42.6,',
                    'text,f2_1,10,61,',
                    'text,f2_2,100,61,',
                    'text,f2_3,180,61,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,180,15,90,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,180,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,90,18.4',
                    'setLineWidth,1',
                    'rect,180,51.8,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#ff0000',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#00ff00',
                    'rect,100,33.4,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#0000ff',
                    'rect,100,51.8,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border color for header cells - borders for data cells are hidden', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                    if(gridCell.rowType === 'data') {
                        pdfCell.drawLeftBorder = false;
                        pdfCell.drawRightBorder = false;
                        pdfCell.drawBottomBorder = false;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'setLineWidth,1',
                    'line,10,33.4,100,33.4',
                    'setLineWidth,1',
                    'line,100,33.4,180,33.4',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border color for header cells - vertical borders are hidden', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    pdfCell.drawLeftBorder = false;
                    pdfCell.drawRightBorder = false;
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'setLineWidth,1',
                    'line,10,33.4,100,33.4',
                    'line,10,51.8,100,51.8',
                    'setLineWidth,1',
                    'line,100,33.4,180,33.4',
                    'line,100,51.8,180,51.8',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'line,10,15,100,15',
                    'line,10,33.4,100,33.4',
                    'setLineWidth,1',
                    'line,100,15,180,15',
                    'line,100,33.4,180,33.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border color for header cells - horizontal borders are hidden', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    pdfCell.drawTopBorder = false;
                    pdfCell.drawBottomBorder = false;
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'setLineWidth,1',
                    'line,10,33.4,10,51.8',
                    'line,100,33.4,100,51.8',
                    'setLineWidth,1',
                    'line,100,33.4,100,51.8',
                    'line,180,33.4,180,51.8',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'line,10,15,10,33.4',
                    'line,100,15,100,33.4',
                    'setLineWidth,1',
                    'line,100,15,100,33.4',
                    'line,180,15,180,33.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border HEX color for data cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'rect,100,33.4,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border GRAY color for data cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = 128;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,128',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,128',
                    'rect,100,33.4,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border RGB color for data cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = { ch1: 0, ch2: 255, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,255,0',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,255,0',
                    'rect,100,33.4,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border SMYC color for data cells', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = { ch1: 0, ch2: 1, ch3: 0, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,1,0,0',
                    'rect,10,33.4,90,18.4',
                    'setLineWidth,1',
                    'setDrawColor,0,1,0,0',
                    'rect,100,33.4,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border color for data cells - vertical borders are hidden', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    pdfCell.drawLeftBorder = false;
                    pdfCell.drawRightBorder = false;
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'setLineWidth,1',
                    'line,10,15,100,15',
                    'line,10,33.4,100,33.4',
                    'setLineWidth,1',
                    'line,100,15,180,15',
                    'line,100,33.4,180,33.4',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'line,10,33.4,100,33.4',
                    'line,10,51.8,100,51.8',
                    'setLineWidth,1',
                    'line,100,33.4,180,33.4',
                    'line,100,51.8,180,51.8',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom border color for data cells - horizontal borders are hidden', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    pdfCell.drawTopBorder = false;
                    pdfCell.drawBottomBorder = false;
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,100,24.2,',
                    'text,f1_1,10,42.6,',
                    'text,f1_2,100,42.6,',
                    'setLineWidth,1',
                    'line,10,15,10,33.4',
                    'line,100,15,100,33.4',
                    'setLineWidth,1',
                    'line,100,15,100,33.4',
                    'line,180,15,180,33.4',
                    'setLineWidth,1',
                    'setDrawColor,#dddd00',
                    'line,10,33.4,10,51.8',
                    'line,100,33.4,100,51.8',
                    'setLineWidth,1',
                    'line,100,33.4,100,51.8',
                    'line,180,33.4,180,51.8',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 1 level - [{f1, groupIndex: 0}, f2, f3] - custom border color in grouped row', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'group') {
                        pdfCell.borderColor = (gridCell.column.index === 0) ? '#dddd00' : { ch1: 221, ch2: 221, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,',
                    'text,F3,100,24.2,',
                    'text,F1: f1_1,10,42.6,',
                    'text,f1_2,20,61,',
                    'text,f1_3,100,61,',
                    'text,F1: f2_1,10,79.4,',
                    'text,f2_2,20,97.8,',
                    'text,f2_3,100,97.8,',
                    'setLineWidth,1', 'rect,10,15,90,18.4',
                    'setLineWidth,1', 'rect,100,15,80,18.4',
                    'setLineWidth,1', 'rect,20,51.8,80,18.4',
                    'setLineWidth,1', 'rect,100,51.8,80,18.4',
                    'setLineWidth,1', 'rect,20,88.6,80,18.4',
                    'setLineWidth,1', 'rect,100,88.6,80,18.4',
                    'setLineWidth,1', 'setDrawColor,#dddd00', 'rect,10,33.4,170,18.4',
                    'setLineWidth,1', 'rect,10,70.2,170,18.4', 'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 1 level - [{f1, groupIndex: 0}, f2, f3] - custom border color in grouped row and data row', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'group' && gridCell.column.dataField === 'f1') {
                        pdfCell.borderColor = 100;
                    } else if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f2') {
                        pdfCell.borderColor = (gridCell.column.index === 0) ? '#0000dd' : { ch1: 0, ch2: 0, ch3: 221 };
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,',
                    'text,F3,100,24.2,',
                    'text,F1: f1_1,10,42.6,',
                    'text,f1_2,20,61,',
                    'text,f1_3,100,61,',
                    'text,F1: f2_1,10,79.4,',
                    'text,f2_2,20,97.8,',
                    'text,f2_3,100,97.8,',
                    'setLineWidth,1', 'rect,10,15,90,18.4',
                    'setLineWidth,1', 'rect,100,15,80,18.4',
                    'setLineWidth,1', 'rect,100,51.8,80,18.4',
                    'setLineWidth,1', 'rect,100,88.6,80,18.4',
                    'setLineWidth,1', 'setDrawColor,100', 'rect,10,33.4,170,18.4',
                    'setLineWidth,1', 'setDrawColor,0,0,221', 'rect,20,51.8,80,18.4',
                    'setLineWidth,1', 'setDrawColor,100', 'rect,10,70.2,170,18.4',
                    'setLineWidth,1', 'setDrawColor,0,0,221', 'rect,20,88.6,80,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 1 level - [{f1, groupIndex: 0}, f2, f3] - custom border color in grouped row - borders between data cell are hidden', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'group') {
                        pdfCell.borderColor = '#dddd00';
                    }
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = (gridCell.column.index === 0) ? '#0000dd' : { ch1: 0, ch2: 0, ch3: 221 };
                        pdfCell.drawLeftBorder = gridCell.column.index <= 1;
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,',
                    'text,F3,100,24.2,',
                    'text,F1: f1_1,10,42.6,',
                    'text,f1_2,20,61,',
                    'text,f1_3,100,61,',
                    'text,F1: f2_1,10,79.4,',
                    'text,f2_2,20,97.8,',
                    'text,f2_3,100,97.8,',
                    'setLineWidth,1', 'rect,10,15,90,18.4',
                    'setLineWidth,1', 'rect,100,15,80,18.4',
                    'setLineWidth,1', 'setDrawColor,#dddd00', 'rect,10,33.4,170,18.4',
                    'setLineWidth,1', 'setDrawColor,0,0,221', 'line,20,51.8,100,51.8', 'line,20,51.8,20,70.2', 'line,20,70.2,100,70.2',
                    'setLineWidth,1', 'setDrawColor,0,0,221', 'line,100,51.8,180,51.8', 'line,180,51.8,180,70.2', 'line,100,70.2,180,70.2',
                    'setLineWidth,1', 'setDrawColor,#dddd00', 'rect,10,70.2,170,18.4',
                    'setLineWidth,1', 'setDrawColor,0,0,221', 'line,20,88.6,100,88.6', 'line,20,88.6,20,107', 'line,20,107,100,107',
                    'setLineWidth,1', 'setDrawColor,0,0,221', 'line,100,88.6,180,88.6', 'line,180,88.6,180,107', 'line,100,107,180,107',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 2 level - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - custom border color in grouped row - different colors for group levels', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'group') {
                        pdfCell.borderColor = gridCell.groupIndex === 0 ? '#dddd00' : '#00dddd';
                    }
                };

                const expectedLog = [
                    'text,F3,10,24.2,',
                    'text,F4,100,24.2,',
                    'text,F1: f1,10,42.6,',
                    'text,F2: f1_2,20,61,',
                    'text,f1_3,30,79.4,',
                    'text,f1_4,100,79.4,',
                    'text,F2: f2_2,20,97.8,',
                    'text,f2_3,30,116.2,',
                    'text,f2_4,100,116.2,',
                    'setLineWidth,1', 'rect,10,15,90,18.4',
                    'setLineWidth,1', 'rect,100,15,80,18.4',
                    'setLineWidth,1', 'rect,30,70.2,70,18.4',
                    'setLineWidth,1', 'rect,100,70.2,80,18.4',
                    'setLineWidth,1', 'rect,30,107,70,18.4',
                    'setLineWidth,1', 'rect,100,107,80,18.4',
                    'setLineWidth,1', 'setDrawColor,#dddd00', 'rect,10,33.4,170,18.4',
                    'setLineWidth,1', 'setDrawColor,#00dddd', 'rect,20,51.8,160,18.4',
                    'setLineWidth,1', 'rect,20,88.6,160,18.4', 'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 1 level - [{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f4, alignByColumn, showInGroupFooter}] - custom border color in group footer row', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    summary: {
                        groupItems: [ { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true } ]
                    },
                    dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'groupFooter') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,',
                    'text,F3,90,24.2,',
                    'text,F4,180,24.2,',
                    'text,F1: f1,10,42.6,',
                    'text,f2,20,61,',
                    'text,f3,90,61,',
                    'text,f4,180,61,',
                    'text,Max: f4,180,79.4,',
                    'setLineWidth,1', 'rect,10,15,80,18.4',
                    'setLineWidth,1', 'rect,90,15,90,18.4',
                    'setLineWidth,1', 'rect,180,15,80,18.4',
                    'setLineWidth,1', 'rect,10,33.4,250,18.4',
                    'setLineWidth,1', 'rect,20,51.8,70,18.4',
                    'setLineWidth,1', 'rect,90,51.8,90,18.4',
                    'setLineWidth,1', 'rect,180,51.8,80,18.4',
                    'setLineWidth,1', 'setDrawColor,#dddd00', 'rect,20,70.2,70,18.4',
                    'setLineWidth,1', 'rect,90,70.2,90,18.4',
                    'setLineWidth,1', 'rect,180,70.2,80,18.4', 'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 2 level - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}] - custom border color in group footer row - different colors for group levels', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f1', summaryType: 'max' },
                            { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                        ]
                    },
                    dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
                });

                let groupFooterCells = 0;
                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'groupFooter') {
                        pdfCell.borderColor = groupFooterCells < 2 ? { ch1: 221, ch2: 221, ch3: 0 } : '#00dddd';
                        groupFooterCells += 1;
                    }
                };

                const expectedLog = [
                    'text,F3,10,24.2,',
                    'text,F4,260,24.2,',
                    'text,F1: f1 (Max: f1),10,42.6,',
                    'text,F2: f2 (Max of F1 is f1),20,61,',
                    'text,f3,30,79.4,',
                    'text,f4,260,79.4,',
                    'text,Max: f4,260,97.8,',
                    'text,Max: f4,260,116.2,',
                    'setLineWidth,1', 'rect,10,15,250,18.4',
                    'setLineWidth,1', 'rect,260,15,100,18.4',
                    'setLineWidth,1', 'rect,10,33.4,350,18.4',
                    'setLineWidth,1', 'rect,20,51.8,340,18.4',
                    'setLineWidth,1', 'rect,30,70.2,230,18.4',
                    'setLineWidth,1', 'rect,260,70.2,100,18.4',
                    'setLineWidth,1', 'setDrawColor,221,221,0', 'rect,30,88.6,230,18.4',
                    'setLineWidth,1', 'setDrawColor,221,221,0', 'rect,260,88.6,100,18.4',
                    'setLineWidth,1', 'setDrawColor,#00dddd', 'rect,20,107,240,18.4',
                    'setLineWidth,1', 'rect,260,107,100,18.4', 'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Total summaries - [f1, f2], totalItems: [f1] - custom color in summary row', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' }
                    ],
                    summary: {
                        totalItems: [
                            { column: 'f1', summaryType: 'max' }
                        ]
                    },
                    dataSource: [{ f1: 'f1', f2: 'f2' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'totalFooter') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,',
                    'text,F2,90,24.2,',
                    'text,f1,10,42.6,',
                    'text,f2,90,42.6,',
                    'text,Max: f1,10,61,',
                    'setLineWidth,1', 'rect,10,15,80,18.4',
                    'setLineWidth,1', 'rect,90,15,90,18.4',
                    'setLineWidth,1', 'rect,10,33.4,80,18.4',
                    'setLineWidth,1', 'rect,90,33.4,90,18.4',
                    'setLineWidth,1', 'setDrawColor,#dddd00', 'rect,10,51.8,80,18.4',
                    'setLineWidth,1', 'rect,90,51.8,90,18.4', 'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Total summaries - [{f1, groupIndex: 0}, f2, f3], totalItems: [f2] - custom color in summary row', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' }
                    ],
                    summary: {
                        totalItems: [
                            { column: 'f2', summaryType: 'max' }
                        ]
                    },
                    dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3' }]
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'totalFooter') {
                        pdfCell.borderColor = { ch1: 221, ch2: 221, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,',
                    'text,F3,90,24.2,',
                    'text,F1: f1,10,42.6,',
                    'text,f2,20,61,',
                    'text,f3,90,61,',
                    'text,Max: f2,10,79.4,',
                    'setLineWidth,1', 'rect,10,15,80,18.4',
                    'setLineWidth,1', 'rect,90,15,90,18.4',
                    'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'setLineWidth,1', 'rect,20,51.8,70,18.4',
                    'setLineWidth,1', 'rect,90,51.8,90,18.4',
                    'setLineWidth,1', 'setDrawColor,221,221,0', 'rect,10,70.2,80,18.4',
                    'setLineWidth,1', 'setDrawColor,221,221,0', 'rect,90,70.2,90,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]] - custom color for BAND cell', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(pdfCell.text === 'Band1') {
                        pdfCell.borderColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'text,Band1,10,24.2,',
                    'text,F1,10,42.6,',
                    'text,F2,80,42.6,',
                    'text,f1_1,10,61,',
                    'text,f2_1,80,61,',
                    'setLineWidth,1', 'rect,10,33.4,70,18.4',
                    'setLineWidth,1', 'rect,80,33.4,70,18.4',
                    'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'setLineWidth,1', 'rect,80,51.8,70,18.4',
                    'setLineWidth,1', 'setDrawColor,#ffff00', 'rect,10,15,140,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1], f2]] - custom color for BAND cell', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1',
                            columns: [
                                { caption: 'Band1_1', columns: [ 'f1' ] },
                                'f2',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(pdfCell.text === 'Band1') {
                        pdfCell.borderColor = { ch1: 221, ch2: 221, ch3: 0 };
                    }
                    if(pdfCell.text === 'Band1_1') {
                        pdfCell.borderColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'text,Band1,10,24.2,',
                    'text,Band1_1,10,42.6,',
                    'text,F2,80,51.8,',
                    'text,F1,10,61,',
                    'text,f1_1_1,10,79.4,',
                    'text,f2_1,80,79.4,',
                    'setLineWidth,1', 'rect,80,33.4,80,36.8',
                    'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'setLineWidth,1', 'rect,10,70.2,70,18.4',
                    'setLineWidth,1', 'rect,80,70.2,80,18.4',
                    'setLineWidth,1', 'setDrawColor,221,221,0', 'rect,10,15,150,18.4',
                    'setLineWidth,1', 'setDrawColor,#ffff00', 'rect,10,33.4,70,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2]]] - custom color for BAND cell', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                'f1',
                                { caption: 'Band1_2', columns: [ 'f2' ] }
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(pdfCell.text === 'Band1') {
                        pdfCell.borderColor = { ch1: 221, ch2: 221, ch3: 0 };
                    }
                    if(pdfCell.text === 'Band1_2') {
                        pdfCell.borderColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'text,Band1,10,24.2,',
                    'text,F1,10,51.8,',
                    'text,Band1_2,70,42.6,',
                    'text,F2,70,61,',
                    'text,f1_1,10,79.4,',
                    'text,f2_1_1,70,79.4,',
                    'setLineWidth,1', 'rect,10,33.4,60,36.8',
                    'setLineWidth,1', 'rect,70,51.8,70,18.4',
                    'setLineWidth,1', 'rect,10,70.2,60,18.4',
                    'setLineWidth,1', 'rect,70,70.2,70,18.4',
                    'setLineWidth,1', 'setDrawColor,221,221,0', 'rect,10,15,130,18.4',
                    'setLineWidth,1', 'setDrawColor,#ffff00', 'rect,70,33.4,70,18.4',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2]]] - custom color for BAND cell with hidden borders', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                'f1',
                                { caption: 'Band1_2', columns: [ 'f2' ] }
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.jsPdfTextOptions = { baseline: 'alphabetic' };
                    if(pdfCell.text === 'Band1') {
                        pdfCell.borderColor = { ch1: 221, ch2: 221, ch3: 0 };
                    }
                    if(pdfCell.text === 'Band1_2') {
                        pdfCell.borderColor = '#ffff00';
                        pdfCell.drawTopBorder = false;
                    }
                };

                const expectedLog = [
                    'text,Band1,10,24.2,',
                    'text,F1,10,51.8,',
                    'text,Band1_2,70,42.6,',
                    'text,F2,70,61,',
                    'text,f1_1,10,79.4,',
                    'text,f2_1_1,70,79.4,',
                    'setLineWidth,1', 'rect,10,33.4,60,36.8',
                    'setLineWidth,1', 'rect,70,51.8,70,18.4',
                    'setLineWidth,1', 'rect,10,70.2,60,18.4',
                    'setLineWidth,1', 'rect,70,70.2,70,18.4',
                    'setLineWidth,1', 'setDrawColor,221,221,0', 'rect,10,15,130,18.4',
                    'setLineWidth,1', 'setDrawColor,#ffff00', 'line,70,33.4,70,51.8', 'line,140,33.4,140,51.8', 'line,70,51.8,140,51.8',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfBorderColorsTests };
