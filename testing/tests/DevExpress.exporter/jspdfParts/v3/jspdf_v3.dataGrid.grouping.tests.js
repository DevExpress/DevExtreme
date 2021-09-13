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
                    'text,F2,10,23,{baseline:middle}',
                    'text,F3,100,23,{baseline:middle}',
                    'text,F1: f1,10,41,{baseline:middle}',
                    'text,f1_2,20,63,{baseline:middle}',
                    'text,f1_3,100,63,{baseline:middle}',
                    'text,f2_2,20,90,{baseline:middle}',
                    'text,f2_3,100,90,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,16',
                    'setLineWidth,1',
                    'rect,100,15,80,16',
                    'setLineWidth,1',
                    'line,10,31,100,31',
                    'line,10,31,10,51',
                    'line,10,51,100,51',
                    'setLineWidth,1',
                    'line,100,31,180,31',
                    'line,180,31,180,51',
                    'line,100,51,180,51',
                    'setLineWidth,1',
                    'rect,20,51,80,24',
                    'setLineWidth,1',
                    'rect,100,51,80,24',
                    'setLineWidth,1',
                    'rect,20,75,80,30',
                    'setLineWidth,1',
                    'rect,100,75,80,30'
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
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,100,24.2,{baseline:middle}',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f1_3,100,61,{baseline:middle}',
                    'text,f2_2,20,79.4,{baseline:middle}',
                    'text,f2_3,100,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,100,33.4',
                    'line,10,33.4,10,51.8',
                    'line,10,51.8,100,51.8',
                    'setLineWidth,1',
                    'line,100,33.4,180,33.4',
                    'line,180,33.4,180,51.8',
                    'line,100,51.8,180,51.8',
                    'setLineWidth,1',
                    'rect,20,51.8,80,18.4',
                    'setLineWidth,1',
                    'rect,100,51.8,80,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,80,18.4',
                    'setLineWidth,1',
                    'rect,100,70.2,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    'text,F2,10,23,{baseline:middle}',
                    'text,F3,100,23,{baseline:middle}',
                    'text,F1: f1_1,10,41,{baseline:middle}',
                    'text,f1_2,20,63,{baseline:middle}',
                    'text,f1_3,100,63,{baseline:middle}',
                    'text,F1: f2_1,10,85,{baseline:middle}',
                    'text,f2_2,20,107,{baseline:middle}',
                    'text,f2_3,100,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,16',
                    'setLineWidth,1',
                    'rect,100,15,80,16',
                    'setLineWidth,1',
                    'line,10,31,100,31',
                    'line,10,31,10,51',
                    'line,10,51,100,51',
                    'setLineWidth,1',
                    'line,100,31,180,31',
                    'line,180,31,180,51',
                    'line,100,51,180,51',
                    'setLineWidth,1',
                    'rect,20,51,80,24',
                    'setLineWidth,1',
                    'rect,100,51,80,24',
                    'setLineWidth,1',
                    'line,10,75,100,75',
                    'line,10,75,10,95',
                    'line,10,95,100,95',
                    'setLineWidth,1',
                    'line,100,75,180,75',
                    'line,180,75,180,95',
                    'line,100,95,180,95',
                    'setLineWidth,1',
                    'rect,20,95,80,24',
                    'setLineWidth,1',
                    'rect,100,95,80,24'
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
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,100,24.2,{baseline:middle}',
                    'text,F1: f1_1,10,42.6,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f1_3,100,61,{baseline:middle}',
                    'text,F1: f2_1,10,79.4,{baseline:middle}',
                    'text,f2_2,20,97.8,{baseline:middle}',
                    'text,f2_3,100,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,100,33.4',
                    'line,10,33.4,10,51.8',
                    'line,10,51.8,100,51.8',
                    'setLineWidth,1',
                    'line,100,33.4,180,33.4',
                    'line,180,33.4,180,51.8',
                    'line,100,51.8,180,51.8',
                    'setLineWidth,1',
                    'rect,20,51.8,80,18.4',
                    'setLineWidth,1',
                    'rect,100,51.8,80,18.4',
                    'setLineWidth,1',
                    'line,10,70.2,100,70.2',
                    'line,10,70.2,10,88.6',
                    'line,10,88.6,100,88.6',
                    'setLineWidth,1',
                    'line,100,70.2,180,70.2',
                    'line,180,70.2,180,88.6',
                    'line,100,88.6,180,88.6',
                    'setLineWidth,1',
                    'rect,20,88.6,80,18.4',
                    'setLineWidth,1',
                    'rect,100,88.6,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    'text,F3,10,23,{baseline:middle}',
                    'text,F4,100,23,{baseline:middle}',
                    'text,F1: f1,10,41,{baseline:middle}',
                    'text,F2: f2,20,61,{baseline:middle}',
                    'text,f1_3,30,83,{baseline:middle}',
                    'text,f1_4,100,83,{baseline:middle}',
                    'text,f2_3,30,110,{baseline:middle}',
                    'text,f2_4,100,110,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,16',
                    'setLineWidth,1',
                    'rect,100,15,80,16',
                    'setLineWidth,1',
                    'line,10,31,100,31',
                    'line,10,31,10,51',
                    'line,10,51,100,51',
                    'setLineWidth,1',
                    'line,100,31,180,31',
                    'line,180,31,180,51',
                    'line,100,51,180,51',
                    'setLineWidth,1',
                    'line,20,51,100,51',
                    'line,20,51,20,71',
                    'line,20,71,100,71',
                    'setLineWidth,1',
                    'line,100,51,180,51',
                    'line,180,51,180,71',
                    'line,100,71,180,71',
                    'setLineWidth,1',
                    'rect,30,71,70,24',
                    'setLineWidth,1',
                    'rect,100,71,80,24',
                    'setLineWidth,1',
                    'rect,30,95,70,30',
                    'setLineWidth,1',
                    'rect,100,95,80,30'
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
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,100,24.2,{baseline:middle}',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'text,F2: f2,20,61,{baseline:middle}',
                    'text,f1_3,30,79.4,{baseline:middle}',
                    'text,f1_4,100,79.4,{baseline:middle}',
                    'text,f2_3,30,97.8,{baseline:middle}',
                    'text,f2_4,100,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,100,33.4',
                    'line,10,33.4,10,51.8',
                    'line,10,51.8,100,51.8',
                    'setLineWidth,1',
                    'line,100,33.4,180,33.4',
                    'line,180,33.4,180,51.8',
                    'line,100,51.8,180,51.8',
                    'setLineWidth,1',
                    'line,20,51.8,100,51.8',
                    'line,20,51.8,20,70.2',
                    'line,20,70.2,100,70.2',
                    'setLineWidth,1',
                    'line,100,51.8,180,51.8',
                    'line,180,51.8,180,70.2',
                    'line,100,70.2,180,70.2',
                    'setLineWidth,1',
                    'rect,30,70.2,70,18.4',
                    'setLineWidth,1',
                    'rect,100,70.2,80,18.4',
                    'setLineWidth,1',
                    'rect,30,88.6,70,18.4',
                    'setLineWidth,1',
                    'rect,100,88.6,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    'text,F3,10,23,{baseline:middle}',
                    'text,F4,100,23,{baseline:middle}',
                    'text,F1: f1,10,41,{baseline:middle}',
                    'text,F2: f1_2,20,61,{baseline:middle}',
                    'text,f1_3,30,83,{baseline:middle}',
                    'text,f1_4,100,83,{baseline:middle}',
                    'text,F2: f2_2,20,105,{baseline:middle}',
                    'text,f2_3,30,127,{baseline:middle}',
                    'text,f2_4,100,127,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,16',
                    'setLineWidth,1',
                    'rect,100,15,80,16',
                    'setLineWidth,1',
                    'line,10,31,100,31',
                    'line,10,31,10,51',
                    'line,10,51,100,51',
                    'setLineWidth,1',
                    'line,100,31,180,31',
                    'line,180,31,180,51',
                    'line,100,51,180,51',
                    'setLineWidth,1',
                    'line,20,51,100,51',
                    'line,20,51,20,71',
                    'line,20,71,100,71',
                    'setLineWidth,1',
                    'line,100,51,180,51',
                    'line,180,51,180,71',
                    'line,100,71,180,71',
                    'setLineWidth,1',
                    'rect,30,71,70,24',
                    'setLineWidth,1',
                    'rect,100,71,80,24',
                    'setLineWidth,1',
                    'line,20,95,100,95',
                    'line,20,95,20,115',
                    'line,20,115,100,115',
                    'setLineWidth,1',
                    'line,100,95,180,95',
                    'line,180,95,180,115',
                    'line,100,115,180,115',
                    'setLineWidth,1',
                    'rect,30,115,70,24',
                    'setLineWidth,1',
                    'rect,100,115,80,24'
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
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,100,24.2,{baseline:middle}',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'text,F2: f1_2,20,61,{baseline:middle}',
                    'text,f1_3,30,79.4,{baseline:middle}',
                    'text,f1_4,100,79.4,{baseline:middle}',
                    'text,F2: f2_2,20,97.8,{baseline:middle}',
                    'text,f2_3,30,116.2,{baseline:middle}',
                    'text,f2_4,100,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,100,33.4',
                    'line,10,33.4,10,51.8',
                    'line,10,51.8,100,51.8',
                    'setLineWidth,1',
                    'line,100,33.4,180,33.4',
                    'line,180,33.4,180,51.8',
                    'line,100,51.8,180,51.8',
                    'setLineWidth,1',
                    'line,20,51.8,100,51.8',
                    'line,20,51.8,20,70.2',
                    'line,20,70.2,100,70.2',
                    'setLineWidth,1',
                    'line,100,51.8,180,51.8',
                    'line,180,51.8,180,70.2',
                    'line,100,70.2,180,70.2',
                    'setLineWidth,1',
                    'rect,30,70.2,70,18.4',
                    'setLineWidth,1',
                    'rect,100,70.2,80,18.4',
                    'setLineWidth,1',
                    'line,20,88.6,100,88.6',
                    'line,20,88.6,20,107',
                    'line,20,107,100,107',
                    'setLineWidth,1',
                    'line,100,88.6,180,88.6',
                    'line,180,88.6,180,107',
                    'line,100,107,180,107',
                    'setLineWidth,1',
                    'rect,30,107,70,18.4',
                    'setLineWidth,1',
                    'rect,100,107,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

    }
};

export { JSPdfGroupingTests };
