import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

const JSPdfGroupingTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        QUnit.module('Grouping', moduleConfig, () => {
            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: false, alignByColumn: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: false, showInGroupFooter: false }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1 (Count: 2)') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_2') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_2') {
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'text,F1: f1 (Count: 2),10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,430,20',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'text,f2_2,20,90,{baseline:middle}', 'setLineWidth,1', 'rect,20,75,80,30',
                    'text,f2_3,100,90,{baseline:middle}', 'setLineWidth,1', 'rect,100,75,80,30',
                    'text,f2_4,180,90,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,90,30',
                    'text,f2_5,270,90,{baseline:middle}', 'setLineWidth,1', 'rect,270,75,80,30',
                    'text,f2_6,350,90,{baseline:middle}', 'setLineWidth,1', 'rect,350,75,90,30',
                    'setLineWidth,1', 'rect,10,105,90,20',
                    'setLineWidth,1', 'rect,100,105,80,20',
                    'text,Count: 2,180,115,{baseline:middle}', 'setLineWidth,1', 'rect,180,105,90,20',
                    'setLineWidth,1', 'rect,270,105,80,20',
                    'setLineWidth,1', 'rect,350,105,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: true, alignByColumn: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: false, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                    } else if(notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,430,20',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'text,f2_2,20,90,{baseline:middle}', 'setLineWidth,1', 'rect,20,75,80,30',
                    'text,f2_3,100,90,{baseline:middle}', 'setLineWidth,1', 'rect,100,75,80,30',
                    'text,f2_4,180,90,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,90,30',
                    'text,f2_5,270,90,{baseline:middle}', 'setLineWidth,1', 'rect,270,75,80,30',
                    'text,f2_6,350,90,{baseline:middle}', 'setLineWidth,1', 'rect,350,75,90,30',
                    'setLineWidth,1', 'rect,20,105,80,20',
                    'setLineWidth,1', 'rect,100,105,80,20',
                    'text,Count: 2,180,115,{baseline:middle}', 'setLineWidth,1', 'rect,180,105,90,20',
                    'setLineWidth,1', 'rect,270,105,80,20',
                    'setLineWidth,1', 'rect,350,105,90,20',
                    'setLineWidth,1', 'rect,10,125,90,20',
                    'setLineWidth,1', 'rect,100,125,80,20',
                    'text,Count: 2,180,135,{baseline:middle}', 'setLineWidth,1', 'rect,180,125,90,20',
                    'setLineWidth,1', 'rect,270,125,80,20',
                    'setLineWidth,1', 'rect,350,125,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 groups - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: false, alignByColumn: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: false, showInGroupFooter: false }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F2') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1_1 (Count: 1)') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F1: f2_1 (Count: 1)') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_2') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_2') {
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'text,F1: f1_1 (Count: 1),10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,430,20',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'text,F1: f2_1 (Count: 1),10,85,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,430,20',
                    'text,f2_2,20,110,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,80,30',
                    'text,f2_3,100,110,{baseline:middle}', 'setLineWidth,1', 'rect,100,95,80,30',
                    'text,f2_4,180,110,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,90,30',
                    'text,f2_5,270,110,{baseline:middle}', 'setLineWidth,1', 'rect,270,95,80,30',
                    'text,f2_6,350,110,{baseline:middle}', 'setLineWidth,1', 'rect,350,95,90,30',
                    'setLineWidth,1', 'rect,10,125,90,20',
                    'setLineWidth,1', 'rect,100,125,80,20',
                    'text,Count: 2,180,135,{baseline:middle}', 'setLineWidth,1', 'rect,180,125,90,20',
                    'setLineWidth,1', 'rect,270,125,80,20',
                    'setLineWidth,1', 'rect,350,125,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 groups - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: true, alignByColumn: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: false, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'text,F1: f1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,430,20',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'setLineWidth,1', 'rect,20,75,80,20',
                    'setLineWidth,1', 'rect,100,75,80,20',
                    'text,Count: 1,180,85,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,90,20',
                    'setLineWidth,1', 'rect,270,75,80,20',
                    'setLineWidth,1', 'rect,350,75,90,20',
                    'text,F1: f2_1,10,105,{baseline:middle}', 'setLineWidth,1', 'rect,10,95,430,20',
                    'text,f2_2,20,130,{baseline:middle}', 'setLineWidth,1', 'rect,20,115,80,30',
                    'text,f2_3,100,130,{baseline:middle}', 'setLineWidth,1', 'rect,100,115,80,30',
                    'text,f2_4,180,130,{baseline:middle}', 'setLineWidth,1', 'rect,180,115,90,30',
                    'text,f2_5,270,130,{baseline:middle}', 'setLineWidth,1', 'rect,270,115,80,30',
                    'text,f2_6,350,130,{baseline:middle}', 'setLineWidth,1', 'rect,350,115,90,30',
                    'setLineWidth,1', 'rect,20,145,80,20',
                    'setLineWidth,1', 'rect,100,145,80,20',
                    'text,Count: 1,180,155,{baseline:middle}', 'setLineWidth,1', 'rect,180,145,90,20',
                    'setLineWidth,1', 'rect,270,145,80,20',
                    'setLineWidth,1', 'rect,350,145,90,20',
                    'setLineWidth,1', 'rect,10,165,90,20',
                    'setLineWidth,1', 'rect,100,165,80,20',
                    'text,Count: 2,180,175,{baseline:middle}', 'setLineWidth,1', 'rect,180,165,90,20',
                    'setLineWidth,1', 'rect,270,165,80,20',
                    'setLineWidth,1', 'rect,350,165,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: false, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true, showInGroupFooter: false }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,51', 'line,10,51,180,51',
                    'text,Count: 2,180,41,{baseline:middle}', 'setLineWidth,1', 'line,180,31,270,31', 'line,180,51,270,51',
                    'setLineWidth,1', 'line,270,31,350,31', 'line,270,51,350,51',
                    'setLineWidth,1', 'line,350,31,440,31', 'line,440,31,440,51', 'line,350,51,440,51',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'text,f2_2,20,90,{baseline:middle}', 'setLineWidth,1', 'rect,20,75,80,30',
                    'text,f2_3,100,90,{baseline:middle}', 'setLineWidth,1', 'rect,100,75,80,30',
                    'text,f2_4,180,90,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,90,30',
                    'text,f2_5,270,90,{baseline:middle}', 'setLineWidth,1', 'rect,270,75,80,30',
                    'text,f2_6,350,90,{baseline:middle}', 'setLineWidth,1', 'rect,350,75,90,30',
                    'setLineWidth,1', 'rect,10,105,90,20',
                    'setLineWidth,1', 'rect,100,105,80,20',
                    'text,Count: 2,180,115,{baseline:middle}', 'setLineWidth,1', 'rect,180,105,90,20',
                    'setLineWidth,1', 'rect,270,105,80,20',
                    'setLineWidth,1', 'rect,350,105,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: true, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,430,20',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'text,f2_2,20,90,{baseline:middle}', 'setLineWidth,1', 'rect,20,75,80,30',
                    'text,f2_3,100,90,{baseline:middle}', 'setLineWidth,1', 'rect,100,75,80,30',
                    'text,f2_4,180,90,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,90,30',
                    'text,f2_5,270,90,{baseline:middle}', 'setLineWidth,1', 'rect,270,75,80,30',
                    'text,f2_6,350,90,{baseline:middle}', 'setLineWidth,1', 'rect,350,75,90,30',
                    'setLineWidth,1', 'rect,20,105,80,20',
                    'setLineWidth,1', 'rect,100,105,80,20',
                    'text,Count: 2,180,115,{baseline:middle}', 'setLineWidth,1', 'rect,180,105,90,20',
                    'setLineWidth,1', 'rect,270,105,80,20',
                    'setLineWidth,1', 'rect,350,105,90,20',
                    'setLineWidth,1', 'rect,10,125,90,20',
                    'setLineWidth,1', 'rect,100,125,80,20',
                    'text,Count: 2,180,135,{baseline:middle}', 'setLineWidth,1', 'rect,180,125,90,20',
                    'setLineWidth,1', 'rect,270,125,80,20',
                    'setLineWidth,1', 'rect,350,125,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 groups - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: false, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true, showInGroupFooter: false }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'text,F1: f1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,51', 'line,10,51,180,51',
                    'text,Count: 1,180,41,{baseline:middle}', 'setLineWidth,1', 'line,180,31,270,31', 'line,180,51,270,51',
                    'setLineWidth,1', 'line,270,31,350,31', 'line,270,51,350,51',
                    'setLineWidth,1', 'line,350,31,440,31', 'line,440,31,440,51', 'line,350,51,440,51',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'text,F1: f2_1,10,85,{baseline:middle}', 'setLineWidth,1', 'line,10,75,180,75', 'line,10,75,10,95', 'line,10,95,180,95',
                    'text,Count: 1,180,85,{baseline:middle}', 'setLineWidth,1', 'line,180,75,270,75', 'line,180,95,270,95',
                    'setLineWidth,1', 'line,270,75,350,75', 'line,270,95,350,95',
                    'setLineWidth,1', 'line,350,75,440,75', 'line,440,75,440,95', 'line,350,95,440,95',
                    'text,f2_2,20,110,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,80,30',
                    'text,f2_3,100,110,{baseline:middle}', 'setLineWidth,1', 'rect,100,95,80,30',
                    'text,f2_4,180,110,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,90,30',
                    'text,f2_5,270,110,{baseline:middle}', 'setLineWidth,1', 'rect,270,95,80,30',
                    'text,f2_6,350,110,{baseline:middle}', 'setLineWidth,1', 'rect,350,95,90,30',
                    'setLineWidth,1', 'rect,10,125,90,20',
                    'setLineWidth,1', 'rect,100,125,80,20',
                    'text,Count: 2,180,135,{baseline:middle}', 'setLineWidth,1', 'rect,180,125,90,20',
                    'setLineWidth,1', 'rect,270,125,80,20',
                    'setLineWidth,1', 'rect,350,125,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 groups - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: true, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'text,F1: f1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,430,20',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'setLineWidth,1', 'rect,20,75,80,20',
                    'setLineWidth,1', 'rect,100,75,80,20',
                    'text,Count: 1,180,85,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,90,20',
                    'setLineWidth,1', 'rect,270,75,80,20',
                    'setLineWidth,1', 'rect,350,75,90,20',
                    'text,F1: f2_1,10,105,{baseline:middle}', 'setLineWidth,1', 'rect,10,95,430,20',
                    'text,f2_2,20,130,{baseline:middle}', 'setLineWidth,1', 'rect,20,115,80,30',
                    'text,f2_3,100,130,{baseline:middle}', 'setLineWidth,1', 'rect,100,115,80,30',
                    'text,f2_4,180,130,{baseline:middle}', 'setLineWidth,1', 'rect,180,115,90,30',
                    'text,f2_5,270,130,{baseline:middle}', 'setLineWidth,1', 'rect,270,115,80,30',
                    'text,f2_6,350,130,{baseline:middle}', 'setLineWidth,1', 'rect,350,115,90,30',
                    'setLineWidth,1', 'rect,20,145,80,20',
                    'setLineWidth,1', 'rect,100,145,80,20',
                    'text,Count: 1,180,155,{baseline:middle}', 'setLineWidth,1', 'rect,180,145,90,20',
                    'setLineWidth,1', 'rect,270,145,80,20',
                    'setLineWidth,1', 'rect,350,145,90,20',
                    'setLineWidth,1', 'rect,10,165,90,20',
                    'setLineWidth,1', 'rect,100,165,80,20',
                    'text,Count: 2,180,175,{baseline:middle}', 'setLineWidth,1', 'rect,180,165,90,20',
                    'setLineWidth,1', 'rect,270,165,80,20',
                    'setLineWidth,1', 'rect,350,165,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 0}, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: false, alignByColumn: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: false, showInGroupFooter: false }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F3') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1 (Count: 2)') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2 (Count: 2)') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_3') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_3') {
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1 (Count: 2),10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,20',
                    'text,F2: f2 (Count: 2),20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,330,20',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,60,24',
                    'text,f1_4,90,83,{baseline:middle}', 'setLineWidth,1', 'rect,90,71,90,24',
                    'text,f1_5,180,83,{baseline:middle}', 'setLineWidth,1', 'rect,180,71,80,24',
                    'text,f1_6,260,83,{baseline:middle}', 'setLineWidth,1', 'rect,260,71,90,24',
                    'text,f2_3,30,110,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,60,30',
                    'text,f2_4,90,110,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,30',
                    'text,f2_5,180,110,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,80,30',
                    'text,f2_6,260,110,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,90,30',
                    'setLineWidth,1', 'rect,10,125,80,20',
                    'text,Count: 2,90,135,{baseline:middle}', 'setLineWidth,1', 'rect,90,125,90,20',
                    'setLineWidth,1', 'rect,180,125,80,20',
                    'setLineWidth,1', 'rect,260,125,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 0}, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: true, alignByColumn: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: false, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,20',
                    'text,F2: f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,330,20',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,60,24',
                    'text,f1_4,90,83,{baseline:middle}', 'setLineWidth,1', 'rect,90,71,90,24',
                    'text,f1_5,180,83,{baseline:middle}', 'setLineWidth,1', 'rect,180,71,80,24',
                    'text,f1_6,260,83,{baseline:middle}', 'setLineWidth,1', 'rect,260,71,90,24',
                    'text,f2_3,30,110,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,60,30',
                    'text,f2_4,90,110,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,30',
                    'text,f2_5,180,110,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,80,30',
                    'text,f2_6,260,110,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,90,30',
                    'setLineWidth,1', 'rect,30,125,60,20',
                    'text,Count: 2,90,135,{baseline:middle}', 'setLineWidth,1', 'rect,90,125,90,20',
                    'setLineWidth,1', 'rect,180,125,80,20',
                    'setLineWidth,1', 'rect,260,125,90,20',
                    'setLineWidth,1', 'rect,20,145,70,20',
                    'text,Count: 2,90,155,{baseline:middle}', 'setLineWidth,1', 'rect,90,145,90,20',
                    'setLineWidth,1', 'rect,180,145,80,20',
                    'setLineWidth,1', 'rect,260,145,90,20',
                    'setLineWidth,1', 'rect,10,165,80,20',
                    'text,Count: 2,90,175,{baseline:middle}', 'setLineWidth,1', 'rect,90,165,90,20',
                    'setLineWidth,1', 'rect,180,165,80,20',
                    'setLineWidth,1', 'rect,260,165,90,20'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 0}, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: false, alignByColumn: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: false, showInGroupFooter: false }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F3') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1 (Count: 2)') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f1_2 (Count: 1)') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'F2: f2_2 (Count: 1)') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f1_3') {
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'f2_3') {
                        e.rowHeight = 36;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1 (Count: 2),10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,20',
                    'text,F2: f1_2 (Count: 1),20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,330,24',
                    'text,f1_3,30,90,{baseline:middle}', 'setLineWidth,1', 'rect,30,75,60,30',
                    'text,f1_4,90,90,{baseline:middle}', 'setLineWidth,1', 'rect,90,75,90,30',
                    'text,f1_5,180,90,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,80,30',
                    'text,f1_6,260,90,{baseline:middle}', 'setLineWidth,1', 'rect,260,75,90,30',
                    'text,F2: f2_2 (Count: 1),20,117,{baseline:middle}', 'setLineWidth,1', 'rect,20,105,330,24',
                    'text,f2_3,30,147,{baseline:middle}', 'setLineWidth,1', 'rect,30,129,60,36',
                    'text,f2_4,90,147,{baseline:middle}', 'setLineWidth,1', 'rect,90,129,90,36',
                    'text,f2_5,180,147,{baseline:middle}', 'setLineWidth,1', 'rect,180,129,80,36',
                    'text,f2_6,260,147,{baseline:middle}', 'setLineWidth,1', 'rect,260,129,90,36',
                    'setLineWidth,1', 'rect,10,165,80,20',
                    'text,Count: 2,90,175,{baseline:middle}', 'setLineWidth,1', 'rect,90,165,90,20',
                    'setLineWidth,1', 'rect,180,165,80,20',
                    'setLineWidth,1', 'rect,260,165,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 0}, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: true, alignByColumn: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: false, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,20',
                    'text,F2: f1_2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,330,20',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,60,24',
                    'text,f1_4,90,83,{baseline:middle}', 'setLineWidth,1', 'rect,90,71,90,24',
                    'text,f1_5,180,83,{baseline:middle}', 'setLineWidth,1', 'rect,180,71,80,24',
                    'text,f1_6,260,83,{baseline:middle}', 'setLineWidth,1', 'rect,260,71,90,24',
                    'setLineWidth,1', 'rect,30,95,60,20',
                    'text,Count: 1,90,105,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,20',
                    'setLineWidth,1', 'rect,180,95,80,20',
                    'setLineWidth,1', 'rect,260,95,90,20',
                    'text,F2: f2_2,20,125,{baseline:middle}', 'setLineWidth,1', 'rect,20,115,330,20',
                    'text,f2_3,30,150,{baseline:middle}', 'setLineWidth,1', 'rect,30,135,60,30',
                    'text,f2_4,90,150,{baseline:middle}', 'setLineWidth,1', 'rect,90,135,90,30',
                    'text,f2_5,180,150,{baseline:middle}', 'setLineWidth,1', 'rect,180,135,80,30',
                    'text,f2_6,260,150,{baseline:middle}', 'setLineWidth,1', 'rect,260,135,90,30',
                    'setLineWidth,1', 'rect,30,165,60,20',
                    'text,Count: 1,90,175,{baseline:middle}', 'setLineWidth,1', 'rect,90,165,90,20',
                    'setLineWidth,1', 'rect,180,165,80,20',
                    'setLineWidth,1', 'rect,260,165,90,20',
                    'setLineWidth,1', 'rect,20,185,70,20',
                    'text,Count: 2,90,195,{baseline:middle}', 'setLineWidth,1', 'rect,90,185,90,20',
                    'setLineWidth,1', 'rect,180,185,80,20',
                    'setLineWidth,1', 'rect,260,185,90,20',
                    'setLineWidth,1', 'rect,10,205,80,20',
                    'text,Count: 2,90,215,{baseline:middle}', 'setLineWidth,1', 'rect,90,205,90,20',
                    'setLineWidth,1', 'rect,180,205,80,20',
                    'setLineWidth,1', 'rect,260,205,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: false, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true, showInGroupFooter: false }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F3') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f1_3') {
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'f2_3') {
                        e.rowHeight = 36;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,51', 'line,10,51,90,51',
                    'text,Count: 2,90,41,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,51,180,51',
                    'setLineWidth,1', 'line,180,31,260,31', 'line,180,51,260,51',
                    'setLineWidth,1', 'line,260,31,350,31', 'line,350,31,350,51', 'line,260,51,350,51',
                    'text,F2: f2,20,63,{baseline:middle}', 'setLineWidth,1', 'line,20,51,90,51', 'line,20,51,20,75', 'line,20,75,90,75',
                    'text,Count: 2,90,63,{baseline:middle}', 'setLineWidth,1', 'line,90,51,180,51', 'line,90,75,180,75',
                    'setLineWidth,1', 'line,180,51,260,51', 'line,180,75,260,75',
                    'setLineWidth,1', 'line,260,51,350,51', 'line,350,51,350,75', 'line,260,75,350,75',
                    'text,f1_3,30,90,{baseline:middle}', 'setLineWidth,1', 'rect,30,75,60,30',
                    'text,f1_4,90,90,{baseline:middle}', 'setLineWidth,1', 'rect,90,75,90,30',
                    'text,f1_5,180,90,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,80,30',
                    'text,f1_6,260,90,{baseline:middle}', 'setLineWidth,1', 'rect,260,75,90,30',
                    'text,f2_3,30,123,{baseline:middle}', 'setLineWidth,1', 'rect,30,105,60,36',
                    'text,f2_4,90,123,{baseline:middle}', 'setLineWidth,1', 'rect,90,105,90,36',
                    'text,f2_5,180,123,{baseline:middle}', 'setLineWidth,1', 'rect,180,105,80,36',
                    'text,f2_6,260,123,{baseline:middle}', 'setLineWidth,1', 'rect,260,105,90,36',
                    'setLineWidth,1', 'rect,10,141,80,20',
                    'text,Count: 2,90,151,{baseline:middle}', 'setLineWidth,1', 'rect,90,141,90,20',
                    'setLineWidth,1', 'rect,180,141,80,20',
                    'setLineWidth,1', 'rect,260,141,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: true, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,20',
                    'text,F2: f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,330,20',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,60,24',
                    'text,f1_4,90,83,{baseline:middle}', 'setLineWidth,1', 'rect,90,71,90,24',
                    'text,f1_5,180,83,{baseline:middle}', 'setLineWidth,1', 'rect,180,71,80,24',
                    'text,f1_6,260,83,{baseline:middle}', 'setLineWidth,1', 'rect,260,71,90,24',
                    'text,f2_3,30,110,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,60,30',
                    'text,f2_4,90,110,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,30',
                    'text,f2_5,180,110,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,80,30',
                    'text,f2_6,260,110,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,90,30',
                    'setLineWidth,1', 'rect,30,125,60,20',
                    'text,Count: 2,90,135,{baseline:middle}', 'setLineWidth,1', 'rect,90,125,90,20',
                    'setLineWidth,1', 'rect,180,125,80,20',
                    'setLineWidth,1', 'rect,260,125,90,20',
                    'setLineWidth,1', 'rect,20,145,70,20',
                    'text,Count: 2,90,155,{baseline:middle}', 'setLineWidth,1', 'rect,90,145,90,20',
                    'setLineWidth,1', 'rect,180,145,80,20',
                    'setLineWidth,1', 'rect,260,145,90,20',
                    'setLineWidth,1', 'rect,10,165,80,20',
                    'text,Count: 2,90,175,{baseline:middle}', 'setLineWidth,1', 'rect,90,165,90,20',
                    'setLineWidth,1', 'rect,180,165,80,20',
                    'setLineWidth,1', 'rect,260,165,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: false, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true, showInGroupFooter: false }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                    } else if(notEmptyCell.text === 'F2: f1_3') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2_2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2_3') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_3') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_3') {
                        e.rowHeight = 36;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,51', 'line,10,51,90,51',
                    'text,Count: 2,90,41,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,51,180,51',
                    'setLineWidth,1', 'line,180,31,260,31', 'line,180,51,260,51',
                    'setLineWidth,1', 'line,260,31,350,31', 'line,350,31,350,51', 'line,260,51,350,51',
                    'text,F2: f1_2,20,61,{baseline:middle}', 'setLineWidth,1', 'line,20,51,90,51', 'line,20,51,20,71', 'line,20,71,90,71',
                    'text,Count: 1,90,61,{baseline:middle}', 'setLineWidth,1', 'line,90,51,180,51', 'line,90,71,180,71',
                    'setLineWidth,1', 'line,180,51,260,51', 'line,180,71,260,71',
                    'setLineWidth,1', 'line,260,51,350,51', 'line,350,51,350,71', 'line,260,71,350,71',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,60,24',
                    'text,f1_4,90,83,{baseline:middle}', 'setLineWidth,1', 'rect,90,71,90,24',
                    'text,f1_5,180,83,{baseline:middle}', 'setLineWidth,1', 'rect,180,71,80,24',
                    'text,f1_6,260,83,{baseline:middle}', 'setLineWidth,1', 'rect,260,71,90,24',
                    'text,F2: f2_2,20,105,{baseline:middle}', 'setLineWidth,1', 'line,20,95,90,95', 'line,20,95,20,115', 'line,20,115,90,115',
                    'text,Count: 1,90,105,{baseline:middle}', 'setLineWidth,1', 'line,90,95,180,95', 'line,90,115,180,115',
                    'setLineWidth,1', 'line,180,95,260,95', 'line,180,115,260,115',
                    'setLineWidth,1', 'line,260,95,350,95', 'line,350,95,350,115', 'line,260,115,350,115',
                    'text,f2_3,30,133,{baseline:middle}', 'setLineWidth,1', 'rect,30,115,60,36',
                    'text,f2_4,90,133,{baseline:middle}', 'setLineWidth,1', 'rect,90,115,90,36',
                    'text,f2_5,180,133,{baseline:middle}', 'setLineWidth,1', 'rect,180,115,80,36',
                    'text,f2_6,260,133,{baseline:middle}', 'setLineWidth,1', 'rect,260,115,90,36',
                    'setLineWidth,1', 'rect,10,151,80,20',
                    'text,Count: 2,90,161,{baseline:middle}', 'setLineWidth,1', 'rect,90,151,90,20',
                    'setLineWidth,1', 'rect,180,151,80,20',
                    'setLineWidth,1', 'rect,260,151,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], groupItems: [f4], showInGroupFooter: true, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
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
                    } else if(notEmptyCell.text === 'F2: f1_3') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2_2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2_3') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_3') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_3') {
                        e.rowHeight = 36;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,20',
                    'text,F2: f1_2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,330,20',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,60,24',
                    'text,f1_4,90,83,{baseline:middle}', 'setLineWidth,1', 'rect,90,71,90,24',
                    'text,f1_5,180,83,{baseline:middle}', 'setLineWidth,1', 'rect,180,71,80,24',
                    'text,f1_6,260,83,{baseline:middle}', 'setLineWidth,1', 'rect,260,71,90,24',
                    'setLineWidth,1', 'rect,30,95,60,20',
                    'text,Count: 1,90,105,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,20',
                    'setLineWidth,1', 'rect,180,95,80,20',
                    'setLineWidth,1', 'rect,260,95,90,20',
                    'text,F2: f2_2,20,125,{baseline:middle}', 'setLineWidth,1', 'rect,20,115,330,20',
                    'text,f2_3,30,153,{baseline:middle}', 'setLineWidth,1', 'rect,30,135,60,36',
                    'text,f2_4,90,153,{baseline:middle}', 'setLineWidth,1', 'rect,90,135,90,36',
                    'text,f2_5,180,153,{baseline:middle}', 'setLineWidth,1', 'rect,180,135,80,36',
                    'text,f2_6,260,153,{baseline:middle}', 'setLineWidth,1', 'rect,260,135,90,36',
                    'setLineWidth,1', 'rect,30,171,60,20',
                    'text,Count: 1,90,181,{baseline:middle}', 'setLineWidth,1', 'rect,90,171,90,20',
                    'setLineWidth,1', 'rect,180,171,80,20',
                    'setLineWidth,1', 'rect,260,171,90,20',
                    'setLineWidth,1', 'rect,20,191,70,20',
                    'text,Count: 2,90,201,{baseline:middle}', 'setLineWidth,1', 'rect,90,191,90,20',
                    'setLineWidth,1', 'rect,180,191,80,20',
                    'setLineWidth,1', 'rect,260,191,90,20',
                    'setLineWidth,1', 'rect,10,211,80,20',
                    'text,Count: 2,90,221,{baseline:middle}', 'setLineWidth,1', 'rect,90,211,90,20',
                    'setLineWidth,1', 'rect,180,211,80,20',
                    'setLineWidth,1', 'rect,260,211,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, {f3, groupIndex: 2}, f4, f5, f6], groupItems: [f5], showInGroupFooter: false, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3', groupIndex: 2 },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f5', summaryType: 'count', alignByColumn: true, showInGroupFooter: false }
                        ],
                        totalItems: [
                            { column: 'f5', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F4') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'F3: f3') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f1_4') {
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'f2_4') {
                        e.rowHeight = 36;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F4,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F5,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F6,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,100,31', 'line,10,31,10,51', 'line,10,51,100,51',
                    'text,Count: 2,100,41,{baseline:middle}', 'setLineWidth,1', 'line,100,31,180,31', 'line,100,51,180,51',
                    'setLineWidth,1', 'line,180,31,270,31', 'line,270,31,270,51', 'line,180,51,270,51',
                    'text,F2: f2,20,63,{baseline:middle}', 'setLineWidth,1', 'line,20,51,100,51', 'line,20,51,20,75', 'line,20,75,100,75',
                    'text,Count: 2,100,63,{baseline:middle}', 'setLineWidth,1', 'line,100,51,180,51', 'line,100,75,180,75',
                    'setLineWidth,1', 'line,180,51,270,51', 'line,270,51,270,75', 'line,180,75,270,75',
                    'text,F3: f3,30,87,{baseline:middle}', 'setLineWidth,1', 'line,30,75,100,75', 'line,30,75,30,99', 'line,30,99,100,99',
                    'text,Count: 2,100,87,{baseline:middle}', 'setLineWidth,1', 'line,100,75,180,75', 'line,100,99,180,99',
                    'setLineWidth,1', 'line,180,75,270,75', 'line,270,75,270,99', 'line,180,99,270,99',
                    'text,f1_4,40,114,{baseline:middle}', 'setLineWidth,1', 'rect,40,99,60,30',
                    'text,f1_5,100,114,{baseline:middle}', 'setLineWidth,1', 'rect,100,99,80,30',
                    'text,f1_6,180,114,{baseline:middle}', 'setLineWidth,1', 'rect,180,99,90,30',
                    'text,f2_4,40,147,{baseline:middle}', 'setLineWidth,1', 'rect,40,129,60,36',
                    'text,f2_5,100,147,{baseline:middle}', 'setLineWidth,1', 'rect,100,129,80,36',
                    'text,f2_6,180,147,{baseline:middle}', 'setLineWidth,1', 'rect,180,129,90,36',
                    'setLineWidth,1', 'rect,10,165,90,20',
                    'text,Count: 2,100,175,{baseline:middle}', 'setLineWidth,1', 'rect,100,165,80,20',
                    'setLineWidth,1', 'rect,180,165,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, {f3, groupIndex: 2}, f4, f5, f6], groupItems: [f5], showInGroupFooter: true, alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3', groupIndex: 2 },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f5', summaryType: 'count', alignByColumn: true, showInGroupFooter: true }
                        ],
                        totalItems: [
                            { column: 'f5', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
                    if(notEmptyCell.text === 'F4') {
                        e.rowHeight = 16;
                    } else if(notEmptyCell.text === 'F1: f1') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F2: f2') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'F3: f3') {
                        e.rowHeight = 20;
                    } else if(notEmptyCell.text === 'f1_4') {
                        e.rowHeight = 24;
                    } else if(notEmptyCell.text === 'f2_4') {
                        e.rowHeight = 30;
                    } else if(notEmptyCell.text === 'Count: 1' || notEmptyCell.text === 'Count: 2') {
                        e.rowHeight = 20;
                    }
                };

                const expectedLog = [
                    'text,F4,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F5,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F6,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,260,20',
                    'text,F2: f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,250,20',
                    'text,F3: f3,30,81,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,240,20',
                    'text,f1_4,40,103,{baseline:middle}', 'setLineWidth,1', 'rect,40,91,60,24',
                    'text,f1_5,100,103,{baseline:middle}', 'setLineWidth,1', 'rect,100,91,80,24',
                    'text,f1_6,180,103,{baseline:middle}', 'setLineWidth,1', 'rect,180,91,90,24',
                    'text,f2_4,40,130,{baseline:middle}', 'setLineWidth,1', 'rect,40,115,60,30',
                    'text,f2_5,100,130,{baseline:middle}', 'setLineWidth,1', 'rect,100,115,80,30',
                    'text,f2_6,180,130,{baseline:middle}', 'setLineWidth,1', 'rect,180,115,90,30',
                    'setLineWidth,1', 'rect,40,145,60,20',
                    'text,Count: 2,100,155,{baseline:middle}', 'setLineWidth,1', 'rect,100,145,80,20',
                    'setLineWidth,1', 'rect,180,145,90,20',
                    'setLineWidth,1', 'rect,30,165,70,20',
                    'text,Count: 2,100,175,{baseline:middle}', 'setLineWidth,1', 'rect,100,165,80,20',
                    'setLineWidth,1', 'rect,180,165,90,20',
                    'setLineWidth,1', 'rect,20,185,80,20',
                    'text,Count: 2,100,195,{baseline:middle}', 'setLineWidth,1', 'rect,100,185,80,20',
                    'setLineWidth,1', 'rect,180,185,90,20',
                    'setLineWidth,1', 'rect,10,205,90,20',
                    'text,Count: 2,100,215,{baseline:middle}', 'setLineWidth,1', 'rect,100,205,80,20',
                    'setLineWidth,1', 'rect,180,205,90,20'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

    }
};

export { JSPdfGroupingTests };
