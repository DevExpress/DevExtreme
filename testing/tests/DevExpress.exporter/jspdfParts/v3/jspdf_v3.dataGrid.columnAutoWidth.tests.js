import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfColumnWidthsTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('column auto width', moduleConfig, () => {
            QUnit.test('Empty', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({});

                const expectedLog = [
                    'setLineWidth,1',
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
                    'text,f1,0,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,595.28,18.4'
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
                    'text,f1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,585.28,18.4'
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
                    'text,f1,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4'
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
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,302.64,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'text,v2_1,302.64,42.6,{baseline:middle}',
                    'text,v1_2,10,61,{baseline:middle}',
                    'text,v2_2,302.64,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,292.64,18.4',
                    'setLineWidth,1',
                    'rect,302.64,15,292.64,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,292.64,18.4',
                    'setLineWidth,1',
                    'rect,302.64,33.4,292.64,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,292.64,18.4',
                    'setLineWidth,1',
                    'rect,302.64,51.8,292.64,18.4'
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
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'text,v2_1,110,42.6,{baseline:middle}',
                    'text,v1_2,10,61,{baseline:middle}',
                    'text,v2_2,110,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,18.4',
                    'setLineWidth,1',
                    'rect,110,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,100,18.4',
                    'setLineWidth,1',
                    'rect,110,51.8,200,18.4'
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
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,68.528,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'text,v2_1,68.528,42.6,{baseline:middle}',
                    'text,v1_2,10,61,{baseline:middle}',
                    'text,v2_2,68.528,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,58.528,18.4',
                    'setLineWidth,1',
                    'rect,68.528,15,526.752,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,58.528,18.4',
                    'setLineWidth,1',
                    'rect,68.528,33.4,526.752,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,58.528,18.4',
                    'setLineWidth,1',
                    'rect,68.528,51.8,526.752,18.4'
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
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,478.224,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'text,v2_1,478.224,42.6,{baseline:middle}',
                    'text,v1_2,10,61,{baseline:middle}',
                    'text,v2_2,478.224,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,468.224,18.4',
                    'setLineWidth,1',
                    'rect,478.224,15,117.056,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,468.224,18.4',
                    'setLineWidth,1',
                    'rect,478.224,33.4,117.056,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,468.224,18.4',
                    'setLineWidth,1',
                    'rect,478.224,51.8,117.056,18.4'
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
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,110,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'text,v2_1,110,42.6,{baseline:middle}',
                    'text,v1_2,10,61,{baseline:middle}',
                    'text,v2_2,110,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,18.4',
                    'setLineWidth,1',
                    'rect,110,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,100,18.4',
                    'setLineWidth,1',
                    'rect,110,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,100,18.4',
                    'setLineWidth,1',
                    'rect,110,51.8,200,18.4'
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
                    'text,F1,10,24.2,{baseline:middle}',
                    'text,F2,478.224,24.2,{baseline:middle}',
                    'text,v1_1,10,42.6,{baseline:middle}',
                    'text,v2_1,478.224,42.6,{baseline:middle}',
                    'text,v1_2,10,61,{baseline:middle}',
                    'text,v2_2,478.224,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,468.224,18.4',
                    'setLineWidth,1',
                    'rect,478.224,15,117.056,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,468.224,18.4',
                    'setLineWidth,1',
                    'rect,478.224,33.4,117.056,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,468.224,18.4',
                    'setLineWidth,1',
                    'rect,478.224,51.8,117.056,18.4'
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
                    'text,Band1 line1 line 2,0,24.2,{baseline:middle}',
                    'text,F1,0,42.6,{baseline:middle}',
                    'text,f1_1 long line very long line,0,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,595.28,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,595.28,18.4',
                    'setLineWidth,1',
                    'rect,0,51.8,595.28,18.4'
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
                    'text,Band1 long line 1 ling line 2,0,24.2,{baseline:middle}',
                    'text,F1,0,42.6,{baseline:middle}',
                    'text,F2,297.64,42.6,{baseline:middle}',
                    'text,f1_1 line,0,61,{baseline:middle}',
                    'text,f2_1 line long line long line,297.64,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,595.28,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,297.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,33.4,297.64,18.4',
                    'setLineWidth,1',
                    'rect,0,51.8,297.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,51.8,297.64,18.4'
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
                    'text,Band1 long line 1 ling line 2,0,24.2,{baseline:middle}',
                    'text,F1,0,42.6,{baseline:middle}',
                    'text,F2,198.427,42.6,{baseline:middle}',
                    'text,F3,396.853,42.6,{baseline:middle}',
                    'text,f1_1 line,0,61,{baseline:middle}',
                    'text,f2_1 line long line long line,198.427,61,{baseline:middle}',
                    'text,f3,396.853,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,595.28,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,198.427,18.4',
                    'setLineWidth,1',
                    'rect,198.427,33.4,198.427,18.4',
                    'setLineWidth,1',
                    'rect,396.853,33.4,198.427,18.4',
                    'setLineWidth,1',
                    'rect,0,51.8,198.427,18.4',
                    'setLineWidth,1',
                    'rect,198.427,51.8,198.427,18.4',
                    'setLineWidth,1',
                    'rect,396.853,51.8,198.427,18.4'
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
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,0,24.2,{baseline:middle}',
                    'text,Band1 line,198.427,30.333,{baseline:middle}',
                    'text,Band1_2,198.427,79.4,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6,396.853,67.133,{baseline:middle}',
                    'text,f3,198.427,146.867,{baseline:middle}',
                    'text,f1_1,0,189.8,{baseline:middle}',
                    'text,f3_1,198.427,189.8,{baseline:middle}',
                    'text,f4_1,396.853,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,198.427,165.6',
                    'setLineWidth,1',
                    'rect,198.427,15,396.853,30.667',
                    'setLineWidth,1',
                    'rect,198.427,45.667,198.427,67.467',
                    'setLineWidth,1',
                    'rect,396.853,45.667,198.427,134.933',
                    'setLineWidth,1',
                    'rect,198.427,113.133,198.427,67.467',
                    'setLineWidth,1',
                    'rect,0,180.6,198.427,18.4',
                    'setLineWidth,1',
                    'rect,198.427,180.6,198.427,18.4',
                    'setLineWidth,1',
                    'rect,396.853,180.6,198.427,18.4'
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
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,0,24.2,{baseline:middle}',
                    'text,Band1 line,198.427,24.2,{baseline:middle}',
                    'text,Band1_2,198.427,70.2,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8,396.853,42.6,{baseline:middle}',
                    'text,f3,198.427,143.8,{baseline:middle}',
                    'text,f1_1,0,189.8,{baseline:middle}',
                    'text,f3_1,198.427,189.8,{baseline:middle}',
                    'text,f4_1,396.853,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,198.427,165.6',
                    'setLineWidth,1',
                    'rect,198.427,15,396.853,18.4',
                    'setLineWidth,1',
                    'rect,198.427,33.4,198.427,73.6',
                    'setLineWidth,1',
                    'rect,396.853,33.4,198.427,147.2',
                    'setLineWidth,1',
                    'rect,198.427,107,198.427,73.6',
                    'setLineWidth,1',
                    'rect,0,180.6,198.427,18.4',
                    'setLineWidth,1',
                    'rect,198.427,180.6,198.427,18.4',
                    'setLineWidth,1',
                    'rect,396.853,180.6,198.427,18.4'
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
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,0,33.4,{baseline:middle}',
                    'text,Band1 line,198.427,24.2,{baseline:middle}',
                    'text,Band1_2,198.427,51.8,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,396.853,42.6,{baseline:middle}',
                    'text,f1_2_3,198.427,88.6,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4,198.427,125.4,{baseline:middle}',
                    'text,f1_1,0,208.2,{baseline:middle}',
                    'text,f3_1_1,198.427,208.2,{baseline:middle}',
                    'text,f4_1,396.853,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,198.427,184',
                    'setLineWidth,1',
                    'rect,198.427,15,396.853,18.4',
                    'setLineWidth,1',
                    'rect,198.427,33.4,198.427,36.8',
                    'setLineWidth,1',
                    'rect,396.853,33.4,198.427,165.6',
                    'setLineWidth,1',
                    'rect,198.427,70.2,198.427,36.8',
                    'setLineWidth,1',
                    'rect,198.427,107,198.427,92',
                    'setLineWidth,1',
                    'rect,0,199,198.427,18.4',
                    'setLineWidth,1',
                    'rect,198.427,199,198.427,18.4',
                    'setLineWidth,1',
                    'rect,396.853,199,198.427,18.4'
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
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,0,33.4,{baseline:middle}',
                    'text,Band1 line,198.427,24.2,{baseline:middle}',
                    'text,Band1_2,198.427,45.667,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9,396.853,42.6,{baseline:middle}',
                    'text,f1_2_3,198.427,70.2,{baseline:middle}',
                    'text,line1\nline2\nline3\nline4\nline5\nline6,198.427,94.733,{baseline:middle}',
                    'text,f1_1,0,208.2,{baseline:middle}',
                    'text,f3_1_1,198.427,208.2,{baseline:middle}',
                    'text,f4_1,396.853,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,198.427,184',
                    'setLineWidth,1',
                    'rect,198.427,15,396.853,18.4',
                    'setLineWidth,1',
                    'rect,198.427,33.4,198.427,24.533',
                    'setLineWidth,1',
                    'rect,396.853,33.4,198.427,165.6',
                    'setLineWidth,1',
                    'rect,198.427,57.933,198.427,24.533',
                    'setLineWidth,1',
                    'rect,198.427,82.467,198.427,116.533',
                    'setLineWidth,1',
                    'rect,0,199,198.427,18.4',
                    'setLineWidth,1',
                    'rect,198.427,199,198.427,18.4',
                    'setLineWidth,1',
                    'rect,396.853,199,198.427,18.4'
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
                    'text,F2,0,24.2,{baseline:middle}',
                    'text,F3,297.64,24.2,{baseline:middle}',
                    'text,F1: f1 line line,0,42.6,{baseline:middle}',
                    'text,f1_2 line long line,10,61,{baseline:middle}',
                    'text,f1_3 line long line long line,297.64,61,{baseline:middle}',
                    'text,F1: f1 long line long line long line,0,79.4,{baseline:middle}',
                    'text,f2_2 line,10,97.8,{baseline:middle}',
                    'text,f2_3 line long line line,297.64,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,297.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,15,297.64,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,595.28,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,287.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,51.8,297.64,18.4',
                    'setLineWidth,1',
                    'rect,0,70.2,595.28,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,287.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,88.6,297.64,18.4'
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
                    'text,F2,0,24.2,{baseline:middle}',
                    'text,F3,297.64,24.2,{baseline:middle}',
                    'text,F1: f1_1 long line,0,42.6,{baseline:middle}',
                    'text,f1_2 long line long line long line,10,61,{baseline:middle}',
                    'text,f1_3 line,297.64,61,{baseline:middle}',
                    'text,F1: f2_1 long line long line long line,0,79.4,{baseline:middle}',
                    'text,f2_2 line long line,10,97.8,{baseline:middle}',
                    'text,f2_3,297.64,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,297.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,15,297.64,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,595.28,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,287.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,51.8,297.64,18.4',
                    'setLineWidth,1',
                    'rect,0,70.2,595.28,18.4',
                    'setLineWidth,1',
                    'rect,10,88.6,287.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,88.6,297.64,18.4'
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
                    'text,F3,0,24.2,{baseline:middle}',
                    'text,F4,297.64,24.2,{baseline:middle}',
                    'text,F1: f1 long line,0,42.6,{baseline:middle}',
                    'text,F2: f2_2 long line long line long line long line,10,61,{baseline:middle}',
                    'text,f2_3 long line long line,20,79.4,{baseline:middle}',
                    'text,f2_4,297.64,79.4,{baseline:middle}',
                    'text,F1: f1 long line long line long line,0,97.8,{baseline:middle}',
                    'text,F2: f1_2 long line,10,116.2,{baseline:middle}',
                    'text,f1_3 line,20,134.6,{baseline:middle}',
                    'text,f1_4,297.64,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,297.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,15,297.64,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,595.28,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,585.28,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,277.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,70.2,297.64,18.4',
                    'setLineWidth,1',
                    'rect,0,88.6,595.28,18.4',
                    'setLineWidth,1',
                    'rect,10,107,585.28,18.4',
                    'setLineWidth,1',
                    'rect,20,125.4,277.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,125.4,297.64,18.4'
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
                    'text,F2,0,24.2,{baseline:middle}',
                    'text,F3,190,24.2,{baseline:middle}',
                    'text,F4,380,24.2,{baseline:middle}',
                    'text,F1: f1 line long line (Max: f1 line long line),0,42.6,{baseline:middle}',
                    'text,f2 line,10,70.2,{baseline:middle}',
                    'text,f3 long line long line long\nline,190,61,{baseline:middle}',
                    'text,f4 long line,380,70.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,190,18.4',
                    'setLineWidth,1',
                    'rect,190,15,190,18.4',
                    'setLineWidth,1',
                    'rect,380,15,190,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,570,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,180,36.8',
                    'setLineWidth,1',
                    'rect,190,51.8,190,36.8',
                    'setLineWidth,1',
                    'rect,380,51.8,190,36.8'
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
                    'text,F3,0,24.2,{baseline:middle}',
                    'text,F4,297.64,24.2,{baseline:middle}',
                    'text,F1: f1 long line long line long line (Max: f1\nlong line long line long line),0,42.6,{baseline:middle}',
                    'text,Max: f4 long line long line,297.64,51.8,{baseline:middle}',
                    'text,F2: f2 long line (Max of F1 is f1 long line\nlong line long line),10,79.4,{baseline:middle}',
                    'text,Max: f4 long line long line,297.64,88.6,{baseline:middle}',
                    'text,f3 line,20,116.2,{baseline:middle}',
                    'text,f4 long line long line,297.64,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,297.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,15,297.64,18.4',
                    'setLineWidth,1',
                    'line,0,33.4,297.64,33.4',
                    'line,0,33.4,0,70.2',
                    'line,0,70.2,297.64,70.2',
                    'setLineWidth,1',
                    'line,297.64,33.4,595.28,33.4',
                    'line,595.28,33.4,595.28,70.2',
                    'line,297.64,70.2,595.28,70.2',
                    'setLineWidth,1',
                    'line,10,70.2,297.64,70.2',
                    'line,10,70.2,10,107',
                    'line,10,107,297.64,107',
                    'setLineWidth,1',
                    'line,297.64,70.2,595.28,70.2',
                    'line,595.28,70.2,595.28,107',
                    'line,297.64,107,595.28,107',
                    'setLineWidth,1',
                    'rect,20,107,277.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,107,297.64,18.4'
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
                    'text,F2,0,24.2,{baseline:middle}',
                    'text,F3,190,24.2,{baseline:middle}',
                    'text,F4,380,24.2,{baseline:middle}',
                    'text,F1: f1 long line (Max: f1 long line),0,42.6,{baseline:middle}',
                    'text,f2 very long line very\nlong line,10,61,{baseline:middle}',
                    'text,f3 line,190,70.2,{baseline:middle}',
                    'text,f4 long line,380,70.2,{baseline:middle}',
                    'text,Max: f3 line,190,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,190,18.4',
                    'setLineWidth,1',
                    'rect,190,15,190,18.4',
                    'setLineWidth,1',
                    'rect,380,15,190,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,570,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,180,36.8',
                    'setLineWidth,1',
                    'rect,190,51.8,190,36.8',
                    'setLineWidth,1',
                    'rect,380,51.8,190,36.8',
                    'setLineWidth,1',
                    'rect,10,88.6,180,18.4',
                    'setLineWidth,1',
                    'rect,190,88.6,190,18.4',
                    'setLineWidth,1',
                    'rect,380,88.6,190,18.4'
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
                    'text,F3,10,24.2,{baseline:middle}',
                    'text,F4,302.64,24.2,{baseline:middle}',
                    'text,F1: f1 very ling line very long line very long line,10,42.6,{baseline:middle}',
                    'text,F2: f2_1 line,20,61,{baseline:middle}',
                    'text,f3line1\nline2\nline3\nline4,30,79.4,{baseline:middle}',
                    'text,f4,302.64,107,{baseline:middle}',
                    'text,Max: f3line1\nline2\nline3\nline4,30,153,{baseline:middle}',
                    'text,Max: f3line1\nline2\nline3\nline4,20,226.6,{baseline:middle}',
                    'text,F1: f1 very long line very long line,10,300.2,{baseline:middle}',
                    'text,F2: f2_2very long line very long line,20,318.6,{baseline:middle}',
                    'text,f3very long line very long line,30,337,{baseline:middle}',
                    'text,f4,302.64,337,{baseline:middle}',
                    'text,Max: f3very long line very long line,30,355.4,{baseline:middle}',
                    'text,Max: f3very long line very long line,20,373.8,{baseline:middle}',
                    'text,Max: f3very long line very long line,10,392.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,292.64,18.4',
                    'setLineWidth,1',
                    'rect,302.64,15,292.64,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,585.28,18.4',
                    'setLineWidth,1',
                    'rect,20,51.8,575.28,18.4',
                    'setLineWidth,1',
                    'rect,30,70.2,272.64,73.6',
                    'setLineWidth,1',
                    'rect,302.64,70.2,292.64,73.6',
                    'setLineWidth,1',
                    'rect,30,143.8,272.64,73.6',
                    'setLineWidth,1',
                    'rect,302.64,143.8,292.64,73.6',
                    'setLineWidth,1',
                    'rect,20,217.4,282.64,73.6',
                    'setLineWidth,1',
                    'rect,302.64,217.4,292.64,73.6',
                    'setLineWidth,1',
                    'rect,10,291,585.28,18.4',
                    'setLineWidth,1',
                    'rect,20,309.4,575.28,18.4',
                    'setLineWidth,1',
                    'rect,30,327.8,272.64,18.4',
                    'setLineWidth,1',
                    'rect,302.64,327.8,292.64,18.4',
                    'setLineWidth,1',
                    'rect,30,346.2,272.64,18.4',
                    'setLineWidth,1',
                    'rect,302.64,346.2,292.64,18.4',
                    'setLineWidth,1',
                    'rect,20,364.6,282.64,18.4',
                    'setLineWidth,1',
                    'rect,302.64,364.6,292.64,18.4',
                    'setLineWidth,1',
                    'rect,10,383,292.64,18.4',
                    'setLineWidth,1',
                    'rect,302.64,383,292.64,18.4'
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
                    'text,Band1 long line 1 ling line 2,0,24.2,{baseline:middle}',
                    'text,F1: f1_1 line,0,42.6,{baseline:middle}',
                    'text,F2: f2_1 line long line long line,10,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,595.28,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,595.28,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,585.28,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,575.28,0'
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
                    'text,Band1 long line 1 ling line 2,0,24.2,{baseline:middle}',
                    'text,f3 line,297.64,24.2,{baseline:middle}',
                    'text,F1: f1_1 line (Max: f1_1 line),0,42.6,{baseline:middle}',
                    'text,F2: f2_1 line long line long line (Max of F1 is f1_1 line),10,61,{baseline:middle}',
                    'text,long line very long line,297.64,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,297.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,15,297.64,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,595.28,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,585.28,18.4',
                    'setLineWidth,1',
                    'rect,20,70.2,277.64,18.4',
                    'setLineWidth,1',
                    'rect,297.64,70.2,297.64,18.4'
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
                    'text,Band1 line,0,24.2,{baseline:middle}',
                    'text,Band1_1 long line very long line,0,56.4,{baseline:middle}',
                    'text,Band1_2,238.112,56.4,{baseline:middle}',
                    'text,f7 long line very\nlong linelong line\nvery long\nlinelong line very\nlong linelong line\nvery long line,476.224,42.6,{baseline:middle}',
                    'text,f3  long line,0,111.6,{baseline:middle}',
                    'text,f4  long line very\nlong line,119.056,102.4,{baseline:middle}',
                    'text,f5 long line very\nlong line,238.112,102.4,{baseline:middle}',
                    'text,F6,357.168,111.6,{baseline:middle}',
                    'text,F1: f1_1 line,0,153,{baseline:middle}',
                    'text,F2: f2_1 long line very long line,10,171.4,{baseline:middle}',
                    'text,f3_1,20,217.4,{baseline:middle}',
                    'text,f4_1 very long\nline very long\nline very long\nline,119.056,189.8,{baseline:middle}',
                    'text,f5_1 long line,238.112,217.4,{baseline:middle}',
                    'text,f6_1,357.168,217.4,{baseline:middle}',
                    'text,f7_1 line,476.224,217.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,15,595.28,18.4',
                    'setLineWidth,1',
                    'rect,0,33.4,238.112,46',
                    'setLineWidth,1',
                    'rect,238.112,33.4,238.112,46',
                    'setLineWidth,1',
                    'rect,476.224,33.4,119.056,110.4',
                    'setLineWidth,1',
                    'rect,0,79.4,119.056,64.4',
                    'setLineWidth,1',
                    'rect,119.056,79.4,119.056,64.4',
                    'setLineWidth,1',
                    'rect,238.112,79.4,119.056,64.4',
                    'setLineWidth,1',
                    'rect,357.168,79.4,119.056,64.4',
                    'setLineWidth,1',
                    'rect,0,143.8,595.28,18.4',
                    'setLineWidth,1',
                    'rect,10,162.2,585.28,18.4',
                    'setLineWidth,1',
                    'rect,20,180.6,99.056,73.6',
                    'setLineWidth,1',
                    'rect,119.056,180.6,119.056,73.6',
                    'setLineWidth,1',
                    'rect,238.112,180.6,119.056,73.6',
                    'setLineWidth,1',
                    'rect,357.168,180.6,119.056,73.6',
                    'setLineWidth,1',
                    'rect,476.224,180.6,119.056,73.6'
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
