import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfBorderColorsTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        QUnit.module('Styles - Border color', moduleConfig, () => {
            const rowOptions = {
                rowHeight: 16
            };

            QUnit.test('Simple - [{f1, f2] - Custom border color for one header cell', function(assert) {
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

            QUnit.test('Simple - [{f1, f2] - Custom border color for header cells', function(assert) {
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

            QUnit.test('Simple - [{f1, f2] - Different border colors for header cells', function(assert) {
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

            QUnit.test('Simple - [{f1, f2] - Custom border color for data cells', function(assert) {
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

            // TODO: Styles with groups/Summaries
        });
    }
};

export { JSPdfBorderColorsTests };
