import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Measure units', moduleConfig, () => {
    QUnit.test('1 cols - 1 rows, default settings, units = pt', function(assert) {
        const done = assert.async();

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
            'text,F1,45,50.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,45,72.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,40,40,515.28,21.5',
            'rect,40,61.5,515.28,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const doc = createMockPdfDoc({ unit: 'pt' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 0, y: 0 }
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 cols - 1 rows, default settings, units = px', function(assert) {
        const done = assert.async();

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
            'text,F1,33.75,38.063,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,33.75,54.188,{baseline:middle}',
            'setLineWidth,0.375',
            'setDrawColor,#979797',
            'rect,30,30,386.46,16.125',
            'setLineWidth,0.375',
            'rect,30,46.125,386.46,16.125',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const doc = createMockPdfDoc({ unit: 'px' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 0, y: 0 }
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 cols - 1 rows, default settings, units = cm', function(assert) {
        const done = assert.async();

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
            'text,F1,1.588,1.79,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,1.588,2.549,{baseline:middle}',
            'setLineWidth,0.017638888888888888',
            'setDrawColor,#979797',
            'rect,1.411,1.411,18.178,0.758',
            'setLineWidth,0.017638888888888888',
            'rect,1.411,2.17,18.178,0.758',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const doc = createMockPdfDoc({ unit: 'cm' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 0, y: 0 }
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 cols - 1 rows, default settings, units = mm', function(assert) {
        const done = assert.async();

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
            'text,F1,15.875,17.903,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,15.875,25.488,{baseline:middle}',
            'setLineWidth,0.17638888888888887',
            'setDrawColor,#979797',
            'rect,14.111,14.111,181.779,7.585',
            'setLineWidth,0.17638888888888887',
            'rect,14.111,21.696,181.779,7.585',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const doc = createMockPdfDoc({ unit: 'mm' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 0, y: 0 }
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 cols - 1 rows, default settings, units = in', function(assert) {
        const done = assert.async();

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
            'text,F1,0.625,0.705,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,0.625,1.003,{baseline:middle}',
            'setLineWidth,0.006944444444444444',
            'setDrawColor,#979797',
            'rect,0.556,0.556,7.157,0.299',
            'setLineWidth,0.006944444444444444',
            'rect,0.556,0.854,7.157,0.299',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const doc = createMockPdfDoc({ unit: 'in' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            topLeft: { x: 0, y: 0 }
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 cols - 1 rows, columnWidth = 200, padding: 20, margin: 30, units = pt, user settings are not converted', function(assert) {
        const done = assert.async();

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
            'text,F1,50,55.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,50,107.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,30,30,200,51.5',
            'rect,30,81.5,200,51.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'f1') {
                pdfCell.padding = 10;
            } else {
                pdfCell.padding = 20;
            }
        };


        const doc = createMockPdfDoc({ unit: 'pt' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            margin: 30,
            topLeft: { x: 0, y: 0 },
            columnWidths: [200],
            customizeCell
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 cols - 1 rows, columnWidth = 200, padding: 20, margin: 30, units = px, user settings are not converted', function(assert) {
        const done = assert.async();

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
            'text,F1,50,54.313,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,50,102.938,{baseline:middle}',
            'setLineWidth,0.375',
            'setDrawColor,#979797',
            'rect,30,30,200,48.625',
            'setLineWidth,0.375',
            'rect,30,78.625,200,48.625',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'f1') {
                pdfCell.padding = 10;
            } else {
                pdfCell.padding = 20;
            }
        };


        const doc = createMockPdfDoc({ unit: 'px' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            margin: 30,
            topLeft: { x: 0, y: 0 },
            columnWidths: [200],
            customizeCell
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 cols - 1 rows, columnWidth = 200, padding: 20, margin: 30, units = cm, user settings are not converted', function(assert) {
        const done = assert.async();

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
            'text,F1,80,80.203,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,80,120.609,{baseline:middle}',
            'setLineWidth,0.017638888888888888',
            'setDrawColor,#979797',
            'rect,60,60,200,40.406',
            'setLineWidth,0.017638888888888888',
            'rect,60,100.406,200,40.406',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'f1') {
                pdfCell.padding = 10;
            } else {
                pdfCell.padding = 20;
            }
        };


        const doc = createMockPdfDoc({ unit: 'cm' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            margin: 30,
            topLeft: { x: 0, y: 0 },
            columnWidths: [200],
            customizeCell
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 cols - 1 rows, columnWidth = 200, padding: 20, margin: 30, units = mm, user settings are not converted', function(assert) {
        const done = assert.async();

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
            'text,F1,80,52.028,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,80,96.085,{baseline:middle}',
            'setLineWidth,0.17638888888888887',
            'setDrawColor,#979797',
            'rect,60,30,200,44.057',
            'setLineWidth,0.17638888888888887',
            'rect,60,74.057,200,44.057',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'f1') {
                pdfCell.padding = 10;
            } else {
                pdfCell.padding = 20;
            }
        };


        const doc = createMockPdfDoc({ unit: 'mm' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            margin: 30,
            topLeft: { x: 0, y: 0 },
            columnWidths: [200],
            customizeCell
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 cols - 1 rows, columnWidth = 200, padding: 20, margin: 30, units = in, user settings are not converted', function(assert) {
        const done = assert.async();

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
            'text,F1,80,80.08,{baseline:middle}',
            'setTextColor,#000000',
            'text,v1_1,80,120.24,{baseline:middle}',
            'setLineWidth,0.006944444444444444',
            'setDrawColor,#979797',
            'rect,60,60,200,40.16',
            'setLineWidth,0.006944444444444444',
            'rect,60,100.16,200,40.16',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'f1') {
                pdfCell.padding = 10;
            } else {
                pdfCell.padding = 20;
            }
        };


        const doc = createMockPdfDoc({ unit: 'in' });
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid,
            margin: 30,
            topLeft: { x: 0, y: 0 },
            columnWidths: [200],
            customizeCell
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});


