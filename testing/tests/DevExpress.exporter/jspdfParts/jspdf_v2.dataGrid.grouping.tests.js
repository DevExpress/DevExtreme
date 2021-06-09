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
        });

    }
};

export { JSPdfGroupingTests };
