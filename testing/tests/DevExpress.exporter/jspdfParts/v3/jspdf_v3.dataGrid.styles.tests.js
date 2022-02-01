import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfStylesTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        const customizeCell = ({ pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };

        QUnit.module('Styles - Background color', moduleConfig, () => {
            const rowOptions = {
                headerStyles: { backgroundColor: '#808080' },
                // groupStyles: { backgroundColor: '#d3d3d3' },
                // totalStyles: { backgroundColor: '#ffffe0' }
            };

            QUnit.test('Simple - [{f1, f2] - HEX color', function(assert) {
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

                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,#808080',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - GRAY color', function(assert) {
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

                const expectedLog = [
                    'setFillColor,128',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,128',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                const _rowOptions = {
                    headerStyles: { backgroundColor: 128 },
                };

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions: _rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - RGB color', function(assert) {
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

                const expectedLog = [
                    'setFillColor,128,128,128',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,128,128,128',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                const _rowOptions = {
                    headerStyles: { backgroundColor: { ch1: 128, ch2: 128, ch3: 128 } },
                };

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions: _rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - SMYC color', function(assert) {
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

                const expectedLog = [
                    'setFillColor,0,0,1,0',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,0,0,1,0',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                const _rowOptions = {
                    headerStyles: { backgroundColor: { ch1: 0, ch2: 0, ch3: 1, ch4: 0 } },
                };

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions: _rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom HEX color in Header', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'header' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#ffff00',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,#808080',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom GRAY color in Header', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'header' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = 128;
                    }
                };

                const expectedLog = [
                    'setFillColor,128',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,#808080',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom RGB color in Header', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'header' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = { ch1: 128, ch2: 128, ch3: 128 };
                    }
                };

                const expectedLog = [
                    'setFillColor,128,128,128',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,#808080',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom SMYC color in Header', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'header' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'setFillColor,0,0,1,0',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,#808080',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom HEX color in data row', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,#808080',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setFillColor,#ffff00',
                    'rect,50,77.167,90,22.167,F',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom GRAY color in data row', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = 128;
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,#808080',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setFillColor,128',
                    'rect,50,77.167,90,22.167,F',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom RGB color in data row', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = { ch1: 255, ch2: 255, ch3: 0 };
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,#808080',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setFillColor,255,255,0',
                    'rect,50,77.167,90,22.167,F',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom SMYC color in data row', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,50,55,90,22.167,F',
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setFillColor,#808080',
                    'rect,140,55,80,22.167,F',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setFillColor,0,0,1,0',
                    'rect,50,77.167,90,22.167,F',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            // TODO: Styles with groups/Summaries
        });

        QUnit.module('Styles - Text color', moduleConfig, () => {
            QUnit.test('Simple - [{f1, f2] - Custom HEX color for first table cell', function(assert) {
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

                const _customizeCell = ({ pdfCell }) => {
                    customizeCell({ pdfCell });
                    if(pdfCell.text === 'F1') {
                        pdfCell.textColor = '#0000ff';
                    }
                };

                const expectedLog = [
                    'setTextColor,#0000ff',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom GRAY color for first table cell', function(assert) {
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

                const _customizeCell = ({ pdfCell }) => {
                    customizeCell({ pdfCell });
                    if(pdfCell.text === 'F1') {
                        pdfCell.textColor = '128';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom RGB color for first table cell', function(assert) {
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

                const _customizeCell = ({ pdfCell }) => {
                    customizeCell({ pdfCell });
                    if(pdfCell.text === 'F1') {
                        pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 255 };
                    }
                };

                const expectedLog = [
                    'setTextColor,0,0,255',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom SMYC color for first table cell', function(assert) {
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

                const _customizeCell = ({ pdfCell }) => {
                    customizeCell({ pdfCell });
                    if(pdfCell.text === 'F1') {
                        pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,0,0,1,0',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom HEX color for last table cell', function(assert) {
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

                const _customizeCell = ({ pdfCell }) => {
                    customizeCell({ pdfCell });
                    if(pdfCell.text === 'f1_2') {
                        pdfCell.textColor = '#0000ff';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'setTextColor,#0000ff',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom GRAY color for last table cell', function(assert) {
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

                const _customizeCell = ({ pdfCell }) => {
                    customizeCell({ pdfCell });
                    if(pdfCell.text === 'f1_2') {
                        pdfCell.textColor = 128;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'setTextColor,128',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom RGB color for last table cell', function(assert) {
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

                const _customizeCell = ({ pdfCell }) => {
                    customizeCell({ pdfCell });
                    if(pdfCell.text === 'f1_2') {
                        pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 255 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'setTextColor,0,0,255',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom SMYC color for last table cell', function(assert) {
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

                const _customizeCell = ({ pdfCell }) => {
                    customizeCell({ pdfCell });
                    if(pdfCell.text === 'f1_2') {
                        pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'setTextColor,0,0,1,0',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom colors for first and last table cells', function(assert) {
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

                const _customizeCell = ({ pdfCell }) => {
                    customizeCell({ pdfCell });
                    if(pdfCell.text === 'F1') {
                        pdfCell.textColor = 128;
                    }
                    if(pdfCell.text === 'f1_2') {
                        pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 255 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,128',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'setTextColor,0,0,255',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom colors for header row', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'header') {
                        pdfCell.textColor = gridCell.column.dataField === 'f1' ? 128 : { ch1: 0, ch2: 0, ch3: 255 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,0,0,255',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Different HEX colors in header cells', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.rowType === 'header') {
                        if(gridCell.column.dataField === 'f1') {
                            pdfCell.textColor = '#ff0000';
                        } else if(gridCell.column.dataField === 'f2') {
                            pdfCell.textColor = '#0000ff';
                        }

                    }
                };

                const expectedLog = [
                    'setTextColor,#ff0000',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,#0000ff',
                    'text,F2,146.667,66.083,',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,88.25,',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [{f1, f2] - Custom colors for data rows', function(assert) {
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

                const _customizeCell = ({ gridCell, pdfCell }) => {
                    customizeCell({ gridCell, pdfCell });
                    if(gridCell.column.dataField === 'f1') {
                        pdfCell.textColor = 128;
                    } else if(gridCell.column.dataField === 'f2') {
                        pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 255 };
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,66.083,',
                    'setTextColor,0,0,255',
                    'text,F2,146.667,66.083,',
                    'setTextColor,128',
                    'text,f1_1,56.667,88.25,',
                    'setTextColor,0,0,255',
                    'text,f1_2,146.667,88.25,',
                    'setFontSize,16',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            // TODO: Styles with groups/Summaries
        });

        QUnit.module('Styles - Font', moduleConfig, () => {
            QUnit.test('1 col - 1 text line. customizeCell.set fontSize=20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'line' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line,56.667,71.833,{baseline:middle}',
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

            QUnit.test('1 col - 1 text line. onRowExporting.set fontSize=20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'line' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line,56.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
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

            QUnit.test('1 col - 1 text line. customizeCell.setFontSize=10, onRowExporting.set fontSize=20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'line' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,line,56.667,71.833,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,33.667',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 10 }; };
                const onRowExporting = (e) => { e.rowCells[0].font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfStylesTests };
