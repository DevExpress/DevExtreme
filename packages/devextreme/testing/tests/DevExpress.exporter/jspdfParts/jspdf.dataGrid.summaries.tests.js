import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';


const onRowExporting = (e) => { e.rowHeight = 16; };

QUnit.module('Grouped rows with summaries', moduleConfig, () => {

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1]', function(assert) {
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
                groupItems: [ { column: 'f1', summaryType: 'max' } ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'text,F4,225,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'text,f4,225,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,220,55,80,16',
            'rect,50,71,250,16',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,220,87,80,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1] - height auto', function(assert) {
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
                groupItems: [ { column: 'f1', summaryType: 'max' } ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,135,65.75,{baseline:middle}',
            'text,F4,225,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,135,108.75,{baseline:middle}',
            'text,f4,225,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,220,55,80,21.5',
            'rect,50,76.5,250,21.5',
            'rect,50,98,80,21.5',
            'rect,130,98,90,21.5',
            'rect,220,98,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, f2]', function(assert) {
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
                    { column: 'f2', summaryType: 'max' }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'text,F4,225,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1, Max of F2 is f2),55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'text,f4,225,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,220,55,80,16',
            'rect,50,71,250,16',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,220,87,80,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn }]', function(assert) {
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
                    { column: 'f3', summaryType: 'max', alignByColumn: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,205,63,{baseline:middle}',
            'text,F4,295,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,Max: f3,205,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,205,95,{baseline:middle}',
            'text,f4,295,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,16',
            'rect,200,55,90,16',
            'rect,290,55,80,16',
            'line,50,71,200,71',
            'line,50,71,50,87',
            'line,50,87,200,87',
            'line,200,71,290,71',
            'line,200,87,290,87',
            'line,290,71,370,71',
            'line,370,71,370,87',
            'line,290,87,370,87',
            'rect,50,87,150,16',
            'rect,200,87,90,16',
            'rect,290,87,80,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, padding }] - height auto', function(assert) {
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
                    { column: 'f3', summaryType: 'max', alignByColumn: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'group' && gridCell.column.dataField === 'f3') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,205,65.75,{baseline:middle}',
            'text,F4,295,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'text,Max: f3,205,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,205,108.75,{baseline:middle}',
            'text,f4,295,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,21.5',
            'rect,200,55,90,21.5',
            'rect,290,55,80,21.5',
            'line,50,76.5,200,76.5',
            'line,50,76.5,50,98',
            'line,50,98,200,98',
            'line,200,76.5,290,76.5',
            'line,200,98,290,98',
            'line,290,76.5,370,76.5',
            'line,370,76.5,370,98',
            'line,290,98,370,98',
            'rect,50,98,150,21.5',
            'rect,200,98,90,21.5',
            'rect,290,98,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn }, { f4, alignByColumn }]', function(assert) {
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

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,205,63,{baseline:middle}',
            'text,F4,295,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,Max: f3,205,79,{baseline:middle}',
            'text,Max: f4,295,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,205,95,{baseline:middle}',
            'text,f4,295,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,16',
            'rect,200,55,90,16',
            'rect,290,55,80,16',
            'line,50,71,200,71',
            'line,50,71,50,87',
            'line,50,87,200,87',
            'line,200,71,290,71',
            'line,200,87,290,87',
            'line,290,71,370,71',
            'line,370,71,370,87',
            'line,290,87,370,87',
            'rect,50,87,150,16',
            'rect,200,87,90,16',
            'rect,290,87,80,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, padding }, { f4, alignByColumn, padding }] - height auto', function(assert) {
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
            if(gridCell.rowType === 'group' && (gridCell.column.dataField === 'f3' || gridCell.column.dataField === 'f4')) {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,205,65.75,{baseline:middle}',
            'text,F4,295,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'text,Max: f3,205,87.25,{baseline:middle}',
            'text,Max: f4,295,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,205,108.75,{baseline:middle}',
            'text,f4,295,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,21.5',
            'rect,200,55,90,21.5',
            'rect,290,55,80,21.5',
            'line,50,76.5,200,76.5',
            'line,50,76.5,50,98',
            'line,50,98,200,98',
            'line,200,76.5,290,76.5',
            'line,200,98,290,98',
            'line,290,76.5,370,76.5',
            'line,370,76.5,370,98',
            'line,290,98,370,98',
            'rect,50,98,150,21.5',
            'rect,200,98,90,21.5',
            'rect,290,98,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f4, alignByColumn }]', function(assert) {
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
                    { column: 'f4', summaryType: 'max', alignByColumn: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,205,63,{baseline:middle}',
            'text,F4,295,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,Max: f4,295,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,205,95,{baseline:middle}',
            'text,f4,295,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,16',
            'rect,200,55,90,16',
            'rect,290,55,80,16',
            'rect,50,71,240,16',
            'line,290,71,370,71',
            'line,370,71,370,87',
            'line,290,87,370,87',
            'rect,50,87,150,16',
            'rect,200,87,90,16',
            'rect,290,87,80,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f4, alignByColumn, padding }] - height auto', function(assert) {
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
                    { column: 'f4', summaryType: 'max', alignByColumn: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'group' && gridCell.column.dataField === 'f4') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,205,65.75,{baseline:middle}',
            'text,F4,295,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'text,Max: f4,295,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,205,108.75,{baseline:middle}',
            'text,f4,295,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,21.5',
            'rect,200,55,90,21.5',
            'rect,290,55,80,21.5',
            'rect,50,76.5,240,21.5',
            'line,290,76.5,370,76.5',
            'line,370,76.5,370,98',
            'line,290,98,370,98',
            'rect,50,98,150,21.5',
            'rect,200,98,90,21.5',
            'rect,290,98,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f3]', function(assert) {
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
                groupItems: [ { column: 'f2', summaryType: 'max' } ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'text,F4,225,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max of F2 is f2),55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'text,f4,225,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,220,55,80,16',
            'rect,50,71,250,16',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,220,87,80,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn}]', function(assert) {
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
                groupItems: [ { column: 'f3', summaryType: 'max', alignByColumn: true } ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'text,F4,225,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'text,Max: f3,135,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'text,f4,225,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,220,55,80,16',
            'line,50,71,130,71',
            'line,50,71,50,87',
            'line,50,87,130,87',
            'line,130,71,220,71',
            'line,130,87,220,87',
            'line,220,71,300,71',
            'line,300,71,300,87',
            'line,220,87,300,87',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,220,87,80,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn}, {f4, alignByColumn}]', function(assert) {
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
                    { column: 'f3', summaryType: 'max', alignByColumn: true },
                    { column: 'f4', summaryType: 'max', alignByColumn: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'text,F4,225,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'text,Max: f3,135,79,{baseline:middle}',
            'text,Max: f4,225,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'text,f4,225,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,220,55,80,16',
            'line,50,71,130,71',
            'line,50,71,50,87',
            'line,50,87,130,87',
            'line,130,71,220,71',
            'line,130,87,220,87',
            'line,220,71,300,71',
            'line,300,71,300,87',
            'line,220,87,300,87',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,220,87,80,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f4, alignByColumn]', function(assert) {
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
                groupItems: [ { column: 'f4', summaryType: 'max', alignByColumn: true } ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'text,F4,225,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'text,Max: f4,225,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'text,f4,225,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,220,55,80,16',
            'rect,50,71,170,16',
            'line,220,71,300,71',
            'line,300,71,300,87',
            'line,220,87,300,87',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,220,87,80,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1, f3, f4], groupItems: [f1, {f4, alignByColumn}]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
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
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,305,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,Max: f4,305,79,{baseline:middle}',
            'text,F2: f2 (Max of F1 is f1),55,95,{baseline:middle}',
            'text,Max: f4,305,95,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,111,{baseline:middle}',
            'text,f4,305,111,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,16',
            'rect,300,55,100,16',
            'line,50,71,300,71',
            'line,50,71,50,87',
            'line,50,87,300,87',
            'line,300,71,400,71',
            'line,400,71,400,87',
            'line,300,87,400,87',
            'line,50,87,300,87',
            'line,50,87,50,103',
            'line,50,103,300,103',
            'line,300,87,400,87',
            'line,400,87,400,103',
            'line,300,103,400,103',
            'rect,50,103,250,16',
            'rect,300,103,100,16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1, f3, f4], groupItems: [f1, {f4, alignByColumn}] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
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
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,305,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'text,Max: f4,305,87.25,{baseline:middle}',
            'text,F2: f2 (Max of F1 is f1),55,108.75,{baseline:middle}',
            'text,Max: f4,305,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,305,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,21.5',
            'rect,300,55,100,21.5',
            'line,50,76.5,300,76.5',
            'line,50,76.5,50,98',
            'line,50,98,300,98',
            'line,300,76.5,400,76.5',
            'line,400,76.5,400,98',
            'line,300,98,400,98',
            'line,50,98,300,98',
            'line,50,98,50,119.5',
            'line,50,119.5,300,119.5',
            'line,300,98,400,98',
            'line,400,98,400,119.5',
            'line,300,119.5,400,119.5',
            'rect,50,119.5,250,21.5',
            'rect,300,119.5,100,21.5',
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

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1, f3, f4], groupItems: [f1, {f4, alignByColumn, padding}] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
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
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'group' && gridCell.column.dataField === 'f4') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,305,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'text,Max: f4,305,87.25,{baseline:middle}',
            'text,F2: f2 (Max of F1 is f1),55,108.75,{baseline:middle}',
            'text,Max: f4,305,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,305,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,21.5',
            'rect,300,55,100,21.5',
            'line,50,76.5,300,76.5',
            'line,50,76.5,50,98',
            'line,50,98,300,98',
            'line,300,76.5,400,76.5',
            'line,400,76.5,400,98',
            'line,300,98,400,98',
            'line,50,98,300,98',
            'line,50,98,50,119.5',
            'line,50,119.5,300,119.5',
            'line,300,98,400,98',
            'line,400,98,400,119.5',
            'line,300,119.5,400,119.5',
            'rect,50,119.5,250,21.5',
            'rect,300,119.5,100,21.5',
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
});

QUnit.module('Grouped rows with summaries shown in group footer', moduleConfig, () => {

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, showInGroupFooter }]', function(assert) {
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
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,205,63,{baseline:middle}',
            'text,F4,295,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,205,95,{baseline:middle}',
            'text,f4,295,95,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,205,111,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,16',
            'rect,200,55,90,16',
            'rect,290,55,80,16',
            'rect,50,71,320,16',
            'rect,50,87,150,16',
            'rect,200,87,90,16',
            'rect,290,87,80,16',
            'rect,50,103,150,16',
            'rect,200,103,90,16',
            'rect,290,103,80,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, showInGroupFooter }] - height auto', function(assert) {
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
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,205,65.75,{baseline:middle}',
            'text,F4,295,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,205,108.75,{baseline:middle}',
            'text,f4,295,108.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,205,130.25,{baseline:middle}',
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

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, showInGroupFooter, padding }] - height auto', function(assert) {
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
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'groupFooter' && gridCell.column.dataField === 'f3') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,205,65.75,{baseline:middle}',
            'text,F4,295,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,108.75,{baseline:middle}',
            'text,f3,205,108.75,{baseline:middle}',
            'text,f4,295,108.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,205,130.25,{baseline:middle}',
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

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, showInGroupFooter }, { f4, alignByColumn, showInGroupFooter }]', function(assert) {
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
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true },
                    { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,205,63,{baseline:middle}',
            'text,F4,295,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,205,95,{baseline:middle}',
            'text,f4,295,95,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,205,111,{baseline:middle}',
            'text,Max: f4,295,111,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,16',
            'rect,200,55,90,16',
            'rect,290,55,80,16',
            'rect,50,71,320,16',
            'rect,50,87,150,16',
            'rect,200,87,90,16',
            'rect,290,87,80,16',
            'rect,50,103,150,16',
            'rect,200,103,90,16',
            'rect,290,103,80,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f4, alignByColumn, showInGroupFooter }]', function(assert) {
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
                    { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,205,63,{baseline:middle}',
            'text,F4,295,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,205,95,{baseline:middle}',
            'text,f4,295,95,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4,295,111,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,16',
            'rect,200,55,90,16',
            'rect,290,55,80,16',
            'rect,50,71,320,16',
            'rect,50,87,150,16',
            'rect,200,87,90,16',
            'rect,290,87,80,16',
            'rect,50,103,150,16',
            'rect,200,103,90,16',
            'rect,290,103,80,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}]', function(assert) {
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
                groupItems: [ { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true } ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'text,F4,225,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'text,f4,225,95,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,135,111,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,220,55,80,16',
            'rect,50,71,250,16',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,220,87,80,16',
            'rect,50,103,80,16',
            'rect,130,103,90,16',
            'rect,220,103,80,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}] - height auto', function(assert) {
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
                groupItems: [ { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true } ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,220,55,80,21.5',
            'rect,50,76.5,250,21.5',
            'rect,50,98,80,21.5',
            'rect,130,98,90,21.5',
            'rect,220,98,80,21.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'rect,220,119.5,80,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter, padding}] - height auto', function(assert) {
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
                groupItems: [ { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true } ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'groupFooter' && gridCell.column.dataField === 'f3') {
                pdfCell.padding = 5;
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,220,55,80,21.5',
            'rect,50,76.5,250,21.5',
            'rect,50,98,80,21.5',
            'rect,130,98,90,21.5',
            'rect,220,98,80,21.5',
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

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}, {f4, alignByColumn, showInGroupFooter}]', function(assert) {
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

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'text,F4,225,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'text,f4,225,95,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,135,111,{baseline:middle}',
            'text,Max: f4,225,111,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,220,55,80,16',
            'rect,50,71,250,16',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,220,87,80,16',
            'rect,50,103,80,16',
            'rect,130,103,90,16',
            'rect,220,103,80,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f4, alignByColumn, showInGroupFooter}]', function(assert) {
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
                groupItems: [ { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true } ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'text,F4,225,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'text,f4,225,95,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4,225,111,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,220,55,80,16',
            'rect,50,71,250,16',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,220,87,80,16',
            'rect,50,103,80,16',
            'rect,130,103,90,16',
            'rect,220,103,80,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}]', function(assert) {
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
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,305,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,F2: f2 (Max of F1 is f1),55,95,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,111,{baseline:middle}',
            'text,f4,305,111,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4,305,127,{baseline:middle}',
            'text,Max: f4,305,143,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,16',
            'rect,300,55,100,16',
            'rect,50,71,350,16',
            'rect,50,87,350,16',
            'rect,50,103,250,16',
            'rect,300,103,100,16',
            'rect,50,119,250,16',
            'rect,300,119,100,16',
            'rect,50,135,250,16',
            'rect,300,135,100,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}] - height auto', function(assert) {
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
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,305,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'text,F2: f2 (Max of F1 is f1),55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,305,130.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4,305,151.75,{baseline:middle}',
            'text,Max: f4,305,173.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,21.5',
            'rect,300,55,100,21.5',
            'rect,50,76.5,350,21.5',
            'rect,50,98,350,21.5',
            'rect,50,119.5,250,21.5',
            'rect,300,119.5,100,21.5',
            'rect,50,141,250,21.5',
            'rect,300,141,100,21.5',
            'rect,50,162.5,250,21.5',
            'rect,300,162.5,100,21.5',
            'setFont,helvetica,normal,',
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

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f4, alignByColumn, showInGroupFooter, padding}] - height auto', function(assert) {
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
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'groupFooter' && gridCell.column.dataField === 'f4') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,305,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,87.25,{baseline:middle}',
            'text,F2: f2 (Max of F1 is f1),55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,305,130.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4,305,151.75,{baseline:middle}',
            'text,Max: f4,305,173.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,21.5',
            'rect,300,55,100,21.5',
            'rect,50,76.5,350,21.5',
            'rect,50,98,350,21.5',
            'rect,50,119.5,250,21.5',
            'rect,300,119.5,100,21.5',
            'rect,50,141,250,21.5',
            'rect,300,141,100,21.5',
            'rect,50,162.5,250,21.5',
            'rect,300,162.5,100,21.5',
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

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f3, alignByColumn, showInGroupFooter}, {f4, alignByColumn, showInGroupFooter}]', function(assert) {
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
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true },
                    { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,305,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,F2: f2 (Max of F1 is f1),55,95,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,111,{baseline:middle}',
            'text,f4,305,111,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,127,{baseline:middle}',
            'text,Max: f4,305,127,{baseline:middle}',
            'text,Max: f3,55,143,{baseline:middle}',
            'text,Max: f4,305,143,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,16',
            'rect,300,55,100,16',
            'rect,50,71,350,16',
            'rect,50,87,350,16',
            'rect,50,103,250,16',
            'rect,300,103,100,16',
            'rect,50,119,250,16',
            'rect,300,119,100,16',
            'rect,50,135,250,16',
            'rect,300,135,100,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f3, alignByColumn, showInGroupFooter}, {f4, alignByColumn, showInGroupFooter}], 2 groups', function(assert) {
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
                    { column: 'f1', summaryType: 'max' },
                    { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true },
                    { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2_1', f3: 'f3', f4: 'f4' }, { f1: 'f1', f2: 'f2_2', f3: 'f3', f4: 'f4' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,305,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,F2: f2_1 (Max of F1 is f1),55,95,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,111,{baseline:middle}',
            'text,f4,305,111,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,127,{baseline:middle}',
            'text,Max: f4,305,127,{baseline:middle}',
            'text,F2: f2_2 (Max of F1 is f1),55,143,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,159,{baseline:middle}',
            'text,f4,305,159,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,175,{baseline:middle}',
            'text,Max: f4,305,175,{baseline:middle}',
            'text,Max: f3,55,191,{baseline:middle}',
            'text,Max: f4,305,191,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,16',
            'rect,300,55,100,16',
            'rect,50,71,350,16',
            'rect,50,87,350,16',
            'rect,50,103,250,16',
            'rect,300,103,100,16',
            'rect,50,119,250,16',
            'rect,300,119,100,16',
            'rect,50,135,350,16',
            'rect,50,151,250,16',
            'rect,300,151,100,16',
            'rect,50,167,250,16',
            'rect,300,167,100,16',
            'rect,50,183,250,16',
            'rect,300,183,100,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, {f3, groupIndex: 2}, f4, f5], groupItems: [f1, {f5, alignByColumn, showInGroupFooter}]', function(assert) {
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
                    { column: 'f5', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4', f5: 'f5' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F4,55,63,{baseline:middle}',
            'text,F5,305,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,F2: f2 (Max of F1 is f1),55,95,{baseline:middle}',
            'text,F3: f3 (Max of F1 is f1),55,111,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f4,55,127,{baseline:middle}',
            'text,f5,305,127,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f5,305,143,{baseline:middle}',
            'text,Max: f5,305,159,{baseline:middle}',
            'text,Max: f5,305,175,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,16',
            'rect,300,55,100,16',
            'rect,50,71,350,16',
            'rect,50,87,350,16',
            'rect,50,103,350,16',
            'rect,50,119,250,16',
            'rect,300,119,100,16',
            'rect,50,135,250,16',
            'rect,300,135,100,16',
            'rect,50,151,250,16',
            'rect,300,151,100,16',
            'rect,50,167,250,16',
            'rect,300,167,100,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, {f3, groupIndex: 2}, f4, f5], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}, {f5, alignByColumn, showInGroupFooter}]', function(assert) {
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
            dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4', f5: 'f5' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F4,55,63,{baseline:middle}',
            'text,F5,305,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,F2: f2 (Max of F1 is f1),55,95,{baseline:middle}',
            'text,F3: f3 (Max of F1 is f1),55,111,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f4,55,127,{baseline:middle}',
            'text,f5,305,127,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4,55,143,{baseline:middle}',
            'text,Max: f5,305,143,{baseline:middle}',
            'text,Max: f4,55,159,{baseline:middle}',
            'text,Max: f5,305,159,{baseline:middle}',
            'text,Max: f4,55,175,{baseline:middle}',
            'text,Max: f5,305,175,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,16',
            'rect,300,55,100,16',
            'rect,50,71,350,16',
            'rect,50,87,350,16',
            'rect,50,103,350,16',
            'rect,50,119,250,16',
            'rect,300,119,100,16',
            'rect,50,135,250,16',
            'rect,300,135,100,16',
            'rect,50,151,250,16',
            'rect,300,151,100,16',
            'rect,50,167,250,16',
            'rect,300,167,100,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, {f3, groupIndex: 2}, f4, f5], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}, {f5, alignByColumn, showInGroupFooter}], 2 groups', function(assert) {
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
            dataSource: [{ f1: 'f1', f2: 'f2_1', f3: 'f3', f4: 'f4', f5: 'f5' }, { f1: 'f1', f2: 'f2_2', f3: 'f3', f4: 'f4', f5: 'f5' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F4,55,63,{baseline:middle}',
            'text,F5,305,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1 (Max: f1),55,79,{baseline:middle}',
            'text,F2: f2_1 (Max of F1 is f1),55,95,{baseline:middle}',
            'text,F3: f3 (Max of F1 is f1),55,111,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f4,55,127,{baseline:middle}',
            'text,f5,305,127,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4,55,143,{baseline:middle}',
            'text,Max: f5,305,143,{baseline:middle}',
            'text,Max: f4,55,159,{baseline:middle}',
            'text,Max: f5,305,159,{baseline:middle}',
            'text,F2: f2_2 (Max of F1 is f1),55,175,{baseline:middle}',
            'text,F3: f3 (Max of F1 is f1),55,191,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f4,55,207,{baseline:middle}',
            'text,f5,305,207,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f4,55,223,{baseline:middle}',
            'text,Max: f5,305,223,{baseline:middle}',
            'text,Max: f4,55,239,{baseline:middle}',
            'text,Max: f5,305,239,{baseline:middle}',
            'text,Max: f4,55,255,{baseline:middle}',
            'text,Max: f5,305,255,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,250,16',
            'rect,300,55,100,16',
            'rect,50,71,350,16',
            'rect,50,87,350,16',
            'rect,50,103,350,16',
            'rect,50,119,250,16',
            'rect,300,119,100,16',
            'rect,50,135,250,16',
            'rect,300,135,100,16',
            'rect,50,151,250,16',
            'rect,300,151,100,16',
            'rect,50,167,350,16',
            'rect,50,183,350,16',
            'rect,50,199,250,16',
            'rect,300,199,100,16',
            'rect,50,215,250,16',
            'rect,300,215,100,16',
            'rect,50,231,250,16',
            'rect,300,231,100,16',
            'rect,50,247,250,16',
            'rect,300,247,100,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});

QUnit.module('Total summaries', moduleConfig, () => {
    QUnit.test('[f1, f2], totalItems: [f1]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' }
            ],
            summary: {
                totalItems: [
                    { column: 'f1', summaryType: 'max' }
                ]
            },
            dataSource: [{ f1: 'f1', f2: 'f2' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,63,{baseline:middle}',
            'text,F2,135,63,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1,55,79,{baseline:middle}',
            'text,f2,135,79,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f1,55,95,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,50,71,80,16',
            'rect,130,71,90,16',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3], totalItems: [f2]', function(assert) {
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

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f2,55,111,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,50,71,170,16',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,50,103,80,16',
            'rect,130,103,90,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3], totalItems: [f2] - height auto', function(assert) {
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
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3], totalItems: [f2] - height auto, padding', function(assert) {
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
                pdfCell.padding = 5;
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

    QUnit.test('[{f1, groupIndex: 0}, f2, f3], groupItems: [{f2, alignByColumn, showInGroupFooter}], totalItems: [f2]', function(assert) {
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

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,135,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2,55,95,{baseline:middle}',
            'text,f3,135,95,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f2,55,111,{baseline:middle}',
            'text,Max: f2,55,127,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,50,71,170,16',
            'rect,50,87,80,16',
            'rect,130,87,90,16',
            'rect,50,103,80,16',
            'rect,130,103,90,16',
            'rect,50,119,80,16',
            'rect,130,119,90,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3], groupItems: [{f2, alignByColumn, showInGroupFooter}], totalItems: [f2] - height auto', function(assert) {
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
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'rect,50,141,80,21.5',
            'rect,130,141,90,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, f2, f3], groupItems: [{f2, alignByColumn, showInGroupFooter}], totalItems: [f2] - height auto, padding', function(assert) {
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
            if(gridCell.rowType === 'totalFooter' && gridCell.column.dataField === 'f2') {
                pdfCell.padding = 5;
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

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], totalItems: [f3]', function(assert) {
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

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,135,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'text,F2: f2,55,95,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,111,{baseline:middle}',
            'text,f4,135,111,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,127,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,50,71,170,16',
            'rect,50,87,170,16',
            'rect,50,103,80,16',
            'rect,130,103,90,16',
            'rect,50,119,80,16',
            'rect,130,119,90,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], totalItems: [f3] - height auto', function(assert) {
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
            'rect,50,141,80,21.5',
            'rect,130,141,90,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], totalItems: [f3] - height auto, padding', function(assert) {
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
            if(gridCell.rowType === 'totalFooter' && gridCell.column.dataField === 'f3') {
                pdfCell.padding = 5;
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

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3]', function(assert) {
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

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,135,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'text,F2: f2,55,95,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,111,{baseline:middle}',
            'text,f4,135,111,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,127,{baseline:middle}',
            'text,Max: f3,55,143,{baseline:middle}',
            'text,Max: f3,55,159,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,50,71,170,16',
            'rect,50,87,170,16',
            'rect,50,103,80,16',
            'rect,130,103,90,16',
            'rect,50,119,80,16',
            'rect,130,119,90,16',
            'rect,50,135,80,16',
            'rect,130,135,90,16',
            'rect,50,151,80,16',
            'rect,130,151,90,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], totalItems: [f3], 2 groups', function(assert) {
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
            dataSource: [
                { f1: 'f1', f2: 'f2_1', f3: 'f3', f4: 'f4' },
                { f1: 'f1', f2: 'f2_2', f3: 'f3', f4: 'f4' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,135,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'text,F2: f2_1,55,95,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,111,{baseline:middle}',
            'text,f4,135,111,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F2: f2_2,55,127,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,143,{baseline:middle}',
            'text,f4,135,143,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,159,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,50,71,170,16',
            'rect,50,87,170,16',
            'rect,50,103,80,16',
            'rect,130,103,90,16',
            'rect,50,119,170,16',
            'rect,50,135,80,16',
            'rect,130,135,90,16',
            'rect,50,151,80,16',
            'rect,130,151,90,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], totalItems: [f3], 2 groups - height auto', function(assert) {
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
            dataSource: [
                { f1: 'f1', f2: 'f2_1', f3: 'f3', f4: 'f4' },
                { f1: 'f1', f2: 'f2_2', f3: 'f3', f4: 'f4' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,135,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'text,F2: f2_1,55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,135,130.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F2: f2_2,55,151.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,173.25,{baseline:middle}',
            'text,f4,135,173.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,194.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'rect,50,141,170,21.5',
            'rect,50,162.5,80,21.5',
            'rect,130,162.5,90,21.5',
            'rect,50,184,80,21.5',
            'rect,130,184,90,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], totalItems: [f3], 2 groups - height auto, padding', function(assert) {
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
            dataSource: [
                { f1: 'f1', f2: 'f2_1', f3: 'f3', f4: 'f4' },
                { f1: 'f1', f2: 'f2_2', f3: 'f3', f4: 'f4' }
            ]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'totalFooter' && gridCell.column.dataField === 'f3') {
                pdfCell.padding = 5;
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
            'text,F2: f2_1,55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,135,130.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F2: f2_2,55,151.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,173.25,{baseline:middle}',
            'text,f4,135,173.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,194.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'rect,50,141,170,21.5',
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

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3], 2 groups', function(assert) {
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
            dataSource: [
                { f1: 'f1', f2: 'f2_1', f3: 'f3', f4: 'f4' },
                { f1: 'f1', f2: 'f2_2', f3: 'f3', f4: 'f4' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,135,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,79,{baseline:middle}',
            'text,F2: f2_1,55,95,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,111,{baseline:middle}',
            'text,f4,135,111,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,127,{baseline:middle}',
            'text,F2: f2_2,55,143,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,159,{baseline:middle}',
            'text,f4,135,159,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,175,{baseline:middle}',
            'text,Max: f3,55,191,{baseline:middle}',
            'text,Max: f3,55,207,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,16',
            'rect,130,55,90,16',
            'rect,50,71,170,16',
            'rect,50,87,170,16',
            'rect,50,103,80,16',
            'rect,130,103,90,16',
            'rect,50,119,80,16',
            'rect,130,119,90,16',
            'rect,50,135,170,16',
            'rect,50,151,80,16',
            'rect,130,151,90,16',
            'rect,50,167,80,16',
            'rect,130,167,90,16',
            'rect,50,183,80,16',
            'rect,130,183,90,16',
            'rect,50,199,80,16',
            'rect,130,199,90,16',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3], 2 groups - height auto', function(assert) {
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
            dataSource: [
                { f1: 'f1', f2: 'f2_1', f3: 'f3', f4: 'f4' },
                { f1: 'f1', f2: 'f2_2', f3: 'f3', f4: 'f4' }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,65.75,{baseline:middle}',
            'text,F4,135,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,87.25,{baseline:middle}',
            'text,F2: f2_1,55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,135,130.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,151.75,{baseline:middle}',
            'text,F2: f2_2,55,173.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,194.75,{baseline:middle}',
            'text,f4,135,194.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,216.25,{baseline:middle}',
            'text,Max: f3,55,237.75,{baseline:middle}',
            'text,Max: f3,55,259.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'rect,50,141,80,21.5',
            'rect,130,141,90,21.5',
            'rect,50,162.5,170,21.5',
            'rect,50,184,80,21.5',
            'rect,130,184,90,21.5',
            'rect,50,205.5,80,21.5',
            'rect,130,205.5,90,21.5',
            'rect,50,227,80,21.5',
            'rect,130,227,90,21.5',
            'rect,50,248.5,80,21.5',
            'rect,130,248.5,90,21.5',
            'setFont,helvetica,normal,',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3], 2 groups - height auto, padding', function(assert) {
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
            dataSource: [
                { f1: 'f1', f2: 'f2_1', f3: 'f3', f4: 'f4' },
                { f1: 'f1', f2: 'f2_2', f3: 'f3', f4: 'f4' }
            ]
        });

        const customizeCell = ({ gridCell, pdfCell }) => {
            if(gridCell.rowType === 'totalFooter' && gridCell.column.dataField === 'f3') {
                pdfCell.padding = 5;
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
            'text,F2: f2_1,55,108.75,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,130.25,{baseline:middle}',
            'text,f4,135,130.25,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,151.75,{baseline:middle}',
            'text,F2: f2_2,55,173.25,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f3,55,194.75,{baseline:middle}',
            'text,f4,135,194.75,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,Max: f3,55,216.25,{baseline:middle}',
            'text,Max: f3,55,237.75,{baseline:middle}',
            'text,Max: f3,55,259.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,80,21.5',
            'rect,130,55,90,21.5',
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'rect,50,119.5,80,21.5',
            'rect,130,119.5,90,21.5',
            'rect,50,141,80,21.5',
            'rect,130,141,90,21.5',
            'rect,50,162.5,170,21.5',
            'rect,50,184,80,21.5',
            'rect,130,184,90,21.5',
            'rect,50,205.5,80,21.5',
            'rect,130,205.5,90,21.5',
            'rect,50,227,80,21.5',
            'rect,130,227,90,21.5',
            'rect,50,248.5,80,21.5',
            'rect,130,248.5,90,21.5',
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
});
