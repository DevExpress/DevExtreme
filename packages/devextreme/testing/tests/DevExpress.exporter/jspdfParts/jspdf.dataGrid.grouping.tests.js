import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Grouping', moduleConfig, () => {
    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3]', function(assert) {
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

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F2') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1: f1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_2') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f2_2') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,81,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_2,55,103,{baseline:middle}',
            'text,f1_3,145,103,{baseline:middle}',
            'text,f2_2,55,130,{baseline:middle}',
            'text,f2_3,145,130,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,16',
            'rect,140,55,80,16',
            'rect,50,71,170,20',
            'rect,50,91,90,24',
            'rect,140,91,80,24',
            'rect,50,115,90,30',
            'rect,140,115,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3], selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const ds = [
            { f1: 'f1', f2: 'f1_2', f3: 'f1_3' },
            { f1: 'f1', f2: 'f2_2', f3: 'f2_3' },
        ];

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: ds,
            selectedRowKeys: [ds[1]],
        });

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F2') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1: f1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_2') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f2_2') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,81,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_2,55,106,{baseline:middle}',
            'text,f2_3,145,106,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,16',
            'rect,140,55,80,16',
            'rect,50,71,170,20',
            'rect,50,91,90,30',
            'rect,140,91,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting, selectedRowsOnly: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3] - height auto', function(assert) {
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

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3] - height auto, padding', function(assert) {
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
                pdfCell.padding = 5;
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
            'rect,50,76.5,170,21.5',
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

    QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3]', function(assert) {
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

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F2') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1: f1_1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F1: f2_1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_2') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f2_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1_1,55,81,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_2,55,103,{baseline:middle}',
            'text,f1_3,145,103,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F1: f2_1,55,125,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_2,55,147,{baseline:middle}',
            'text,f2_3,145,147,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,16',
            'rect,140,55,80,16',
            'rect,50,71,170,20',
            'rect,50,91,90,24',
            'rect,140,91,80,24',
            'rect,50,115,170,20',
            'rect,50,135,90,24',
            'rect,140,135,80,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3], selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const ds = [
            { f1: 'f1_1', f2: 'f1_2', f3: 'f1_3' },
            { f1: 'f2_1', f2: 'f2_2', f3: 'f2_3' },
        ];

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2' },
                { dataField: 'f3' },
            ],
            dataSource: ds,
            selectedRowKeys: [ds[1]],
        });

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F2') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1: f1_1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F1: f2_1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_2') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f2_2') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F2,55,63,{baseline:middle}',
            'text,F3,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f2_1,55,81,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_2,55,103,{baseline:middle}',
            'text,f2_3,145,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,16',
            'rect,140,55,80,16',
            'rect,50,71,170,20',
            'rect,50,91,90,24',
            'rect,140,91,80,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting, selectedRowsOnly: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3] - height auto', function(assert) {
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
            'rect,50,76.5,170,21.5',
            'rect,50,98,90,21.5',
            'rect,140,98,80,21.5',
            'rect,50,119.5,170,21.5',
            'rect,50,141,90,21.5',
            'rect,140,141,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3] - height auto, padding', function(assert) {
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
                pdfCell.padding = 5;
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
            'rect,50,76.5,170,21.5',
            'rect,50,98,90,21.5',
            'rect,140,98,80,21.5',
            'rect,50,119.5,170,21.5',
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

    QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4]', function(assert) {
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

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F3') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1: f1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F2: f2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_3') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f2_3') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,81,{baseline:middle}',
            'text,F2: f2,55,101,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_3,55,123,{baseline:middle}',
            'text,f1_4,145,123,{baseline:middle}',
            'text,f2_3,55,150,{baseline:middle}',
            'text,f2_4,145,150,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,16',
            'rect,140,55,80,16',
            'rect,50,71,170,20',
            'rect,50,91,170,20',
            'rect,50,111,90,24',
            'rect,140,111,80,24',
            'rect,50,135,90,30',
            'rect,140,135,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const ds = [
            { f1: 'f1', f2: 'f2', f3: 'f1_3', f4: 'f1_4' },
            { f1: 'f1', f2: 'f2', f3: 'f2_3', f4: 'f2_4' },
        ];

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 1 },
                { dataField: 'f3' },
                { dataField: 'f4' },
            ],
            dataSource: ds,
            selectedRowKeys: [ds[1]],
        });

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F3') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1: f1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F2: f2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_3') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f2_3') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,81,{baseline:middle}',
            'text,F2: f2,55,101,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_3,55,126,{baseline:middle}',
            'text,f2_4,145,126,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,16',
            'rect,140,55,80,16',
            'rect,50,71,170,20',
            'rect,50,91,170,20',
            'rect,50,111,90,30',
            'rect,140,111,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting, selectedRowsOnly: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto', function(assert) {
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
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'rect,50,119.5,90,21.5',
            'rect,140,119.5,80,21.5',
            'rect,50,141,90,21.5',
            'rect,140,141,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 level - 1 group - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto, padding', function(assert) {
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
                pdfCell.padding = 5;
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
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
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

    QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4]', function(assert) {
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

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F3') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1: f1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F2: f1_2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F2: f2_2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_3') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f2_3') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,81,{baseline:middle}',
            'text,F2: f1_2,55,101,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f1_3,55,123,{baseline:middle}',
            'text,f1_4,145,123,{baseline:middle}',
            'setFont,helvetica,bold,',
            'text,F2: f2_2,55,145,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_3,55,167,{baseline:middle}',
            'text,f2_4,145,167,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,16',
            'rect,140,55,80,16',
            'rect,50,71,170,20',
            'rect,50,91,170,20',
            'rect,50,111,90,24',
            'rect,140,111,80,24',
            'rect,50,135,170,20',
            'rect,50,155,90,24',
            'rect,140,155,80,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], selectedRowKeys: [ds[1]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();
        const ds = [
            { f1: 'f1', f2: 'f1_2', f3: 'f1_3', f4: 'f1_4' },
            { f1: 'f1', f2: 'f2_2', f3: 'f2_3', f4: 'f2_4' },
        ];

        const dataGrid = createDataGrid({
            columns: [
                { dataField: 'f1', groupIndex: 0 },
                { dataField: 'f2', groupIndex: 1 },
                { dataField: 'f3' },
                { dataField: 'f4' },
            ],
            dataSource: ds,
            selectedRowKeys: [ds[1]],
        });

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F3') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1: f1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F2: f1_2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F2: f2_2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_3') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f2_3') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F3,55,63,{baseline:middle}',
            'text,F4,145,63,{baseline:middle}',
            'setTextColor,#000000',
            'setFont,helvetica,bold,',
            'text,F1: f1,55,81,{baseline:middle}',
            'text,F2: f2_2,55,101,{baseline:middle}',
            'setFont,helvetica,normal,',
            'text,f2_3,55,123,{baseline:middle}',
            'text,f2_4,145,123,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,90,16',
            'rect,140,55,80,16',
            'rect,50,71,170,20',
            'rect,50,91,170,20',
            'rect,50,111,90,24',
            'rect,140,111,80,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting, selectedRowsOnly: true }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto', function(assert) {
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
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'rect,50,119.5,90,21.5',
            'rect,140,119.5,80,21.5',
            'rect,50,141,170,21.5',
            'rect,50,162.5,90,21.5',
            'rect,140,162.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - height auto, padding', function(assert) {
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
                pdfCell.padding = 5;
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
            'rect,50,76.5,170,21.5',
            'rect,50,98,170,21.5',
            'rect,50,119.5,90,21.5',
            'rect,140,119.5,80,21.5',
            'rect,50,141,170,21.5',
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
});
