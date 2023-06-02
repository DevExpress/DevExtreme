import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Wordwrap', moduleConfig, () => {
    QUnit.test('1 col - 1 text line. fontSize default', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line,55,85,{baseline:middle}',
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

    QUnit.test('1 col - 1 text line. fontSize default, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line,55,85,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [{ caption: 'very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line,55,65.75,{baseline:middle}',
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

    QUnit.test('1 col - 1 text line. fontSize default, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line,55,65.75,{baseline:middle}',
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

    QUnit.test('1 col - 1 text line. fontSize default, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long line' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. fontSize 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,85,{baseline:middle}',
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

    QUnit.test('1 col - 1 text line. fontSize 20, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,85,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [{ caption: 'long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,71.5,{baseline:middle}',
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

    QUnit.test('1 col - 1 text line. fontSize 20, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,71.5,{baseline:middle}',
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

    QUnit.test('1 col - 1 text line. fontSize 20, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,71.5,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [{ caption: 'very long text very long text' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very...,55,85,{baseline:middle}',
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

    QUnit.test('1 col - 2 text lines. fontSize default, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long text very long text' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very\n' +
'long text,55,79.25,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [{ caption: 'very long text very long text' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very...,55,65.75,{baseline:middle}',
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

    QUnit.test('1 col - 2 text lines. fontSize default, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long text very long text' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very\n' +
'long text,55,65.75,{baseline:middle}',
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

    QUnit.test('1 col - 2 text lines. fontSize default, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long text very long text' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very\n' +
'long text,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long lin...,55,85,{baseline:middle}',
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

    QUnit.test('1 col - 2 text lines. fontSize 20, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line,55,73.5,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [{ caption: 'long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long lin...,55,71.5,{baseline:middle}',
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

    QUnit.test('1 col - 2 text lines. fontSize 20, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line,55,71.5,{baseline:middle}',
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

    QUnit.test('1 col - 2 text lines. fontSize 20, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line,55,71.5,{baseline:middle}',
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

    QUnit.test('1 col - 3 text lines. fontSize default', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'very long line very long line very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very...,55,95,{baseline:middle}',
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
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize default, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long line very long line very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line very long\n' +
'line,55,83.5,{baseline:middle}',
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
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize default, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'very long line very long line very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very...,55,65.75,{baseline:middle}',
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

    QUnit.test('1 col - 3 text lines. fontSize default, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long line very long line very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line very long\n' +
'line,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
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

    QUnit.test('1 col - 3 text lines. fontSize default, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long line very long line very long line' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line very long\n' +
'line,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines with line breaks. fontSize default, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'very long line\nvery long line very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very...,55,65.75,{baseline:middle}',
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

    QUnit.test('1 col - 3 text lines with line breaks. fontSize default, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long line\nvery long line very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line\n' +
'very long line very\n' +
'long line,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
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

    QUnit.test('1 col - 3 text lines with line breaks. fontSize default, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long line\nvery long line very long line' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line\n' +
'very long line very\n' +
'long line,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'long line long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long lin...,55,95,{baseline:middle}',
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
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize 20, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,72,{baseline:middle}',
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
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize 20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'long line long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long lin...,55,71.5,{baseline:middle}',
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

    QUnit.test('1 col - 3 text lines. fontSize 20, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,71.5,{baseline:middle}',
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

    QUnit.test('1 col - 3 text lines. fontSize 20, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,71.5,{baseline:middle}',
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

    QUnit.test('1 col - 3 text lines. onRowExporting.setfontSize=20, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowCells[0].font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. onRowExporting.setfontSize=20, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'long line long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,79',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowCells[0].font = { size: 20 }; };
        const customizeCell = ({ pdfCell }) => { pdfCell.padding = 5; };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [
                { caption: 'vert long line' },
                { caption: 'long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,vert long line,55,85,{baseline:middle}',
            'setFontSize,20',
            'text,long line,155,85,{baseline:middle}',
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

    QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'vert long line' },
                { caption: 'long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,vert long line,55,85,{baseline:middle}',
            'setFontSize,20',
            'text,long line,155,85,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'vert long line' },
                { caption: 'long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,vert long line,55,71.5,{baseline:middle}',
            'setFontSize,20',
            'text,long line,155,71.5,{baseline:middle}',
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

    QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'vert long line' },
                { caption: 'long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,vert long line,55,71.5,{baseline:middle}',
            'setFontSize,20',
            'text,long line,155,71.5,{baseline:middle}',
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

    QUnit.test('2 col - 1 text line. col1.fontSize default, col2.fontSize 20, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'vert long line' },
                { caption: 'long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,vert long line,55,71.5,{baseline:middle}',
            'setFontSize,20',
            'text,long line,155,71.5,{baseline:middle}',
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
                pdfCell.padding = 5;
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'long line' },
                { caption: 'big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,85,{baseline:middle}',
            'setFontSize,30',
            'text,big li...,155,85,{baseline:middle}',
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

    QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'long line' },
                { caption: 'big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,85,{baseline:middle}',
            'setFontSize,30',
            'text,big\n' +
                    'line,155,67.75,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'long line' },
                { caption: 'big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,big li...,155,77.25,{baseline:middle}',
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

    QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'long line' },
                { caption: 'big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,94.5,{baseline:middle}',
            'setFontSize,30',
            'text,big\n' +
'line,155,77.25,{baseline:middle}',
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

    QUnit.test('2 col - 1 text line. col1.fontSize 20, col2.fontSize 30, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'long line' },
                { caption: 'big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line,55,94.5,{baseline:middle}',
            'setFontSize,30',
            'text,big\n' +
'line,155,77.25,{baseline:middle}',
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

    QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [
                { caption: 'very long line very long line' },
                { caption: 'long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very...,55,85,{baseline:middle}',
            'setFontSize,20',
            'text,long lin...,155,85,{baseline:middle}',
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

    QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'very long line very long line' },
                { caption: 'long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line,55,79.25,{baseline:middle}',
            'setFontSize,20',
            'text,long line\n' +
'long line,155,73.5,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'very long line very long line' },
                { caption: 'long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very...,55,71.5,{baseline:middle}',
            'setFontSize,20',
            'text,long lin...,155,71.5,{baseline:middle}',
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

    QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'very long line very long line' },
                { caption: 'long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line,55,77.25,{baseline:middle}',
            'setFontSize,20',
            'text,long line\n' +
'long line,155,71.5,{baseline:middle}',
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

    QUnit.test('2 col - 2 text lines. col1.fontSize default, col2.fontSize: 20, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'very long line very long line' },
                { caption: 'long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line,55,77.25,{baseline:middle}',
            'setFontSize,20',
            'text,long line\n' +
'long line,155,71.5,{baseline:middle}',
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
            pdfCell.padding = 5;
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'long line long line' },
                { caption: 'big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long lin...,55,85,{baseline:middle}',
            'setFontSize,30',
            'text,big li...,155,85,{baseline:middle}',
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

    QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'long line long line' },
                { caption: 'big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line,55,73.5,{baseline:middle}',
            'setFontSize,30',
            'text,big\n' +
'line\n' +
'big\n' +
'line,155,33.25,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'long line long line' },
                { caption: 'big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long lin...,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,big li...,155,77.25,{baseline:middle}',
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

    QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'long line long line' },
                { caption: 'big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line,55,117.5,{baseline:middle}',
            'setFontSize,30',
            'text,big\n' +
'line\n' +
'big\n' +
'line,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,148',
            'rect,150,55,100,148',
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

    QUnit.test('2 col - 2 text lines. col1.fontSize 20 col2.fontSize: 30, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'long line long line' },
                { caption: 'big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line,55,117.5,{baseline:middle}',
            'setFontSize,30',
            'text,big\n' +
'line\n' +
'big\n' +
'line,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,148',
            'rect,150,55,100,148',
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'very long line very long line very long line' },
                { caption: 'long line long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very...,55,95,{baseline:middle}',
            'setFontSize,20',
            'text,long lin...,155,95,{baseline:middle}',
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

    QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'very long line very long line very long line' },
                { caption: 'long line long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line very long\n' +
'line,55,83.5,{baseline:middle}',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,155,72,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'very long line very long line very long line' },
                { caption: 'long line long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very...,55,71.5,{baseline:middle}',
            'setFontSize,20',
            'text,long lin...,155,71.5,{baseline:middle}',
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

    QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'very long line very long line very long line' },
                { caption: 'long line long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line very long\n' +
'line,55,83,{baseline:middle}',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,155,71.5,{baseline:middle}',
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

    QUnit.test('2 col - 3 text lines. col1.fontSize default, col2.fontSize: 20, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'very long line very long line very long line' },
                { caption: 'long line long line long line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line very long\n' +
'line,55,83,{baseline:middle}',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,155,71.5,{baseline:middle}',
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
            pdfCell.padding = 5;
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'long line long line long line' },
                { caption: 'big line big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long lin...,55,100,{baseline:middle}',
            'setFontSize,30',
            'text,big li...,155,100,{baseline:middle}',
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

    QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'long line long line long line' },
                { caption: 'big line big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,77,{baseline:middle}',
            'setFontSize,30',
            'text,big\n' +
'line\n' +
'big\n' +
'line\n' +
'big\n' +
'line,155,13.75,{baseline:middle}',
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
            wordWrapEnabled: false,
            columns: [
                { caption: 'long line long line long line' },
                { caption: 'big line big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long lin...,55,77.25,{baseline:middle}',
            'setFontSize,30',
            'text,big li...,155,77.25,{baseline:middle}',
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

    QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'long line long line long line' },
                { caption: 'big line big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,140.5,{baseline:middle}',
            'setFontSize,30',
            'text,big\n' +
'line\n' +
'big\n' +
'line\n' +
'big\n' +
'line,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,217',
            'rect,150,55,100,217',
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

    QUnit.test('2 col - 3 text lines. col1.fontSize 20, col2.fontSize: 30, height auto, padding, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'long line long line long line' },
                { caption: 'big line big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,140.5,{baseline:middle}',
            'setFontSize,30',
            'text,big\n' +
'line\n' +
'big\n' +
'line\n' +
'big\n' +
'line,155,77.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,217',
            'rect,150,55,100,217',
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

    QUnit.test('1 col - 2 text lines. fontSize default, width equals for 1 line', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long text very long text' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very long text,55,85,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,60',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const onRowExporting = (e) => { e.rowHeight = 60; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 text lines. fontSize default, width equals for 1 line, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long text very long text' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very long text,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,200,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 col - 3 text lines. col1.fontSize 20.wordWrap enabled, col2.fontSize: 30, height auto, wordWrap disabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'long line long line long line' },
                { caption: 'big line big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,71.5,{baseline:middle}',
            'setFontSize,30',
            'text,big li...,155,94.5,{baseline:middle}',
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
            pdfCell.wordWrapEnabled = gridCell.column.index === 0;
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

    QUnit.test('2 col - 3 text lines. col1.fontSize 20.wordWrap enabled col1.padding, col2.fontSize: 30, height auto, wordWrap disabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'long line long line long line' },
                { caption: 'big line big line big line' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,long line\n' +
'long line\n' +
'long line,55,71.5,{baseline:middle}',
            'setFontSize,30',
            'text,big li...,150,94.5,{baseline:middle}',
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
            pdfCell.wordWrapEnabled = gridCell.column.index === 0;
            pdfCell.font = {
                size: gridCell.column.index === 0
                    ? 20
                    : 30
            };
            pdfCell.padding = gridCell.column.index === 0 ? 5 : 0;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100, 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 5 text lines. fontSize default, wordWrap enabled multiline text', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long text very long text\nvery long text\nvery long text\nvery long text' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very\n' +
'long text\n' +
'very long text\n' +
'very long text\n' +
'very long text,55,62,{baseline:middle}',
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

    QUnit.test('1 col - 5 text lines. fontSize default, wordWrap enabled multiline text, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long text very long text\nvery long text\nvery long text\nvery long text' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very\n' +
'long text\n' +
'very long text\n' +
'very long text\n' +
'very long text,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,67.5',
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

    QUnit.test('1 col - 5 text lines. fontSize default, wordWrap enabled multiline text, padding, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long text very long text\nvery long text\nvery long text\nvery long text' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long text very\n' +
'long text\n' +
'very long text\n' +
'very long text\n' +
'very long text,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,67.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = 5;
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize default, height auto, grid.wordWrap disabled, cell.wordWrap enabled. customizeCell has priority', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'very long line very long line very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very\n' +
'long line very long\n' +
'line,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.wordWrapEnabled = true;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines. fontSize default, height auto, grid.wordWrap enabled, cell.wordWrap disabled. customizeCell has priority', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ caption: 'very long line very long line very long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,very long line very...,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.wordWrapEnabled = false;
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines, line1.fontStyle=bold,line2.fontStyle=italic,line3.fontStyle=normal', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [ { caption: 'caption: very long line very long line very long line', dataField: 'f1' } ],
            dataSource: [{ f1: 'line1: sf sgfgsf gsdf sdf sfdg sdfgsfdg s' }, { f1: 'line2: sdfgnsf gfkjghgsf sdd jbfgjsfb sjf dsrg fgsfg sfg sfdgfs gfd sd' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFont,helvetica,bold,',
            'setFontSize,20',
            'text,cap\n' +
'tion\n' +
': ve\n' +
'ry l\n' +
'ong\n' +
'line \n' +
'ver\n' +
'y lo\n' +
'ng\n' +
'line \n' +
'ver\n' +
'y lo\n' +
'ng\n' +
'line,45,56.5,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,italic,',
            'setFontSize,10',
            'text,line1: sf\n' +
'sgfgsf\n' +
'gsdf sdf\n' +
'sfdg\n' +
'sdfgsfdg\n' +
's,45,382.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'setFontSize,15',
            'text,line2: \n' +
'sdfgn\n' +
'sf gfkj\n' +
'ghgsf\n' +
'sdd jb\n' +
'fgjsfb\n' +
'sjf\n' +
'dsrg\n' +
'fgsfg\n' +
'sfg\n' +
'sfdgfs\n' +
'gfd\n' +
'sd,45,464.625,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,50,332',
            'rect,40,372,50,79',
            'rect,40,451,50,234.25',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text.indexOf('caption') >= 0) {
                pdfCell.font = { size: 20, style: 'bold' };
            } else if(pdfCell.text.indexOf('line1') >= 0) {
                pdfCell.font = { size: 10, style: 'italic' };
            } else {
                pdfCell.font = { size: 15, style: 'normal' };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 }, columnWidths: [ 50 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines, line1.fontStyle=italic,line2.fontStyle=bold,line3.fontStyle=normal', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [ { caption: 'caption: very long line very long line very long line', dataField: 'f1' } ],
            dataSource: [{ f1: 'line1: sf sgfgsf gsdf sdf sfdg sdfgsfdg s' }, { f1: 'line2: sdfgnsf gfkjghgsf sdd jbfgjsfb sjf dsrg fgsfg sfg sfdgfs gfd sd' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFont,helvetica,italic,',
            'setFontSize,20',
            'text,capt\n' +
'ion:\n' +
'very\n' +
'long\n' +
'line\n' +
'very\n' +
'long\n' +
'line\n' +
'very\n' +
'long\n' +
'line,45,56.5,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'setFontSize,10',
            'text,line1: sf\n' +
'sgfgsf\n' +
'gsdf sdf\n' +
'sfdg sdf\n' +
'gsfdg s,45,313.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'setFontSize,15',
            'text,line2: \n' +
'sdfgn\n' +
'sf gfkj\n' +
'ghgsf\n' +
'sdd jb\n' +
'fgjsfb\n' +
'sjf\n' +
'dsrg\n' +
'fgsfg\n' +
'sfg\n' +
'sfdgfs\n' +
'gfd\n' +
'sd,45,384.125,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,50,263',
            'rect,40,303,50,67.5',
            'rect,40,370.5,50,234.25',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text.indexOf('caption') >= 0) {
                pdfCell.font = { size: 20, style: 'italic' };
            } else if(pdfCell.text.indexOf('line1') >= 0) {
                pdfCell.font = { size: 10, style: 'bold' };
            } else {
                pdfCell.font = { size: 15, style: 'normal' };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 }, columnWidths: [ 50 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 3 text lines, line1.fontStyle=normal,line2.fontStyle=bold,line3.fontStyle=italic', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [ { caption: 'caption: very long line very long line very long line', dataField: 'f1' } ],
            dataSource: [{ f1: 'line1: sf sgfgsf gsdf sdf sfdg sdfgsfdg s' }, { f1: 'line2: sdfgnsf gfkjghgsf sdd jbfgjsfb sjf dsrg fgsfg sfg sfdgfs gfd sd' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,capt\n' +
'ion:\n' +
'very\n' +
'long\n' +
'line\n' +
'very\n' +
'long\n' +
'line\n' +
'very\n' +
'long\n' +
'line,45,56.5,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'setFontSize,10',
            'text,line1: sf\n' +
'sgfgsf\n' +
'gsdf sdf\n' +
'sfdg sdf\n' +
'gsfdg s,45,313.75,{baseline:middle}',
            'setFont,helvetica,italic,',
            'setFontSize,15',
            'text,line2: \n' +
'sdfgn\n' +
'sf gfkj\n' +
'ghgsf\n' +
'sdd jb\n' +
'fgjsfb\n' +
'sjf\n' +
'dsrg\n' +
'fgsfg\n' +
'sfg\n' +
'sfdgfs\n' +
'gfd\n' +
'sd,45,384.125,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,50,263',
            'rect,40,303,50,67.5',
            'rect,40,370.5,50,234.25',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text.indexOf('caption') >= 0) {
                pdfCell.font = { size: 20, style: 'normal' };
            } else if(pdfCell.text.indexOf('line1') >= 0) {
                pdfCell.font = { size: 10, style: 'bold' };
            } else {
                pdfCell.font = { size: 15, style: 'italic' };
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 0, y: 0 }, columnWidths: [ 50 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});

QUnit.module('WordWrap with Bands', moduleConfig, () => {
    QUnit.test('[band1-[f1]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                {
                    caption: 'Band1 line1 line 2',
                    columns: [ 'f1', ]
                }
            ],
            dataSource: [{ f1: 'f1_1 long line very long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 line1 line 2,55,65.75,{baseline:middle}',
            'text,F1,55,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 long line very\n' +
'long line,55,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'rect,50,98,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'Band1 long line 1 ling line 2', columns: [ 'f1', 'f2', ] }
            ],
            dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 line long line long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 long line 1 ling line 2,55,65.75,{baseline:middle}',
            'text,F1,55,87.25,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,114.5,{baseline:middle}',
            'text,f2_1 line long\n' +
'line long line,125,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,140,21.5',
            'rect,50,76.5,70,21.5',
            'rect,120,76.5,70,21.5',
            'rect,50,98,70,33',
            'rect,120,98,70,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2, f3]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'Band1 long line 1 ling line 2', columns: [ 'f1', 'f2', 'f3' ] }
            ],
            dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 line long line long line', f3: 'f3' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 long line 1 ling line 2,55,65.75,{baseline:middle}',
            'text,F1,55,87.25,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'text,F3,195,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,114.5,{baseline:middle}',
            'text,f2_1 line long\n' +
'line long line,125,108.75,{baseline:middle}',
            'text,f3,195,114.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,210,21.5',
            'rect,50,76.5,70,21.5',
            'rect,120,76.5,70,21.5',
            'rect,190,76.5,70,21.5',
            'rect,50,98,70,33',
            'rect,120,98,70,33',
            'rect,190,98,70,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 70 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[f3,f4]]], short text height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { dataField: 'f3', caption: 'f3' },
                            ]
                        },
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6', dataField: 'f4' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1',
                    f2: 'f2_1',
                    f3: 'f3_1',
                    f4: 'f4_1'
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,55,65.75,{baseline:middle}',
            'text,Band1 line,125,67.917,{baseline:middle}',
            'text,Band1_2,125,102.75,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,205,95.917,{baseline:middle}',
            'text,f3,125,146.583,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,179.25,{baseline:middle}',
            'text,f3_1,125,179.25,{baseline:middle}',
            'text,f4_1,205,179.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,113.5',
            'rect,120,55,140,25.833',
            'rect,120,80.833,80,43.833',
            'rect,200,80.833,60,87.667',
            'rect,120,124.667,80,43.833',
            'rect,50,168.5,70,21.5',
            'rect,120,168.5,80,21.5',
            'rect,200,168.5,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[f3,f4]]], long text height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { dataField: 'f3', caption: 'f3' },
                            ]
                        },
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8', dataField: 'f4' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1',
                    f2: 'f2_1',
                    f3: 'f3_1',
                    f4: 'f4_1'
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,55,70.75,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,102,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8,205,87.25,{baseline:middle}',
            'text,f3,125,153,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,189.25,{baseline:middle}',
            'text,f3_1,125,189.25,{baseline:middle}',
            'text,f4_1,205,189.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,123.5',
            'rect,120,55,140,21.5',
            'rect,120,76.5,80,51',
            'rect,200,76.5,60,102',
            'rect,120,127.5,80,51',
            'rect,50,178.5,70,21.5',
            'rect,120,178.5,80,21.5',
            'rect,200,178.5,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[band-[f3],f4]]], short text height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { caption: 'f1_2_3', columns: [ { dataField: 'f3', caption: 'line1\nline2\nline3\nline4' } ] },
                            ]
                        },
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f4' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1',
                    f2: 'f2_1',
                    f3: 'f3_1_1',
                    f4: 'f4_1'
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,55,76.5,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,89.667,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,205,87.25,{baseline:middle}',
            'text,f1_2_3,125,116,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4,125,142.333,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,200.75,{baseline:middle}',
            'text,f3_1_1,125,200.75,{baseline:middle}',
            'text,f4_1,205,200.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,135',
            'rect,120,55,140,21.5',
            'rect,120,76.5,80,26.333',
            'rect,200,76.5,60,113.5',
            'rect,120,102.833,80,26.333',
            'rect,120,129.167,80,60.833',
            'rect,50,190,70,21.5',
            'rect,120,190,80,21.5',
            'rect,200,190,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[band-[f3],f4]]], long text height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { caption: 'f1_2_3', columns: [ { dataField: 'f3', caption: 'line1\nline2\nline3\nline4\nline5\nline6' } ] },
                            ]
                        },
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f4' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1',
                    f2: 'f2_1',
                    f3: 'f3_1_1',
                    f4: 'f4_1'
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,55,80.75,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,87.25,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,205,91.5,{baseline:middle}',
            'text,f1_2_3,125,108.75,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,125,130.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,209.25,{baseline:middle}',
            'text,f3_1_1,125,209.25,{baseline:middle}',
            'text,f4_1,205,209.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,143.5',
            'rect,120,55,140,21.5',
            'rect,120,76.5,80,21.5',
            'rect,200,76.5,60,122',
            'rect,120,98,80,21.5',
            'rect,120,119.5,80,79',
            'rect,50,198.5,70,21.5',
            'rect,120,198.5,80,21.5',
            'rect,200,198.5,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[f3,f4],f5]], long band text - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                'f1',
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { dataField: 'f3', caption: 'f3 long line very long line' },
                                { dataField: 'f4', caption: 'f4 long line very long line' },
                            ]
                        },
                        {
                            caption: 'f5 long line very long line long line very long line long line very long line',
                            dataField: 'f5'
                        }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1 line',
                    f2: 'f2_1 long line very long line',
                    f3: 'f3_1',
                    f4: 'f4_1 very long line',
                    f5: 'f5_1 long line'
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,105.25,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,90.5,{baseline:middle}',
            'text,f5 long line\n' +
'very long line\n' +
'long line very\n' +
'long line long\n' +
'line very long\n' +
'line,265,87.25,{baseline:middle}',
            'text,f3 long line very\n' +
'long line,125,124.25,{baseline:middle}',
            'text,f4 long line\n' +
'very long\n' +
'line,205,118.5,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,172,{baseline:middle}',
            'text,f3_1,125,172,{baseline:middle}',
            'text,f4_1 very\n' +
'long line,205,166.25,{baseline:middle}',
            'text,f5_1 long line,265,172,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,100.5',
            'rect,120,55,210,21.5',
            'rect,120,76.5,140,28',
            'rect,260,76.5,70,79',
            'rect,120,104.5,80,51',
            'rect,200,104.5,60,51',
            'rect,50,155.5,70,33',
            'rect,120,155.5,80,33',
            'rect,200,155.5,60,33',
            'rect,260,155.5,70,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[f3,f4],f5]], long band text, customer height and height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                'f1',
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { dataField: 'f3', caption: 'f3 long line very long line' },
                                { dataField: 'f4', caption: 'f4 long line very long line' },
                            ]
                        },
                        {
                            caption: 'f5 long line very long line long line very long line long line very long line',
                            dataField: 'f5'
                        }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1 line',
                    f2: 'f2_1 long line very long line',
                    f3: 'f3_1',
                    f4: 'f4_1 very long line',
                    f5: 'f5_1 long line'
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,133,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,121.5,{baseline:middle}',
            'text,f5 long line\n' +
'very long line\n' +
'long line very\n' +
'long line long\n' +
'line very long\n' +
'line,265,115,{baseline:middle}',
            'text,f3 long line very\n' +
'long line,125,183,{baseline:middle}',
            'text,f4 long line\n' +
'very long\n' +
'line,205,177.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,227.5,{baseline:middle}',
            'text,f3_1,125,227.5,{baseline:middle}',
            'text,f4_1 very\n' +
'long line,205,221.75,{baseline:middle}',
            'text,f5_1 long line,265,227.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,156',
            'rect,120,55,210,21.5',
            'rect,120,76.5,140,90',
            'rect,260,76.5,70,134.5',
            'rect,120,166.5,80,44.5',
            'rect,200,166.5,60,44.5',
            'rect,50,211,70,33',
            'rect,120,211,80,33',
            'rect,200,211,60,33',
            'rect,260,211,70,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'Band1_2') {
                e.rowHeight = 90;
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 10, y: 15 },
            columnWidths: [70, 80, 60, 70],
            onRowExporting
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[f3,f4],f5]], short band text - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                'f1',
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { dataField: 'f3', caption: 'f3 long line very long line' },
                                { dataField: 'f4', caption: 'f4 long line very long line' },
                            ]
                        },
                        { caption: 'f5 long line very long line', dataField: 'f5' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1 line',
                    f2: 'f2_1 long line very long line',
                    f3: 'f3_1',
                    f4: 'f4_1 very long line',
                    f5: 'f5_1 long line'
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,98.75,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,87.25,{baseline:middle}',
            'text,f5 long line\n' +
'very long line,265,103.75,{baseline:middle}',
            'text,f3 long line very\n' +
'long line,125,114.5,{baseline:middle}',
            'text,f4 long line\n' +
'very long\n' +
'line,205,108.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,159,{baseline:middle}',
            'text,f3_1,125,159,{baseline:middle}',
            'text,f4_1 very\n' +
'long line,205,153.25,{baseline:middle}',
            'text,f5_1 long line,265,159,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,87.5',
            'rect,120,55,210,21.5',
            'rect,120,76.5,140,21.5',
            'rect,260,76.5,70,66',
            'rect,120,98,80,44.5',
            'rect,200,98,60,44.5',
            'rect,50,142.5,70,33',
            'rect,120,142.5,80,33',
            'rect,200,142.5,60,33',
            'rect,260,142.5,70,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], short text in bands height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { caption: 'f1_2_3', columns: [
                                    { caption: 'line1', columns: [
                                        { dataField: 'f3' },
                                        { dataField: 'f4', caption: 'line1\nline2\nline3' }
                                    ] },
                                ] },
                            ]
                        },
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6', dataField: 'f5' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1',
                    f2: 'f2_1',
                    f3: 'f3_1_1',
                    f4: 'f4_1',
                    f5: 'f5_1',
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,55,74.25,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,87.25,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,265,102.25,{baseline:middle}',
            'text,f1_2_3,125,108.75,{baseline:middle}',
            'text,line1,125,130.25,{baseline:middle}',
            'text,F3,125,163.25,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3,205,151.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,196.25,{baseline:middle}',
            'text,f3_1_1,125,196.25,{baseline:middle}',
            'text,f4_1,205,196.25,{baseline:middle}',
            'text,f5_1,265,196.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,130.5',
            'rect,120,55,210,21.5',
            'rect,120,76.5,140,21.5',
            'rect,260,76.5,70,109',
            'rect,120,98,140,21.5',
            'rect,120,119.5,140,21.5',
            'rect,120,141,80,44.5',
            'rect,200,141,60,44.5',
            'rect,50,185.5,70,21.5',
            'rect,120,185.5,80,21.5',
            'rect,200,185.5,60,21.5',
            'rect,260,185.5,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], f4.shortText, f3.shortText,f5.longText in bands height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { caption: 'f1_2_3', columns: [
                                    { caption: 'line1', columns: [
                                        { dataField: 'f3' },
                                        { dataField: 'f4', caption: 'line1' }
                                    ] },
                                ] },
                            ]
                        },
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6', dataField: 'f5' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1',
                    f2: 'f2_1',
                    f3: 'f3_1_1',
                    f4: 'f4_1',
                    f5: 'f5_1',
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,55,65.75,{baseline:middle}',
            'text,Band1 line,125,66.35,{baseline:middle}',
            'text,Band1_2,125,89.05,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,265,94.35,{baseline:middle}',
            'text,f1_2_3,125,111.75,{baseline:middle}',
            'text,line1,125,134.45,{baseline:middle}',
            'text,F3,125,157.15,{baseline:middle}',
            'text,line1,205,157.15,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,179.25,{baseline:middle}',
            'text,f3_1_1,125,179.25,{baseline:middle}',
            'text,f4_1,205,179.25,{baseline:middle}',
            'text,f5_1,265,179.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,113.5',
            'rect,120,55,210,22.7',
            'rect,120,77.7,140,22.7',
            'rect,260,77.7,70,90.8',
            'rect,120,100.4,140,22.7',
            'rect,120,123.1,140,22.7',
            'rect,120,145.8,80,22.7',
            'rect,200,145.8,60,22.7',
            'rect,50,168.5,70,21.5',
            'rect,120,168.5,80,21.5',
            'rect,200,168.5,60,21.5',
            'rect,260,168.5,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], f1.shortText, f4.shortText, f3.shortText,f5.longText in bands height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'line1\nline2\nline3', dataField: 'f1' },
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { caption: 'f1_2_3', columns: [
                                    { caption: 'line1', columns: [
                                        { dataField: 'f3' },
                                        { dataField: 'f4', caption: 'line1' }
                                    ] },
                                ] },
                            ]
                        },
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6', dataField: 'f5' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1',
                    f2: 'f2_1',
                    f3: 'f3_1_1',
                    f4: 'f4_1',
                    f5: 'f5_1',
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
'line2\n' +
'line3,55,97.25,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,87.25,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,265,90.75,{baseline:middle}',
            'text,f1_2_3,125,108.75,{baseline:middle}',
            'text,line1,125,130.25,{baseline:middle}',
            'text,F3,125,151.75,{baseline:middle}',
            'text,line1,205,151.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,173.25,{baseline:middle}',
            'text,f3_1_1,125,173.25,{baseline:middle}',
            'text,f4_1,205,173.25,{baseline:middle}',
            'text,f5_1,265,173.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,107.5',
            'rect,120,55,210,21.5',
            'rect,120,76.5,140,21.5',
            'rect,260,76.5,70,86',
            'rect,120,98,140,21.5',
            'rect,120,119.5,140,21.5',
            'rect,120,141,80,21.5',
            'rect,200,141,60,21.5',
            'rect,50,162.5,70,21.5',
            'rect,120,162.5,80,21.5',
            'rect,200,162.5,60,21.5',
            'rect,260,162.5,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], short text height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { caption: 'f1_2_3', columns: [
                                    { caption: 'line1\nline2\nline3', columns: [
                                        { dataField: 'f3' },
                                        { dataField: 'f4', caption: 'line1\nline2\nline3' }
                                    ] },
                                ] },
                            ]
                        },
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f5' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1',
                    f2: 'f2_1',
                    f3: 'f3_1_1',
                    f4: 'f4_1',
                    f5: 'f5_1',
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,55,85.75,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,87.25,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,265,96.5,{baseline:middle}',
            'text,f1_2_3,125,108.75,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3,125,130.25,{baseline:middle}',
            'text,F3,125,186.25,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3,205,174.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,219.25,{baseline:middle}',
            'text,f3_1_1,125,219.25,{baseline:middle}',
            'text,f4_1,205,219.25,{baseline:middle}',
            'text,f5_1,265,219.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,153.5',
            'rect,120,55,210,21.5',
            'rect,120,76.5,140,21.5',
            'rect,260,76.5,70,132',
            'rect,120,98,140,21.5',
            'rect,120,119.5,140,44.5',
            'rect,120,164,80,44.5',
            'rect,200,164,60,44.5',
            'rect,50,208.5,70,21.5',
            'rect,120,208.5,80,21.5',
            'rect,200,208.5,60,21.5',
            'rect,260,208.5,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[band-[f3,f4]], f5], long text height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { caption: 'f1_2_3', columns: [
                                    { caption: 'line1\nline2\nline3', columns: [
                                        { dataField: 'f3' },
                                        { dataField: 'f4', caption: 'line1\nline2\nline3\nline4\nline5\nline6' }
                                    ] },
                                ] },
                            ]
                        },
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f5' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1',
                    f2: 'f2_1',
                    f3: 'f3_1_1',
                    f4: 'f4_1',
                    f5: 'f5_1',
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,55,103,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,87.25,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,265,113.75,{baseline:middle}',
            'text,f1_2_3,125,108.75,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3,125,130.25,{baseline:middle}',
            'text,F3,125,203.5,{baseline:middle}',
            'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,205,174.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,253.75,{baseline:middle}',
            'text,f3_1_1,125,253.75,{baseline:middle}',
            'text,f4_1,205,253.75,{baseline:middle}',
            'text,f5_1,265,253.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,188',
            'rect,120,55,210,21.5',
            'rect,120,76.5,140,21.5',
            'rect,260,76.5,70,166.5',
            'rect,120,98,140,21.5',
            'rect,120,119.5,140,44.5',
            'rect,120,164,80,79',
            'rect,200,164,60,79',
            'rect,50,243,70,21.5',
            'rect,120,243,80,21.5',
            'rect,200,243,60,21.5',
            'rect,260,243,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [70, 80, 60, 70] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band-[band-[f3,f4],f5]], short band text - customer height and height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                'f1',
                {
                    caption: 'Band1 line',
                    columns: [
                        {
                            caption: 'Band1_2', columns: [
                                { dataField: 'f3', caption: 'f3 long line very long line' },
                                { dataField: 'f4', caption: 'f4 long line very long line' },
                            ]
                        },
                        { caption: 'f5 long line very long line', dataField: 'f5' }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1 line',
                    f2: 'f2_1 long line very long line',
                    f3: 'f3_1',
                    f4: 'f4_1 very long line',
                    f5: 'f5_1 long line'
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,133,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,Band1_2,125,121.5,{baseline:middle}',
            'text,f5 long line\n' +
'very long line,265,138,{baseline:middle}',
            'text,f3 long line very\n' +
'long line,125,183,{baseline:middle}',
            'text,f4 long line\n' +
'very long\n' +
'line,205,177.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,227.5,{baseline:middle}',
            'text,f3_1,125,227.5,{baseline:middle}',
            'text,f4_1 very\n' +
'long line,205,221.75,{baseline:middle}',
            'text,f5_1 long line,265,227.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,156',
            'rect,120,55,210,21.5',
            'rect,120,76.5,140,90',
            'rect,260,76.5,70,134.5',
            'rect,120,166.5,80,44.5',
            'rect,200,166.5,60,44.5',
            'rect,50,211,70,33',
            'rect,120,211,80,33',
            'rect,200,211,60,33',
            'rect,260,211,70,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'Band1_2') {
                e.rowHeight = 90;
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 10, y: 15 },
            columnWidths: [70, 80, 60, 70],
            onRowExporting
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, band1_2-[f2]]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                {
                    caption: 'Band1 line1',
                    columns: [
                        'f1',
                        { caption: 'Band1_2 long line', columns: [ 'f2' ] }
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1 line long line', f2: 'f2_1_1 very long line very long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 line1,55,65.75,{baseline:middle}',
            'text,F1,55,103.75,{baseline:middle}',
            'text,Band1_2\n' +
'long line,115,87.25,{baseline:middle}',
            'text,F2,115,120.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line\n' +
'long line,55,147.5,{baseline:middle}',
            'text,f2_1_1 very\n' +
'long line very\n' +
'long line,115,141.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,130,21.5',
            'rect,50,76.5,60,54.5',
            'rect,110,76.5,70,33',
            'rect,110,109.5,70,21.5',
            'rect,50,131,60,44.5',
            'rect,110,131,70,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, band1_2-[f2, f3]]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        'f1',
                        { caption: 'Band1_2 long line very long line very long', columns: [ 'f2', { dataField: 'f3', caption: 'f3 long line very long line' } ] }
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1 line', f2: 'f2_1_2 very long line very long line', f3: 'f3_1_2 long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F1,55,109.5,{baseline:middle}',
            'text,Band1_2 long line very long\n' +
'line very long,115,87.25,{baseline:middle}',
            'text,F2,115,126,{baseline:middle}',
            'text,f3 long line very\n' +
'long line,185,120.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,164.75,{baseline:middle}',
            'text,f2_1_2 very\n' +
'long line very\n' +
'long line,115,153.25,{baseline:middle}',
            'text,f3_1_2 long\n' +
'line,185,159,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,210,21.5',
            'rect,50,76.5,60,66',
            'rect,110,76.5,150,33',
            'rect,110,109.5,70,33',
            'rect,180,109.5,80,33',
            'rect,50,142.5,60,44.5',
            'rect,110,142.5,70,44.5',
            'rect,180,142.5,80,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                'f1',
                { caption: 'Band2 long line', columns: [ 'f2' ] }
            ],
            dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 very long line very long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,76.5,{baseline:middle}',
            'text,Band2 long line,125,65.75,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,120.25,{baseline:middle}',
            'text,f2_1 very long\n' +
'line very long\n' +
'line,125,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,80,21.5',
            'rect,120,76.5,80,21.5',
            'rect,50,98,70,44.5',
            'rect,120,98,80,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2,f3]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                'f1',
                { caption: 'Band2 line long line very long line', columns: [ 'f2', 'f3' ] }
            ],
            dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 very long line very long line', f3: 'f3_1' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,82.25,{baseline:middle}',
            'text,Band2 line long line very long\n' +
'line,125,65.75,{baseline:middle}',
            'text,F2,125,98.75,{baseline:middle}',
            'text,F3,205,98.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,131.75,{baseline:middle}',
            'text,f2_1 very long\n' +
'line very long\n' +
'line,125,120.25,{baseline:middle}',
            'text,f3_1,205,131.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,54.5',
            'rect,120,55,140,33',
            'rect,120,88,80,21.5',
            'rect,200,88,60,21.5',
            'rect,50,109.5,70,44.5',
            'rect,120,109.5,80,44.5',
            'rect,200,109.5,60,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2,f3], f4] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2', { caption: 'f3 long line', dataField: 'f3' } ] },
                { caption: 'f4 very long line', dataField: 'f4' }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1 line very long line very long line', f3: 'f3_1', f4: 'f4_1 long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,76.5,{baseline:middle}',
            'text,Band2,125,65.75,{baseline:middle}',
            'text,f4 very long\n' +
'line,265,70.75,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'text,f3 long line,205,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,120.25,{baseline:middle}',
            'text,f2_1 line very\n' +
'long line very\n' +
'long line,125,108.75,{baseline:middle}',
            'text,f3_1,205,120.25,{baseline:middle}',
            'text,f4_1 long line,265,120.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,140,21.5',
            'rect,260,55,70,43',
            'rect,120,76.5,80,21.5',
            'rect,200,76.5,60,21.5',
            'rect,50,98,70,44.5',
            'rect,120,98,80,44.5',
            'rect,200,98,60,44.5',
            'rect,260,98,70,44.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                'f1',
                {
                    caption: 'Band1 line',
                    columns: [
                        'f2',
                        {
                            caption: 'Band1_1 long line very long line',
                            columns: [
                                { dataField: 'f3', caption: 'f3  long line' },
                                { dataField: 'f4', caption: 'f4  long line very long line' }
                            ]
                        },
                        {
                            caption: 'Band1_2',
                            columns: [{ dataField: 'f5', caption: 'f5 long line very long line' }, 'f6']
                        },
                        {
                            caption: 'f7 long line very long linelong line very long linelong line very long linelong line very long line',
                            dataField: 'f7'
                        }
                    ]
                }
            ],
            dataSource: [
                {
                    f1: 'f1_1 line',
                    f2: 'f2_1 long line very long line',
                    f3: 'f3_1',
                    f4: 'f4_1 very long line very long line very long line',
                    f5: 'f5_1 long line', f6: 'f6_1', f7: 'f7_1 line'
                }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,139.75,{baseline:middle}',
            'text,Band1 line,125,65.75,{baseline:middle}',
            'text,F2,125,150.5,{baseline:middle}',
            'text,Band1_1 long line very\n' +
'long line,205,104.875,{baseline:middle}',
            'text,Band1_2,335,110.625,{baseline:middle}',
            'text,f7 long\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long line,425,87.25,{baseline:middle}',
            'text,f3  long\n' +
'line,205,178.875,{baseline:middle}',
            'text,f4  long line\n' +
'very long line,265,178.875,{baseline:middle}',
            'text,f5 long\n' +
'line very\n' +
'long line,335,173.125,{baseline:middle}',
            'text,F6,385,184.625,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1 line,55,252.5,{baseline:middle}',
            'text,f2_1 long line\n' +
'very long line,125,246.75,{baseline:middle}',
            'text,f3_1,205,252.5,{baseline:middle}',
            'text,f4_1 very\n' +
'long line very\n' +
'long line very\n' +
'long line,265,235.25,{baseline:middle}',
            'text,f5_1\n' +
'long line,335,246.75,{baseline:middle}',
            'text,f6_1,385,252.5,{baseline:middle}',
            'text,f7_1 line,425,252.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,169.5',
            'rect,120,55,350,21.5',
            'rect,120,76.5,80,148',
            'rect,200,76.5,130,68.25',
            'rect,330,76.5,90,68.25',
            'rect,420,76.5,50,148',
            'rect,200,144.75,60,79.75',
            'rect,260,144.75,70,79.75',
            'rect,330,144.75,50,79.75',
            'rect,380,144.75,40,79.75',
            'rect,50,224.5,70,56',
            'rect,120,224.5,80,56',
            'rect,200,224.5,60,56',
            'rect,260,224.5,70,56',
            'rect,330,224.5,50,56',
            'rect,380,224.5,40,56',
            'rect,420,224.5,50,56',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 10, y: 15 },
            columnWidths: [70, 80, 60, 70, 50, 40, 50]
        }).then(() => {
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});

QUnit.module('WordWrap with grouping', moduleConfig, () => {
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
                {
                    f1: 'f1 line line',
                    f2: 'f1_2 line long line',
                    f3: 'f1_3 line long line long line'
                },
                {
                    f1: 'f1 long line long line long line',
                    f2: 'f2_2 line',
                    f3: 'f2_3 line long line line'
                },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 line line,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_2 line long line,55,114.5,{baseline:middle}',
            'text,f1_3 line long\n' +
'line long line,145,108.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line long line long line,55,141.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_2 line,55,169,{baseline:middle}',
            'text,f2_3 line long\n' +
'line line,145,163.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,90,33',
            'rect,140,98,80,33',
            'rect,50,131,170,21.5',
            'rect,50,152.5,90,33',
            'rect,140,152.5,80,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [90, 80] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3] - height auto, word wrap enabled, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                {
                    f1: 'f1 line line',
                    f2: 'f1_2 line long line',
                    f3: 'f1_3 line long line long line'
                },
                {
                    f1: 'f1 long line long line long line',
                    f2: 'f2_2 line',
                    f3: 'f2_3 line long line line'
                },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F3,450.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 line line,540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f1_2 line long line,540.28,114.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f1_3 line long\n' +
'line long line,450.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line long line long line,540.28,141.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f2_2 line,540.28,169,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f2_3 line long\n' +
'line line,450.28,163.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,455.28,55,90,21.5',
            'rect,375.28,55,80,21.5',
            'rect,375.28,76.5,170,21.5',
            'rect,455.28,98,90,33',
            'rect,375.28,98,80,33',
            'rect,375.28,131,170,21.5',
            'rect,455.28,152.5,90,33',
            'rect,375.28,152.5,80,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [90, 80] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
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
                {
                    f1: 'f1_1 long line',
                    f2: 'f1_2 long line long line long line',
                    f3: 'f1_3 line'
                },
                {
                    f1: 'f2_1 long line long line long line',
                    f2: 'f2_2 line long line',
                    f3: 'f2_3'
                },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1 long line,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_2 long line\n' +
'long line long line,55,108.75,{baseline:middle}',
            'text,f1_3 line,145,114.5,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F1: f2_1 long line long line long\n' +
'line,55,141.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_2 line long line,55,174.75,{baseline:middle}',
            'text,f2_3,145,174.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,90,33',
            'rect,140,98,80,33',
            'rect,50,131,170,33',
            'rect,50,164,90,21.5',
            'rect,140,164,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [90, 80] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3] - height auto, word wrap enabled, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                {
                    f1: 'f1_1 long line',
                    f2: 'f1_2 long line long line long line',
                    f3: 'f1_3 line'
                },
                {
                    f1: 'f2_1 long line long line long line',
                    f2: 'f2_2 line long line',
                    f3: 'f2_3'
                },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F3,450.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1 long line,540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f1_2 long line\n' +
'long line long line,540.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f1_3 line,450.28,114.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,F1: f2_1 long line long line long\n' +
'line,540.28,141.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f2_2 line long line,540.28,174.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f2_3,450.28,174.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,455.28,55,90,21.5',
            'rect,375.28,55,80,21.5',
            'rect,375.28,76.5,170,21.5',
            'rect,455.28,98,90,33',
            'rect,375.28,98,80,33',
            'rect,375.28,131,170,33',
            'rect,455.28,164,90,21.5',
            'rect,375.28,164,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [90, 80] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
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
                {
                    f1: 'f1 long line long line long line',
                    f2: 'f1_2 long line',
                    f3: 'f1_3 line',
                    f4: 'f1_4'
                },
                {
                    f1: 'f1 long line',
                    f2: 'f2_2 long line long line long line long line',
                    f3: 'f2_3 long line long line',
                    f4: 'f2_4'
                },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line,55,87.25,{baseline:middle}',
            'text,F2: f2_2 long line long line long\n' +
'line long line,55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_3 long line\n' +
'long line,55,141.75,{baseline:middle}',
            'text,f2_4,145,147.5,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line long line long line,55,174.75,{baseline:middle}',
            'text,F2: f1_2 long line,55,196.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_3 line,55,217.75,{baseline:middle}',
            'text,f1_4,145,217.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,33',
            'rect,50,131,90,33',
            'rect,140,131,80,33',
            'rect,50,164,170,21.5',
            'rect,50,185.5,170,21.5',
            'rect,50,207,90,21.5',
            'rect,140,207,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [90, 80] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto, word wrap enabled, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 1 },
                { dataField: 'f3' },
                { dataField: 'f4' },
            ],
            dataSource: [
                {
                    f1: 'f1 long line long line long line',
                    f2: 'f1_2 long line',
                    f3: 'f1_3 line',
                    f4: 'f1_4'
                },
                {
                    f1: 'f1 long line',
                    f2: 'f2_2 long line long line long line long line',
                    f3: 'f2_3 long line long line',
                    f4: 'f2_4'
                },
            ],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F4,450.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line,540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F2: f2_2 long line long line long\n' +
'line long line,540.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f2_3 long line\n' +
'long line,540.28,141.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f2_4,450.28,147.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line long line long line,540.28,174.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F2: f1_2 long line,540.28,196.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f1_3 line,540.28,217.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f1_4,450.28,217.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,455.28,55,90,21.5',
            'rect,375.28,55,80,21.5',
            'rect,375.28,76.5,170,21.5',
            'rect,375.28,98,170,33',
            'rect,455.28,131,90,33',
            'rect,375.28,131,80,33',
            'rect,375.28,164,170,21.5',
            'rect,375.28,185.5,170,21.5',
            'rect,455.28,207,90,21.5',
            'rect,375.28,207,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [90, 80] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});

QUnit.module('WordWrap with summaries and totals', moduleConfig, () => {
    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1] - height auto, word wrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [ { column: 'f1', summaryType: 'max' } ]
            },
            dataSource: [{ f1: 'f1 line long line', f2: 'f2 line', f3: 'f3 long line long line long line', f4: 'f4 long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,135,65.75,{baseline:middle}',
            'text,F4,225,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 line long line (Max: f1 line long line),55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2 line,55,114.5,{baseline:middle}',
            'text,f3 long line long\n' +
'line long line,135,108.75,{baseline:middle}',
            'text,f4 long line,225,114.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,220,55,80,21.5',
            'rect,50,76.5,250,21.5',
            'rect,50,98,80,33',
            'rect,130,98,90,33',
            'rect,220,98,80,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1] - height auto, word wrap enabled, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [ { column: 'f1', summaryType: 'max' } ]
            },
            dataSource: [{ f1: 'f1 line long line', f2: 'f2 line', f3: 'f3 long line long line long line', f4: 'f4 long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F3,460.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F4,370.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 line long line (Max: f1 line long line),540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f2 line,540.28,114.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f3 long line long\n' +
'line long line,460.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f4 long line,370.28,114.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,465.28,55,80,21.5',
            'rect,375.28,55,90,21.5',
            'rect,295.28,55,80,21.5',
            'rect,295.28,76.5,250,21.5',
            'rect,465.28,98,80,33',
            'rect,375.28,98,90,33',
            'rect,295.28,98,80,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1, f3, f4], groupItems: [f1, {f4, alignByColumn}] - height auto, word wrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 0 },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f4', summaryType: 'max', alignByColumn: true }
                ]
            },
            dataSource: [{ f1: 'f1 long line long line long line', f2: 'f2 long line', f3: 'f3 line', f4: 'f4 long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,305,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line long line long line (Max: f1 long\n' +
'line long line long line),55,87.25,{baseline:middle}',
            'text,Max: f4 long line\n' +
'long line,305,87.25,{baseline:middle}',
            'text,F2: f2 long line (Max of F1 is f1 long line long line\n' +
'long line),55,120.25,{baseline:middle}',
            'text,Max: f4 long line\n' +
'long line,305,120.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3 line,55,153.25,{baseline:middle}',
            'text,f4 long line long line,305,153.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,21.5',
            'rect,300,55,100,21.5',
            'line,50,76.5,300,76.5',
            'line,50,76.5,50,109.5',
            'line,50,109.5,300,109.5',
            'line,300,76.5,400,76.5',
            'line,400,76.5,400,109.5',
            'line,300,109.5,400,109.5',
            'line,50,109.5,300,109.5',
            'line,50,109.5,50,142.5',
            'line,50,142.5,300,142.5',
            'line,300,109.5,400,109.5',
            'line,400,109.5,400,142.5',
            'line,300,142.5,400,142.5',
            'rect,50,142.5,250,21.5',
            'rect,300,142.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1, f3, f4], groupItems: [f1, {f4, alignByColumn}] - height auto, word wrap enabled, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 0 },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f4', summaryType: 'max', alignByColumn: true }
                ]
            },
            dataSource: [{ f1: 'f1 long line long line long line', f2: 'f2 long line', f3: 'f3 line', f4: 'f4 long line long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F4,290.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line long line long line (Max: f1 long\n' +
'line long line long line),540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: f4 long line\n' +
'long line,290.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F2: f2 long line (Max of F1 is f1 long line long line\n' +
'long line),540.28,120.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: f4 long line\n' +
'long line,290.28,120.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f3 line,540.28,153.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f4 long line long line,290.28,153.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,295.28,55,250,21.5',
            'rect,195.28,55,100,21.5',
            'line,295.28,76.5,545.28,76.5',
            'line,545.28,76.5,545.28,109.5',
            'line,295.28,109.5,545.28,109.5',
            'line,195.28,76.5,295.28,76.5',
            'line,195.28,76.5,195.28,109.5',
            'line,195.28,109.5,295.28,109.5',
            'line,295.28,109.5,545.28,109.5',
            'line,545.28,109.5,545.28,142.5',
            'line,295.28,142.5,545.28,142.5',
            'line,195.28,109.5,295.28,109.5',
            'line,195.28,109.5,195.28,142.5',
            'line,195.28,142.5,295.28,142.5',
            'rect,295.28,142.5,250,21.5',
            'rect,195.28,142.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, showInGroupFooter }] - height auto, word wrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1 long line', f2: 'f2 very long line very long line', f3: 'f3 line', f4: 'f4 long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,205,65.75,{baseline:middle}',
            'text,F4,295,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line (Max: f1 long line),55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2 very long line very long line,55,108.75,{baseline:middle}',
            'text,f3 line,205,108.75,{baseline:middle}',
            'text,f4 long line,295,108.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3 line,205,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,21.5',
            'rect,200,55,90,21.5',
            'rect,290,55,80,21.5',
            'rect,50,76.5,320,21.5',
            'rect,50,98,150,21.5',
            'rect,200,98,90,21.5',
            'rect,290,98,80,21.5',
            'rect,50,119.5,150,21.5',
            'rect,200,119.5,90,21.5',
            'rect,290,119.5,80,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, showInGroupFooter }] - height auto, word wrap enabled, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1 long line', f2: 'f2 very long line very long line', f3: 'f3 line', f4: 'f4 long line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F3,390.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F4,300.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line (Max: f1 long line),540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f2 very long line very long line,540.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f3 line,390.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f4 long line,300.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: f3 line,390.28,130.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,395.28,55,150,21.5',
            'rect,305.28,55,90,21.5',
            'rect,225.28,55,80,21.5',
            'rect,225.28,76.5,320,21.5',
            'rect,395.28,98,150,21.5',
            'rect,305.28,98,90,21.5',
            'rect,225.28,98,80,21.5',
            'rect,395.28,119.5,150,21.5',
            'rect,305.28,119.5,90,21.5',
            'rect,225.28,119.5,80,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}] - height auto, word wrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [{ column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }]
            },
            dataSource: [{
                f1: 'f1 long line',
                f2: 'f2 long line long line long line',
                f3: 'f3 line long line long line',
                f4: 'f4 line'
            }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,135,65.75,{baseline:middle}',
            'text,F4,225,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2 long line long\n' +
'line long line,55,108.75,{baseline:middle}',
            'text,f3 line long line\n' +
'long line,135,108.75,{baseline:middle}',
            'text,f4 line,225,114.5,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3 line long\n' +
'line long line,135,141.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,220,55,80,21.5',
            'rect,50,76.5,250,21.5',
            'rect,50,98,80,33',
            'rect,130,98,90,33',
            'rect,220,98,80,33',
            'rect,50,131,80,33',
            'rect,130,131,90,33',
            'rect,220,131,80,33',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [80, 90, 80] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}] - height auto, word wrap enabled, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [{ column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }]
            },
            dataSource: [{
                f1: 'f1 long line',
                f2: 'f2 long line long line long line',
                f3: 'f3 line long line long line',
                f4: 'f4 line'
            }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F3,460.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F4,370.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 long line,540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f2 long line long\n' +
'line long line,540.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f3 line long line\n' +
'long line,460.28,108.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f4 line,370.28,114.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: f3 line long\n' +
'line long line,460.28,141.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,465.28,55,80,21.5',
            'rect,375.28,55,90,21.5',
            'rect,295.28,55,80,21.5',
            'rect,295.28,76.5,250,21.5',
            'rect,465.28,98,80,33',
            'rect,375.28,98,90,33',
            'rect,295.28,98,80,33',
            'rect,465.28,131,80,33',
            'rect,375.28,131,90,33',
            'rect,295.28,131,80,33',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [80, 90, 80] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3], 2 groups, height auto, wordWrapEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 1 },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'f3', summaryType: 'max' }
                ]
            },
            dataSource: [
                { f1: 'f1 very ling line very long line very long line', f2: 'f2_1 line', f3: 'f3line1\nline2\nline3\nline4', f4: 'f4' },
                { f1: 'f1 very long line very long line', f2: 'f2_2very long line very long line', f3: 'f3very long line very long line', f4: 'f4' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,135,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 very ling line very long line\n' +
'very long line,55,87.25,{baseline:middle}',
            'text,F2: f2_1 line,55,120.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55,141.75,{baseline:middle}',
            'text,f4,135,159,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55,197.75,{baseline:middle}',
            'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55,253.75,{baseline:middle}',
            'text,F1: f1 very long line very long\n' +
'line,55,309.75,{baseline:middle}',
            'text,F2: f2_2very long line very long\n' +
'line,55,342.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3very long line\n' +
'very long line,55,375.75,{baseline:middle}',
            'text,f4,135,381.5,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3very\n' +
'long line very\n' +
'long line,55,408.75,{baseline:middle}',
            'text,Max: f3very\n' +
'long line very\n' +
'long line,55,453.25,{baseline:middle}',
            'text,Max: f3very\n' +
'long line very\n' +
'long line,55,497.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,50,76.5,170,33',
            'rect,50,109.5,170,21.5',
            'rect,50,131,80,56',
            'rect,130,131,90,56',
            'rect,50,187,80,56',
            'rect,130,187,90,56',
            'rect,50,243,80,56',
            'rect,130,243,90,56',
            'rect,50,299,170,33',
            'rect,50,332,170,33',
            'rect,50,365,80,33',
            'rect,130,365,90,33',
            'rect,50,398,80,44.5',
            'rect,130,398,90,44.5',
            'rect,50,442.5,80,44.5',
            'rect,130,442.5,90,44.5',
            'rect,50,487,80,44.5',
            'rect,130,487,90,44.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3], 2 groups, height auto, wordWrapEnabled, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 1 },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'f3', summaryType: 'max' }
                ]
            },
            dataSource: [
                { f1: 'f1 very ling line very long line very long line', f2: 'f2_1 line', f3: 'f3line1\nline2\nline3\nline4', f4: 'f4' },
                { f1: 'f1 very long line very long line', f2: 'f2_2very long line very long line', f3: 'f3very long line very long line', f4: 'f4' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F4,460.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 very ling line very long line\n' +
'very long line,540.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F2: f2_1 line,540.28,120.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f3line1\n' +
'line2\n' +
'line3\n' +
'line4,540.28,141.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f4,460.28,159,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,540.28,197.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,540.28,253.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F1: f1 very long line very long\n' +
'line,540.28,309.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F2: f2_2very long line very long\n' +
'line,540.28,342.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f3very long line\n' +
'very long line,540.28,375.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f4,460.28,381.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,bold,',
            'text,Max: f3very\n' +
'long line very\n' +
'long line,540.28,408.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: f3very\n' +
'long line very\n' +
'long line,540.28,453.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Max: f3very\n' +
'long line very\n' +
'long line,540.28,497.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,465.28,55,80,21.5',
            'rect,375.28,55,90,21.5',
            'rect,375.28,76.5,170,33',
            'rect,375.28,109.5,170,21.5',
            'rect,465.28,131,80,56',
            'rect,375.28,131,90,56',
            'rect,465.28,187,80,56',
            'rect,375.28,187,90,56',
            'rect,465.28,243,80,56',
            'rect,375.28,243,90,56',
            'rect,375.28,299,170,33',
            'rect,375.28,332,170,33',
            'rect,465.28,365,80,33',
            'rect,375.28,365,90,33',
            'rect,465.28,398,80,44.5',
            'rect,375.28,398,90,44.5',
            'rect,465.28,442.5,80,44.5',
            'rect,375.28,442.5,90,44.5',
            'rect,465.28,487,80,44.5',
            'rect,375.28,487,90,44.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});

QUnit.module('WordWrap with summaries, totals and bands', moduleConfig, () => {
    QUnit.test('[band1-[f1, f2]], f1.groupIndex=0,f2.groupIndex=0 - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'Band1 long line 1 ling line 2', columns: [
                    { dataField: 'f1', groupIndex: 0 },
                    { dataField: 'f2', groupIndex: 0 }
                ] }
            ],
            dataSource: [
                { f1: 'f1_1 line', f2: 'f2_1 line long line long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 long\n' +
'line 1 ling\n' +
'line 2,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1 line,55,110.25,{baseline:middle}',
            'text,F2: f2_1 line\n' +
'long line\n' +
'long line,55,131.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,44.5',
            'rect,50,99.5,70,21.5',
            'rect,50,121,70,44.5',
            'rect,50,165.5,70,0',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2]], f1.groupIndex=0,f2.groupIndex=0 - height auto, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { caption: 'Band1 long line 1 ling line 2', columns: [
                    { dataField: 'f1', groupIndex: 0 },
                    { dataField: 'f2', groupIndex: 0 }
                ] }
            ],
            dataSource: [
                { f1: 'f1_1 line', f2: 'f2_1 line long line long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 long\n' +
'line 1 ling\n' +
'line 2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1 line,540.28,110.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F2: f2_1 line\n' +
'long line\n' +
'long line,540.28,131.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,475.28,55,70,44.5',
            'rect,475.28,99.5,70,21.5',
            'rect,475.28,121,70,44.5',
            'rect,475.28,165.5,70,0',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2], f3], f1.groupIndex=0,f2.groupIndex=1, summary: groupItems:f1 - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { caption: 'Band1 long line 1 ling line 2', columns: [
                    { dataField: 'f1', groupIndex: 0 },
                    { dataField: 'f2', groupIndex: 1 }
                ] },
                { dataField: 'f3', caption: 'f3 line' }
            ],
            summary: {
                groupItems: [ { column: 'f1', summaryType: 'max' } ]
            },
            dataSource: [
                { f1: 'f1_1 line', f2: 'f2_1 line long line long line', f3: 'long line very long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 long\n' +
'line 1 ling\n' +
'line 2,55,65.75,{baseline:middle}',
            'text,f3 line,125,77.25,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1 line (Max: f1_1\n' +
'line),55,110.25,{baseline:middle}',
            'text,F2: f2_1 line long line long\n' +
'line (Max of F1 is f1_1 line),55,143.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,long line very\n' +
'long line,125,176.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,44.5',
            'rect,120,55,70,44.5',
            'rect,50,99.5,140,33',
            'rect,50,132.5,140,33',
            'rect,50,165.5,70,33',
            'rect,120,165.5,70,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2], f3], f1.groupIndex=0,f2.groupIndex=1, summary: groupItems:f1 - height auto, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { caption: 'Band1 long line 1 ling line 2', columns: [
                    { dataField: 'f1', groupIndex: 0 },
                    { dataField: 'f2', groupIndex: 1 }
                ] },
                { dataField: 'f3', caption: 'f3 line' }
            ],
            summary: {
                groupItems: [ { column: 'f1', summaryType: 'max' } ]
            },
            dataSource: [
                { f1: 'f1_1 line', f2: 'f2_1 line long line long line', f3: 'long line very long line' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 long\n' +
'line 1 ling\n' +
'line 2,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f3 line,470.28,77.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1 line (Max: f1_1\n' +
'line),540.28,110.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F2: f2_1 line long line long\n' +
'line (Max of F1 is f1_1 line),540.28,143.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,long line very\n' +
'long line,470.28,176.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,475.28,55,70,44.5',
            'rect,405.28,55,70,44.5',
            'rect,405.28,99.5,140,33',
            'rect,405.28,132.5,140,33',
            'rect,475.28,165.5,70,33',
            'rect,405.28,165.5,70,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ] }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]], f1.groupIndex:0, f2.groupIndex 1 - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                {
                    caption: 'Band1 line',
                    columns: [
                        { dataField: 'f2', groupIndex: 1 },
                        {
                            caption: 'Band1_1 long line very long line',
                            columns: [
                                { dataField: 'f3', caption: 'f3  long line' },
                                { dataField: 'f4', caption: 'f4  long line very long line' }
                            ]
                        },
                        {
                            caption: 'Band1_2',
                            columns: [{ dataField: 'f5', caption: 'f5 long line very long line' }, 'f6']
                        },
                        {
                            caption: 'f7 long line very long linelong line very long linelong line very long linelong line very long line',
                            dataField: 'f7'
                        }
                    ]
                }
            ],
            dataSource: [{
                f1: 'f1_1 line',
                f2: 'f2_1 long line very long line',
                f3: 'f3_1',
                f4: 'f4_1 very long line very long line very long line',
                f5: 'f5_1 long line', f6: 'f6_1', f7: 'f7_1 line'
            }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 line,55,65.75,{baseline:middle}',
            'text,Band1_1 long line very long\n' +
'line,55,104.875,{baseline:middle}',
            'text,Band1_2,205,110.625,{baseline:middle}',
            'text,f7 long\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long line,335,87.25,{baseline:middle}',
            'text,f3  long line,55,184.625,{baseline:middle}',
            'text,f4  long line\n' +
'very long line,125,178.875,{baseline:middle}',
            'text,f5 long line\n' +
'very long\n' +
'line,205,173.125,{baseline:middle}',
            'text,F6,265,184.625,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1 line,55,235.25,{baseline:middle}',
            'text,F2: f2_1 long line very long line,55,256.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3_1,55,295.5,{baseline:middle}',
            'text,f4_1 very long\n' +
'line very long\n' +
'line very long\n' +
'line,125,278.25,{baseline:middle}',
            'text,f5_1 long\n' +
'line,205,289.75,{baseline:middle}',
            'text,f6_1,265,295.5,{baseline:middle}',
            'text,f7_1 line,335,295.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,330,21.5',
            'rect,50,76.5,150,68.25',
            'rect,200,76.5,130,68.25',
            'rect,330,76.5,50,148',
            'rect,50,144.75,70,79.75',
            'rect,120,144.75,80,79.75',
            'rect,200,144.75,60,79.75',
            'rect,260,144.75,70,79.75',
            'rect,50,224.5,330,21.5',
            'rect,50,246,330,21.5',
            'rect,50,267.5,70,56',
            'rect,120,267.5,80,56',
            'rect,200,267.5,60,56',
            'rect,260,267.5,70,56',
            'rect,330,267.5,50,56',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 10, y: 15 },
            columnWidths: [70, 80, 60, 70, 50]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]], f1.groupIndex:0, f2.groupIndex 1 - height auto, rtlEnabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions.hAlign = true;

        const dataGrid = createDataGrid({
            rtlEnabled: true,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                {
                    caption: 'Band1 line',
                    columns: [
                        { dataField: 'f2', groupIndex: 1 },
                        {
                            caption: 'Band1_1 long line very long line',
                            columns: [
                                { dataField: 'f3', caption: 'f3  long line' },
                                { dataField: 'f4', caption: 'f4  long line very long line' }
                            ]
                        },
                        {
                            caption: 'Band1_2',
                            columns: [{ dataField: 'f5', caption: 'f5 long line very long line' }, 'f6']
                        },
                        {
                            caption: 'f7 long line very long linelong line very long linelong line very long linelong line very long line',
                            dataField: 'f7'
                        }
                    ]
                }
            ],
            dataSource: [{
                f1: 'f1_1 line',
                f2: 'f2_1 long line very long line',
                f3: 'f3_1',
                f4: 'f4_1 very long line very long line very long line',
                f5: 'f5_1 long line', f6: 'f6_1', f7: 'f7_1 line'
            }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1 line,540.28,65.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Band1_1 long line very long\n' +
'line,540.28,104.875,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,Band1_2,390.28,110.625,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f7 long\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long\n' +
'linelong\n' +
'line very\n' +
'long line,260.28,87.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f3  long line,540.28,184.625,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f4  long line\n' +
'very long line,470.28,178.875,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f5 long line\n' +
'very long\n' +
'line,390.28,173.125,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F6,330.28,184.625,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1 line,540.28,235.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,F2: f2_1 long line very long line,540.28,256.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setFont,helvetica,normal,',
            'text,f3_1,540.28,295.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f4_1 very long\n' +
'line very long\n' +
'line very long\n' +
'line,470.28,278.25,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f5_1 long\n' +
'line,390.28,289.75,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f6_1,330.28,295.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'text,f7_1 line,260.28,295.5,{baseline:middle,align:right,isInputVisual:false,isOutputVisual:true,isInputRtl:true,isOutputRtl:false}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,215.28,55,330,21.5',
            'rect,395.28,76.5,150,68.25',
            'rect,265.28,76.5,130,68.25',
            'rect,215.28,76.5,50,148',
            'rect,475.28,144.75,70,79.75',
            'rect,395.28,144.75,80,79.75',
            'rect,335.28,144.75,60,79.75',
            'rect,265.28,144.75,70,79.75',
            'rect,215.28,224.5,330,21.5',
            'rect,215.28,246,330,21.5',
            'rect,475.28,267.5,70,56',
            'rect,395.28,267.5,80,56',
            'rect,335.28,267.5,60,56',
            'rect,265.28,267.5,70,56',
            'rect,215.28,267.5,50,56',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 10, y: 15 },
            columnWidths: [70, 80, 60, 70, 50]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});

QUnit.module('Performance', moduleConfig, () => {
    QUnit.test('very long text, wordWrap disabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        let longText = 'AAAAAAAAAAAAAAAAAAAAAAAAAAA';
        for(let i = 0; i <= 10; i++) { longText += longText; }
        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ dataField: 'f1' }],
            dataSource: [ { f1: longText } ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,45,50.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,AAAAAAAAAAAA...,45,72.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,100,21.5',
            'rect,40,61.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({
            jsPDFDocument: doc,
            component: dataGrid,
            columnWidths: [100]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('very long text, wordWrap enabled', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        let longText = 'AAAAAAAAAAAAAAAAAAAAAAAAAAA';
        for(let i = 0; i <= 10; i++) { longText += longText; }
        const dataGrid = createDataGrid({
            wordWrapEnabled: true,
            columns: [{ dataField: 'f1' }],
            dataSource: [ { f1: longText } ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,45,50.75,{baseline:middle}',
            'setTextColor,#000000',
            'deleted text',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,100,21.5',
            'rect,40,61.5,100,734.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,45,50.75,{baseline:middle}',
            'setTextColor,#000000',
            'deleted text',
            'rect,40,40,100,21.5',
            'rect,40,61.5,100,734.5',
            'addPage,'
        ];

        exportDataGrid({
            jsPDFDocument: doc,
            component: dataGrid,
            columnWidths: [100]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            doc.__log.splice(4, 1, 'deleted text'); // remove very long text
            doc.__log.splice(13, 1, 'deleted text'); // remove very long text
            doc.__log.splice(17);
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
