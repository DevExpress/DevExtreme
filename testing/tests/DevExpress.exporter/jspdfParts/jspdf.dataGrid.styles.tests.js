import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

const customizeCell = ({ pdfCell }) => {
    pdfCell.drawLeftBorder = false;
    pdfCell.drawRightBorder = false;
    pdfCell.drawTopBorder = false;
    pdfCell.drawBottomBorder = false;
};

QUnit.module('Styles - Background color', moduleConfig, () => {
    const rowOptions = {
        headerStyles: { backgroundColor: '#808080' },
        // groupStyles: { backgroundColor: '#d3d3d3' },
        // totalStyles: { backgroundColor: '#ffffe0' }
    };

    QUnit.test('Simple - [{f1, f2] - HEX color', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const expectedLog = [
            'setFillColor,#808080',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,#808080',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - GRAY color', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const expectedLog = [
            'setFillColor,128',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,128',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        const _rowOptions = {
            headerStyles: { backgroundColor: 128 },
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions: _rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - RGB color', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const expectedLog = [
            'setFillColor,128,128,128',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,128,128,128',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        const _rowOptions = {
            headerStyles: { backgroundColor: { ch1: 128, ch2: 128, ch3: 128 } },
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions: _rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - SMYC color', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const expectedLog = [
            'setFillColor,0,0,1,0',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,0,0,1,0',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        const _rowOptions = {
            headerStyles: { backgroundColor: { ch1: 0, ch2: 0, ch3: 1, ch4: 0 } },
        };

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell, rowOptions: _rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [f1, f2] - custom HEX color in Header', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'header' && gridCell.column.dataField === 'f1') {
                pdfCell.backgroundColor = '#ffff00';
            }
        };

        const expectedLog = [
            'setFillColor,#ffff00',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,#808080',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [f1, f2] - custom GRAY color in Header', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'header' && gridCell.column.dataField === 'f1') {
                pdfCell.backgroundColor = 128;
            }
        };

        const expectedLog = [
            'setFillColor,128',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,#808080',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [f1, f2] - custom RGB color in Header', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'header' && gridCell.column.dataField === 'f1') {
                pdfCell.backgroundColor = { ch1: 128, ch2: 128, ch3: 128 };
            }
        };

        const expectedLog = [
            'setFillColor,128,128,128',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,#808080',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [f1, f2] - custom SMYC color in Header', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'header' && gridCell.column.dataField === 'f1') {
                pdfCell.backgroundColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
            }
        };

        const expectedLog = [
            'setFillColor,0,0,1,0',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,#808080',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [f1, f2] - custom HEX color in data row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f1') {
                pdfCell.backgroundColor = '#ffff00';
            }
        };

        const expectedLog = [
            'setFillColor,#808080',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,#808080',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setFillColor,#ffff00',
            'rect,50,76.5,90,21.5,F',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [f1, f2] - custom GRAY color in data row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f1') {
                pdfCell.backgroundColor = 128;
            }
        };

        const expectedLog = [
            'setFillColor,#808080',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,#808080',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setFillColor,128',
            'rect,50,76.5,90,21.5,F',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [f1, f2] - custom RGB color in data row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f1') {
                pdfCell.backgroundColor = { ch1: 255, ch2: 255, ch3: 0 };
            }
        };

        const expectedLog = [
            'setFillColor,#808080',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,#808080',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setFillColor,255,255,0',
            'rect,50,76.5,90,21.5,F',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [f1, f2] - custom SMYC color in data row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f1') {
                pdfCell.backgroundColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
            }
        };

        const expectedLog = [
            'setFillColor,#808080',
            'rect,50,55,90,21.5,F',
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setFillColor,#808080',
            'rect,140,55,80,21.5,F',
            'text,F2,145,65.75,',
            'setFillColor,0,0,1,0',
            'rect,50,76.5,90,21.5,F',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell, rowOptions }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    // TODO: Styles with groups/Summaries
});

QUnit.module('Styles - Text color', moduleConfig, () => {
    QUnit.test('Simple - [{f1, f2] - Custom HEX color for first table cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ pdfCell }) => {
            customizeCell({ pdfCell });
            if(pdfCell.text === 'F1') {
                pdfCell.textColor = '#0000ff';
            }
        };

        const expectedLog = [
            'setTextColor,#0000ff',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setTextColor,#979797',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom GRAY color for first table cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ pdfCell }) => {
            customizeCell({ pdfCell });
            if(pdfCell.text === 'F1') {
                pdfCell.textColor = '128';
            }
        };

        const expectedLog = [
            'setTextColor,128',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setTextColor,#979797',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom RGB color for first table cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ pdfCell }) => {
            customizeCell({ pdfCell });
            if(pdfCell.text === 'F1') {
                pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 255 };
            }
        };

        const expectedLog = [
            'setTextColor,0,0,255',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setTextColor,#979797',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom SMYC color for first table cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ pdfCell }) => {
            customizeCell({ pdfCell });
            if(pdfCell.text === 'F1') {
                pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
            }
        };

        const expectedLog = [
            'setTextColor,0,0,1,0',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setTextColor,#979797',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom HEX color for last table cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ pdfCell }) => {
            customizeCell({ pdfCell });
            if(pdfCell.text === 'f1_2') {
                pdfCell.textColor = '#0000ff';
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'setTextColor,#0000ff',
            'text,f1_2,145,87.25,',
            'setFontSize,16',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom GRAY color for last table cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ pdfCell }) => {
            customizeCell({ pdfCell });
            if(pdfCell.text === 'f1_2') {
                pdfCell.textColor = 128;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'setTextColor,128',
            'text,f1_2,145,87.25,',
            'setFontSize,16',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom RGB color for last table cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ pdfCell }) => {
            customizeCell({ pdfCell });
            if(pdfCell.text === 'f1_2') {
                pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 255 };
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'setTextColor,0,0,255',
            'text,f1_2,145,87.25,',
            'setFontSize,16',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom SMYC color for last table cell', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ pdfCell }) => {
            customizeCell({ pdfCell });
            if(pdfCell.text === 'f1_2') {
                pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 1, ch4: 0 };
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'setTextColor,0,0,1,0',
            'text,f1_2,145,87.25,',
            'setFontSize,16',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom colors for first and last table cells', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ pdfCell }) => {
            customizeCell({ pdfCell });
            if(pdfCell.text === 'F1') {
                pdfCell.textColor = 128;
            }
            if(pdfCell.text === 'f1_2') {
                pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 255 };
            }
        };

        const expectedLog = [
            'setTextColor,128',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setTextColor,#979797',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'setTextColor,0,0,255',
            'text,f1_2,145,87.25,',
            'setFontSize,16',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom colors for header row', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'header') {
                pdfCell.textColor = gridCell.column.dataField === 'f1' ? 128 : { ch1: 0, ch2: 0, ch3: 255 };
            }
        };

        const expectedLog = [
            'setTextColor,128',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setTextColor,0,0,255',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Different HEX colors in header cells', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.rowType === 'header') {
                if(gridCell.column.dataField === 'f1') {
                    pdfCell.textColor = '#ff0000';
                } else if(gridCell.column.dataField === 'f2') {
                    pdfCell.textColor = '#0000ff';
                }

            }
        };

        const expectedLog = [
            'setTextColor,#ff0000',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setTextColor,#0000ff',
            'text,F2,145,65.75,',
            'setTextColor,#000000',
            'text,f1_1,55,87.25,',
            'text,f1_2,145,87.25,',
            'setFontSize,16'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('Simple - [{f1, f2] - Custom colors for data rows', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        doc.__logOptions.textOptions = false;

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1' },
                { dataField: 'f2' },
            ],
            dataSource: [
                { f1: 'f1_1', f2: 'f1_2' },
            ],
        });

        const _customizeCell = ({ gridCell, pdfCell }) => {
            customizeCell({ gridCell, pdfCell });
            if(gridCell.column.dataField === 'f1') {
                pdfCell.textColor = 128;
            } else if(gridCell.column.dataField === 'f2') {
                pdfCell.textColor = { ch1: 0, ch2: 0, ch3: 255 };
            }
        };

        const expectedLog = [
            'setTextColor,128',
            'setFontSize,10',
            'text,F1,55,65.75,',
            'setTextColor,0,0,255',
            'text,F2,145,65.75,',
            'setTextColor,128',
            'text,f1_1,55,87.25,',
            'setTextColor,0,0,255',
            'text,f1_2,145,87.25,',
            'setFontSize,16',
            'setTextColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell: _customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    // TODO: Styles with groups/Summaries
});

QUnit.module('Styles - Font', moduleConfig, () => {
    QUnit.test('1 col - 1 text line. customizeCell.set fontSize=20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line,55,71.5,{baseline:middle}',
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

    QUnit.test('1 col - 1 text line. onRowExporting.set fontSize=20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
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

    QUnit.test('1 col - 1 text line. customizeCell.setFontSize=10, onRowExporting.set fontSize=20, height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,20',
            'text,line,55,71.5,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,33',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 10 }; };
        const onRowExporting = (e) => { e.rowCells[0].font = { size: 20 }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. customizeCell.set bold style', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            wordWrapEnabled: false,
            columns: [{ caption: 'line' }]
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFont,helvetica,bold,',
            'text,line,55,69.2,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,100,28.4',
            'setFont,helvetica,normal,',
            'setLineWidth,0.200025',
            'setDrawColor,#000000',
            'setTextColor,#000000'
        ];

        const customizeCell = ({ pdfCell }) => { pdfCell.font = { style: 'bold' }; };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
            // doc.save();
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 col - 1 text line. customizeCell undo bold style', function(assert) {
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

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,65.75,{baseline:middle}',
            'text,F3,145,65.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,F1: f1,55,87.25,{baseline:middle}',
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

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.font.style === 'bold') {
                pdfCell.font.style = 'normal';
            }
        };
        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });
});
