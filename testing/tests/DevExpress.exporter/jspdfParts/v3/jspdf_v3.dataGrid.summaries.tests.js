import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfSummariesTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'text,f4,225.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,135.333,110.417,{baseline:middle}',
                    'text,f4,225.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,99.333,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1, Max of F2 is f2),55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'text,f4,225.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,Max: f3,205.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,205.333,95,{baseline:middle}',
                    'text,f4,295.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,71,200,71',
                    'line,50,71,50,87',
                    'line,50,87,200,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,200,71,290,71',
                    'line,200,87,290,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,290,71,370,71',
                    'line,370,71,370,87',
                    'line,290,87,370,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,87,80,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'text,Max: f3,205,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,205.333,110.417,{baseline:middle}',
                    'text,f4,295.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,77.167,200,77.167',
                    'line,50,77.167,50,99.333',
                    'line,50,99.333,200,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,200,77.167,290,77.167',
                    'line,200,99.333,290,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,290,77.167,370,77.167',
                    'line,370,77.167,370,99.333',
                    'line,290,99.333,370,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,99.333,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,Max: f3,205.333,79,{baseline:middle}',
                    'text,Max: f4,295.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,205.333,95,{baseline:middle}',
                    'text,f4,295.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,71,200,71',
                    'line,50,71,50,87',
                    'line,50,87,200,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,200,71,290,71',
                    'line,200,87,290,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,290,71,370,71',
                    'line,370,71,370,87',
                    'line,290,87,370,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,87,80,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'text,Max: f3,205,88.25,{baseline:middle}',
                    'text,Max: f4,295,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,205.333,110.417,{baseline:middle}',
                    'text,f4,295.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,77.167,200,77.167',
                    'line,50,77.167,50,99.333',
                    'line,50,99.333,200,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,200,77.167,290,77.167',
                    'line,200,99.333,290,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,290,77.167,370,77.167',
                    'line,370,77.167,370,99.333',
                    'line,290,99.333,370,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,99.333,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,Max: f4,295.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,205.333,95,{baseline:middle}',
                    'text,f4,295.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,240,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,290,71,370,71',
                    'line,370,71,370,87',
                    'line,290,87,370,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,87,80,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'text,Max: f4,295,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,205.333,110.417,{baseline:middle}',
                    'text,f4,295.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,240,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,290,77.167,370,77.167',
                    'line,370,77.167,370,99.333',
                    'line,290,99.333,370,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,99.333,80,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max of F2 is f2),55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'text,f4,225.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'text,Max: f3,135.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'text,f4,225.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,71,130,71',
                    'line,50,71,50,87',
                    'line,50,87,130,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,130,71,220,71',
                    'line,130,87,220,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,220,71,300,71',
                    'line,300,71,300,87',
                    'line,220,87,300,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'text,Max: f3,135.333,79,{baseline:middle}',
                    'text,Max: f4,225.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'text,f4,225.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,71,130,71',
                    'line,50,71,50,87',
                    'line,50,87,130,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,130,71,220,71',
                    'line,130,87,220,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,220,71,300,71',
                    'line,300,71,300,87',
                    'line,220,87,300,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'text,Max: f4,225.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'text,f4,225.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,220,71,300,71',
                    'line,300,71,300,87',
                    'line,220,87,300,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,305.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,Max: f4,305.333,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),55.333,95,{baseline:middle}',
                    'text,Max: f4,305.333,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,111,{baseline:middle}',
                    'text,f4,305.333,111,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,71,300,71',
                    'line,50,71,50,87',
                    'line,50,87,300,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,300,71,400,71',
                    'line,400,71,400,87',
                    'line,300,87,400,87',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,87,300,87',
                    'line,50,87,50,103',
                    'line,50,103,300,103',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,300,87,400,87',
                    'line,400,87,400,103',
                    'line,300,103,400,103',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,103,100,16',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,305.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'text,Max: f4,305.333,88.25,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),55.333,110.417,{baseline:middle}',
                    'text,Max: f4,305.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,305.333,132.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,77.167,300,77.167',
                    'line,50,77.167,50,99.333',
                    'line,50,99.333,300,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,300,77.167,400,77.167',
                    'line,400,77.167,400,99.333',
                    'line,300,99.333,400,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,99.333,300,99.333',
                    'line,50,99.333,50,121.5',
                    'line,50,121.5,300,121.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,300,99.333,400,99.333',
                    'line,400,99.333,400,121.5',
                    'line,300,121.5,400,121.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,121.5,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,305.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'text,Max: f4,305,88.25,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),55.333,110.417,{baseline:middle}',
                    'text,Max: f4,305,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,305.333,132.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,77.167,300,77.167',
                    'line,50,77.167,50,99.333',
                    'line,50,99.333,300,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,300,77.167,400,77.167',
                    'line,400,77.167,400,99.333',
                    'line,300,99.333,400,99.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,50,99.333,300,99.333',
                    'line,50,99.333,50,121.5',
                    'line,50,121.5,300,121.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,300,99.333,400,99.333',
                    'line,400,99.333,400,121.5',
                    'line,300,121.5,400,121.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,121.5,100,22.167',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,205.333,95,{baseline:middle}',
                    'text,f4,295.333,95,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,205.333,111,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,320,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,103,80,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,205.333,110.417,{baseline:middle}',
                    'text,f4,295.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,205.333,132.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,320,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,121.5,80,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,205.333,110.417,{baseline:middle}',
                    'text,f4,295.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,205,132.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,320,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,150,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,121.5,90,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,121.5,80,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,205.333,95,{baseline:middle}',
                    'text,f4,295.333,95,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,205.333,111,{baseline:middle}',
                    'text,Max: f4,295.333,111,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,320,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,103,80,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,205.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,295.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,205.333,95,{baseline:middle}',
                    'text,f4,295.333,95,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,295.333,111,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,320,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,150,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,200,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,290,103,80,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'text,f4,225.333,95,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,135.333,111,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,103,80,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,135.333,110.417,{baseline:middle}',
                    'text,f4,225.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,135.333,132.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,121.5,80,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,135.333,110.417,{baseline:middle}',
                    'text,f4,225.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,135,132.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,121.5,80,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'text,f4,225.333,95,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,135.333,111,{baseline:middle}',
                    'text,Max: f4,225.333,111,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,103,80,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,225.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'text,f4,225.333,95,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,225.333,111,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,220,103,80,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,305.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),55.333,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,111,{baseline:middle}',
                    'text,f4,305.333,111,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,305.333,127,{baseline:middle}',
                    'text,Max: f4,305.333,143,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,103,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,135,100,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,305.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,305.333,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,305.333,154.75,{baseline:middle}',
                    'text,Max: f4,305.333,176.917,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,350,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,350,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,121.5,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,143.667,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,165.833,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,165.833,100,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,305.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,88.25,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,305.333,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,305,154.417,{baseline:middle}',
                    'text,Max: f4,305,175.917,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,350,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,350,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,250,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,121.5,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,250,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,143.667,100,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,165.167,250,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,165.167,100,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,305.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),55.333,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,111,{baseline:middle}',
                    'text,f4,305.333,111,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,127,{baseline:middle}',
                    'text,Max: f4,305.333,127,{baseline:middle}',
                    'text,Max: f3,55.333,143,{baseline:middle}',
                    'text,Max: f4,305.333,143,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,103,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,135,100,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,305.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,F2: f2_1 (Max of F1 is f1),55.333,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,111,{baseline:middle}',
                    'text,f4,305.333,111,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,127,{baseline:middle}',
                    'text,Max: f4,305.333,127,{baseline:middle}',
                    'text,F2: f2_2 (Max of F1 is f1),55.333,143,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,159,{baseline:middle}',
                    'text,f4,305.333,159,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,175,{baseline:middle}',
                    'text,Max: f4,305.333,175,{baseline:middle}',
                    'text,Max: f3,55.333,191,{baseline:middle}',
                    'text,Max: f4,305.333,191,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,103,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,135,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,151,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,151,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,167,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,167,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,183,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,183,100,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F4,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,305.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),55.333,95,{baseline:middle}',
                    'text,F3: f3 (Max of F1 is f1),55.333,111,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f4,55.333,127,{baseline:middle}',
                    'text,f5,305.333,127,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f5,305.333,143,{baseline:middle}',
                    'text,Max: f5,305.333,159,{baseline:middle}',
                    'text,Max: f5,305.333,175,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,135,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,151,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,151,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,167,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,167,100,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F4,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,305.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),55.333,95,{baseline:middle}',
                    'text,F3: f3 (Max of F1 is f1),55.333,111,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f4,55.333,127,{baseline:middle}',
                    'text,f5,305.333,127,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,55.333,143,{baseline:middle}',
                    'text,Max: f5,305.333,143,{baseline:middle}',
                    'text,Max: f4,55.333,159,{baseline:middle}',
                    'text,Max: f5,305.333,159,{baseline:middle}',
                    'text,Max: f4,55.333,175,{baseline:middle}',
                    'text,Max: f5,305.333,175,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,135,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,151,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,151,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,167,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,167,100,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F4,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,305.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),55.333,79,{baseline:middle}',
                    'text,F2: f2_1 (Max of F1 is f1),55.333,95,{baseline:middle}',
                    'text,F3: f3 (Max of F1 is f1),55.333,111,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f4,55.333,127,{baseline:middle}',
                    'text,f5,305.333,127,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,55.333,143,{baseline:middle}',
                    'text,Max: f5,305.333,143,{baseline:middle}',
                    'text,Max: f4,55.333,159,{baseline:middle}',
                    'text,Max: f5,305.333,159,{baseline:middle}',
                    'text,F2: f2_2 (Max of F1 is f1),55.333,175,{baseline:middle}',
                    'text,F3: f3 (Max of F1 is f1),55.333,191,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f4,55.333,207,{baseline:middle}',
                    'text,f5,305.333,207,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f4,55.333,223,{baseline:middle}',
                    'text,Max: f5,305.333,223,{baseline:middle}',
                    'text,Max: f4,55.333,239,{baseline:middle}',
                    'text,Max: f5,305.333,239,{baseline:middle}',
                    'text,Max: f4,55.333,255,{baseline:middle}',
                    'text,Max: f5,305.333,255,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,135,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,151,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,151,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,167,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,183,350,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,199,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,199,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,215,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,215,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,231,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,231,100,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,247,250,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,300,247,100,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,135.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1,55.333,79,{baseline:middle}',
                    'text,f2,135.333,79,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f1,55.333,95,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,71,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f2,55.333,111,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,135.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f2,55.333,132.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,135.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f2,55,132.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,95,{baseline:middle}',
                    'text,f3,135.333,95,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f2,55.333,111,{baseline:middle}',
                    'text,Max: f2,55.333,127,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,119,90,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,135.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f2,55.333,132.583,{baseline:middle}',
                    'text,Max: f2,55.333,154.75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,143.667,90,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,55.333,110.417,{baseline:middle}',
                    'text,f3,135.333,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f2,55.333,132.583,{baseline:middle}',
                    'text,Max: f2,55,154.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,80,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,143.667,90,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'text,F2: f2,55.333,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,111,{baseline:middle}',
                    'text,f4,135.333,111,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,127,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,119,90,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'text,F2: f2,55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,135.333,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,154.75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,143.667,90,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'text,F2: f2,55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,135.333,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55,154.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,80,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,143.667,90,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'text,F2: f2,55.333,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,111,{baseline:middle}',
                    'text,f4,135.333,111,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,127,{baseline:middle}',
                    'text,Max: f3,55.333,143,{baseline:middle}',
                    'text,Max: f3,55.333,159,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,119,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,135,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,135,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,151,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,151,90,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'text,F2: f2_1,55.333,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,111,{baseline:middle}',
                    'text,f4,135.333,111,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,55.333,127,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,143,{baseline:middle}',
                    'text,f4,135.333,143,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,159,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,135,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,135,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,151,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,151,90,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'text,F2: f2_1,55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,135.333,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,55.333,154.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,176.917,{baseline:middle}',
                    'text,f4,135.333,176.917,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,199.083,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,165.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,165.833,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,188,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,188,90,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'text,F2: f2_1,55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,135.333,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,55.333,154.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,176.917,{baseline:middle}',
                    'text,f4,135.333,176.917,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55,198.75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,165.833,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,165.833,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,188,80,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,188,90,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,79,{baseline:middle}',
                    'text,F2: f2_1,55.333,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,111,{baseline:middle}',
                    'text,f4,135.333,111,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,127,{baseline:middle}',
                    'text,F2: f2_2,55.333,143,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,159,{baseline:middle}',
                    'text,f4,135.333,159,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,175,{baseline:middle}',
                    'text,Max: f3,55.333,191,{baseline:middle}',
                    'text,Max: f3,55.333,207,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,87,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,119,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,119,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,135,170,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,151,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,151,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,167,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,167,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,183,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,183,90,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,199,80,16',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,199,90,16',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'text,F2: f2_1,55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,135.333,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,154.75,{baseline:middle}',
                    'text,F2: f2_2,55.333,176.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,199.083,{baseline:middle}',
                    'text,f4,135.333,199.083,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,221.25,{baseline:middle}',
                    'text,Max: f3,55.333,243.417,{baseline:middle}',
                    'text,Max: f3,55.333,265.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,143.667,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,165.833,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,188,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,188,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,210.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,210.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,232.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,232.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,254.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,254.5,90,22.167',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,135.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,55.333,88.25,{baseline:middle}',
                    'text,F2: f2_1,55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,132.583,{baseline:middle}',
                    'text,f4,135.333,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,154.75,{baseline:middle}',
                    'text,F2: f2_2,55.333,176.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,55.333,199.083,{baseline:middle}',
                    'text,f4,135.333,199.083,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3,55.333,221.25,{baseline:middle}',
                    'text,Max: f3,55.333,243.417,{baseline:middle}',
                    'text,Max: f3,55,265.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,143.667,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,143.667,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,165.833,170,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,188,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,188,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,210.167,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,210.167,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,232.333,80,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,232.333,90,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,254.5,80,21.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,130,254.5,90,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfSummariesTests };
