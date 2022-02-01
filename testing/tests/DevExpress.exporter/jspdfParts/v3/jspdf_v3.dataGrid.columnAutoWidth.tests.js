import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfColumnWidthsTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('column auto width', moduleConfig, () => {
            QUnit.test('Empty', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({});

                const expectedLog = [
                    'setLineWidth,0.6',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1,45.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,515.28,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,505.28,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1,55.333,66.083,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,307.973,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55.333,88.25,{baseline:middle}',
                    'text,v2_1,307.973,88.25,{baseline:middle}',
                    'text,v1_2,55.333,110.417,{baseline:middle}',
                    'text,v2_2,307.973,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,55,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,77.167,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,99.333,252.64,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,155.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55.333,88.25,{baseline:middle}',
                    'text,v2_1,155.333,88.25,{baseline:middle}',
                    'text,v1_2,55.333,110.417,{baseline:middle}',
                    'text,v2_2,155.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,150,55,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,150,77.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,150,99.333,200,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,105.861,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55.333,88.25,{baseline:middle}',
                    'text,v2_1,105.861,88.25,{baseline:middle}',
                    'text,v1_2,55.333,110.417,{baseline:middle}',
                    'text,v2_2,105.861,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,50.528,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100.528,55,454.752,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,50.528,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100.528,77.167,454.752,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,50.528,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,100.528,99.333,454.752,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,459.557,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55.333,88.25,{baseline:middle}',
                    'text,v2_1,459.557,88.25,{baseline:middle}',
                    'text,v1_2,55.333,110.417,{baseline:middle}',
                    'text,v2_2,459.557,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,404.224,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,454.224,55,101.056,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,404.224,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,454.224,77.167,101.056,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,404.224,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,454.224,99.333,101.056,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,155.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55.333,88.25,{baseline:middle}',
                    'text,v2_1,155.333,88.25,{baseline:middle}',
                    'text,v1_2,55.333,110.417,{baseline:middle}',
                    'text,v2_2,155.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,150,55,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,150,77.167,200,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,100,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,150,99.333,200,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,459.557,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,55.333,88.25,{baseline:middle}',
                    'text,v2_1,459.557,88.25,{baseline:middle}',
                    'text,v1_2,55.333,110.417,{baseline:middle}',
                    'text,v2_2,459.557,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,404.224,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,454.224,55,101.056,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,404.224,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,454.224,77.167,101.056,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,404.224,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,454.224,99.333,101.056,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 line1 line 2,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,45.333,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 long line very long line,45.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,515.28,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,45.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,302.973,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,45.333,110.417,{baseline:middle}',
                    'text,f2_1 line long line long line,302.973,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,77.167,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,99.333,257.64,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F1,45.333,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F2,217.093,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,388.853,88.25,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1 line,45.333,110.417,{baseline:middle}',
                    'text,f2_1 line long line long line,217.093,110.417,{baseline:middle}',
                    'text,f3,388.853,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,77.167,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,77.167,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,99.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,99.333,171.76,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,217.093,68.139,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,217.093,103.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,388.853,96.472,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3,217.093,147.194,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,45.333,180.25,{baseline:middle}',
                    'text,f3_1,217.093,180.25,{baseline:middle}',
                    'text,f4_1,388.853,180.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,171.76,114.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,55,343.52,26.278',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,81.278,171.76,43.944',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,81.278,171.76,87.889',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,125.222,171.76,43.944',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,169.167,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,169.167,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,169.167,171.76,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,45.333,71.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,217.093,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,217.093,102.833,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8,388.853,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3,217.093,154.167,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,45.333,190.917,{baseline:middle}',
                    'text,f3_1,217.093,190.917,{baseline:middle}',
                    'text,f4_1,388.853,190.917,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,171.76,124.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,55,343.52,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,77.167,171.76,51.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,77.167,171.76,102.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,128.5,171.76,51.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,179.833,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,179.833,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,179.833,171.76,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,45.333,77.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,217.093,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,217.093,90.444,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,388.853,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,217.093,117,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4,217.093,143.556,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,45.333,202.417,{baseline:middle}',
                    'text,f3_1_1,217.093,202.417,{baseline:middle}',
                    'text,f4_1,388.853,202.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,171.76,136.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,55,343.52,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,77.167,171.76,26.556',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,77.167,171.76,114.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,103.722,171.76,26.556',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,130.278,171.76,61.056',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,191.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,191.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,191.333,171.76,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,45.333,82.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1 line,217.093,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,217.093,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6\n' +
'line7\n' +
'line8\n' +
'line9,388.853,93.167,{baseline:middle}',
                    'setTextColor,128',
                    'text,f1_2_3,217.093,110.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,line1\n' +
'line2\n' +
'line3\n' +
'line4\n' +
'line5\n' +
'line6,217.093,132.583,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,f1_1,45.333,212.25,{baseline:middle}',
                    'text,f3_1_1,217.093,212.25,{baseline:middle}',
                    'text,f4_1,388.853,212.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,171.76,146.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,55,343.52,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,77.167,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,77.167,171.76,124',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,99.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,121.5,171.76,79.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,201.167,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,201.167,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,201.167,171.76,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,302.973,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 line line,45.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2 line long line,45.333,110.417,{baseline:middle}',
                    'text,f1_3 line long line long line,302.973,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line,45.333,132.583,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2 line,45.333,154.75,{baseline:middle}',
                    'text,f2_3 line long line line,302.973,154.75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,99.333,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,121.5,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,143.667,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,143.667,257.64,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,302.973,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 long line,45.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_2 long line long line long line,45.333,110.417,{baseline:middle}',
                    'text,f1_3 line,302.973,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f2_1 long line long line long line,45.333,132.583,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_2 line long line,45.333,154.75,{baseline:middle}',
                    'text,f2_3,302.973,154.75,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,99.333,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,121.5,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,143.667,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,143.667,257.64,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,302.973,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line,45.333,88.25,{baseline:middle}',
                    'text,F2: f2_2 long line long line long line long line,45.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2_3 long line long line,45.333,132.583,{baseline:middle}',
                    'text,f2_4,302.973,132.583,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line,45.333,154.75,{baseline:middle}',
                    'text,F2: f1_2 long line,45.333,176.917,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f1_3 line,45.333,199.083,{baseline:middle}',
                    'text,f1_4,302.973,199.083,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,121.5,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,121.5,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,143.667,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,165.833,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,188,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,188,257.64,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,217.093,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,388.853,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 line long line (Max: f1 line long line),45.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 line,45.333,110.417,{baseline:middle}',
                    'text,f3 long line long line long line,217.093,110.417,{baseline:middle}',
                    'text,f4 long line,388.853,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,55,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,55,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,99.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,99.333,171.76,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,302.973,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line long line long line (Max: f1 long line\n' +
'long line long line),45.333,88.25,{baseline:middle}',
                    'text,Max: f4 long line long line,302.973,94,{baseline:middle}',
                    'text,F2: f2 long line (Max of F1 is f1 long line long line\n' +
'long line),45.333,121.917,{baseline:middle}',
                    'text,Max: f4 long line long line,302.973,127.667,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3 line,45.333,155.583,{baseline:middle}',
                    'text,f4 long line long line,302.973,155.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,40,77.167,297.64,77.167',
                    'line,40,77.167,40,110.833',
                    'line,40,110.833,297.64,110.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,297.64,77.167,555.28,77.167',
                    'line,555.28,77.167,555.28,110.833',
                    'line,297.64,110.833,555.28,110.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,40,110.833,297.64,110.833',
                    'line,40,110.833,40,144.5',
                    'line,40,144.5,297.64,144.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'line,297.64,110.833,555.28,110.833',
                    'line,555.28,110.833,555.28,144.5',
                    'line,297.64,144.5,555.28,144.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,144.5,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,144.5,257.64,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F2,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F3,217.093,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,388.853,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 long line (Max: f1 long line),45.333,88.25,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f2 very long line very long line,45.333,110.417,{baseline:middle}',
                    'text,f3 line,217.093,110.417,{baseline:middle}',
                    'text,f4 long line,388.853,110.417,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3 line,217.093,132.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,55,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,55,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,99.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,99.333,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,121.5,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,211.76,121.5,171.76,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,383.52,121.5,171.76,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F3,55.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,F4,307.973,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1 very ling line very long line very long line,55.333,88.25,{baseline:middle}',
                    'text,F2: f2_1 line,55.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55.333,132.583,{baseline:middle}',
                    'text,f4,307.973,149.833,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55.333,189.25,{baseline:middle}',
                    'text,Max: f3line1\n' +
'line2\n' +
'line3\n' +
'line4,55.333,245.917,{baseline:middle}',
                    'text,F1: f1 very long line very long line,55.333,302.583,{baseline:middle}',
                    'text,F2: f2_2very long line very long line,55.333,324.75,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3very long line very long line,55.333,346.917,{baseline:middle}',
                    'text,f4,307.973,346.917,{baseline:middle}',
                    'setFont,helvetica,bold,',
                    'text,Max: f3very long line very long line,55.333,369.083,{baseline:middle}',
                    'text,Max: f3very long line very long line,55.333,391.25,{baseline:middle}',
                    'text,Max: f3very long line very long line,55.333,413.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,55,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,55,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,77.167,505.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,99.333,505.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,121.5,252.64,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,121.5,252.64,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,178.167,252.64,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,178.167,252.64,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,234.833,252.64,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,234.833,252.64,56.667',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,291.5,505.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,313.667,505.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,335.833,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,335.833,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,358,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,358,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,380.167,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,380.167,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,50,402.333,252.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,302.64,402.333,252.64,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,45.333,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line,45.333,88.25,{baseline:middle}',
                    'text,F2: f2_1 line long line long line,45.333,110.417,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,121.5,515.28,0',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 long line 1 ling line 2,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3 line,302.973,66.083,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line (Max: f1_1 line),45.333,88.25,{baseline:middle}',
                    'text,F2: f2_1 line long line long line (Max of F1 is f1_1 line),45.333,110.417,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,long line very long line,302.973,132.583,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,55,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,99.333,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,121.5,257.64,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,297.64,121.5,257.64,22.167',
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,Band1 line,45.333,66.083,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_1 long line very long line,45.333,91.333,{baseline:middle}',
                    'setTextColor,128',
                    'text,Band1_2,251.445,91.333,{baseline:middle}',
                    'setTextColor,128',
                    'text,f7 long line very long\n' +
'linelong line very\n' +
'long linelong line\n' +
'very long linelong\n' +
'line very long line,457.557,88.25,{baseline:middle}',
                    'setTextColor,128',
                    'text,f3  long line,45.333,125.417,{baseline:middle}',
                    'setTextColor,128',
                    'text,f4  long line very\n' +
'long line,148.389,119.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,f5 long line very long\n' +
'line,251.445,119.667,{baseline:middle}',
                    'setTextColor,128',
                    'text,F6,354.501,125.417,{baseline:middle}',
                    'setTextColor,#000000',
                    'setFont,helvetica,bold,',
                    'text,F1: f1_1 line,45.333,156.417,{baseline:middle}',
                    'text,F2: f2_1 long line very long line,45.333,178.583,{baseline:middle}',
                    'setFont,helvetica,normal,',
                    'text,f3_1,45.333,212.25,{baseline:middle}',
                    'text,f4_1 very long line\n' +
'very long line very\n' +
'long line,148.389,200.75,{baseline:middle}',
                    'text,f5_1 long line,251.445,212.25,{baseline:middle}',
                    'text,f6_1,354.501,212.25,{baseline:middle}',
                    'text,f7_1 line,457.557,212.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,55,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,77.167,206.112,28.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,246.112,77.167,206.112,28.333',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,452.224,77.167,103.056,68.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,105.5,103.056,39.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,143.056,105.5,103.056,39.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,246.112,105.5,103.056,39.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,349.168,105.5,103.056,39.833',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,145.333,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,167.5,515.28,22.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,40,189.667,103.056,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,143.056,189.667,103.056,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,246.112,189.667,103.056,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,349.168,189.667,103.056,45.167',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,452.224,189.667,103.056,45.167',
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
