import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfBandsTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Bands', moduleConfig, () => {
            QUnit.test('[band1-[f1]]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [ 'f1', ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1' }],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'Band1') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'f1_1') {
                        e.rowHeight = 24;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,81,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,103,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,100,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,100,24',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [ 'f1', ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1]] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [ 'f1', ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band1') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,55,65.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,87.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,109.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,76.5,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'Band1') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'f1_1') {
                        e.rowHeight = 24;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,81,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,81,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,103,{baseline:middle}',
                    'text,f2_1,126.667,103,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,140,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,70,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,71,70,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,91,70,24',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,110.417,{baseline:middle}',
                    'text,f2_1,126.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band1') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,55,65.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,87.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,87.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,109.75,{baseline:middle}',
                    'text,f2_1,126.667,109.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,140,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,76.5,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,76.5,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,98.667,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2], f3]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] },
                        'f3'
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'Band1') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'f1_1') {
                        e.rowHeight = 24;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,196.667,73,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,81,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,81,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,103,{baseline:middle}',
                    'text,f2_1,126.667,103,{baseline:middle}',
                    'text,f3_1,196.667,103,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,140,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,190,55,60,36',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,70,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,71,70,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,190,91,60,24',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 60 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2], f3] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] },
                        'f3'
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,196.667,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,110.417,{baseline:middle}',
                    'text,f2_1,126.667,110.417,{baseline:middle}',
                    'text,f3_1,196.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,190,55,60,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,190,99.333,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 60 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2], f3] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] },
                        'f3'
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band1') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,55,65.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,196.667,76.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,87.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,87.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,109.75,{baseline:middle}',
                    'text,f2_1,126.667,109.75,{baseline:middle}',
                    'text,f3_1,196.667,109.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,140,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,190,55,60,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,76.5,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,76.5,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,190,98.667,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 60 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1], f2]]', function(assert) {
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

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'Band1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'Band1_1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f1_1_1') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1,56.667,81,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,93,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,103,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,56.667,130,{baseline:middle}',
                    'text,f2_1,126.667,130,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,70,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,71,80,44',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,115,70,30',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,115,80,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1], f2]] - height auto', function(assert) {
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

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1,56.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,99.333,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,110.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,56.667,132.583,{baseline:middle}',
                    'text,f2_1,126.667,132.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,121.5,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1], f2]] - height auto, padding', function(assert) {
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
                    if(pdfCell.text === 'Band1_1') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1,55,87.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,99,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,109.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,56.667,131.917,{baseline:middle}',
                    'text,f2_1,126.667,131.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,70,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,120.833,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,120.833,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                { caption: 'Band1_1', columns: [ 'f1', 'f2' ] },
                                'f3',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1' }],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'Band1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'Band1_1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f1_1_1') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1,56.667,81,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,186.667,93,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,103,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,103,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,56.667,130,{baseline:middle}',
                    'text,f2_1_1,116.667,130,{baseline:middle}',
                    'text,f3_1,186.667,130,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,210,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,130,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,71,80,44',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,60,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,115,60,30',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,115,70,30',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,115,80,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                { caption: 'Band1_1', columns: [ 'f1', 'f2' ] },
                                'f3',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1,56.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,186.667,99.333,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,110.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,56.667,132.583,{baseline:middle}',
                    'text,f2_1_1,116.667,132.583,{baseline:middle}',
                    'text,f3_1,186.667,132.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,130,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,77.167,80,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,121.5,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,121.5,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                { caption: 'Band1_1', columns: [ 'f1', 'f2' ] },
                                'f3',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band1_1') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1,55,87.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,186.667,99,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,109.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,109.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,56.667,131.917,{baseline:middle}',
                    'text,f2_1_1,116.667,131.917,{baseline:middle}',
                    'text,f3_1,186.667,131.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,130,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,77.167,80,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,120.833,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,120.833,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,120.833,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2]]]', function(assert) {
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

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'Band1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f1_1') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,93,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,116.667,81,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,103,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,130,{baseline:middle}',
                    'text,f2_1_1,116.667,130,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,130,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,60,44',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,71,70,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,115,60,30',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,115,70,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2]]] - height auto', function(assert) {
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

                const onRowExporting = () => { };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,99.333,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,116.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,110.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,132.583,{baseline:middle}',
                    'text,f2_1_1,116.667,132.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,130,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,60,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,77.167,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,121.5,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2]]] - height auto, padding', function(assert) {
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
                    if(pdfCell.text === 'Band1_2') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,99,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,115,87.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,109.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,131.917,{baseline:middle}',
                    'text,f2_1_1,116.667,131.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,130,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,60,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,77.167,70,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,120.833,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,120.833,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2, f3]]]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                'f1',
                                { caption: 'Band1_2', columns: [ 'f2', 'f3' ] }
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1_2', f3: 'f3_1_2' }],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'Band1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f1_1') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,93,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,116.667,81,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,103,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,186.667,103,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,130,{baseline:middle}',
                    'text,f2_1_2,116.667,130,{baseline:middle}',
                    'text,f3_1_2,186.667,130,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,210,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,60,44',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,71,150,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,91,80,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,115,60,30',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,115,70,30',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,115,80,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2, f3]]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                'f1',
                                { caption: 'Band1_2', columns: [ 'f2', 'f3' ] }
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1_2', f3: 'f3_1_2' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,99.333,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,116.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,186.667,110.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,132.583,{baseline:middle}',
                    'text,f2_1_2,116.667,132.583,{baseline:middle}',
                    'text,f3_1_2,186.667,132.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,60,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,77.167,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,121.5,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,121.5,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2, f3]]] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                'f1',
                                { caption: 'Band1_2', columns: [ 'f2', 'f3' ] }
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1_2', f3: 'f3_1_2' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band1_2') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,56.667,99,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,115,87.917,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,116.667,109.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,186.667,109.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,131.917,{baseline:middle}',
                    'text,f2_1_2,116.667,131.917,{baseline:middle}',
                    'text,f3_1_2,186.667,131.917,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,210,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,60,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,77.167,150,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,98.667,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,120.833,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,110,120.833,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,180,120.833,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2]]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2' ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_1') {
                        e.rowHeight = 24;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,73,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,126.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,81,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,103,{baseline:middle}',
                    'text,f2_1,126.667,103,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,36',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,71,80,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,91,80,24',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2' ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,110.417,{baseline:middle}',
                    'text,f2_1,126.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2]] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2' ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band2') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,76.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,125,65.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,87.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,109.75,{baseline:middle}',
                    'text,f2_1,126.667,109.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,80,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,76.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,98.667,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3]]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2', 'f3' ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_1') {
                        e.rowHeight = 24;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,73,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,126.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,81,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,81,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,103,{baseline:middle}',
                    'text,f2_1,126.667,103,{baseline:middle}',
                    'text,f3_1,206.667,103,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,36',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,71,80,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,71,60,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,91,80,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,91,60,24',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3]] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2', 'f3' ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,110.417,{baseline:middle}',
                    'text,f2_1,126.667,110.417,{baseline:middle}',
                    'text,f3_1,206.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,77.167,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3]] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2', 'f3' ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band2') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,76.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,125,65.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,87.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,87.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,109.75,{baseline:middle}',
                    'text,f2_1,126.667,109.75,{baseline:middle}',
                    'text,f3_1,206.667,109.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,76.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,76.5,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,98.667,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,98.667,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2], f3]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2' ] },
                        'f3'
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_1') {
                        e.rowHeight = 24;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,73,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,126.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,73,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,81,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,103,{baseline:middle}',
                    'text,f2_1,126.667,103,{baseline:middle}',
                    'text,f3_1,206.667,103,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,36',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,60,36',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,71,80,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,91,80,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,91,60,24',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2], f3] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2' ] },
                        'f3'
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,110.417,{baseline:middle}',
                    'text,f2_1,126.667,110.417,{baseline:middle}',
                    'text,f3_1,206.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,60,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2], f3] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2' ] },
                        'f3'
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band2') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,76.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,125,65.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,76.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,87.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,109.75,{baseline:middle}',
                    'text,f2_1,126.667,109.75,{baseline:middle}',
                    'text,f3_1,206.667,109.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,80,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,60,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,76.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,98.667,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,98.667,60,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2', 'f3' ] },
                        'f4'
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' }],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_1') {
                        e.rowHeight = 24;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,73,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,126.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,266.667,73,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,81,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,81,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,103,{baseline:middle}',
                    'text,f2_1,126.667,103,{baseline:middle}',
                    'text,f3_1,206.667,103,{baseline:middle}',
                    'text,f4_1,266.667,103,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,36',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,55,70,36',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,71,80,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,71,60,20',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,91,70,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,91,80,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,91,60,24',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,91,70,24',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2', 'f3' ] },
                        'f4'
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,126.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,266.667,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,110.417,{baseline:middle}',
                    'text,f2_1,126.667,110.417,{baseline:middle}',
                    'text,f3_1,206.667,110.417,{baseline:middle}',
                    'text,f4_1,266.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,55,70,44.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,77.167,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,77.167,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,99.333,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4] - height auto, padding', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band2', columns: [ 'f2', 'f3' ] },
                        'f4'
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band2') {
                        pdfCell.padding = 5;
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,76.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,125,65.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,266.667,76.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,126.667,87.583,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,87.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,56.667,109.75,{baseline:middle}',
                    'text,f2_1,126.667,109.75,{baseline:middle}',
                    'text,f3_1,206.667,109.75,{baseline:middle}',
                    'text,f4_1,266.667,109.75,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,70,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,55,140,21.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,55,70,43.667',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,76.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,76.5,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,98.667,70,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,120,98.667,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,98.667,60,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,260,98.667,70,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfBandsTests };
