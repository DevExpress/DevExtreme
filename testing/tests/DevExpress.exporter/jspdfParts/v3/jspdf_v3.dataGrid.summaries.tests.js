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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'text,f4,226.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,136.667,110.417,{baseline:middle}',
                    'text,f4,226.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1, Max of F2 is f2),56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'text,f4,226.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,Max: f3,206.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,206.667,95,{baseline:middle}',
                    'text,f4,296.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,71,200,71',
                    'line,50,71,50,87',
                    'line,50,87,200,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,200,71,290,71',
                    'line,200,87,290,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,290,71,370,71',
                    'line,370,71,370,87',
                    'line,290,87,370,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'text,Max: f3,205,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,206.667,110.417,{baseline:middle}',
                    'text,f4,296.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,77.167,200,77.167',
                    'line,50,77.167,50,99.333',
                    'line,50,99.333,200,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,200,77.167,290,77.167',
                    'line,200,99.333,290,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,290,77.167,370,77.167',
                    'line,370,77.167,370,99.333',
                    'line,290,99.333,370,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,Max: f3,206.667,79,{baseline:middle}',
                    'text,Max: f4,296.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,206.667,95,{baseline:middle}',
                    'text,f4,296.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,71,200,71',
                    'line,50,71,50,87',
                    'line,50,87,200,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,200,71,290,71',
                    'line,200,87,290,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,290,71,370,71',
                    'line,370,71,370,87',
                    'line,290,87,370,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'text,Max: f3,205,88.25,{baseline:middle}',
                    'text,Max: f4,295,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,206.667,110.417,{baseline:middle}',
                    'text,f4,296.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,77.167,200,77.167',
                    'line,50,77.167,50,99.333',
                    'line,50,99.333,200,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,200,77.167,290,77.167',
                    'line,200,99.333,290,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,290,77.167,370,77.167',
                    'line,370,77.167,370,99.333',
                    'line,290,99.333,370,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,Max: f4,296.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,206.667,95,{baseline:middle}',
                    'text,f4,296.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,240,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,290,71,370,71',
                    'line,370,71,370,87',
                    'line,290,87,370,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'text,Max: f4,295,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,206.667,110.417,{baseline:middle}',
                    'text,f4,296.667,110.417,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,240,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,290,77.167,370,77.167',
                    'line,370,77.167,370,99.333',
                    'line,290,99.333,370,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max of F2 is f2),56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'text,f4,226.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'text,Max: f3,136.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'text,f4,226.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,71,130,71',
                    'line,50,71,50,87',
                    'line,50,87,130,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,130,71,220,71',
                    'line,130,87,220,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,220,71,300,71',
                    'line,300,71,300,87',
                    'line,220,87,300,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'text,Max: f3,136.667,79,{baseline:middle}',
                    'text,Max: f4,226.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'text,f4,226.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,71,130,71',
                    'line,50,71,50,87',
                    'line,50,87,130,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,130,71,220,71',
                    'line,130,87,220,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,220,71,300,71',
                    'line,300,71,300,87',
                    'line,220,87,300,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'text,Max: f4,226.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'text,f4,226.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,220,71,300,71',
                    'line,300,71,300,87',
                    'line,220,87,300,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,306.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,Max: f4,306.667,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),56.667,95,{baseline:middle}',
                    'text,Max: f4,306.667,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,111,{baseline:middle}',
                    'text,f4,306.667,111,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,71,300,71',
                    'line,50,71,50,87',
                    'line,50,87,300,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,300,71,400,71',
                    'line,400,71,400,87',
                    'line,300,87,400,87',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,87,300,87',
                    'line,50,87,50,103',
                    'line,50,103,300,103',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,300,87,400,87',
                    'line,400,87,400,103',
                    'line,300,103,400,103',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,250,16',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,306.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'text,Max: f4,306.667,88.25,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),56.667,110.417,{baseline:middle}',
                    'text,Max: f4,306.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,306.667,132.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,77.167,300,77.167',
                    'line,50,77.167,50,99.333',
                    'line,50,99.333,300,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,300,77.167,400,77.167',
                    'line,400,77.167,400,99.333',
                    'line,300,99.333,400,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,99.333,300,99.333',
                    'line,50,99.333,50,121.5',
                    'line,50,121.5,300,121.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,300,99.333,400,99.333',
                    'line,400,99.333,400,121.5',
                    'line,300,121.5,400,121.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,250,22.167',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,306.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'text,Max: f4,305,88.25,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),56.667,110.417,{baseline:middle}',
                    'text,Max: f4,305,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,306.667,132.583,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,77.167,300,77.167',
                    'line,50,77.167,50,99.333',
                    'line,50,99.333,300,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,300,77.167,400,77.167',
                    'line,400,77.167,400,99.333',
                    'line,300,99.333,400,99.333',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,50,99.333,300,99.333',
                    'line,50,99.333,50,121.5',
                    'line,50,121.5,300,121.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'line,300,99.333,400,99.333',
                    'line,400,99.333,400,121.5',
                    'line,300,121.5,400,121.5',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,250,22.167',
                    'setLineWidth,0.6666666666666666',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,206.667,95,{baseline:middle}',
                    'text,f4,296.667,95,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,206.667,111,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,103,150,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,200,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,290,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,320,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,87,80,16',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,206.667,110.417,{baseline:middle}',
                    'text,f4,296.667,110.417,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,206.667,136.033,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,121.5,150,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,200,121.5,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,290,121.5,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,320,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,99.333,80,22.167',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,206.667,110.417,{baseline:middle}',
                    'text,f4,296.667,110.417,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,205,135.7,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,121.5,150,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,200,121.5,90,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,290,121.5,80,28.4',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,320,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,150,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,99.333,80,22.167',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,206.667,95,{baseline:middle}',
                    'text,f4,296.667,95,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,206.667,111,{baseline:middle}',
                    'text,Max: f4,296.667,111,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,103,150,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,200,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,290,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,320,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,87,80,16',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,206.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,296.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,206.667,95,{baseline:middle}',
                    'text,f4,296.667,95,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f4,296.667,111,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,103,150,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,200,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,290,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,320,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,150,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,200,87,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,290,87,80,16',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'text,f4,226.667,95,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,136.667,111,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,220,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,136.667,110.417,{baseline:middle}',
                    'text,f4,226.667,110.417,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,136.667,136.033,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,121.5,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,121.5,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,220,121.5,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,99.333,80,22.167',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,136.667,110.417,{baseline:middle}',
                    'text,f4,226.667,110.417,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,135,135.7,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,121.5,80,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,121.5,90,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,220,121.5,80,28.4',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,99.333,80,22.167',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'text,f4,226.667,95,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,136.667,111,{baseline:middle}',
                    'text,Max: f4,226.667,111,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,220,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,226.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'text,f4,226.667,95,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f4,226.667,111,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,220,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,220,87,80,16',
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
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,306.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),56.667,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,111,{baseline:middle}',
                    'text,f4,306.667,111,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f4,306.667,127,{baseline:middle}',
                    'text,Max: f4,306.667,143,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,135,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,103,100,16',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,306.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,306.667,132.583,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f4,306.667,158.2,{baseline:middle}',
                    'text,Max: f4,306.667,187.267,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,143.667,250,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,143.667,100,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,172.733,250,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,172.733,100,29.067',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,350,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,350,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,121.5,100,22.167',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,306.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,88.25,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,306.667,132.583,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f4,305,157.867,{baseline:middle}',
                    'text,Max: f4,305,186.267,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,143.667,250,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,143.667,100,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,172.067,250,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,172.067,100,28.4',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,350,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,350,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,250,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,121.5,100,22.167',
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
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,306.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),56.667,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,111,{baseline:middle}',
                    'text,f4,306.667,111,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,127,{baseline:middle}',
                    'text,Max: f4,306.667,127,{baseline:middle}',
                    'text,Max: f3,56.667,143,{baseline:middle}',
                    'text,Max: f4,306.667,143,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,135,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,103,100,16',
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
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,306.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,F2: f2_1 (Max of F1 is f1),56.667,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,111,{baseline:middle}',
                    'text,f4,306.667,111,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,127,{baseline:middle}',
                    'text,Max: f4,306.667,127,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,F2: f2_2 (Max of F1 is f1),56.667,143,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,159,{baseline:middle}',
                    'text,f4,306.667,159,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,175,{baseline:middle}',
                    'text,Max: f4,306.667,175,{baseline:middle}',
                    'text,Max: f3,56.667,191,{baseline:middle}',
                    'text,Max: f4,306.667,191,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,167,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,167,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,183,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,183,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,103,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,135,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,151,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,151,100,16',
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
                    'text,F4,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,306.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),56.667,95,{baseline:middle}',
                    'text,F3: f3 (Max of F1 is f1),56.667,111,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f4,56.667,127,{baseline:middle}',
                    'text,f5,306.667,127,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f5,306.667,143,{baseline:middle}',
                    'text,Max: f5,306.667,159,{baseline:middle}',
                    'text,Max: f5,306.667,175,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,135,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,151,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,151,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,167,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,167,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,119,100,16',
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
                    'text,F4,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,306.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,F2: f2 (Max of F1 is f1),56.667,95,{baseline:middle}',
                    'text,F3: f3 (Max of F1 is f1),56.667,111,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f4,56.667,127,{baseline:middle}',
                    'text,f5,306.667,127,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f4,56.667,143,{baseline:middle}',
                    'text,Max: f5,306.667,143,{baseline:middle}',
                    'text,Max: f4,56.667,159,{baseline:middle}',
                    'text,Max: f5,306.667,159,{baseline:middle}',
                    'text,Max: f4,56.667,175,{baseline:middle}',
                    'text,Max: f5,306.667,175,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,135,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,151,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,151,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,167,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,167,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,119,100,16',
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
                    'text,F4,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F5,306.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 (Max: f1),56.667,79,{baseline:middle}',
                    'text,F2: f2_1 (Max of F1 is f1),56.667,95,{baseline:middle}',
                    'text,F3: f3 (Max of F1 is f1),56.667,111,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f4,56.667,127,{baseline:middle}',
                    'text,f5,306.667,127,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f4,56.667,143,{baseline:middle}',
                    'text,Max: f5,306.667,143,{baseline:middle}',
                    'text,Max: f4,56.667,159,{baseline:middle}',
                    'text,Max: f5,306.667,159,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,F2: f2_2 (Max of F1 is f1),56.667,175,{baseline:middle}',
                    'text,F3: f3 (Max of F1 is f1),56.667,191,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f4,56.667,207,{baseline:middle}',
                    'text,f5,306.667,207,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f4,56.667,223,{baseline:middle}',
                    'text,Max: f5,306.667,223,{baseline:middle}',
                    'text,Max: f4,56.667,239,{baseline:middle}',
                    'text,Max: f5,306.667,239,{baseline:middle}',
                    'text,Max: f4,56.667,255,{baseline:middle}',
                    'text,Max: f5,306.667,255,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,135,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,135,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,151,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,151,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,215,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,215,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,231,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,231,100,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,247,250,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,300,247,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,55,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,119,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,119,100,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,167,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,183,350,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,199,250,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,300,199,100,16',
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
                    'text,F1,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,136.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1,56.667,79,{baseline:middle}',
                    'text,f2,136.667,79,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f1,56.667,95,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,87,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,71,90,16',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f2,56.667,111,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,136.667,110.417,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f2,56.667,136.033,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,121.5,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,121.5,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,136.667,110.417,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f2,55,135.7,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,121.5,80,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,121.5,90,28.4',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
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
                    'text,F2,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,95,{baseline:middle}',
                    'text,f3,136.667,95,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f2,56.667,111,{baseline:middle}',
                    'text,Max: f2,56.667,127,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,119,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,119,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,87,90,16',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,136.667,110.417,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f2,56.667,136.033,{baseline:middle}',
                    'text,Max: f2,56.667,165.1,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,121.5,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,121.5,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,150.567,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,150.567,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
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
                    'text,F2,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2,56.667,110.417,{baseline:middle}',
                    'text,f3,136.667,110.417,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f2,56.667,136.033,{baseline:middle}',
                    'text,Max: f2,55,164.767,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,121.5,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,121.5,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,150.567,80,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,150.567,90,28.4',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,99.333,90,22.167',
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
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'text,F2: f2,56.667,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,111,{baseline:middle}',
                    'text,f4,136.667,111,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,127,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,119,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,119,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'text,F2: f2,56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,136.667,132.583,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,158.2,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,143.667,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,143.667,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'text,F2: f2,56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,136.667,132.583,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,55,157.867,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,143.667,80,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,143.667,90,28.4',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
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
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'text,F2: f2,56.667,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,111,{baseline:middle}',
                    'text,f4,136.667,111,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,127,{baseline:middle}',
                    'text,Max: f3,56.667,143,{baseline:middle}',
                    'text,Max: f3,56.667,159,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,119,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,119,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,135,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,135,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,151,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,151,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
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
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'text,F2: f2_1,56.667,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,111,{baseline:middle}',
                    'text,f4,136.667,111,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,56.667,127,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,143,{baseline:middle}',
                    'text,f4,136.667,143,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,159,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,151,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,151,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,119,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,135,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,135,90,16',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'text,F2: f2_1,56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,136.667,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,56.667,154.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,176.917,{baseline:middle}',
                    'text,f4,136.667,176.917,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,202.533,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,188,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,188,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,143.667,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,165.833,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,165.833,90,22.167',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'text,F2: f2_1,56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,136.667,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F2: f2_2,56.667,154.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,176.917,{baseline:middle}',
                    'text,f4,136.667,176.917,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,55,202.2,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,188,80,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,188,90,28.4',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,143.667,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,165.833,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,165.833,90,22.167',
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
                    'text,F3,56.667,63,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,63,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,79,{baseline:middle}',
                    'text,F2: f2_1,56.667,95,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,111,{baseline:middle}',
                    'text,f4,136.667,111,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,127,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,F2: f2_2,56.667,143,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,159,{baseline:middle}',
                    'text,f4,136.667,159,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,175,{baseline:middle}',
                    'text,Max: f3,56.667,191,{baseline:middle}',
                    'text,Max: f3,56.667,207,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,119,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,119,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,167,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,167,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,183,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,183,90,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,199,80,16',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,199,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,71,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,87,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,103,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,103,90,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,135,170,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,151,80,16',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,151,90,16',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'text,F2: f2_1,56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,136.667,132.583,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,158.2,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,F2: f2_2,56.667,183.817,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,205.983,{baseline:middle}',
                    'text,f4,136.667,205.983,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,231.6,{baseline:middle}',
                    'text,Max: f3,56.667,260.667,{baseline:middle}',
                    'text,Max: f3,56.667,289.733,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,143.667,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,143.667,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,217.067,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,217.067,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,246.133,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,246.133,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,275.2,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,275.2,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,172.733,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,194.9,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,194.9,90,22.167',
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
                    'text,F3,56.667,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,136.667,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1,56.667,88.25,{baseline:middle}',
                    'text,F2: f2_1,56.667,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,132.583,{baseline:middle}',
                    'text,f4,136.667,132.583,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,158.2,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'setFontSize,10',
                    'text,F2: f2_2,56.667,183.817,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3,56.667,205.983,{baseline:middle}',
                    'text,f4,136.667,205.983,{baseline:middle}',
                    'setFontSize,16',
                    'text,Max: f3,56.667,231.6,{baseline:middle}',
                    'text,Max: f3,56.667,260.667,{baseline:middle}',
                    'text,Max: f3,55,289.4,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,143.667,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,143.667,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,217.067,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,217.067,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,246.133,80,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,246.133,90,29.067',
                    'setLineWidth,0.6666666666666666',
                    'rect,50,275.2,80,28.4',
                    'setLineWidth,0.6666666666666666',
                    'rect,130,275.2,90,28.4',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,55,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,77.167,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,99.333,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,121.5,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,121.5,90,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,172.733,170,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,194.9,80,22.167',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,130,194.9,90,22.167',
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
