import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header' && gridCell.column.index === 1) {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F2,100,23,',
                    'text,F3,180,23,', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,f1_1,10,39,', 'setLineWidth,1', 'rect,10,31,90,16',
                    'text,f1_2,100,39,', 'setLineWidth,1', 'rect,100,31,80,16',
                    'text,f1_3,180,39,', 'setLineWidth,1', 'rect,180,31,90,16',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,100,15,80,16',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,',
                    'text,F2,100,23,',
                    'text,F3,180,23,',
                    'text,f1_1,10,39,', 'setLineWidth,1', 'rect,10,31,90,16',
                    'text,f1_2,100,39,', 'setLineWidth,1', 'rect,100,31,80,16',
                    'text,f1_3,180,39,', 'setLineWidth,1', 'rect,180,31,90,16',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,10,15,90,16',
                    'setLineWidth,1', 'rect,100,15,80,16',
                    'setLineWidth,1', 'rect,180,15,90,16',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = colors[gridCell.column.index];
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,',
                    'text,F2,100,23,',
                    'text,F3,180,23,',
                    'text,f1_1,10,39,', 'setLineWidth,1', 'rect,10,31,90,16',
                    'text,f1_2,100,39,', 'setLineWidth,1', 'rect,100,31,80,16',
                    'text,f1_3,180,39,', 'setLineWidth,1', 'rect,180,31,90,16',
                    'setDrawColor,#ff0000',
                    'setLineWidth,1', 'rect,10,15,90,16',
                    'setDrawColor,#00ff00',
                    'setLineWidth,1', 'rect,100,15,80,16',
                    'setDrawColor,#0000ff',
                    'setLineWidth,1', 'rect,180,15,90,16',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(pdfCell.text === 'f1_2') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F2,100,23,', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F3,180,23,', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,f1_1,10,39,', 'setLineWidth,1', 'rect,10,31,90,16',
                    'text,f1_2,100,39,',
                    'text,f1_3,180,39,', 'setLineWidth,1', 'rect,180,31,90,16',
                    'text,f2_1,10,55,', 'setLineWidth,1', 'rect,10,47,90,16',
                    'text,f2_2,100,55,', 'setLineWidth,1', 'rect,100,47,80,16',
                    'text,f2_3,180,55,', 'setLineWidth,1', 'rect,180,47,90,16',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,100,31,80,16',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.column.dataField === 'f2') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F2,100,23,',
                    'text,F3,180,23,', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,f1_1,10,39,', 'setLineWidth,1', 'rect,10,31,90,16',
                    'text,f1_2,100,39,',
                    'text,f1_3,180,39,', 'setLineWidth,1', 'rect,180,31,90,16',
                    'text,f2_1,10,55,', 'setLineWidth,1', 'rect,10,47,90,16',
                    'text,f2_2,100,55,',
                    'text,f2_3,180,55,', 'setLineWidth,1', 'rect,180,47,90,16',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,100,15,80,16',
                    'setLineWidth,1', 'rect,100,31,80,16',
                    'setLineWidth,1', 'rect,100,47,80,16',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.column.dataField === 'f2') {
                        pdfCell.borderColor = colors[rowIndex];
                        rowIndex += 1;
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F2,100,23,',
                    'text,F3,180,23,', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,f1_1,10,39,', 'setLineWidth,1', 'rect,10,31,90,16',
                    'text,f1_2,100,39,',
                    'text,f1_3,180,39,', 'setLineWidth,1', 'rect,180,31,90,16',
                    'text,f2_1,10,55,', 'setLineWidth,1', 'rect,10,47,90,16',
                    'text,f2_2,100,55,',
                    'text,f2_3,180,55,', 'setLineWidth,1', 'rect,180,47,90,16',
                    'setDrawColor,#ff0000',
                    'setLineWidth,1', 'rect,100,15,80,16',
                    'setDrawColor,#00ff00',
                    'setLineWidth,1', 'rect,100,31,80,16',
                    'setDrawColor,#0000ff',
                    'setLineWidth,1', 'rect,100,47,80,16',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
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
                    'text,F1,10,23,',
                    'text,F2,100,23,',
                    'text,f1_1,10,39,', 'setLineWidth,1', 'line,10,31,100,31',
                    'text,f1_2,100,39,', 'setLineWidth,1', 'line,100,31,180,31',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,10,15,90,16',
                    'setLineWidth,1', 'rect,100,15,80,16',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    pdfCell.drawLeftBorder = false;
                    pdfCell.drawRightBorder = false;
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,',
                    'text,F2,100,23,',
                    'text,f1_1,10,39,', 'setLineWidth,1', 'line,10,31,100,31', 'line,10,47,100,47',
                    'text,f1_2,100,39,', 'setLineWidth,1', 'line,100,31,180,31', 'line,100,47,180,47',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'line,10,15,100,15', 'line,10,31,100,31',
                    'setLineWidth,1', 'line,100,15,180,15', 'line,100,31,180,31',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    pdfCell.drawTopBorder = false;
                    pdfCell.drawBottomBorder = false;
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,',
                    'text,F2,100,23,',
                    'text,f1_1,10,39,', 'setLineWidth,1', 'line,10,31,10,47', 'line,100,31,100,47',
                    'text,f1_2,100,39,', 'setLineWidth,1', 'line,100,31,100,47', 'line,180,31,180,47',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'line,10,15,10,31', 'line,100,15,100,31',
                    'setLineWidth,1', 'line,100,15,100,31', 'line,180,15,180,31',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F2,100,23,', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,f1_1,10,39,',
                    'text,f1_2,100,39,',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,10,31,90,16',
                    'setLineWidth,1', 'rect,100,31,80,16',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    pdfCell.drawLeftBorder = false;
                    pdfCell.drawRightBorder = false;
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,', 'setLineWidth,1', 'line,10,15,100,15', 'line,10,31,100,31',
                    'text,F2,100,23,', 'setLineWidth,1', 'line,100,15,180,15', 'line,100,31,180,31',
                    'text,f1_1,10,39,',
                    'text,f1_2,100,39,',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'line,10,31,100,31', 'line,10,47,100,47',
                    'setLineWidth,1', 'line,100,31,180,31', 'line,100,47,180,47',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    pdfCell.drawTopBorder = false;
                    pdfCell.drawBottomBorder = false;
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,', 'setLineWidth,1', 'line,10,15,10,31', 'line,100,15,100,31',
                    'text,F2,100,23,', 'setLineWidth,1', 'line,100,15,100,31', 'line,180,15,180,31',
                    'text,f1_1,10,39,',
                    'text,f1_2,100,39,',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'line,10,31,10,47', 'line,100,31,100,47',
                    'setLineWidth,1', 'line,100,31,100,47', 'line,180,31,180,47',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'group') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F1: f1_1,10,39,',
                    'text,f1_2,20,55,', 'setLineWidth,1', 'rect,20,47,80,16',
                    'text,f1_3,100,55,', 'setLineWidth,1', 'rect,100,47,80,16',
                    'text,F1: f2_1,10,71,',
                    'text,f2_2,20,87,', 'setLineWidth,1', 'rect,20,79,80,16',
                    'text,f2_3,100,87,', 'setLineWidth,1', 'rect,100,79,80,16',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,10,31,170,16',
                    'setLineWidth,1', 'rect,10,63,170,16',
                    'setDrawColor,#000000'
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'group' && gridCell.column.dataField === 'f1') {
                        pdfCell.borderColor = '#ff0000';
                    } else if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f2') {
                        pdfCell.borderColor = '#0000ff';
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F1: f1_1,10,39,',
                    'text,f1_2,20,55,',
                    'text,f1_3,100,55,', 'setLineWidth,1', 'rect,100,47,80,16',
                    'text,F1: f2_1,10,71,',
                    'text,f2_2,20,87,',
                    'text,f2_3,100,87,', 'setLineWidth,1', 'rect,100,79,80,16',
                    'setDrawColor,#ff0000',
                    'setLineWidth,1', 'rect,10,31,170,16',
                    'setDrawColor,#0000ff',
                    'setLineWidth,1', 'rect,20,47,80,16',
                    'setDrawColor,#ff0000',
                    'setLineWidth,1', 'rect,10,63,170,16',
                    'setDrawColor,#0000ff',
                    'setLineWidth,1', 'rect,20,79,80,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 1 level - [{f1, groupIndex: 0}, f2, f3] - custom border color in grouped row - the top borders for data row are hidden', function(assert) {
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'group') {
                        pdfCell.borderColor = '#dddd00';
                    }
                    if(gridCell.rowType === 'data') {
                        pdfCell.drawTopBorder = false;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F1: f1_1,10,39,',
                    'text,f1_2,20,55,', 'setLineWidth,1', 'line,20,47,20,63', 'line,100,47,100,63', 'line,20,63,100,63',
                    'text,f1_3,100,55,', 'setLineWidth,1', 'line,100,47,100,63', 'line,180,47,180,63', 'line,100,63,180,63',
                    'text,F1: f2_1,10,71,',
                    'text,f2_2,20,87,', 'setLineWidth,1', 'line,20,79,20,95', 'line,100,79,100,95', 'line,20,95,100,95',
                    'text,f2_3,100,87,', 'setLineWidth,1', 'line,100,79,100,95', 'line,180,79,180,95', 'line,100,95,180,95',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,10,31,170,16',
                    'setLineWidth,1', 'rect,10,63,170,16',
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'group') {
                        pdfCell.borderColor = gridCell.groupIndex === 0 ? '#dddd00' : '#00dddd';
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F4,100,23,', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F1: f1,10,39,',
                    'text,F2: f1_2,20,55,',
                    'text,f1_3,30,71,', 'setLineWidth,1', 'rect,30,63,70,16',
                    'text,f1_4,100,71,', 'setLineWidth,1', 'rect,100,63,80,16',
                    'text,F2: f2_2,20,87,',
                    'text,f2_3,30,103,', 'setLineWidth,1', 'rect,30,95,70,16',
                    'text,f2_4,100,103,', 'setLineWidth,1', 'rect,100,95,80,16',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,10,31,170,16',
                    'setDrawColor,#00dddd',
                    'setLineWidth,1', 'rect,20,47,160,16',
                    'setLineWidth,1', 'rect,20,79,160,16',
                    'setDrawColor,#000000'
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'groupFooter') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,39,', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,55,', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,', 'setLineWidth,1', 'rect,180,47,80,16',
                    'text,Max: f4,180,71,',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,20,63,70,16',
                    'setLineWidth,1', 'rect,90,63,90,16',
                    'setLineWidth,1', 'rect,180,63,80,16',
                    'setDrawColor,#000000'
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'groupFooter') {
                        pdfCell.borderColor = groupFooterCells < 2 ? '#dddd00' : '#00dddd';
                        groupFooterCells += 1;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F4,260,23,', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,39,', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2 (Max of F1 is f1),20,55,', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,f3,30,71,', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,71,', 'setLineWidth,1', 'rect,260,63,100,16',
                    'text,Max: f4,260,87,',
                    'text,Max: f4,260,103,',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,30,79,230,16',
                    'setLineWidth,1', 'rect,260,79,100,16',
                    'setDrawColor,#00dddd',
                    'setLineWidth,1', 'rect,20,95,240,16',
                    'setLineWidth,1', 'rect,260,95,100,16',
                    'setDrawColor,#000000'
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'totalFooter') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F1,10,23,', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F2,90,23,', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,f1,10,39,', 'setLineWidth,1', 'rect,10,31,80,16',
                    'text,f2,90,39,', 'setLineWidth,1', 'rect,90,31,90,16',
                    'text,Max: f1,10,55,',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,10,47,80,16',
                    'setLineWidth,1', 'rect,90,47,90,16',
                    'setDrawColor,#000000'
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
                    pdfCell.textOptions = { baseline: 'alphabetic' };
                    if(gridCell.rowType === 'totalFooter') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,39,', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,f2,20,55,', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,Max: f2,10,71,',
                    'setDrawColor,#dddd00',
                    'setLineWidth,1', 'rect,10,63,80,16',
                    'setLineWidth,1', 'rect,90,63,90,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfBorderColorsTests };
