import $ from 'jquery';
import 'ui/data_grid';
import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdfParts/v3/jspdf_v3.dataGrid_utils.js';

import { JSPdfMultilineTests } from './jspdfParts/v3/jspdf_v3.dataGrid.multiline.tests.js';
import { JSPdfWordWrapTests } from './jspdfParts/v3/jspdf_v3.dataGrid.wordwrap.tests.js';
import { JSPdfStylesTests } from './jspdfParts/v3/jspdf_v3.dataGrid.styles.tests.js';
import { JSPdfBorderColorsTests } from './jspdfParts/v3/jspdf_v3.dataGrid.borderColors.tests.js';
import { JSPdfBorderWidthsTests } from './jspdfParts/v3/jspdf_v3.dataGrid.borderWidths.tests.js';
import { JSPdfBandsTests } from './jspdfParts/v3/jspdf_v3.dataGrid.bands.tests.js';

import 'generic_light.css!';

QUnit.testStart(() => {
    const markup = '<div id="dataGrid"></div>';
    $('#qunit-fixture').html(markup);
});

QUnit.module('Table', moduleConfig, () => {

    QUnit.test('Required arguments', function(assert) {
        // TODO
        assert.ok(true);
    });

    QUnit.test('Empty', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({});

        const expectedLog = [
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,0,0',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const customizeCell = () => {
            assert.fail('customizeCell should not be called');
        };
        const onRowExporting = () => {
            assert.fail('onRowExporting should not be called');
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding.left', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { left: 5 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding.top', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { top: 5 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,67.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding.right', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { right: 5 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,65,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - padding.bottom', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { bottom: 5 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,62.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65.75,{baseline:middle}',
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

    QUnit.test('1 col - height auto, padding.left', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { left: 5 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,11.5',
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

    QUnit.test('1 col - height auto, padding.top', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { top: 5 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,16.5',
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

    QUnit.test('1 col - height auto, padding.right', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { right: 5 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,11.5',
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

    QUnit.test('1 col - height auto, padding.bottom', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.padding = { bottom: 5 };
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,50,60.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,16.5',
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

    QUnit.test('1 col - hide all borders', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }]
        });

        const customizeCell = ({ pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };
        const onRowExporting = (e) => {
            e.rowHeight = 20;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65,{baseline:middle}',
            'setFontSize,16',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell, onRowExporting, drawTableBorder: false }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 20;
            } else {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,87,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,20',
            'rect,50,75,100,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 row - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1' }],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 rows', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v1_2' }]
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,16',
            'rect,50,71,100,20',
            'rect,50,91,100,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 rows - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v1_2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,87.25,{baseline:middle}',
            'text,v1_2,55,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'rect,50,98,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 2 rows - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1' }, { f1: 'v1_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = 5;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,87.25,{baseline:middle}',
            'text,v1_2,55,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'rect,50,98,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }, { caption: 'f2' }]
        });

        const onRowExporting = (e) => {
            e.rowHeight = 16;
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,63,{baseline:middle}',
            'text,f2,95,63,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'rect,90,55,60,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }, { caption: 'f2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,65.75,{baseline:middle}',
            'text,f2,95,65.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,21.5',
            'rect,90,55,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - height auto, columns with different paddings', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [{ caption: 'f1' }, { caption: 'f2' }]
        });

        const paddingMap = [ 5, 10 ];
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = paddingMap[gridCell.column.index];
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,f1,55,70.75,{baseline:middle}',
            'text,f2,100,70.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,31.5',
            'rect,90,55,60,31.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 1 row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1', f2: 'v2' }]
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1') {
                e.rowHeight = 20;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,81,{baseline:middle}',
            'text,v2,95,81,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'rect,90,55,60,16',
            'rect,50,71,40,20',
            'rect,90,71,60,20',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 1 row - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1', f2: 'v2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'text,F2,95,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,87.25,{baseline:middle}',
            'text,v2,95,87.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,21.5',
            'rect,90,55,60,21.5',
            'rect,50,76.5,40,21.5',
            'rect,90,76.5,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 1 row - height auto, columns with different paddings', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1', f2: 'v2' }]
        });

        const paddingMap = [ 5, 10 ];
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = paddingMap[gridCell.column.index];
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,70.75,{baseline:middle}',
            'text,F2,100,70.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1,55,102.25,{baseline:middle}',
            'text,v2,100,102.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,31.5',
            'rect,90,55,60,31.5',
            'rect,50,86.5,40,31.5',
            'rect,90,86.5,60,31.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 2 rows', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'text,F2,95,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'rect,90,55,60,16',
            'rect,50,71,40,20',
            'rect,90,71,60,20',
            'rect,50,91,40,24',
            'rect,90,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 2 rows - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,{baseline:middle}',
            'text,F2,95,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,87.25,{baseline:middle}',
            'text,v2_1,95,87.25,{baseline:middle}',
            'text,v1_2,55,108.75,{baseline:middle}',
            'text,v2_2,95,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,21.5',
            'rect,90,55,60,21.5',
            'rect,50,76.5,40,21.5',
            'rect,90,76.5,60,21.5',
            'rect,50,98,40,21.5',
            'rect,90,98,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], onRowExporting: () => {} }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 2 rows - height auto, columns with different paddings', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
        });

        const paddingMap = [ 5, 10 ];
        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.padding = paddingMap[gridCell.column.index];
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,70.75,{baseline:middle}',
            'text,F2,100,70.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,102.25,{baseline:middle}',
            'text,v2_1,100,102.25,{baseline:middle}',
            'text,v1_2,55,133.75,{baseline:middle}',
            'text,v2_2,100,133.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,31.5',
            'rect,90,55,60,31.5',
            'rect,50,86.5,40,31.5',
            'rect,90,86.5,60,31.5',
            'rect,50,118,40,31.5',
            'rect,90,118,60,31.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 60 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 cols - 2 rows - column[0] width is zero', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,...,55,63,{baseline:middle}',
            'text,F2,55,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,...,55,81,{baseline:middle}',
            'text,v2_1,55,81,{baseline:middle}',
            'text,...,55,103,{baseline:middle}',
            'text,v2_2,55,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,0,16',
            'rect,50,55,100,16',
            'rect,50,71,0,20',
            'rect,50,71,100,20',
            'rect,50,91,0,24',
            'rect,50,91,100,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 0, 100 ], onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide left border of [1,1] cell', function(assert) {
        // TODO:
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawLeftBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'text,F2,95,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'rect,90,55,50,16',
            'rect,140,55,60,16',
            'line,50,71,90,71',
            'line,50,71,50,91',
            'line,50,91,90,91',
            'line,90,71,140,71',
            'line,140,71,140,91',
            'line,90,91,140,91',
            'rect,140,71,60,20',
            'rect,50,91,40,24',
            'rect,90,91,50,24',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide right border of [1,1] cell', function(assert) {
        // TODO:
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawRightBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'text,F2,95,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'rect,90,55,50,16',
            'rect,140,55,60,16',
            'rect,50,71,40,20',
            'line,90,71,140,71',
            'line,90,71,90,91',
            'line,90,91,140,91',
            'line,140,71,200,71',
            'line,200,71,200,91',
            'line,140,91,200,91',
            'rect,50,91,40,24',
            'rect,90,91,50,24',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide top border of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawTopBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'text,F2,95,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'line,90,55,140,55',
            'line,90,55,90,71',
            'line,140,55,140,71',
            'rect,140,55,60,16',
            'rect,50,71,40,20',
            'line,90,71,90,91',
            'line,140,71,140,91',
            'line,90,91,140,91',
            'rect,140,71,60,20',
            'rect,50,91,40,24',
            'rect,90,91,50,24',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide bottom border of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawBottomBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'text,F2,95,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'rect,90,55,50,16',
            'rect,140,55,60,16',
            'rect,50,71,40,20',
            'line,90,71,140,71',
            'line,90,71,90,91',
            'line,140,71,140,91',
            'rect,140,71,60,20',
            'rect,50,91,40,24',
            'line,90,91,90,115',
            'line,140,91,140,115',
            'line,90,115,140,115',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide all borders of [1,1] cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.value === 'v2_1') {
                pdfCell.drawLeftBorder = false;
                pdfCell.drawRightBorder = false;
                pdfCell.drawTopBorder = false;
                pdfCell.drawBottomBorder = false;
            }
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'text,F2,95,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,40,16',
            'line,90,55,140,55',
            'line,90,55,90,71',
            'line,140,55,140,71',
            'rect,140,55,60,16',
            'line,50,71,90,71',
            'line,50,71,50,91',
            'line,50,91,90,91',
            'line,140,71,200,71',
            'line,200,71,200,91',
            'line,140,91,200,91',
            'rect,50,91,40,24',
            'line,90,91,90,115',
            'line,140,91,140,115',
            'line,90,115,140,115',
            'rect,140,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('3 cols - 2 rows - hide all borders', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            dataSource: [{ f1: 'v1_1', f2: 'v2_1', f3: 'v3_1' }, { f1: 'v1_2', f2: 'v2_2', f3: 'v3_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
        };
        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'v1_1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'v1_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'text,F2,95,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,55,81,{baseline:middle}',
            'text,v2_1,95,81,{baseline:middle}',
            'text,v3_1,145,81,{baseline:middle}',
            'text,v1_2,55,103,{baseline:middle}',
            'text,v2_2,95,103,{baseline:middle}',
            'text,v3_2,145,103,{baseline:middle}',
            'setFontSize,16'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 40, 50, 60 ], customizeCell, onRowExporting }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});

JSPdfMultilineTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfWordWrapTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfStylesTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfBorderColorsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfBorderWidthsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
JSPdfBandsTests.runTests(moduleConfig, createMockPdfDoc, createDataGrid);
