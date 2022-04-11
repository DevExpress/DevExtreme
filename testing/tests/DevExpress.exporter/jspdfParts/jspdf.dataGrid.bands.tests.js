import { exportDataGrid } from 'exporter/jspdf/export_data_grid';
import { moduleConfig, createMockPdfDoc, createDataGrid } from './jspdf.dataGrid_utils.js';

QUnit.module('Bands', moduleConfig, () => {
    QUnit.test('[band1-[f1]]', function(assert) {
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

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'Band1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'f1_1') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,63,{baseline:middle}',
            'text,F1,55,81,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,103,{baseline:middle}',
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
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1]] - height auto', function(assert) {
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

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F1,55,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
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
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1]] - height auto, padding', function(assert) {
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

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band1') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F1,55,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
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
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1', columns: [ 'f1', 'f2', ] }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'Band1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'f1_1') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,63,{baseline:middle}',
            'text,F1,55,81,{baseline:middle}',
            'text,F2,125,81,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,103,{baseline:middle}',
            'text,f2_1,125,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,140,16',
            'rect,50,71,70,20',
            'rect,120,71,70,20',
            'rect,50,91,70,24',
            'rect,120,91,70,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1', columns: [ 'f1', 'f2', ] }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F1,55,87.25,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,140,21.5',
            'rect,50,76.5,70,21.5',
            'rect,120,76.5,70,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2]] - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1', columns: [ 'f1', 'f2', ] }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
        });

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band1') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F1,55,87.25,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,140,21.5',
            'rect,50,76.5,70,21.5',
            'rect,120,76.5,70,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2], f3]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1', columns: [ 'f1', 'f2', ] },
                'f3'
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        const onRowExporting = (e) => {
            if(e.rowCells[0].text === 'Band1') {
                e.rowHeight = 16;
            } else if(e.rowCells[0].text === 'F1') {
                e.rowHeight = 20;
            } else if(e.rowCells[0].text === 'f1_1') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,63,{baseline:middle}',
            'text,F3,195,73,{baseline:middle}',
            'text,F1,55,81,{baseline:middle}',
            'text,F2,125,81,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,103,{baseline:middle}',
            'text,f2_1,125,103,{baseline:middle}',
            'text,f3_1,195,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,140,16',
            'rect,190,55,60,36',
            'rect,50,71,70,20',
            'rect,120,71,70,20',
            'rect,50,91,70,24',
            'rect,120,91,70,24',
            'rect,190,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 60 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2], f3] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1', columns: [ 'f1', 'f2', ] },
                'f3'
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,140,21.5',
            'rect,190,55,60,43',
            'rect,50,76.5,70,21.5',
            'rect,120,76.5,70,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,70,21.5',
            'rect,190,98,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 70, 60 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, f2], f3] - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1', columns: [ 'f1', 'f2', ] },
                'f3'
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band1') {
                pdfCell.padding = 5;
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,140,21.5',
            'rect,190,55,60,43',
            'rect,50,76.5,70,21.5',
            'rect,120,76.5,70,21.5',
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

    QUnit.test('[band1-[band1_1-[f1], f2]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1',
                    columns: [
                        { caption: 'Band1_1', columns: [ 'f1' ] },
                        'f2',
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1_1', f2: 'f2_1' }],
        });

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'Band1') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'Band1_1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F1') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f1_1_1') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,63,{baseline:middle}',
            'text,Band1_1,55,81,{baseline:middle}',
            'text,F2,125,93,{baseline:middle}',
            'text,F1,55,103,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,55,130,{baseline:middle}',
            'text,f2_1,125,130,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,16',
            'rect,50,71,70,20',
            'rect,120,71,80,44',
            'rect,50,91,70,24',
            'rect,50,115,70,30',
            'rect,120,115,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[band1_1-[f1], f2]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1',
                    columns: [
                        { caption: 'Band1_1', columns: [ 'f1' ] },
                        'f2',
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1_1', f2: 'f2_1' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,Band1_1,55,87.25,{baseline:middle}',
            'text,F2,125,98,{baseline:middle}',
            'text,F1,55,108.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,55,130.25,{baseline:middle}',
            'text,f2_1,125,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,21.5',
            'rect,50,76.5,70,21.5',
            'rect,120,76.5,80,43',
            'rect,50,98,70,21.5',
            'rect,50,119.5,70,21.5',
            'rect,120,119.5,80,21.5',
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

    QUnit.test('[band1-[band1_1-[f1], f2]] - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                { caption: 'Band1',
                    columns: [
                        { caption: 'Band1_1', columns: [ 'f1' ] },
                        'f2',
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1_1', f2: 'f2_1' }],
        });

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band1_1') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,Band1_1,55,87.25,{baseline:middle}',
            'text,F2,125,98,{baseline:middle}',
            'text,F1,55,108.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,55,130.25,{baseline:middle}',
            'text,f2_1,125,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,150,21.5',
            'rect,50,76.5,70,21.5',
            'rect,120,76.5,80,43',
            'rect,50,98,70,21.5',
            'rect,50,119.5,70,21.5',
            'rect,120,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[band1_1-[f1, f2], f3]]', function(assert) {
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

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'Band1') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'Band1_1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F1') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f1_1_1') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,63,{baseline:middle}',
            'text,Band1_1,55,81,{baseline:middle}',
            'text,F3,185,93,{baseline:middle}',
            'text,F1,55,103,{baseline:middle}',
            'text,F2,115,103,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1_1,55,130,{baseline:middle}',
            'text,f2_1_1,115,130,{baseline:middle}',
            'text,f3_1,185,130,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,210,16',
            'rect,50,71,130,20',
            'rect,180,71,80,44',
            'rect,50,91,60,24',
            'rect,110,91,70,24',
            'rect,50,115,60,30',
            'rect,110,115,70,30',
            'rect,180,115,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[band1_1-[f1, f2], f3]] - height auto', function(assert) {
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,210,21.5',
            'rect,50,76.5,130,21.5',
            'rect,180,76.5,80,43',
            'rect,50,98,60,21.5',
            'rect,110,98,70,21.5',
            'rect,50,119.5,60,21.5',
            'rect,110,119.5,70,21.5',
            'rect,180,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[band1_1-[f1, f2], f3]] - height auto, padding', function(assert) {
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

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band1_1') {
                pdfCell.padding = 5;
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,210,21.5',
            'rect,50,76.5,130,21.5',
            'rect,180,76.5,80,43',
            'rect,50,98,60,21.5',
            'rect,110,98,70,21.5',
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

    QUnit.test('[band1-[f1, band1_2-[f2]]]', function(assert) {
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

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'Band1') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F2') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f1_1') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,63,{baseline:middle}',
            'text,F1,55,93,{baseline:middle}',
            'text,Band1_2,115,81,{baseline:middle}',
            'text,F2,115,103,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,130,{baseline:middle}',
            'text,f2_1_1,115,130,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,130,16',
            'rect,50,71,60,44',
            'rect,110,71,70,20',
            'rect,110,91,70,24',
            'rect,50,115,60,30',
            'rect,110,115,70,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, band1_2-[f2]]] - height auto', function(assert) {
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

        const onRowExporting = () => { };

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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,130,21.5',
            'rect,50,76.5,60,43',
            'rect,110,76.5,70,21.5',
            'rect,110,98,70,21.5',
            'rect,50,119.5,60,21.5',
            'rect,110,119.5,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, band1_2-[f2]]] - height auto, padding', function(assert) {
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

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band1_2') {
                pdfCell.padding = 5;
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,130,21.5',
            'rect,50,76.5,60,43',
            'rect,110,76.5,70,21.5',
            'rect,110,98,70,21.5',
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

    QUnit.test('[band1-[f1, band1_2-[f2, f3]]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        'f1',
                        { caption: 'Band1_2', columns: [ 'f2', 'f3' ] }
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1_2', f3: 'f3_1_2' }],
        });

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'Band1') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F1') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'F2') {
                e.rowHeight = 24;
            } else if(notEmptyCell.text === 'f1_1') {
                e.rowHeight = 30;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,63,{baseline:middle}',
            'text,F1,55,93,{baseline:middle}',
            'text,Band1_2,115,81,{baseline:middle}',
            'text,F2,115,103,{baseline:middle}',
            'text,F3,185,103,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,130,{baseline:middle}',
            'text,f2_1_2,115,130,{baseline:middle}',
            'text,f3_1_2,185,130,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,210,16',
            'rect,50,71,60,44',
            'rect,110,71,150,20',
            'rect,110,91,70,24',
            'rect,180,91,80,24',
            'rect,50,115,60,30',
            'rect,110,115,70,30',
            'rect,180,115,80,30',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, band1_2-[f2, f3]]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        'f1',
                        { caption: 'Band1_2', columns: [ 'f2', 'f3' ] }
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1_2', f3: 'f3_1_2' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F1,55,98,{baseline:middle}',
            'text,Band1_2,115,87.25,{baseline:middle}',
            'text,F2,115,108.75,{baseline:middle}',
            'text,F3,185,108.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,130.25,{baseline:middle}',
            'text,f2_1_2,115,130.25,{baseline:middle}',
            'text,f3_1_2,185,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,210,21.5',
            'rect,50,76.5,60,43',
            'rect,110,76.5,150,21.5',
            'rect,110,98,70,21.5',
            'rect,180,98,80,21.5',
            'rect,50,119.5,60,21.5',
            'rect,110,119.5,70,21.5',
            'rect,180,119.5,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 60, 70, 80 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[band1-[f1, band1_2-[f2, f3]]] - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                {
                    caption: 'Band1',
                    columns: [
                        'f1',
                        { caption: 'Band1_2', columns: [ 'f2', 'f3' ] }
                    ]
                }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1_2', f3: 'f3_1_2' }],
        });

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band1_2') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,Band1,55,65.75,{baseline:middle}',
            'text,F1,55,98,{baseline:middle}',
            'text,Band1_2,115,87.25,{baseline:middle}',
            'text,F2,115,108.75,{baseline:middle}',
            'text,F3,185,108.75,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,130.25,{baseline:middle}',
            'text,f2_1_2,115,130.25,{baseline:middle}',
            'text,f3_1_2,185,130.25,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,210,21.5',
            'rect,50,76.5,60,43',
            'rect,110,76.5,150,21.5',
            'rect,110,98,70,21.5',
            'rect,180,98,80,21.5',
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

    QUnit.test('[f1, band2-[f2]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2' ] }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
        });

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F1') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_1') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,73,{baseline:middle}',
            'text,Band2,125,63,{baseline:middle}',
            'text,F2,125,81,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,103,{baseline:middle}',
            'text,f2_1,125,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,36',
            'rect,120,55,80,16',
            'rect,120,71,80,20',
            'rect,50,91,70,24',
            'rect,120,91,80,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2' ] }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,76.5,{baseline:middle}',
            'text,Band2,125,65.75,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,80,21.5',
            'rect,120,76.5,80,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,80,21.5',
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

    QUnit.test('[f1, band2-[f2]] - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2' ] }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1' }],
        });

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band2') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,76.5,{baseline:middle}',
            'text,Band2,125,65.75,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,80,21.5',
            'rect,120,76.5,80,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,80,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2,f3]]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2', 'f3' ] }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F1') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_1') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,73,{baseline:middle}',
            'text,Band2,125,63,{baseline:middle}',
            'text,F2,125,81,{baseline:middle}',
            'text,F3,205,81,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,103,{baseline:middle}',
            'text,f2_1,125,103,{baseline:middle}',
            'text,f3_1,205,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,36',
            'rect,120,55,140,16',
            'rect,120,71,80,20',
            'rect,200,71,60,20',
            'rect,50,91,70,24',
            'rect,120,91,80,24',
            'rect,200,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2,f3]] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2', 'f3' ] }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,76.5,{baseline:middle}',
            'text,Band2,125,65.75,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'text,F3,205,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'text,f3_1,205,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,140,21.5',
            'rect,120,76.5,80,21.5',
            'rect,200,76.5,60,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,80,21.5',
            'rect,200,98,60,21.5',
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

    QUnit.test('[f1, band2-[f2,f3]] - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2', 'f3' ] }
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band2') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,76.5,{baseline:middle}',
            'text,Band2,125,65.75,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'text,F3,205,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'text,f3_1,205,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,140,21.5',
            'rect,120,76.5,80,21.5',
            'rect,200,76.5,60,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,80,21.5',
            'rect,200,98,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2], f3]', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2' ] },
                'f3'
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F1') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_1') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,73,{baseline:middle}',
            'text,Band2,125,63,{baseline:middle}',
            'text,F3,205,73,{baseline:middle}',
            'text,F2,125,81,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,103,{baseline:middle}',
            'text,f2_1,125,103,{baseline:middle}',
            'text,f3_1,205,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,36',
            'rect,120,55,80,16',
            'rect,200,55,60,36',
            'rect,120,71,80,20',
            'rect,50,91,70,24',
            'rect,120,91,80,24',
            'rect,200,91,60,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2], f3] - height auto', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2' ] },
                'f3'
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,76.5,{baseline:middle}',
            'text,Band2,125,65.75,{baseline:middle}',
            'text,F3,205,76.5,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'text,f3_1,205,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,80,21.5',
            'rect,200,55,60,43',
            'rect,120,76.5,80,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,80,21.5',
            'rect,200,98,60,21.5',
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

    QUnit.test('[f1, band2-[f2], f3] - height auto, padding', function(assert) {
        const done = assert.async();
        const doc = createMockPdfDoc();

        const dataGrid = createDataGrid({
            columns: [
                'f1',
                { caption: 'Band2', columns: [ 'f2' ] },
                'f3'
            ],
            dataSource: [{ f1: 'f1_1', f2: 'f2_1', f3: 'f3_1' }],
        });

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band2') {
                pdfCell.padding = 5;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,76.5,{baseline:middle}',
            'text,Band2,125,65.75,{baseline:middle}',
            'text,F3,205,76.5,{baseline:middle}',
            'text,F2,125,87.25,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,108.75,{baseline:middle}',
            'text,f2_1,125,108.75,{baseline:middle}',
            'text,f3_1,205,108.75,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,80,21.5',
            'rect,200,55,60,43',
            'rect,120,76.5,80,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,80,21.5',
            'rect,200,98,60,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60 ], customizeCell }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2,f3], f4]', function(assert) {
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

        const onRowExporting = (e) => {
            const notEmptyCell = e.rowCells.filter((cell) => cell.text)[0];
            if(notEmptyCell.text === 'F1') {
                e.rowHeight = 16;
            } else if(notEmptyCell.text === 'F2') {
                e.rowHeight = 20;
            } else if(notEmptyCell.text === 'f1_1') {
                e.rowHeight = 24;
            }
        };

        const expectedLog = [
            'setTextColor,#979797',
            'setFontSize,10',
            'text,F1,55,73,{baseline:middle}',
            'text,Band2,125,63,{baseline:middle}',
            'text,F4,265,73,{baseline:middle}',
            'text,F2,125,81,{baseline:middle}',
            'text,F3,205,81,{baseline:middle}',
            'setTextColor,#000000',
            'text,f1_1,55,103,{baseline:middle}',
            'text,f2_1,125,103,{baseline:middle}',
            'text,f3_1,205,103,{baseline:middle}',
            'text,f4_1,265,103,{baseline:middle}',
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,36',
            'rect,120,55,140,16',
            'rect,260,55,70,36',
            'rect,120,71,80,20',
            'rect,200,71,60,20',
            'rect,50,91,70,24',
            'rect,120,91,80,24',
            'rect,200,91,60,24',
            'rect,260,91,70,24',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2,f3], f4] - height auto', function(assert) {
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,140,21.5',
            'rect,260,55,70,43',
            'rect,120,76.5,80,21.5',
            'rect,200,76.5,60,21.5',
            'rect,50,98,70,21.5',
            'rect,120,98,80,21.5',
            'rect,200,98,60,21.5',
            'rect,260,98,70,21.5',
            'setFontSize,16',
            'setLineWidth,0.200025',
            'setDrawColor,#000000'
        ];

        exportDataGrid({ jsPDFDocument: doc, component: dataGrid, topLeft: { x: 10, y: 15 }, columnWidths: [ 70, 80, 60, 70 ], onRowExporting: () => {} }).then(() => {
            // doc.save(assert.test.testName + '.pdf');
            assert.deepEqual(doc.__log, expectedLog);
            done();
        });
    });

    QUnit.test('[f1, band2-[f2,f3], f4] - height auto, padding', function(assert) {
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

        const customizeCell = ({ pdfCell }) => {
            if(pdfCell.text === 'Band2') {
                pdfCell.padding = 5;
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
            'setLineWidth,0.5',
            'setDrawColor,#979797',
            'rect,50,55,70,43',
            'rect,120,55,140,21.5',
            'rect,260,55,70,43',
            'rect,120,76.5,80,21.5',
            'rect,200,76.5,60,21.5',
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
});
