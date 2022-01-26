import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';
import { normalizeBoundaryValue } from 'exporter/jspdf/v3/normalizeOptions';

const JSPdfSplittingTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        function initMargin(doc, { pageWidth, pageHeight, customMargin }) {
            // Calculate margins for the allowed page width.
            const docPageWidth = doc.internal.pageSize.getWidth();
            const docPageHeight = doc.internal.pageSize.getHeight();

            const unusableWidth = docPageWidth - pageWidth || 0;
            const unusableHeight = docPageHeight - pageHeight || 0;

            const margin = normalizeBoundaryValue(customMargin);
            return {
                top: margin.top,
                bottom: unusableHeight - margin.bottom,
                left: margin.left,
                right: unusableWidth - margin.left,
            };
        }

        QUnit.module('Splitting - Horizontally splitting for simple cells', moduleConfig, () => {
            QUnit.test('1 cols - 1 rows, columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

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

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 1 rows, columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

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

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 1 rows, columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

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

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 1 rows, cells[1,0] & [1,1] - no right border, columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

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

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 1 rows, cells[2,1] & [3,1] - no left border, columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

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

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 2 rows, cells[1,1] - no borders, columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

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

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 1 rows, topLeft.x = 0, columnWidths = [100, 200, 100], availablePageWidth = 250', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 250 });

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
                    'text,F1,0,24.2,{baseline:middle}',
                    'text,v1_1,0,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,100,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,100,18.4',
                    'addPage,',
                    'text,F2,0,24.2,{baseline:middle}',
                    'text,v2_1,0,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,200,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,200,18.4',
                    'addPage,',
                    'text,F3,0,24.2,{baseline:middle}',
                    'text,v3_1,0,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,100,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 15 }, columnWidths: [ 100, 200, 100 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 1 rows, topLeft.x = 0, columnWidths = [100, 100, 100], availablePageWidth = 110', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 110 });

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
                    'text,F1,0,24.2,{baseline:middle}',
                    'text,v1_1,0,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,100,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,100,18.4',
                    'addPage,',
                    'text,F2,0,24.2,{baseline:middle}',
                    'text,v2_1,0,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,100,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,100,18.4',
                    'addPage,',
                    'text,F3,0,24.2,{baseline:middle}',
                    'text,v3_1,0,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,100,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 15 }, columnWidths: [ 100, 100, 100 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 1 rows, topLeft.x = 0, columnWidth = 200, availablePageWidth = 200', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 200 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1' }]
                });

                const expectedLog = [
                    'text,F1,0,24.2,{baseline:middle}',
                    'text,v1_1,0,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,200,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,200,18.4',
                    'addPage,',
                    'text,F2,0,24.2,{baseline:middle}',
                    'text,v2_1,0,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,200,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 15 }, columnWidths: [ 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 1 rows, topLeft.x = 10, columnWidth = 200, availablePageWidth = 200', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 200 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1' }]
                });

                const expectedLog = [
                    'text,F1,20,24.2,{baseline:middle}',
                    'text,F2,220,24.2,{baseline:middle}',
                    'text,v1_1,20,42.6,{baseline:middle}',
                    'text,v2_1,220,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,15,200,18.4',
                    'setLineWidth,1',
                    'rect,220,15,200,18.4',
                    'setLineWidth,1',
                    'rect,20,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,220,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 1 rows, topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300, customMargin: { left: 15 } });

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
                    'text,F1,25,24.2,{baseline:middle}',
                    'text,v1_1,25,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,25,15,200,18.4',
                    'setLineWidth,1',
                    'rect,25,33.4,200,18.4',
                    'addPage,',
                    'text,F2,25,24.2,{baseline:middle}',
                    'text,v2_1,25,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,25,15,200,18.4',
                    'setLineWidth,1',
                    'rect,25,33.4,200,18.4',
                    'addPage,',
                    'text,F3,25,24.2,{baseline:middle}',
                    'text,v3_1,25,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,25,15,200,18.4',
                    'setLineWidth,1',
                    'rect,25,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('Splitting - Vertically splitting for simple cells', moduleConfig, () => {
            QUnit.test('1 cols - 2 rows, rowHeight = 30, availablePageHeight = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }],
                    showColumnHeaders: false
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'text,v1_1,10,25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,200,30',
                    'addPage,',
                    'text,v2_1,10,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,200,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 cols - 2 rows, rowHeight = 30, availablePageHeight = 60, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 60 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'text,v2_1,0,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 cols - 2 rows, rowHeight = 30, availablePageHeight = 60, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 60 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'text,F1,0,15,{baseline:middle}',
                    'text,v2_1,0,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows, rowHeight = 30, availablePageHeight = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }],
                    showColumnHeaders: false
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'text,v1_1,10,25,{baseline:middle}',
                    'text,v1_2,210,25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,200,30',
                    'setLineWidth,1',
                    'rect,210,10,200,30',
                    'addPage,',
                    'text,v2_1,10,15,{baseline:middle}',
                    'text,v2_2,210,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,200,30',
                    'setLineWidth,1',
                    'rect,210,0,200,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200, 200 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows, rowHeight = 30, availablePageHeight = 60, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 60 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'text,v1_2,297.64,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'text,v2_1,0,15,{baseline:middle}',
                    'text,v2_2,297.64,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows, rowHeight = 30, availablePageHeight = 60, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 60 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'text,v1_2,297.64,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v2_1,0,45,{baseline:middle}',
                    'text,v2_2,297.64,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 cols - 3 rows, rowHeight = 30, availablePageHeight = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
                    showColumnHeaders: false
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'text,v1_1,10,25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,200,30',
                    'addPage,',
                    'text,v2_1,10,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,200,30',
                    'addPage,',
                    'text,v3_1,10,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,200,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 cols - 3 rows, rowHeight = 30, availablePageHeight = 60, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 60 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'text,v2_1,0,15,{baseline:middle}',
                    'text,v3_1,0,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 cols - 3 rows, rowHeight = 30, availablePageHeight = 60, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 60 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'text,F1,0,15,{baseline:middle}',
                    'text,v2_1,0,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'text,F1,0,15,{baseline:middle}',
                    'text,v3_1,0,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 cols - 3 rows, rowHeight = 30, availablePageHeight = 80', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
                    showColumnHeaders: false
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'text,v1_1,10,25,{baseline:middle}',
                    'text,v2_1,10,55,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,200,30',
                    'setLineWidth,1',
                    'rect,10,40,200,30',
                    'addPage,',
                    'text,v3_1,10,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,200,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 cols - 3 rows, rowHeight = 30, availablePageHeight = 90, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 90 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'text,v2_1,0,75,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30',
                    'setLineWidth,1',
                    'rect,0,60,595.28,30',
                    'addPage,',
                    'text,v3_1,0,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            const onRowExporting = (e) => { e.rowHeight = 30; };
            QUnit.test('1 cols - 3 rows, rowHeight = 30, availablePageHeight = 90, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 90 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }, { f1: 'v2_1' }, { f1: 'v3_1' }],
                });

                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'text,v2_1,0,75,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30',
                    'setLineWidth,1',
                    'rect,0,60,595.28,30',
                    'addPage,',
                    'text,F1,0,15,{baseline:middle}',
                    'text,v3_1,0,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,30',
                    'setLineWidth,1',
                    'rect,0,30,595.28,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageHeight = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }, { f1: 'v3_1', f2: 'v3_2' }],
                    showColumnHeaders: false
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'text,v1_1,10,25,{baseline:middle}',
                    'text,v1_2,210,25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,200,30',
                    'setLineWidth,1',
                    'rect,210,10,200,30',
                    'addPage,',
                    'text,v2_1,10,15,{baseline:middle}',
                    'text,v2_2,210,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,200,30',
                    'setLineWidth,1',
                    'rect,210,0,200,30',
                    'addPage,',
                    'text,v3_1,10,15,{baseline:middle}',
                    'text,v3_2,210,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,200,30',
                    'setLineWidth,1',
                    'rect,210,0,200,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200, 200 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageHeight = 60, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 60 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' }
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }, { f1: 'v3_1', f2: 'v3_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'text,v1_2,297.64,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'text,v2_1,0,15,{baseline:middle}',
                    'text,v2_2,297.64,15,{baseline:middle}',
                    'text,v3_1,0,45,{baseline:middle}',
                    'text,v3_2,297.64,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageHeight = 60, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 60 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' }
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }, { f1: 'v3_1', f2: 'v3_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'text,v1_2,297.64,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v2_1,0,45,{baseline:middle}',
                    'text,v2_2,297.64,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v3_1,0,45,{baseline:middle}',
                    'text,v3_2,297.64,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageHeight = 80', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }, { f1: 'v3_1', f2: 'v3_2' }],
                    showColumnHeaders: false
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'text,v1_1,10,25,{baseline:middle}',
                    'text,v1_2,210,25,{baseline:middle}',
                    'text,v2_1,10,55,{baseline:middle}',
                    'text,v2_2,210,55,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,200,30',
                    'setLineWidth,1',
                    'rect,210,10,200,30',
                    'setLineWidth,1',
                    'rect,10,40,200,30',
                    'setLineWidth,1',
                    'rect,210,40,200,30',
                    'addPage,',
                    'text,v3_1,10,15,{baseline:middle}',
                    'text,v3_2,210,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,200,30',
                    'setLineWidth,1',
                    'rect,210,0,200,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200, 200 ], onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageHeight = 90, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 90 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' }
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }, { f1: 'v3_1', f2: 'v3_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'text,v1_2,297.64,45,{baseline:middle}',
                    'text,v2_1,0,75,{baseline:middle}',
                    'text,v2_2,297.64,75,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30',
                    'setLineWidth,1',
                    'rect,0,60,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,60,297.64,30',
                    'addPage,',
                    'text,v3_1,0,15,{baseline:middle}',
                    'text,v3_2,297.64,15,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageHeight = 90, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 90 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' }
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }, { f1: 'v3_1', f2: 'v3_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v1_1,0,45,{baseline:middle}',
                    'text,v1_2,297.64,45,{baseline:middle}',
                    'text,v2_1,0,75,{baseline:middle}',
                    'text,v2_2,297.64,75,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30',
                    'setLineWidth,1',
                    'rect,0,60,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,60,297.64,30',
                    'addPage,',
                    'text,F1,0,15,{baseline:middle}',
                    'text,F2,297.64,15,{baseline:middle}',
                    'text,v3_1,0,45,{baseline:middle}',
                    'text,v3_2,297.64,45,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,1',
                    'rect,0,30,297.64,30',
                    'setLineWidth,1',
                    'rect,297.64,30,297.64,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('Splitting - Horizontally splitting for merged cells', moduleConfig, () => {
            QUnit.test('3 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3], columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

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

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f2_2,20,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,200,18.4,F',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,190,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,190,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'addPage,',
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,f1_3,10,61,{baseline:middle}',
                    'text,f2_3,10,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,200,18.4,F',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3], columnWidth = 200, availablePageWidth = 300, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

                const f1 = 'f1_longtext_longtext_longtext_longtext';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: f1, f2: 'f1_2', f3: 'f1_3' },
                        { f1: f1, f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f2_2,20,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,210,33.4',
                    'lineTo,210,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_longtext_longtext_longtext,10,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,190,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,190,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'addPage,',
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,f1_3,10,61,{baseline:middle}',
                    'text,f2_3,10,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,210,33.4',
                    'lineTo,210,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_longtext_longtext_longtext,-190,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3], columnWidth = 200, availablePageWidth = 300, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

                const f1 = 'f1_longtext_longtext_longtext_longtext';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        { f1: f1, f2: 'f1_2', f3: 'f1_3' },
                        { f1: f1, f2: 'f2_2', f3: 'f2_3' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F2,15,29.2,{baseline:middle}',
                    'text,f1_2,25,86,{baseline:middle}',
                    'text,f2_2,25,114.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,210,43.4',
                    'lineTo,210,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_longtext_longtext_longtext,15,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,20,71.8,190,28.4',
                    'setLineWidth,1',
                    'rect,20,100.2,190,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4',
                    'addPage,',
                    'text,F3,15,29.2,{baseline:middle}',
                    'text,f1_3,15,86,{baseline:middle}',
                    'text,f2_3,15,114.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,210,43.4',
                    'lineTo,210,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_longtext_longtext_longtext,-185,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('4 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4], columnWidth = 200, availablePageWidth = 500', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_3' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_3' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,210,24.2,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f1_3,210,61,{baseline:middle}',
                    'text,f2_2,20,79.4,{baseline:middle}',
                    'text,f2_3,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,190,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,190,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F4,10,24.2,{baseline:middle}',
                    'text,f1_3,10,61,{baseline:middle}',
                    'text,f2_3,10,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,200,18.4,F',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('4 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4], columnWidth = 200, availablePageWidth = 500, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                    ],
                    dataSource: [
                        { f1: f1, f2: 'f1_2', f3: 'f1_3', f4: 'f1_3' },
                        { f1: f1, f2: 'f2_2', f3: 'f2_3', f4: 'f2_3' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,210,24.2,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f1_3,210,61,{baseline:middle}',
                    'text,f2_2,20,79.4,{baseline:middle}',
                    'text,f2_3,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,10,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,190,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,190,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F4,10,24.2,{baseline:middle}',
                    'text,f1_3,10,61,{baseline:middle}',
                    'text,f2_3,10,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,210,33.4',
                    'lineTo,210,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-390,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('4 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4], columnWidth = 200, availablePageWidth = 500, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                    ],
                    dataSource: [
                        { f1: f1, f2: 'f1_2', f3: 'f1_3', f4: 'f1_3' },
                        { f1: f1, f2: 'f2_2', f3: 'f2_3', f4: 'f2_3' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F2,15,29.2,{baseline:middle}',
                    'text,F3,215,29.2,{baseline:middle}',
                    'text,f1_2,25,86,{baseline:middle}',
                    'text,f1_3,215,86,{baseline:middle}',
                    'text,f2_2,25,114.4,{baseline:middle}',
                    'text,f2_3,215,114.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,20,71.8,190,28.4',
                    'setLineWidth,1',
                    'rect,210,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,20,100.2,190,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'addPage,',
                    'text,F4,15,29.2,{baseline:middle}',
                    'text,f1_3,15,86,{baseline:middle}',
                    'text,f2_3,15,114.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,210,43.4',
                    'lineTo,210,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-385,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('5 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5], columnWidth = 200, availablePageWidth = 500', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,210,24.2,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f1_3,210,61,{baseline:middle}',
                    'text,f2_2,20,79.4,{baseline:middle}',
                    'text,f2_3,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,190,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,190,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F4,10,24.2,{baseline:middle}',
                    'text,F5,210,24.2,{baseline:middle}',
                    'text,f1_4,10,61,{baseline:middle}',
                    'text,f1_5,210,61,{baseline:middle}',
                    'text,f2_4,10,79.4,{baseline:middle}',
                    'text,f2_5,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('5 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5], columnWidth = 200, availablePageWidth = 500, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    dataSource: [
                        { f1: f1, f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: f1, f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,210,24.2,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f1_3,210,61,{baseline:middle}',
                    'text,f2_2,20,79.4,{baseline:middle}',
                    'text,f2_3,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,10,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,190,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,190,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F4,10,24.2,{baseline:middle}',
                    'text,F5,210,24.2,{baseline:middle}',
                    'text,f1_4,10,61,{baseline:middle}',
                    'text,f1_5,210,61,{baseline:middle}',
                    'text,f2_4,10,79.4,{baseline:middle}',
                    'text,f2_5,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-390,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('5 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5], columnWidth = 200, availablePageWidth = 500, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    dataSource: [
                        { f1: f1, f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: f1, f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F2,15,29.2,{baseline:middle}',
                    'text,F3,215,29.2,{baseline:middle}',
                    'text,f1_2,25,86,{baseline:middle}',
                    'text,f1_3,215,86,{baseline:middle}',
                    'text,f2_2,25,114.4,{baseline:middle}',
                    'text,f2_3,215,114.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,20,71.8,190,28.4',
                    'setLineWidth,1',
                    'rect,210,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,20,100.2,190,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'addPage,',
                    'text,F4,15,29.2,{baseline:middle}',
                    'text,F5,215,29.2,{baseline:middle}',
                    'text,f1_4,15,86,{baseline:middle}',
                    'text,f1_5,215,86,{baseline:middle}',
                    'text,f2_4,15,114.4,{baseline:middle}',
                    'text,f2_5,215,114.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-385,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,210,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('6 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], columnWidth = 200, availablePageWidth = 500', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,210,24.2,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f1_3,210,61,{baseline:middle}',
                    'text,f2_2,20,79.4,{baseline:middle}',
                    'text,f2_3,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,190,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,190,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F4,10,24.2,{baseline:middle}',
                    'text,F5,210,24.2,{baseline:middle}',
                    'text,f1_4,10,61,{baseline:middle}',
                    'text,f1_5,210,61,{baseline:middle}',
                    'text,f2_4,10,79.4,{baseline:middle}',
                    'text,f2_5,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F6,10,24.2,{baseline:middle}',
                    'text,f1_6,10,61,{baseline:middle}',
                    'text,f2_6,10,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,200,18.4,F',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('6 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], columnWidth = 200, availablePageWidth = 500, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    dataSource: [
                        { f1: f1, f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: f1, f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'text,F3,210,24.2,{baseline:middle}',
                    'text,f1_2,20,61,{baseline:middle}',
                    'text,f1_3,210,61,{baseline:middle}',
                    'text,f2_2,20,79.4,{baseline:middle}',
                    'text,f2_3,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,10,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,190,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,190,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F4,10,24.2,{baseline:middle}',
                    'text,F5,210,24.2,{baseline:middle}',
                    'text,f1_4,10,61,{baseline:middle}',
                    'text,f1_5,210,61,{baseline:middle}',
                    'text,f2_4,10,79.4,{baseline:middle}',
                    'text,f2_5,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-390,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F6,10,24.2,{baseline:middle}',
                    'text,f1_6,10,61,{baseline:middle}',
                    'text,f2_6,10,79.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,210,33.4',
                    'lineTo,210,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-790,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('6 cols - 2 rows, 1 level - 1 group - [{f1, groupIndex: 0}, f2, f3, f4, f5, f6], columnWidth = 200, availablePageWidth = 500, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    dataSource: [
                        { f1: f1, f2: 'f1_2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: f1, f2: 'f2_2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F2,15,29.2,{baseline:middle}',
                    'text,F3,215,29.2,{baseline:middle}',
                    'text,f1_2,25,86,{baseline:middle}',
                    'text,f1_3,215,86,{baseline:middle}',
                    'text,f2_2,25,114.4,{baseline:middle}',
                    'text,f2_3,215,114.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,20,71.8,190,28.4',
                    'setLineWidth,1',
                    'rect,210,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,20,100.2,190,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'addPage,',
                    'text,F4,15,29.2,{baseline:middle}',
                    'text,F5,215,29.2,{baseline:middle}',
                    'text,f1_4,15,86,{baseline:middle}',
                    'text,f1_5,215,86,{baseline:middle}',
                    'text,f2_4,15,114.4,{baseline:middle}',
                    'text,f2_5,215,114.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-385,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,210,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'addPage,',
                    'text,F6,15,29.2,{baseline:middle}',
                    'text,f1_6,15,86,{baseline:middle}',
                    'text,f2_6,15,114.4,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,210,43.4',
                    'lineTo,210,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-785,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('5 cols - 2 rows, 2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5], columnWidth = 200, availablePageWidth = 500', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = gridCell.groupIndex === 0 ? '#CCFFCC' : '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,210,24.2,{baseline:middle}',
                    'text,f1_3,30,79.4,{baseline:middle}',
                    'text,f1_4,210,79.4,{baseline:middle}',
                    'text,f2_3,30,97.8,{baseline:middle}',
                    'text,f2_4,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,20,51.8,390,18.4,F',
                    'text,F2: f2,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,30,70.2,180,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,30,88.6,180,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,390,18.4',
                    'addPage,',
                    'text,F5,10,24.2,{baseline:middle}',
                    'text,f1_5,10,79.4,{baseline:middle}',
                    'text,f2_5,10,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,200,18.4,F',
                    'setFillColor,#CCCCFF',
                    'rect,10,51.8,200,18.4,F',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('5 cols - 2 rows, 2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5], columnWidth = 200, availablePageWidth = 500, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';
                const f2 = 'f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    dataSource: [
                        { f1: f1, f2: f2, f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: f1, f2: f2, f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = gridCell.groupIndex === 0 ? '#CCFFCC' : '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,210,24.2,{baseline:middle}',
                    'text,f1_3,30,79.4,{baseline:middle}',
                    'text,f1_4,210,79.4,{baseline:middle}',
                    'text,f2_3,30,97.8,{baseline:middle}',
                    'text,f2_4,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,10,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,20,51.8,390,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,20,51.8',
                    'lineTo,410,51.8',
                    'lineTo,410,70.2',
                    'lineTo,20,70.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,20,61,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,30,70.2,180,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,30,88.6,180,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,390,18.4',
                    'addPage,',
                    'text,F5,10,24.2,{baseline:middle}',
                    'text,f1_5,10,79.4,{baseline:middle}',
                    'text,f2_5,10,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,210,33.4',
                    'lineTo,210,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-390,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,51.8,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,51.8',
                    'lineTo,210,51.8',
                    'lineTo,210,70.2',
                    'lineTo,10,70.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-380,61,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('5 cols - 2 rows, 2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5], columnWidth = 200, availablePageWidth = 500, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';
                const f2 = 'f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                    ],
                    dataSource: [
                        { f1: f1, f2: f2, f3: 'f1_3', f4: 'f1_4', f5: 'f1_5' },
                        { f1: f1, f2: f2, f3: 'f2_3', f4: 'f2_4', f5: 'f2_5' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = gridCell.groupIndex === 0 ? '#CCFFCC' : '#CCCCFF';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F3,15,29.2,{baseline:middle}',
                    'text,F4,215,29.2,{baseline:middle}',
                    'text,f1_3,35,114.4,{baseline:middle}',
                    'text,f1_4,215,114.4,{baseline:middle}',
                    'text,f2_3,35,142.8,{baseline:middle}',
                    'text,f2_4,215,142.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,20,71.8,390,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,20,71.8',
                    'lineTo,410,71.8',
                    'lineTo,410,100.2',
                    'lineTo,20,100.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,25,86,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,30,100.2,180,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,30,128.6,180,28.4',
                    'setLineWidth,1',
                    'rect,210,128.6,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'setLineWidth,1',
                    'rect,20,71.8,390,28.4',
                    'addPage,',
                    'text,F5,15,29.2,{baseline:middle}',
                    'text,f1_5,15,114.4,{baseline:middle}',
                    'text,f2_5,15,142.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,210,43.4',
                    'lineTo,210,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-385,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,71.8,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,71.8',
                    'lineTo,210,71.8',
                    'lineTo,210,100.2',
                    'lineTo,10,100.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-375,86,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,128.6,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('6 cols - 2 rows, 2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], columnWidth = 200, availablePageWidth = 500', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = gridCell.groupIndex === 0 ? '#CCFFCC' : '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,210,24.2,{baseline:middle}',
                    'text,f1_3,30,79.4,{baseline:middle}',
                    'text,f1_4,210,79.4,{baseline:middle}',
                    'text,f2_3,30,97.8,{baseline:middle}',
                    'text,f2_4,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,20,51.8,390,18.4,F',
                    'text,F2: f2,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,30,70.2,180,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,30,88.6,180,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,390,18.4',
                    'addPage,',
                    'text,F5,10,24.2,{baseline:middle}',
                    'text,F6,210,24.2,{baseline:middle}',
                    'text,f1_5,10,79.4,{baseline:middle}',
                    'text,f1_6,210,79.4,{baseline:middle}',
                    'text,f2_5,10,97.8,{baseline:middle}',
                    'text,f2_6,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'setFillColor,#CCCCFF',
                    'rect,10,51.8,400,18.4,F',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,400,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('6 cols - 2 rows, 2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], columnWidth = 200, availablePageWidth = 500, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';
                const f2 = 'f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    dataSource: [
                        { f1: f1, f2: f2, f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: f1, f2: f2, f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = gridCell.groupIndex === 0 ? '#CCFFCC' : '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,210,24.2,{baseline:middle}',
                    'text,f1_3,30,79.4,{baseline:middle}',
                    'text,f1_4,210,79.4,{baseline:middle}',
                    'text,f2_3,30,97.8,{baseline:middle}',
                    'text,f2_4,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,10,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,20,51.8,390,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,20,51.8',
                    'lineTo,410,51.8',
                    'lineTo,410,70.2',
                    'lineTo,20,70.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,20,61,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,30,70.2,180,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,30,88.6,180,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,390,18.4',
                    'addPage,',
                    'text,F5,10,24.2,{baseline:middle}',
                    'text,F6,210,24.2,{baseline:middle}',
                    'text,f1_5,10,79.4,{baseline:middle}',
                    'text,f1_6,210,79.4,{baseline:middle}',
                    'text,f2_5,10,97.8,{baseline:middle}',
                    'text,f2_6,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-390,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,51.8,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,51.8',
                    'lineTo,410,51.8',
                    'lineTo,410,70.2',
                    'lineTo,10,70.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-380,61,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,400,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('6 cols - 2 rows, 2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6], columnWidth = 200, availablePageWidth = 500, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';
                const f2 = 'f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                    ],
                    dataSource: [
                        { f1: f1, f2: f2, f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6' },
                        { f1: f1, f2: f2, f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = gridCell.groupIndex === 0 ? '#CCFFCC' : '#CCCCFF';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F3,15,29.2,{baseline:middle}',
                    'text,F4,215,29.2,{baseline:middle}',
                    'text,f1_3,35,114.4,{baseline:middle}',
                    'text,f1_4,215,114.4,{baseline:middle}',
                    'text,f2_3,35,142.8,{baseline:middle}',
                    'text,f2_4,215,142.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,20,71.8,390,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,20,71.8',
                    'lineTo,410,71.8',
                    'lineTo,410,100.2',
                    'lineTo,20,100.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,25,86,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,30,100.2,180,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,30,128.6,180,28.4',
                    'setLineWidth,1',
                    'rect,210,128.6,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'setLineWidth,1',
                    'rect,20,71.8,390,28.4',
                    'addPage,',
                    'text,F5,15,29.2,{baseline:middle}',
                    'text,F6,215,29.2,{baseline:middle}',
                    'text,f1_5,15,114.4,{baseline:middle}',
                    'text,f1_6,215,114.4,{baseline:middle}',
                    'text,f2_5,15,142.8,{baseline:middle}',
                    'text,f2_6,215,142.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-385,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,71.8,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,71.8',
                    'lineTo,410,71.8',
                    'lineTo,410,100.2',
                    'lineTo,10,100.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-375,86,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,128.6,200,28.4',
                    'setLineWidth,1',
                    'rect,210,128.6,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,400,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('7 cols - 2 rows, 2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6, f7], columnWidth = 200, availablePageWidth = 500', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                        { dataField: 'f7' },
                    ],
                    dataSource: [
                        { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6', f7: 'f1_7' },
                        { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6', f7: 'f2_7' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = gridCell.groupIndex === 0 ? '#CCFFCC' : '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,210,24.2,{baseline:middle}',
                    'text,f1_3,30,79.4,{baseline:middle}',
                    'text,f1_4,210,79.4,{baseline:middle}',
                    'text,f2_3,30,97.8,{baseline:middle}',
                    'text,f2_4,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'text,F1: f1,10,42.6,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,20,51.8,390,18.4,F',
                    'text,F2: f2,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,30,70.2,180,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,30,88.6,180,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,390,18.4',
                    'addPage,',
                    'text,F5,10,24.2,{baseline:middle}',
                    'text,F6,210,24.2,{baseline:middle}',
                    'text,f1_5,10,79.4,{baseline:middle}',
                    'text,f1_6,210,79.4,{baseline:middle}',
                    'text,f2_5,10,97.8,{baseline:middle}',
                    'text,f2_6,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'setFillColor,#CCCCFF',
                    'rect,10,51.8,400,18.4,F',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,400,18.4',
                    'addPage,',
                    'text,F7,10,24.2,{baseline:middle}',
                    'text,f1_7,10,79.4,{baseline:middle}',
                    'text,f2_7,10,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,200,18.4,F',
                    'setFillColor,#CCCCFF',
                    'rect,10,51.8,200,18.4,F',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('7 cols - 2 rows, 2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6, f7], columnWidth = 200, availablePageWidth = 500, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';
                const f2 = 'f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                        { dataField: 'f7' },
                    ],
                    dataSource: [
                        { f1: f1, f2: f2, f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6', f7: 'f1_7' },
                        { f1: f1, f2: f2, f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6', f7: 'f2_7' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = gridCell.groupIndex === 0 ? '#CCFFCC' : '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,210,24.2,{baseline:middle}',
                    'text,f1_3,30,79.4,{baseline:middle}',
                    'text,f1_4,210,79.4,{baseline:middle}',
                    'text,f2_3,30,97.8,{baseline:middle}',
                    'text,f2_4,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,10,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,20,51.8,390,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,20,51.8',
                    'lineTo,410,51.8',
                    'lineTo,410,70.2',
                    'lineTo,20,70.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,20,61,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,30,70.2,180,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,30,88.6,180,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,390,18.4',
                    'addPage,',
                    'text,F5,10,24.2,{baseline:middle}',
                    'text,F6,210,24.2,{baseline:middle}',
                    'text,f1_5,10,79.4,{baseline:middle}',
                    'text,f1_6,210,79.4,{baseline:middle}',
                    'text,f2_5,10,97.8,{baseline:middle}',
                    'text,f2_6,210,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-390,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,51.8,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,51.8',
                    'lineTo,410,51.8',
                    'lineTo,410,70.2',
                    'lineTo,10,70.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-380,61,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,210,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,210,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,400,18.4',
                    'addPage,',
                    'text,F7,10,24.2,{baseline:middle}',
                    'text,f1_7,10,79.4,{baseline:middle}',
                    'text,f2_7,10,97.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,210,33.4',
                    'lineTo,210,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-790,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,51.8,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,51.8',
                    'lineTo,210,51.8',
                    'lineTo,210,70.2',
                    'lineTo,10,70.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-780,61,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('7 cols - 2 rows, 2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4, f5, f6, f7], columnWidth = 200, availablePageWidth = 500, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const f1 = 'f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';
                const f2 = 'f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6';

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                        { dataField: 'f5' },
                        { dataField: 'f6' },
                        { dataField: 'f7' },
                    ],
                    dataSource: [
                        { f1: f1, f2: f2, f3: 'f1_3', f4: 'f1_4', f5: 'f1_5', f6: 'f1_6', f7: 'f1_7' },
                        { f1: f1, f2: f2, f3: 'f2_3', f4: 'f2_4', f5: 'f2_5', f6: 'f2_6', f7: 'f2_7' },
                    ],
                });

                const customizeCell = ({ pdfCell, gridCell }) => {
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = gridCell.groupIndex === 0 ? '#CCFFCC' : '#CCCCFF';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F3,15,29.2,{baseline:middle}',
                    'text,F4,215,29.2,{baseline:middle}',
                    'text,f1_3,35,114.4,{baseline:middle}',
                    'text,f1_4,215,114.4,{baseline:middle}',
                    'text,f2_3,35,142.8,{baseline:middle}',
                    'text,f2_4,215,142.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,20,71.8,390,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,20,71.8',
                    'lineTo,410,71.8',
                    'lineTo,410,100.2',
                    'lineTo,20,100.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,25,86,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,30,100.2,180,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,30,128.6,180,28.4',
                    'setLineWidth,1',
                    'rect,210,128.6,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'setLineWidth,1',
                    'rect,20,71.8,390,28.4',
                    'addPage,',
                    'text,F5,15,29.2,{baseline:middle}',
                    'text,F6,215,29.2,{baseline:middle}',
                    'text,f1_5,15,114.4,{baseline:middle}',
                    'text,f1_6,215,114.4,{baseline:middle}',
                    'text,f2_5,15,142.8,{baseline:middle}',
                    'text,f2_6,215,142.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-385,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,71.8,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,71.8',
                    'lineTo,410,71.8',
                    'lineTo,410,100.2',
                    'lineTo,10,100.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-375,86,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,210,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,128.6,200,28.4',
                    'setLineWidth,1',
                    'rect,210,128.6,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,400,28.4',
                    'addPage,',
                    'text,F7,15,29.2,{baseline:middle}',
                    'text,f1_7,15,114.4,{baseline:middle}',
                    'text,f2_7,15,142.8,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,210,43.4',
                    'lineTo,210,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-785,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,71.8,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,71.8',
                    'lineTo,210,71.8',
                    'lineTo,210,100.2',
                    'lineTo,10,100.2',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-775,86,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,128.6,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]], columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band1') {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F1,10,42.6,{baseline:middle}',
                    'text,f1_1,10,61,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,18.4,F',
                    'text,Band1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'addPage,',
                    'text,F2,10,42.6,{baseline:middle}',
                    'text,f2_1,10,61,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,18.4,F',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]], columnWidth = 200, availablePageWidth = 300, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1_longtext_1_longtext_2_longtext_3_longtext_4', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.startsWith('Band1')) {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                };

                const expectedLog = [
                    'text,F1,10,42.6,{baseline:middle}',
                    'text,f1_1,10,61,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,33.4',
                    'lineTo,10,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,10,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'addPage,',
                    'text,F2,10,42.6,{baseline:middle}',
                    'text,f2_1,10,61,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,33.4',
                    'lineTo,10,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,-190,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]], columnWidth = 200, availablePageWidth = 300, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

                const dataGrid = createDataGrid({
                    columns: [
                        { caption: 'Band1_longtext_1_longtext_2_longtext_3_longtext_4', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.startsWith('Band1')) {
                        pdfCell.backgroundColor = '#CCCCCC';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F1,15,57.6,{baseline:middle}',
                    'text,f1_1,15,86,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,43.4',
                    'lineTo,10,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,15,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'addPage,',
                    'text,F2,15,57.6,{baseline:middle}',
                    'text,f2_1,15,86,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,43.4',
                    'lineTo,10,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,-185,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]], columnWidth = 200, availablePageWidth = 300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

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
                    if(pdfCell.text === 'Band1') {
                        pdfCell.backgroundColor = '#CCFFCC';
                    } else if(pdfCell.text === 'Band1_1') {
                        pdfCell.backgroundColor = '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F1,10,61,{baseline:middle}',
                    'text,f1_1_1,10,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,18.4,F',
                    'text,Band1,10,24.2,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,33.4,200,18.4,F',
                    'text,Band1_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'addPage,',
                    'text,F2,10,61,{baseline:middle}',
                    'text,f2_1_1,10,79.4,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,33.4,200,18.4,F',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,18.4,F',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'addPage,',
                    'text,F3,10,51.8,{baseline:middle}',
                    'text,f3_1,10,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,18.4,F',
                    'setLineWidth,1',
                    'rect,10,33.4,200,36.8',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]], columnWidth = 200, availablePageWidth = 300, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                            columns: [
                                { caption: 'Band1_1_longtext_1_longtext_2_longtext_3', columns: [ 'f1', 'f2' ] },
                                'f3',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.startsWith('Band1')) {
                        pdfCell.backgroundColor = '#CCFFCC';
                    } else if(pdfCell.text.startsWith('Band1_1')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F1,10,61,{baseline:middle}',
                    'text,f1_1_1,10,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,33.4',
                    'lineTo,10,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,10,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,210,33.4',
                    'lineTo,210,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3,10,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'addPage,',
                    'text,F2,10,61,{baseline:middle}',
                    'text,f2_1_1,10,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,210,33.4',
                    'lineTo,210,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3,-190,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,33.4',
                    'lineTo,10,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-190,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'addPage,',
                    'text,F3,10,51.8,{baseline:middle}',
                    'text,f3_1,10,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,33.4',
                    'lineTo,10,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-390,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,33.4,200,36.8',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]], columnWidth = 200, availablePageWidth = 300, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 300 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                            columns: [
                                { caption: 'Band1_1_longtext_1_longtext_2_longtext_3', columns: [ 'f1', 'f2' ] },
                                'f3',
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.startsWith('Band1')) {
                        pdfCell.backgroundColor = '#CCFFCC';
                    } else if(pdfCell.text.startsWith('Band1_1')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F1,15,86,{baseline:middle}',
                    'text,f1_1_1,15,114.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,43.4',
                    'lineTo,10,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,15,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,210,43.4',
                    'lineTo,210,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3,15,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4',
                    'addPage,',
                    'text,F2,15,86,{baseline:middle}',
                    'text,f2_1_1,15,114.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,210,43.4',
                    'lineTo,210,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3,-185,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,43.4',
                    'lineTo,10,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-185,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4',
                    'addPage,',
                    'text,F3,15,71.8,{baseline:middle}',
                    'text,f3_1,15,114.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,43.4',
                    'lineTo,10,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-385,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,43.4,200,56.8',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,15,200,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], columnWidth = 200, availablePageWidth = 500', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                {
                                    caption: 'Band1_1',
                                    columns: [ 'f1', 'f2', 'f3' ]
                                },
                                {
                                    caption: 'Band1_2',
                                    columns: [ 'f4', 'f5', 'f6' ]
                                },
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1_1', f4: 'f4_1_2', f5: 'f5_1_2', f6: 'f6_1_2' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band1') {
                        pdfCell.backgroundColor = '#CCFFCC';
                    } else if(pdfCell.text === 'Band1_1') {
                        pdfCell.backgroundColor = '#CCCCFF';
                    } else if(pdfCell.text === 'Band1_2') {
                        pdfCell.backgroundColor = '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F1,10,61,{baseline:middle}',
                    'text,F2,210,61,{baseline:middle}',
                    'text,f1_1_1,10,79.4,{baseline:middle}',
                    'text,f2_1_1,210,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,18.4,F',
                    'text,Band1,10,24.2,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,33.4,400,18.4,F',
                    'text,Band1_1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,400,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F3,10,61,{baseline:middle}',
                    'text,F4,210,61,{baseline:middle}',
                    'text,f3_1_1,10,79.4,{baseline:middle}',
                    'text,f4_1_2,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,33.4,200,18.4,F',
                    'setFillColor,#CCCCFF',
                    'rect,210,33.4,200,18.4,F',
                    'text,Band1_2,210,42.6,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,18.4,F',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,210,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,400,18.4',
                    'addPage,',
                    'text,F5,10,61,{baseline:middle}',
                    'text,F6,210,61,{baseline:middle}',
                    'text,f5_1_2,10,79.4,{baseline:middle}',
                    'text,f6_1_2,210,79.4,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,33.4,400,18.4,F',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,18.4,F',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,10,15,400,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], columnWidth = 200, availablePageWidth = 500, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11',
                            columns: [
                                {
                                    caption: 'Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                                    columns: [ 'f1', 'f2', 'f3' ]
                                },
                                {
                                    caption: 'Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                                    columns: [ 'f4', 'f5', 'f6' ]
                                },
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1_1', f4: 'f4_1_2', f5: 'f5_1_2', f6: 'f6_1_2' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.startsWith('Band1')) {
                        pdfCell.backgroundColor = '#CCFFCC';
                    } else if(pdfCell.text.startsWith('Band1_1')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    } else if(pdfCell.text.startsWith('Band1_2')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F1,10,61,{baseline:middle}',
                    'text,F2,210,61,{baseline:middle}',
                    'text,f1_1_1,10,79.4,{baseline:middle}',
                    'text,f2_1_1,210,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,33.4',
                    'lineTo,10,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,10,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,10,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,400,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'addPage,',
                    'text,F3,10,61,{baseline:middle}',
                    'text,F4,210,61,{baseline:middle}',
                    'text,f3_1_1,10,79.4,{baseline:middle}',
                    'text,f4_1_2,210,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,210,33.4',
                    'lineTo,210,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-390,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,210,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,210,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,210,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,210,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,33.4',
                    'lineTo,10,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-390,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,210,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,15,400,18.4',
                    'addPage,',
                    'text,F5,10,61,{baseline:middle}',
                    'text,F6,210,61,{baseline:middle}',
                    'text,f5_1_2,10,79.4,{baseline:middle}',
                    'text,f6_1_2,210,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,33.4',
                    'lineTo,410,33.4',
                    'lineTo,410,51.8',
                    'lineTo,10,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-190,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,33.4',
                    'lineTo,10,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-790,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,210,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,10,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,210,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,10,15,400,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], columnWidth = 200, availablePageWidth = 500, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11',
                            columns: [
                                {
                                    caption: 'Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                                    columns: [ 'f1', 'f2', 'f3' ]
                                },
                                {
                                    caption: 'Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                                    columns: [ 'f4', 'f5', 'f6' ]
                                },
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1_1', f4: 'f4_1_2', f5: 'f5_1_2', f6: 'f6_1_2' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.startsWith('Band1')) {
                        pdfCell.backgroundColor = '#CCFFCC';
                    } else if(pdfCell.text.startsWith('Band1_1')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    } else if(pdfCell.text.startsWith('Band1_2')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F1,15,86,{baseline:middle}',
                    'text,F2,215,86,{baseline:middle}',
                    'text,f1_1_1,15,114.4,{baseline:middle}',
                    'text,f2_1_1,215,114.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,43.4',
                    'lineTo,10,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,15,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,15,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,210,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,15,400,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'addPage,',
                    'text,F3,15,86,{baseline:middle}',
                    'text,F4,215,86,{baseline:middle}',
                    'text,f3_1_1,15,114.4,{baseline:middle}',
                    'text,f4_1_2,215,114.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,210,43.4',
                    'lineTo,210,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-385,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,210,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,210,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,210,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,215,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,43.4',
                    'lineTo,10,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-385,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,210,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,200,28.4',
                    'setLineWidth,1',
                    'rect,210,43.4,200,28.4',
                    'setLineWidth,1',
                    'rect,10,15,400,28.4',
                    'addPage,',
                    'text,F5,15,86,{baseline:middle}',
                    'text,F6,215,86,{baseline:middle}',
                    'text,f5_1_2,15,114.4,{baseline:middle}',
                    'text,f6_1_2,215,114.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,43.4',
                    'lineTo,410,43.4',
                    'lineTo,410,71.8',
                    'lineTo,10,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-185,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,43.4',
                    'lineTo,10,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-785,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,210,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,10,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,210,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,10,43.4,400,28.4',
                    'setLineWidth,1',
                    'rect,10,15,400,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 500', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500, customMargin: { left: 15 } });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1',
                            columns: [
                                {
                                    caption: 'Band1_1',
                                    columns: [ 'f1', 'f2', 'f3' ]
                                },
                                {
                                    caption: 'Band1_2',
                                    columns: [ 'f4', 'f5', 'f6' ]
                                },
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1_1', f4: 'f4_1_2', f5: 'f5_1_2', f6: 'f6_1_2' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'Band1') {
                        pdfCell.backgroundColor = '#CCFFCC';
                    } else if(pdfCell.text === 'Band1_1') {
                        pdfCell.backgroundColor = '#CCCCFF';
                    } else if(pdfCell.text === 'Band1_2') {
                        pdfCell.backgroundColor = '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F1,25,61,{baseline:middle}',
                    'text,F2,225,61,{baseline:middle}',
                    'text,f1_1_1,25,79.4,{baseline:middle}',
                    'text,f2_1_1,225,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,18.4,F',
                    'text,Band1,25,24.2,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,25,33.4,400,18.4,F',
                    'text,Band1_1,25,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,25,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,225,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,25,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,225,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,25,15,400,18.4',
                    'setLineWidth,1',
                    'rect,25,33.4,400,18.4',
                    'addPage,',
                    'text,F3,25,61,{baseline:middle}',
                    'text,F4,225,61,{baseline:middle}',
                    'text,f3_1_1,25,79.4,{baseline:middle}',
                    'text,f4_1_2,225,79.4,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,25,33.4,200,18.4,F',
                    'setFillColor,#CCCCFF',
                    'rect,225,33.4,200,18.4,F',
                    'text,Band1_2,225,42.6,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,18.4,F',
                    'setLineWidth,1',
                    'rect,25,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,225,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,25,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,225,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,25,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,225,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,25,15,400,18.4',
                    'addPage,',
                    'text,F5,25,61,{baseline:middle}',
                    'text,F6,225,61,{baseline:middle}',
                    'text,f5_1_2,25,79.4,{baseline:middle}',
                    'text,f6_1_2,225,79.4,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,25,33.4,400,18.4,F',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,18.4,F',
                    'setLineWidth,1',
                    'rect,25,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,225,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,25,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,225,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,25,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,25,15,400,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 500, long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500, customMargin: { left: 15 } });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11',
                            columns: [
                                {
                                    caption: 'Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                                    columns: [ 'f1', 'f2', 'f3' ]
                                },
                                {
                                    caption: 'Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                                    columns: [ 'f4', 'f5', 'f6' ]
                                },
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1_1', f4: 'f4_1_2', f5: 'f5_1_2', f6: 'f6_1_2' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.startsWith('Band1')) {
                        pdfCell.backgroundColor = '#CCFFCC';
                    } else if(pdfCell.text.startsWith('Band1_1')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    } else if(pdfCell.text.startsWith('Band1_2')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    }
                };

                const expectedLog = [
                    'text,F1,25,61,{baseline:middle}',
                    'text,F2,225,61,{baseline:middle}',
                    'text,f1_1_1,25,79.4,{baseline:middle}',
                    'text,f2_1_1,225,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,33.4',
                    'lineTo,25,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,25,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,33.4',
                    'lineTo,425,33.4',
                    'lineTo,425,51.8',
                    'lineTo,25,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,25,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,25,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,225,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,25,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,225,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,25,15,400,18.4',
                    'setLineWidth,1',
                    'rect,25,33.4,400,18.4',
                    'addPage,',
                    'text,F3,25,61,{baseline:middle}',
                    'text,F4,225,61,{baseline:middle}',
                    'text,f3_1_1,25,79.4,{baseline:middle}',
                    'text,f4_1_2,225,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,33.4',
                    'lineTo,225,33.4',
                    'lineTo,225,51.8',
                    'lineTo,25,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-375,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,225,33.4,200,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,225,33.4',
                    'lineTo,425,33.4',
                    'lineTo,425,51.8',
                    'lineTo,225,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,225,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,33.4',
                    'lineTo,25,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-375,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,25,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,225,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,25,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,225,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,25,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,225,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,25,15,400,18.4',
                    'addPage,',
                    'text,F5,25,61,{baseline:middle}',
                    'text,F6,225,61,{baseline:middle}',
                    'text,f5_1_2,25,79.4,{baseline:middle}',
                    'text,f6_1_2,225,79.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,33.4,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,33.4',
                    'lineTo,425,33.4',
                    'lineTo,425,51.8',
                    'lineTo,25,51.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-175,42.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,18.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,33.4',
                    'lineTo,25,33.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-775,24.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,25,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,225,51.8,200,18.4',
                    'setLineWidth,1',
                    'rect,25,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,225,70.2,200,18.4',
                    'setLineWidth,1',
                    'rect,25,33.4,400,18.4',
                    'setLineWidth,1',
                    'rect,25,15,400,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 500, long text, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 500, customMargin: { left: 15 } });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11',
                            columns: [
                                {
                                    caption: 'Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                                    columns: [ 'f1', 'f2', 'f3' ]
                                },
                                {
                                    caption: 'Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5',
                                    columns: [ 'f4', 'f5', 'f6' ]
                                },
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1_1', f2: 'f2_1_1', f3: 'f3_1_1', f4: 'f4_1_2', f5: 'f5_1_2', f6: 'f6_1_2' }],
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text.startsWith('Band1')) {
                        pdfCell.backgroundColor = '#CCFFCC';
                    } else if(pdfCell.text.startsWith('Band1_1')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    } else if(pdfCell.text.startsWith('Band1_2')) {
                        pdfCell.backgroundColor = '#CCCCFF';
                    }
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,F1,30,86,{baseline:middle}',
                    'text,F2,230,86,{baseline:middle}',
                    'text,f1_1_1,30,114.4,{baseline:middle}',
                    'text,f2_1_1,230,114.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,43.4',
                    'lineTo,25,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,30,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,43.4',
                    'lineTo,425,43.4',
                    'lineTo,425,71.8',
                    'lineTo,25,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,30,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,25,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,225,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,25,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,225,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,25,15,400,28.4',
                    'setLineWidth,1',
                    'rect,25,43.4,400,28.4',
                    'addPage,',
                    'text,F3,30,86,{baseline:middle}',
                    'text,F4,230,86,{baseline:middle}',
                    'text,f3_1_1,30,114.4,{baseline:middle}',
                    'text,f4_1_2,230,114.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,43.4',
                    'lineTo,225,43.4',
                    'lineTo,225,71.8',
                    'lineTo,25,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-370,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,225,43.4,200,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,225,43.4',
                    'lineTo,425,43.4',
                    'lineTo,425,71.8',
                    'lineTo,225,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,230,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,43.4',
                    'lineTo,25,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-370,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,25,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,225,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,25,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,225,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,25,43.4,200,28.4',
                    'setLineWidth,1',
                    'rect,225,43.4,200,28.4',
                    'setLineWidth,1',
                    'rect,25,15,400,28.4',
                    'addPage,',
                    'text,F5,30,86,{baseline:middle}',
                    'text,F6,230,86,{baseline:middle}',
                    'text,f5_1_2,30,114.4,{baseline:middle}',
                    'text,f6_1_2,230,114.4,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,43.4,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,43.4',
                    'lineTo,425,43.4',
                    'lineTo,425,71.8',
                    'lineTo,25,71.8',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-170,57.6,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,28.4,F',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,43.4',
                    'lineTo,25,43.4',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-770,29.2,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,25,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,225,71.8,200,28.4',
                    'setLineWidth,1',
                    'rect,25,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,225,100.2,200,28.4',
                    'setLineWidth,1',
                    'rect,25,43.4,400,28.4',
                    'setLineWidth,1',
                    'rect,25,15,400,28.4'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('Splitting - Vertically splitting for merged cells', moduleConfig, () => {
            QUnit.test('2 cols - [band1-[f1], f2], vertical align: top, rowHeight = 30, availablePageHeight = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'text,Band1,10,10,{baseline:top}',
                    'text,F2,160,10,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30',
                    'addPage,',
                    'text,F1,10,10,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - [band1-[f1], f2], vertical align: top, rowHeight = 30, availablePageHeight = 50, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,Band1,15,15,{baseline:top}',
                    'text,F2,165,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30',
                    'addPage,',
                    'text,F1,15,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - [band1-[f1], f2], vertical align: middle, rowHeight = 30, availablePageHeight = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'text,Band1,10,25,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,160,40,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30',
                    'addPage,',
                    'text,F1,10,25,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,160,10,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - [band1-[f1], f2], vertical align: middle, rowHeight = 30, availablePageHeight = 50, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,Band1,15,25,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,40,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30',
                    'addPage,',
                    'text,F1,15,25,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,10,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - [band1-[f1], f2], vertical align: bottom, rowHeight = 30, availablePageHeight = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'text,Band1,10,40,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,160,70,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30',
                    'addPage,',
                    'text,F1,10,40,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,160,40,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - [band1-[f1], f2], vertical align: bottom, rowHeight = 30, availablePageHeight = 50, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,Band1,15,35,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,65,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30',
                    'addPage,',
                    'text,F1,15,35,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,35,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: top, rowHeight = 30, availablePageHeight = 80', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'text,Band1,10,10,{baseline:top}',
                    'text,Band2,10,40,{baseline:top}',
                    'text,F3,310,10,{baseline:top}',
                    'text,F2,160,40,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,300,30',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60',
                    'setLineWidth,1',
                    'rect,160,40,150,30',
                    'addPage,',
                    'text,F1,10,10,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: top, rowHeight = 30, availablePageHeight = 80, topLeft.y = 30', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'text,Band1,10,40,{baseline:top}',
                    'text,F3,310,40,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,40,300,30',
                    'setLineWidth,1',
                    'rect,310,40,150,30',
                    'addPage,',
                    'text,Band2,10,10,{baseline:top}',
                    'text,F2,160,10,{baseline:top}',
                    'text,F1,10,40,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,60',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: top, rowHeight = 30, availablePageHeight = 80, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,Band1,15,15,{baseline:top}',
                    'text,Band2,15,45,{baseline:top}',
                    'text,F3,315,15,{baseline:top}',
                    'text,F2,165,45,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,300,30',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60',
                    'setLineWidth,1',
                    'rect,160,40,150,30',
                    'addPage,',
                    'text,F1,15,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: top, rowHeight = 30, availablePageHeight = 80, topLeft.y = 30, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,Band1,15,45,{baseline:top}',
                    'text,F3,315,45,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,40,300,30',
                    'setLineWidth,1',
                    'rect,310,40,150,30',
                    'addPage,',
                    'text,Band2,15,15,{baseline:top}',
                    'text,F2,165,15,{baseline:top}',
                    'text,F1,15,45,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,60',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: middle, rowHeight = 30, availablePageWidth = 80', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'text,Band1,10,25,{baseline:middle}',
                    'text,Band2,10,55,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,310,55,{baseline:middle}',
                    'restoreGraphicsState,',
                    'saveGraphicsState,',
                    'moveTo,160,40',
                    'lineTo,310,40',
                    'lineTo,310,70',
                    'lineTo,160,70',
                    'clip,',
                    'discardPath,',
                    'text,F2,160,70,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,300,30',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60',
                    'setLineWidth,1',
                    'rect,160,40,150,30',
                    'addPage,',
                    'text,F1,10,25,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,40',
                    'lineTo,310,40',
                    'clip,',
                    'discardPath,',
                    'text,F3,310,-5,{baseline:middle}',
                    'restoreGraphicsState,',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,160,10,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: middle, rowHeight = 30, availablePageWidth = 80, topLeft.y = 30', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'text,Band1,10,55,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,310,40',
                    'lineTo,460,40',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,310,85,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,40,300,30',
                    'setLineWidth,1',
                    'rect,310,40,150,30',
                    'addPage,',
                    'text,Band2,10,25,{baseline:middle}',
                    'text,F2,160,40,{baseline:middle}',
                    'text,F1,10,55,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,310,25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,60',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: middle, rowHeight = 30, availablePageWidth = 80, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,Band1,15,25,{baseline:middle}',
                    'text,Band2,15,55,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,55,{baseline:middle}',
                    'restoreGraphicsState,',
                    'saveGraphicsState,',
                    'moveTo,160,40',
                    'lineTo,310,40',
                    'lineTo,310,70',
                    'lineTo,160,70',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,70,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,300,30',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60',
                    'setLineWidth,1',
                    'rect,160,40,150,30',
                    'addPage,',
                    'text,F1,15,25,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,40',
                    'lineTo,310,40',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,-5,{baseline:middle}',
                    'restoreGraphicsState,',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,10,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: middle, rowHeight = 30, availablePageWidth = 80, topLeft.y = 30, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,Band1,15,55,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,310,40',
                    'lineTo,460,40',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,85,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,40,300,30',
                    'setLineWidth,1',
                    'rect,310,40,150,30',
                    'addPage,',
                    'text,Band2,15,25,{baseline:middle}',
                    'text,F2,165,40,{baseline:middle}',
                    'text,F1,15,55,{baseline:middle}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,60',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: bottom, rowHeight = 30, availablePageWidth = 80', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'text,Band1,10,40,{baseline:bottom}',
                    'text,Band2,10,70,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,310,100,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'saveGraphicsState,',
                    'moveTo,160,40',
                    'lineTo,310,40',
                    'lineTo,310,70',
                    'lineTo,160,70',
                    'clip,',
                    'discardPath,',
                    'text,F2,160,100,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,300,30',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60',
                    'setLineWidth,1',
                    'rect,160,40,150,30',
                    'addPage,',
                    'text,F1,10,40,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,40',
                    'lineTo,310,40',
                    'clip,',
                    'discardPath,',
                    'text,F3,310,40,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,160,40,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: bottom, rowHeight = 30, availablePageWidth = 80, topLeft.y = 30', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'text,Band1,10,70,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,310,40',
                    'lineTo,460,40',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,310,130,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,40,300,30',
                    'setLineWidth,1',
                    'rect,310,40,150,30',
                    'addPage,',
                    'text,Band2,10,40,{baseline:bottom}',
                    'text,F2,160,70,{baseline:bottom}',
                    'text,F1,10,70,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,310,70,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,60',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: bottom, rowHeight = 30, availablePageWidth = 80, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,Band1,15,35,{baseline:bottom}',
                    'text,Band2,15,65,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,95,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'saveGraphicsState,',
                    'moveTo,160,40',
                    'lineTo,310,40',
                    'lineTo,310,70',
                    'lineTo,160,70',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,95,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,300,30',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60',
                    'setLineWidth,1',
                    'rect,160,40,150,30',
                    'addPage,',
                    'text,F1,15,35,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,40',
                    'lineTo,310,40',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,35,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,35,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,30'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: bottom, rowHeight = 30, availablePageWidth = 80, topLeft.y = 30, paddings', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 80, customMargin: 10 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                {
                                    caption: 'Band2', columns: [
                                        'f1'
                                    ]
                                },
                                'f2'
                            ]
                        },
                        'f3'
                    ]
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.padding = 5;
                };

                const expectedLog = [
                    'text,Band1,15,65,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,310,40',
                    'lineTo,460,40',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,125,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,40,300,30',
                    'setLineWidth,1',
                    'rect,310,40,150,30',
                    'addPage,',
                    'text,Band2,15,35,{baseline:bottom}',
                    'text,F2,165,65,{baseline:bottom}',
                    'text,F1,15,65,{baseline:bottom}',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,65,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,1',
                    'rect,10,10,150,30',
                    'setLineWidth,1',
                    'rect,160,10,150,60',
                    'setLineWidth,1',
                    'rect,10,40,150,30',
                    'setLineWidth,1',
                    'rect,310,10,150,60'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('Splitting - Horizontally and vertically splitting for simple cells', moduleConfig, () => {

        });
    }
};

export { JSPdfSplittingTests };
