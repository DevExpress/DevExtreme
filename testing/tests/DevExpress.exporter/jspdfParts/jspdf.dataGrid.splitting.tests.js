import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { normalizeBoundaryValue } from 'exporter/jspdf/common/normalizeOptions';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,10,36.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,47.25,{baseline:middle}',
            'rect,0,15,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,47.25,{baseline:middle}',
            'rect,0,15,200,21.5',
            'rect,0,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,47.25,{baseline:middle}',
            'rect,0,15,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'line,10,36.5,210,36.5',
            'line,10,36.5,10,58',
            'line,10,58,210,58',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,47.25,{baseline:middle}',
            'rect,0,15,200,21.5',
            'line,0,36.5,200,36.5',
            'line,0,58,200,58',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,47.25,{baseline:middle}',
            'rect,0,15,200,21.5',
            'line,0,36.5,200,36.5',
            'line,200,36.5,200,58',
            'line,0,58,200,58',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'line,10,36.5,210,36.5',
            'line,10,36.5,10,58',
            'line,10,58,210,58',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,47.25,{baseline:middle}',
            'rect,0,15,200,21.5',
            'line,0,36.5,200,36.5',
            'line,0,58,200,58',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,47.25,{baseline:middle}',
            'rect,0,15,200,21.5',
            'line,0,36.5,200,36.5',
            'line,200,36.5,200,58',
            'line,0,58,200,58',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,47.25,{baseline:middle}',
            'text,v1_2,15,68.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'line,10,36.5,210,36.5',
            'line,10,36.5,10,58',
            'line,10,58,210,58',
            'rect,10,58,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,47.25,{baseline:middle}',
            'text,v2_2,5,68.75,{baseline:middle}',
            'line,0,15,200,15',
            'line,0,15,0,36.5',
            'line,200,15,200,36.5',
            'line,0,58,0,79.5',
            'line,200,58,200,79.5',
            'line,0,79.5,200,79.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,47.25,{baseline:middle}',
            'text,v3_2,5,68.75,{baseline:middle}',
            'rect,0,15,200,21.5',
            'line,0,36.5,200,36.5',
            'line,200,36.5,200,58',
            'line,0,58,200,58',
            'rect,0,58,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,15,100,21.5',
            'rect,0,36.5,100,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,47.25,{baseline:middle}',
            'rect,0,15,200,21.5',
            'rect,0,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,47.25,{baseline:middle}',
            'rect,0,15,100,21.5',
            'rect,0,36.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 15 }, columnWidths: [ 100, 200, 100 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,15,100,21.5',
            'rect,0,36.5,100,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,47.25,{baseline:middle}',
            'rect,0,15,100,21.5',
            'rect,0,36.5,100,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,47.25,{baseline:middle}',
            'rect,0,15,100,21.5',
            'rect,0,36.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 15 }, columnWidths: [ 100, 100, 100 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,15,200,21.5',
            'rect,0,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,47.25,{baseline:middle}',
            'rect,0,15,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 15 }, columnWidths: [ 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'text,F2,215,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,47.25,{baseline:middle}',
            'text,v2_1,215,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,36.5,200,21.5',
            'rect,210,36.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,30,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,30,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,25,15,200,21.5',
            'rect,25,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,20,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,20,47.25,{baseline:middle}',
            'rect,15,15,200,21.5',
            'rect,15,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,20,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,20,47.25,{baseline:middle}',
            'rect,15,15,200,21.5',
            'rect,15,36.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('4 cols - 1 rows, margin=30, unit = mm, no page splitting', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ unit: 'mm' });

        const dataGrid = createDataGrid({
            width: 1000,
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' },
            ],
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,31.764,33.792,{baseline:middle}',
            'text,F2,69.264,33.792,{baseline:middle}',
            'text,F3,106.765,33.792,{baseline:middle}',
            'text,F4,144.265,33.792,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1,31.764,41.377,{baseline:middle}',
            'text,f2,69.264,41.377,{baseline:middle}',
            'text,f3,106.765,41.377,{baseline:middle}',
            'text,f4,144.265,41.377,{baseline:middle}',
            'setLineWidth,0.17638888888888887',
            'setDrawColor,#979797',
            'rect,30,30,37.5,7.585',
            'setLineWidth,0.17638888888888887',
            'rect,67.5,30,37.5,7.585',
            'setLineWidth,0.17638888888888887',
            'rect,105.001,30,37.5,7.585',
            'setLineWidth,0.17638888888888887',
            'rect,142.501,30,37.5,7.585',
            'setLineWidth,0.17638888888888887',
            'rect,30,37.585,37.5,7.585',
            'setLineWidth,0.17638888888888887',
            'rect,67.5,37.585,37.5,7.585',
            'setLineWidth,0.17638888888888887',
            'rect,105.001,37.585,37.5,7.585',
            'setLineWidth,0.17638888888888887',
            'rect,142.501,37.585,37.5,7.585',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 30 }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('5 cols - 1 rows, margin=2, unit = cm, no page splitting', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ unit: 'cm' });

        const dataGrid = createDataGrid({
            width: 1000,
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' },
                { dataField: 'f5' },
            ],
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4', f5: 'f5' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,2.176,2.379,{baseline:middle}',
            'text,F2,5.576,2.379,{baseline:middle}',
            'text,F3,8.976,2.379,{baseline:middle}',
            'text,F4,12.376,2.379,{baseline:middle}',
            'text,F5,15.777,2.379,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1,2.176,3.138,{baseline:middle}',
            'text,f2,5.576,3.138,{baseline:middle}',
            'text,f3,8.976,3.138,{baseline:middle}',
            'text,f4,12.376,3.138,{baseline:middle}',
            'text,f5,15.777,3.138,{baseline:middle}',
            'setLineWidth,0.017638888888888888',
            'setDrawColor,#979797',
            'rect,2,2,3.4,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,5.4,2,3.4,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,8.8,2,3.4,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,12.2,2,3.4,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,15.6,2,3.4,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,2,2.758,3.4,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,5.4,2.758,3.4,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,8.8,2.758,3.4,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,12.2,2.758,3.4,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,15.6,2.758,3.4,0.758',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 2 }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('5 cols - 1 rows, margin=2, unit = in, no page splitting', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ unit: 'in' });

        const dataGrid = createDataGrid({
            width: 1000,
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' },
                { dataField: 'f5' },
            ],
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4', f5: 'f5' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,2.069,2.149,{baseline:middle}',
            'text,F2,2.923,2.149,{baseline:middle}',
            'text,F3,3.777,2.149,{baseline:middle}',
            'text,F4,4.63,2.149,{baseline:middle}',
            'text,F5,5.484,2.149,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1,2.069,2.448,{baseline:middle}',
            'text,f2,2.923,2.448,{baseline:middle}',
            'text,f3,3.777,2.448,{baseline:middle}',
            'text,f4,4.63,2.448,{baseline:middle}',
            'text,f5,5.484,2.448,{baseline:middle}',
            'setLineWidth,0.006944444444444444',
            'setDrawColor,#979797',
            'rect,2,2,0.854,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,2.854,2,0.854,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,3.707,2,0.854,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,4.561,2,0.854,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,5.414,2,0.854,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,2,2.299,0.854,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,2.854,2.299,0.854,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,3.707,2.299,0.854,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,4.561,2.299,0.854,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,5.414,2.299,0.854,0.299',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 2 }).then(() => {
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
            'text,v1_1,15,25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,200,30',
            'addPage,',
            'text,v2_1,15,15,{baseline:middle}',
            'rect,10,0,200,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'rect,0,0,595.28,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,45,{baseline:middle}',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
            'text,v1_1,15,25,{baseline:middle}',
            'text,v1_2,215,25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,200,30',
            'rect,210,10,200,30',
            'addPage,',
            'text,v2_1,15,15,{baseline:middle}',
            'text,v2_2,215,15,{baseline:middle}',
            'rect,10,0,200,30',
            'rect,210,0,200,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200, 200 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v1_2,302.64,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'text,v2_2,302.64,15,{baseline:middle}',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v1_2,302.64,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,45,{baseline:middle}',
            'text,v2_2,302.64,45,{baseline:middle}',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
            'text,v1_1,15,25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,200,30',
            'addPage,',
            'text,v2_1,15,15,{baseline:middle}',
            'rect,10,0,200,30',
            'addPage,',
            'text,v3_1,15,15,{baseline:middle}',
            'rect,10,0,200,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'text,v3_1,5,45,{baseline:middle}',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,45,{baseline:middle}',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,45,{baseline:middle}',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
            'text,v1_1,15,25,{baseline:middle}',
            'text,v2_1,15,55,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,200,30',
            'rect,10,40,200,30',
            'addPage,',
            'text,v3_1,15,15,{baseline:middle}',
            'rect,10,0,200,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v2_1,5,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'rect,0,60,595.28,30',
            'addPage,',
            'text,v3_1,5,15,{baseline:middle}',
            'rect,0,0,595.28,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v2_1,5,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'rect,0,60,595.28,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,45,{baseline:middle}',
            'rect,0,0,595.28,30',
            'rect,0,30,595.28,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
            'text,v1_1,15,25,{baseline:middle}',
            'text,v1_2,215,25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,200,30',
            'rect,210,10,200,30',
            'addPage,',
            'text,v2_1,15,15,{baseline:middle}',
            'text,v2_2,215,15,{baseline:middle}',
            'rect,10,0,200,30',
            'rect,210,0,200,30',
            'addPage,',
            'text,v3_1,15,15,{baseline:middle}',
            'text,v3_2,215,15,{baseline:middle}',
            'rect,10,0,200,30',
            'rect,210,0,200,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200, 200 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v1_2,302.64,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'text,v2_2,302.64,15,{baseline:middle}',
            'text,v3_1,5,45,{baseline:middle}',
            'text,v3_2,302.64,45,{baseline:middle}',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v1_2,302.64,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,45,{baseline:middle}',
            'text,v2_2,302.64,45,{baseline:middle}',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,45,{baseline:middle}',
            'text,v3_2,302.64,45,{baseline:middle}',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
            'text,v1_1,15,25,{baseline:middle}',
            'text,v1_2,215,25,{baseline:middle}',
            'text,v2_1,15,55,{baseline:middle}',
            'text,v2_2,215,55,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,200,30',
            'rect,210,10,200,30',
            'rect,10,40,200,30',
            'rect,210,40,200,30',
            'addPage,',
            'text,v3_1,15,15,{baseline:middle}',
            'text,v3_2,215,15,{baseline:middle}',
            'rect,10,0,200,30',
            'rect,210,0,200,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 10 }, columnWidths: [ 200, 200 ], onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v1_2,302.64,45,{baseline:middle}',
            'text,v2_1,5,75,{baseline:middle}',
            'text,v2_2,302.64,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'rect,0,60,297.64,30',
            'rect,297.64,60,297.64,30',
            'addPage,',
            'text,v3_1,5,15,{baseline:middle}',
            'text,v3_2,302.64,15,{baseline:middle}',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v1_2,302.64,45,{baseline:middle}',
            'text,v2_1,5,75,{baseline:middle}',
            'text,v2_2,302.64,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'rect,0,60,297.64,30',
            'rect,297.64,60,297.64,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'text,F2,302.64,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,45,{baseline:middle}',
            'text,v3_2,302.64,45,{baseline:middle}',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'rect,0,30,297.64,30',
            'rect,297.64,30,297.64,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_2,15,68.75,{baseline:middle}',
            'text,f2_2,15,90.25,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,10,36.5,200,21.5,F',
            'setFont,helvetica,bold,',
            'text,F1: f1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F3,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_3,5,68.75,{baseline:middle}',
            'text,f2_3,5,90.25,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,0,36.5,200,21.5,F',
            'rect,0,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
            'text,F3,215,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_2,15,68.75,{baseline:middle}',
            'text,f1_3,215,68.75,{baseline:middle}',
            'text,f2_2,15,90.25,{baseline:middle}',
            'text,f2_3,215,90.25,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,10,36.5,400,21.5,F',
            'setFont,helvetica,bold,',
            'text,F1: f1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F4,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_3,5,68.75,{baseline:middle}',
            'text,f2_3,5,90.25,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,0,36.5,200,21.5,F',
            'rect,0,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
            'text,F3,215,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_2,15,68.75,{baseline:middle}',
            'text,f1_3,215,68.75,{baseline:middle}',
            'text,f2_2,15,90.25,{baseline:middle}',
            'text,f2_3,215,90.25,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,10,36.5,400,21.5,F',
            'setFont,helvetica,bold,',
            'text,F1: f1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F4,5,25.75,{baseline:middle}',
            'text,F5,205,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_4,5,68.75,{baseline:middle}',
            'text,f1_5,205,68.75,{baseline:middle}',
            'text,f2_4,5,90.25,{baseline:middle}',
            'text,f2_5,205,90.25,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,0,36.5,400,21.5,F',
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F4,5,25.75,{baseline:middle}',
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
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F4,5,25.75,{baseline:middle}',
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
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
            'text,F3,215,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_2,15,68.75,{baseline:middle}',
            'text,f1_3,215,68.75,{baseline:middle}',
            'text,f2_2,15,90.25,{baseline:middle}',
            'text,f2_3,215,90.25,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,10,36.5,400,21.5,F',
            'setFont,helvetica,bold,',
            'text,F1: f1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F4,5,25.75,{baseline:middle}',
            'text,F5,205,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_4,5,68.75,{baseline:middle}',
            'text,f1_5,205,68.75,{baseline:middle}',
            'text,f2_4,5,90.25,{baseline:middle}',
            'text,f2_5,205,90.25,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,0,36.5,400,21.5,F',
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F6,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_6,5,68.75,{baseline:middle}',
            'text,f2_6,5,90.25,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,0,36.5,200,21.5,F',
            'rect,0,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F4,5,25.75,{baseline:middle}',
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
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F4,5,25.75,{baseline:middle}',
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
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,15,25.75,{baseline:middle}',
            'text,F4,215,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_3,15,90.25,{baseline:middle}',
            'text,f1_4,215,90.25,{baseline:middle}',
            'text,f2_3,15,111.75,{baseline:middle}',
            'text,f2_4,215,111.75,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,10,36.5,400,21.5,F',
            'setFont,helvetica,bold,',
            'text,F1: f1,15,47.25,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,10,58,400,21.5,F',
            'text,F2: f2,15,68.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,101,200,21.5',
            'rect,210,101,200,21.5',
            'rect,10,36.5,400,21.5',
            'rect,10,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F5,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_5,5,90.25,{baseline:middle}',
            'text,f2_5,5,111.75,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,200,21.5,F',
            'setFillColor,#CCCCFF',
            'rect,0,58,200,21.5,F',
            'rect,0,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,101,200,21.5',
            'rect,210,101,200,21.5',
            'rect,10,36.5,400,21.5',
            'rect,10,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,101,200,21.5',
            'rect,210,101,200,21.5',
            'rect,10,36.5,400,21.5',
            'rect,10,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,15,25.75,{baseline:middle}',
            'text,F4,215,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_3,15,90.25,{baseline:middle}',
            'text,f1_4,215,90.25,{baseline:middle}',
            'text,f2_3,15,111.75,{baseline:middle}',
            'text,f2_4,215,111.75,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,10,36.5,400,21.5,F',
            'setFont,helvetica,bold,',
            'text,F1: f1,15,47.25,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,10,58,400,21.5,F',
            'text,F2: f2,15,68.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,101,200,21.5',
            'rect,210,101,200,21.5',
            'rect,10,36.5,400,21.5',
            'rect,10,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F5,5,25.75,{baseline:middle}',
            'text,F6,205,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_5,5,90.25,{baseline:middle}',
            'text,f1_6,205,90.25,{baseline:middle}',
            'text,f2_5,5,111.75,{baseline:middle}',
            'text,f2_6,205,111.75,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,400,21.5,F',
            'setFillColor,#CCCCFF',
            'rect,0,58,400,21.5,F',
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,200,101,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,58,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,101,200,21.5',
            'rect,210,101,200,21.5',
            'rect,10,36.5,400,21.5',
            'rect,10,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F5,5,25.75,{baseline:middle}',
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
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,200,101,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,58,400,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,101,200,21.5',
            'rect,210,101,200,21.5',
            'rect,10,36.5,400,21.5',
            'rect,10,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F5,5,25.75,{baseline:middle}',
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
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,200,101,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,58,400,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,15,25.75,{baseline:middle}',
            'text,F4,215,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_3,15,90.25,{baseline:middle}',
            'text,f1_4,215,90.25,{baseline:middle}',
            'text,f2_3,15,111.75,{baseline:middle}',
            'text,f2_4,215,111.75,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,10,36.5,400,21.5,F',
            'setFont,helvetica,bold,',
            'text,F1: f1,15,47.25,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,10,58,400,21.5,F',
            'text,F2: f2,15,68.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,101,200,21.5',
            'rect,210,101,200,21.5',
            'rect,10,36.5,400,21.5',
            'rect,10,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F5,5,25.75,{baseline:middle}',
            'text,F6,205,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_5,5,90.25,{baseline:middle}',
            'text,f1_6,205,90.25,{baseline:middle}',
            'text,f2_5,5,111.75,{baseline:middle}',
            'text,f2_6,205,111.75,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,400,21.5,F',
            'setFillColor,#CCCCFF',
            'rect,0,58,400,21.5,F',
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,200,101,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F7,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_7,5,90.25,{baseline:middle}',
            'text,f2_7,5,111.75,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,200,21.5,F',
            'setFillColor,#CCCCFF',
            'rect,0,58,200,21.5,F',
            'rect,0,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,101,200,21.5',
            'rect,210,101,200,21.5',
            'rect,10,36.5,400,21.5',
            'rect,10,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F5,5,25.75,{baseline:middle}',
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
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,200,101,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,15,25.75,{baseline:middle}',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,200,21.5',
            'rect,210,15,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,101,200,21.5',
            'rect,210,101,200,21.5',
            'rect,10,36.5,400,21.5',
            'rect,10,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F5,5,25.75,{baseline:middle}',
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
            'rect,0,15,200,21.5',
            'rect,200,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,200,101,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,58,400,21.5',
            'addPage,',
            'setTextColor,#979797',
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
            'rect,0,15,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,101,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,47.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,15,68.75,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
            'text,Band1,15,25.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,36.5,200,21.5',
            'rect,10,58,200,21.5',
            'rect,10,15,200,21.5',
            'addPage,',
            'text,F2,5,47.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f2_1,5,68.75,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,0,15,200,21.5,F',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,110,47.25,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f1_1,110,68.75,{baseline:middle,align:center}',
            'setFillColor,#CCCCCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,210,15',
            'lineTo,210,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,210,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,36.5,200,21.5',
            'rect,10,58,200,21.5',
            'rect,10,15,200,21.5',
            'addPage,',
            'text,F2,100,47.25,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f2_1,100,68.75,{baseline:middle,align:center}',
            'setFillColor,#CCCCCC',
            'rect,0,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,0,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,205,47.25,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f1_1,205,68.75,{baseline:middle,align:right}',
            'setFillColor,#CCCCCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,210,15',
            'lineTo,210,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,405,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,36.5,200,21.5',
            'rect,10,58,200,21.5',
            'rect,10,15,200,21.5',
            'addPage,',
            'text,F2,195,47.25,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f2_1,195,68.75,{baseline:middle,align:right}',
            'setFillColor,#CCCCCC',
            'rect,0,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,195,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,47.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,15,68.75,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,210,15',
            'lineTo,210,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,15,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,36.5,200,21.5',
            'rect,10,58,200,21.5',
            'rect,10,15,200,21.5',
            'addPage,',
            'text,F2,5,47.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f2_1,5,68.75,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,0,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,-195,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,47.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,15,68.75,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,210,15',
            'lineTo,210,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,15,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,36.5,200,21.5',
            'rect,10,58,200,21.5',
            'rect,10,15,200,21.5',
            'addPage,',
            'text,F2,5,47.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f2_1,5,68.75,{baseline:middle}',
            'setFillColor,#CCCCCC',
            'rect,0,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4,-195,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,36.5,200,21.5',
            'rect,0,58,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, customizeCell, columnWidths: [ 200, 200 ] }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,15,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
            'text,Band1,15,25.75,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,10,36.5,200,21.5,F',
            'text,Band1_1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,10,15,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'text,F2,5,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f2_1_1,5,90.25,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,0,36.5,200,21.5,F',
            'setFillColor,#CCFFCC',
            'rect,0,15,200,21.5,F',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,15,200,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,58,{baseline:middle}',
            'setTextColor,#000000',
            'text,f3_1,5,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,15,200,21.5,F',
            'rect,0,36.5,200,43',
            'rect,0,79.5,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,110,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f1_1_1,110,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,210,15',
            'lineTo,210,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,310,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,10,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,210,36.5',
            'lineTo,210,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,210,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,10,15,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'text,F2,100,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f2_1_1,100,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCCCFF',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,200,36.5',
            'lineTo,200,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,0,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,100,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,15,200,21.5',
            'addPage,',
            'text,F3,100,58,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f3_1,100,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,0,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,-100,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,36.5,200,43',
            'rect,0,79.5,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,205,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f1_1_1,205,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,210,15',
            'lineTo,210,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,605,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,10,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,210,36.5',
            'lineTo,210,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,405,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,10,15,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'text,F2,195,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f2_1_1,195,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCCCFF',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,200,36.5',
            'lineTo,200,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,195,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,395,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,15,200,21.5',
            'addPage,',
            'text,F3,195,58,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f3_1,195,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,0,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,195,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,0,36.5,200,43',
            'rect,0,79.5,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,15,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,210,36.5',
            'lineTo,210,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3,15,47.25,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,10,15,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'text,F2,5,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f2_1_1,5,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-195,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,15,200,21.5',
            'addPage,',
            'text,F3,5,58,{baseline:middle}',
            'setTextColor,#000000',
            'text,f3_1,5,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-395,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,36.5,200,43',
            'rect,0,79.5,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,15,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,10,15,200,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,210,36.5',
            'lineTo,210,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3,15,47.25,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,10,15,200,21.5',
            'rect,10,36.5,200,21.5',
            'addPage,',
            'text,F2,5,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f2_1_1,5,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-195,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,0,15,200,21.5',
            'addPage,',
            'text,F3,5,58,{baseline:middle}',
            'setTextColor,#000000',
            'text,f3_1,5,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,15,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,200,15',
            'lineTo,200,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-395,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,36.5,200,43',
            'rect,0,79.5,200,21.5',
            'rect,0,15,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,68.75,{baseline:middle}',
            'text,F2,215,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,15,90.25,{baseline:middle}',
            'text,f2_1_1,215,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,10,15,400,21.5,F',
            'setTextColor,#979797',
            'text,Band1,15,25.75,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,10,36.5,400,21.5,F',
            'text,Band1_1,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,15,400,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'text,F3,5,68.75,{baseline:middle}',
            'text,F4,205,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f3_1_1,5,90.25,{baseline:middle}',
            'text,f4_1_2,205,90.25,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,0,36.5,200,21.5,F',
            'setFillColor,#CCCCFF',
            'rect,200,36.5,200,21.5,F',
            'setTextColor,#979797',
            'text,Band1_2,205,47.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,200,36.5,200,21.5',
            'rect,0,15,400,21.5',
            'addPage,',
            'text,F5,5,68.75,{baseline:middle}',
            'text,F6,205,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f5_1_2,5,90.25,{baseline:middle}',
            'text,f6_1_2,205,90.25,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,0,36.5,400,21.5,F',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,110,68.75,{baseline:middle,align:center}',
            'text,F2,310,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f1_1_1,110,90.25,{baseline:middle,align:center}',
            'text,f2_1_1,310,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,10,15,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,410,15',
            'lineTo,410,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,610,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,10,36.5,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,410,36.5',
            'lineTo,410,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,310,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,15,400,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'text,F3,100,68.75,{baseline:middle,align:center}',
            'text,F4,300,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f3_1_1,100,90.25,{baseline:middle,align:center}',
            'text,f4_1_2,300,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCCCFF',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,200,36.5',
            'lineTo,200,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,-100,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,200,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,200,36.5',
            'lineTo,400,36.5',
            'lineTo,400,58',
            'lineTo,200,58',
            'clip,',
            'discardPath,',
            'text,Band1_2,500,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,200,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,200,36.5,200,21.5',
            'rect,0,15,400,21.5',
            'addPage,',
            'text,F5,100,68.75,{baseline:middle,align:center}',
            'text,F6,300,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f5_1_2,100,90.25,{baseline:middle,align:center}',
            'text,f6_1_2,300,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCCCFF',
            'rect,0,36.5,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,400,36.5',
            'lineTo,400,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_2,100,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,-200,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,205,68.75,{baseline:middle,align:right}',
            'text,F2,405,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f1_1_1,205,90.25,{baseline:middle,align:right}',
            'text,f2_1_1,405,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,10,15,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,410,15',
            'lineTo,410,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,1205,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,10,36.5,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,410,36.5',
            'lineTo,410,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,605,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,15,400,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'text,F3,195,68.75,{baseline:middle,align:right}',
            'text,F4,395,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f3_1_1,195,90.25,{baseline:middle,align:right}',
            'text,f4_1_2,395,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCCCFF',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,200,36.5',
            'lineTo,200,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,195,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,200,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,200,36.5',
            'lineTo,400,36.5',
            'lineTo,400,58',
            'lineTo,200,58',
            'clip,',
            'discardPath,',
            'text,Band1_2,795,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,795,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,200,36.5,200,21.5',
            'rect,0,15,400,21.5',
            'addPage,',
            'text,F5,195,68.75,{baseline:middle,align:right}',
            'text,F6,395,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f5_1_2,195,90.25,{baseline:middle,align:right}',
            'text,f6_1_2,395,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCCCFF',
            'rect,0,36.5,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,400,36.5',
            'lineTo,400,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_2,395,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,395,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,68.75,{baseline:middle}',
            'text,F2,215,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,15,90.25,{baseline:middle}',
            'text,f2_1_1,215,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,10,15,400,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,410,36.5',
            'lineTo,410,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,15,47.25,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,15,400,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'text,F3,5,68.75,{baseline:middle}',
            'text,F4,205,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f3_1_1,5,90.25,{baseline:middle}',
            'text,f4_1_2,205,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-395,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,200,36.5,200,21.5',
            'rect,0,15,400,21.5',
            'addPage,',
            'text,F5,5,68.75,{baseline:middle}',
            'text,F6,205,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f5_1_2,5,90.25,{baseline:middle}',
            'text,f6_1_2,205,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,400,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-795,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,110,68.75,{baseline:middle,align:center}',
            'text,F2,310,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f1_1_1,110,90.25,{baseline:middle,align:center}',
            'text,f2_1_1,310,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,10,15,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,410,15',
            'lineTo,410,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,610,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,10,36.5,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,410,36.5',
            'lineTo,410,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,310,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,15,400,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'text,F3,100,68.75,{baseline:middle,align:center}',
            'text,F4,300,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f3_1_1,100,90.25,{baseline:middle,align:center}',
            'text,f4_1_2,300,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,200,36.5',
            'lineTo,200,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-100,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,200,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,200,36.5',
            'lineTo,400,36.5',
            'lineTo,400,58',
            'lineTo,200,58',
            'clip,',
            'discardPath,',
            'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,500,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,200,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,200,36.5,200,21.5',
            'rect,0,15,400,21.5',
            'addPage,',
            'text,F5,100,68.75,{baseline:middle,align:center}',
            'text,F6,300,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f5_1_2,100,90.25,{baseline:middle,align:center}',
            'text,f6_1_2,300,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,400,36.5',
            'lineTo,400,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,100,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-200,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,205,68.75,{baseline:middle,align:right}',
            'text,F2,405,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f1_1_1,205,90.25,{baseline:middle,align:right}',
            'text,f2_1_1,405,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,10,15,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,15',
            'lineTo,410,15',
            'lineTo,410,36.5',
            'lineTo,10,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,1205,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,10,36.5,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,410,36.5',
            'lineTo,410,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,605,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,15,400,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'text,F3,195,68.75,{baseline:middle,align:right}',
            'text,F4,395,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f3_1_1,195,90.25,{baseline:middle,align:right}',
            'text,f4_1_2,395,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,200,36.5',
            'lineTo,200,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,195,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,200,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,200,36.5',
            'lineTo,400,36.5',
            'lineTo,400,58',
            'lineTo,200,58',
            'clip,',
            'discardPath,',
            'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,795,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,795,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,200,36.5,200,21.5',
            'rect,0,15,400,21.5',
            'addPage,',
            'text,F5,195,68.75,{baseline:middle,align:right}',
            'text,F6,395,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f5_1_2,195,90.25,{baseline:middle,align:right}',
            'text,f6_1_2,395,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,36.5',
            'lineTo,400,36.5',
            'lineTo,400,58',
            'lineTo,0,58',
            'clip,',
            'discardPath,',
            'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,395,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,0,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,395,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,68.75,{baseline:middle}',
            'text,F2,215,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,15,90.25,{baseline:middle}',
            'text,f2_1_1,215,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,10,15,400,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,10,36.5',
            'lineTo,410,36.5',
            'lineTo,410,58',
            'lineTo,10,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,15,47.25,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,58,200,21.5',
            'rect,210,58,200,21.5',
            'rect,10,79.5,200,21.5',
            'rect,210,79.5,200,21.5',
            'rect,10,15,400,21.5',
            'rect,10,36.5,400,21.5',
            'addPage,',
            'text,F3,5,68.75,{baseline:middle}',
            'text,F4,205,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f3_1_1,5,90.25,{baseline:middle}',
            'text,f4_1_2,205,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,200,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-395,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,200,21.5',
            'rect,200,36.5,200,21.5',
            'rect,0,15,400,21.5',
            'addPage,',
            'text,F5,5,68.75,{baseline:middle}',
            'text,F6,205,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f5_1_2,5,90.25,{baseline:middle}',
            'text,f6_1_2,205,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,0,36.5,400,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,0,15',
            'lineTo,400,15',
            'lineTo,400,36.5',
            'lineTo,0,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-795,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,58,200,21.5',
            'rect,200,58,200,21.5',
            'rect,0,79.5,200,21.5',
            'rect,200,79.5,200,21.5',
            'rect,0,36.5,400,21.5',
            'rect,0,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,30,68.75,{baseline:middle}',
            'text,F2,230,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,30,90.25,{baseline:middle}',
            'text,f2_1_1,230,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,25,15,400,21.5,F',
            'setTextColor,#979797',
            'text,Band1,30,25.75,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,25,36.5,400,21.5,F',
            'text,Band1_1,30,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,25,58,200,21.5',
            'rect,225,58,200,21.5',
            'rect,25,79.5,200,21.5',
            'rect,225,79.5,200,21.5',
            'rect,25,15,400,21.5',
            'rect,25,36.5,400,21.5',
            'addPage,',
            'text,F3,20,68.75,{baseline:middle}',
            'text,F4,220,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f3_1_1,20,90.25,{baseline:middle}',
            'text,f4_1_2,220,90.25,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,15,36.5,200,21.5,F',
            'setFillColor,#CCCCFF',
            'rect,215,36.5,200,21.5,F',
            'setTextColor,#979797',
            'text,Band1_2,220,47.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,200,21.5',
            'rect,215,36.5,200,21.5',
            'rect,15,15,400,21.5',
            'addPage,',
            'text,F5,20,68.75,{baseline:middle}',
            'text,F6,220,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f5_1_2,20,90.25,{baseline:middle}',
            'text,f6_1_2,220,90.25,{baseline:middle}',
            'setFillColor,#CCCCFF',
            'rect,15,36.5,400,21.5,F',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,400,21.5',
            'rect,15,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,125,68.75,{baseline:middle,align:center}',
            'text,F2,325,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f1_1_1,125,90.25,{baseline:middle,align:center}',
            'text,f2_1_1,325,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,25,15,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,25,15',
            'lineTo,425,15',
            'lineTo,425,36.5',
            'lineTo,25,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,625,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,25,36.5,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,25,36.5',
            'lineTo,425,36.5',
            'lineTo,425,58',
            'lineTo,25,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,325,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,25,58,200,21.5',
            'rect,225,58,200,21.5',
            'rect,25,79.5,200,21.5',
            'rect,225,79.5,200,21.5',
            'rect,25,15,400,21.5',
            'rect,25,36.5,400,21.5',
            'addPage,',
            'text,F3,115,68.75,{baseline:middle,align:center}',
            'text,F4,315,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f3_1_1,115,90.25,{baseline:middle,align:center}',
            'text,f4_1_2,315,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCCCFF',
            'rect,15,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,15,36.5',
            'lineTo,215,36.5',
            'lineTo,215,58',
            'lineTo,15,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,-85,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,215,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,215,36.5',
            'lineTo,415,36.5',
            'lineTo,415,58',
            'lineTo,215,58',
            'clip,',
            'discardPath,',
            'text,Band1_2,515,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,215,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,200,21.5',
            'rect,215,36.5,200,21.5',
            'rect,15,15,400,21.5',
            'addPage,',
            'text,F5,115,68.75,{baseline:middle,align:center}',
            'text,F6,315,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f5_1_2,115,90.25,{baseline:middle,align:center}',
            'text,f6_1_2,315,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCCCFF',
            'rect,15,36.5,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,15,36.5',
            'lineTo,415,36.5',
            'lineTo,415,58',
            'lineTo,15,58',
            'clip,',
            'discardPath,',
            'text,Band1_2,115,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,-185,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,400,21.5',
            'rect,15,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,220,68.75,{baseline:middle,align:right}',
            'text,F2,420,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f1_1_1,220,90.25,{baseline:middle,align:right}',
            'text,f2_1_1,420,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,25,15,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,25,15',
            'lineTo,425,15',
            'lineTo,425,36.5',
            'lineTo,25,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,1220,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,25,36.5,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,25,36.5',
            'lineTo,425,36.5',
            'lineTo,425,58',
            'lineTo,25,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,620,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,25,58,200,21.5',
            'rect,225,58,200,21.5',
            'rect,25,79.5,200,21.5',
            'rect,225,79.5,200,21.5',
            'rect,25,15,400,21.5',
            'rect,25,36.5,400,21.5',
            'addPage,',
            'text,F3,210,68.75,{baseline:middle,align:right}',
            'text,F4,410,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f3_1_1,210,90.25,{baseline:middle,align:right}',
            'text,f4_1_2,410,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCCCFF',
            'rect,15,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,15,36.5',
            'lineTo,215,36.5',
            'lineTo,215,58',
            'lineTo,15,58',
            'clip,',
            'discardPath,',
            'text,Band1_1,210,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCCCFF',
            'rect,215,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,215,36.5',
            'lineTo,415,36.5',
            'lineTo,415,58',
            'lineTo,215,58',
            'clip,',
            'discardPath,',
            'text,Band1_2,810,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,810,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,200,21.5',
            'rect,215,36.5,200,21.5',
            'rect,15,15,400,21.5',
            'addPage,',
            'text,F5,210,68.75,{baseline:middle,align:right}',
            'text,F6,410,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f5_1_2,210,90.25,{baseline:middle,align:right}',
            'text,f6_1_2,410,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCCCFF',
            'rect,15,36.5,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,15,36.5',
            'lineTo,415,36.5',
            'lineTo,415,58',
            'lineTo,15,58',
            'clip,',
            'discardPath,',
            'text,Band1_2,410,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1,410,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,400,21.5',
            'rect,15,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,30,68.75,{baseline:middle}',
            'text,F2,230,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,30,90.25,{baseline:middle}',
            'text,f2_1_1,230,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,25,15,400,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,25,36.5',
            'lineTo,425,36.5',
            'lineTo,425,58',
            'lineTo,25,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,30,47.25,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,25,58,200,21.5',
            'rect,225,58,200,21.5',
            'rect,25,79.5,200,21.5',
            'rect,225,79.5,200,21.5',
            'rect,25,15,400,21.5',
            'rect,25,36.5,400,21.5',
            'addPage,',
            'text,F3,20,68.75,{baseline:middle}',
            'text,F4,220,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f3_1_1,20,90.25,{baseline:middle}',
            'text,f4_1_2,220,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,15,36.5,200,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-380,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,200,21.5',
            'rect,215,36.5,200,21.5',
            'rect,15,15,400,21.5',
            'addPage,',
            'text,F5,20,68.75,{baseline:middle}',
            'text,F6,220,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f5_1_2,20,90.25,{baseline:middle}',
            'text,f6_1_2,220,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,15,36.5,400,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-780,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,400,21.5',
            'rect,15,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,125,68.75,{baseline:middle,align:center}',
            'text,F2,325,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f1_1_1,125,90.25,{baseline:middle,align:center}',
            'text,f2_1_1,325,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,25,15,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,25,15',
            'lineTo,425,15',
            'lineTo,425,36.5',
            'lineTo,25,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,625,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,25,36.5,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,25,36.5',
            'lineTo,425,36.5',
            'lineTo,425,58',
            'lineTo,25,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,325,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,25,58,200,21.5',
            'rect,225,58,200,21.5',
            'rect,25,79.5,200,21.5',
            'rect,225,79.5,200,21.5',
            'rect,25,15,400,21.5',
            'rect,25,36.5,400,21.5',
            'addPage,',
            'text,F3,115,68.75,{baseline:middle,align:center}',
            'text,F4,315,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f3_1_1,115,90.25,{baseline:middle,align:center}',
            'text,f4_1_2,315,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,15,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,15,36.5',
            'lineTo,215,36.5',
            'lineTo,215,58',
            'lineTo,15,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,-85,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,215,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,215,36.5',
            'lineTo,415,36.5',
            'lineTo,415,58',
            'lineTo,215,58',
            'clip,',
            'discardPath,',
            'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,515,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,215,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,200,21.5',
            'rect,215,36.5,200,21.5',
            'rect,15,15,400,21.5',
            'addPage,',
            'text,F5,115,68.75,{baseline:middle,align:center}',
            'text,F6,315,68.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f5_1_2,115,90.25,{baseline:middle,align:center}',
            'text,f6_1_2,315,90.25,{baseline:middle,align:center}',
            'setFillColor,#CCFFCC',
            'rect,15,36.5,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,15,36.5',
            'lineTo,415,36.5',
            'lineTo,415,58',
            'lineTo,15,58',
            'clip,',
            'discardPath,',
            'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,115,47.25,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-185,25.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,400,21.5',
            'rect,15,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,220,68.75,{baseline:middle,align:right}',
            'text,F2,420,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f1_1_1,220,90.25,{baseline:middle,align:right}',
            'text,f2_1_1,420,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,25,15,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,25,15',
            'lineTo,425,15',
            'lineTo,425,36.5',
            'lineTo,25,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,1220,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,25,36.5,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,25,36.5',
            'lineTo,425,36.5',
            'lineTo,425,58',
            'lineTo,25,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,620,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,25,58,200,21.5',
            'rect,225,58,200,21.5',
            'rect,25,79.5,200,21.5',
            'rect,225,79.5,200,21.5',
            'rect,25,15,400,21.5',
            'rect,25,36.5,400,21.5',
            'addPage,',
            'text,F3,210,68.75,{baseline:middle,align:right}',
            'text,F4,410,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f3_1_1,210,90.25,{baseline:middle,align:right}',
            'text,f4_1_2,410,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,15,36.5,200,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,15,36.5',
            'lineTo,215,36.5',
            'lineTo,215,58',
            'lineTo,15,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,210,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,215,36.5,200,21.5,F',
            'saveGraphicsState,',
            'moveTo,215,36.5',
            'lineTo,415,36.5',
            'lineTo,415,58',
            'lineTo,215,58',
            'clip,',
            'discardPath,',
            'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,810,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,810,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,200,21.5',
            'rect,215,36.5,200,21.5',
            'rect,15,15,400,21.5',
            'addPage,',
            'text,F5,210,68.75,{baseline:middle,align:right}',
            'text,F6,410,68.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f5_1_2,210,90.25,{baseline:middle,align:right}',
            'text,f6_1_2,410,90.25,{baseline:middle,align:right}',
            'setFillColor,#CCFFCC',
            'rect,15,36.5,400,21.5,F',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,15,36.5',
            'lineTo,415,36.5',
            'lineTo,415,58',
            'lineTo,15,58',
            'clip,',
            'discardPath,',
            'text,Band1_2_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,410,47.25,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'setFillColor,#CCFFCC',
            'rect,15,15,400,21.5,F',
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,410,25.75,{baseline:middle,align:right}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,400,21.5',
            'rect,15,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,30,68.75,{baseline:middle}',
            'text,F2,230,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,30,90.25,{baseline:middle}',
            'text,f2_1_1,230,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,25,15,400,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,25,36.5',
            'lineTo,425,36.5',
            'lineTo,425,58',
            'lineTo,25,58',
            'clip,',
            'discardPath,',
            'text,Band1_1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5,30,47.25,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,25,58,200,21.5',
            'rect,225,58,200,21.5',
            'rect,25,79.5,200,21.5',
            'rect,225,79.5,200,21.5',
            'rect,25,15,400,21.5',
            'rect,25,36.5,400,21.5',
            'addPage,',
            'text,F3,20,68.75,{baseline:middle}',
            'text,F4,220,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f3_1_1,20,90.25,{baseline:middle}',
            'text,f4_1_2,220,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,15,36.5,200,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-380,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,200,21.5',
            'rect,215,36.5,200,21.5',
            'rect,15,15,400,21.5',
            'addPage,',
            'text,F5,20,68.75,{baseline:middle}',
            'text,F6,220,68.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f5_1_2,20,90.25,{baseline:middle}',
            'text,f6_1_2,220,90.25,{baseline:middle}',
            'setFillColor,#CCFFCC',
            'rect,15,36.5,400,21.5,F',
            'setTextColor,#979797',
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
            'saveGraphicsState,',
            'moveTo,15,15',
            'lineTo,415,15',
            'lineTo,415,36.5',
            'lineTo,15,36.5',
            'clip,',
            'discardPath,',
            'text,Band1_longtext_1_longtext_2_longtext_3_longtext_4_longtext_5_longtext_6_longtext_7_longtext_8_longtext_9_longtext_10_longtext_11,-780,25.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,15,58,200,21.5',
            'rect,215,58,200,21.5',
            'rect,15,79.5,200,21.5',
            'rect,215,79.5,200,21.5',
            'rect,15,36.5,400,21.5',
            'rect,15,15,400,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 15 }, columnWidths: [ 200, 200, 200, 200, 200, 200 ], customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,15,{baseline:top}',
            'text,F2,165,15,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,150,30',
            'rect,160,10,150,30',
            'addPage,',
            'text,Band1,15,15,{baseline:top}',
            'text,F2,165,15,{baseline:top}',
            'text,F1,15,45,{baseline:top}',
            'text,F1,15,85,{baseline:top}',
            'rect,10,10,150,30',
            'rect,160,10,150,60',
            'rect,10,40,150,30',
            'rect,10,80,150,30',
            'rect,160,80,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,15,{baseline:top}',
            'text,F2,165,15,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,150,30',
            'rect,160,10,150,30',
            'addPage,',
            'text,Band1,15,15,{baseline:top}',
            'text,F2,165,15,{baseline:top}',
            'text,F1,15,45,{baseline:top}',
            'text,F1,15,85,{baseline:top}',
            'rect,10,10,150,30',
            'rect,160,10,150,60',
            'rect,10,40,150,30',
            'rect,10,80,150,30',
            'rect,160,80,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,150,30',
            'rect,160,10,150,30',
            'addPage,',
            'text,Band1,15,25,{baseline:middle}',
            'text,F2,165,40,{baseline:middle}',
            'text,F1,15,55,{baseline:middle}',
            'text,F1,15,95,{baseline:middle}',
            'saveGraphicsState,',
            'moveTo,160,80',
            'lineTo,310,80',
            'lineTo,310,110',
            'lineTo,160,110',
            'clip,',
            'discardPath,',
            'text,F2,165,80,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,10,10,150,30',
            'rect,160,10,150,60',
            'rect,10,40,150,30',
            'rect,10,80,150,30',
            'rect,160,80,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,150,30',
            'rect,160,10,150,30',
            'addPage,',
            'text,Band1,15,25,{baseline:middle}',
            'text,F2,165,40,{baseline:middle}',
            'text,F1,15,55,{baseline:middle}',
            'text,F1,15,95,{baseline:middle}',
            'saveGraphicsState,',
            'moveTo,160,80',
            'lineTo,310,80',
            'lineTo,310,110',
            'lineTo,160,110',
            'clip,',
            'discardPath,',
            'text,F2,165,80,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,10,10,150,30',
            'rect,160,10,150,60',
            'rect,10,40,150,30',
            'rect,10,80,150,30',
            'rect,160,80,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,150,30',
            'rect,160,10,150,30',
            'addPage,',
            'text,Band1,15,35,{baseline:bottom}',
            'text,F2,165,65,{baseline:bottom}',
            'text,F1,15,65,{baseline:bottom}',
            'text,F1,15,105,{baseline:bottom}',
            'saveGraphicsState,',
            'moveTo,160,80',
            'lineTo,310,80',
            'lineTo,310,110',
            'lineTo,160,110',
            'clip,',
            'discardPath,',
            'text,F2,165,105,{baseline:bottom}',
            'restoreGraphicsState,',
            'rect,10,10,150,30',
            'rect,160,10,150,60',
            'rect,10,40,150,30',
            'rect,10,80,150,30',
            'rect,160,80,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,5,15,{baseline:middle}',
            'text,F2,302.64,30,{baseline:middle}',
            'text,F1,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,75,{baseline:middle}',
            'text,v1_2,302.64,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,60',
            'rect,0,30,297.64,30',
            'rect,0,60,297.64,30',
            'rect,297.64,60,297.64,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'text,v2_2,302.64,15,{baseline:middle}',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,5,15,{baseline:middle}',
            'text,F2,302.64,30,{baseline:middle}',
            'text,F1,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,75,{baseline:middle}',
            'text,v1_2,302.64,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,60',
            'rect,0,30,297.64,30',
            'rect,0,60,297.64,30',
            'rect,297.64,60,297.64,30',
            'addPage,',
            'setTextColor,#979797',
            'text,Band1,5,15,{baseline:middle}',
            'text,F2,302.64,30,{baseline:middle}',
            'text,F1,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,75,{baseline:middle}',
            'text,v2_2,302.64,75,{baseline:middle}',
            'rect,0,0,297.64,30',
            'rect,297.64,0,297.64,60',
            'rect,0,30,297.64,30',
            'rect,0,60,297.64,30',
            'rect,297.64,60,297.64,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,150,30',
            'rect,160,10,150,30',
            'addPage,',
            'text,Band1,15,35,{baseline:bottom}',
            'text,F2,165,65,{baseline:bottom}',
            'text,F1,15,65,{baseline:bottom}',
            'text,F1,15,105,{baseline:bottom}',
            'saveGraphicsState,',
            'moveTo,160,80',
            'lineTo,310,80',
            'lineTo,310,110',
            'lineTo,160,110',
            'clip,',
            'discardPath,',
            'text,F2,165,105,{baseline:bottom}',
            'restoreGraphicsState,',
            'rect,10,10,150,30',
            'rect,160,10,150,60',
            'rect,10,40,150,30',
            'rect,10,80,150,30',
            'rect,160,80,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,15,{baseline:top}',
            'text,F3,315,15,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,300,30',
            'rect,310,10,150,30',
            'addPage,',
            'text,Band1,15,15,{baseline:top}',
            'text,F3,315,15,{baseline:top}',
            'text,Band2,15,45,{baseline:top}',
            'text,F2,165,45,{baseline:top}',
            'text,F1,15,75,{baseline:top}',
            'text,Band2,15,115,{baseline:top}',
            'text,F2,165,115,{baseline:top}',
            'text,F1,15,145,{baseline:top}',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,160,110,150,60',
            'rect,10,140,150,30',
            'rect,310,110,150,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,15,{baseline:top}',
            'text,Band2,15,45,{baseline:top}',
            'text,F3,315,15,{baseline:top}',
            'text,F2,165,45,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,300,30',
            'rect,10,40,150,30',
            'rect,310,10,150,60',
            'rect,160,40,150,30',
            'addPage,',
            'text,Band1,15,15,{baseline:top}',
            'text,F3,315,15,{baseline:top}',
            'text,Band2,15,45,{baseline:top}',
            'text,F2,165,45,{baseline:top}',
            'text,F1,15,75,{baseline:top}',
            'text,F1,15,115,{baseline:top}',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,310,110,150,30',
            'rect,160,110,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,45,{baseline:top}',
            'text,F3,315,45,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,40,300,30',
            'rect,310,40,150,30',
            'addPage,',
            'text,Band1,15,15,{baseline:top}',
            'text,F3,315,15,{baseline:top}',
            'text,Band2,15,45,{baseline:top}',
            'text,F2,165,45,{baseline:top}',
            'text,F1,15,75,{baseline:top}',
            'text,Band2,15,115,{baseline:top}',
            'text,F2,165,115,{baseline:top}',
            'text,F1,15,145,{baseline:top}',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,160,110,150,60',
            'rect,10,140,150,30',
            'rect,310,110,150,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,15,{baseline:top}',
            'text,Band2,15,45,{baseline:top}',
            'text,F3,315,15,{baseline:top}',
            'text,F2,165,45,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,300,30',
            'rect,10,40,150,30',
            'rect,310,10,150,60',
            'rect,160,40,150,30',
            'addPage,',
            'text,Band1,15,15,{baseline:top}',
            'text,F3,315,15,{baseline:top}',
            'text,Band2,15,45,{baseline:top}',
            'text,F2,165,45,{baseline:top}',
            'text,F1,15,75,{baseline:top}',
            'text,F1,15,115,{baseline:top}',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,310,110,150,30',
            'rect,160,110,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,45,{baseline:top}',
            'text,F3,315,45,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,40,300,30',
            'rect,310,40,150,30',
            'addPage,',
            'text,Band1,15,15,{baseline:top}',
            'text,F3,315,15,{baseline:top}',
            'text,Band2,15,45,{baseline:top}',
            'text,F2,165,45,{baseline:top}',
            'text,F1,15,75,{baseline:top}',
            'text,Band2,15,115,{baseline:top}',
            'text,F2,165,115,{baseline:top}',
            'text,F1,15,145,{baseline:top}',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,160,110,150,60',
            'rect,10,140,150,30',
            'rect,310,110,150,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,25,{baseline:middle}',
            'saveGraphicsState,',
            'moveTo,310,10',
            'lineTo,460,10',
            'lineTo,460,40',
            'lineTo,310,40',
            'clip,',
            'discardPath,',
            'text,F3,315,55,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,300,30',
            'rect,310,10,150,30',
            'addPage,',
            'text,Band1,15,25,{baseline:middle}',
            'text,F3,315,55,{baseline:middle}',
            'text,Band2,15,55,{baseline:middle}',
            'text,F2,165,70,{baseline:middle}',
            'text,F1,15,85,{baseline:middle}',
            'text,Band2,15,125,{baseline:middle}',
            'text,F2,165,140,{baseline:middle}',
            'text,F1,15,155,{baseline:middle}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,170',
            'lineTo,310,170',
            'clip,',
            'discardPath,',
            'text,F3,315,125,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,160,110,150,60',
            'rect,10,140,150,30',
            'rect,310,110,150,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,5,15,{baseline:middle}',
            'text,F3,401.853,45,{baseline:middle}',
            'text,Band2,5,45,{baseline:middle}',
            'text,F2,203.427,60,{baseline:middle}',
            'text,F1,5,75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,105,{baseline:middle}',
            'text,v1_2,203.427,105,{baseline:middle}',
            'text,v1_3,401.853,105,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,396.853,30',
            'rect,396.853,0,198.427,90',
            'rect,0,30,198.427,30',
            'rect,198.427,30,198.427,60',
            'rect,0,60,198.427,30',
            'rect,0,90,198.427,30',
            'rect,198.427,90,198.427,30',
            'rect,396.853,90,198.427,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'text,v2_2,203.427,15,{baseline:middle}',
            'text,v1_3,401.853,15,{baseline:middle}',
            'rect,0,0,198.427,30',
            'rect,198.427,0,198.427,30',
            'rect,396.853,0,198.427,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,5,15,{baseline:middle}',
            'text,F3,401.853,45,{baseline:middle}',
            'text,Band2,5,45,{baseline:middle}',
            'text,F2,203.427,60,{baseline:middle}',
            'text,F1,5,75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,105,{baseline:middle}',
            'text,v1_2,203.427,105,{baseline:middle}',
            'text,v1_3,401.853,105,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,396.853,30',
            'rect,396.853,0,198.427,90',
            'rect,0,30,198.427,30',
            'rect,198.427,30,198.427,60',
            'rect,0,60,198.427,30',
            'rect,0,90,198.427,30',
            'rect,198.427,90,198.427,30',
            'rect,396.853,90,198.427,30',
            'addPage,',
            'setTextColor,#979797',
            'text,Band1,5,15,{baseline:middle}',
            'text,F3,401.853,45,{baseline:middle}',
            'text,Band2,5,45,{baseline:middle}',
            'text,F2,203.427,60,{baseline:middle}',
            'text,F1,5,75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,105,{baseline:middle}',
            'text,v2_2,203.427,105,{baseline:middle}',
            'text,v1_3,401.853,105,{baseline:middle}',
            'rect,0,0,396.853,30',
            'rect,396.853,0,198.427,90',
            'rect,0,30,198.427,30',
            'rect,198.427,30,198.427,60',
            'rect,0,60,198.427,30',
            'rect,0,90,198.427,30',
            'rect,198.427,90,198.427,30',
            'rect,396.853,90,198.427,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,300,30',
            'rect,10,40,150,30',
            'rect,310,10,150,60',
            'rect,160,40,150,30',
            'addPage,',
            'text,Band1,15,25,{baseline:middle}',
            'text,F3,315,55,{baseline:middle}',
            'text,Band2,15,55,{baseline:middle}',
            'text,F2,165,70,{baseline:middle}',
            'text,F1,15,85,{baseline:middle}',
            'text,F1,15,125,{baseline:middle}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,140',
            'lineTo,310,140',
            'clip,',
            'discardPath,',
            'text,F3,315,95,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,160,110',
            'lineTo,310,110',
            'lineTo,310,140',
            'lineTo,160,140',
            'clip,',
            'discardPath,',
            'text,F2,165,110,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,310,110,150,30',
            'rect,160,110,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,40,300,30',
            'rect,310,40,150,30',
            'addPage,',
            'text,Band1,15,25,{baseline:middle}',
            'text,F3,315,55,{baseline:middle}',
            'text,Band2,15,55,{baseline:middle}',
            'text,F2,165,70,{baseline:middle}',
            'text,F1,15,85,{baseline:middle}',
            'text,Band2,15,125,{baseline:middle}',
            'text,F2,165,140,{baseline:middle}',
            'text,F1,15,155,{baseline:middle}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,170',
            'lineTo,310,170',
            'clip,',
            'discardPath,',
            'text,F3,315,125,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,160,110,150,60',
            'rect,10,140,150,30',
            'rect,310,110,150,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,300,30',
            'rect,10,40,150,30',
            'rect,310,10,150,60',
            'rect,160,40,150,30',
            'addPage,',
            'text,Band1,15,25,{baseline:middle}',
            'text,F3,315,55,{baseline:middle}',
            'text,Band2,15,55,{baseline:middle}',
            'text,F2,165,70,{baseline:middle}',
            'text,F1,15,85,{baseline:middle}',
            'text,F1,15,125,{baseline:middle}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,140',
            'lineTo,310,140',
            'clip,',
            'discardPath,',
            'text,F3,315,95,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,160,110',
            'lineTo,310,110',
            'lineTo,310,140',
            'lineTo,160,140',
            'clip,',
            'discardPath,',
            'text,F2,165,110,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,310,110,150,30',
            'rect,160,110,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,40,300,30',
            'rect,310,40,150,30',
            'addPage,',
            'text,Band1,15,25,{baseline:middle}',
            'text,F3,315,55,{baseline:middle}',
            'text,Band2,15,55,{baseline:middle}',
            'text,F2,165,70,{baseline:middle}',
            'text,F1,15,85,{baseline:middle}',
            'text,Band2,15,125,{baseline:middle}',
            'text,F2,165,140,{baseline:middle}',
            'text,F1,15,155,{baseline:middle}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,170',
            'lineTo,310,170',
            'clip,',
            'discardPath,',
            'text,F3,315,125,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,160,110,150,60',
            'rect,10,140,150,30',
            'rect,310,110,150,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,35,{baseline:bottom}',
            'saveGraphicsState,',
            'moveTo,310,10',
            'lineTo,460,10',
            'lineTo,460,40',
            'lineTo,310,40',
            'clip,',
            'discardPath,',
            'text,F3,315,95,{baseline:bottom}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,300,30',
            'rect,310,10,150,30',
            'addPage,',
            'text,Band1,15,35,{baseline:bottom}',
            'text,F3,315,95,{baseline:bottom}',
            'text,Band2,15,65,{baseline:bottom}',
            'text,F2,165,95,{baseline:bottom}',
            'text,F1,15,95,{baseline:bottom}',
            'text,Band2,15,135,{baseline:bottom}',
            'text,F2,165,165,{baseline:bottom}',
            'text,F1,15,165,{baseline:bottom}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,170',
            'lineTo,310,170',
            'clip,',
            'discardPath,',
            'text,F3,315,165,{baseline:bottom}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,160,110,150,60',
            'rect,10,140,150,30',
            'rect,310,110,150,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,300,30',
            'rect,10,40,150,30',
            'rect,310,10,150,60',
            'rect,160,40,150,30',
            'addPage,',
            'text,Band1,15,35,{baseline:bottom}',
            'text,F3,315,95,{baseline:bottom}',
            'text,Band2,15,65,{baseline:bottom}',
            'text,F2,165,95,{baseline:bottom}',
            'text,F1,15,95,{baseline:bottom}',
            'text,F1,15,135,{baseline:bottom}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,140',
            'lineTo,310,140',
            'clip,',
            'discardPath,',
            'text,F3,315,135,{baseline:bottom}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,160,110',
            'lineTo,310,110',
            'lineTo,310,140',
            'lineTo,160,140',
            'clip,',
            'discardPath,',
            'text,F2,165,135,{baseline:bottom}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,310,110,150,30',
            'rect,160,110,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,40,300,30',
            'rect,310,40,150,30',
            'addPage,',
            'text,Band1,15,35,{baseline:bottom}',
            'text,F3,315,95,{baseline:bottom}',
            'text,Band2,15,65,{baseline:bottom}',
            'text,F2,165,95,{baseline:bottom}',
            'text,F1,15,95,{baseline:bottom}',
            'text,Band2,15,135,{baseline:bottom}',
            'text,F2,165,165,{baseline:bottom}',
            'text,F1,15,165,{baseline:bottom}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,170',
            'lineTo,310,170',
            'clip,',
            'discardPath,',
            'text,F3,315,165,{baseline:bottom}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,160,110,150,60',
            'rect,10,140,150,30',
            'rect,310,110,150,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,300,30',
            'rect,10,40,150,30',
            'rect,310,10,150,60',
            'rect,160,40,150,30',
            'addPage,',
            'text,Band1,15,35,{baseline:bottom}',
            'text,F3,315,95,{baseline:bottom}',
            'text,Band2,15,65,{baseline:bottom}',
            'text,F2,165,95,{baseline:bottom}',
            'text,F1,15,95,{baseline:bottom}',
            'text,F1,15,135,{baseline:bottom}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,140',
            'lineTo,310,140',
            'clip,',
            'discardPath,',
            'text,F3,315,135,{baseline:bottom}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,160,110',
            'lineTo,310,110',
            'lineTo,310,140',
            'lineTo,160,140',
            'clip,',
            'discardPath,',
            'text,F2,165,135,{baseline:bottom}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,310,110,150,30',
            'rect,160,110,150,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,40,300,30',
            'rect,310,40,150,30',
            'addPage,',
            'text,Band1,15,35,{baseline:bottom}',
            'text,F3,315,95,{baseline:bottom}',
            'text,Band2,15,65,{baseline:bottom}',
            'text,F2,165,95,{baseline:bottom}',
            'text,F1,15,95,{baseline:bottom}',
            'text,Band2,15,135,{baseline:bottom}',
            'text,F2,165,165,{baseline:bottom}',
            'text,F1,15,165,{baseline:bottom}',
            'saveGraphicsState,',
            'moveTo,310,110',
            'lineTo,460,110',
            'lineTo,460,170',
            'lineTo,310,170',
            'clip,',
            'discardPath,',
            'text,F3,315,165,{baseline:bottom}',
            'restoreGraphicsState,',
            'rect,10,10,300,30',
            'rect,310,10,150,90',
            'rect,10,40,150,30',
            'rect,160,40,150,60',
            'rect,10,70,150,30',
            'rect,10,110,150,30',
            'rect,160,110,150,60',
            'rect,10,140,150,30',
            'rect,310,110,150,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 30 }, columnWidths: [ 150, 150, 150 ], onRowExporting, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,35,{baseline:middle}',
            'text,F3,405.187,65,{baseline:middle}',
            'text,Band2,15,65,{baseline:middle}',
            'text,F2,210.093,80,{baseline:middle}',
            'text,F1,15,95,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,125,{baseline:middle}',
            'text,v1_2,210.093,125,{baseline:middle}',
            'text,v1_3,405.187,125,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,390.187,30',
            'rect,400.187,20,195.093,90',
            'rect,10,50,195.093,30',
            'rect,205.093,50,195.093,60',
            'rect,10,80,195.093,30',
            'rect,10,110,195.093,30',
            'rect,205.093,110,195.093,30',
            'rect,400.187,110,195.093,30',
            'addPage,',
            'text,v2_1,15,15,{baseline:middle}',
            'text,v2_2,210.093,15,{baseline:middle}',
            'text,v2_3,405.187,15,{baseline:middle}',
            'text,v2_1,15,45,{baseline:middle}',
            'text,v2_2,210.093,45,{baseline:middle}',
            'text,v3_3,405.187,45,{baseline:middle}',
            'rect,10,0,195.093,30',
            'rect,205.093,0,195.093,30',
            'rect,400.187,0,195.093,30',
            'rect,10,30,195.093,30',
            'rect,205.093,30,195.093,30',
            'rect,400.187,30,195.093,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 20 }, repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,35,{baseline:middle}',
            'text,F3,405.187,65,{baseline:middle}',
            'text,Band2,15,65,{baseline:middle}',
            'text,F2,210.093,80,{baseline:middle}',
            'text,F1,15,95,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,125,{baseline:middle}',
            'text,v1_2,210.093,125,{baseline:middle}',
            'text,v1_3,405.187,125,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,390.187,30',
            'rect,400.187,20,195.093,90',
            'rect,10,50,195.093,30',
            'rect,205.093,50,195.093,60',
            'rect,10,80,195.093,30',
            'rect,10,110,195.093,30',
            'rect,205.093,110,195.093,30',
            'rect,400.187,110,195.093,30',
            'addPage,',
            'setTextColor,#979797',
            'text,Band1,15,15,{baseline:middle}',
            'text,F3,405.187,45,{baseline:middle}',
            'text,Band2,15,45,{baseline:middle}',
            'text,F2,210.093,60,{baseline:middle}',
            'text,F1,15,75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,15,105,{baseline:middle}',
            'text,v2_2,210.093,105,{baseline:middle}',
            'text,v2_3,405.187,105,{baseline:middle}',
            'text,v3_1,15,135,{baseline:middle}',
            'text,v3_2,210.093,135,{baseline:middle}',
            'text,v3_3,405.187,135,{baseline:middle}',
            'rect,10,0,390.187,30',
            'rect,400.187,0,195.093,90',
            'rect,10,30,195.093,30',
            'rect,205.093,30,195.093,60',
            'rect,10,60,195.093,30',
            'rect,10,90,195.093,30',
            'rect,205.093,90,195.093,30',
            'rect,400.187,90,195.093,30',
            'rect,10,120,195.093,30',
            'rect,205.093,120,195.093,30',
            'rect,400.187,120,195.093,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 20 }, repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,35,{baseline:middle}',
            'text,F3,215,65,{baseline:middle}',
            'text,Band2,15,65,{baseline:middle}',
            'text,F2,115,80,{baseline:middle}',
            'text,F1,15,95,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,125,{baseline:middle}',
            'text,v1_2,115,125,{baseline:middle}',
            'text,v1_3,215,125,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,200,30',
            'rect,210,20,100,90',
            'rect,10,50,100,30',
            'rect,110,50,100,60',
            'rect,10,80,100,30',
            'rect,10,110,100,30',
            'rect,110,110,100,30',
            'rect,210,110,100,30',
            'addPage,',
            'text,v2_1,15,15,{baseline:middle}',
            'text,v2_2,115,15,{baseline:middle}',
            'text,v2_3,215,15,{baseline:middle}',
            'text,v2_1,15,45,{baseline:middle}',
            'text,v2_2,115,45,{baseline:middle}',
            'text,v3_3,215,45,{baseline:middle}',
            'rect,10,0,100,30',
            'rect,110,0,100,30',
            'rect,210,0,100,30',
            'rect,10,30,100,30',
            'rect,110,30,100,30',
            'rect,210,30,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 20 }, columnWidths: [100, 100, 100], repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,35,{baseline:middle}',
            'text,F3,215,65,{baseline:middle}',
            'text,Band2,15,65,{baseline:middle}',
            'text,F2,115,80,{baseline:middle}',
            'text,F1,15,95,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,125,{baseline:middle}',
            'text,v1_2,115,125,{baseline:middle}',
            'text,v1_3,215,125,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,200,30',
            'rect,210,20,100,90',
            'rect,10,50,100,30',
            'rect,110,50,100,60',
            'rect,10,80,100,30',
            'rect,10,110,100,30',
            'rect,110,110,100,30',
            'rect,210,110,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,Band1,15,15,{baseline:middle}',
            'text,F3,215,45,{baseline:middle}',
            'text,Band2,15,45,{baseline:middle}',
            'text,F2,115,60,{baseline:middle}',
            'text,F1,15,75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,15,105,{baseline:middle}',
            'text,v2_2,115,105,{baseline:middle}',
            'text,v2_3,215,105,{baseline:middle}',
            'text,v3_1,15,135,{baseline:middle}',
            'text,v3_2,115,135,{baseline:middle}',
            'text,v3_3,215,135,{baseline:middle}',
            'rect,10,0,200,30',
            'rect,210,0,100,90',
            'rect,10,30,100,30',
            'rect,110,30,100,60',
            'rect,10,60,100,30',
            'rect,10,90,100,30',
            'rect,110,90,100,30',
            'rect,210,90,100,30',
            'rect,10,120,100,30',
            'rect,110,120,100,30',
            'rect,210,120,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 20 }, columnWidths: [100, 100, 100], repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'addPage,',
            'text,v2_2,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'text,v3_1,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'text,v2_2,5,15,{baseline:middle}',
            'text,v3_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v2_1,5,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,45,{baseline:middle}',
            'text,v2_2,5,75,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'text,v3_1,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'addPage,',
            'text,v3_2,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v2_1,5,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,45,{baseline:middle}',
            'text,v2_2,5,75,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v2_1,5,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,45,{baseline:middle}',
            'text,v2_2,5,75,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,45,{baseline:middle}',
            'text,v2_3,5,75,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'text,v3_1,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'addPage,',
            'text,v3_2,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'addPage,',
            'text,v3_3,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100, 100], repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,45,{baseline:middle}',
            'text,v2_1,5,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,45,{baseline:middle}',
            'text,v2_2,5,75,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,45,{baseline:middle}',
            'text,v2_3,5,75,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_2,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,15,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_3,5,45,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100, 100], repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,395,590,{baseline:middle}',
            'text,F2,495,590,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,395,690,{baseline:middle}',
            'text,v1_2,495,690,{baseline:middle}',
            'text,v2_1,395,790,{baseline:middle}',
            'text,v2_2,495,790,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,390,540,100,100',
            'rect,490,540,100,100',
            'rect,390,640,100,100',
            'rect,490,640,100,100',
            'rect,390,740,100,100',
            'rect,490,740,100,100',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,590,{baseline:middle}',
            'text,F4,105,590,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,690,{baseline:middle}',
            'text,v1_4,105,690,{baseline:middle}',
            'text,v2_3,5,790,{baseline:middle}',
            'text,v2_4,105,790,{baseline:middle}',
            'rect,0,540,100,100',
            'rect,100,540,100,100',
            'rect,0,640,100,100',
            'rect,100,640,100,100',
            'rect,0,740,100,100',
            'rect,100,740,100,100',
            'addPage,',
            'text,v3_1,395,50,{baseline:middle}',
            'text,v3_2,495,50,{baseline:middle}',
            'text,v4_1,395,150,{baseline:middle}',
            'text,v4_2,495,150,{baseline:middle}',
            'rect,390,0,100,100',
            'rect,490,0,100,100',
            'rect,390,100,100,100',
            'rect,490,100,100,100',
            'addPage,',
            'text,v3_3,5,50,{baseline:middle}',
            'text,v3_4,105,50,{baseline:middle}',
            'text,v4_3,5,150,{baseline:middle}',
            'text,v4_4,105,150,{baseline:middle}',
            'rect,0,0,100,100',
            'rect,100,0,100,100',
            'rect,0,100,100,100',
            'rect,100,100,100,100',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 390, y: 540 }, columnWidths: [100, 100, 100, 100], repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,395,590,{baseline:middle}',
            'text,F2,495,590,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,395,690,{baseline:middle}',
            'text,v1_2,495,690,{baseline:middle}',
            'text,v2_1,395,790,{baseline:middle}',
            'text,v2_2,495,790,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,390,540,100,100',
            'rect,490,540,100,100',
            'rect,390,640,100,100',
            'rect,490,640,100,100',
            'rect,390,740,100,100',
            'rect,490,740,100,100',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,590,{baseline:middle}',
            'text,F4,105,590,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,690,{baseline:middle}',
            'text,v1_4,105,690,{baseline:middle}',
            'text,v2_3,5,790,{baseline:middle}',
            'text,v2_4,105,790,{baseline:middle}',
            'rect,0,540,100,100',
            'rect,100,540,100,100',
            'rect,0,640,100,100',
            'rect,100,640,100,100',
            'rect,0,740,100,100',
            'rect,100,740,100,100',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,395,50,{baseline:middle}',
            'text,F2,495,50,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,395,150,{baseline:middle}',
            'text,v3_2,495,150,{baseline:middle}',
            'text,v4_1,395,250,{baseline:middle}',
            'text,v4_2,495,250,{baseline:middle}',
            'rect,390,0,100,100',
            'rect,490,0,100,100',
            'rect,390,100,100,100',
            'rect,490,100,100,100',
            'rect,390,200,100,100',
            'rect,490,200,100,100',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,50,{baseline:middle}',
            'text,F4,105,50,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_3,5,150,{baseline:middle}',
            'text,v3_4,105,150,{baseline:middle}',
            'text,v4_3,5,250,{baseline:middle}',
            'text,v4_4,105,250,{baseline:middle}',
            'rect,0,0,100,100',
            'rect,100,0,100,100',
            'rect,0,100,100,100',
            'rect,100,100,100,100',
            'rect,0,200,100,100',
            'rect,100,200,100,100',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 390, y: 540 }, columnWidths: [100, 100, 100, 100], repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,5,15,{baseline:middle}',
            'text,F1,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,30,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,75,{baseline:middle}',
            'rect,0,0,100,60',
            'rect,0,60,100,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'addPage,',
            'text,v2_2,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,5,15,{baseline:middle}',
            'text,F1,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,30,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,75,{baseline:middle}',
            'rect,0,0,100,60',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,Band1,5,15,{baseline:middle}',
            'text,F1,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,75,{baseline:middle}',
            'rect,0,0,100,30',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,30,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_2,5,75,{baseline:middle}',
            'rect,0,0,100,60',
            'rect,0,60,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100], repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band2,5,45,{baseline:middle}',
            'text,F1,5,75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,105,{baseline:middle}',
            'setTextColor,#979797',
            'text,Band1,5,15,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,30,100,30',
            'rect,0,60,100,30',
            'rect,0,90,100,30',
            'rect,0,0,100,30',
            'addPage,',
            'text,F2,5,60,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,105,{baseline:middle}',
            'rect,0,30,100,60',
            'rect,0,90,100,30',
            'rect,0,0,100,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,105,{baseline:middle}',
            'rect,0,0,100,90',
            'rect,0,90,100,30',
            'addPage,',
            'text,v2_1,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'addPage,',
            'text,v2_2,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'addPage,',
            'text,v1_3,5,15,{baseline:middle}',
            'rect,0,0,100,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [100, 100, 100], repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band2,5,45,{baseline:middle}',
            'text,F1,5,75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,5,105,{baseline:middle}',
            'setTextColor,#979797',
            'text,Band1,5,15,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,30,80,30',
            'rect,0,60,80,30',
            'rect,0,90,80,30',
            'rect,0,0,80,30',
            'addPage,',
            'text,F2,5,60,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,105,{baseline:middle}',
            'rect,0,30,80,60',
            'rect,0,90,80,30',
            'rect,0,0,80,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,105,{baseline:middle}',
            'rect,0,0,80,90',
            'rect,0,90,80,30',
            'addPage,',
            'setTextColor,#979797',
            'text,Band2,5,45,{baseline:middle}',
            'text,F1,5,75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,5,105,{baseline:middle}',
            'setTextColor,#979797',
            'text,Band1,5,15,{baseline:middle}',
            'rect,0,30,80,30',
            'rect,0,60,80,30',
            'rect,0,90,80,30',
            'rect,0,0,80,30',
            'addPage,',
            'text,F2,5,60,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_2,5,105,{baseline:middle}',
            'rect,0,30,80,60',
            'rect,0,90,80,30',
            'rect,0,0,80,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,105,{baseline:middle}',
            'rect,0,0,80,90',
            'rect,0,90,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 0, y: 0 }, columnWidths: [80, 80, 80], repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band2,15,65,{baseline:middle}',
            'text,F1,15,95,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,125,{baseline:middle}',
            'setTextColor,#979797',
            'text,Band1,15,35,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,50,80,30',
            'rect,10,80,80,30',
            'rect,10,110,80,30',
            'rect,10,20,80,30',
            'addPage,',
            'text,F2,5,80,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,125,{baseline:middle}',
            'rect,0,50,80,60',
            'rect,0,110,80,30',
            'rect,0,20,80,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,65,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,125,{baseline:middle}',
            'rect,0,20,80,90',
            'rect,0,110,80,30',
            'addPage,',
            'text,v2_1,15,15,{baseline:middle}',
            'text,v2_1,15,45,{baseline:middle}',
            'rect,10,0,80,30',
            'rect,10,30,80,30',
            'addPage,',
            'text,v2_2,5,15,{baseline:middle}',
            'text,v2_2,5,45,{baseline:middle}',
            'rect,0,0,80,30',
            'rect,0,30,80,30',
            'addPage,',
            'text,v2_3,5,15,{baseline:middle}',
            'text,v3_3,5,45,{baseline:middle}',
            'rect,0,0,80,30',
            'rect,0,30,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80, 80], repeatHeaders: false, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band2,15,65,{baseline:middle}',
            'text,F1,15,95,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,125,{baseline:middle}',
            'setTextColor,#979797',
            'text,Band1,15,35,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,50,80,30',
            'rect,10,80,80,30',
            'rect,10,110,80,30',
            'rect,10,20,80,30',
            'addPage,',
            'text,F2,5,80,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,125,{baseline:middle}',
            'rect,0,50,80,60',
            'rect,0,110,80,30',
            'rect,0,20,80,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,65,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,125,{baseline:middle}',
            'rect,0,20,80,90',
            'rect,0,110,80,30',
            'addPage,',
            'setTextColor,#979797',
            'text,Band2,15,45,{baseline:middle}',
            'text,F1,15,75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_1,15,105,{baseline:middle}',
            'text,v3_1,15,135,{baseline:middle}',
            'setTextColor,#979797',
            'text,Band1,15,15,{baseline:middle}',
            'rect,10,30,80,30',
            'rect,10,60,80,30',
            'rect,10,90,80,30',
            'rect,10,120,80,30',
            'rect,10,0,80,30',
            'addPage,',
            'text,F2,5,60,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_2,5,105,{baseline:middle}',
            'text,v3_2,5,135,{baseline:middle}',
            'rect,0,30,80,60',
            'rect,0,90,80,30',
            'rect,0,120,80,30',
            'rect,0,0,80,30',
            'addPage,',
            'setTextColor,#979797',
            'text,F3,5,45,{baseline:middle}',
            'setTextColor,#000000',
            'text,v2_3,5,105,{baseline:middle}',
            'text,v3_3,5,135,{baseline:middle}',
            'rect,0,0,80,90',
            'rect,0,90,80,30',
            'rect,0,120,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80, 80], repeatHeaders: true, onRowExporting }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,85.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,106.75,{baseline:middle}',
            'text,v2_1,15,128.25,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,20',
            'lineTo,90,20',
            'lineTo,90,53',
            'lineTo,10,53',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,15,30.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,10,53',
            'lineTo,90,53',
            'lineTo,90,74.5',
            'lineTo,10,74.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line line 2,15,63.75,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,74.5,80,21.5',
            'rect,10,96,80,21.5',
            'rect,10,117.5,80,21.5',
            'rect,10,20,80,33',
            'rect,10,53,80,21.5',
            'addPage,',
            'text,F2,5,85.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,106.75,{baseline:middle}',
            'text,v2_2,5,128.25,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,20',
            'lineTo,80,20',
            'lineTo,80,53',
            'lineTo,0,53',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-75,30.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,0,53',
            'lineTo,80,53',
            'lineTo,80,74.5',
            'lineTo,0,74.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line line 2,-75,63.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,74.5,80,21.5',
            'rect,0,96,80,21.5',
            'rect,0,117.5,80,21.5',
            'rect,0,20,80,33',
            'rect,0,53,80,21.5',
            'addPage,',
            'text,F3,5,85.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,106.75,{baseline:middle}',
            'text,v2_3,5,128.25,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,20',
            'lineTo,80,20',
            'lineTo,80,53',
            'lineTo,0,53',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-155,30.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,0,53',
            'lineTo,80,53',
            'lineTo,80,74.5',
            'lineTo,0,74.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line line 2,-155,63.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,74.5,80,21.5',
            'rect,0,96,80,21.5',
            'rect,0,117.5,80,21.5',
            'rect,0,20,80,33',
            'rect,0,53,80,21.5',
            'addPage,',
            'text,F1,15,65.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,15,86.75,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,0',
            'lineTo,90,0',
            'lineTo,90,33',
            'lineTo,10,33',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,15,10.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,10,33',
            'lineTo,90,33',
            'lineTo,90,54.5',
            'lineTo,10,54.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line line 2,15,43.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,10,54.5,80,21.5',
            'rect,10,76,80,21.5',
            'rect,10,0,80,33',
            'rect,10,33,80,21.5',
            'addPage,',
            'text,F2,5,65.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_2,5,86.75,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,0',
            'lineTo,80,0',
            'lineTo,80,33',
            'lineTo,0,33',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-75,10.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,0,33',
            'lineTo,80,33',
            'lineTo,80,54.5',
            'lineTo,0,54.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line line 2,-75,43.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,54.5,80,21.5',
            'rect,0,76,80,21.5',
            'rect,0,0,80,33',
            'rect,0,33,80,21.5',
            'addPage,',
            'text,F3,5,65.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_3,5,86.75,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,0',
            'lineTo,80,0',
            'lineTo,80,33',
            'lineTo,0,33',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-155,10.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,0,33',
            'lineTo,80,33',
            'lineTo,80,54.5',
            'lineTo,0,54.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line line 2,-155,43.75,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,54.5,80,21.5',
            'rect,0,76,80,21.5',
            'rect,0,0,80,33',
            'rect,0,33,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80, 80], repeatHeaders: true }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,85.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15,106.75,{baseline:middle}',
            'text,v2_1,15,128.25,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,20',
            'lineTo,90,20',
            'lineTo,90,53',
            'lineTo,10,53',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,15,30.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,10,53',
            'lineTo,90,53',
            'lineTo,90,74.5',
            'lineTo,10,74.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line2,130,63.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,74.5,80,21.5',
            'rect,10,96,80,21.5',
            'rect,10,117.5,80,21.5',
            'rect,10,20,80,33',
            'rect,10,53,80,21.5',
            'addPage,',
            'text,F2,5,85.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,5,106.75,{baseline:middle}',
            'text,v2_2,5,128.25,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,20',
            'lineTo,80,20',
            'lineTo,80,53',
            'lineTo,0,53',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-75,30.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,0,53',
            'lineTo,80,53',
            'lineTo,80,74.5',
            'lineTo,0,74.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line2,40,63.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,74.5,80,21.5',
            'rect,0,96,80,21.5',
            'rect,0,117.5,80,21.5',
            'rect,0,20,80,33',
            'rect,0,53,80,21.5',
            'addPage,',
            'text,F3,5,85.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,106.75,{baseline:middle}',
            'text,v2_3,5,128.25,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,20',
            'lineTo,80,20',
            'lineTo,80,53',
            'lineTo,0,53',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-155,30.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,0,53',
            'lineTo,80,53',
            'lineTo,80,74.5',
            'lineTo,0,74.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line2,-40,63.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,74.5,80,21.5',
            'rect,0,96,80,21.5',
            'rect,0,117.5,80,21.5',
            'rect,0,20,80,33',
            'rect,0,53,80,21.5',
            'addPage,',
            'text,F1,15,65.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_1,15,86.75,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,10,0',
            'lineTo,90,0',
            'lineTo,90,33',
            'lineTo,10,33',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,15,10.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,10,33',
            'lineTo,90,33',
            'lineTo,90,54.5',
            'lineTo,10,54.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line2,130,43.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,10,54.5,80,21.5',
            'rect,10,76,80,21.5',
            'rect,10,0,80,33',
            'rect,10,33,80,21.5',
            'addPage,',
            'text,F2,5,65.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_2,5,86.75,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,0',
            'lineTo,80,0',
            'lineTo,80,33',
            'lineTo,0,33',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-75,10.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,0,33',
            'lineTo,80,33',
            'lineTo,80,54.5',
            'lineTo,0,54.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line2,40,43.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,54.5,80,21.5',
            'rect,0,76,80,21.5',
            'rect,0,0,80,33',
            'rect,0,33,80,21.5',
            'addPage,',
            'text,F3,5,65.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,v3_3,5,86.75,{baseline:middle}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,0,0',
            'lineTo,80,0',
            'lineTo,80,33',
            'lineTo,0,33',
            'clip,',
            'discardPath,',
            'text,Band1 very long line very long line very long line\n' +
'very long line very long line very long line 1,-155,10.75,{baseline:middle}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,0,33',
            'lineTo,80,33',
            'lineTo,80,54.5',
            'lineTo,0,54.5',
            'clip,',
            'discardPath,',
            'text,Band2 very long line2,-40,43.75,{baseline:middle,align:center}',
            'restoreGraphicsState,',
            'rect,0,54.5,80,21.5',
            'rect,0,76,80,21.5',
            'rect,0,0,80,33',
            'rect,0,33,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80, 80], repeatHeaders: true, customizeCell }).then(() => {
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
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,15,30.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_2,15,85.25,{baseline:middle}',
            'text,v2_2,15,106.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,10,41.5',
            'lineTo,90,41.5',
            'lineTo,90,74.5',
            'lineTo,10,74.5',
            'clip,',
            'discardPath,',
            'text,F1: v1_1 very long line, very\n' +
'very long line,15,52.25,{baseline:middle}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,80,21.5',
            'rect,10,74.5,80,21.5',
            'rect,10,96,80,21.5',
            'rect,10,41.5,80,33',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,F3,5,30.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_3,5,85.25,{baseline:middle}',
            'text,v2_3,5,106.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,0,41.5',
            'lineTo,80,41.5',
            'lineTo,80,74.5',
            'lineTo,0,74.5',
            'clip,',
            'discardPath,',
            'text,F1: v1_1 very long line, very\n' +
'very long line,-75,52.25,{baseline:middle}',
            'restoreGraphicsState,',
            'rect,0,20,80,21.5',
            'rect,0,74.5,80,21.5',
            'rect,0,96,80,21.5',
            'rect,0,41.5,80,33',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin, topLeft: { x: 10, y: 20 }, columnWidths: [80, 80], repeatHeaders: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});

QUnit.module('RTL support', moduleConfig, () => {
    QUnit.test('2 pages, 4 cols with bands, grouping, and column widths. horizontalAlign=undefined', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                'CompanyName',
                'Phone',
                { caption: 'address 1111111111111111111111111', columns: [ 'Fax', 'City' ] },
                {
                    dataField: 'State',
                    groupIndex: 0,
                },
            ],
            summary: {
                groupItems: [
                    { column: 'City', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'City', summaryType: 'max' }
                ]
            },
            dataSource: [
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 12345678901011121314151617181920' },
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 1234567890101112' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Company Name,480.28,51.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Phone,330.28,51.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Test company,480.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),330.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Test company,480.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),330.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,State: Washington 1234567890101112,480.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'saveGraphicsState,',
            'moveTo,165.28,137.5',
            'lineTo,485.28,137.5',
            'lineTo,485.28,159',
            'lineTo,165.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,480.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,335.28,30,150,43',
            'rect,165.28,30,170,43',
            'rect,335.28,94.5,150,21.5',
            'rect,165.28,94.5,170,21.5',
            'rect,335.28,116,150,21.5',
            'rect,165.28,116,170,21.5',
            'rect,335.28,159,150,21.5',
            'rect,165.28,159,170,21.5',
            'rect,335.28,180.5,150,21.5',
            'rect,165.28,180.5,170,21.5',
            'rect,335.28,202,150,21.5',
            'rect,165.28,202,170,21.5',
            'rect,165.28,73,320,21.5',
            'rect,165.28,137.5,320,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,address 1111111111111111111111111,480.28,40.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Fax,480.28,62.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,City,360.28,62.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456,480.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Minneapolis,360.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,360.28,126.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,123456,480.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Minneapolis,360.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,360.28,191.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: Minneapolis,360.28,212.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'saveGraphicsState,',
            'moveTo,225.28,137.5',
            'lineTo,485.28,137.5',
            'lineTo,485.28,159',
            'lineTo,225.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,800.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,225.28,30,260,21.5',
            'rect,365.28,51.5,120,21.5',
            'rect,225.28,51.5,140,21.5',
            'rect,365.28,94.5,120,21.5',
            'rect,225.28,94.5,140,21.5',
            'rect,365.28,116,120,21.5',
            'rect,225.28,116,140,21.5',
            'rect,365.28,159,120,21.5',
            'rect,225.28,159,140,21.5',
            'rect,365.28,180.5,120,21.5',
            'rect,225.28,180.5,140,21.5',
            'rect,365.28,202,120,21.5',
            'rect,225.28,202,140,21.5',
            'rect,225.28,73,260,21.5',
            'rect,225.28,137.5,260,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 30, right: 110, bottom: 30, left: 110 }, topLeft: { x: 0, y: 0 }, columnWidths: [150, 170, 120, 140] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 pages, 4 cols with bands, grouping, and column widths. horizontalAlign=undefined, horizontalAlign=left', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                'CompanyName',
                'Phone',
                { caption: 'address 1111111111111111111111111', columns: [ 'Fax', 'City' ] },
                {
                    dataField: 'State',
                    groupIndex: 0,
                },
            ],
            summary: {
                groupItems: [
                    { column: 'City', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'City', summaryType: 'max' }
                ]
            },
            dataSource: [
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 12345678901011121314151617181920' },
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 1234567890101112' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Company Name,340.28,51.5,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Phone,170.28,51.5,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Test company,340.28,105.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),170.28,105.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Test company,340.28,169.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),170.28,169.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,165.28,73',
            'lineTo,485.28,73',
            'lineTo,485.28,94.5',
            'lineTo,165.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,-89.72,83.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,165.28,137.5',
            'lineTo,485.28,137.5',
            'lineTo,485.28,159',
            'lineTo,165.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,-89.72,148.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,335.28,30,150,43',
            'rect,165.28,30,170,43',
            'rect,335.28,94.5,150,21.5',
            'rect,165.28,94.5,170,21.5',
            'rect,335.28,116,150,21.5',
            'rect,165.28,116,170,21.5',
            'rect,335.28,159,150,21.5',
            'rect,165.28,159,170,21.5',
            'rect,335.28,180.5,150,21.5',
            'rect,165.28,180.5,170,21.5',
            'rect,335.28,202,150,21.5',
            'rect,165.28,202,170,21.5',
            'rect,165.28,73,320,21.5',
            'rect,165.28,137.5,320,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,address 1111111111111111111111111,230.28,40.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Fax,370.28,62.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,City,230.28,62.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456,370.28,105.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Minneapolis,230.28,105.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,230.28,126.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,123456,370.28,169.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Minneapolis,230.28,169.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,230.28,191.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: Minneapolis,230.28,212.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'saveGraphicsState,',
            'moveTo,225.28,73',
            'lineTo,485.28,73',
            'lineTo,485.28,94.5',
            'lineTo,225.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,230.28,83.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,225.28,137.5',
            'lineTo,485.28,137.5',
            'lineTo,485.28,159',
            'lineTo,225.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,230.28,148.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,225.28,30,260,21.5',
            'rect,365.28,51.5,120,21.5',
            'rect,225.28,51.5,140,21.5',
            'rect,365.28,94.5,120,21.5',
            'rect,225.28,94.5,140,21.5',
            'rect,365.28,116,120,21.5',
            'rect,225.28,116,140,21.5',
            'rect,365.28,159,120,21.5',
            'rect,225.28,159,140,21.5',
            'rect,365.28,180.5,120,21.5',
            'rect,225.28,180.5,140,21.5',
            'rect,365.28,202,120,21.5',
            'rect,225.28,202,140,21.5',
            'rect,225.28,73,260,21.5',
            'rect,225.28,137.5,260,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 30, right: 110, bottom: 30, left: 110 }, topLeft: { x: 0, y: 0 },
            customizeCell: ({ pdfCell }) => {
                pdfCell.horizontalAlign = 'left';
            }, columnWidths: [150, 170, 120, 140] }
        ).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 pages, 4 cols with bands, grouping, and column widths. horizontalAlign=undefined, horizontalAlign=center', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                'CompanyName',
                'Phone',
                { caption: 'address 1111111111111111111111111', columns: [ 'Fax', 'City' ] },
                {
                    dataField: 'State',
                    groupIndex: 0,
                },
            ],
            summary: {
                groupItems: [
                    { column: 'City', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'City', summaryType: 'max' }
                ]
            },
            dataSource: [
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 12345678901011121314151617181920' },
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 1234567890101112' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Company Name,410.28,51.5,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Phone,250.28,51.5,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Test company,410.28,105.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),250.28,105.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Test company,410.28,169.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),250.28,169.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,165.28,73',
            'lineTo,485.28,73',
            'lineTo,485.28,94.5',
            'lineTo,165.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,195.28,83.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,165.28,137.5',
            'lineTo,485.28,137.5',
            'lineTo,485.28,159',
            'lineTo,165.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,195.28,148.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,335.28,30,150,43',
            'rect,165.28,30,170,43',
            'rect,335.28,94.5,150,21.5',
            'rect,165.28,94.5,170,21.5',
            'rect,335.28,116,150,21.5',
            'rect,165.28,116,170,21.5',
            'rect,335.28,159,150,21.5',
            'rect,165.28,159,170,21.5',
            'rect,335.28,180.5,150,21.5',
            'rect,165.28,180.5,170,21.5',
            'rect,335.28,202,150,21.5',
            'rect,165.28,202,170,21.5',
            'rect,165.28,73,320,21.5',
            'rect,165.28,137.5,320,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,address 1111111111111111111111111,355.28,40.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Fax,425.28,62.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,City,295.28,62.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456,425.28,105.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Minneapolis,295.28,105.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,295.28,126.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,123456,425.28,169.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Minneapolis,295.28,169.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,295.28,191.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: Minneapolis,295.28,212.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'saveGraphicsState,',
            'moveTo,225.28,73',
            'lineTo,485.28,73',
            'lineTo,485.28,94.5',
            'lineTo,225.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,485.28,83.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,225.28,137.5',
            'lineTo,485.28,137.5',
            'lineTo,485.28,159',
            'lineTo,225.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,485.28,148.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,225.28,30,260,21.5',
            'rect,365.28,51.5,120,21.5',
            'rect,225.28,51.5,140,21.5',
            'rect,365.28,94.5,120,21.5',
            'rect,225.28,94.5,140,21.5',
            'rect,365.28,116,120,21.5',
            'rect,225.28,116,140,21.5',
            'rect,365.28,159,120,21.5',
            'rect,225.28,159,140,21.5',
            'rect,365.28,180.5,120,21.5',
            'rect,225.28,180.5,140,21.5',
            'rect,365.28,202,120,21.5',
            'rect,225.28,202,140,21.5',
            'rect,225.28,73,260,21.5',
            'rect,225.28,137.5,260,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 30, right: 110, bottom: 30, left: 110 }, topLeft: { x: 0, y: 0 },
            customizeCell: ({ pdfCell }) => {
                pdfCell.horizontalAlign = 'center';
            }, columnWidths: [150, 170, 120, 140] }
        ).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 pages, 4 cols with bands, grouping, and column widths. horizontalAlign=undefined, horizontalAlign=right', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                'CompanyName',
                'Phone',
                { caption: 'address 1111111111111111111111111', columns: [ 'Fax', 'City' ] },
                {
                    dataField: 'State',
                    groupIndex: 0,
                },
            ],
            summary: {
                groupItems: [
                    { column: 'City', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'City', summaryType: 'max' }
                ]
            },
            dataSource: [
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 12345678901011121314151617181920' },
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 1234567890101112' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Company Name,480.28,51.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Phone,330.28,51.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Test company,480.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),330.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Test company,480.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),330.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,State: Washington 1234567890101112,480.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'saveGraphicsState,',
            'moveTo,165.28,137.5',
            'lineTo,485.28,137.5',
            'lineTo,485.28,159',
            'lineTo,165.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,480.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,335.28,30,150,43',
            'rect,165.28,30,170,43',
            'rect,335.28,94.5,150,21.5',
            'rect,165.28,94.5,170,21.5',
            'rect,335.28,116,150,21.5',
            'rect,165.28,116,170,21.5',
            'rect,335.28,159,150,21.5',
            'rect,165.28,159,170,21.5',
            'rect,335.28,180.5,150,21.5',
            'rect,165.28,180.5,170,21.5',
            'rect,335.28,202,150,21.5',
            'rect,165.28,202,170,21.5',
            'rect,165.28,73,320,21.5',
            'rect,165.28,137.5,320,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,address 1111111111111111111111111,480.28,40.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Fax,480.28,62.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,City,360.28,62.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456,480.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Minneapolis,360.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,360.28,126.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,123456,480.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Minneapolis,360.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,360.28,191.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: Minneapolis,360.28,212.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'saveGraphicsState,',
            'moveTo,225.28,137.5',
            'lineTo,485.28,137.5',
            'lineTo,485.28,159',
            'lineTo,225.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,800.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,225.28,30,260,21.5',
            'rect,365.28,51.5,120,21.5',
            'rect,225.28,51.5,140,21.5',
            'rect,365.28,94.5,120,21.5',
            'rect,225.28,94.5,140,21.5',
            'rect,365.28,116,120,21.5',
            'rect,225.28,116,140,21.5',
            'rect,365.28,159,120,21.5',
            'rect,225.28,159,140,21.5',
            'rect,365.28,180.5,120,21.5',
            'rect,225.28,180.5,140,21.5',
            'rect,365.28,202,120,21.5',
            'rect,225.28,202,140,21.5',
            'rect,225.28,73,260,21.5',
            'rect,225.28,137.5,260,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 30, right: 110, bottom: 30, left: 110 }, topLeft: { x: 0, y: 0 },
            customizeCell: ({ pdfCell }) => {
                pdfCell.horizontalAlign = 'right';
            }, columnWidths: [150, 170, 120, 140] }
        ).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('4 pages, 4 cols with bands, grouping, and column widths. horizontalAlign=undefined', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                'CompanyName',
                'Phone',
                { caption: 'address 1111111111111111111111111', columns: [ 'Fax', 'City' ] },
                {
                    dataField: 'State',
                    groupIndex: 0,
                },
            ],
            summary: {
                groupItems: [
                    { column: 'City', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'City', summaryType: 'max' }
                ]
            },
            dataSource: [
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 12345678901011121314151617181920' },
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 1234567890101112' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Company Name,410.28,51.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Test company,410.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Test company,410.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,265.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,265.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,410.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,265.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,265.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,410.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,265.28,30,150,43',
            'rect,265.28,94.5,150,21.5',
            'rect,265.28,116,150,21.5',
            'rect,265.28,159,150,21.5',
            'rect,265.28,180.5,150,21.5',
            'rect,265.28,202,150,21.5',
            'rect,265.28,73,150,21.5',
            'rect,265.28,137.5,150,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,Phone,410.28,51.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456(678),410.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),410.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,245.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,245.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,560.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,245.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,245.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,560.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,245.28,30,170,43',
            'rect,245.28,94.5,170,21.5',
            'rect,245.28,116,170,21.5',
            'rect,245.28,159,170,21.5',
            'rect,245.28,180.5,170,21.5',
            'rect,245.28,202,170,21.5',
            'rect,245.28,73,170,21.5',
            'rect,245.28,137.5,170,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,Fax,410.28,62.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456,410.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456,410.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,295.28,30',
            'lineTo,415.28,30',
            'lineTo,415.28,51.5',
            'lineTo,295.28,51.5',
            'clip,',
            'discardPath,',
            'text,address 1111111111111111111111111,410.28,40.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,295.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,295.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,730.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,295.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,295.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,730.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,295.28,51.5,120,21.5',
            'rect,295.28,94.5,120,21.5',
            'rect,295.28,116,120,21.5',
            'rect,295.28,159,120,21.5',
            'rect,295.28,180.5,120,21.5',
            'rect,295.28,202,120,21.5',
            'rect,295.28,30,120,21.5',
            'rect,295.28,73,120,21.5',
            'rect,295.28,137.5,120,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,City,410.28,62.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Minneapolis,410.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,410.28,126.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,Minneapolis,410.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,410.28,191.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: Minneapolis,410.28,212.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'saveGraphicsState,',
            'moveTo,275.28,30',
            'lineTo,415.28,30',
            'lineTo,415.28,51.5',
            'lineTo,275.28,51.5',
            'clip,',
            'discardPath,',
            'text,address 1111111111111111111111111,530.28,40.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,275.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,275.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,850.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,275.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,275.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,850.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,275.28,51.5,140,21.5',
            'rect,275.28,94.5,140,21.5',
            'rect,275.28,116,140,21.5',
            'rect,275.28,159,140,21.5',
            'rect,275.28,180.5,140,21.5',
            'rect,275.28,202,140,21.5',
            'rect,275.28,30,140,21.5',
            'rect,275.28,73,140,21.5',
            'rect,275.28,137.5,140,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 30, right: 180, bottom: 30, left: 180 }, topLeft: { x: 0, y: 0 }, columnWidths: [150, 170, 120, 140] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('4 pages, 4 cols with bands, grouping, and column widths. horizontalAlign=undefined, horizontalAlign=left', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                'CompanyName',
                'Phone',
                { caption: 'address 1111111111111111111111111', columns: [ 'Fax', 'City' ] },
                {
                    dataField: 'State',
                    groupIndex: 0,
                },
            ],
            summary: {
                groupItems: [
                    { column: 'City', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'City', summaryType: 'max' }
                ]
            },
            dataSource: [
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 12345678901011121314151617181920' },
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 1234567890101112' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Company Name,270.28,51.5,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Test company,270.28,105.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Test company,270.28,169.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,265.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,265.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,-159.72,83.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,265.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,265.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,-159.72,148.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,265.28,30,150,43',
            'rect,265.28,94.5,150,21.5',
            'rect,265.28,116,150,21.5',
            'rect,265.28,159,150,21.5',
            'rect,265.28,180.5,150,21.5',
            'rect,265.28,202,150,21.5',
            'rect,265.28,73,150,21.5',
            'rect,265.28,137.5,150,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,Phone,250.28,51.5,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456(678),250.28,105.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),250.28,169.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,245.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,245.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,-9.72,83.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,245.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,245.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,-9.72,148.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,245.28,30,170,43',
            'rect,245.28,94.5,170,21.5',
            'rect,245.28,116,170,21.5',
            'rect,245.28,159,170,21.5',
            'rect,245.28,180.5,170,21.5',
            'rect,245.28,202,170,21.5',
            'rect,245.28,73,170,21.5',
            'rect,245.28,137.5,170,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,Fax,300.28,62.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456,300.28,105.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456,300.28,169.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,295.28,30',
            'lineTo,415.28,30',
            'lineTo,415.28,51.5',
            'lineTo,295.28,51.5',
            'clip,',
            'discardPath,',
            'text,address 1111111111111111111111111,160.28,40.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,295.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,295.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,160.28,83.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,295.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,295.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,160.28,148.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,295.28,51.5,120,21.5',
            'rect,295.28,94.5,120,21.5',
            'rect,295.28,116,120,21.5',
            'rect,295.28,159,120,21.5',
            'rect,295.28,180.5,120,21.5',
            'rect,295.28,202,120,21.5',
            'rect,295.28,30,120,21.5',
            'rect,295.28,73,120,21.5',
            'rect,295.28,137.5,120,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,City,280.28,62.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Minneapolis,280.28,105.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,280.28,126.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,Minneapolis,280.28,169.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,280.28,191.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: Minneapolis,280.28,212.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'saveGraphicsState,',
            'moveTo,275.28,30',
            'lineTo,415.28,30',
            'lineTo,415.28,51.5',
            'lineTo,275.28,51.5',
            'clip,',
            'discardPath,',
            'text,address 1111111111111111111111111,280.28,40.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,275.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,275.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,280.28,83.75,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,275.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,275.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,280.28,148.25,{baseline:middle,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,275.28,51.5,140,21.5',
            'rect,275.28,94.5,140,21.5',
            'rect,275.28,116,140,21.5',
            'rect,275.28,159,140,21.5',
            'rect,275.28,180.5,140,21.5',
            'rect,275.28,202,140,21.5',
            'rect,275.28,30,140,21.5',
            'rect,275.28,73,140,21.5',
            'rect,275.28,137.5,140,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 30, right: 180, bottom: 30, left: 180 }, topLeft: { x: 0, y: 0 },
            customizeCell: ({ pdfCell }) => {
                pdfCell.horizontalAlign = 'left';
            }, columnWidths: [150, 170, 120, 140] }
        ).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('4 pages, 4 cols with bands, grouping, and column widths. horizontalAlign=undefined, horizontalAlign=center', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                'CompanyName',
                'Phone',
                { caption: 'address 1111111111111111111111111', columns: [ 'Fax', 'City' ] },
                {
                    dataField: 'State',
                    groupIndex: 0,
                },
            ],
            summary: {
                groupItems: [
                    { column: 'City', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'City', summaryType: 'max' }
                ]
            },
            dataSource: [
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 12345678901011121314151617181920' },
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 1234567890101112' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Company Name,340.28,51.5,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Test company,340.28,105.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Test company,340.28,169.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,265.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,265.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,125.28,83.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,265.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,265.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,125.28,148.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,265.28,30,150,43',
            'rect,265.28,94.5,150,21.5',
            'rect,265.28,116,150,21.5',
            'rect,265.28,159,150,21.5',
            'rect,265.28,180.5,150,21.5',
            'rect,265.28,202,150,21.5',
            'rect,265.28,73,150,21.5',
            'rect,265.28,137.5,150,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,Phone,330.28,51.5,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456(678),330.28,105.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),330.28,169.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,245.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,245.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,275.28,83.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,245.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,245.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,275.28,148.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,245.28,30,170,43',
            'rect,245.28,94.5,170,21.5',
            'rect,245.28,116,170,21.5',
            'rect,245.28,159,170,21.5',
            'rect,245.28,180.5,170,21.5',
            'rect,245.28,202,170,21.5',
            'rect,245.28,73,170,21.5',
            'rect,245.28,137.5,170,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,Fax,355.28,62.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456,355.28,105.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456,355.28,169.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,295.28,30',
            'lineTo,415.28,30',
            'lineTo,415.28,51.5',
            'lineTo,295.28,51.5',
            'clip,',
            'discardPath,',
            'text,address 1111111111111111111111111,285.28,40.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,295.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,295.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,445.28,83.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,295.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,295.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,445.28,148.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,295.28,51.5,120,21.5',
            'rect,295.28,94.5,120,21.5',
            'rect,295.28,116,120,21.5',
            'rect,295.28,159,120,21.5',
            'rect,295.28,180.5,120,21.5',
            'rect,295.28,202,120,21.5',
            'rect,295.28,30,120,21.5',
            'rect,295.28,73,120,21.5',
            'rect,295.28,137.5,120,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,City,345.28,62.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Minneapolis,345.28,105.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,345.28,126.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,Minneapolis,345.28,169.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,345.28,191.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: Minneapolis,345.28,212.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'saveGraphicsState,',
            'moveTo,275.28,30',
            'lineTo,415.28,30',
            'lineTo,415.28,51.5',
            'lineTo,275.28,51.5',
            'clip,',
            'discardPath,',
            'text,address 1111111111111111111111111,415.28,40.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,275.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,275.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,575.28,83.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,275.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,275.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,575.28,148.25,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,275.28,51.5,140,21.5',
            'rect,275.28,94.5,140,21.5',
            'rect,275.28,116,140,21.5',
            'rect,275.28,159,140,21.5',
            'rect,275.28,180.5,140,21.5',
            'rect,275.28,202,140,21.5',
            'rect,275.28,30,140,21.5',
            'rect,275.28,73,140,21.5',
            'rect,275.28,137.5,140,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 30, right: 180, bottom: 30, left: 180 }, topLeft: { x: 0, y: 0 },
            customizeCell: ({ pdfCell }) => {
                pdfCell.horizontalAlign = 'center';
            }, columnWidths: [150, 170, 120, 140] }
        ).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('4 pages, 4 cols with bands, grouping, and column widths. horizontalAlign=undefined, horizontalAlign=right', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                'CompanyName',
                'Phone',
                { caption: 'address 1111111111111111111111111', columns: [ 'Fax', 'City' ] },
                {
                    dataField: 'State',
                    groupIndex: 0,
                },
            ],
            summary: {
                groupItems: [
                    { column: 'City', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'City', summaryType: 'max' }
                ]
            },
            dataSource: [
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 12345678901011121314151617181920' },
                { CompanyName: 'Test company', Phone: '123456(678)', Fax: '123456', City: 'Minneapolis', State: 'Washington 1234567890101112' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Company Name,410.28,51.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Test company,410.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Test company,410.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,265.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,265.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,410.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,265.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,265.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,410.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,265.28,30,150,43',
            'rect,265.28,94.5,150,21.5',
            'rect,265.28,116,150,21.5',
            'rect,265.28,159,150,21.5',
            'rect,265.28,180.5,150,21.5',
            'rect,265.28,202,150,21.5',
            'rect,265.28,73,150,21.5',
            'rect,265.28,137.5,150,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,Phone,410.28,51.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456(678),410.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456(678),410.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,245.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,245.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,560.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,245.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,245.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,560.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,245.28,30,170,43',
            'rect,245.28,94.5,170,21.5',
            'rect,245.28,116,170,21.5',
            'rect,245.28,159,170,21.5',
            'rect,245.28,180.5,170,21.5',
            'rect,245.28,202,170,21.5',
            'rect,245.28,73,170,21.5',
            'rect,245.28,137.5,170,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,Fax,410.28,62.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,123456,410.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,123456,410.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#979797',
            'saveGraphicsState,',
            'moveTo,295.28,30',
            'lineTo,415.28,30',
            'lineTo,415.28,51.5',
            'lineTo,295.28,51.5',
            'clip,',
            'discardPath,',
            'text,address 1111111111111111111111111,410.28,40.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,295.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,295.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,730.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,295.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,295.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,730.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,295.28,51.5,120,21.5',
            'rect,295.28,94.5,120,21.5',
            'rect,295.28,116,120,21.5',
            'rect,295.28,159,120,21.5',
            'rect,295.28,180.5,120,21.5',
            'rect,295.28,202,120,21.5',
            'rect,295.28,30,120,21.5',
            'rect,295.28,73,120,21.5',
            'rect,295.28,137.5,120,21.5',
            'addPage,',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'text,City,410.28,62.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'text,Minneapolis,410.28,105.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,410.28,126.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,Minneapolis,410.28,169.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: Minneapolis,410.28,191.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: Minneapolis,410.28,212.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#979797',
            'setFont,helvetica,normal,',
            'saveGraphicsState,',
            'moveTo,275.28,30',
            'lineTo,415.28,30',
            'lineTo,415.28,51.5',
            'lineTo,275.28,51.5',
            'clip,',
            'discardPath,',
            'text,address 1111111111111111111111111,530.28,40.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'saveGraphicsState,',
            'moveTo,275.28,73',
            'lineTo,415.28,73',
            'lineTo,415.28,94.5',
            'lineTo,275.28,94.5',
            'clip,',
            'discardPath,',
            'text,State: Washington 1234567890101112,850.28,83.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'saveGraphicsState,',
            'moveTo,275.28,137.5',
            'lineTo,415.28,137.5',
            'lineTo,415.28,159',
            'lineTo,275.28,159',
            'clip,',
            'discardPath,',
            'text,State: Washington 12345678901011121314151617181920,850.28,148.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'restoreGraphicsState,',
            'rect,275.28,51.5,140,21.5',
            'rect,275.28,94.5,140,21.5',
            'rect,275.28,116,140,21.5',
            'rect,275.28,159,140,21.5',
            'rect,275.28,180.5,140,21.5',
            'rect,275.28,202,140,21.5',
            'rect,275.28,30,140,21.5',
            'rect,275.28,73,140,21.5',
            'rect,275.28,137.5,140,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 30, right: 180, bottom: 30, left: 180 }, topLeft: { x: 0, y: 0 },
            customizeCell: ({ pdfCell }) => {
                pdfCell.horizontalAlign = 'right';
            }, columnWidths: [150, 170, 120, 140] }
        ).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });

        QUnit.test('7 pages, 3 rows, pdfCell.wordWrapEnabled = true', function(assert) {
            const companies = [
                {
                    ID: 1,
                    Name: 'Super Mart of the West',
                    Address: '702 SW 8th Street',
                    City: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Fusce id velit ut tortor pretium viverra. Maecenas accumsan lacus vel facilisis volutpat est velit egestas. Amet venenatis urna cursus eget nunc scelerisque viverra mauris in. Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor. At elementum eu facilisis sed odio morbi quis. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Facilisi morbi tempus iaculis urna id volutpat lacus. Diam quam nulla porttitor massa id neque. Pellentesque dignissim enim sit amet venenatis urna. Cursus risus at ultrices mi tempus imperdiet nulla. Elit scelerisque mauris pellentesque pulvinar pellentesque. Dictum fusce ut placerat orci. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget nullam. Nec feugiat in fermentum posuere urna nec tincidunt praesent semper. Felis eget nunc lobortis mattis aliquam. Dolor sed viverra ipsum nunc aliquet bibendum enim facilisis. Eu ultrices vitae auctor eu augue ut lectus arcu bibendum. Sed libero enim sed faucibus turpis in eu mi. Velit egestas dui id ornare arcu odio ut sem. Quam pellentesque nec nam aliquam sem et tortor. Augue ut lectus arcu bibendum at varius vel. Aliquet nibh praesent tristique magna sit. Amet porttitor eget dolor morbi non arcu risus quis varius. Ullamcorper sit amet risus nullam eget.'
                },
                {
                    ID: 2,
                    Name: 'Electronics Depot',
                    Address: '2455 Paces Ferry Road NW',
                    City: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Fusce id velit ut tortor pretium viverra. Maecenas accumsan lacus vel facilisis volutpat est velit egestas. Amet venenatis urna cursus eget nunc scelerisque viverra mauris in. Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor. At elementum eu facilisis sed odio morbi quis. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Facilisi morbi tempus iaculis urna id volutpat lacus. Diam quam nulla porttitor massa id neque. Pellentesque dignissim enim sit amet venenatis urna. Cursus risus at ultrices mi tempus imperdiet nulla.',
                },
                {
                    ID: 3,
                    Name: 'K&S Music',
                    Address: '1000 Nicllet Mall',
                    City: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Fusce id velit ut tortor pretium viverra. Maecenas accumsan lacus vel facilisis volutpat est velit egestas. Amet venenatis urna cursus eget nunc scelerisque viverra mauris in. Lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor. At elementum eu facilisis sed odio morbi quis. Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Facilisi morbi tempus iaculis urna id volutpat lacus. Diam quam nulla porttitor massa id neque. Pellentesque dignissim enim sit amet venenatis urna. Cursus risus at ultrices mi tempus imperdiet nulla.',
                }
            ];
            const done = assert.async();
            const doc = createMockPdfDoc();
            const spy = sinon.spy();
            doc.addPage = spy;
            const dataGrid = createDataGrid({
                dataSource: companies,
                keyExpr: 'ID',
                showBorders: true,
                export: {
                    enabled: true,
                    formats: ['pdf']
                },
                onExporting(e) {
                    DevExpress.pdfExporter
                        .exportDataGrid({
                            jsPDFDocument: doc,
                            component: e.component,
                            customizeCell({
                                gridCell,
                                pdfCell
                            }) {
                                if(gridCell.rowType === 'data' && gridCell.column.dataField === 'City') {
                                    pdfCell.wordWrapEnabled = true;
                                }
                            }
                        })
                        .then(() => {
                            doc.save('Companies.pdf');
                        });
                },
                columns: [{
                    dataField: 'Name',
                    width: 200
                },
                {
                    dataField: 'Address',
                    width: 200
                }, {
                    dataField: 'City',
                    width: 50
                },
                ],
            });

            exportDataGrid({ jsPDFDocument: doc,
                component: dataGrid,
                customizeCell({
                    gridCell,
                    pdfCell
                }) {
                    if(gridCell.rowType === 'data' && gridCell.column.dataField === 'City') {
                        pdfCell.wordWrapEnabled = true;
                    }
                } }
            ).then(() => {
                assert.equal(spy.callCount, 6);
                done();
            });
        });
    });
});
