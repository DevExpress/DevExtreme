import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Vertical align', moduleConfig, () => {
    QUnit.test('1 col - 1 lines. Font size default, line height default, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size default, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,80,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size default, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,100,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 10px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 10, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,80,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 10, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,100,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 20px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,F1,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 20, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,F1,55,80,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 20, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,F1,55,100,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size default, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size default, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,78.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size default, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,98.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 10px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 10, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,78.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 10, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,98.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 20px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,F1,55,57,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 20, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,F1,55,77,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 20, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,F1,55,97,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size default, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size default, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,83.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size default, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,103.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 10px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 10, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,83.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 10, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,103.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 20px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,F1,55,67,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 20, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,F1,55,87,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 lines. Font size 20, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,F1,55,107,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    /// -------------------------------------------------------------------------------

    QUnit.test('1 col - 2 lines. Font size default, line height default, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,80,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,100,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,80,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,100,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2,55,80,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2,55,100,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,78.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,98.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,78.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,98.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2,55,57,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2,55,77,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2,55,97,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,83.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,103.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,83.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2,55,103.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2,55,67,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2,55,87,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2,55,107,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height default, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,80,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,100,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,80,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,100,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2 f3,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2 f3,55,80,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2 f3,55,100,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,78.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,98.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,78.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,98.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2 f3,55,57,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2 f3,55,77,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2 f3,55,97,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,83.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,103.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,83.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1 f2 f3,55,103.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2 f3,55,67,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2 f3,55,87,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1 f2 f3,55,107,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    /** *****************************/

    QUnit.test('1 col - 2 lines. Font size default, line height default, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height default, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,74.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height default, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,88.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10px, line height default, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height default, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,74.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height default, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,88.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20px, line height default, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height default, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2,55,68.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height default, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2,55,77,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,73.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,88.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10px, line height 1, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height 1, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,73.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height 1, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,88.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20px, line height 1, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2,55,57,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height 1, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2,55,67,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height 1, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2,55,77,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1.5, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1.5, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,76,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size default, line height 1.5, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,88.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10px, line height 1.5, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height 1.5, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,76,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 10, line height 1.5, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2,55,88.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20px, line height 1.5, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2,55,67,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height 1.5, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2,55,72,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 lines. Font size 20, line height 1.5, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2,55,77,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height default, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height default, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,68.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height default, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,77,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10px, line height default, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height default, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,68.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height default, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,77,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20px, line height default, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,60,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height default, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,57,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height default, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,54,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,68.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,78.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10px, line height 1, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,58.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height 1, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,68.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height 1, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,78.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20px, line height 1, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,57,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height 1, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,57,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height 1, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,57,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1.5, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1.5, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,68.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size default, line height 1.5, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,73.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10px, line height 1.5, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,63.5,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height 1.5, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,68.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 10, line height 1.5, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,73.5,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20px, line height 1.5, vertical align: top. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'top';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,67,{baseline:top}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height 1.5, vertical align: middle. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'middle';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,57,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 lines. Font size 20, line height 1.5, vertical align: bottom. Cell height = 50px , wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
            dataSource: [],
        });

        doc.setLineHeightFactor(1.5);
        const onRowExporting = (e) => { e.rowHeight = 50; };
        const customizeCell = ({ pdfCell }) => {
            pdfCell.verticalAlign = 'bottom';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setLineHeightFactor,1.5',
            'setTextColor,#979797',
            'setFontSize,20',
            'text,f1\n' +
                    'f2\n' +
                    'f3,55,47,{baseline:bottom}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,50',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
