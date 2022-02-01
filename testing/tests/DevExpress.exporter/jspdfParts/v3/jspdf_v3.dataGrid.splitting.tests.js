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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,10,37.167,210,37.167',
                    'line,10,37.167,10,59.333',
                    'line,10,59.333,210,59.333',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,0,37.167,200,37.167',
                    'line,0,59.333,200,59.333',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,0,37.167,200,37.167',
                    'line,200,37.167,200,59.333',
                    'line,0,59.333,200,59.333',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,10,37.167,210,37.167',
                    'line,10,37.167,10,59.333',
                    'line,10,59.333,210,59.333',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,0,37.167,200,37.167',
                    'line,0,59.333,200,59.333',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,0,37.167,200,37.167',
                    'line,200,37.167,200,59.333',
                    'line,0,59.333,200,59.333',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,48.25,{baseline:middle}',
                    'text,v1_2,15.333,70.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,10,37.167,210,37.167',
                    'line,10,37.167,10,59.333',
                    'line,10,59.333,210,59.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,48.25,{baseline:middle}',
                    'text,v2_2,5.333,70.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,0,15,200,15',
                    'line,0,15,0,37.167',
                    'line,200,15,200,37.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,0,59.333,0,81.5',
                    'line,200,59.333,200,81.5',
                    'line,0,81.5,200,81.5',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,48.25,{baseline:middle}',
                    'text,v3_2,5.333,70.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,0,37.167,200,37.167',
                    'line,200,37.167,200,59.333',
                    'line,0,59.333,200,59.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,100,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,100,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,100,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,48.25,{baseline:middle}',
                    'text,v2_1,215.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,37.167,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,30.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,30.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,20.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,20.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,20.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,20.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setFontSize,10',
                    'text,v1_1,15.333,25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,200,30',
                    'addPage,',
                    'text,v2_1,15.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,200,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setFontSize,10',
                    'text,v1_1,15.333,25,{baseline:middle}',
                    'text,v1_2,215.333,25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,10,200,30',
                    'addPage,',
                    'text,v2_1,15.333,15,{baseline:middle}',
                    'text,v2_2,215.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,0,200,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v1_2,302.973,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'text,v2_2,302.973,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v1_2,302.973,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,45,{baseline:middle}',
                    'text,v2_2,302.973,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setFontSize,10',
                    'text,v1_1,15.333,25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,200,30',
                    'addPage,',
                    'text,v2_1,15.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,200,30',
                    'addPage,',
                    'text,v3_1,15.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,200,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setFontSize,10',
                    'text,v1_1,15.333,25,{baseline:middle}',
                    'text,v2_1,15.333,55,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,200,30',
                    'addPage,',
                    'text,v3_1,15.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,200,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,595.28,30',
                    'addPage,',
                    'text,v3_1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

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

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,595.28,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,595.28,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,595.28,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setFontSize,10',
                    'text,v1_1,15.333,25,{baseline:middle}',
                    'text,v1_2,215.333,25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,10,200,30',
                    'addPage,',
                    'text,v2_1,15.333,15,{baseline:middle}',
                    'text,v2_2,215.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,0,200,30',
                    'addPage,',
                    'text,v3_1,15.333,15,{baseline:middle}',
                    'text,v3_2,215.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,0,200,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v1_2,302.973,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'text,v2_2,302.973,15,{baseline:middle}',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'text,v3_2,302.973,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v1_2,302.973,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,45,{baseline:middle}',
                    'text,v2_2,302.973,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'text,v3_2,302.973,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setFontSize,10',
                    'text,v1_1,15.333,25,{baseline:middle}',
                    'text,v1_2,215.333,25,{baseline:middle}',
                    'text,v2_1,15.333,55,{baseline:middle}',
                    'text,v2_2,215.333,55,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,10,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,40,200,30',
                    'addPage,',
                    'text,v3_1,15.333,15,{baseline:middle}',
                    'text,v3_2,215.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,0,200,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v1_2,302.973,45,{baseline:middle}',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'text,v2_2,302.973,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,60,297.64,30',
                    'addPage,',
                    'text,v3_1,5.333,15,{baseline:middle}',
                    'text,v3_2,302.973,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v1_2,302.973,45,{baseline:middle}',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'text,v2_2,302.973,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,60,297.64,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'text,v3_2,302.973,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,30,297.64,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15.333,70.417,{baseline:middle}',
                    'text,f2_2,15.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,37.167,200,22.167,F',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F3,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,5.333,70.417,{baseline:middle}',
                    'text,f2_3,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,200,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15.333,70.417,{baseline:middle}',
                    'text,f2_2,15.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,37.167,200,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,210,37.167',
                    'lineTo,210,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_longtext_longtext_longtext,15.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F3,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,5.333,70.417,{baseline:middle}',
                    'text,f2_3,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,200,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_longtext_longtext_longtext,-194.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15,68.75,{baseline:middle}',
                    'text,f2_2,15,90.25,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,36.5,200,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,36.5',
                    'lineTo,210,36.5',
                    'lineTo,210,58',
                    'lineTo,10,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_longtext_longtext_longtext,15,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,200,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F3,5,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,5,68.75,{baseline:middle}',
                    'text,f2_3,5,90.25,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,36.5,200,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,200,36.5',
                    'lineTo,200,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_longtext_longtext_longtext,-195,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,200,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15.333,70.417,{baseline:middle}',
                    'text,f1_3,215.333,70.417,{baseline:middle}',
                    'text,f2_2,15.333,92.583,{baseline:middle}',
                    'text,f2_3,215.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F4,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,5.333,70.417,{baseline:middle}',
                    'text,f2_3,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,200,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15.333,70.417,{baseline:middle}',
                    'text,f1_3,215.333,70.417,{baseline:middle}',
                    'text,f2_2,15.333,92.583,{baseline:middle}',
                    'text,f2_3,215.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F4,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,5.333,70.417,{baseline:middle}',
                    'text,f2_3,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,200,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-394.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15,68.75,{baseline:middle}',
                    'text,f1_3,215,68.75,{baseline:middle}',
                    'text,f2_2,15,90.25,{baseline:middle}',
                    'text,f2_3,215,90.25,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,36.5',
                    'lineTo,410,36.5',
                    'lineTo,410,58',
                    'lineTo,10,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F4,5,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,5,68.75,{baseline:middle}',
                    'text,f2_3,5,90.25,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,36.5,200,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,200,36.5',
                    'lineTo,200,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-395,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,200,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15.333,70.417,{baseline:middle}',
                    'text,f1_3,215.333,70.417,{baseline:middle}',
                    'text,f2_2,15.333,92.583,{baseline:middle}',
                    'text,f2_3,215.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F4,5.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,205.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_4,5.333,70.417,{baseline:middle}',
                    'text,f1_5,205.333,70.417,{baseline:middle}',
                    'text,f2_4,5.333,92.583,{baseline:middle}',
                    'text,f2_5,205.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,400,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15.333,70.417,{baseline:middle}',
                    'text,f1_3,215.333,70.417,{baseline:middle}',
                    'text,f2_2,15.333,92.583,{baseline:middle}',
                    'text,f2_3,215.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F4,5.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,205.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_4,5.333,70.417,{baseline:middle}',
                    'text,f1_5,205.333,70.417,{baseline:middle}',
                    'text,f2_4,5.333,92.583,{baseline:middle}',
                    'text,f2_5,205.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-394.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15,68.75,{baseline:middle}',
                    'text,f1_3,215,68.75,{baseline:middle}',
                    'text,f2_2,15,90.25,{baseline:middle}',
                    'text,f2_3,215,90.25,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,36.5',
                    'lineTo,410,36.5',
                    'lineTo,410,58',
                    'lineTo,10,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F4,5,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,205,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_4,5,68.75,{baseline:middle}',
                    'text,f1_5,205,68.75,{baseline:middle}',
                    'text,f2_4,5,90.25,{baseline:middle}',
                    'text,f2_5,205,90.25,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,400,36.5',
                    'lineTo,400,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-395,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,400,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15.333,70.417,{baseline:middle}',
                    'text,f1_3,215.333,70.417,{baseline:middle}',
                    'text,f2_2,15.333,92.583,{baseline:middle}',
                    'text,f2_3,215.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F4,5.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,205.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_4,5.333,70.417,{baseline:middle}',
                    'text,f1_5,205.333,70.417,{baseline:middle}',
                    'text,f2_4,5.333,92.583,{baseline:middle}',
                    'text,f2_5,205.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,400,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F6,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_6,5.333,70.417,{baseline:middle}',
                    'text,f2_6,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,200,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15.333,70.417,{baseline:middle}',
                    'text,f1_3,215.333,70.417,{baseline:middle}',
                    'text,f2_2,15.333,92.583,{baseline:middle}',
                    'text,f2_3,215.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F4,5.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,205.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_4,5.333,70.417,{baseline:middle}',
                    'text,f1_5,205.333,70.417,{baseline:middle}',
                    'text,f2_4,5.333,92.583,{baseline:middle}',
                    'text,f2_5,205.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-394.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F6,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_6,5.333,70.417,{baseline:middle}',
                    'text,f2_6,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,37.167,200,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-794.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_2,15,68.75,{baseline:middle}',
                    'text,f1_3,215,68.75,{baseline:middle}',
                    'text,f2_2,15,90.25,{baseline:middle}',
                    'text,f2_3,215,90.25,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,36.5',
                    'lineTo,410,36.5',
                    'lineTo,410,58',
                    'lineTo,10,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F4,5,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,205,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_4,5,68.75,{baseline:middle}',
                    'text,f1_5,205,68.75,{baseline:middle}',
                    'text,f2_4,5,90.25,{baseline:middle}',
                    'text,f2_5,205,90.25,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,400,36.5',
                    'lineTo,400,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-395,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F6,5,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_6,5,68.75,{baseline:middle}',
                    'text,f2_6,5,90.25,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,36.5,200,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,200,36.5',
                    'lineTo,200,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-795,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,200,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,15.333,92.583,{baseline:middle}',
                    'text,f1_4,215.333,92.583,{baseline:middle}',
                    'text,f2_3,15.333,114.75,{baseline:middle}',
                    'text,f2_4,215.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,15.333,48.25,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,59.333,400,22.167,F',
                    'text,F2: f2,15.333,70.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F5,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_5,5.333,92.583,{baseline:middle}',
                    'text,f2_5,5.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,200,22.167,F',
                    'setFillColor,#CCCCFF',
                    'rect,0,59.333,200,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,15.333,92.583,{baseline:middle}',
                    'text,f1_4,215.333,92.583,{baseline:middle}',
                    'text,f2_3,15.333,114.75,{baseline:middle}',
                    'text,f2_4,215.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,59.333,400,22.167,F',
                    'saveGraphicsState,',
                    'moveTo,10,59.333',
                    'lineTo,410,59.333',
                    'lineTo,410,81.5',
                    'lineTo,10,81.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15.333,70.417,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F5,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_5,5.333,92.583,{baseline:middle}',
                    'text,f2_5,5.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,200,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-394.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,0,59.333,200,22.167,F',
                    'saveGraphicsState,',
                    'moveTo,0,59.333',
                    'lineTo,200,59.333',
                    'lineTo,200,81.5',
                    'lineTo,0,81.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-394.667,70.417,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,15,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,215,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,15,90.25,{baseline:middle}',
                    'text,f1_4,215,90.25,{baseline:middle}',
                    'text,f2_3,15,111.75,{baseline:middle}',
                    'text,f2_4,215,111.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,36.5',
                    'lineTo,410,36.5',
                    'lineTo,410,58',
                    'lineTo,10,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,58,400,21.5,F',
                    'saveGraphicsState,',
                    'moveTo,10,58',
                    'lineTo,410,58',
                    'lineTo,410,79.5',
                    'lineTo,10,79.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,68.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,400,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F5,5,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_5,5,90.25,{baseline:middle}',
                    'text,f2_5,5,111.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,36.5,200,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,200,36.5',
                    'lineTo,200,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-395,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,0,58,200,21.5,F',
                    'saveGraphicsState,',
                    'moveTo,0,58',
                    'lineTo,200,58',
                    'lineTo,200,79.5',
                    'lineTo,0,79.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-395,68.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,15.333,92.583,{baseline:middle}',
                    'text,f1_4,215.333,92.583,{baseline:middle}',
                    'text,f2_3,15.333,114.75,{baseline:middle}',
                    'text,f2_4,215.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,15.333,48.25,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,59.333,400,22.167,F',
                    'text,F2: f2,15.333,70.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F5,5.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,205.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_5,5.333,92.583,{baseline:middle}',
                    'text,f1_6,205.333,92.583,{baseline:middle}',
                    'text,f2_5,5.333,114.75,{baseline:middle}',
                    'text,f2_6,205.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,400,22.167,F',
                    'setFillColor,#CCCCFF',
                    'rect,0,59.333,400,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,15.333,92.583,{baseline:middle}',
                    'text,f1_4,215.333,92.583,{baseline:middle}',
                    'text,f2_3,15.333,114.75,{baseline:middle}',
                    'text,f2_4,215.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,59.333,400,22.167,F',
                    'saveGraphicsState,',
                    'moveTo,10,59.333',
                    'lineTo,410,59.333',
                    'lineTo,410,81.5',
                    'lineTo,10,81.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15.333,70.417,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F5,5.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,205.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_5,5.333,92.583,{baseline:middle}',
                    'text,f1_6,205.333,92.583,{baseline:middle}',
                    'text,f2_5,5.333,114.75,{baseline:middle}',
                    'text,f2_6,205.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-394.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,0,59.333,400,22.167,F',
                    'saveGraphicsState,',
                    'moveTo,0,59.333',
                    'lineTo,400,59.333',
                    'lineTo,400,81.5',
                    'lineTo,0,81.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-394.667,70.417,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,400,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,15,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,215,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,15,90.25,{baseline:middle}',
                    'text,f1_4,215,90.25,{baseline:middle}',
                    'text,f2_3,15,111.75,{baseline:middle}',
                    'text,f2_4,215,111.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,36.5',
                    'lineTo,410,36.5',
                    'lineTo,410,58',
                    'lineTo,10,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,58,400,21.5,F',
                    'saveGraphicsState,',
                    'moveTo,10,58',
                    'lineTo,410,58',
                    'lineTo,410,79.5',
                    'lineTo,10,79.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,68.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,400,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F5,5,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,205,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_5,5,90.25,{baseline:middle}',
                    'text,f1_6,205,90.25,{baseline:middle}',
                    'text,f2_5,5,111.75,{baseline:middle}',
                    'text,f2_6,205,111.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,400,36.5',
                    'lineTo,400,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-395,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,0,58,400,21.5,F',
                    'saveGraphicsState,',
                    'moveTo,0,58',
                    'lineTo,400,58',
                    'lineTo,400,79.5',
                    'lineTo,0,79.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-395,68.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,400,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,400,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,15.333,92.583,{baseline:middle}',
                    'text,f1_4,215.333,92.583,{baseline:middle}',
                    'text,f2_3,15.333,114.75,{baseline:middle}',
                    'text,f2_4,215.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,15.333,48.25,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,59.333,400,22.167,F',
                    'text,F2: f2,15.333,70.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F5,5.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,205.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_5,5.333,92.583,{baseline:middle}',
                    'text,f1_6,205.333,92.583,{baseline:middle}',
                    'text,f2_5,5.333,114.75,{baseline:middle}',
                    'text,f2_6,205.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,400,22.167,F',
                    'setFillColor,#CCCCFF',
                    'rect,0,59.333,400,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F7,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_7,5.333,92.583,{baseline:middle}',
                    'text,f2_7,5.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,200,22.167,F',
                    'setFillColor,#CCCCFF',
                    'rect,0,59.333,200,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,15.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,215.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,15.333,92.583,{baseline:middle}',
                    'text,f1_4,215.333,92.583,{baseline:middle}',
                    'text,f2_3,15.333,114.75,{baseline:middle}',
                    'text,f2_4,215.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,59.333,400,22.167,F',
                    'saveGraphicsState,',
                    'moveTo,10,59.333',
                    'lineTo,410,59.333',
                    'lineTo,410,81.5',
                    'lineTo,10,81.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15.333,70.417,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F5,5.333,26.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,205.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_5,5.333,92.583,{baseline:middle}',
                    'text,f1_6,205.333,92.583,{baseline:middle}',
                    'text,f2_5,5.333,114.75,{baseline:middle}',
                    'text,f2_6,205.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,400,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-394.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,0,59.333,400,22.167,F',
                    'saveGraphicsState,',
                    'moveTo,0,59.333',
                    'lineTo,400,59.333',
                    'lineTo,400,81.5',
                    'lineTo,0,81.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-394.667,70.417,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F7,5.333,26.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_7,5.333,92.583,{baseline:middle}',
                    'text,f2_7,5.333,114.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,200,22.167,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-794.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,0,59.333,200,22.167,F',
                    'saveGraphicsState,',
                    'moveTo,0,59.333',
                    'lineTo,200,59.333',
                    'lineTo,200,81.5',
                    'lineTo,0,81.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-794.667,70.417,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,103.667,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,15,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,215,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_3,15,90.25,{baseline:middle}',
                    'text,f1_4,215,90.25,{baseline:middle}',
                    'text,f2_3,15,111.75,{baseline:middle}',
                    'text,f2_4,215,111.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,36.5',
                    'lineTo,410,36.5',
                    'lineTo,410,58',
                    'lineTo,10,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,58,400,21.5,F',
                    'saveGraphicsState,',
                    'moveTo,10,58',
                    'lineTo,410,58',
                    'lineTo,410,79.5',
                    'lineTo,10,79.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,15,68.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,400,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F5,5,25.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,205,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_5,5,90.25,{baseline:middle}',
                    'text,f1_6,205,90.25,{baseline:middle}',
                    'text,f2_5,5,111.75,{baseline:middle}',
                    'text,f2_6,205,111.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,36.5,400,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,400,36.5',
                    'lineTo,400,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-395,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,0,58,400,21.5,F',
                    'saveGraphicsState,',
                    'moveTo,0,58',
                    'lineTo,400,58',
                    'lineTo,400,79.5',
                    'lineTo,0,79.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-395,68.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,400,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F7,5,25.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_7,5,90.25,{baseline:middle}',
                    'text,f2_7,5,111.75,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,36.5,200,21.5,F',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,200,36.5',
                    'lineTo,200,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,F1: f1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-795,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,0,58,200,21.5,F',
                    'saveGraphicsState,',
                    'moveTo,0,58',
                    'lineTo,200,58',
                    'lineTo,200,79.5',
                    'lineTo,0,79.5',
                    'clip,',
                    'discardPath,',
                    'text,F2: f2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6,-795,68.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,101,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]], columnWidth = 200, availablePageWidth = 300, horizontalAlign = left', function(assert) {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,48.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,15.333,70.417,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,22.167,F',
                    'setTextColor,128',
                    'text,Band1,15.333,26.083,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,48.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f2_1,5.333,70.417,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,15,200,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]], columnWidth = 200, availablePageWidth = 300, horizontalAlign = center', function(assert) {
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
                    pdfCell.horizontalAlign = 'center';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,110,48.25,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f1_1,110,70.417,{baseline:middle,align:center}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,210,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,100,48.25,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f2_1,100,70.417,{baseline:middle,align:center}',
                    'setFillColor,#CCCCCC',
                    'rect,0,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,0,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]], columnWidth = 200, availablePageWidth = 300, horizontalAlign = right', function(assert) {
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
                    pdfCell.horizontalAlign = 'right';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,204.667,48.25,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f1_1,204.667,70.417,{baseline:middle,align:right}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,404.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,194.667,48.25,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f2_1,194.667,70.417,{baseline:middle,align:right}',
                    'setFillColor,#CCCCCC',
                    'rect,0,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,194.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,48.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,15.333,70.417,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,15.333,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,48.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f2_1,5.333,70.417,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,-194.667,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15,47.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,15,68.75,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,10,15,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,36.5',
                    'lineTo,10,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,15,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5,47.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f2_1,5,68.75,{baseline:middle}',
                    'setFillColor,#CCCCCC',
                    'rect,0,15,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,36.5',
                    'lineTo,0,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,-195,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]], columnWidth = 200, availablePageWidth = 300, horizontalAlign = left', function(assert) {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,15.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,22.167,F',
                    'setTextColor,128',
                    'text,Band1,15.333,26.083,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,37.167,200,22.167,F',
                    'setTextColor,128',
                    'text,Band1_1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f2_1_1,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,0,37.167,200,22.167,F',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,59.333,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f3_1,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]], columnWidth = 200, availablePageWidth = 300, horizontalAlign = center', function(assert) {
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
                    pdfCell.horizontalAlign = 'center';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,110,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f1_1_1,110,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,310,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,210,37.167',
                    'lineTo,210,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,210,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,100,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f2_1_1,100,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCCCFF',
                    'rect,0,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,0,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,100,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,100,59.333,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f3_1,100,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,-100,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2], f3]], columnWidth = 200, availablePageWidth = 300, horizontalAlign = right', function(assert) {
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
                    pdfCell.horizontalAlign = 'right';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,204.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f1_1_1,204.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,604.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,210,37.167',
                    'lineTo,210,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,404.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,194.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f2_1_1,194.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCCCFF',
                    'rect,0,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,194.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,394.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,194.667,59.333,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f3_1,194.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,194.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,15.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,15.333,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,210,37.167',
                    'lineTo,210,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3,15.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f2_1_1,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3,-194.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-194.667,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,59.333,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f3_1,5.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-394.667,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,44.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15,68.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,15,90.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,210,15',
                    'lineTo,210,36.5',
                    'lineTo,10,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,15,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,36.5,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,36.5',
                    'lineTo,210,36.5',
                    'lineTo,210,58',
                    'lineTo,10,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3,15,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,200,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5,68.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f2_1_1,5,90.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,36.5,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,200,36.5',
                    'lineTo,200,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3,-195,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,36.5',
                    'lineTo,0,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-195,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5,58,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f3_1,5,90.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,200,15',
                    'lineTo,200,36.5',
                    'lineTo,0,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-395,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,200,43',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,200,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], columnWidth = 200, availablePageWidth = 500, horizontalAlign = left', function(assert) {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,215.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,15.333,92.583,{baseline:middle}',
                    'text,f2_1_1,215.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,22.167,F',
                    'setTextColor,128',
                    'text,Band1,15.333,26.083,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,10,37.167,400,22.167,F',
                    'setTextColor,128',
                    'text,Band1_1,15.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,205.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f3_1_1,5.333,92.583,{baseline:middle}',
                    'text,f4_1_2,205.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,0,37.167,200,22.167,F',
                    'setFillColor,#CCCCFF',
                    'rect,200,37.167,200,22.167,F',
                    'setTextColor,128',
                    'text,Band1_2,205.333,48.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,5.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,205.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f5_1_2,5.333,92.583,{baseline:middle}',
                    'text,f6_1_2,205.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,0,37.167,400,22.167,F',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], columnWidth = 200, availablePageWidth = 500, horizontalAlign = center', function(assert) {
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
                    pdfCell.horizontalAlign = 'center';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,110,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F2,310,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f1_1_1,110,92.583,{baseline:middle,align:center}',
                    'text,f2_1_1,310,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,610,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,310,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,100,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F4,300,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f3_1_1,100,92.583,{baseline:middle,align:center}',
                    'text,f4_1_2,300,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCCCFF',
                    'rect,0,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,-100,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,200,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,200,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,200,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2,500,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,200,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,100,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F6,300,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f5_1_2,100,92.583,{baseline:middle,align:center}',
                    'text,f6_1_2,300,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCCCFF',
                    'rect,0,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2,100,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,-200,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], columnWidth = 200, availablePageWidth = 500, horizontalAlign = right', function(assert) {
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
                    pdfCell.horizontalAlign = 'right';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,204.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F2,404.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f1_1_1,204.667,92.583,{baseline:middle,align:right}',
                    'text,f2_1_1,404.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,1204.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,10,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,604.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,194.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F4,394.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f3_1_1,194.667,92.583,{baseline:middle,align:right}',
                    'text,f4_1_2,394.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCCCFF',
                    'rect,0,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,194.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,200,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,200,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,200,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2,794.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,794.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,194.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F6,394.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f5_1_2,194.667,92.583,{baseline:middle,align:right}',
                    'text,f6_1_2,394.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCCCFF',
                    'rect,0,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2,394.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,394.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], columnWidth = 200, availablePageWidth = 500, long text, horizontalAlign = left', function(assert) {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,215.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,15.333,92.583,{baseline:middle}',
                    'text,f2_1_1,215.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,15.333,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,15.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,205.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f3_1_1,5.333,92.583,{baseline:middle}',
                    'text,f4_1_2,205.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-394.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,200,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,200,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,200,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,205.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-394.667,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,5.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,205.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f5_1_2,5.333,92.583,{baseline:middle}',
                    'text,f6_1_2,205.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-194.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-794.667,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], columnWidth = 200, availablePageWidth = 500, long text, horizontalAlign = center', function(assert) {
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
                    pdfCell.horizontalAlign = 'center';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,110,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F2,310,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f1_1_1,110,92.583,{baseline:middle,align:center}',
                    'text,f2_1_1,310,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,610,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,310,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,100,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F4,300,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f3_1_1,100,92.583,{baseline:middle,align:center}',
                    'text,f4_1_2,300,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-100,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,200,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,200,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,200,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,500,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,200,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,100,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F6,300,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f5_1_2,100,92.583,{baseline:middle,align:center}',
                    'text,f6_1_2,300,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,100,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-200,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], columnWidth = 200, availablePageWidth = 500, long text, horizontalAlign = right', function(assert) {
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
                    pdfCell.horizontalAlign = 'right';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,204.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F2,404.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f1_1_1,204.667,92.583,{baseline:middle,align:right}',
                    'text,f2_1_1,404.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,37.167',
                    'lineTo,10,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,1204.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,37.167',
                    'lineTo,410,37.167',
                    'lineTo,410,59.333',
                    'lineTo,10,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,604.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,194.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F4,394.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f3_1_1,194.667,92.583,{baseline:middle,align:right}',
                    'text,f4_1_2,394.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,200,37.167',
                    'lineTo,200,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,194.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,200,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,200,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,200,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,794.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,794.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,194.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F6,394.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f5_1_2,194.667,92.583,{baseline:middle,align:right}',
                    'text,f6_1_2,394.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,0,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,37.167',
                    'lineTo,400,37.167',
                    'lineTo,400,59.333',
                    'lineTo,0,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,394.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,37.167',
                    'lineTo,0,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,394.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15,68.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,215,68.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,15,90.25,{baseline:middle}',
                    'text,f2_1_1,215,90.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,10,15,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,15',
                    'lineTo,410,15',
                    'lineTo,410,36.5',
                    'lineTo,10,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,15,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,10,36.5,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,36.5',
                    'lineTo,410,36.5',
                    'lineTo,410,58',
                    'lineTo,10,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,15,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,15,400,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,36.5,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5,68.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,205,68.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f3_1_1,5,90.25,{baseline:middle}',
                    'text,f4_1_2,205,90.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,36.5,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,200,36.5',
                    'lineTo,200,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-395,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,200,36.5,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,200,36.5',
                    'lineTo,400,36.5',
                    'lineTo,400,58',
                    'lineTo,200,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,205,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,36.5',
                    'lineTo,0,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-395,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,36.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,5,68.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,205,68.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f5_1_2,5,90.25,{baseline:middle}',
                    'text,f6_1_2,205,90.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,0,36.5,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,36.5',
                    'lineTo,400,36.5',
                    'lineTo,400,58',
                    'lineTo,0,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-195,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,0,15,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,15',
                    'lineTo,400,15',
                    'lineTo,400,36.5',
                    'lineTo,0,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-795,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,36.5,400,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,15,400,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 500, horizontalAlign = left', function(assert) {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,30.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,230.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,30.333,92.583,{baseline:middle}',
                    'text,f2_1_1,230.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,22.167,F',
                    'setTextColor,128',
                    'text,Band1,30.333,26.083,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,25,37.167,400,22.167,F',
                    'setTextColor,128',
                    'text,Band1_1,30.333,48.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,20.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,220.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f3_1_1,20.333,92.583,{baseline:middle}',
                    'text,f4_1_2,220.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,15,37.167,200,22.167,F',
                    'setFillColor,#CCCCFF',
                    'rect,215,37.167,200,22.167,F',
                    'setTextColor,128',
                    'text,Band1_2,220.333,48.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,20.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,220.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f5_1_2,20.333,92.583,{baseline:middle}',
                    'text,f6_1_2,220.333,92.583,{baseline:middle}',
                    'setFillColor,#CCCCFF',
                    'rect,15,37.167,400,22.167,F',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 500, horizontalAlign = center', function(assert) {
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
                    pdfCell.horizontalAlign = 'center';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,125,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F2,325,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f1_1_1,125,92.583,{baseline:middle,align:center}',
                    'text,f2_1_1,325,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,37.167',
                    'lineTo,25,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,625,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,25,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,37.167',
                    'lineTo,425,37.167',
                    'lineTo,425,59.333',
                    'lineTo,25,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,325,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,115,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F4,315,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f3_1_1,115,92.583,{baseline:middle,align:center}',
                    'text,f4_1_2,315,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCCCFF',
                    'rect,15,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,215,37.167',
                    'lineTo,215,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,-85,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,215,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,215,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,215,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2,515,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,215,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,115,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F6,315,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f5_1_2,115,92.583,{baseline:middle,align:center}',
                    'text,f6_1_2,315,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCCCFF',
                    'rect,15,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2,115,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,-185,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 500, horizontalAlign = right', function(assert) {
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
                    pdfCell.horizontalAlign = 'right';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,219.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F2,419.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f1_1_1,219.667,92.583,{baseline:middle,align:right}',
                    'text,f2_1_1,419.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,37.167',
                    'lineTo,25,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,1219.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,25,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,37.167',
                    'lineTo,425,37.167',
                    'lineTo,425,59.333',
                    'lineTo,25,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,619.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,209.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F4,409.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f3_1_1,209.667,92.583,{baseline:middle,align:right}',
                    'text,f4_1_2,409.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCCCFF',
                    'rect,15,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,215,37.167',
                    'lineTo,215,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1,209.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCCCFF',
                    'rect,215,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,215,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,215,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2,809.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,809.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,209.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F6,409.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f5_1_2,209.667,92.583,{baseline:middle,align:right}',
                    'text,f6_1_2,409.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCCCFF',
                    'rect,15,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2,409.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1,409.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 500, long text, horizontalAlign = left', function(assert) {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,30.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,230.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,30.333,92.583,{baseline:middle}',
                    'text,f2_1_1,230.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,37.167',
                    'lineTo,25,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,30.333,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,37.167',
                    'lineTo,425,37.167',
                    'lineTo,425,59.333',
                    'lineTo,25,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,30.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,20.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,220.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f3_1_1,20.333,92.583,{baseline:middle}',
                    'text,f4_1_2,220.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,15,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,215,37.167',
                    'lineTo,215,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-379.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,215,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,215,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,215,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,220.333,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-379.667,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,20.333,70.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,220.333,70.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f5_1_2,20.333,92.583,{baseline:middle}',
                    'text,f6_1_2,220.333,92.583,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,15,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-179.667,48.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-779.667,26.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 500, long text, horizontalAlign = center', function(assert) {
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
                    pdfCell.horizontalAlign = 'center';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,125,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F2,325,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f1_1_1,125,92.583,{baseline:middle,align:center}',
                    'text,f2_1_1,325,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,37.167',
                    'lineTo,25,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,625,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,37.167',
                    'lineTo,425,37.167',
                    'lineTo,425,59.333',
                    'lineTo,25,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,325,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,115,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F4,315,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f3_1_1,115,92.583,{baseline:middle,align:center}',
                    'text,f4_1_2,315,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,15,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,215,37.167',
                    'lineTo,215,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-85,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,215,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,215,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,215,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,515,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,215,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,115,70.417,{baseline:middle,align:center}',
                    'setTextColor,128',
                    'text,F6,315,70.417,{baseline:middle,align:center}',
                    'setTextColor,#000000',
                    'text,f5_1_2,115,92.583,{baseline:middle,align:center}',
                    'text,f6_1_2,315,92.583,{baseline:middle,align:center}',
                    'setFillColor,#CCFFCC',
                    'rect,15,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,115,48.25,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-185,26.083,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[band1_1-[f1, f2, f3], band1_2-[f4, f5, f6]]], topLeft.x = 10, margin.left = 15, columnWidth = 200, availablePageWidth = 500, long text, horizontalAlign = right', function(assert) {
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
                    pdfCell.horizontalAlign = 'right';
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,219.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F2,419.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f1_1_1,219.667,92.583,{baseline:middle,align:right}',
                    'text,f2_1_1,419.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,37.167',
                    'lineTo,25,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,1219.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,37.167',
                    'lineTo,425,37.167',
                    'lineTo,425,59.333',
                    'lineTo,25,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,619.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,15,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,37.167,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,209.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F4,409.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f3_1_1,209.667,92.583,{baseline:middle,align:right}',
                    'text,f4_1_2,409.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,15,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,215,37.167',
                    'lineTo,215,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,209.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,215,37.167,200,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,215,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,215,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,809.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,809.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,37.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,209.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,128',
                    'text,F6,409.667,70.417,{baseline:middle,align:right}',
                    'setTextColor,#000000',
                    'text,f5_1_2,209.667,92.583,{baseline:middle,align:right}',
                    'text,f6_1_2,409.667,92.583,{baseline:middle,align:right}',
                    'setFillColor,#CCFFCC',
                    'rect,15,37.167,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,37.167',
                    'lineTo,415,37.167',
                    'lineTo,415,59.333',
                    'lineTo,15,59.333',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,409.667,48.25,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,22.167,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,37.167',
                    'lineTo,15,37.167',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,409.667,26.083,{baseline:middle,align:right}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,59.333,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,81.5,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,37.167,400,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,30,68.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,230,68.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1_1,30,90.25,{baseline:middle}',
                    'text,f2_1_1,230,90.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,25,15,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,15',
                    'lineTo,425,15',
                    'lineTo,425,36.5',
                    'lineTo,25,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,30,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,25,36.5,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,25,36.5',
                    'lineTo,425,36.5',
                    'lineTo,425,58',
                    'lineTo,25,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,30,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,225,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,15,400,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,25,36.5,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,20,68.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,220,68.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f3_1_1,20,90.25,{baseline:middle}',
                    'text,f4_1_2,220,90.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,15,36.5,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,36.5',
                    'lineTo,215,36.5',
                    'lineTo,215,58',
                    'lineTo,15,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-380,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,215,36.5,200,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,215,36.5',
                    'lineTo,415,36.5',
                    'lineTo,415,58',
                    'lineTo,215,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,220,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,36.5',
                    'lineTo,15,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-380,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,36.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,36.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,21.5',
                    'addPage,',
                    'setTextColor,128',
                    'text,F5,20,68.75,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,220,68.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f5_1_2,20,90.25,{baseline:middle}',
                    'text,f6_1_2,220,90.25,{baseline:middle}',
                    'setFillColor,#CCFFCC',
                    'rect,15,36.5,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,36.5',
                    'lineTo,415,36.5',
                    'lineTo,415,58',
                    'lineTo,15,58',
                    'clip,',
                    'discardPath,',
                    'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-180,47.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setFillColor,#CCFFCC',
                    'rect,15,15,400,21.5,F',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,15,15',
                    'lineTo,415,15',
                    'lineTo,415,36.5',
                    'lineTo,15,36.5',
                    'clip,',
                    'discardPath,',
                    'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-780,25.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,58,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,215,79.5,200,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,36.5,400,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,15,15,400,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165.333,15.333,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15.333,45.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15.333,85.333,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,80,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15,15,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165,15,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15,15,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165,15,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15,45,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15,85,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,80,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,25,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165.333,40,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165.333,40,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,95,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,80',
                    'lineTo,310,80',
                    'lineTo,310,110',
                    'lineTo,160,110',
                    'clip,',
                    'discardPath,',
                    'text,F2,165.333,80,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,80,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15,25,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,40,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15,25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165,40,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15,95,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,80',
                    'lineTo,310,80',
                    'lineTo,310,110',
                    'lineTo,160,110',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,80,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,80,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,34.667,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165.333,64.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,34.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165.333,64.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15.333,64.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15.333,104.667,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,80',
                    'lineTo,310,80',
                    'lineTo,310,110',
                    'lineTo,160,110',
                    'clip,',
                    'discardPath,',
                    'text,F2,165.333,104.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,80,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - [band1-[f1], f2], rowHeight = 30, availablePageHeight = 90, repeatHeaders: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 90 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,30,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,75,{baseline:middle}',
                    'text,v1_2,302.973,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,60,297.64,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'text,v2_2,302.973,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - [band1-[f1], f2], rowHeight = 30, availablePageHeight = 90, repeatHeaders: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 90 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,30,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,75,{baseline:middle}',
                    'text,v1_2,302.973,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,60,297.64,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,30,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'text,v2_2,302.973,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,0,297.64,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,297.64,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,60,297.64,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15,35,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,10',
                    'lineTo,310,10',
                    'lineTo,310,40',
                    'lineTo,160,40',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,65,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15,35,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165,65,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15,65,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15,105,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,80',
                    'lineTo,310,80',
                    'lineTo,310,110',
                    'lineTo,160,110',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,105,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,80,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: top, rowHeight = 30, availablePageHeight = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50, customMargin: 10 });

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315.333,15.333,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15.333,45.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165.333,45.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15.333,75.333,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15.333,115.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165.333,115.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15.333,145.333,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,140,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15.333,45.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165.333,45.333,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15.333,45.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165.333,45.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15.333,75.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15.333,115.333,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,45.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315.333,45.333,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315.333,15.333,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15.333,45.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165.333,45.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15.333,75.333,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15.333,115.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165.333,115.333,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15.333,145.333,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,140,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15,15,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15,45,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315,15,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165,45,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15,15,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315,15,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15,45,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165,45,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15,75,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15,115,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15,45,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315,45,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15,15,{baseline:top}',
                    'setTextColor,128',
                    'text,F3,315,15,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15,45,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165,45,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15,75,{baseline:top}',
                    'setTextColor,128',
                    'text,Band2,15,115,{baseline:top}',
                    'setTextColor,128',
                    'text,F2,165,115,{baseline:top}',
                    'setTextColor,128',
                    'text,F1,15,145,{baseline:top}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,140,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: middle, rowHeight = 30, availablePageWidth = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50, customMargin: 10 });

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,25,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,40',
                    'lineTo,310,40',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,55,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,315.333,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165.333,70,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,85,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,125,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165.333,140,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,155,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,170',
                    'lineTo,310,170',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,125,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,140,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 2 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, availablePageHeight = 120, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 120 });

                const dataGrid = createDataGrid({
                    width: 600,
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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v1_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,402.187,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,5.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,203.76,60,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,105,{baseline:middle}',
                    'text,v1_2,203.76,105,{baseline:middle}',
                    'text,v1_3,402.187,105,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,396.853,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,396.853,0,198.427,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,198.427,30,198.427,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,198.427,90,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,396.853,90,198.427,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'text,v2_2,203.76,15,{baseline:middle}',
                    'text,v1_3,402.187,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,198.427,0,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,396.853,0,198.427,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 2 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, availablePageHeight = 120, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 120 });

                const dataGrid = createDataGrid({
                    width: 600,
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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v1_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,402.187,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,5.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,203.76,60,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,105,{baseline:middle}',
                    'text,v1_2,203.76,105,{baseline:middle}',
                    'text,v1_3,402.187,105,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,396.853,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,396.853,0,198.427,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,198.427,30,198.427,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,198.427,90,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,396.853,90,198.427,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,402.187,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,5.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,203.76,60,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,105,{baseline:middle}',
                    'text,v2_2,203.76,105,{baseline:middle}',
                    'text,v1_3,402.187,105,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,396.853,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,396.853,0,198.427,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,198.427,30,198.427,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,198.427,90,198.427,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,396.853,90,198.427,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
                    width: 600,
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,25,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,55,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,55,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,40',
                    'lineTo,310,40',
                    'lineTo,310,70',
                    'lineTo,160,70',
                    'clip,',
                    'discardPath,',
                    'text,F2,165.333,70,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,315.333,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165.333,70,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,85,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,125,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,140',
                    'lineTo,310,140',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,95,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,110',
                    'lineTo,310,110',
                    'lineTo,310,140',
                    'lineTo,160,140',
                    'clip,',
                    'discardPath,',
                    'text,F2,165.333,110,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    width: 600,
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,55,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,40',
                    'lineTo,460,40',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,85,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,315.333,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165.333,70,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,85,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,125,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165.333,140,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,155,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,170',
                    'lineTo,310,170',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,125,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,140,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15,25,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15,55,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,55,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,40',
                    'lineTo,310,40',
                    'lineTo,310,70',
                    'lineTo,160,70',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,70,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15,25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,315,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165,70,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15,85,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15,125,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,140',
                    'lineTo,310,140',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,95,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,110',
                    'lineTo,310,110',
                    'lineTo,310,140',
                    'lineTo,160,140',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,110,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15,55,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,40',
                    'lineTo,460,40',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,85,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15,25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,315,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15,55,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165,70,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15,85,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15,125,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,165,140,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15,155,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,170',
                    'lineTo,310,170',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,125,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,140,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - [band1-[band2-[f1], f2], f3], vertical align: bottom, rowHeight = 30, availablePageWidth = 50', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 50, customMargin: 10 });

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,34.667,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,40',
                    'lineTo,310,40',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,94.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,34.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F3,315.333,94.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15.333,64.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165.333,94.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15.333,94.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15.333,134.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165.333,164.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15.333,164.667,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,170',
                    'lineTo,310,170',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,164.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,140,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,34.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15.333,64.667,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,94.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,40',
                    'lineTo,310,40',
                    'lineTo,310,70',
                    'lineTo,160,70',
                    'clip,',
                    'discardPath,',
                    'text,F2,165.333,94.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,34.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F3,315.333,94.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15.333,64.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165.333,94.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15.333,94.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15.333,134.667,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,140',
                    'lineTo,310,140',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,134.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,110',
                    'lineTo,310,110',
                    'lineTo,310,140',
                    'lineTo,160,140',
                    'clip,',
                    'discardPath,',
                    'text,F2,165.333,134.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,64.667,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,40',
                    'lineTo,460,40',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,124.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,34.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F3,315.333,94.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15.333,64.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165.333,94.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15.333,94.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15.333,134.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165.333,164.667,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15.333,164.667,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,170',
                    'lineTo,310,170',
                    'clip,',
                    'discardPath,',
                    'text,F3,315.333,164.667,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,140,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15,35,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15,65,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,10',
                    'lineTo,460,10',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,95,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,40',
                    'lineTo,310,40',
                    'lineTo,310,70',
                    'lineTo,160,70',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,95,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15,35,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F3,315,95,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15,65,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165,95,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15,95,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15,135,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,140',
                    'lineTo,310,140',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,135,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,160,110',
                    'lineTo,310,110',
                    'lineTo,310,140',
                    'lineTo,160,140',
                    'clip,',
                    'discardPath,',
                    'text,F2,165,135,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,30',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15,65,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,40',
                    'lineTo,460,40',
                    'lineTo,460,70',
                    'lineTo,310,70',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,125,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,40,150,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15,35,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F3,315,95,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15,65,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165,95,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15,95,{baseline:bottom}',
                    'setTextColor,128',
                    'text,Band2,15,135,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F2,165,165,{baseline:bottom}',
                    'setTextColor,128',
                    'text,F1,15,165,{baseline:bottom}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,310,110',
                    'lineTo,460,110',
                    'lineTo,460,170',
                    'lineTo,310,170',
                    'clip,',
                    'discardPath,',
                    'text,F3,315,165,{baseline:bottom}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,10,300,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,10,150,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,40,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,40,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,70,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,160,110,150,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,140,150,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,310,110,150,60',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, availablePageHeight = 150, topLeft.x = 10, topLeft.y = 20, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 150 });

                const dataGrid = createDataGrid({
                    width: 600,
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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v3_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,35,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,405.52,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,210.427,80,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,95,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,125,{baseline:middle}',
                    'text,v1_2,210.427,125,{baseline:middle}',
                    'text,v1_3,405.52,125,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,20,390.187,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,400.187,20,195.093,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,50,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,205.093,50,195.093,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,205.093,110,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,400.187,110,195.093,30',
                    'addPage,',
                    'text,v2_1,15.333,15,{baseline:middle}',
                    'text,v2_2,210.427,15,{baseline:middle}',
                    'text,v2_3,405.52,15,{baseline:middle}',
                    'text,v2_1,15.333,45,{baseline:middle}',
                    'text,v2_2,210.427,45,{baseline:middle}',
                    'text,v3_3,405.52,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,205.093,0,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,400.187,0,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,30,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,205.093,30,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,400.187,30,195.093,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 20 }, repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, availablePageHeight = 150, topLeft.x = 10, topLeft.y = 20, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 150 });

                const dataGrid = createDataGrid({
                    width: 600,
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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v3_1', f2: 'v3_2', f3: 'v3_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,35,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,405.52,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,210.427,80,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,95,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,125,{baseline:middle}',
                    'text,v1_2,210.427,125,{baseline:middle}',
                    'text,v1_3,405.52,125,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,20,390.187,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,400.187,20,195.093,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,50,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,205.093,50,195.093,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,205.093,110,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,400.187,110,195.093,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,405.52,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,210.427,60,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,15.333,105,{baseline:middle}',
                    'text,v2_2,210.427,105,{baseline:middle}',
                    'text,v2_3,405.52,105,{baseline:middle}',
                    'text,v3_1,15.333,135,{baseline:middle}',
                    'text,v3_2,210.427,135,{baseline:middle}',
                    'text,v3_3,405.52,135,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,390.187,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,400.187,0,195.093,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,30,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,205.093,30,195.093,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,60,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,90,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,205.093,90,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,400.187,90,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,120,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,205.093,120,195.093,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,400.187,120,195.093,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 20 }, repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, columnWidth = [100, 100, 100], availablePageHeight = 150, topLeft.x = 10, topLeft.y = 20, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 150 });

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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v3_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,35,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215.333,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,115.333,80,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,95,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,125,{baseline:middle}',
                    'text,v1_2,115.333,125,{baseline:middle}',
                    'text,v1_3,215.333,125,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,20,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,20,100,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,50,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,50,100,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,110,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,110,100,30',
                    'addPage,',
                    'text,v2_1,15.333,15,{baseline:middle}',
                    'text,v2_2,115.333,15,{baseline:middle}',
                    'text,v2_3,215.333,15,{baseline:middle}',
                    'text,v2_1,15.333,45,{baseline:middle}',
                    'text,v2_2,115.333,45,{baseline:middle}',
                    'text,v3_3,215.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,30,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 20 }, columnWidths: [100, 100, 100], repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, columnWidth = [100, 100, 100], availablePageHeight = 150, topLeft.x = 10, topLeft.y = 20, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageHeight: 150 });

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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v3_1', f2: 'v3_2', f3: 'v3_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,15.333,35,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215.333,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,115.333,80,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,95,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,125,{baseline:middle}',
                    'text,v1_2,115.333,125,{baseline:middle}',
                    'text,v1_3,215.333,125,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,20,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,20,100,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,50,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,50,100,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,110,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,110,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,15.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,215.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band2,15.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,115.333,60,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,15.333,105,{baseline:middle}',
                    'text,v2_2,115.333,105,{baseline:middle}',
                    'text,v2_3,215.333,105,{baseline:middle}',
                    'text,v3_1,15.333,135,{baseline:middle}',
                    'text,v3_2,115.333,135,{baseline:middle}',
                    'text,v3_3,215.333,135,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,200,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,0,100,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,30,100,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,60,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,90,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,90,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,90,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,120,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,110,120,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,210,120,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 20 }, columnWidths: [100, 100, 100], repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('Splitting - Horizontally and vertically splitting for simple cells', moduleConfig, () => {
            QUnit.test('2 cols - 2 rows, rowHeight = 30, availablePageWidth = 100, availablePageHeight = 60, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 60 });

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'addPage,',
                    'text,v2_2,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows, rowHeight = 30, availablePageWidth = 100, availablePageHeight = 60, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 60 });

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageWidth = 100, availablePageHeight = 60, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 60 });

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'text,v2_2,5.333,15,{baseline:middle}',
                    'text,v3_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageWidth = 100, availablePageHeight = 60, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 60 });

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageWidth = 100, availablePageHeight = 90, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 90 });

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,45,{baseline:middle}',
                    'text,v2_2,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'text,v3_1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'addPage,',
                    'text,v3_2,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 3 rows, rowHeight = 30, availablePageWidth = 100, availablePageHeight = 90, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 90 });

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,45,{baseline:middle}',
                    'text,v2_2,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows, rowHeight = 30, availablePageWidth = 100, availablePageHeight = 90, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 90 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' }
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v3_1', f2: 'v3_2', f3: 'v3_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,45,{baseline:middle}',
                    'text,v2_2,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,45,{baseline:middle}',
                    'text,v2_3,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'text,v3_1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'addPage,',
                    'text,v3_2,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'addPage,',
                    'text,v3_3,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100, 100], repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows, rowHeight = 30, availablePageWidth = 100, availablePageHeight = 90, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 90 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' }
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v3_1', f2: 'v3_2', f3: 'v3_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };
                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,45,{baseline:middle}',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,45,{baseline:middle}',
                    'text,v2_2,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,45,{baseline:middle}',
                    'text,v2_3,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,15,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_3,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100, 100], repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('4 cols - 4 rows, rowHeight = 100, availablePageWidth = 590, availablePageHeight = 840, repeatHeaders = false, topLeft: { x: 390, y: 540 }', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 590, pageHeight: 840 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    dataSource: [
                        { f1: 'v1_1', f2: 'v1_2', f3: 'v1_3', f4: 'v1_4' },
                        { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3', f4: 'v2_4' },
                        { f1: 'v3_1', f2: 'v3_2', f3: 'v3_3', f4: 'v3_4' },
                        { f1: 'v4_1', f2: 'v4_2', f3: 'v4_3', f4: 'v4_4' }
                    ],
                });

                const onRowExporting = (e) => { e.rowHeight = 100; };
                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,395.333,590,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,495.333,590,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,395.333,690,{baseline:middle}',
                    'text,v1_2,495.333,690,{baseline:middle}',
                    'text,v2_1,395.333,790,{baseline:middle}',
                    'text,v2_2,495.333,790,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,540,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,540,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,640,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,640,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,740,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,740,100,100',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,590,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,105.333,590,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,690,{baseline:middle}',
                    'text,v1_4,105.333,690,{baseline:middle}',
                    'text,v2_3,5.333,790,{baseline:middle}',
                    'text,v2_4,105.333,790,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,540,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,540,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,640,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,640,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,740,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,740,100,100',
                    'addPage,',
                    'text,v3_1,395.333,50,{baseline:middle}',
                    'text,v3_2,495.333,50,{baseline:middle}',
                    'text,v4_1,395.333,150,{baseline:middle}',
                    'text,v4_2,495.333,150,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,0,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,0,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,100,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,100,100,100',
                    'addPage,',
                    'text,v3_3,5.333,50,{baseline:middle}',
                    'text,v3_4,105.333,50,{baseline:middle}',
                    'text,v4_3,5.333,150,{baseline:middle}',
                    'text,v4_4,105.333,150,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,0,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,100,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,100,100,100',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 390, y: 540 }, columnWidths: [100, 100, 100, 100], repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('4 cols - 4 rows, rowHeight = 100, availablePageWidth = 590, availablePageHeight = 840, repeatHeaders = true, topLeft: { x: 390, y: 540 }', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 590, pageHeight: 840 });

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    dataSource: [
                        { f1: 'v1_1', f2: 'v1_2', f3: 'v1_3', f4: 'v1_4' },
                        { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3', f4: 'v2_4' },
                        { f1: 'v3_1', f2: 'v3_2', f3: 'v3_3', f4: 'v3_4' },
                        { f1: 'v4_1', f2: 'v4_2', f3: 'v4_3', f4: 'v4_4' }
                    ],
                });

                const onRowExporting = (e) => { e.rowHeight = 100; };
                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,395.333,590,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,495.333,590,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,395.333,690,{baseline:middle}',
                    'text,v1_2,495.333,690,{baseline:middle}',
                    'text,v2_1,395.333,790,{baseline:middle}',
                    'text,v2_2,495.333,790,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,540,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,540,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,640,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,640,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,740,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,740,100,100',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,590,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,105.333,590,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,690,{baseline:middle}',
                    'text,v1_4,105.333,690,{baseline:middle}',
                    'text,v2_3,5.333,790,{baseline:middle}',
                    'text,v2_4,105.333,790,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,540,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,540,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,640,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,640,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,740,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,740,100,100',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,395.333,50,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,495.333,50,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,395.333,150,{baseline:middle}',
                    'text,v3_2,495.333,150,{baseline:middle}',
                    'text,v4_1,395.333,250,{baseline:middle}',
                    'text,v4_2,495.333,250,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,0,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,0,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,100,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,100,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,390,200,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,490,200,100,100',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,50,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,105.333,50,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_3,5.333,150,{baseline:middle}',
                    'text,v3_4,105.333,150,{baseline:middle}',
                    'text,v4_3,5.333,250,{baseline:middle}',
                    'text,v4_4,105.333,250,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,0,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,100,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,100,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,200,100,100',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100,200,100,100',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 390, y: 540 }, columnWidths: [100, 100, 100, 100], repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('Splitting - Horizontally and vertically splitting for merged cells', moduleConfig, () => {
            QUnit.test('2 cols - [band1-[f1], f2], rowHeight = 30, availablePageWidth = 100, availablePageHeight = 90, repeatHeaders: false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 90 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,30,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'addPage,',
                    'text,v2_2,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - [band1-[f1], f2], rowHeight = 30, availablePageWidth = 100, availablePageHeight = 90, repeatHeaders: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 90 });

                const dataGrid = createDataGrid({
                    columns: [
                        {
                            caption: 'Band1', columns: [
                                'f1'
                            ]
                        },
                        'f2'
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2' }, { f1: 'v2_1', f2: 'v2_2' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,30,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,30,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_2,5.333,75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 2 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, availablePageWidth = 100, availablePageHeight = 120, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 120 });

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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v1_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band2,5.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,105,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,60,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,105,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,100,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,100,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,105,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,100,30',
                    'addPage,',
                    'text,v2_1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'addPage,',
                    'text,v2_2,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'addPage,',
                    'text,v1_3,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,100,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100, 100], repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 2 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, availablePageWidth = 100, availablePageHeight = 120, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 120 });

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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v1_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band2,5.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,5.333,105,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,60,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,105,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,80,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,105,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band2,5.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,5.333,75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,5.333,105,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1,5.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,60,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,60,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_2,5.333,105,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,80,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,105,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,80,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 0, y: 0 }, columnWidths: [80, 80, 80], repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, columnWidths: [80, 80, 80], availablePageWidth = 100, availablePageHeight = 150, topLeft.x = 10, topLeft.y = 20, repeatHeaders = false', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 150 });

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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v3_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band2,15.333,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,95,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,125,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1,15.333,35,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,50,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,20,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,80,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,125,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,50,80,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,110,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,20,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,65,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,125,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,20,80,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,110,80,30',
                    'addPage,',
                    'text,v2_1,15.333,15,{baseline:middle}',
                    'text,v2_1,15.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,30,80,30',
                    'addPage,',
                    'text,v2_2,5.333,15,{baseline:middle}',
                    'text,v2_2,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,80,30',
                    'addPage,',
                    'text,v2_3,5.333,15,{baseline:middle}',
                    'text,v3_3,5.333,45,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,80,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80, 80], repeatHeaders: false, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows [band1-[band2-[f1], f2], f3], rowHeight = 30, columnWidths: [80, 80, 80], availablePageWidth = 100, availablePageHeight = 150, topLeft.x = 10, topLeft.y = 20, repeatHeaders = true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 150 });

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
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v3_1', f2: 'v3_2', f3: 'v3_3' }],
                });

                const onRowExporting = (e) => { e.rowHeight = 30; };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band2,15.333,65,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,95,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,125,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1,15.333,35,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,50,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,80,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,110,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,20,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,80,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,125,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,50,80,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,110,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,20,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,65,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,125,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,20,80,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,110,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,Band2,15.333,45,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,15.333,75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_1,15.333,105,{baseline:middle}',
                    'text,v3_1,15.333,135,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1,15.333,15,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,30,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,60,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,90,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,120,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,60,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_2,5.333,105,{baseline:middle}',
                    'text,v3_2,5.333,135,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,30,80,60',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,120,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,30',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,45,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v2_3,5.333,105,{baseline:middle}',
                    'text,v3_3,5.333,135,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,90',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,90,80,30',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,120,80,30',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80, 80], repeatHeaders: true, onRowExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows [band1-[band2-[f1, f2, f3]]], columnWidths: [80, 80, 80], availablePageWidth = 100, availablePageHeight = 150, topLeft.x = 10, topLeft.y = 20, repeatHeaders = true, wordWrapEnabled: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 150 });

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        {
                            caption: 'Band1 very long line very long line very long line very long line very long line very long line 1', columns: [
                                {
                                    caption: 'Band2 very long line line 2', columns: [
                                        'f1', 'f2', 'f3'
                                    ]
                                }
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v3_1', f2: 'v3_2', f3: 'v3_3' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,86.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,109.083,{baseline:middle}',
                    'text,v2_1,15.333,131.25,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,20',
                    'lineTo,90,20',
                    'lineTo,90,53.667',
                    'lineTo,10,53.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,15.333,31.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,53.667',
                    'lineTo,90,53.667',
                    'lineTo,90,75.833',
                    'lineTo,10,75.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line line 2,15.333,64.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,75.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,98,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,120.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,20,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,53.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,86.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,109.083,{baseline:middle}',
                    'text,v2_2,5.333,131.25,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,20',
                    'lineTo,80,20',
                    'lineTo,80,53.667',
                    'lineTo,0,53.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-74.667,31.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,53.667',
                    'lineTo,80,53.667',
                    'lineTo,80,75.833',
                    'lineTo,0,75.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line line 2,-74.667,64.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,75.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,98,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,120.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,20,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,53.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,86.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,109.083,{baseline:middle}',
                    'text,v2_3,5.333,131.25,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,20',
                    'lineTo,80,20',
                    'lineTo,80,53.667',
                    'lineTo,0,53.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-154.667,31.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,53.667',
                    'lineTo,80,53.667',
                    'lineTo,80,75.833',
                    'lineTo,0,75.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line line 2,-154.667,64.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,75.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,98,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,120.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,20,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,53.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,15.333,66.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,15.333,89.084,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,0',
                    'lineTo,90,0',
                    'lineTo,90,33.667',
                    'lineTo,10,33.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,15.333,11.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,33.667',
                    'lineTo,90,33.667',
                    'lineTo,90,55.833',
                    'lineTo,10,55.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line line 2,15.333,44.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,55.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,78,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,33.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,66.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_2,5.333,89.084,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,0',
                    'lineTo,80,0',
                    'lineTo,80,33.667',
                    'lineTo,0,33.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-74.667,11.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,33.667',
                    'lineTo,80,33.667',
                    'lineTo,80,55.833',
                    'lineTo,0,55.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line line 2,-74.667,44.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,55.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,78,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,33.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,66.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_3,5.333,89.084,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,0',
                    'lineTo,80,0',
                    'lineTo,80,33.667',
                    'lineTo,0,33.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-154.667,11.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,33.667',
                    'lineTo,80,33.667',
                    'lineTo,80,55.833',
                    'lineTo,0,55.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line line 2,-154.667,44.75,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,55.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,78,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,33.667,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80, 80], repeatHeaders: true }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('3 cols - 3 rows [band1-[band2-[f1, f2, f3]]], columnWidths: [80, 80, 80], band2.horizontalAlign=center, availablePageWidth = 100, availablePageHeight = 150, topLeft.x = 10, topLeft.y = 20, repeatHeaders = true, wordWrapEnabled: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 150 });

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        {
                            caption: 'Band1 very long line very long line very long line very long line very long line very long line 1', columns: [
                                {
                                    caption: 'Band2 very long line2', columns: [
                                        'f1', 'f2', 'f3'
                                    ]
                                }
                            ]
                        }
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v2_1', f2: 'v2_2', f3: 'v2_3' }, { f1: 'v3_1', f2: 'v3_2', f3: 'v3_3' }],
                });

                const customizeCell = (e) => {
                    if(e.pdfCell.text.indexOf('Band2') >= 0) {
                        e.pdfCell.horizontalAlign = 'center';
                    }
                };

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,15.333,86.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,15.333,109.083,{baseline:middle}',
                    'text,v2_1,15.333,131.25,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,20',
                    'lineTo,90,20',
                    'lineTo,90,53.667',
                    'lineTo,10,53.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,15.333,31.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,53.667',
                    'lineTo,90,53.667',
                    'lineTo,90,75.833',
                    'lineTo,10,75.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line2,130,64.75,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,75.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,98,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,120.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,20,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,53.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,86.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,5.333,109.083,{baseline:middle}',
                    'text,v2_2,5.333,131.25,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,20',
                    'lineTo,80,20',
                    'lineTo,80,53.667',
                    'lineTo,0,53.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-74.667,31.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,53.667',
                    'lineTo,80,53.667',
                    'lineTo,80,75.833',
                    'lineTo,0,75.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line2,40,64.75,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,75.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,98,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,120.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,20,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,53.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,86.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,109.083,{baseline:middle}',
                    'text,v2_3,5.333,131.25,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,20',
                    'lineTo,80,20',
                    'lineTo,80,53.667',
                    'lineTo,0,53.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-154.667,31.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,53.667',
                    'lineTo,80,53.667',
                    'lineTo,80,75.833',
                    'lineTo,0,75.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line2,-40,64.75,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,75.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,98,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,120.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,20,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,53.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F1,15.333,66.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_1,15.333,89.084,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,0',
                    'lineTo,90,0',
                    'lineTo,90,33.667',
                    'lineTo,10,33.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,15.333,11.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,10,33.667',
                    'lineTo,90,33.667',
                    'lineTo,90,55.833',
                    'lineTo,10,55.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line2,130,44.75,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,55.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,78,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,0,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,33.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F2,5.333,66.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_2,5.333,89.084,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,0',
                    'lineTo,80,0',
                    'lineTo,80,33.667',
                    'lineTo,0,33.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-74.667,11.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,33.667',
                    'lineTo,80,33.667',
                    'lineTo,80,55.833',
                    'lineTo,0,55.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line2,40,44.75,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,55.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,78,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,33.667,80,22.167',
                    'addPage,',
                    'setTextColor,128',
                    'text,F3,5.333,66.917,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v3_3,5.333,89.084,{baseline:middle}',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,0',
                    'lineTo,80,0',
                    'lineTo,80,33.667',
                    'lineTo,0,33.667',
                    'clip,',
                    'discardPath,',
                    'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-154.667,11.083,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setTextColor,128',
                    'saveGraphicsState,',
                    'moveTo,0,33.667',
                    'lineTo,80,33.667',
                    'lineTo,80,55.833',
                    'lineTo,0,55.833',
                    'clip,',
                    'discardPath,',
                    'text,Band2 very long line2,-40,44.75,{baseline:middle,align:center}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,55.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,78,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,0,80,33.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,33.667,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80, 80], repeatHeaders: true, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows with group, columnWidths: [80, 80] availablePageWidth = 100, availablePageHeight = 150, topLeft.x = 10, topLeft.y = 20, repeatHeaders = true, wordWrapEnabled: true', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const margin = initMargin(doc, { pageWidth: 100, pageHeight: 150 });

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [ { dataField: 'f1', groupIndex: 0, }, 'f2', 'f3' ],
                    dataSource: [{ f1: 'v1_1 very long line, very very long line', f2: 'v1_2', f3: 'v1_3' }, { f1: 'v1_1 very long line, very very long line', f2: 'v2_2', f3: 'v2_3' }],
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,15.333,31.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_2,15.333,86.917,{baseline:middle}',
                    'text,v2_2,15.333,109.083,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,10,42.167',
                    'lineTo,90,42.167',
                    'lineTo,90,75.833',
                    'lineTo,10,75.833',
                    'clip,',
                    'discardPath,',
                    'text,F1: v1_1 very long line, very\n' +
'very long line,15.333,53.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,20,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,75.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,98,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,10,42.167,80,33.667',
                    'addPage,',
                    'setTextColor,128',
                    'setFont,helvetica,normal,',
                    'text,F3,5.333,31.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_3,5.333,86.917,{baseline:middle}',
                    'text,v2_3,5.333,109.083,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'saveGraphicsState,',
                    'moveTo,0,42.167',
                    'lineTo,80,42.167',
                    'lineTo,80,75.833',
                    'lineTo,0,75.833',
                    'clip,',
                    'discardPath,',
                    'text,F1: v1_1 very long line, very\n' +
'very long line,-74.667,53.25,{baseline:middle}',
                    'restoreGraphicsState,',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,20,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,75.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,98,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,0,42.167,80,33.667',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80], repeatHeaders: true }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfSplittingTests };
