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
QUnit.module('Splitting - Multi page row value', moduleConfig, () => {
    function generateValues(repeatCount, value = 'value') {
        return [...Array(repeatCount).keys()]
            .map((ind) => (ind + value))
            .join(' ');
    }

    QUnit.test('1 column, 2 page multi row, 1 row is multi page row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 300, pageHeight: 65 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' }
            ],
            dataSource: [
                { f1: generateValues(14 + 6) },
                { f1: 'last row value' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,0value 1value 2value 3value 4value 5value 6value 7value,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,290,21.5',
            'rect,10,36.5,290,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,8value 9value 10value 11value 12value 13value 14value
15value 16value 17value 18value 19value,15,32.25,{baseline:middle}`,
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,last row value,15,32.25,{baseline:middle}',
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000' ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
            // columnWidths: [ 200 ]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
    QUnit.test('1 column, 1 page multi row, 1 row is multi page row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 300, pageHeight: 65 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' }
            ],
            dataSource: [
                { f1: generateValues(14) },
                { f1: 'last row value' },
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,0value 1value 2value 3value 4value 5value 6value 7value,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,290,21.5',
            'rect,10,36.5,290,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,8value 9value 10value 11value 12value 13value,15,32.25,{baseline:middle}',
            'text,last row value,15,53.75,{baseline:middle}',
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,21.5',
            'rect,10,43,290,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
            // columnWidths: [ 200 ]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 column, 2 page multi row, 2 row is multi page row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 300, pageHeight: 65 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' }
            ],
            dataSource: [
                { f1: 'first row value' },
                { f1: generateValues(14 + 6) }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,first row value,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,290,21.5',
            'rect,10,36.5,290,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,0value 1value 2value 3value 4value 5value 6value 7value
8value 9value 10value 11value 12value 13value 14value,15,32.25,{baseline:middle}`,
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,15value 16value 17value 18value 19value,15,32.25,{baseline:middle}',
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
            // columnWidths: [ 200 ]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('page margin 1 column, 2 page multi row, 2 row is multi page row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 300, pageHeight: 85 });
        margin.top = 20;

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' }
            ],
            dataSource: [
                { f1: 'first row value' },
                { f1: generateValues(14 + 6) }
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,45.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,first row value,15,67.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,35,290,21.5',
            'rect,10,56.5,290,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,30.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,0value 1value 2value 3value 4value 5value 6value 7value
8value 9value 10value 11value 12value 13value 14value,15,52.25,{baseline:middle}`,
            'rect,10,20,290,21.5',
            'rect,10,41.5,290,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,30.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,15value 16value 17value 18value 19value,15,52.25,{baseline:middle}',
            'rect,10,20,290,21.5',
            'rect,10,41.5,290,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 column, 3 page multi row, 2 row is multi page row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 300, pageHeight: 65 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' }
            ],
            dataSource: [
                { f1: 'first row value' },
                { f1: generateValues(14 * 2 + 6) } // 14 per page
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,first row value,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,290,21.5',
            'rect,10,36.5,290,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,0value 1value 2value 3value 4value 5value 6value 7value
8value 9value 10value 11value 12value 13value 14value,15,32.25,{baseline:middle}`,
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,15value 16value 17value 18value 19value 20value 21value
22value 23value 24value 25value 26value 27value 28value,15,32.25,{baseline:middle}`,
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,29value 30value 31value 32value 33value,15,32.25,{baseline:middle}',
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 column, 3 page multi row, 3, 4 row is multi page row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 300, pageHeight: 65 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' }
            ],
            dataSource:
            [
                { f1: 'first row value' },
                { f1: generateValues(14 * 2 + 6) }, // 14 per page
                { f1: 'third row value' },
                { f1: generateValues(14 + 6) } // 14 per page
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,first row value,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,290,21.5',
            'rect,10,36.5,290,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,0value 1value 2value 3value 4value 5value 6value 7value
8value 9value 10value 11value 12value 13value 14value,15,32.25,{baseline:middle}`,
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,15value 16value 17value 18value 19value 20value 21value
22value 23value 24value 25value 26value 27value 28value,15,32.25,{baseline:middle}`,
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,29value 30value 31value 32value 33value,15,32.25,{baseline:middle}',
            'text,third row value,15,53.75,{baseline:middle}',
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,21.5',
            'rect,10,43,290,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,0value 1value 2value 3value 4value 5value 6value 7value
8value 9value 10value 11value 12value 13value 14value,15,32.25,{baseline:middle}`,
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,15value 16value 17value 18value 19value,15,32.25,{baseline:middle}',
            'rect,10,0,290,21.5',
            'rect,10,21.5,290,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
            // columnWidths: [ 200 ]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 columns, 2 page multi row, 2 row is multi page row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 500, pageHeight: 65 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' }
            ],
            dataSource: [
                { f1: 'first row value', f2: 'short text 1' },
                { f1: generateValues(14 + 6), f2: 'short text 2' } // 14 per page
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'text,F2,315,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,first row value,15,47.25,{baseline:middle}',
            'text,short text 1,315,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,300,21.5',
            'rect,310,15,150,21.5',
            'rect,10,36.5,300,21.5',
            'rect,310,36.5,150,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'text,F2,315,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,0value 1value 2value 3value 4value 5value 6value 7value 8value
9value 10value 11value 12value 13value 14value 15value,15,32.25,{baseline:middle}`,
            'text,short text 2,315,38,{baseline:middle}',
            'rect,10,0,300,21.5',
            'rect,310,0,150,21.5',
            'rect,10,21.5,300,33',
            'rect,310,21.5,150,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'text,F2,315,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,16value 17value 18value 19value,15,32.25,{baseline:middle}',
            'rect,10,0,300,21.5',
            'rect,310,0,150,21.5',
            'rect,10,21.5,300,21.5',
            'rect,310,21.5,150,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
            columnWidths: [ 300, 150 ]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
    QUnit.test('2 columns, 1 row 1 column 2 page multi row, 1 row 2 column 3 page multi row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 500, pageHeight: 65 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' }
            ],
            dataSource: [
                { f1: generateValues(14 + 6), f2: generateValues(2 * 14 + 6) } // 14 per page
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'text,F2,260,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,0value 1value 2value 3value 4value 5value 6value,15,47.25,{baseline:middle}',
            'text,0value 1value 2value 3value 4value 5value 6value,260,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,245,21.5',
            'rect,255,15,245,21.5',
            'rect,10,36.5,245,21.5',
            'rect,255,36.5,245,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'text,F2,260,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,7value 8value 9value 10value 11value 12value
13value 14value 15value 16value 17value 18value,15,32.25,{baseline:middle}`,
            `text,7value 8value 9value 10value 11value 12value
13value 14value 15value 16value 17value 18value,260,32.25,{baseline:middle}`,
            'rect,10,0,245,21.5',
            'rect,255,0,245,21.5',
            'rect,10,21.5,245,33',
            'rect,255,21.5,245,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'text,F2,260,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,19value,15,38,{baseline:middle}',
            `text,19value 20value 21value 22value 23value 24value
25value 26value 27value 28value 29value 30value,260,32.25,{baseline:middle}`,
            'rect,10,0,245,21.5',
            'rect,255,0,245,21.5',
            'rect,10,21.5,245,33',
            'rect,255,21.5,245,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'text,F2,260,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,31value 32value 33value,260,32.25,{baseline:middle}',
            'rect,10,0,245,21.5',
            'rect,255,0,245,21.5',
            'rect,10,21.5,245,21.5',
            'rect,255,21.5,245,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
            // columnWidths: [ 300, 300 ]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
    QUnit.test('2 columns, 1 row 1 column 2 page multi row, 1 row 2 column 3 page multi row, 2 row short text', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 500, pageHeight: 65 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' }
            ],
            dataSource: [
                { f1: generateValues(14 + 6), f2: generateValues(2 * 14 + 6) }, // 14 per page
                { f1: 'last value 1', f2: 'last value 2' }, // 14 per page
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'text,F2,260,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,0value 1value 2value 3value 4value 5value 6value,15,47.25,{baseline:middle}',
            'text,0value 1value 2value 3value 4value 5value 6value,260,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,245,21.5',
            'rect,255,15,245,21.5',
            'rect,10,36.5,245,21.5',
            'rect,255,36.5,245,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'text,F2,260,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,7value 8value 9value 10value 11value 12value
13value 14value 15value 16value 17value 18value,15,32.25,{baseline:middle}`,
            `text,7value 8value 9value 10value 11value 12value
13value 14value 15value 16value 17value 18value,260,32.25,{baseline:middle}`,
            'rect,10,0,245,21.5',
            'rect,255,0,245,21.5',
            'rect,10,21.5,245,33',
            'rect,255,21.5,245,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'text,F2,260,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,19value,15,38,{baseline:middle}',
            `text,19value 20value 21value 22value 23value 24value
25value 26value 27value 28value 29value 30value,260,32.25,{baseline:middle}`,
            'rect,10,0,245,21.5',
            'rect,255,0,245,21.5',
            'rect,10,21.5,245,33',
            'rect,255,21.5,245,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'text,F2,260,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,31value 32value 33value,260,32.25,{baseline:middle}',
            'text,last value 1,15,53.75,{baseline:middle}',
            'text,last value 2,260,53.75,{baseline:middle}',
            'rect,10,0,245,21.5',
            'rect,255,0,245,21.5',
            'rect,10,21.5,245,21.5',
            'rect,255,21.5,245,21.5',
            'rect,10,43,245,21.5',
            'rect,255,43,245,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
            // columnWidths: [ 300, 300 ]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
    QUnit.test('horizontal split, 2 columns, 2 page multi row, 2 row is multi page row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 500, pageHeight: 65 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' }
            ],
            dataSource: [
                { f1: 'first row value', f2: 'short text 1' },
                { f1: generateValues(14 + 6), f2: 'short text 2' } // 14 per page
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,15,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,first row value,15,47.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,300,21.5',
            'rect,10,36.5,300,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,25.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,short text 1,5,47.25,{baseline:middle}',
            'rect,0,15,250,21.5',
            'rect,0,36.5,250,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            `text,0value 1value 2value 3value 4value 5value 6value 7value 8value
9value 10value 11value 12value 13value 14value 15value,15,32.25,{baseline:middle}`,
            'rect,10,0,300,21.5',
            'rect,10,21.5,300,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,short text 2,5,38,{baseline:middle}',
            'rect,0,0,250,21.5',
            'rect,0,21.5,250,33',
            'addPage,',
            'setTextColor,#979797',
            'text,F1,15,10.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,16value 17value 18value 19value,15,32.25,{baseline:middle}',
            'rect,10,0,300,21.5',
            'rect,10,21.5,300,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,F2,5,10.75,{baseline:middle}',
            'rect,0,0,250,21.5',
            'rect,0,21.5,250,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
            columnWidths: [ 300, 250 ] // 300 + 250 > 500
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
    QUnit.test('band 2 columns, 1 row 1 column 2 page multi row, 1 row 2 column 3 page multi row, 2 row short text', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const margin = initMargin(doc, { pageWidth: 500, pageHeight: 85 });

        const dataGrid = createDataGrid({
            width: 600,
            wordWrapEnabled: true,
            columns: [
                { caption: 'Band1', columns: [ 'f1', 'f2', ] } ],
            dataSource: [
                { f1: generateValues(10), f2: generateValues(14 + 6) }, // 14 per page
                { f1: 'last value 1', f2: 'last value 2' }, // 14 per page
            ]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,15,25.75,{baseline:middle}',
            'text,F1,15,47.25,{baseline:middle}',
            'text,F2,260,47.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,0value 1value 2value 3value 4value 5value 6value,15,68.75,{baseline:middle}',
            'text,0value 1value 2value 3value 4value 5value 6value,260,68.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,10,15,490,21.5',
            'rect,10,36.5,245,21.5',
            'rect,255,36.5,245,21.5',
            'rect,10,58,245,21.5',
            'rect,255,58,245,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,Band1,15,10.75,{baseline:middle}',
            'text,F1,15,32.25,{baseline:middle}',
            'text,F2,260,32.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,7value 8value 9value,15,59.5,{baseline:middle}',
            `text,7value 8value 9value 10value 11value 12value
13value 14value 15value 16value 17value 18value,260,53.75,{baseline:middle}`,
            'rect,10,0,490,21.5',
            'rect,10,21.5,245,21.5',
            'rect,255,21.5,245,21.5',
            'rect,10,43,245,33',
            'rect,255,43,245,33',
            'addPage,',
            'setTextColor,#979797',
            'text,Band1,15,10.75,{baseline:middle}',
            'text,F1,15,32.25,{baseline:middle}',
            'text,F2,260,32.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,19value,260,53.75,{baseline:middle}',
            'rect,10,0,490,21.5',
            'rect,10,21.5,245,21.5',
            'rect,255,21.5,245,21.5',
            'rect,10,43,245,21.5',
            'rect,255,43,245,21.5',
            'addPage,',
            'setTextColor,#979797',
            'text,Band1,15,10.75,{baseline:middle}',
            'text,F1,15,32.25,{baseline:middle}',
            'text,F2,260,32.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,last value 1,15,53.75,{baseline:middle}',
            'text,last value 2,260,53.75,{baseline:middle}',
            'rect,10,0,490,21.5',
            'rect,10,21.5,245,21.5',
            'rect,255,21.5,245,21.5',
            'rect,10,43,245,21.5',
            'rect,255,43,245,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'

        ];
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, margin,
            topLeft: { x: 10, y: 15 },
            // columnWidths: [ 300, 300 ]
        }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
