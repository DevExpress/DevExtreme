import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Page margins', moduleConfig, () => {
    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,550.28,50.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,761.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,590.28,10.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=0,y=0}, pageOrientation=portrait, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,590.28,10.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,841.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=0,y=0}, pageOrientation=landscape, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,836.89,10.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,841.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=10, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=10, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=10, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,40,505.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,40,505.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,40,751.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=10, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,565.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=10, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,565.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=10, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,811.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,565.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,565.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,811.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    /**/
    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,590.28,20.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=0,y=0}, pageOrientation=portrait, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,590.28,20.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=0,y=0}, pageOrientation=landscape, rtlRnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,836.89,20.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,580.28,20.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=10,y=0}, pageOrientation=portrait, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,580.28,20.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=10,y=0}, pageOrientation=landscape, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,826.89,20.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    /***/

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,50,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,50,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=undefined, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,50,761.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=0, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,841.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=10, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=10, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin=10, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={top:10,left:10}, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });


    QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=0}pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=0}pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,761.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,841.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,10,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,40,505.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,40,505.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,50.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,40,751.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,565.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,565.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,811.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,565.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,565.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,811.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,25,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,20,10,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=10,y=0}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=10,y=0}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=10,y=0}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,10.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,0,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,570.28,10.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=10,y=0}, pageOrientation=portrait, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,570.28,10.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=900, Margin={right:10,bottom:10}, topLeft={x=10,y=0}, pageOrientation=landscape, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            width: 900,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,816.89,10.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,0,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,50,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,50,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,45,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,50,761.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,595.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,841.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000',
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,575.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,821.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,15,30.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,20,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=10}', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=10}, pageOrientation=portrait', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'p' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,585.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=10}, pageOrientation=landscape', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc({ orientation: 'l' });

        const dataGrid = createDataGrid({
            width: 100,
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,5,20.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,0,10,831.89,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
