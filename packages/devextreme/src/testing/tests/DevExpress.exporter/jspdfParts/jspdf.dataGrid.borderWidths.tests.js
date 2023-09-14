import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Styles - Border widths', moduleConfig, () => {
    QUnit.test('[{f1, f2, f3] - rowType = header, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
            ],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'header') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'text,F2,145,65.75,',
            'text,F3,225,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'text,f1_3,225,87.25,',
            'setLineWidth,1.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'rect,220,55,90,21.5',
            'setLineWidth,0.5',
            'rect,50,76.5,90,21.5',
            'rect,140,76.5,80,21.5',
            'rect,220,76.5,90,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, f2, f3] - rowType = header, cells[0,1] borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
            ],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'header' && pdfCell.text === 'F2') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'text,F2,145,65.75,',
            'text,F3,225,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'text,f1_3,225,87.25,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'setLineWidth,1.5',
            'rect,140,55,80,21.5',
            'setLineWidth,0.5',
            'rect,220,55,90,21.5',
            'rect,50,76.5,90,21.5',
            'rect,140,76.5,80,21.5',
            'rect,220,76.5,90,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, f2, f3] - rowType = data, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
            ],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'data') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'text,F2,145,65.75,',
            'text,F3,225,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'text,f1_3,225,87.25,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'rect,220,55,90,21.5',
            'setLineWidth,1.5',
            'rect,50,76.5,90,21.5',
            'rect,140,76.5,80,21.5',
            'rect,220,76.5,90,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, f2, f3] - rowType = data, cells[1,1] borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
            ],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'data' && pdfCell.text === 'f1_2') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'text,F2,145,65.75,',
            'text,F3,225,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'text,f1_3,225,87.25,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'rect,220,55,90,21.5',
            'rect,50,76.5,90,21.5',
            'setLineWidth,1.5',
            'rect,140,76.5,80,21.5',
            'setLineWidth,0.5',
            'rect,220,76.5,90,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, f2, f3] - cells[1,1] without borders - rowType = data, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3' },
            ],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(pdfCell.text === 'f1_2') {
                pdfCell.drawLeftBorder = false;
                pdfCell.drawTopBorder = false;
                pdfCell.drawRightBorder = false;
                pdfCell.drawBottomBorder = false;
            }
            if(gridCell.rowType === 'data') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'text,F2,145,65.75,',
            'text,F3,225,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'text,f1_3,225,87.25,',
            'text,f2_1,55,108.75,',
            'text,f2_2,145,108.75,',
            'text,f2_3,225,108.75,',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'line,140,55,220,55',
            'line,140,55,140,76.5',
            'line,220,55,220,76.5',
            'rect,220,55,90,21.5',
            'setLineWidth,1.5',
            'line,50,76.5,140,76.5',
            'line,50,76.5,50,98',
            'line,50,98,140,98',
            'line,220,76.5,310,76.5',
            'line,310,76.5,310,98',
            'line,220,98,310,98',
            'rect,50,98,90,21.5',
            'line,140,98,140,119.5',
            'line,220,98,220,119.5',
            'line,140,119.5,220,119.5',
            'rect,220,98,90,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80, 90 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3] - rowType = group, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

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

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'group') {
                pdfCell.borderWidth = 1.5;
            }
        };

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
            'setLineWidth,1.5',
            'rect,50,76.5,170,21.5',
            'setLineWidth,0.5',
            'rect,50,98,90,21.5',
            'rect,140,98,80,21.5',
            'rect,50,119.5,90,21.5',
            'rect,140,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3] - rowType = group, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
                { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3' },
            ],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'group') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_2,55,108.75,{baseline:middle}',
            'text,f1_3,145,108.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F1: f2_1,55,130.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_2,55,151.75,{baseline:middle}',
            'text,f2_3,145,151.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'setLineWidth,1.5',
            'rect,50,76.5,170,21.5',
            'setLineWidth,0.5',
            'rect,50,98,90,21.5',
            'rect,140,98,80,21.5',
            'setLineWidth,1.5',
            'rect,50,119.5,170,21.5',
            'setLineWidth,0.5',
            'rect,50,141,90,21.5',
            'rect,140,141,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - rowType = group, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 1 },
                { dataField: 'f3' },
                { dataField: 'f4' },
            ],
            dataSource: [
                { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4' },
                { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4' },
            ],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'group') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'text,F2: f2,55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_3,55,130.25,{baseline:middle}',
            'text,f1_4,145,130.25,{baseline:middle}',
            'text,f2_3,55,151.75,{baseline:middle}',
            'text,f2_4,145,151.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'setLineWidth,1.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'setLineWidth,0.5',
            'rect,50,119.5,90,21.5',
            'rect,140,119.5,80,21.5',
            'rect,50,141,90,21.5',
            'rect,140,141,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - rowType = group, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 1 },
                { dataField: 'f3' },
                { dataField: 'f4' },
            ],
            dataSource: [
                { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' },
                { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4' },
            ],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'group') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'text,F2: f1_2,55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_3,55,130.25,{baseline:middle}',
            'text,f1_4,145,130.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F2: f2_2,55,151.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_3,55,173.25,{baseline:middle}',
            'text,f2_4,145,173.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,21.5',
            'rect,140,55,80,21.5',
            'setLineWidth,1.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'setLineWidth,0.5',
            'rect,50,119.5,90,21.5',
            'rect,140,119.5,80,21.5',
            'setLineWidth,1.5',
            'rect,50,141,170,21.5',
            'setLineWidth,0.5',
            'rect,50,162.5,90,21.5',
            'rect,140,162.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, {f3, alignByColumn }, { f4, alignByColumn }] - rowType = group, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f3', summaryType: 'max', alignByColumn: true },
                    { column: 'f4', summaryType: 'max', alignByColumn: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'group') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,135,65.75,{baseline:middle}',
            'text,F4,225,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f...,55,87.25,{baseline:middle}',
            'text,Max: f3,135,87.25,{baseline:middle}',
            'text,Max: f4,225,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,135,108.75,{baseline:middle}',
            'text,f4,225,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,220,55,80,21.5',
            'setLineWidth,1.5',
            'line,50,76.5,130,76.5',
            'line,50,76.5,50,98',
            'line,50,98,130,98',
            'line,130,76.5,220,76.5',
            'line,130,98,220,98',
            'line,220,76.5,300,76.5',
            'line,300,76.5,300,98',
            'line,220,98,300,98',
            'setLineWidth,0.5',
            'rect,50,98,80,21.5',
            'rect,130,98,90,21.5',
            'rect,220,98,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}, {f4, alignByColumn, showInGroupFooter}] - rowType = groupFooter, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                groupItems: [
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true },
                    { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'groupFooter') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,135,65.75,{baseline:middle}',
            'text,F4,225,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,135,108.75,{baseline:middle}',
            'text,f4,225,108.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,135,130.25,{baseline:middle}',
            'text,Max: f4,225,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,220,55,80,21.5',
            'rect,50,76.5,250,21.5',
            'rect,50,98,80,21.5',
            'rect,130,98,90,21.5',
            'rect,220,98,80,21.5',
            'setLineWidth,1.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'rect,220,119.5,80,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, {f3, groupIndex: 2}, f4, f5], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}, {f5, alignByColumn, showInGroupFooter}], 2 groups - rowType = groupFooter, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 1 },
                { dataField: 'f3', groupIndex: 2 },
                { dataField: 'f4' },
                { dataField: 'f5' }
            ],
            summary: {
                groupItems: [
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true },
                    { column: 'f5', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1', f5: 'f5_1' }, { f1: 'f1', f2: 'f2_2', f3: 'f3_2', f4: 'f4_2', f5: 'f5_2' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'groupFooter') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F4,55,65.75,{baseline:middle}',
            'text,F5,305,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'text,F2: f2_1 (Max of F1 is f1),55,108.75,{baseline:middle}',
            'text,F3: f3_1 (Max of F1 is f1),55,130.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f4_1,55,151.75,{baseline:middle}',
            'text,f5_1,305,151.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4_1,55,173.25,{baseline:middle}',
            'text,Max: f5_1,305,173.25,{baseline:middle}',
            'text,Max: f4_1,55,194.75,{baseline:middle}',
            'text,Max: f5_1,305,194.75,{baseline:middle}',
            'text,F2: f2_2 (Max of F1 is f1),55,216.25,{baseline:middle}',
            'text,F3: f3_2 (Max of F1 is f1),55,237.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f4_2,55,259.25,{baseline:middle}',
            'text,f5_2,305,259.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4_2,55,280.75,{baseline:middle}',
            'text,Max: f5_2,305,280.75,{baseline:middle}',
            'text,Max: f4_2,55,302.25,{baseline:middle}',
            'text,Max: f5_2,305,302.25,{baseline:middle}',
            'text,Max: f4_2,55,323.75,{baseline:middle}',
            'text,Max: f5_2,305,323.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,21.5',
            'rect,300,55,100,21.5',
            'rect,50,76.5,350,21.5',
            'rect,50,98,350,21.5',
            'rect,50,119.5,350,21.5',
            'rect,50,141,250,21.5',
            'rect,300,141,100,21.5',
            'setLineWidth,1.5',
            'rect,50,162.5,250,21.5',
            'rect,300,162.5,100,21.5',
            'rect,50,184,250,21.5',
            'rect,300,184,100,21.5',
            'setLineWidth,0.5',
            'rect,50,205.5,350,21.5',
            'rect,50,227,350,21.5',
            'rect,50,248.5,250,21.5',
            'rect,300,248.5,100,21.5',
            'setLineWidth,1.5',
            'rect,50,270,250,21.5',
            'rect,300,270,100,21.5',
            'rect,50,291.5,250,21.5',
            'rect,300,291.5,100,21.5',
            'rect,50,313,250,21.5',
            'rect,300,313,100,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3], totalItems: [f2] - rowType = totalFooter, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' }
            ],
            summary: {
                totalItems: [
                    { column: 'f2', summaryType: 'max' }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'totalFooter') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,135,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,135,108.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f2,55,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,80,21.5',
            'rect,130,98,90,21.5',
            'setLineWidth,1.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3], groupItems: [{f2, alignByColumn, showInGroupFooter}], totalItems: [f2] - rowType = groupFooter & totalFooter, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' }
            ],
            summary: {
                groupItems: [
                    { column: 'f2', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ],
                totalItems: [
                    { column: 'f2', summaryType: 'max' }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'groupFooter' || gridCell.rowType === 'totalFooter') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,135,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,135,108.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f2,55,130.25,{baseline:middle}',
            'text,Max: f2,55,151.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,80,21.5',
            'rect,130,98,90,21.5',
            'setLineWidth,1.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'rect,50,141,80,21.5',
            'rect,130,141,90,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], totalItems: [f3] - rowType = totalFooter, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 1 },
                { dataField: 'f3' },
                { dataField: 'f4' }
            ],
            summary: {
                totalItems: [
                    { column: 'f3', summaryType: 'max' }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'totalFooter') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,135,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'text,F2: f2,55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,135,130.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,151.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'setLineWidth,1.5',
            'rect,50,141,80,21.5',
            'rect,130,141,90,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3] - rowType = groupFooter & totalFooter, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
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
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'groupFooter' || gridCell.rowType === 'totalFooter') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,135,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'text,F2: f2,55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,135,130.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,151.75,{baseline:middle}',
            'text,Max: f3,55,173.25,{baseline:middle}',
            'text,Max: f3,55,194.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'setLineWidth,1.5',
            'rect,50,141,80,21.5',
            'rect,130,141,90,21.5',
            'rect,50,162.5,80,21.5',
            'rect,130,162.5,90,21.5',
            'rect,50,184,80,21.5',
            'rect,130,184,90,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1]] - rowType = header, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [ 'f1', ]
                }
            ],
            dataSource: [{ f1: 'f1_1' }],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'header') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F1,55,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'setLineWidth,1.5',
            'setDrawColor,#979797',
            'rect,50,55,100,21.5',
            'rect,50,76.5,100,21.5',
            'setLineWidth,0.5',
            'rect,50,98,100,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2], f3] - rowType = header, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1', columns: [ 'f1', 'f2', ] },
                'f3'
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'header') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F3,195,76.5,{baseline:middle}',
            'text,F1,55,87.25,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'text,f3_1,195,108.75,{baseline:middle}',
            'setLineWidth,1.5',
            'setDrawColor,#979797',
            'rect,50,55,140,21.5',
            'rect,190,55,60,43',
            'rect,50,76.5,70,21.5',
            'rect,120,76.5,70,21.5',
            'setLineWidth,0.5',
            'rect,50,98,70,21.5',
            'rect,120,98,70,21.5',
            'rect,190,98,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 60 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2,f3], f4] - rowType = header, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2', 'f3' ] },
                'f4'
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1', f4: 'f4_1' }],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'header') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,76.5,{baseline:middle}',
            'text,Band2,125,65.75,{baseline:middle}',
            'text,F4,265,76.5,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'text,F3,205,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'text,f3_1,205,108.75,{baseline:middle}',
            'text,f4_1,265,108.75,{baseline:middle}',
            'setLineWidth,1.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,140,21.5',
            'rect,260,55,70,43',
            'rect,120,76.5,80,21.5',
            'rect,200,76.5,60,21.5',
            'setLineWidth,0.5',
            'rect,50,98,70,21.5',
            'rect,120,98,80,21.5',
            'rect,200,98,60,21.5',
            'rect,260,98,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[band1_1-[f1, f2], f3]] - rowType = header, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

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

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'header') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,Band1_1,55,87.25,{baseline:middle}',
            'text,F3,185,98,{baseline:middle}',
            'text,F1,55,108.75,{baseline:middle}',
            'text,F2,115,108.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,55,130.25,{baseline:middle}',
            'text,f2_1_1,115,130.25,{baseline:middle}',
            'text,f3_1,185,130.25,{baseline:middle}',
            'setLineWidth,1.5',
            'setDrawColor,#979797',
            'rect,50,55,210,21.5',
            'rect,50,76.5,130,21.5',
            'rect,180,76.5,80,43',
            'rect,50,98,60,21.5',
            'rect,110,98,70,21.5',
            'setLineWidth,0.5',
            'rect,50,119.5,60,21.5',
            'rect,110,119.5,70,21.5',
            'rect,180,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, band1_2-[f2]]] - rowType = header, borderWidth = 1.5', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        'f1',
                        { caption: 'Band1_2', columns: [ 'f2' ] }
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1_1' }],
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'header') {
                pdfCell.borderWidth = 1.5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F1,55,98,{baseline:middle}',
            'text,Band1_2,115,87.25,{baseline:middle}',
            'text,F2,115,108.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,130.25,{baseline:middle}',
            'text,f2_1_1,115,130.25,{baseline:middle}',
            'setLineWidth,1.5',
            'setDrawColor,#979797',
            'rect,50,55,130,21.5',
            'rect,50,76.5,60,43',
            'rect,110,76.5,70,21.5',
            'rect,110,98,70,21.5',
            'setLineWidth,0.5',
            'rect,50,119.5,60,21.5',
            'rect,110,119.5,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
