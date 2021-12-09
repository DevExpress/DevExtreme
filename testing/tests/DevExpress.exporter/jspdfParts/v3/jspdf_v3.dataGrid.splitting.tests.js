import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfSplittingTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        QUnit.module('Splitting - Simple table', moduleConfig, () => {
            QUnit.test('1 cols - 1 rows, columnWidth = 200, horizontalSplitWidth = 600', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }]
                });

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], horizontalSplitWidth: 600 }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 1 rows, columnWidth = 200, horizontalSplitWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1' }]
                });

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'addPage,',
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,v2_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ], horizontalSplitWidth: 300 }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 1 rows, columnWidth = 200, horizontalSplitWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }]
                });

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'addPage,',
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,v2_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'addPage,',
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,v3_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], horizontalSplitWidth: 300 }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 1 rows, cells[1,0] & [1,1] - no right border, columnWidth = 200, horizontalSplitWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'v1_1' || pdfCell.text === 'v2_1') {
                        pdfCell.drawRightBorder = false;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,210,33.4',
                    'line,10,33.4,10,51.8',
                    'line,10,51.8,210,51.8',
                    'addPage,',
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,v2_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,210,33.4',
                    'line,10,51.8,210,51.8',
                    'addPage,',
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,v3_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,210,33.4',
                    'line,210,33.4,210,51.8',
                    'line,10,51.8,210,51.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200, 200 ], horizontalSplitWidth: 300 }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 1 rows, cells[2,1] & [3,1] - no left border, columnWidth = 200, horizontalSplitWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'v2_1' || pdfCell.text === 'v3_1') {
                        pdfCell.drawLeftBorder = false;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,210,33.4',
                    'line,10,33.4,10,51.8',
                    'line,10,51.8,210,51.8',
                    'addPage,',
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,v2_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,210,33.4',
                    'line,10,51.8,210,51.8',
                    'addPage,',
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,v3_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,210,33.4',
                    'line,210,33.4,210,51.8',
                    'line,10,51.8,210,51.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200, 200 ], horizontalSplitWidth: 300 }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 2 rows, cells[1,1] - no borders, columnWidth = 200, horizontalSplitWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'v2_1') {
                        pdfCell.drawLeftBorder = false;
                        pdfCell.drawRightBorder = false;
                        pdfCell.drawTopBorder = false;
                        pdfCell.drawBottomBorder = false;
                    }
                };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'text,v1_2,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,210,33.4',
                    'line,10,33.4,10,51.8',
                    'line,10,51.8,210,51.8',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'addPage,',
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,v2_1,10,42.6,{baseline:middle}',
                    'text,v2_2,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'line,10,15,210,15',
                    'line,10,15,10,33.4',
                    'line,210,15,210,33.4',
                    'setLineWidth,1',
                    'line,10,51.8,10,70.2',
                    'line,210,51.8,210,70.2',
                    'line,10,70.2,210,70.2',
                    'addPage,',
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,v3_1,10,42.6,{baseline:middle}',
                    'text,v3_2,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'line,10,33.4,210,33.4',
                    'line,210,33.4,210,51.8',
                    'line,10,51.8,210,51.8',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200, 200 ], horizontalSplitWidth: 300 }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfSplittingTests };
