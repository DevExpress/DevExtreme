import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Horizontal align', moduleConfig, () => {
    QUnit.test('1 col - 1 row. Font size default, horizontal align: undefined. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,55,65.75,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,55,65.75,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,150,65.75,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,245,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: undefined, rtlEnabled, Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: left, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,350.28,65.75,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: center, rtlEnabled, Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,445.28,65.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size default, horizontal align: right, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,55,65.75,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,150,65.75,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,245,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: undefined, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: left, rtlEnabled: true, Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,350.28,65.75,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: center, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,445.28,65.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 10, horizontal align: right, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1,55,71.5,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1,150,71.5,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1,245,71.5,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: undefined, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1,540.28,71.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: left, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1,350.28,71.5,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: center, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1,445.28,71.5,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. Font size 20, horizontal align: right, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1,540.28,71.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,55,65.75,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,150,65.75,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,245,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: undefined, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: left, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,350.28,65.75,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: center, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,445.28,65.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size default, horizontal align: right, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,55,65.75,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,150,65.75,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,245,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: undefined, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: left, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,350.28,65.75,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: center, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,445.28,65.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 10, horizontal align: right, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2,55,71.5,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2,150,71.5,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2,245,71.5,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: undefined, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2,540.28,71.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: left, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2,350.28,71.5,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: center, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2,445.28,71.5,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 row. Font size 20, horizontal align: right, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2,540.28,71.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,55,65.75,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,150,65.75,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,245,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,55,65.75,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,150,65.75,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,245,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: undefined, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: left, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,350.28,65.75,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: center, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,445.28,65.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: right, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: left. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2 ve...,55,71.5,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: center. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2 ve...,150,71.5,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: right. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1 long line 2 ve...,245,71.5,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: undefined, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: left, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,350.28,65.75,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: center, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,445.28,65.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: right, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1 long line 2 very long line 3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: left. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
                    'long line 2\n' +
                    'very long line 3,55,65.75,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: center. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
                    'long line 2\n' +
                    'very long line 3,150,65.75,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: right. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
                    'long line 2\n' +
                    'very long line 3,245,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: left. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
                    'long line 2\n' +
                    'very long line 3,55,65.75,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: center. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
                    'long line 2\n' +
                    'very long line 3,150,65.75,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: right. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
                    'long line 2\n' +
                    'very long line 3,245,65.75,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: undefined, rtlEnabled. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: left, rtlEnabled. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,350.28,65.75,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: center, rtlEnabled. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,445.28,65.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size default, horizontal align: right, rtlEnabled. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: left. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1\n' +
                    'long line 2\n' +
                    'very long line 3,55,71.5,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: center. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1\n' +
                    'long line 2\n' +
                    'very long line 3,150,71.5,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: right. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1\n' +
                    'long line 2\n' +
                    'very long line 3,245,71.5,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: undefined, rtlEnabled. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: left, rtlEnabled. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,350.28,65.75,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: center, rtlEnabled. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,445.28,65.75,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 10, horizontal align: right, rtlEnabled. Cell width = 200px, wordWrap is enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 10 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

});

QUnit.module('Pass horizontal alignment settings from dxDataGrid', moduleConfig, () => {

    QUnit.test('1 col - 3 row. col.dataType: number, col.alignment: undefined, pdfCell.alignment: undefined, cellWidth = 200px', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', dataType: 'number', caption: 'F1' } ],
            dataSource: [{ f1: 1 }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,245,65.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,1,245,87.25,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. col.dataType: number, col.alignment: center, pdfCell.alignment: undefined, cellWidth = 200px', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', dataType: 'number', alignment: 'center', caption: 'F1' } ],
            dataSource: [{ f1: 1 }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,150,65.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,1,150,87.25,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. col.dataType: number, col.alignment: center, pdfCell.alignment: left, Cell width = 200px', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', dataType: 'number', alignment: 'center', caption: 'F1' } ],
            dataSource: [{ f1: 1 }],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle,align:left}',
            'setTextColor,#000000',
            'text,1,55,87.25,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. col.dataType: string, col.alignment: undefined, pdfCell.alignment: undefined, cellWidth = 200px', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', dataType: 'string', caption: 'F1' } ],
            dataSource: [{ f1: 'f1_1' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle,align:left}',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,{baseline:middle,align:left}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. col.dataType: string, col.alignment: center, pdfCell.alignment: undefined, cellWidth = 200px', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', dataType: 'string', alignment: 'center', caption: 'F1' } ],
            dataSource: [{ f1: 'f1_1' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,150,65.75,{baseline:middle,align:center}',
            'setTextColor,#000000',
            'text,f1_1,150,87.25,{baseline:middle,align:center}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. col.dataType: string, col.alignment: center, pdfCell.alignment: right, cellWidth = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            columns: [ { dataField: 'f1', dataType: 'string', alignment: 'center', caption: 'F1' } ],
            dataSource: [{ f1: 'f1_1' }],
        });

        const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,245,65.75,{baseline:middle,align:right}',
            'setTextColor,#000000',
            'text,f1_1,245,87.25,{baseline:middle,align:right}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'rect,50,76.5,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: undefined, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,540.28,71.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: left, rtlEnabled, Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'left';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,350.28,71.5,{baseline:middle,align:left,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: center, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'center';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,445.28,71.5,{baseline:middle,align:center,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 row. Font size 20, horizontal align: right, rtlEnabled. Cell width = 200px ', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            rtlEnabled: true,
            columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
            dataSource: [],
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.horizontalAlign = 'right';
            pdfCell.font = { size: 20 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line 1\n' +
'long line 2\n' +
'very long line 3,540.28,71.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,345.28,55,200,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0, alignment: \'left\'}, f2, f3]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0, alignment: 'left' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
                { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_2,55,108.75,{baseline:middle}',
            'text,f1_3,145,108.75,{baseline:middle}',
            'text,f2_2,55,130.25,{baseline:middle}',
            'text,f2_3,145,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,90,21.5',
            'rect,140,98,80,21.5',
            'rect,50,119.5,90,21.5',
            'rect,140,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0, alignment: \'left\'}, f2, f3], rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0, alignment: 'left' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
                { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F3,450.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f1_2,540.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f1_3,450.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f2_2,540.28,130.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f2_3,450.28,130.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,455.28,55,90,21.5',
            'rect,375.28,55,80,21.5',
            'rect,375.28,76.5,170,21.5',
            'rect,455.28,98,90,21.5',
            'rect,375.28,98,80,21.5',
            'rect,455.28,119.5,90,21.5',
            'rect,375.28,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0, alignment: \'center\'}, f2, f3]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0, alignment: 'center' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
                { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_2,55,108.75,{baseline:middle}',
            'text,f1_3,145,108.75,{baseline:middle}',
            'text,f2_2,55,130.25,{baseline:middle}',
            'text,f2_3,145,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,90,21.5',
            'rect,140,98,80,21.5',
            'rect,50,119.5,90,21.5',
            'rect,140,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0, alignment: \'center\'}, f2, f3], rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0, alignment: 'center' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
                { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F3,450.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f1_2,540.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f1_3,450.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f2_2,540.28,130.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f2_3,450.28,130.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,455.28,55,90,21.5',
            'rect,375.28,55,80,21.5',
            'rect,375.28,76.5,170,21.5',
            'rect,455.28,98,90,21.5',
            'rect,375.28,98,80,21.5',
            'rect,455.28,119.5,90,21.5',
            'rect,375.28,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0, alignment: \'right\'}, f2, f3]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0, alignment: 'right' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
                { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_2,55,108.75,{baseline:middle}',
            'text,f1_3,145,108.75,{baseline:middle}',
            'text,f2_2,55,130.25,{baseline:middle}',
            'text,f2_3,145,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,90,21.5',
            'rect,140,98,80,21.5',
            'rect,50,119.5,90,21.5',
            'rect,140,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0, alignment: \'right\'}, f2, f3], rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0, alignment: 'right' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
                { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F3,450.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f1_2,540.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f1_3,450.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f2_2,540.28,130.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f2_3,450.28,130.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,455.28,55,90,21.5',
            'rect,375.28,55,80,21.5',
            'rect,375.28,76.5,170,21.5',
            'rect,455.28,98,90,21.5',
            'rect,375.28,98,80,21.5',
            'rect,455.28,119.5,90,21.5',
            'rect,375.28,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

});
