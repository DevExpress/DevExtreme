import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

const JSPdfGroupingTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        QUnit.module('Grouping', moduleConfig, () => {
            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], alignByColumn: false', function(assert) {
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
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'F2') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1: f1 (Count: 2)') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'f1_2') {
                        e.rowHeight = 24;
                    } else if(e.rowCells[0].text === 'f2_2') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'setFillColor,#D3D3D3', 'rect,10,31,430,20,F',
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
                    'text,f2_6,350,90,{baseline:middle}', 'setLineWidth,1', 'rect,350,75,90,30'
                ];

                exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 430, h: 60 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 groups - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], alignByColumn: false', function(assert) {
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
                        ]
                    },
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'F2') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1: f1_1 (Count: 1)') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'F1: f2_1 (Count: 1)') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'f1_2') {
                        e.rowHeight = 24;
                    } else if(e.rowCells[0].text === 'f2_2') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'setFillColor,#D3D3D3', 'rect,10,31,430,20,F',
                    'text,F1: f1_1 (Count: 1),10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,430,20',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'setFillColor,#D3D3D3', 'rect,10,75,430,20,F',
                    'text,F1: f2_1 (Count: 1),10,85,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,430,20',
                    'text,f2_2,20,110,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,80,30',
                    'text,f2_3,100,110,{baseline:middle}', 'setLineWidth,1', 'rect,100,95,80,30',
                    'text,f2_4,180,110,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,90,30',
                    'text,f2_5,270,110,{baseline:middle}', 'setLineWidth,1', 'rect,270,95,80,30',
                    'text,f2_6,350,110,{baseline:middle}', 'setLineWidth,1', 'rect,350,95,90,30'
                ];

                exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 430, h: 60 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], alignByColumn: true', function(assert) {
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
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'F2') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1: f1') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'f1_2') {
                        e.rowHeight = 24;
                    } else if(e.rowCells[0].text === 'f2_2') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'setFillColor,#D3D3D3', 'rect,10,31,170,20,F',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,51', 'line,10,51,180,51',
                    'setFillColor,#D3D3D3', 'rect,180,31,90,20,F',
                    'text,Count: 2,180,41,{baseline:middle}', 'setLineWidth,1', 'line,180,31,270,31', 'line,180,51,270,51',
                    'setFillColor,#D3D3D3', 'rect,270,31,80,20,F',
                    'setLineWidth,1', 'line,270,31,350,31', 'line,270,51,350,51',
                    'setFillColor,#D3D3D3', 'rect,350,31,90,20,F',
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
                    'text,f2_6,350,90,{baseline:middle}', 'setLineWidth,1', 'rect,350,75,90,30'
                ];

                exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 430, h: 60 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 groups - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], groupItems: [f4], alignByColumn: true', function(assert) {
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
                        ]
                    },
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'F2') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1: f1_1') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'F1: f2_1') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'f1_2') {
                        e.rowHeight = 24;
                    } else if(e.rowCells[0].text === 'f2_2') {
                        e.rowHeight = 30;
                    }
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F6,350,23,{baseline:middle}', 'setLineWidth,1', 'rect,350,15,90,16',
                    'setFillColor,#D3D3D3', 'rect,10,31,170,20,F',
                    'text,F1: f1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,51', 'line,10,51,180,51',
                    'setFillColor,#D3D3D3', 'rect,180,31,90,20,F',
                    'text,Count: 1,180,41,{baseline:middle}', 'setLineWidth,1', 'line,180,31,270,31', 'line,180,51,270,51',
                    'setFillColor,#D3D3D3', 'rect,270,31,80,20,F',
                    'setLineWidth,1', 'line,270,31,350,31', 'line,270,51,350,51',
                    'setFillColor,#D3D3D3', 'rect,350,31,90,20,F',
                    'setLineWidth,1', 'line,350,31,440,31', 'line,440,31,440,51', 'line,350,51,440,51',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f1_4,180,63,{baseline:middle}', 'setLineWidth,1', 'rect,180,51,90,24',
                    'text,f1_5,270,63,{baseline:middle}', 'setLineWidth,1', 'rect,270,51,80,24',
                    'text,f1_6,350,63,{baseline:middle}', 'setLineWidth,1', 'rect,350,51,90,24',
                    'setFillColor,#D3D3D3', 'rect,10,75,170,20,F',
                    'text,F1: f2_1,10,85,{baseline:middle}', 'setLineWidth,1', 'line,10,75,180,75', 'line,10,75,10,95', 'line,10,95,180,95',
                    'setFillColor,#D3D3D3', 'rect,180,75,90,20,F',
                    'text,Count: 1,180,85,{baseline:middle}', 'setLineWidth,1', 'line,180,75,270,75', 'line,180,95,270,95',
                    'setFillColor,#D3D3D3', 'rect,270,75,80,20,F',
                    'setLineWidth,1', 'line,270,75,350,75', 'line,270,95,350,95',
                    'setFillColor,#D3D3D3', 'rect,350,75,90,20,F',
                    'setLineWidth,1', 'line,350,75,440,75', 'line,440,75,440,95', 'line,350,95,440,95',
                    'text,f2_2,20,110,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,80,30',
                    'text,f2_3,100,110,{baseline:middle}', 'setLineWidth,1', 'rect,100,95,80,30',
                    'text,f2_4,180,110,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,90,30',
                    'text,f2_5,270,110,{baseline:middle}', 'setLineWidth,1', 'rect,270,95,80,30',
                    'text,f2_6,350,110,{baseline:middle}', 'setLineWidth,1', 'rect,350,95,90,30'
                ];

                exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 430, h: 60 }, columnWidths: [ 90, 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 0}, f3, f4, f5, f6], groupItems: [f4], alignByColumn: false', function(assert) {
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
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'F3') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1: f1 (Count: 2)') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'F2: f2 (Count: 2)') {
                        e.rowHeight = 24;
                    } else if(e.rowCells[0].text === 'f1_3') {
                        e.rowHeight = 30;
                    } else if(e.rowCells[0].text === 'f2_3') {
                        e.rowHeight = 36;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'setFillColor,#D3D3D3', 'rect,10,31,340,20,F',
                    'text,F1: f1 (Count: 2),10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,20',
                    'setFillColor,#D3D3D3', 'rect,20,51,330,24,F',
                    'text,F2: f2 (Count: 2),20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,330,24',
                    'text,f1_3,30,90,{baseline:middle}', 'setLineWidth,1', 'rect,30,75,60,30',
                    'text,f1_4,90,90,{baseline:middle}', 'setLineWidth,1', 'rect,90,75,90,30',
                    'text,f1_5,180,90,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,80,30',
                    'text,f1_6,260,90,{baseline:middle}', 'setLineWidth,1', 'rect,260,75,90,30',
                    'text,f2_3,30,123,{baseline:middle}', 'setLineWidth,1', 'rect,30,105,60,36',
                    'text,f2_4,90,123,{baseline:middle}', 'setLineWidth,1', 'rect,90,105,90,36',
                    'text,f2_5,180,123,{baseline:middle}', 'setLineWidth,1', 'rect,180,105,80,36',
                    'text,f2_6,260,123,{baseline:middle}', 'setLineWidth,1', 'rect,260,105,90,36'
                ];

                exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 430, h: 60 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 0}, f3, f4, f5, f6], groupItems: [f4], alignByColumn: false', function(assert) {
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
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'F3') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1: f1 (Count: 2)') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'F2: f1_2 (Count: 1)') {
                        e.rowHeight = 24;
                    } else if(e.rowCells[0].text === 'F2: f2_2 (Count: 1)') {
                        e.rowHeight = 24;
                    } else if(e.rowCells[0].text === 'f1_3') {
                        e.rowHeight = 30;
                    } else if(e.rowCells[0].text === 'f2_3') {
                        e.rowHeight = 36;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'setFillColor,#D3D3D3', 'rect,10,31,340,20,F',
                    'text,F1: f1 (Count: 2),10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,20',
                    'setFillColor,#D3D3D3', 'rect,20,51,330,24,F',
                    'text,F2: f1_2 (Count: 1),20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,330,24',
                    'text,f1_3,30,90,{baseline:middle}', 'setLineWidth,1', 'rect,30,75,60,30',
                    'text,f1_4,90,90,{baseline:middle}', 'setLineWidth,1', 'rect,90,75,90,30',
                    'text,f1_5,180,90,{baseline:middle}', 'setLineWidth,1', 'rect,180,75,80,30',
                    'text,f1_6,260,90,{baseline:middle}', 'setLineWidth,1', 'rect,260,75,90,30',
                    'setFillColor,#D3D3D3', 'rect,20,105,330,24,F',
                    'text,F2: f2_2 (Count: 1),20,117,{baseline:middle}', 'setLineWidth,1', 'rect,20,105,330,24',
                    'text,f2_3,30,147,{baseline:middle}', 'setLineWidth,1', 'rect,30,129,60,36',
                    'text,f2_4,90,147,{baseline:middle}', 'setLineWidth,1', 'rect,90,129,90,36',
                    'text,f2_5,180,147,{baseline:middle}', 'setLineWidth,1', 'rect,180,129,80,36',
                    'text,f2_6,260,147,{baseline:middle}', 'setLineWidth,1', 'rect,260,129,90,36'
                ];

                exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 430, h: 60 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], groupItems: [f4], alignByColumn: true', function(assert) {
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
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'F3') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1: f1') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'F2: f2') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'f1_3') {
                        e.rowHeight = 24;
                    } else if(e.rowCells[0].text === 'f2_3') {
                        e.rowHeight = 36;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'setFillColor,#D3D3D3', 'rect,10,31,80,20,F',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,51', 'line,10,51,90,51',
                    'setFillColor,#D3D3D3', 'rect,90,31,90,20,F',
                    'text,Count: 2,90,41,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,51,180,51',
                    'setFillColor,#D3D3D3', 'rect,180,31,80,20,F',
                    'setLineWidth,1', 'line,180,31,260,31', 'line,180,51,260,51',
                    'setFillColor,#D3D3D3', 'rect,260,31,90,20,F',
                    'setLineWidth,1', 'line,260,31,350,31', 'line,350,31,350,51', 'line,260,51,350,51',
                    'setFillColor,#D3D3D3', 'rect,20,51,70,20,F',
                    'text,F2: f2,20,61,{baseline:middle}', 'setLineWidth,1', 'line,20,51,90,51', 'line,20,51,20,71', 'line,20,71,90,71',
                    'setFillColor,#D3D3D3', 'rect,90,51,90,20,F',
                    'text,Count: 2,90,61,{baseline:middle}', 'setLineWidth,1', 'line,90,51,180,51', 'line,90,71,180,71',
                    'setFillColor,#D3D3D3', 'rect,180,51,80,20,F',
                    'setLineWidth,1', 'line,180,51,260,51', 'line,180,71,260,71',
                    'setFillColor,#D3D3D3', 'rect,260,51,90,20,F',
                    'setLineWidth,1', 'line,260,51,350,51', 'line,350,51,350,71', 'line,260,71,350,71',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,60,24',
                    'text,f1_4,90,83,{baseline:middle}', 'setLineWidth,1', 'rect,90,71,90,24',
                    'text,f1_5,180,83,{baseline:middle}', 'setLineWidth,1', 'rect,180,71,80,24',
                    'text,f1_6,260,83,{baseline:middle}', 'setLineWidth,1', 'rect,260,71,90,24',
                    'text,f2_3,30,113,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,60,36',
                    'text,f2_4,90,113,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,36',
                    'text,f2_5,180,113,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,80,36',
                    'text,f2_6,260,113,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,90,36'
                ];

                exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 430, h: 60 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], groupItems: [f4], alignByColumn: true', function(assert) {
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
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    if(e.rowCells[0].text === 'F3') {
                        e.rowHeight = 16;
                    } else if(e.rowCells[0].text === 'F1: f1') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'F2: f1_2') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'F2: f2_2') {
                        e.rowHeight = 20;
                    } else if(e.rowCells[0].text === 'f1_3') {
                        e.rowHeight = 24;
                    } else if(e.rowCells[0].text === 'f2_3') {
                        e.rowHeight = 36;
                    }
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'setFillColor,#D3D3D3', 'rect,10,31,80,20,F',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,51', 'line,10,51,90,51',
                    'setFillColor,#D3D3D3', 'rect,90,31,90,20,F',
                    'text,Count: 2,90,41,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,51,180,51',
                    'setFillColor,#D3D3D3', 'rect,180,31,80,20,F',
                    'setLineWidth,1', 'line,180,31,260,31', 'line,180,51,260,51',
                    'setFillColor,#D3D3D3', 'rect,260,31,90,20,F',
                    'setLineWidth,1', 'line,260,31,350,31', 'line,350,31,350,51', 'line,260,51,350,51',
                    'setFillColor,#D3D3D3', 'rect,20,51,70,20,F',
                    'text,F2: f1_2,20,61,{baseline:middle}', 'setLineWidth,1', 'line,20,51,90,51', 'line,20,51,20,71', 'line,20,71,90,71',
                    'setFillColor,#D3D3D3', 'rect,90,51,90,20,F',
                    'text,Count: 1,90,61,{baseline:middle}', 'setLineWidth,1', 'line,90,51,180,51', 'line,90,71,180,71',
                    'setFillColor,#D3D3D3', 'rect,180,51,80,20,F',
                    'setLineWidth,1', 'line,180,51,260,51', 'line,180,71,260,71',
                    'setFillColor,#D3D3D3', 'rect,260,51,90,20,F',
                    'setLineWidth,1', 'line,260,51,350,51', 'line,350,51,350,71', 'line,260,71,350,71',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,60,24',
                    'text,f1_4,90,83,{baseline:middle}', 'setLineWidth,1', 'rect,90,71,90,24',
                    'text,f1_5,180,83,{baseline:middle}', 'setLineWidth,1', 'rect,180,71,80,24',
                    'text,f1_6,260,83,{baseline:middle}', 'setLineWidth,1', 'rect,260,71,90,24',
                    'setFillColor,#D3D3D3', 'rect,20,95,70,20,F',
                    'text,F2: f2_2,20,105,{baseline:middle}', 'setLineWidth,1', 'line,20,95,90,95', 'line,20,95,20,115', 'line,20,115,90,115',
                    'setFillColor,#D3D3D3', 'rect,90,95,90,20,F',
                    'text,Count: 1,90,105,{baseline:middle}', 'setLineWidth,1', 'line,90,95,180,95', 'line,90,115,180,115',
                    'setFillColor,#D3D3D3', 'rect,180,95,80,20,F',
                    'setLineWidth,1', 'line,180,95,260,95', 'line,180,115,260,115',
                    'setFillColor,#D3D3D3', 'rect,260,95,90,20,F',
                    'setLineWidth,1', 'line,260,95,350,95', 'line,350,95,350,115', 'line,260,115,350,115',
                    'text,f2_3,30,133,{baseline:middle}', 'setLineWidth,1', 'rect,30,115,60,36',
                    'text,f2_4,90,133,{baseline:middle}', 'setLineWidth,1', 'rect,90,115,90,36',
                    'text,f2_5,180,133,{baseline:middle}', 'setLineWidth,1', 'rect,180,115,80,36',
                    'text,f2_6,260,133,{baseline:middle}', 'setLineWidth,1', 'rect,260,115,90,36'
                ];

                exportDataGrid(doc, dataGrid, { rect: { x: 10, y: 15, w: 430, h: 60 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfGroupingTests };
