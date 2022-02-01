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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header' && gridCell.column.index === 1) {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header' && gridCell.column.index === 1) {
                        pdfCell.borderColor = 128;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header' && gridCell.column.index === 1) {
                        pdfCell.borderColor = { ch1: 0, ch2: 255, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,255,0',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header' && gridCell.column.index === 1) {
                        pdfCell.borderColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,1,0',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = 128;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = { ch1: 0, ch2: 255, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,0,255,0',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,255,0',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,255,0',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,1,0',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,1,0',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,1,0',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = colors[gridCell.column.index];
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,#ff0000',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#00ff00',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#0000ff',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = colors[gridCell.column.index];
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,80',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,255',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = colors[gridCell.column.index];
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,255,0,0',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,255,0',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,255',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = colors[gridCell.column.index];
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,1,0,0,0',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,1,0,0',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,1,0',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(pdfCell.text === 'f1_2') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'text,f2_1,55.333,110.417,',
                    'text,f2_2,145.333,110.417,',
                    'text,f2_3,225.333,110.417,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,99.333,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.column.dataField === 'f2') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'text,f2_1,55.333,110.417,',
                    'text,f2_2,145.333,110.417,',
                    'text,f2_3,225.333,110.417,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,140,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,99.333,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.column.dataField === 'f2') {
                        pdfCell.borderColor = colors[rowIndex];
                        rowIndex += 1;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,128',
                    'text,F3,225.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'text,f1_3,225.333,88.25,',
                    'text,f2_1,55.333,110.417,',
                    'text,f2_2,145.333,110.417,',
                    'text,f2_3,225.333,110.417,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#ff0000',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#00ff00',
                    'rect,140,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#0000ff',
                    'rect,140,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,99.333,90,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,77.167,140,77.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,140,77.167,220,77.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    pdfCell.drawLeftBorder = false;
                    pdfCell.drawRightBorder = false;
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'line,50,55,140,55',
                    'line,50,77.167,140,77.167',
                    'setLineWidth,0.6',
                    'line,140,55,220,55',
                    'line,140,77.167,220,77.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,77.167,140,77.167',
                    'line,50,99.333,140,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,140,77.167,220,77.167',
                    'line,140,99.333,220,99.333',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    pdfCell.drawTopBorder = false;
                    pdfCell.drawBottomBorder = false;
                    if(gridCell.rowType === 'header') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'line,50,55,50,77.167',
                    'line,140,55,140,77.167',
                    'setLineWidth,0.6',
                    'line,140,55,140,77.167',
                    'line,220,55,220,77.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,77.167,50,99.333',
                    'line,140,77.167,140,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,140,77.167,140,99.333',
                    'line,220,77.167,220,99.333',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'rect,140,77.167,80,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = 128;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,77.167,80,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = { ch1: 0, ch2: 255, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,255,0',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,255,0',
                    'rect,140,77.167,80,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = { ch1: 0, ch2: 1, ch3: 0, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,1,0,0',
                    'rect,50,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,1,0,0',
                    'rect,140,77.167,80,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    pdfCell.drawLeftBorder = false;
                    pdfCell.drawRightBorder = false;
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,55,140,55',
                    'line,50,77.167,140,77.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,140,55,220,55',
                    'line,140,77.167,220,77.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'line,50,77.167,140,77.167',
                    'line,50,99.333,140,99.333',
                    'setLineWidth,0.6',
                    'line,140,77.167,220,77.167',
                    'line,140,99.333,220,99.333',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    pdfCell.drawTopBorder = false;
                    pdfCell.drawBottomBorder = false;
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,145.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,88.25,',
                    'text,f1_2,145.333,88.25,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,55,50,77.167',
                    'line,140,55,140,77.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,140,55,140,77.167',
                    'line,220,55,220,77.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'line,50,77.167,50,99.333',
                    'line,140,77.167,140,99.333',
                    'setLineWidth,0.6',
                    'line,140,77.167,140,99.333',
                    'line,220,77.167,220,99.333',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'group') {
                        pdfCell.borderColor = (gridCell.column.index === 0) ? '#dddd00' : { ch1: 221, ch2: 221, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,',
                    'setTextColor,128',
                    'text,F3,145.333,66.083,',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1,55.333,88.25,',
                    'setFont,helvetica,normal,',
                    'text,f1_2,55.333,110.417,',
                    'text,f1_3,145.333,110.417,',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1,55.333,132.583,',
                    'setFont,helvetica,normal,',
                    'text,f2_2,55.333,154.75,',
                    'text,f2_3,145.333,154.75,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,121.5,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,143.667,80,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'group' && gridCell.column.dataField === 'f1') {
                        pdfCell.borderColor = 100;
                    } else if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f2') {
                        pdfCell.borderColor = (gridCell.column.index === 0) ? '#0000dd' : { ch1: 0, ch2: 0, ch3: 221 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,',
                    'setTextColor,128',
                    'text,F3,145.333,66.083,',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1,55.333,88.25,',
                    'setFont,helvetica,normal,',
                    'text,f1_2,55.333,110.417,',
                    'text,f1_3,145.333,110.417,',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1,55.333,132.583,',
                    'setFont,helvetica,normal,',
                    'text,f2_2,55.333,154.75,',
                    'text,f2_3,145.333,154.75,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,100',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,221',
                    'rect,50,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,100',
                    'rect,50,121.5,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,221',
                    'rect,50,143.667,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,143.667,80,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'group') {
                        pdfCell.borderColor = '#dddd00';
                    }
                    if(gridCell.rowType === 'data') {
                        pdfCell.borderColor = (gridCell.column.index === 0) ? '#0000dd' : { ch1: 0, ch2: 0, ch3: 221 };
                        pdfCell.drawLeftBorder = gridCell.column.index <= 1;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,',
                    'setTextColor,128',
                    'text,F3,145.333,66.083,',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1,55.333,88.25,',
                    'setFont,helvetica,normal,',
                    'text,f1_2,55.333,110.417,',
                    'text,f1_3,145.333,110.417,',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1,55.333,132.583,',
                    'setFont,helvetica,normal,',
                    'text,f2_2,55.333,154.75,',
                    'text,f2_3,145.333,154.75,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,221',
                    'line,50,99.333,140,99.333',
                    'line,50,99.333,50,121.5',
                    'line,50,121.5,140,121.5',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,221',
                    'line,140,99.333,220,99.333',
                    'line,220,99.333,220,121.5',
                    'line,140,121.5,220,121.5',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,121.5,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,221',
                    'line,50,143.667,140,143.667',
                    'line,50,143.667,50,165.833',
                    'line,50,165.833,140,165.833',
                    'setLineWidth,0.6',
                    'setDrawColor,0,0,221',
                    'line,140,143.667,220,143.667',
                    'line,220,143.667,220,165.833',
                    'line,140,165.833,220,165.833',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'group') {
                        pdfCell.borderColor = gridCell.groupIndex === 0 ? '#dddd00' : '#00dddd';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,',
                    'setTextColor,128',
                    'text,F4,145.333,66.083,',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,',
                    'text,F2: f1_2,55.333,110.417,',
                    'setFont,helvetica,normal,',
                    'text,f1_3,55.333,132.583,',
                    'text,f1_4,145.333,132.583,',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,55.333,154.75,',
                    'setFont,helvetica,normal,',
                    'text,f2_3,55.333,176.917,',
                    'text,f2_4,145.333,176.917,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#00dddd',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#00dddd',
                    'rect,50,143.667,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,165.833,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,140,165.833,80,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'groupFooter') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,',
                    'setTextColor,128',
                    'text,F4,225.333,66.083,',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,',
                    'text,f3,135.333,110.417,',
                    'text,f4,225.333,110.417,',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,225.333,132.583,',
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
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'rect,220,121.5,80,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'groupFooter') {
                        pdfCell.borderColor = groupFooterCells < 2 ? { ch1: 221, ch2: 221, ch3: 0 } : '#00dddd';
                        groupFooterCells += 1;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,',
                    'setTextColor,128',
                    'text,F4,305.333,66.083,',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,',
                    'text,F2: f2 (Max of F1 is f1),55.333,110.417,',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,',
                    'text,f4,305.333,132.583,',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,305.333,154.75,',
                    'text,Max: f4,305.333,176.917,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,350,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,350,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,121.5,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,221,221,0',
                    'rect,50,143.667,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,221,221,0',
                    'rect,300,143.667,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#00dddd',
                    'rect,50,165.833,250,22.167',
                    'setLineWidth,0.6',
                    'rect,300,165.833,100,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'totalFooter') {
                        pdfCell.borderColor = '#dddd00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F2,135.333,66.083,',
                    'setTextColor,#000000',
                    'text,f1,55.333,88.25,',
                    'text,f2,135.333,88.25,',
                    'setFont,helvetica,bold,',
                    'text,Max: f1,55.333,110.417,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,77.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#dddd00',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'rect,130,99.333,90,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(gridCell.rowType === 'totalFooter') {
                        pdfCell.borderColor = { ch1: 221, ch2: 221, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,',
                    'text,f3,135.333,110.417,',
                    'setFont,helvetica,bold,',
                    'text,Max: f2,55.333,132.583,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,221,221,0',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,221,221,0',
                    'rect,130,121.5,90,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band1') {
                        pdfCell.borderColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F1,55.333,88.25,',
                    'setTextColor,128',
                    'text,F2,125.333,88.25,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,110.417,',
                    'text,f2_1,125.333,110.417,',
                    'setLineWidth,0.6',
                    'setDrawColor,#ffff00',
                    'rect,50,55,140,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,99.333,70,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(pdfCell.text === 'Band1') {
                        pdfCell.borderColor = { ch1: 221, ch2: 221, ch3: 0 };
                    }
                    if(pdfCell.text === 'Band1_1') {
                        pdfCell.borderColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,55.333,66.083,',
                    'setTextColor,128',
                    'text,Band1_1,55.333,88.25,',
                    'setTextColor,128',
                    'text,F2,125.333,99.333,',
                    'setTextColor,128',
                    'text,F1,55.333,110.417,',
                    'setTextColor,#000000',
                    'text,f1_1_1,55.333,132.583,',
                    'text,f2_1,125.333,132.583,',
                    'setLineWidth,0.6',
                    'setDrawColor,221,221,0',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,#ffff00',
                    'rect,50,77.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,77.167,80,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,120,121.5,80,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(pdfCell.text === 'Band1') {
                        pdfCell.borderColor = { ch1: 221, ch2: 221, ch3: 0 };
                    }
                    if(pdfCell.text === 'Band1_2') {
                        pdfCell.borderColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F1,55.333,99.333,',
                    'setTextColor,128',
                    'text,Band1_2,115.333,88.25,',
                    'setTextColor,128',
                    'text,F2,115.333,110.417,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,132.583,',
                    'text,f2_1_1,115.333,132.583,',
                    'setLineWidth,0.6',
                    'setDrawColor,221,221,0',
                    'rect,50,55,130,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,60,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,#ffff00',
                    'rect,110,77.167,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,99.333,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,60,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,121.5,70,22.167',
                    'setFontSize,16',
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
                doc.__logOptions.textOptions = false;

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
                    if(pdfCell.text === 'Band1') {
                        pdfCell.borderColor = { ch1: 221, ch2: 221, ch3: 0 };
                    }
                    if(pdfCell.text === 'Band1_2') {
                        pdfCell.borderColor = '#ffff00';
                        pdfCell.drawTopBorder = false;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,55.333,66.083,',
                    'setTextColor,128',
                    'text,F1,55.333,99.333,',
                    'setTextColor,128',
                    'text,Band1_2,115.333,88.25,',
                    'setTextColor,128',
                    'text,F2,115.333,110.417,',
                    'setTextColor,#000000',
                    'text,f1_1,55.333,132.583,',
                    'text,f2_1_1,115.333,132.583,',
                    'setLineWidth,0.6',
                    'setDrawColor,221,221,0',
                    'rect,50,55,130,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,60,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,#ffff00',
                    'line,110,77.167,110,99.333',
                    'line,180,77.167,180,99.333',
                    'line,110,99.333,180,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,99.333,70,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,60,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,121.5,70,22.167',
                    'setFontSize,16',
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
