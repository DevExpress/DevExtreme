import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,20',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,f2_2,20,90,{baseline:middle}', 'setLineWidth,1', 'rect,20,75,80,30',
                    'text,f2_3,100,90,{baseline:middle}', 'setLineWidth,1', 'rect,100,75,80,30'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,18.4',
                    'text,F3,100,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,18.4',
                    'text,F1: f1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'text,f1_2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,80,18.4',
                    'text,f1_3,100,61,{baseline:middle}', 'setLineWidth,1', 'rect,100,51.8,80,18.4',
                    'text,f2_2,20,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,20,70.2,80,18.4',
                    'text,f2_3,100,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,100,70.2,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1 111111111 111111111 111 1', f2: 'f1_2 11111 11 111', f3: 'f1_3 111111111111 11111111 11111111 11111111 1111111 11111' },
                        { f1: 'f1 222222222 2222222222 22222222 22222', f2: 'f2_2 22222 222 222', f3: 'f2_3 333333 33333 3' },
                    ],
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'text,F3,100,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'text,F1: f1 111111111,111111111 111 1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,36.8',
                    'text,f1_2 11111,11 111,20,125.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,70.2,80,128.8',
                    'text,f1_3 11111,1111111,11111111,11111111,11111111,1111111,11111,100,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,70.2,80,128.8',
                    'text,F1: f1 222222222,2222222222 22222222,22222,10,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,199,170,55.2',
                    'text,f2_2 22222,222 222,20,272.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,254.2,80,55.2',
                    'text,f2_3,333333,33333 3,100,263.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,254.2,80,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F1: f1_1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,20',
                    'text,f1_2,20,63,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,80,24',
                    'text,f1_3,100,63,{baseline:middle}', 'setLineWidth,1', 'rect,100,51,80,24',
                    'text,F1: f2_1,10,85,{baseline:middle}', 'setLineWidth,1', 'rect,10,75,170,20',
                    'text,f2_2,20,107,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,80,24',
                    'text,f2_3,100,107,{baseline:middle}', 'setLineWidth,1', 'rect,100,95,80,24'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,18.4',
                    'text,F3,100,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,18.4',
                    'text,F1: f1_1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'text,f1_2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,80,18.4',
                    'text,f1_3,100,61,{baseline:middle}', 'setLineWidth,1', 'rect,100,51.8,80,18.4',
                    'text,F1: f2_1,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,170,18.4',
                    'text,f2_2,20,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,20,88.6,80,18.4',
                    'text,f2_3,100,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,100,88.6,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: 'f1_1 11 11111111 11111 111111 111', f2: 'f1_2 1111111 111111 111 1111111 111111 111111 111111', f3: 'f1_3 1111 11111 1' },
                        { f1: 'f2_1 2222222 22222222 2222222 2222222222 222222 2222', f2: 'f2_2 2222 222 22222222', f3: 'f2_3' },
                    ],
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'text,F3,100,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'text,F1: f1_1 11 11111111,11111 111111 111,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,36.8',
                    'text,f1_2,1111111,111111,111,1111111,111111,111111,111111,20,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,70.2,80,147.2',
                    'text,f1_3 1111,11111 1,100,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,70.2,80,147.2',
                    'text,F1: f2_1 2222222,22222222 2222222,2222222222 222222,2222,10,226.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,217.4,170,73.6',
                    'text,f2_2 2222,222,22222222,20,300.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,291,80,55.2',
                    'text,f2_3,100,318.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,291,80,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F4,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,20',
                    'text,F2: f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,160,20',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,70,24',
                    'text,f1_4,100,83,{baseline:middle}', 'setLineWidth,1', 'rect,100,71,80,24',
                    'text,f2_3,30,110,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,70,30',
                    'text,f2_4,100,110,{baseline:middle}', 'setLineWidth,1', 'rect,100,95,80,30'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,18.4',
                    'text,F4,100,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,18.4',
                    'text,F1: f1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'text,F2: f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,160,18.4',
                    'text,f1_3,30,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,30,70.2,70,18.4',
                    'text,f1_4,100,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,100,70.2,80,18.4',
                    'text,f2_3,30,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,30,88.6,70,18.4',
                    'text,f2_4,100,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,100,88.6,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                    ],
                    dataSource: [
                        { f1: 'f1 111 11111 111111 1111111 1111111 11111 1111 111 111', f2: 'f2 11 11111111 11111 11111 111 1', f3: 'f1_3 1111 1111', f4: 'f1_4 111111111 11111 111111 1111111 1111111 1' },
                        { f1: 'f1 2222 22 22', f2: 'f2 22222 222222222 222  22222 2222 2222222', f3: 'f2_3 22222 22222 2222222 22222222', f4: 'f2_4 222222 22222222 222222222' },
                    ],
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'text,F4,100,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'text,F1: f1 111 11111,111111 1111111,1111111 11111 1111,111 111,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,73.6',
                    'text,F2: f2 11 11111111,11111 11111 111 1,20,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,107,160,36.8',
                    'text,f1_3,1111,1111,30,180.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,143.8,70,110.4',
                    'text,f1_4,111111111,11111,111111,1111111,1111111 1,100,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,143.8,80,110.4',
                    'text,F1: f1 2222 22 22,10,263.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,254.2,170,18.4',
                    'text,F2: f2 22222,222222222 222 ,22222 2222 2222222,20,281.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,272.6,160,55.2',
                    'text,f2_3,22222,22222,2222222 ,2222222,2,30,337,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,327.8,70,110.4',
                    'text,f2_4,222222,22222222,222222222,100,355.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,327.8,80,110.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'text,F4,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,F1: f1,10,41,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,20',
                    'text,F2: f1_2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51,160,20',
                    'text,f1_3,30,83,{baseline:middle}', 'setLineWidth,1', 'rect,30,71,70,24',
                    'text,f1_4,100,83,{baseline:middle}', 'setLineWidth,1', 'rect,100,71,80,24',
                    'text,F2: f2_2,20,105,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,160,20',
                    'text,f2_3,30,127,{baseline:middle}', 'setLineWidth,1', 'rect,30,115,70,24',
                    'text,f2_4,100,127,{baseline:middle}', 'setLineWidth,1', 'rect,100,115,80,24'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,18.4',
                    'text,F4,100,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,18.4',
                    'text,F1: f1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'text,F2: f1_2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,160,18.4',
                    'text,f1_3,30,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,30,70.2,70,18.4',
                    'text,f1_4,100,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,100,70.2,80,18.4',
                    'text,F2: f2_2,20,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,20,88.6,160,18.4',
                    'text,f2_3,30,116.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,107,70,18.4',
                    'text,f2_4,100,116.2,{baseline:middle}', 'setLineWidth,1', 'rect,100,107,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                    ],
                    dataSource: [
                        { f1: 'f1 1111 11111 1 1111111 1111111 111111111', f2: 'f1_2 11111111 1111', f3: 'f1_3 111 11', f4: 'f1_4' },
                        { f1: 'f1 2222', f2: 'f2_2 22222222 2222222 222222222 222222 22222222 22', f3: 'f2_3 22222 2222 22222 222222', f4: 'f2_4' },
                    ],
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,90,18.4',
                    'text,F4,100,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,15,80,18.4',
                    'text,F1: f1 1111 11111 1,1111111 1111111,111111111,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,55.2',
                    'text,F2: f1_2 11111111,1111,20,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,88.6,160,36.8',
                    'text,f1_3 111,11,30,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,125.4,70,36.8',
                    'text,f1_4,100,143.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,125.4,80,36.8',
                    'text,F1: f1 2222,10,171.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,162.2,170,18.4',
                    'text,F2: f2_2 22222222,2222222 222222222,222222 22222222 22,20,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,180.6,160,55.2',
                    'text,f2_3,22222,2222,22222,222222,30,245,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,235.8,70,92',
                    'text,f2_4,100,281.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,100,235.8,80,92'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

    }
};

export { JSPdfGroupingTests };
