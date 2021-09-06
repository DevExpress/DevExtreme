import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

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
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,16',
                    'text,F1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,100,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,100,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,100,18.4',
                    'text,F1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,100,18.4',
                    'text,f1_1,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,140,16',
                    'text,F1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,70,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,140,18.4',
                    'text,F1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,70,18.4',
                    'text,F2,80,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,70,18.4',
                    'text,f1_1,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'text,f2_1,80,61,{baseline:middle}', 'setLineWidth,1', 'rect,80,51.8,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]] - splitToTablesByColumns: [f2]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,65,16',
                    'text,F1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,65,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,65,24',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,75,16',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,75,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,75,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 65, 75 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,140,16',
                    'text,F3,150,33,{baseline:middle}', 'setLineWidth,1', 'rect,150,15,60,36',
                    'text,F1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,70,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,70,24',
                    'text,f3_1,150,63,{baseline:middle}', 'setLineWidth,1', 'rect,150,51,60,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 60 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,140,18.4',
                    'text,F3,150,33.4,{baseline:middle}', 'setLineWidth,1', 'rect,150,15,60,36.8',
                    'text,F1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,70,18.4',
                    'text,F2,80,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,70,18.4',
                    'text,f1_1,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'text,f2_1,80,61,{baseline:middle}', 'setLineWidth,1', 'rect,80,51.8,70,18.4',
                    'text,f3_1,150,61,{baseline:middle}', 'setLineWidth,1', 'rect,150,51.8,60,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 60 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2], f3] - splitToTablesByColumns: [f2]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2' ] },
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,50,16',
                    'text,F1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,50,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,50,24',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F3,70,33,{baseline:middle}', 'setLineWidth,1', 'rect,70,15,70,36',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'text,f3_1,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 50, 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2], f3] - splitToTablesByColumns: [f3]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2' ] },
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

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,110,16',
                    'text,F1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,50,20',
                    'text,F2,60,41,{baseline:middle}', 'setLineWidth,1', 'rect,60,31,60,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,50,24',
                    'text,f2_1,60,63,{baseline:middle}', 'setLineWidth,1', 'rect,60,51,60,24',
                    'addPage,',
                    'text,F3,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 50, 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2], f3] - splitToTablesByColumns: [f2,f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,50,16',
                    'text,F1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,50,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,50,24',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'addPage,',
                    'text,F3,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 50, 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,F2,80,53,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,44',
                    'text,F1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f1_1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'text,f2_1,80,90,{baseline:middle}', 'setLineWidth,1', 'rect,80,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,18.4',
                    'text,Band1_1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,70,18.4',
                    'text,F2,80,51.8,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,80,36.8',
                    'text,F1,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'text,f1_1_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,70,18.4',
                    'text,f2_1,80,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,80,70.2,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1], f2]] - splitToTablesByColumns: [f2]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,F1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f1_1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F2,10,53,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,44',
                    'text,f2_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,210,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,130,20',
                    'text,F3,140,53,{baseline:middle}', 'setLineWidth,1', 'rect,140,31,80,44',
                    'text,F1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'text,F2,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                    'text,f1_1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'text,f2_1_1,70,90,{baseline:middle}', 'setLineWidth,1', 'rect,70,75,70,30',
                    'text,f3_1,140,90,{baseline:middle}', 'setLineWidth,1', 'rect,140,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,210,18.4',
                    'text,Band1_1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,130,18.4',
                    'text,F3,140,51.8,{baseline:middle}', 'setLineWidth,1', 'rect,140,33.4,80,36.8',
                    'text,F1,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,60,18.4',
                    'text,F2,70,61,{baseline:middle}', 'setLineWidth,1', 'rect,70,51.8,70,18.4',
                    'text,f1_1_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,60,18.4',
                    'text,f2_1_1,70,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,70,70.2,70,18.4',
                    'text,f3_1,140,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,140,70.2,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]] - splitToTablesByColumns: [f2]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,F1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'text,f1_1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,F3,80,53,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,44',
                    'text,F2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'text,f3_1,80,90,{baseline:middle}', 'setLineWidth,1', 'rect,80,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]] - splitToTablesByColumns: [f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,130,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,130,20',
                    'text,F1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'text,F2,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                    'text,f1_1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'text,f2_1_1,70,90,{baseline:middle}', 'setLineWidth,1', 'rect,70,75,70,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,10,53,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,44',
                    'text,f3_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]] - splitToTablesByColumns: [f2,f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,F1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'text,f1_1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,F2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,10,53,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,44',
                    'text,f3_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,130,16',
                    'text,F1,10,53,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,44',
                    'text,Band1_2,70,41,{baseline:middle}', 'setLineWidth,1', 'rect,70,31,70,20',
                    'text,F2,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                    'text,f1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'text,f2_1_1,70,90,{baseline:middle}', 'setLineWidth,1', 'rect,70,75,70,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,130,18.4',
                    'text,F1,10,51.8,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,60,36.8',
                    'text,Band1_2,70,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,70,33.4,70,18.4',
                    'text,F2,70,61,{baseline:middle}', 'setLineWidth,1', 'rect,70,51.8,70,18.4',
                    'text,f1_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,60,18.4',
                    'text,f2_1_1,70,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,70,70.2,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2]]] - splitToTablesByColumns: [f2]', function(assert) {
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
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1_2' }],
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F1,10,53,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,44',
                    'text,f1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,16',
                    'text,Band1_2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,F2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1_2,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,210,16',
                    'text,F1,10,53,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,44',
                    'text,Band1_2,70,41,{baseline:middle}', 'setLineWidth,1', 'rect,70,31,150,20',
                    'text,F2,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                    'text,F3,140,63,{baseline:middle}', 'setLineWidth,1', 'rect,140,51,80,24',
                    'text,f1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'text,f2_1_2,70,90,{baseline:middle}', 'setLineWidth,1', 'rect,70,75,70,30',
                    'text,f3_1_2,140,90,{baseline:middle}', 'setLineWidth,1', 'rect,140,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,210,18.4',
                    'text,F1,10,51.8,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,60,36.8',
                    'text,Band1_2,70,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,70,33.4,150,18.4',
                    'text,F2,70,61,{baseline:middle}', 'setLineWidth,1', 'rect,70,51.8,70,18.4',
                    'text,F3,140,61,{baseline:middle}', 'setLineWidth,1', 'rect,140,51.8,80,18.4',
                    'text,f1_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,60,18.4',
                    'text,f2_1_2,70,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,70,70.2,70,18.4',
                    'text,f3_1_2,140,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,140,70.2,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2, f3]]] - splitToTablesByColumns: [f2]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F1,10,53,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,44',
                    'text,f1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,Band1_2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,150,20',
                    'text,F2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,F3,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'text,f2_1_2,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'text,f3_1_2,80,90,{baseline:middle}', 'setLineWidth,1', 'rect,80,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f, band1_2-[f2, f3]]] - splitToTablesByColumns: [f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,130,16',
                    'text,F1,10,53,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,44',
                    'text,Band1_2,70,41,{baseline:middle}', 'setLineWidth,1', 'rect,70,31,70,20',
                    'text,F2,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                    'text,f1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'text,f2_1_2,70,90,{baseline:middle}', 'setLineWidth,1', 'rect,70,75,70,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,Band1_2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,F3,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                    'text,f3_1_2,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, band1_2-[f2, f3]]] - splitToTablesByColumns: [f2,f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F1,10,53,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,44',
                    'text,f1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,60,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,16',
                    'text,Band1_2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,F2,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1_2,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,Band1_2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,F3,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                    'text,f3_1_2,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,80,30',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
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
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band2,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,16',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F1,10,33.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36.8',
                    'text,Band2,80,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,18.4',
                    'text,F2,80,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,80,18.4',
                    'text,f1_1,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'text,f2_1,80,61,{baseline:middle}', 'setLineWidth,1', 'rect,80,51.8,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2_1]] - splitToTablesByColumns: [f2]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
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
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band2,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,140,16',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,F3,160,41,{baseline:middle}', 'setLineWidth,1', 'rect,160,31,60,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'text,f3_1,160,63,{baseline:middle}', 'setLineWidth,1', 'rect,160,51,60,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F1,10,33.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36.8',
                    'text,Band2,80,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,140,18.4',
                    'text,F2,80,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,80,18.4',
                    'text,F3,160,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,160,33.4,60,18.4',
                    'text,f1_1,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'text,f2_1,80,61,{baseline:middle}', 'setLineWidth,1', 'rect,80,51.8,80,18.4',
                    'text,f3_1,160,61,{baseline:middle}', 'setLineWidth,1', 'rect,160,51.8,60,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3]] - splitToTablesByColumns: [f2]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,140,16',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,F3,90,41,{baseline:middle}', 'setLineWidth,1', 'rect,90,31,60,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                    'text,f3_1,90,63,{baseline:middle}', 'setLineWidth,1', 'rect,90,51,60,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3]] - splitToTablesByColumns: [f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band2,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,16',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F3,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3]] - splitToTablesByColumns: [f2,f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F3,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
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
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band2,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,16',
                    'text,F3,160,33,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,60,36',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'text,f3_1,160,63,{baseline:middle}', 'setLineWidth,1', 'rect,160,51,60,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F1,10,33.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36.8',
                    'text,Band2,80,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,18.4',
                    'text,F3,160,33.4,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,60,36.8',
                    'text,F2,80,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,80,18.4',
                    'text,f1_1,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'text,f2_1,80,61,{baseline:middle}', 'setLineWidth,1', 'rect,80,51.8,80,18.4',
                    'text,f3_1,160,61,{baseline:middle}', 'setLineWidth,1', 'rect,160,51.8,60,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2], f3] - splitToTablesByColumns: [f2]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,33,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,60,36',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                    'text,f3_1,90,63,{baseline:middle}', 'setLineWidth,1', 'rect,90,51,60,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2], f3] - splitToTablesByColumns: [f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band2,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,16',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'addPage,',
                    'text,F3,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,36',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2], f3] - splitToTablesByColumns: [f2,f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                    'addPage,',
                    'text,F3,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,36',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
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
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band2,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,140,16',
                    'text,F4,220,33,{baseline:middle}', 'setLineWidth,1', 'rect,220,15,70,36',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,F3,160,41,{baseline:middle}', 'setLineWidth,1', 'rect,160,31,60,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'text,f3_1,160,63,{baseline:middle}', 'setLineWidth,1', 'rect,160,51,60,24',
                    'text,f4_1,220,63,{baseline:middle}', 'setLineWidth,1', 'rect,220,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F1,10,33.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36.8',
                    'text,Band2,80,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,140,18.4',
                    'text,F4,220,33.4,{baseline:middle}', 'setLineWidth,1', 'rect,220,15,70,36.8',
                    'text,F2,80,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,80,18.4',
                    'text,F3,160,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,160,33.4,60,18.4',
                    'text,f1_1,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'text,f2_1,80,61,{baseline:middle}', 'setLineWidth,1', 'rect,80,51.8,80,18.4',
                    'text,f3_1,160,61,{baseline:middle}', 'setLineWidth,1', 'rect,160,51.8,60,18.4',
                    'text,f4_1,220,61,{baseline:middle}', 'setLineWidth,1', 'rect,220,51.8,70,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4] - splitToTablesByColumns: [f2]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,140,16',
                    'text,F4,150,33,{baseline:middle}', 'setLineWidth,1', 'rect,150,15,70,36',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,F3,90,41,{baseline:middle}', 'setLineWidth,1', 'rect,90,31,60,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                    'text,f3_1,90,63,{baseline:middle}', 'setLineWidth,1', 'rect,90,51,60,24',
                    'text,f4_1,150,63,{baseline:middle}', 'setLineWidth,1', 'rect,150,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4] - splitToTablesByColumns: [f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band2,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,16',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F4,70,33,{baseline:middle}', 'setLineWidth,1', 'rect,70,15,70,36',
                    'text,F3,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'text,f4_1,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4] - splitToTablesByColumns: [f2,f3]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F4,70,33,{baseline:middle}', 'setLineWidth,1', 'rect,70,15,70,36',
                    'text,F3,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'text,f4_1,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4] - splitToTablesByColumns: [f4]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 3,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band2,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,140,16',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,F3,160,41,{baseline:middle}', 'setLineWidth,1', 'rect,160,31,60,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'text,f3_1,160,63,{baseline:middle}', 'setLineWidth,1', 'rect,160,51,60,24',
                    'addPage,',
                    'text,F4,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f4_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4] - splitToTablesByColumns: [f3,f4]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 3,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band2,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,16',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F3,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'addPage,',
                    'text,F4,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f4_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band2-[f2,f3], f4] - splitToTablesByColumns: [f2,f3,f4]', function(assert) {
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

                const splitToTablesByColumns = [{
                    columnIndex: 1,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 3,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,20',
                    'text,f2_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,80,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,60,16',
                    'text,F3,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'addPage,',
                    'text,F4,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,f4_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2,f3,f4], band2-[f5,f6,f7]] - splitToTablesByColumns: [f3]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band1', columns: ['f2', 'f3', 'f4'] },
                        { caption: 'Band2', columns: ['f5', 'f6', 'f7'] },
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1', f6: 'f6_1', f7: 'f7_1' }],
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

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band1,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,16',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,130,16',
                    'text,Band2,140,23,{baseline:middle}', 'setLineWidth,1', 'rect,140,15,140,16',
                    'text,F3,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,F4,70,41,{baseline:middle}', 'setLineWidth,1', 'rect,70,31,70,20',
                    'text,F5,140,41,{baseline:middle}', 'setLineWidth,1', 'rect,140,31,50,20',
                    'text,F6,190,41,{baseline:middle}', 'setLineWidth,1', 'rect,190,31,40,20',
                    'text,F7,230,41,{baseline:middle}', 'setLineWidth,1', 'rect,230,31,50,20',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'text,f4_1,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                    'text,f5_1,140,63,{baseline:middle}', 'setLineWidth,1', 'rect,140,51,50,24',
                    'text,f6_1,190,63,{baseline:middle}', 'setLineWidth,1', 'rect,190,51,40,24',
                    'text,f7_1,230,63,{baseline:middle}', 'setLineWidth,1', 'rect,230,51,50,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70, 50, 40, 50 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2,f3,f4], band2-[f5,f6,f7]] - splitToTablesByColumns: [f3,f6]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        { caption: 'Band1', columns: ['f2', 'f3', 'f4'] },
                        { caption: 'Band2', columns: ['f5', 'f6', 'f7'] },
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1', f6: 'f6_1', f7: 'f7_1' }],
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

                const splitToTablesByColumns = [{
                    columnIndex: 2,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 5,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,33,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,36',
                    'text,Band1,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,80,16',
                    'text,F2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,20',
                    'text,f1_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,f2_1,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,80,24',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,130,16',
                    'text,Band2,140,23,{baseline:middle}', 'setLineWidth,1', 'rect,140,15,50,16',
                    'text,F3,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,60,20',
                    'text,F4,70,41,{baseline:middle}', 'setLineWidth,1', 'rect,70,31,70,20',
                    'text,F5,140,41,{baseline:middle}', 'setLineWidth,1', 'rect,140,31,50,20',
                    'text,f3_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,60,24',
                    'text,f4_1,70,63,{baseline:middle}', 'setLineWidth,1', 'rect,70,51,70,24',
                    'text,f5_1,140,63,{baseline:middle}', 'setLineWidth,1', 'rect,140,51,50,24',
                    'addPage,',
                    'text,Band2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F6,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
                    'text,F7,50,41,{baseline:middle}', 'setLineWidth,1', 'rect,50,31,50,20',
                    'text,f6_1,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
                    'text,f7_1,50,63,{baseline:middle}', 'setLineWidth,1', 'rect,50,51,50,24',
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70, 50, 40, 50 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]] - splitToTablesByColumns: [f4]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        {
                            caption: 'Band1',
                            columns: [
                                'f2',
                                { caption: 'Band1_1', columns: ['f3', 'f4'] },
                                { caption: 'Band1_2', columns: ['f5', 'f6'] },
                                'f7'
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1', f6: 'f6_1', f7: 'f7_1' }],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F3') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f1_1') {
                        e.rowHeight = 30;
                    }
                };

                const splitToTablesByColumns = [{
                    columnIndex: 3,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,45,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,60',
                    'text,Band1,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,140,16',
                    'text,F2,80,53,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,44',
                    'text,Band1_1,160,41,{baseline:middle}', 'setLineWidth,1', 'rect,160,31,60,20',
                    'text,F3,160,63,{baseline:middle}', 'setLineWidth,1', 'rect,160,51,60,24',
                    'text,f1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'text,f2_1,80,90,{baseline:middle}', 'setLineWidth,1', 'rect,80,75,80,30',
                    'text,f3_1,160,90,{baseline:middle}', 'setLineWidth,1', 'rect,160,75,60,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,210,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,Band1_2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,90,20',
                    'text,F7,170,53,{baseline:middle}', 'setLineWidth,1', 'rect,170,31,50,44',
                    'text,F4,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,F5,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,50,24',
                    'text,F6,130,63,{baseline:middle}', 'setLineWidth,1', 'rect,130,51,40,24',
                    'text,f4_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'text,f5_1,80,90,{baseline:middle}', 'setLineWidth,1', 'rect,80,75,50,30',
                    'text,f6_1,130,90,{baseline:middle}', 'setLineWidth,1', 'rect,130,75,40,30',
                    'text,f7_1,170,90,{baseline:middle}', 'setLineWidth,1', 'rect,170,75,50,30'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70, 50, 40, 50 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]] - splitToTablesByColumns: [f4] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        {
                            caption: 'Band1',
                            columns: [
                                'f2',
                                { caption: 'Band1_1', columns: ['f3', 'f4'] },
                                { caption: 'Band1_2', columns: ['f5', 'f6'] },
                                'f7'
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1', f6: 'f6_1', f7: 'f7_1' }],
                });

                const splitToTablesByColumns = [{
                    columnIndex: 3,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,55.2',
                    'text,Band1,80,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,140,18.4',
                    'text,F2,80,51.8,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,80,36.8',
                    'text,Band1_1,160,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,160,33.4,60,18.4',
                    'text,F3,160,61,{baseline:middle}', 'setLineWidth,1', 'rect,160,51.8,60,18.4',
                    'text,f1_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,70,18.4',
                    'text,f2_1,80,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,80,70.2,80,18.4',
                    'text,f3_1,160,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,160,70.2,60,18.4',
                    'addPage,',
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,210,18.4',
                    'text,Band1_1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,70,18.4',
                    'text,Band1_2,80,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,90,18.4',
                    'text,F7,170,51.8,{baseline:middle}', 'setLineWidth,1', 'rect,170,33.4,50,36.8',
                    'text,F4,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'text,F5,80,61,{baseline:middle}', 'setLineWidth,1', 'rect,80,51.8,50,18.4',
                    'text,F6,130,61,{baseline:middle}', 'setLineWidth,1', 'rect,130,51.8,40,18.4',
                    'text,f4_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,70,18.4',
                    'text,f5_1,80,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,80,70.2,50,18.4',
                    'text,f6_1,130,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,130,70.2,40,18.4',
                    'text,f7_1,170,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,170,70.2,50,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70, 50, 40, 50 ], onRowExporting: () => {}, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]] - splitToTablesByColumns: [f4,f6]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        {
                            caption: 'Band1',
                            columns: [
                                'f2',
                                { caption: 'Band1_1', columns: ['f3', 'f4'] },
                                { caption: 'Band1_2', columns: ['f5', 'f6'] },
                                'f7'
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1', f6: 'f6_1', f7: 'f7_1' }],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F1') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F3') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f1_1') {
                        e.rowHeight = 30;
                    }
                };

                const splitToTablesByColumns = [{
                    columnIndex: 3,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 5,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,45,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,60',
                    'text,Band1,80,23,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,140,16',
                    'text,F2,80,53,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,80,44',
                    'text,Band1_1,160,41,{baseline:middle}', 'setLineWidth,1', 'rect,160,31,60,20',
                    'text,F3,160,63,{baseline:middle}', 'setLineWidth,1', 'rect,160,51,60,24',
                    'text,f1_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'text,f2_1,80,90,{baseline:middle}', 'setLineWidth,1', 'rect,80,75,80,30',
                    'text,f3_1,160,90,{baseline:middle}', 'setLineWidth,1', 'rect,160,75,60,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,120,16',
                    'text,Band1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,70,20',
                    'text,Band1_2,80,41,{baseline:middle}', 'setLineWidth,1', 'rect,80,31,50,20',
                    'text,F4,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,70,24',
                    'text,F5,80,63,{baseline:middle}', 'setLineWidth,1', 'rect,80,51,50,24',
                    'text,f4_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,70,30',
                    'text,f5_1,80,90,{baseline:middle}', 'setLineWidth,1', 'rect,80,75,50,30',
                    'addPage,',
                    'text,Band1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,Band1_2,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,40,20',
                    'text,F7,50,53,{baseline:middle}', 'setLineWidth,1', 'rect,50,31,50,44',
                    'text,F6,10,63,{baseline:middle}', 'setLineWidth,1', 'rect,10,51,40,24',
                    'text,f6_1,10,90,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,40,30',
                    'text,f7_1,50,90,{baseline:middle}', 'setLineWidth,1', 'rect,50,75,50,30'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70, 50, 40, 50 ], onRowExporting, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]] - splitToTablesByColumns: [f4,f6] - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    columns: [
                        'f1',
                        {
                            caption: 'Band1',
                            columns: [
                                'f2',
                                { caption: 'Band1_1', columns: ['f3', 'f4'] },
                                { caption: 'Band1_2', columns: ['f5', 'f6'] },
                                'f7'
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1', f6: 'f6_1', f7: 'f7_1' }],
                });

                const splitToTablesByColumns = [{
                    columnIndex: 3,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }, {
                    columnIndex: 5,
                    drawOnNewPage: true,
                    tableTopLeft: { x: 10, y: 15 }
                }];

                const expectedLog = [
                    'text,F1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,70,55.2',
                    'text,Band1,80,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,80,15,140,18.4',
                    'text,F2,80,51.8,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,80,36.8',
                    'text,Band1_1,160,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,160,33.4,60,18.4',
                    'text,F3,160,61,{baseline:middle}', 'setLineWidth,1', 'rect,160,51.8,60,18.4',
                    'text,f1_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,70,18.4',
                    'text,f2_1,80,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,80,70.2,80,18.4',
                    'text,f3_1,160,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,160,70.2,60,18.4',
                    'addPage,',
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,120,18.4',
                    'text,Band1_1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,70,18.4',
                    'text,Band1_2,80,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,80,33.4,50,18.4',
                    'text,F4,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,70,18.4',
                    'text,F5,80,61,{baseline:middle}', 'setLineWidth,1', 'rect,80,51.8,50,18.4',
                    'text,f4_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,70,18.4',
                    'text,f5_1,80,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,80,70.2,50,18.4',
                    'addPage,',
                    'text,Band1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,18.4',
                    'text,Band1_2,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,40,18.4',
                    'text,F7,50,51.8,{baseline:middle}', 'setLineWidth,1', 'rect,50,33.4,50,36.8',
                    'text,F6,10,61,{baseline:middle}', 'setLineWidth,1', 'rect,10,51.8,40,18.4',
                    'text,f6_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,40,18.4',
                    'text,f7_1,50,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,50,70.2,50,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70, 50, 40, 50 ], onRowExporting: () => {}, splitToTablesByColumns }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfBandsTests };
