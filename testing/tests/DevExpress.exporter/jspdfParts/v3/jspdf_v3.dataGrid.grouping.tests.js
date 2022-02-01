import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfGroupingTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        QUnit.module('Grouping', moduleConfig, () => {
            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_2') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_2') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,146.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,81,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2,56.667,103,{baseline:middle}',
                    'text,f1_3,146.667,103,{baseline:middle}',
                    'text,f2_2,56.667,130,{baseline:middle}',
                    'text,f2_3,146.667,130,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,90,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,91,80,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,115,90,30',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,115,80,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2,56.667,110.417,{baseline:middle}',
                    'text,f1_3,146.667,110.417,{baseline:middle}',
                    'text,f2_2,56.667,132.583,{baseline:middle}',
                    'text,f2_3,146.667,132.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,121.5,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55,87.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2,56.667,109.75,{baseline:middle}',
                    'text,f1_3,146.667,109.75,{baseline:middle}',
                    'text,f2_2,56.667,131.917,{baseline:middle}',
                    'text,f2_3,146.667,131.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,98.667,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,120.833,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,120.833,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3]', function(assert) {
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

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1_1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F1: f2_1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_2') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_2') {
                        e.rowHeight = 24;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,146.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1,56.667,81,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2,56.667,103,{baseline:middle}',
                    'text,f1_3,146.667,103,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1,56.667,125,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2,56.667,147,{baseline:middle}',
                    'text,f2_3,146.667,147,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,90,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,91,80,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,115,170,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,135,90,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,135,80,24',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3] - height auto', function(assert) {
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

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2,56.667,110.417,{baseline:middle}',
                    'text,f1_3,146.667,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1,56.667,132.583,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2,56.667,154.75,{baseline:middle}',
                    'text,f2_3,146.667,154.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,143.667,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,143.667,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3] - height auto, padding', function(assert) {
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
                    if(gridCell.rowType === 'group') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1,55,87.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2,56.667,109.75,{baseline:middle}',
                    'text,f1_3,146.667,109.75,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1,55,131.583,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2,56.667,153.417,{baseline:middle}',
                    'text,f2_3,146.667,153.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,98.667,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,120.833,170,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,142.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,142.333,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4]', function(assert) {
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
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4' },
                    ],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F3') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_3') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_3') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,146.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,81,{baseline:middle}',
                    'text,F2: f2,56.667,101,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3,56.667,123,{baseline:middle}',
                    'text,f1_4,146.667,123,{baseline:middle}',
                    'text,f2_3,56.667,150,{baseline:middle}',
                    'text,f2_4,146.667,150,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,170,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,111,90,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,111,80,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,135,90,30',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,135,80,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto', function(assert) {
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
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4' },
                    ],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'text,F2: f2,56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3,56.667,132.583,{baseline:middle}',
                    'text,f1_4,146.667,132.583,{baseline:middle}',
                    'text,f2_3,56.667,154.75,{baseline:middle}',
                    'text,f2_4,146.667,154.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,121.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,143.667,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,143.667,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto, padding', function(assert) {
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
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4' },
                    ],
                });

                const customizeCell = ({ gridCell, pdfCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55,87.917,{baseline:middle}',
                    'text,F2: f2,55,109.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3,56.667,131.25,{baseline:middle}',
                    'text,f1_4,146.667,131.25,{baseline:middle}',
                    'text,f2_3,56.667,153.417,{baseline:middle}',
                    'text,f2_4,146.667,153.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,170,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,120.167,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,120.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,142.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,142.333,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4]', function(assert) {
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

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F3') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f1_2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2_2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_3') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_3') {
                        e.rowHeight = 24;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,146.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,81,{baseline:middle}',
                    'text,F2: f1_2,56.667,101,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3,56.667,123,{baseline:middle}',
                    'text,f1_4,146.667,123,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,56.667,145,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_3,56.667,167,{baseline:middle}',
                    'text,f2_4,146.667,167,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,170,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,111,90,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,111,80,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,135,170,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,155,90,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,155,80,24',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto', function(assert) {
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

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'text,F2: f1_2,56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3,56.667,132.583,{baseline:middle}',
                    'text,f1_4,146.667,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,56.667,154.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_3,56.667,176.917,{baseline:middle}',
                    'text,f2_4,146.667,176.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,121.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,143.667,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,165.833,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,165.833,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto, padding', function(assert) {
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
                    if(gridCell.rowType === 'group') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,146.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55,87.917,{baseline:middle}',
                    'text,F2: f1_2,55,109.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3,56.667,131.25,{baseline:middle}',
                    'text,f1_4,146.667,131.25,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,55,153.083,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_3,56.667,174.917,{baseline:middle}',
                    'text,f2_4,146.667,174.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,170,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,120.167,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,120.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,142.333,170,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,163.833,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,140,163.833,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

    }
};

export { JSPdfGroupingTests };
