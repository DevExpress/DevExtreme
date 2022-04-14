import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Multiline text', moduleConfig, () => {
    QUnit.test('1 col - 1 text line. fontSize default', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1,55,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize default, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize 20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize 20, height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 20 };
            pdfCell.padding = 5;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize default', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1 line2,55,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize default, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1 line2,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 line2,55,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize 20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 line2,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize 20, height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 line2,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 20 };
            pdfCell.padding = 5;
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize default', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1 line2 line3,55,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,80',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 80; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize default, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1 line2 line3,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 lin...,55,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,80',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 80; };
        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize 20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 lin...,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize 20, height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 lin...,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 20 };
            pdfCell.padding = 5;
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1,55,85,{baseline:middle}',
            'setFontSize,20',
            'text,line1,155,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'rect,150,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1,55,71.5,{baseline:middle}',
            'setFontSize,20',
            'text,line1,155,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'rect,150,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,85,{baseline:middle}',
            'setFontSize,30',
            'text,line1,155,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'rect,150,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,line1,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'rect,150,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto, padding 5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,line1,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'rect,150,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
            pdfCell.padding = 5;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1 line2,55,85,{baseline:middle}',
            'setFontSize,20',
            'text,line1 line2,155,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'rect,150,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1 line2,55,71.5,{baseline:middle}',
            'setFontSize,20',
            'text,line1 line2,155,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'rect,150,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 line2,55,85,{baseline:middle}',
            'setFontSize,30',
            'text,line1...,155,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'rect,150,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 line2,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,line1...,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'rect,150,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto, padding 5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 line2,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,line1...,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'rect,150,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
            pdfCell.padding = 5;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1 line2 line3,55,95,{baseline:middle}',
            'setFontSize,20',
            'text,line1 lin...,155,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,80',
            'rect,150,55,100,80',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 80; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1 line2 line3,55,71.5,{baseline:middle}',
            'setFontSize,20',
            'text,line1 lin...,155,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'rect,150,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 lin...,55,100,{baseline:middle}',
            'setFontSize,30',
            'text,line1...,155,100,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,90',
            'rect,150,55,100,90',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 90; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 lin...,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,line1...,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'rect,150,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto, padding 5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1 lin...,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,line1...,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'rect,150,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
            pdfCell.padding = 5;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize default, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1,55,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize default, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize 20, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize 20, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize 20, height auto, padding, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 20 };
            pdfCell.padding = 5;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize default, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
                    'line2,55,79.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize default, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
                    'line2,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize 20, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2,55,73.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize 20, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,56',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize 20, height auto, padding, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,56',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 20 };
            pdfCell.padding = 5;
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize default, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,83.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,80',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 80; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize default, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize 20, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,72,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,80',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 80; };
        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize 20, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize 20, height auto, padding, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [{ caption: 'line1\nline2\nline3' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 20 };
            pdfCell.padding = 5;
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1,55,85,{baseline:middle}',
            'setFontSize,20',
            'text,line1,155,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'rect,150,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1,55,71.5,{baseline:middle}',
            'setFontSize,20',
            'text,line1,155,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'rect,150,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,85,{baseline:middle}',
            'setFontSize,30',
            'text,line1,155,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'rect,150,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,line1,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'rect,150,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto, padding 5, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1' },
                { caption: 'line1' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,line1,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'rect,150,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
            pdfCell.padding = 5;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
                    'line2,55,79.25,{baseline:middle}',
            'setFontSize,20',
            'text,line1\n' +
                    'line2,155,73.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'rect,150,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
                    'line2,55,77.25,{baseline:middle}',
            'setFontSize,20',
            'text,line1\n' +
                    'line2,155,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,56',
            'rect,150,55,100,56',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2,55,73.5,{baseline:middle}',
            'setFontSize,30',
            'text,line1\n' +
                    'line2,155,67.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,60',
            'rect,150,55,100,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2,55,83,{baseline:middle}',
            'setFontSize,30',
            'text,line1\n' +
                    'line2,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,79',
            'rect,150,55,100,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto, padding 5, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2' },
                { caption: 'line1\nline2' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2,55,83,{baseline:middle}',
            'setFontSize,30',
            'text,line1\n' +
                    'line2,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,79',
            'rect,150,55,100,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
            pdfCell.padding = 5;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,83.5,{baseline:middle}',
            'setFontSize,20',
            'text,line1\n' +
                    'line2\n' +
                    'line3,155,72,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,80',
            'rect,150,55,100,80',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 80; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,83,{baseline:middle}',
            'setFontSize,20',
            'text,line1\n' +
                    'line2\n' +
                    'line3,155,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,79',
            'rect,150,55,100,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.column.index === 1) {
                pdfCell.font = { size: 20 };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,77,{baseline:middle}',
            'setFontSize,30',
            'text,line1\n' +
                    'line2\n' +
                    'line3,155,65.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,90',
            'rect,150,55,100,90',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 90; };
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,88.75,{baseline:middle}',
            'setFontSize,30',
            'text,line1\n' +
                    'line2\n' +
                    'line3,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,113.5',
            'rect,150,55,100,113.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto, padding 5, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,

            columns: [
                { caption: 'line1\nline2\nline3' },
                { caption: 'line1\nline2\nline3' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line1\n' +
                    'line2\n' +
                    'line3,55,88.75,{baseline:middle}',
            'setFontSize,30',
            'text,line1\n' +
                    'line2\n' +
                    'line3,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,113.5',
            'rect,150,55,100,113.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
            pdfCell.padding = 5;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

});
