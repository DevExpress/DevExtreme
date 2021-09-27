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
                    'text,Band1,10,23,{baseline:middle}',
                    'text,F1,10,41,{baseline:middle}',
                    'text,f1_1,10,63,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,100,16',
                    'setLineWidth,1', 'rect,10,31,100,20',
                    'setLineWidth,1', 'rect,10,51,100,24',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,F1,10,42.6,{baseline:middle}',
                    'text,f1_1,10,61,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,100,18.4',
                    'setLineWidth,1', 'rect,10,33.4,100,18.4',
                    'setLineWidth,1', 'rect,10,51.8,100,18.4',
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
                    'text,Band1,15,29.2,{baseline:middle}',
                    'text,F1,10,52.6,{baseline:middle}',
                    'text,f1_1,10,71,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,100,18.4',
                    'setLineWidth,1',
                    'rect,10,61.8,100,18.4'
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
                    'text,Band1,10,23,{baseline:middle}',
                    'text,F1,10,41,{baseline:middle}',
                    'text,F2,80,41,{baseline:middle}',
                    'text,f1_1,10,63,{baseline:middle}',
                    'text,f2_1,80,63,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,140,16',
                    'setLineWidth,1', 'rect,10,31,70,20',
                    'setLineWidth,1', 'rect,80,31,70,20',
                    'setLineWidth,1', 'rect,10,51,70,24',
                    'setLineWidth,1', 'rect,80,51,70,24',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,F1,10,42.6,{baseline:middle}',
                    'text,F2,80,42.6,{baseline:middle}',
                    'text,f1_1,10,61,{baseline:middle}',
                    'text,f2_1,80,61,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,140,18.4',
                    'setLineWidth,1', 'rect,10,33.4,70,18.4',
                    'setLineWidth,1', 'rect,80,33.4,70,18.4',
                    'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'setLineWidth,1', 'rect,80,51.8,70,18.4',
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
                    'text,Band1,10,23,{baseline:middle}',
                    'text,F3,150,33,{baseline:middle}',
                    'text,F1,10,41,{baseline:middle}',
                    'text,F2,80,41,{baseline:middle}',
                    'text,f1_1,10,63,{baseline:middle}',
                    'text,f2_1,80,63,{baseline:middle}',
                    'text,f3_1,150,63,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,140,16',
                    'setLineWidth,1', 'rect,150,15,60,36',
                    'setLineWidth,1', 'rect,10,31,70,20',
                    'setLineWidth,1', 'rect,80,31,70,20',
                    'setLineWidth,1', 'rect,10,51,70,24',
                    'setLineWidth,1', 'rect,80,51,70,24',
                    'setLineWidth,1', 'rect,150,51,60,24',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,F3,150,33.4,{baseline:middle}',
                    'text,F1,10,42.6,{baseline:middle}',
                    'text,F2,80,42.6,{baseline:middle}',
                    'text,f1_1,10,61,{baseline:middle}',
                    'text,f2_1,80,61,{baseline:middle}',
                    'text,f3_1,150,61,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,140,18.4',
                    'setLineWidth,1', 'rect,150,15,60,36.8',
                    'setLineWidth,1', 'rect,10,33.4,70,18.4',
                    'setLineWidth,1', 'rect,80,33.4,70,18.4',
                    'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'setLineWidth,1', 'rect,80,51.8,70,18.4',
                    'setLineWidth,1', 'rect,150,51.8,60,18.4',
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
                    'text,Band1,15,29.2,{baseline:middle}',
                    'text,F3,150,38.4,{baseline:middle}',
                    'text,F1,10,52.6,{baseline:middle}',
                    'text,F2,80,52.6,{baseline:middle}',
                    'text,f1_1,10,71,{baseline:middle}',
                    'text,f2_1,80,71,{baseline:middle}',
                    'text,f3_1,150,71,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,140,28.4',
                    'setLineWidth,1',
                    'rect,150,15,60,46.8',
                    'setLineWidth,1',
                    'rect,10,43.4,70,18.4',
                    'setLineWidth,1',
                    'rect,80,43.4,70,18.4',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,150,61.8,60,18.4'
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
                    'text,Band1,10,23,{baseline:middle}',
                    'text,Band1_1,10,41,{baseline:middle}',
                    'text,F2,80,53,{baseline:middle}',
                    'text,F1,10,63,{baseline:middle}',
                    'text,f1_1_1,10,90,{baseline:middle}',
                    'text,f2_1,80,90,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,150,16',
                    'setLineWidth,1', 'rect,10,31,70,20',
                    'setLineWidth,1', 'rect,80,31,80,44',
                    'setLineWidth,1', 'rect,10,51,70,24',
                    'setLineWidth,1', 'rect,10,75,70,30',
                    'setLineWidth,1', 'rect,80,75,80,30',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,Band1_1,10,42.6,{baseline:middle}',
                    'text,F2,80,51.8,{baseline:middle}',
                    'text,F1,10,61,{baseline:middle}',
                    'text,f1_1_1,10,79.4,{baseline:middle}',
                    'text,f2_1,80,79.4,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,150,18.4',
                    'setLineWidth,1', 'rect,10,33.4,70,18.4',
                    'setLineWidth,1', 'rect,80,33.4,80,36.8',
                    'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'setLineWidth,1', 'rect,10,70.2,70,18.4',
                    'setLineWidth,1', 'rect,80,70.2,80,18.4',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,Band1_1,15,47.6,{baseline:middle}',
                    'text,F2,80,56.8,{baseline:middle}',
                    'text,F1,10,71,{baseline:middle}',
                    'text,f1_1_1,10,89.4,{baseline:middle}',
                    'text,f2_1,80,89.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,150,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,70,28.4',
                    'setLineWidth,1',
                    'rect,80,33.4,80,46.8',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,10,80.2,70,18.4',
                    'setLineWidth,1',
                    'rect,80,80.2,80,18.4'
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
                    'text,Band1,10,23,{baseline:middle}',
                    'text,Band1_1,10,41,{baseline:middle}',
                    'text,F3,140,53,{baseline:middle}',
                    'text,F1,10,63,{baseline:middle}',
                    'text,F2,70,63,{baseline:middle}',
                    'text,f1_1_1,10,90,{baseline:middle}',
                    'text,f2_1_1,70,90,{baseline:middle}',
                    'text,f3_1,140,90,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,210,16',
                    'setLineWidth,1', 'rect,10,31,130,20',
                    'setLineWidth,1', 'rect,140,31,80,44',
                    'setLineWidth,1', 'rect,10,51,60,24',
                    'setLineWidth,1', 'rect,70,51,70,24',
                    'setLineWidth,1', 'rect,10,75,60,30',
                    'setLineWidth,1', 'rect,70,75,70,30',
                    'setLineWidth,1', 'rect,140,75,80,30',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,Band1_1,10,42.6,{baseline:middle}',
                    'text,F3,140,51.8,{baseline:middle}',
                    'text,F1,10,61,{baseline:middle}',
                    'text,F2,70,61,{baseline:middle}',
                    'text,f1_1_1,10,79.4,{baseline:middle}',
                    'text,f2_1_1,70,79.4,{baseline:middle}',
                    'text,f3_1,140,79.4,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,210,18.4',
                    'setLineWidth,1', 'rect,10,33.4,130,18.4',
                    'setLineWidth,1', 'rect,140,33.4,80,36.8',
                    'setLineWidth,1', 'rect,10,51.8,60,18.4',
                    'setLineWidth,1', 'rect,70,51.8,70,18.4',
                    'setLineWidth,1', 'rect,10,70.2,60,18.4',
                    'setLineWidth,1', 'rect,70,70.2,70,18.4',
                    'setLineWidth,1', 'rect,140,70.2,80,18.4',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,Band1_1,15,47.6,{baseline:middle}',
                    'text,F3,140,56.8,{baseline:middle}',
                    'text,F1,10,71,{baseline:middle}',
                    'text,F2,70,71,{baseline:middle}',
                    'text,f1_1_1,10,89.4,{baseline:middle}',
                    'text,f2_1_1,70,89.4,{baseline:middle}',
                    'text,f3_1,140,89.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,210,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,130,28.4',
                    'setLineWidth,1',
                    'rect,140,33.4,80,46.8',
                    'setLineWidth,1',
                    'rect,10,61.8,60,18.4',
                    'setLineWidth,1',
                    'rect,70,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,10,80.2,60,18.4',
                    'setLineWidth,1',
                    'rect,70,80.2,70,18.4',
                    'setLineWidth,1',
                    'rect,140,80.2,80,18.4'
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
                    'text,Band1,10,23,{baseline:middle}',
                    'text,F1,10,53,{baseline:middle}',
                    'text,Band1_2,70,41,{baseline:middle}',
                    'text,F2,70,63,{baseline:middle}',
                    'text,f1_1,10,90,{baseline:middle}',
                    'text,f2_1_1,70,90,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,130,16',
                    'setLineWidth,1', 'rect,10,31,60,44',
                    'setLineWidth,1', 'rect,70,31,70,20',
                    'setLineWidth,1', 'rect,70,51,70,24',
                    'setLineWidth,1', 'rect,10,75,60,30',
                    'setLineWidth,1', 'rect,70,75,70,30',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,F1,10,51.8,{baseline:middle}',
                    'text,Band1_2,70,42.6,{baseline:middle}',
                    'text,F2,70,61,{baseline:middle}',
                    'text,f1_1,10,79.4,{baseline:middle}',
                    'text,f2_1_1,70,79.4,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,130,18.4',
                    'setLineWidth,1', 'rect,10,33.4,60,36.8',
                    'setLineWidth,1', 'rect,70,33.4,70,18.4',
                    'setLineWidth,1', 'rect,70,51.8,70,18.4',
                    'setLineWidth,1', 'rect,10,70.2,60,18.4',
                    'setLineWidth,1', 'rect,70,70.2,70,18.4',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,F1,10,56.8,{baseline:middle}',
                    'text,Band1_2,75,47.6,{baseline:middle}',
                    'text,F2,70,71,{baseline:middle}',
                    'text,f1_1,10,89.4,{baseline:middle}',
                    'text,f2_1_1,70,89.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,130,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,60,46.8',
                    'setLineWidth,1',
                    'rect,70,33.4,70,28.4',
                    'setLineWidth,1',
                    'rect,70,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,10,80.2,60,18.4',
                    'setLineWidth,1',
                    'rect,70,80.2,70,18.4'
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
                    'text,Band1,10,23,{baseline:middle}',
                    'text,F1,10,53,{baseline:middle}',
                    'text,Band1_2,70,41,{baseline:middle}',
                    'text,F2,70,63,{baseline:middle}',
                    'text,F3,140,63,{baseline:middle}',
                    'text,f1_1,10,90,{baseline:middle}',
                    'text,f2_1_2,70,90,{baseline:middle}',
                    'text,f3_1_2,140,90,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,210,16',
                    'setLineWidth,1', 'rect,10,31,60,44',
                    'setLineWidth,1', 'rect,70,31,150,20',
                    'setLineWidth,1', 'rect,70,51,70,24',
                    'setLineWidth,1', 'rect,140,51,80,24',
                    'setLineWidth,1', 'rect,10,75,60,30',
                    'setLineWidth,1', 'rect,70,75,70,30',
                    'setLineWidth,1', 'rect,140,75,80,30',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,F1,10,51.8,{baseline:middle}',
                    'text,Band1_2,70,42.6,{baseline:middle}',
                    'text,F2,70,61,{baseline:middle}',
                    'text,F3,140,61,{baseline:middle}',
                    'text,f1_1,10,79.4,{baseline:middle}',
                    'text,f2_1_2,70,79.4,{baseline:middle}',
                    'text,f3_1_2,140,79.4,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,210,18.4',
                    'setLineWidth,1', 'rect,10,33.4,60,36.8',
                    'setLineWidth,1', 'rect,70,33.4,150,18.4',
                    'setLineWidth,1', 'rect,70,51.8,70,18.4',
                    'setLineWidth,1', 'rect,140,51.8,80,18.4',
                    'setLineWidth,1', 'rect,10,70.2,60,18.4',
                    'setLineWidth,1', 'rect,70,70.2,70,18.4',
                    'setLineWidth,1', 'rect,140,70.2,80,18.4',
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
                    'text,Band1,10,24.2,{baseline:middle}',
                    'text,F1,10,56.8,{baseline:middle}',
                    'text,Band1_2,75,47.6,{baseline:middle}',
                    'text,F2,70,71,{baseline:middle}',
                    'text,F3,140,71,{baseline:middle}',
                    'text,f1_1,10,89.4,{baseline:middle}',
                    'text,f2_1_2,70,89.4,{baseline:middle}',
                    'text,f3_1_2,140,89.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,210,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,60,46.8',
                    'setLineWidth,1',
                    'rect,70,33.4,150,28.4',
                    'setLineWidth,1',
                    'rect,70,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,140,61.8,80,18.4',
                    'setLineWidth,1',
                    'rect,10,80.2,60,18.4',
                    'setLineWidth,1',
                    'rect,70,80.2,70,18.4',
                    'setLineWidth,1',
                    'rect,140,80.2,80,18.4'
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
                    'text,F1,10,33,{baseline:middle}',
                    'text,Band2,80,23,{baseline:middle}',
                    'text,F2,80,41,{baseline:middle}',
                    'text,f1_1,10,63,{baseline:middle}',
                    'text,f2_1,80,63,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,70,36',
                    'setLineWidth,1', 'rect,80,15,80,16',
                    'setLineWidth,1', 'rect,80,31,80,20',
                    'setLineWidth,1', 'rect,10,51,70,24',
                    'setLineWidth,1', 'rect,80,51,80,24',
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
                    'text,F1,10,33.4,{baseline:middle}',
                    'text,Band2,80,24.2,{baseline:middle}',
                    'text,F2,80,42.6,{baseline:middle}',
                    'text,f1_1,10,61,{baseline:middle}',
                    'text,f2_1,80,61,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,70,36.8',
                    'setLineWidth,1', 'rect,80,15,80,18.4',
                    'setLineWidth,1', 'rect,80,33.4,80,18.4',
                    'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'setLineWidth,1', 'rect,80,51.8,80,18.4',
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
                    'text,F1,10,38.4,{baseline:middle}',
                    'text,Band2,85,29.2,{baseline:middle}',
                    'text,F2,80,52.6,{baseline:middle}',
                    'text,f1_1,10,71,{baseline:middle}',
                    'text,f2_1,80,71,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,46.8',
                    'setLineWidth,1',
                    'rect,80,15,80,28.4',
                    'setLineWidth,1',
                    'rect,80,43.4,80,18.4',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,61.8,80,18.4'
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
                    'text,F1,10,33,{baseline:middle}',
                    'text,Band2,80,23,{baseline:middle}',
                    'text,F2,80,41,{baseline:middle}',
                    'text,F3,160,41,{baseline:middle}',
                    'text,f1_1,10,63,{baseline:middle}',
                    'text,f2_1,80,63,{baseline:middle}',
                    'text,f3_1,160,63,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,70,36',
                    'setLineWidth,1', 'rect,80,15,140,16',
                    'setLineWidth,1', 'rect,80,31,80,20',
                    'setLineWidth,1', 'rect,160,31,60,20',
                    'setLineWidth,1', 'rect,10,51,70,24',
                    'setLineWidth,1', 'rect,80,51,80,24',
                    'setLineWidth,1', 'rect,160,51,60,24',
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
                    'text,F1,10,33.4,{baseline:middle}',
                    'text,Band2,80,24.2,{baseline:middle}',
                    'text,F2,80,42.6,{baseline:middle}',
                    'text,F3,160,42.6,{baseline:middle}',
                    'text,f1_1,10,61,{baseline:middle}',
                    'text,f2_1,80,61,{baseline:middle}',
                    'text,f3_1,160,61,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,70,36.8',
                    'setLineWidth,1', 'rect,80,15,140,18.4',
                    'setLineWidth,1', 'rect,80,33.4,80,18.4',
                    'setLineWidth,1', 'rect,160,33.4,60,18.4',
                    'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'setLineWidth,1', 'rect,80,51.8,80,18.4',
                    'setLineWidth,1', 'rect,160,51.8,60,18.4',
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
                    'text,F1,10,38.4,{baseline:middle}',
                    'text,Band2,85,29.2,{baseline:middle}',
                    'text,F2,80,52.6,{baseline:middle}',
                    'text,F3,160,52.6,{baseline:middle}',
                    'text,f1_1,10,71,{baseline:middle}',
                    'text,f2_1,80,71,{baseline:middle}',
                    'text,f3_1,160,71,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,46.8',
                    'setLineWidth,1',
                    'rect,80,15,140,28.4',
                    'setLineWidth,1',
                    'rect,80,43.4,80,18.4',
                    'setLineWidth,1',
                    'rect,160,43.4,60,18.4',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,61.8,80,18.4',
                    'setLineWidth,1',
                    'rect,160,61.8,60,18.4'
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
                    'text,F1,10,33,{baseline:middle}',
                    'text,Band2,80,23,{baseline:middle}',
                    'text,F3,160,33,{baseline:middle}',
                    'text,F2,80,41,{baseline:middle}',
                    'text,f1_1,10,63,{baseline:middle}',
                    'text,f2_1,80,63,{baseline:middle}',
                    'text,f3_1,160,63,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,70,36',
                    'setLineWidth,1', 'rect,80,15,80,16',
                    'setLineWidth,1', 'rect,160,15,60,36',
                    'setLineWidth,1', 'rect,80,31,80,20',
                    'setLineWidth,1', 'rect,10,51,70,24',
                    'setLineWidth,1', 'rect,80,51,80,24',
                    'setLineWidth,1', 'rect,160,51,60,24',
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
                    'text,F1,10,33.4,{baseline:middle}',
                    'text,Band2,80,24.2,{baseline:middle}',
                    'text,F3,160,33.4,{baseline:middle}',
                    'text,F2,80,42.6,{baseline:middle}',
                    'text,f1_1,10,61,{baseline:middle}',
                    'text,f2_1,80,61,{baseline:middle}',
                    'text,f3_1,160,61,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,70,36.8',
                    'setLineWidth,1', 'rect,80,15,80,18.4',
                    'setLineWidth,1', 'rect,160,15,60,36.8',
                    'setLineWidth,1', 'rect,80,33.4,80,18.4',
                    'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'setLineWidth,1', 'rect,80,51.8,80,18.4',
                    'setLineWidth,1', 'rect,160,51.8,60,18.4',
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
                    'text,F1,10,38.4,{baseline:middle}',
                    'text,Band2,85,29.2,{baseline:middle}',
                    'text,F3,160,38.4,{baseline:middle}',
                    'text,F2,80,52.6,{baseline:middle}',
                    'text,f1_1,10,71,{baseline:middle}',
                    'text,f2_1,80,71,{baseline:middle}',
                    'text,f3_1,160,71,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,46.8',
                    'setLineWidth,1',
                    'rect,80,15,80,28.4',
                    'setLineWidth,1',
                    'rect,160,15,60,46.8',
                    'setLineWidth,1',
                    'rect,80,43.4,80,18.4',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,61.8,80,18.4',
                    'setLineWidth,1',
                    'rect,160,61.8,60,18.4'
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
                    'text,F1,10,33,{baseline:middle}',
                    'text,Band2,80,23,{baseline:middle}',
                    'text,F4,220,33,{baseline:middle}',
                    'text,F2,80,41,{baseline:middle}',
                    'text,F3,160,41,{baseline:middle}',
                    'text,f1_1,10,63,{baseline:middle}',
                    'text,f2_1,80,63,{baseline:middle}',
                    'text,f3_1,160,63,{baseline:middle}',
                    'text,f4_1,220,63,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,70,36',
                    'setLineWidth,1', 'rect,80,15,140,16',
                    'setLineWidth,1', 'rect,220,15,70,36',
                    'setLineWidth,1', 'rect,80,31,80,20',
                    'setLineWidth,1', 'rect,160,31,60,20',
                    'setLineWidth,1', 'rect,10,51,70,24',
                    'setLineWidth,1', 'rect,80,51,80,24',
                    'setLineWidth,1', 'rect,160,51,60,24',
                    'setLineWidth,1', 'rect,220,51,70,24',
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
                    'text,F1,10,33.4,{baseline:middle}',
                    'text,Band2,80,24.2,{baseline:middle}',
                    'text,F4,220,33.4,{baseline:middle}',
                    'text,F2,80,42.6,{baseline:middle}',
                    'text,F3,160,42.6,{baseline:middle}',
                    'text,f1_1,10,61,{baseline:middle}',
                    'text,f2_1,80,61,{baseline:middle}',
                    'text,f3_1,160,61,{baseline:middle}',
                    'text,f4_1,220,61,{baseline:middle}',
                    'setLineWidth,1', 'rect,10,15,70,36.8',
                    'setLineWidth,1', 'rect,80,15,140,18.4',
                    'setLineWidth,1', 'rect,220,15,70,36.8',
                    'setLineWidth,1', 'rect,80,33.4,80,18.4',
                    'setLineWidth,1', 'rect,160,33.4,60,18.4',
                    'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'setLineWidth,1', 'rect,80,51.8,80,18.4',
                    'setLineWidth,1', 'rect,160,51.8,60,18.4',
                    'setLineWidth,1', 'rect,220,51.8,70,18.4',
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
                    'text,F1,10,38.4,{baseline:middle}',
                    'text,Band2,85,29.2,{baseline:middle}',
                    'text,F4,220,38.4,{baseline:middle}',
                    'text,F2,80,52.6,{baseline:middle}',
                    'text,F3,160,52.6,{baseline:middle}',
                    'text,f1_1,10,71,{baseline:middle}',
                    'text,f2_1,80,71,{baseline:middle}',
                    'text,f3_1,160,71,{baseline:middle}',
                    'text,f4_1,220,71,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,70,46.8',
                    'setLineWidth,1',
                    'rect,80,15,140,28.4',
                    'setLineWidth,1',
                    'rect,220,15,70,46.8',
                    'setLineWidth,1',
                    'rect,80,43.4,80,18.4',
                    'setLineWidth,1',
                    'rect,160,43.4,60,18.4',
                    'setLineWidth,1',
                    'rect,10,61.8,70,18.4',
                    'setLineWidth,1',
                    'rect,80,61.8,80,18.4',
                    'setLineWidth,1',
                    'rect,160,61.8,60,18.4',
                    'setLineWidth,1',
                    'rect,220,61.8,70,18.4'
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
