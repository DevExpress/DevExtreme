import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfColumnWidthsTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('column auto width', moduleConfig, () => {
            QUnit.test('Empty', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({});

                const expectedLog = [
                    'setLineWidth,0.5',
                    'rect,10,15,0,0'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col. options.topLeft = 0', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,f1,45,65.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,515.28,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. options.topLeft = 10', function(assert) {
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
                    'rect,50,55,505.28,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. options.topLeft = 10. col1.width = 100', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [{ caption: 'f1', width: 100 }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,f1,55,65.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,55,100,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F1,55,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F2,307.64,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55,87.25,{baseline:middle}',
                    'text,v2_1,307.64,87.25,{baseline:middle}',
                    'text,v1_2,55,108.75,{baseline:middle}',
                    'text,v2_2,307.64,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,55,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,55,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,76.5,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,76.5,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,98,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,98,252.64,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows, col1.width = 100, col2.width = 200', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', width: 100 },
                        { dataField: 'f2', width: 200 },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F1,55,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F2,155,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55,87.25,{baseline:middle}',
                    'text,v2_1,155,87.25,{baseline:middle}',
                    'text,v1_2,55,108.75,{baseline:middle}',
                    'text,v2_2,155,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,55,100,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,150,55,200,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,76.5,100,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,150,76.5,200,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,98,100,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,150,98,200,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows, col1.width = 100, col2.width = undefined', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1', width: 100 },
                        { dataField: 'f2' },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F1,55,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F2,105.528,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55,87.25,{baseline:middle}',
                    'text,v2_1,105.528,87.25,{baseline:middle}',
                    'text,v1_2,55,108.75,{baseline:middle}',
                    'text,v2_2,105.528,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,55,50.528,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,100.528,55,454.752,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,76.5,50.528,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,100.528,76.5,454.752,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,98,50.528,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,100.528,98,454.752,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows, col1.width = undefined, col2.width = 200', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2', width: 200 },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F1,55,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F2,459.224,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55,87.25,{baseline:middle}',
                    'text,v2_1,459.224,87.25,{baseline:middle}',
                    'text,v1_2,55,108.75,{baseline:middle}',
                    'text,v2_2,459.224,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,55,404.224,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,454.224,55,101.056,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,76.5,404.224,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,454.224,76.5,101.056,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,98,404.224,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,454.224,98,101.056,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows, col1.width = undefined, col2.width = 200, grid,width=300', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 300,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2', width: 200 },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F1,55,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F2,155,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55,87.25,{baseline:middle}',
                    'text,v2_1,155,87.25,{baseline:middle}',
                    'text,v1_2,55,108.75,{baseline:middle}',
                    'text,v2_2,155,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,55,100,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,150,55,200,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,76.5,100,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,150,76.5,200,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,98,100,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,150,98,200,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 cols - 2 rows, col1.width = undefined, col2.width = 200, grid,width=1000', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 1000,
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2', width: 200 },
                    ],
                    dataSource: [{ f1: 'v1_1', f2: 'v2_1' }, { f1: 'v1_2', f2: 'v2_2' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F1,55,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F2,459.224,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55,87.25,{baseline:middle}',
                    'text,v2_1,459.224,87.25,{baseline:middle}',
                    'text,v1_2,55,108.75,{baseline:middle}',
                    'text,v2_2,459.224,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,55,404.224,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,454.224,55,101.056,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,76.5,404.224,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,454.224,76.5,101.056,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,98,404.224,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,454.224,98,101.056,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('column auto width with wordWrap and Bands', moduleConfig, () => {
            QUnit.test('[band1-[f1]]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        {
                            caption: 'Band1 line1 line 2',
                            columns: [ 'f1', ]
                        }
                    ],
                    dataSource: [{ f1: 'f1_1 long line very long line' }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,Band1 line1 line 2,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F1,45,87.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 long line very long line,45,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,515.28,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2]]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 long line 1 ling line 2', columns: [ 'f1', 'f2', ] }
                    ],
                    dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 line long line long line' }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F1,45,87.25,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F2,302.64,87.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,45,108.75,{baseline:middle}',
                    'text,f2_1 line long line long line,302.64,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,76.5,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,98,257.64,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2, f3]]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 long line 1 ling line 2', columns: [ 'f1', 'f2', 'f3' ] }
                    ],
                    dataSource: [{ f1: 'f1_1 line', f2: 'f2_1 line long line long line', f3: 'f3' }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F1,45,87.25,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F2,216.76,87.25,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F3,388.52,87.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,45,108.75,{baseline:middle}',
                    'text,f2_1 line long line long line,216.76,108.75,{baseline:middle}',
                    'text,f3,388.52,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,76.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,76.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,98,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,98,171.76,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[f3,f4]]], short text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { dataField: 'f3', caption: 'f3' },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6', dataField: 'f4' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1',
                            f4: 'f4_1'
                        }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1 line,216.76,67.917,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1_2,216.76,102.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,388.52,95.917,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,f3,216.76,146.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,45,179.25,{baseline:middle}',
                    'text,f3_1,216.76,179.25,{baseline:middle}',
                    'text,f4_1,388.52,179.25,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,171.76,113.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,55,343.52,25.833',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,80.833,171.76,43.833',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,80.833,171.76,87.667',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,124.667,171.76,43.833',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,168.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,168.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,168.5,171.76,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[f3,f4]]], long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { dataField: 'f3', caption: 'f3' },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8', dataField: 'f4' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1',
                            f4: 'f4_1'
                        }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,45,70.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1 line,216.76,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1_2,216.76,102,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8,388.52,87.25,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,f3,216.76,153,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,45,189.25,{baseline:middle}',
                    'text,f3_1,216.76,189.25,{baseline:middle}',
                    'text,f4_1,388.52,189.25,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,171.76,123.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,55,343.52,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,76.5,171.76,51',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,76.5,171.76,102',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,127.5,171.76,51',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,178.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,178.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,178.5,171.76,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[band-[f3],f4]]], short text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { caption: 'f1_2_3', columns: [ { dataField: 'f3', caption: 'line1\nline2\nline3\nline4' } ] },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f4' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1_1',
                            f4: 'f4_1'
                        }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,45,76.5,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1 line,216.76,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1_2,216.76,89.667,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,388.52,87.25,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,f1_2_3,216.76,116,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4,216.76,142.333,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,45,200.75,{baseline:middle}',
                    'text,f3_1_1,216.76,200.75,{baseline:middle}',
                    'text,f4_1,388.52,200.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,171.76,135',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,55,343.52,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,76.5,171.76,26.333',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,76.5,171.76,113.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,102.833,171.76,26.333',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,129.167,171.76,60.833',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,190,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,190,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,190,171.76,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band-[band-[band-[f3],f4]]], long text', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f1' },
                        {
                            caption: 'Band1 line',
                            columns: [
                                {
                                    caption: 'Band1_2', columns: [
                                        { caption: 'f1_2_3', columns: [ { dataField: 'f3', caption: 'line1\nline2\nline3\nline4\nline5\nline6' } ] },
                                    ]
                                },
                                { caption: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9', dataField: 'f4' }
                            ]
                        }
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1',
                            f2: 'f2_1',
                            f3: 'f3_1_1',
                            f4: 'f4_1'
                        }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,45,80.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1 line,216.76,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1_2,216.76,87.25,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,388.52,91.5,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,f1_2_3,216.76,108.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,216.76,130.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,45,209.25,{baseline:middle}',
                    'text,f3_1_1,216.76,209.25,{baseline:middle}',
                    'text,f4_1,388.52,209.25,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,171.76,143.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,55,343.52,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,76.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,76.5,171.76,122',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,98,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,119.5,171.76,79',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,198.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,198.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,198.5,171.76,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];
                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('column auto width with wordWrap and grouping', moduleConfig, () => {
            QUnit.test('1 level - 1 group - [{f1, groupIndex: 0}, f2, f3], word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        {
                            f1: 'f1 line line',
                            f2: 'f1_2 line long line',
                            f3: 'f1_3 line long line long line'
                        },
                        {
                            f1: 'f1 long line long line long line',
                            f2: 'f2_2 line',
                            f3: 'f2_3 line long line line'
                        },
                    ],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F2,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F3,302.64,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 line line,45,87.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2 line long line,45,108.75,{baseline:middle}',
                    'text,f1_3 line long line long line,302.64,108.75,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line,45,130.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2 line,45,151.75,{baseline:middle}',
                    'text,f2_3 line long line line,302.64,151.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,98,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,119.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,141,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,141,257.64,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 level - 2 group - [{f1, groupIndex: 0}, f2, f3], word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                    ],
                    dataSource: [
                        {
                            f1: 'f1_1 long line',
                            f2: 'f1_2 long line long line long line',
                            f3: 'f1_3 line'
                        },
                        {
                            f1: 'f2_1 long line long line long line',
                            f2: 'f2_2 line long line',
                            f3: 'f2_3'
                        },
                    ],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F2,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F3,302.64,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 long line,45,87.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2 long line long line long line,45,108.75,{baseline:middle}',
                    'text,f1_3 line,302.64,108.75,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1 long line long line long line,45,130.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2 line long line,45,151.75,{baseline:middle}',
                    'text,f2_3,302.64,151.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,98,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,119.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,141,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,141,257.64,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('2 level - 2 groups - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2', groupIndex: 1 },
                        { dataField: 'f3' },
                        { dataField: 'f4' },
                    ],
                    dataSource: [
                        {
                            f1: 'f1 long line long line long line',
                            f2: 'f1_2 long line',
                            f3: 'f1_3 line',
                            f4: 'f1_4'
                        },
                        {
                            f1: 'f1 long line',
                            f2: 'f2_2 long line long line long line long line',
                            f3: 'f2_3 long line long line',
                            f4: 'f2_4'
                        },
                    ],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F3,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F4,302.64,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line,45,87.25,{baseline:middle}',
                    'text,F2: f2_2 long line long line long line long line,45,108.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_3 long line long line,45,130.25,{baseline:middle}',
                    'text,f2_4,302.64,130.25,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line,45,151.75,{baseline:middle}',
                    'text,F2: f1_2 long line,45,173.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3 line,45,194.75,{baseline:middle}',
                    'text,f1_4,302.64,194.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,119.5,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,119.5,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,141,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,162.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,184,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,184,257.64,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('column auto width with wordWrap, summaries and totals', moduleConfig, () => {
            QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1], word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    summary: {
                        groupItems: [ { column: 'f1', summaryType: 'max' } ]
                    },
                    dataSource: [{ f1: 'f1 line long line', f2: 'f2 line', f3: 'f3 long line long line long line', f4: 'f4 long line' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F2,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F3,216.76,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F4,388.52,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 line long line (Max: f1 line long line),45,87.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 line,45,108.75,{baseline:middle}',
                    'text,f3 long line long line long line,216.76,108.75,{baseline:middle}',
                    'text,f4 long line,388.52,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,55,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,55,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,98,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,98,171.76,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1, f3, f4], groupItems: [f1, {f4, alignByColumn}], word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
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
                    dataSource: [{ f1: 'f1 long line long line long line', f2: 'f2 long line', f3: 'f3 line', f4: 'f4 long line long line' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F3,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F4,302.64,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line (Max: f1 long line\n' +
'long line long line),45,87.25,{baseline:middle}',
                    'text,Max: f4 long line long line,302.64,93,{baseline:middle}',
                    'text,F2: f2 long line (Max of F1 is f1 long line long line\n' +
'long line),45,120.25,{baseline:middle}',
                    'text,Max: f4 long line long line,302.64,126,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3 line,45,153.25,{baseline:middle}',
                    'text,f4 long line long line,302.64,153.25,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'line,40,76.5,297.64,76.5',
                    'line,40,76.5,40,109.5',
                    'line,40,109.5,297.64,109.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'line,297.64,76.5,555.28,76.5',
                    'line,555.28,76.5,555.28,109.5',
                    'line,297.64,109.5,555.28,109.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'line,40,109.5,297.64,109.5',
                    'line,40,109.5,40,142.5',
                    'line,40,142.5,297.64,142.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'line,297.64,109.5,555.28,109.5',
                    'line,555.28,109.5,555.28,142.5',
                    'line,297.64,142.5,555.28,142.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,142.5,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,142.5,257.64,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, showInGroupFooter }], word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    wordWrapEnabled: true,
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
                    dataSource: [{ f1: 'f1 long line', f2: 'f2 very long line very long line', f3: 'f3 line', f4: 'f4 long line' }]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F2,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F3,216.76,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F4,388.52,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line (Max: f1 long line),45,87.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 very long line very long line,45,108.75,{baseline:middle}',
                    'text,f3 line,216.76,108.75,{baseline:middle}',
                    'text,f4 long line,388.52,108.75,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3 line,216.76,130.25,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,55,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,55,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,98,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,98,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,119.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,211.76,119.5,171.76,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,383.52,119.5,171.76,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3], 2 groups, wordWrapEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
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
                        { f1: 'f1 very ling line very long line very long line', f2: 'f2_1 line', f3: 'f3line1\nline2\nline3\nline4', f4: 'f4' },
                        { f1: 'f1 very long line very long line', f2: 'f2_2very long line very long line', f3: 'f3very long line very long line', f4: 'f4' }
                    ]
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,F3,55,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F4,307.64,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 very ling line very long line very long line,55,87.25,{baseline:middle}',
                    'text,F2: f2_1 line,55,108.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55,130.25,{baseline:middle}',
                    'text,f4,307.64,147.5,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55,186.25,{baseline:middle}',
                    'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55,242.25,{baseline:middle}',
                    'text,F1: f1 very long line very long line,55,298.25,{baseline:middle}',
                    'text,F2: f2_2very long line very long line,55,319.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3very long line very long line,55,341.25,{baseline:middle}',
                    'text,f4,307.64,341.25,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3very long line very long line,55,362.75,{baseline:middle}',
                    'text,Max: f3very long line very long line,55,384.25,{baseline:middle}',
                    'text,Max: f3very long line very long line,55,405.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,55,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,55,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,76.5,505.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,98,505.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,119.5,252.64,56',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,119.5,252.64,56',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,175.5,252.64,56',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,175.5,252.64,56',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,231.5,252.64,56',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,231.5,252.64,56',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,287.5,505.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,309,505.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,330.5,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,330.5,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,352,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,352,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,373.5,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,373.5,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,50,395,252.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,302.64,395,252.64,21.5',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

        QUnit.module('column auto width with wordWrap, summaries, totals and bands', moduleConfig, () => {
            QUnit.test('[band1-[f1, f2]], f1.groupIndex=0,f2.groupIndex=1', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 long line 1 ling line 2', columns: [
                            { dataField: 'f1', groupIndex: 0 },
                            { dataField: 'f2', groupIndex: 1 }
                        ] }
                    ],
                    dataSource: [
                        { f1: 'f1_1 line', f2: 'f2_1 line long line long line' }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,45,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line,45,87.25,{baseline:middle}',
                    'text,F2: f2_1 line long line long line,45,108.75,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,119.5,515.28,0',
                    'setFont,helvetica,normal,',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[band1-[f1, f2], f3], f1.groupIndex=0,f2.groupIndex=1, summary: groupItems:f1', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { caption: 'Band1 long line 1 ling line 2', columns: [
                            { dataField: 'f1', groupIndex: 0 },
                            { dataField: 'f2', groupIndex: 1 }
                        ] },
                        { dataField: 'f3', caption: 'f3 line' }
                    ],
                    summary: {
                        groupItems: [ { column: 'f1', summaryType: 'max' } ]
                    },
                    dataSource: [
                        { f1: 'f1_1 line', f2: 'f2_1 line long line long line', f3: 'long line very long line' }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,f3 line,302.64,65.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line (Max: f1_1 line),45,87.25,{baseline:middle}',
                    'text,F2: f2_1 line long line long line (Max of F1 is f1_1 line),45,108.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,long line very long line,302.64,130.25,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,55,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,98,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,119.5,257.64,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,297.64,119.5,257.64,21.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 15 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[f1, band1-[f2, band1_1-[f3,f4], band2_2-[f5,f6],f7]], f1.groupIndex:0, f2.groupIndex 1 - height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        {
                            caption: 'Band1 line',
                            columns: [
                                { dataField: 'f2', groupIndex: 1 },
                                {
                                    caption: 'Band1_1 long line very long line',
                                    columns: [
                                        { dataField: 'f3', caption: 'f3  long line' },
                                        { dataField: 'f4', caption: 'f4  long line very long line' }
                                    ]
                                },
                                {
                                    caption: 'Band1_2',
                                    columns: [{ dataField: 'f5', caption: 'f5 long line very long line' }, 'f6']
                                },
                                {
                                    caption: 'f7 long line very long linelong line very long linelong line very long linelong line very long line',
                                    dataField: 'f7'
                                }
                            ]
                        }
                    ],
                    dataSource: [{
                        f1: 'f1_1 line',
                        f2: 'f2_1 long line very long line',
                        f3: 'f3_1',
                        f4: 'f4_1 very long line very long line very long line',
                        f5: 'f5_1 long line', f6: 'f6_1', f7: 'f7_1 line'
                    }],
                });

                const expectedLog = [
                    'setTextColor,#979797',
                    'setFontSize,10',
                    'text,Band1 line,45,65.75,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1_1 long line very long line,45,90.5,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,Band1_2,251.112,90.5,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,f7 long line very long\n' +
'linelong line very\n' +
'long linelong line\n' +
'very long linelong\n' +
'line very long line,457.224,87.25,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,f3  long line,45,124.25,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,f4  long line very\n' +
'long line,148.056,118.5,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,f5 long line very long\n' +
'line,251.112,118.5,{baseline:middle}',
                    'setTextColor,#979797',
                    'text,F6,354.168,124.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line,45,154.75,{baseline:middle}',
                    'text,F2: f2_1 long line very long line,45,176.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3_1,45,209.25,{baseline:middle}',
                    'text,f4_1 very long line\n' +
'very long line very\n' +
'long line,148.056,197.75,{baseline:middle}',
                    'text,f5_1 long line,251.112,209.25,{baseline:middle}',
                    'text,f6_1,354.168,209.25,{baseline:middle}',
                    'text,f7_1 line,457.224,209.25,{baseline:middle}',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,55,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,76.5,206.112,28',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,246.112,76.5,206.112,28',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,452.224,76.5,103.056,67.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,104.5,103.056,39.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,143.056,104.5,103.056,39.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,246.112,104.5,103.056,39.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,349.168,104.5,103.056,39.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,144,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,165.5,515.28,21.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,40,187,103.056,44.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,143.056,187,103.056,44.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,246.112,187,103.056,44.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,349.168,187,103.056,44.5',
                    'setLineWidth,0.5',
                    'setDrawColor,#979797',
                    'rect,452.224,187,103.056,44.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                exportDataGrid(doc, dataGrid, {
                    topLeft: { x: 0, y: 15 },
                }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfColumnWidthsTests };
