import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

const JSPdfSummariesTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        QUnit.module('Grouped rows with summaries', moduleConfig, () => {
            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5], groupItems: [f3]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f3', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F1: f1 (Count: 2),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,16',
                    'text,f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,80,16',
                    'text,f1_3,100,55,{baseline:middle}', 'setLineWidth,1', 'rect,100,47,80,16',
                    'text,f1_4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,90,16',
                    'text,f1_5,270,55,{baseline:middle}', 'setLineWidth,1', 'rect,270,47,80,16',
                    'text,f2_2,20,71,{baseline:middle}', 'setLineWidth,1', 'rect,20,63,80,16',
                    'text,f2_3,100,71,{baseline:middle}', 'setLineWidth,1', 'rect,100,63,80,16',
                    'text,f2_4,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,90,16',
                    'text,f2_5,270,71,{baseline:middle}', 'setLineWidth,1', 'rect,270,63,80,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5], groupItems: [f3], alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f3', summaryType: 'count', alignByColumn: true }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,100,31', 'line,10,31,10,47', 'line,10,47,100,47',
                    'text,Count: 2,100,39,{baseline:middle}', 'setLineWidth,1', 'line,100,31,180,31', 'line,100,47,180,47',
                    'setLineWidth,1', 'line,180,31,270,31', 'line,180,47,270,47',
                    'setLineWidth,1', 'line,270,31,350,31', 'line,350,31,350,47', 'line,270,47,350,47',
                    'text,f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,80,16',
                    'text,f1_3,100,55,{baseline:middle}', 'setLineWidth,1', 'rect,100,47,80,16',
                    'text,f1_4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,90,16',
                    'text,f1_5,270,55,{baseline:middle}', 'setLineWidth,1', 'rect,270,47,80,16',
                    'text,f2_2,20,71,{baseline:middle}', 'setLineWidth,1', 'rect,20,63,80,16',
                    'text,f2_3,100,71,{baseline:middle}', 'setLineWidth,1', 'rect,100,63,80,16',
                    'text,f2_4,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,90,16',
                    'text,f2_5,270,71,{baseline:middle}', 'setLineWidth,1', 'rect,270,63,80,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5], groupItems: [f4], alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,47', 'line,10,47,180,47',
                    'text,Count: 2,180,39,{baseline:middle}', 'setLineWidth,1', 'line,180,31,270,31', 'line,180,47,270,47',
                    'setLineWidth,1', 'line,270,31,350,31', 'line,350,31,350,47', 'line,270,47,350,47',
                    'text,f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,80,16',
                    'text,f1_3,100,55,{baseline:middle}', 'setLineWidth,1', 'rect,100,47,80,16',
                    'text,f1_4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,90,16',
                    'text,f1_5,270,55,{baseline:middle}', 'setLineWidth,1', 'rect,270,47,80,16',
                    'text,f2_2,20,71,{baseline:middle}', 'setLineWidth,1', 'rect,20,63,80,16',
                    'text,f2_3,100,71,{baseline:middle}', 'setLineWidth,1', 'rect,100,63,80,16',
                    'text,f2_4,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,90,16',
                    'text,f2_5,270,71,{baseline:middle}', 'setLineWidth,1', 'rect,270,63,80,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 groups - [{f1, groupIndex: 0}, f2, f3, f4, f5], groupItems: [f3]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f3', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F1: f1_1 (Count: 1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,16',
                    'text,f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,80,16',
                    'text,f1_3,100,55,{baseline:middle}', 'setLineWidth,1', 'rect,100,47,80,16',
                    'text,f1_4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,90,16',
                    'text,f1_5,270,55,{baseline:middle}', 'setLineWidth,1', 'rect,270,47,80,16',
                    'text,F1: f2_1 (Count: 1),10,71,{baseline:middle}', 'setLineWidth,1', 'rect,10,63,340,16',
                    'text,f2_2,20,87,{baseline:middle}', 'setLineWidth,1', 'rect,20,79,80,16',
                    'text,f2_3,100,87,{baseline:middle}', 'setLineWidth,1', 'rect,100,79,80,16',
                    'text,f2_4,180,87,{baseline:middle}', 'setLineWidth,1', 'rect,180,79,90,16',
                    'text,f2_5,270,87,{baseline:middle}', 'setLineWidth,1', 'rect,270,79,80,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 groups - [{f1, groupIndex: 0}, f2, f3, f4, f5], groupItems: [f3], alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f3', summaryType: 'count', alignByColumn: true }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F1: f1_1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,100,31', 'line,10,31,10,47', 'line,10,47,100,47',
                    'text,Count: 1,100,39,{baseline:middle}', 'setLineWidth,1', 'line,100,31,180,31', 'line,100,47,180,47',
                    'setLineWidth,1', 'line,180,31,270,31', 'line,180,47,270,47',
                    'setLineWidth,1', 'line,270,31,350,31', 'line,350,31,350,47', 'line,270,47,350,47',
                    'text,f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,80,16',
                    'text,f1_3,100,55,{baseline:middle}', 'setLineWidth,1', 'rect,100,47,80,16',
                    'text,f1_4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,90,16',
                    'text,f1_5,270,55,{baseline:middle}', 'setLineWidth,1', 'rect,270,47,80,16',
                    'text,F1: f2_1,10,71,{baseline:middle}', 'setLineWidth,1', 'line,10,63,100,63', 'line,10,63,10,79', 'line,10,79,100,79',
                    'text,Count: 1,100,71,{baseline:middle}', 'setLineWidth,1', 'line,100,63,180,63', 'line,100,79,180,79',
                    'setLineWidth,1', 'line,180,63,270,63', 'line,180,79,270,79',
                    'setLineWidth,1', 'line,270,63,350,63', 'line,350,63,350,79', 'line,270,79,350,79',
                    'text,f2_2,20,87,{baseline:middle}', 'setLineWidth,1', 'rect,20,79,80,16',
                    'text,f2_3,100,87,{baseline:middle}', 'setLineWidth,1', 'rect,100,79,80,16',
                    'text,f2_4,180,87,{baseline:middle}', 'setLineWidth,1', 'rect,180,79,90,16',
                    'text,f2_5,270,87,{baseline:middle}', 'setLineWidth,1', 'rect,270,79,80,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 groups - [{f1, groupIndex: 0}, f2, f3, f4, f5], groupItems: [f4], alignByColumn: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    summary: {
                        groupItems: [
                            { column: 'f4', summaryType: 'count', alignByColumn: true }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,90,16',
                    'text,F5,270,23,{baseline:middle}', 'setLineWidth,1', 'rect,270,15,80,16',
                    'text,F1: f1_1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,47', 'line,10,47,180,47',
                    'text,Count: 1,180,39,{baseline:middle}', 'setLineWidth,1', 'line,180,31,270,31', 'line,180,47,270,47',
                    'setLineWidth,1', 'line,270,31,350,31', 'line,350,31,350,47', 'line,270,47,350,47',
                    'text,f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,80,16',
                    'text,f1_3,100,55,{baseline:middle}', 'setLineWidth,1', 'rect,100,47,80,16',
                    'text,f1_4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,90,16',
                    'text,f1_5,270,55,{baseline:middle}', 'setLineWidth,1', 'rect,270,47,80,16',
                    'text,F1: f2_1,10,71,{baseline:middle}', 'setLineWidth,1', 'line,10,63,180,63', 'line,10,63,10,79', 'line,10,79,180,79',
                    'text,Count: 1,180,71,{baseline:middle}', 'setLineWidth,1', 'line,180,63,270,63', 'line,180,79,270,79',
                    'setLineWidth,1', 'line,270,63,350,63', 'line,350,63,350,79', 'line,270,79,350,79',
                    'text,f2_2,20,87,{baseline:middle}', 'setLineWidth,1', 'rect,20,79,80,16',
                    'text,f2_3,100,87,{baseline:middle}', 'setLineWidth,1', 'rect,100,79,80,16',
                    'text,f2_4,180,87,{baseline:middle}', 'setLineWidth,1', 'rect,180,79,90,16',
                    'text,f2_5,270,87,{baseline:middle}', 'setLineWidth,1', 'rect,270,79,80,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 0}, f3, f4, f5, f6], groupItems: [f4]', function(assert) {
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
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1 (Count: 2),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,16',
                    'text,F2: f2 (Count: 2),20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,330,16',
                    'text,f1_3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f1_4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,f1_5,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16',
                    'text,f1_6,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,90,16',
                    'text,f2_3,30,87,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,60,16',
                    'text,f2_4,90,87,{baseline:middle}', 'setLineWidth,1', 'rect,90,79,90,16',
                    'text,f2_5,180,87,{baseline:middle}', 'setLineWidth,1', 'rect,180,79,80,16',
                    'text,f2_6,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,90,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
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
                            { column: 'f4', summaryType: 'count', alignByColumn: true }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,47', 'line,10,47,90,47',
                    'text,Count: 2,90,39,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,47,180,47',
                    'setLineWidth,1', 'line,180,31,260,31', 'line,180,47,260,47',
                    'setLineWidth,1', 'line,260,31,350,31', 'line,350,31,350,47', 'line,260,47,350,47',
                    'text,F2: f2,20,55,{baseline:middle}', 'setLineWidth,1', 'line,20,47,90,47', 'line,20,47,20,63', 'line,20,63,90,63',
                    'text,Count: 2,90,55,{baseline:middle}', 'setLineWidth,1', 'line,90,47,180,47', 'line,90,63,180,63',
                    'setLineWidth,1', 'line,180,47,260,47', 'line,180,63,260,63',
                    'setLineWidth,1', 'line,260,47,350,47', 'line,350,47,350,63', 'line,260,63,350,63',
                    'text,f1_3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f1_4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,f1_5,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16',
                    'text,f1_6,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,90,16',
                    'text,f2_3,30,87,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,60,16',
                    'text,f2_4,90,87,{baseline:middle}', 'setLineWidth,1', 'rect,90,79,90,16',
                    'text,f2_5,180,87,{baseline:middle}', 'setLineWidth,1', 'rect,180,79,80,16',
                    'text,f2_6,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,90,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], groupItems: [f5], alignByColumn: true', function(assert) {
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
                            { column: 'f5', summaryType: 'count', alignByColumn: true }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,47', 'line,10,47,180,47',
                    'text,Count: 2,180,39,{baseline:middle}', 'setLineWidth,1', 'line,180,31,260,31', 'line,180,47,260,47',
                    'setLineWidth,1', 'line,260,31,350,31', 'line,350,31,350,47', 'line,260,47,350,47',
                    'text,F2: f2,20,55,{baseline:middle}', 'setLineWidth,1', 'line,20,47,180,47', 'line,20,47,20,63', 'line,20,63,180,63',
                    'text,Count: 2,180,55,{baseline:middle}', 'setLineWidth,1', 'line,180,47,260,47', 'line,180,63,260,63',
                    'setLineWidth,1', 'line,260,47,350,47', 'line,350,47,350,63', 'line,260,63,350,63',
                    'text,f1_3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f1_4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,f1_5,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16',
                    'text,f1_6,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,90,16',
                    'text,f2_3,30,87,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,60,16',
                    'text,f2_4,90,87,{baseline:middle}', 'setLineWidth,1', 'rect,90,79,90,16',
                    'text,f2_5,180,87,{baseline:middle}', 'setLineWidth,1', 'rect,180,79,80,16',
                    'text,f2_6,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,90,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 0}, f3, f4, f5, f6], groupItems: [f4]', function(assert) {
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
                            { column: 'f4', summaryType: 'count' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1 (Count: 2),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,340,16',
                    'text,F2: f1_2 (Count: 1),20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,330,16',
                    'text,f1_3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f1_4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,f1_5,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16',
                    'text,f1_6,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,90,16',
                    'text,F2: f2_2 (Count: 1),20,87,{baseline:middle}', 'setLineWidth,1', 'rect,20,79,330,16',
                    'text,f2_3,30,103,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,60,16',
                    'text,f2_4,90,103,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,16',
                    'text,f2_5,180,103,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,80,16',
                    'text,f2_6,260,103,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,90,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
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
                            { column: 'f4', summaryType: 'count', alignByColumn: true }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,47', 'line,10,47,90,47',
                    'text,Count: 2,90,39,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,47,180,47',
                    'setLineWidth,1', 'line,180,31,260,31', 'line,180,47,260,47',
                    'setLineWidth,1', 'line,260,31,350,31', 'line,350,31,350,47', 'line,260,47,350,47',
                    'text,F2: f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'line,20,47,90,47', 'line,20,47,20,63', 'line,20,63,90,63',
                    'text,Count: 1,90,55,{baseline:middle}', 'setLineWidth,1', 'line,90,47,180,47', 'line,90,63,180,63',
                    'setLineWidth,1', 'line,180,47,260,47', 'line,180,63,260,63',
                    'setLineWidth,1', 'line,260,47,350,47', 'line,350,47,350,63', 'line,260,63,350,63',
                    'text,f1_3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f1_4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,f1_5,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16',
                    'text,f1_6,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,90,16',
                    'text,F2: f2_2,20,87,{baseline:middle}', 'setLineWidth,1', 'line,20,79,90,79', 'line,20,79,20,95', 'line,20,95,90,95',
                    'text,Count: 1,90,87,{baseline:middle}', 'setLineWidth,1', 'line,90,79,180,79', 'line,90,95,180,95',
                    'setLineWidth,1', 'line,180,79,260,79', 'line,180,95,260,95',
                    'setLineWidth,1', 'line,260,79,350,79', 'line,350,79,350,95', 'line,260,95,350,95',
                    'text,f2_3,30,103,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,60,16',
                    'text,f2_4,90,103,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,16',
                    'text,f2_5,180,103,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,80,16',
                    'text,f2_6,260,103,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,90,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], groupItems: [f5], alignByColumn: true', function(assert) {
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
                            { column: 'f5', summaryType: 'count', alignByColumn: true }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const onRowExporting = (e) => {
                    e.rowHeight = 16;
                };

                const expectedLog = [
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F5,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F6,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,47', 'line,10,47,180,47',
                    'text,Count: 2,180,39,{baseline:middle}', 'setLineWidth,1', 'line,180,31,260,31', 'line,180,47,260,47',
                    'setLineWidth,1', 'line,260,31,350,31', 'line,350,31,350,47', 'line,260,47,350,47',
                    'text,F2: f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'line,20,47,180,47', 'line,20,47,20,63', 'line,20,63,180,63',
                    'text,Count: 1,180,55,{baseline:middle}', 'setLineWidth,1', 'line,180,47,260,47', 'line,180,63,260,63',
                    'setLineWidth,1', 'line,260,47,350,47', 'line,350,47,350,63', 'line,260,63,350,63',
                    'text,f1_3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f1_4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,f1_5,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16',
                    'text,f1_6,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,90,16',
                    'text,F2: f2_2,20,87,{baseline:middle}', 'setLineWidth,1', 'line,20,79,180,79', 'line,20,79,20,95', 'line,20,95,180,95',
                    'text,Count: 1,180,87,{baseline:middle}', 'setLineWidth,1', 'line,180,79,260,79', 'line,180,95,260,95',
                    'setLineWidth,1', 'line,260,79,350,79', 'line,350,79,350,95', 'line,260,95,350,95',
                    'text,f2_3,30,103,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,60,16',
                    'text,f2_4,90,103,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,16',
                    'text,f2_5,180,103,{baseline:middle}', 'setLineWidth,1', 'rect,180,95,80,16',
                    'text,f2_6,260,103,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,90,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

    }
};

export { JSPdfSummariesTests };
