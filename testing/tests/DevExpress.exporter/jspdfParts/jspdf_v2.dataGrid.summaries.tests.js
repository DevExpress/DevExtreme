import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,18.4',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,18.4',
                    'text,F1: f1 (Max: f1),10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,250,18.4',
                    'text,f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,70,18.4',
                    'text,f3,90,61,{baseline:middle}', 'setLineWidth,1', 'rect,90,51.8,90,18.4',
                    'text,f4,180,61,{baseline:middle}', 'setLineWidth,1', 'rect,180,51.8,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
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
                    dataSource: [{ f1: 'f1 11111 1111 111111111', f2: 'f2 1111 11', f3: 'f3 11111111 111 1111 1111 111111 11', f4: 'f4 1111' }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'text,F4,180,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,180,15,80,18.4',
                    'text,F1: f1 11111 1111 111111111,(Max: f1 11111 1111 111111111),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,250,36.8',
                    'text,f2 1111,11,20,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,70.2,70,73.6',
                    'text,f3 11111111,111 1111,1111,111111 11,90,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,70.2,90,73.6',
                    'text,f4 1111,180,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,180,70.2,80,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1 (Max: f1, Max of F2 is f2),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,23,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,23,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}',
                    'setLineWidth,1', 'line,10,31,160,31', 'line,10,31,10,47', 'line,10,47,160,47',
                    'text,Max: f3,160,39,{baseline:middle}',
                    'setLineWidth,1', 'line,160,31,250,31', 'line,160,47,250,47',
                    'setLineWidth,1', 'line,250,31,330,31', 'line,330,31,330,47', 'line,250,47,330,47',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16',
                    'text,f3,160,55,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,55,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,23,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,23,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,160,31', 'line,10,31,10,47', 'line,10,47,160,47',
                    'text,Max: f3,160,39,{baseline:middle}', 'setLineWidth,1', 'line,160,31,250,31', 'line,160,47,250,47',
                    'text,Max: f4,250,39,{baseline:middle}', 'setLineWidth,1', 'line,250,31,330,31', 'line,330,31,330,47', 'line,250,47,330,47',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16', 'text,f3,160,55,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,55,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,23,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,23,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,250,31', 'line,10,31,10,47', 'line,10,47,250,47',
                    'text,Max: f4,250,39,{baseline:middle}', 'setLineWidth,1', 'line,250,31,330,31', 'line,330,31,330,47', 'line,250,47,330,47',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16', 'text,f3,160,55,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,55,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1 (Max of F2 is f2),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,47', 'line,10,47,90,47',
                    'text,Max: f3,90,39,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,47,180,47',
                    'setLineWidth,1', 'line,180,31,260,31', 'line,260,31,260,47', 'line,180,47,260,47',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,47', 'line,10,47,90,47',
                    'text,Max: f3,90,39,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,47,180,47',
                    'text,Max: f4,180,39,{baseline:middle}', 'setLineWidth,1', 'line,180,31,260,31', 'line,260,31,260,47', 'line,180,47,260,47',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,47', 'line,10,47,180,47',
                    'text,Max: f4,180,39,{baseline:middle}', 'setLineWidth,1', 'line,180,31,260,31', 'line,260,31,260,47', 'line,180,47,260,47',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F4,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,260,31', 'line,10,31,10,47', 'line,10,47,260,47',
                    'text,Max: f4,260,39,{baseline:middle}', 'setLineWidth,1', 'line,260,31,360,31', 'line,360,31,360,47', 'line,260,47,360,47',
                    'text,F2: f2 (Max of F1 is f1),20,55,{baseline:middle}', 'setLineWidth,1', 'line,20,47,260,47', 'line,20,47,20,63', 'line,20,63,260,63',
                    'text,Max: f4,260,55,{baseline:middle}', 'setLineWidth,1', 'line,260,47,360,47', 'line,360,47,360,63', 'line,260,63,360,63',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,18.4',
                    'text,F4,260,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,18.4',
                    'text,F1: f1 (Max: f1),10,42.6,{baseline:middle}', 'setLineWidth,1', 'line,10,33.4,260,33.4', 'line,10,33.4,10,51.8', 'line,10,51.8,260,51.8',
                    'text,Max: f4,260,42.6,{baseline:middle}', 'setLineWidth,1', 'line,260,33.4,360,33.4', 'line,360,33.4,360,51.8', 'line,260,51.8,360,51.8',
                    'text,F2: f2 (Max of F1 is f1),20,61,{baseline:middle}', 'setLineWidth,1', 'line,20,51.8,260,51.8', 'line,20,51.8,20,70.2', 'line,20,70.2,260,70.2',
                    'text,Max: f4,260,61,{baseline:middle}', 'setLineWidth,1', 'line,260,51.8,360,51.8', 'line,360,51.8,360,70.2', 'line,260,70.2,360,70.2',
                    'text,f3,30,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,30,70.2,230,18.4',
                    'text,f4,260,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,260,70.2,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1, f3, f4], groupItems: [f1, {f4, alignByColumn}] - height auto, word wrap enabled', function(assert) {
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
                    dataSource: [{ f1: 'f1 1111 1111 1111111 1111111111 11111', f2: 'f2 11111 111', f3: 'f3 11111 1111111 1111111111 1111111111 111111111', f4: 'f4 111' }]
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,250,18.4',
                    'text,F4,260,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,15,100,18.4',
                    'text,F1: f1 1111 1111 1111111,1111111111 11111 (Max: f1 1111,1111 1111111 1111111111 11111),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'line,10,33.4,260,33.4',
                    'line,10,33.4,10,88.6',
                    'line,10,88.6,260,88.6',
                    'text,Max: f4 111,260,61,{baseline:middle}',
                    'setLineWidth,1',
                    'line,260,33.4,360,33.4',
                    'line,360,33.4,360,88.6',
                    'line,260,88.6,360,88.6',
                    'text,F2: f2 11111 111 (Max of F1 is f1,1111 1111 1111111 1111111111,11111),20,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'line,20,88.6,260,88.6',
                    'line,20,88.6,20,143.8',
                    'line,20,143.8,260,143.8',
                    'text,Max: f4 111,260,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'line,260,88.6,360,88.6',
                    'line,360,88.6,360,143.8',
                    'line,260,143.8,360,143.8',
                    'text,f3 11111 1111111 1111111111,1111111111 111111111,30,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,143.8,230,36.8',
                    'text,f4 111,260,162.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,143.8,100,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,23,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,23,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,320,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16',
                    'text,f3,160,55,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,55,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16',
                    'setLineWidth,1', 'rect,20,63,140,16', 'text,Max: f3,160,71,{baseline:middle}',
                    'setLineWidth,1', 'rect,160,63,90,16',
                    'setLineWidth,1', 'rect,250,63,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,18.4',
                    'text,F3,160,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,18.4',
                    'text,F4,250,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,18.4',
                    'text,F1: f1 (Max: f1),10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,320,18.4',
                    'text,f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,140,18.4',
                    'text,f3,160,61,{baseline:middle}', 'setLineWidth,1', 'rect,160,51.8,90,18.4',
                    'text,f4,250,61,{baseline:middle}', 'setLineWidth,1', 'rect,250,51.8,80,18.4', 'setLineWidth,1', 'rect,20,70.2,140,18.4',
                    'text,Max: f3,160,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,160,70.2,90,18.4', 'setLineWidth,1', 'rect,250,70.2,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [f1, { f3, alignByColumn, showInGroupFooter }] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
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
                    dataSource: [{ f1: 'f1 1111 111', f2: 'f2 1111111 11111 111', f3: 'f3', f4: 'f4 1111111 1111111 111111111 1111' }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,150,18.4',
                    'text,F3,160,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,15,90,18.4',
                    'text,F4,250,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,250,15,80,18.4',
                    'text,F1: f1 1111 111 (Max: f1 1111 111),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,320,18.4',
                    'text,f2 1111111 11111,111,20,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,140,73.6',
                    'text,f3,160,88.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,51.8,90,73.6',
                    'text,f4 1111111,1111111,111111111,1111,250,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,250,51.8,80,73.6',
                    'setLineWidth,1',
                    'rect,20,125.4,140,18.4',
                    'text,Max: f3,160,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,160,125.4,90,18.4',
                    'setLineWidth,1',
                    'rect,250,125.4,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,23,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,23,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,320,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16',
                    'text,f3,160,55,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,55,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16',
                    'setLineWidth,1', 'rect,20,63,140,16',
                    'text,Max: f3,160,71,{baseline:middle}', 'setLineWidth,1', 'rect,160,63,90,16',
                    'text,Max: f4,250,71,{baseline:middle}', 'setLineWidth,1', 'rect,250,63,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,23,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,23,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,320,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16',
                    'text,f3,160,55,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,55,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16',
                    'setLineWidth,1', 'rect,20,63,140,16',
                    'setLineWidth,1', 'rect,160,63,90,16',
                    'text,Max: f4,250,71,{baseline:middle}', 'setLineWidth,1', 'rect,250,63,80,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16',
                    'setLineWidth,1', 'rect,20,63,70,16',
                    'text,Max: f3,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'setLineWidth,1', 'rect,180,63,80,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,18.4',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,18.4',
                    'text,F1: f1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,250,18.4',
                    'text,f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,70,18.4',
                    'text,f3,90,61,{baseline:middle}', 'setLineWidth,1', 'rect,90,51.8,90,18.4',
                    'text,f4,180,61,{baseline:middle}', 'setLineWidth,1', 'rect,180,51.8,80,18.4', 'setLineWidth,1', 'rect,20,70.2,70,18.4',
                    'text,Max: f3,90,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,90,70.2,90,18.4', 'setLineWidth,1', 'rect,180,70.2,80,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
                    columns: [
                        { dataField: 'f1', groupIndex: 0 },
                        { dataField: 'f2' },
                        { dataField: 'f3' },
                        { dataField: 'f4' }
                    ],
                    summary: {
                        groupItems: [ { column: 'f3', summaryType: 'max', alignByColumn: true, showInGroupFooter: true } ]
                    },
                    dataSource: [{ f1: 'f1 1111 11', f2: 'f2 11 1111111 11111111111 111111 1', f3: 'f3 1111 1111 11111111 111111 111111', f4: 'f4 111' }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'text,F4,180,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,180,15,80,18.4',
                    'text,F1: f1 1111 11,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,250,18.4',
                    'text,f2 11,1111111 ,1111111,1111,111111 1,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,70,92',
                    'text,f3 1111,1111,11111111,111111,111111,90,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,51.8,90,92',
                    'text,f4 111,180,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,180,51.8,80,92',
                    'setLineWidth,1',
                    'rect,20,143.8,70,92',
                    'text,Max: f3,1111 1111,11111111,111111,111111,90,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,143.8,90,92',
                    'setLineWidth,1',
                    'rect,180,143.8,80,92'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16',
                    'setLineWidth,1', 'rect,20,63,70,16',
                    'text,Max: f3,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f4,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16',
                    'setLineWidth,1', 'rect,20,63,70,16',
                    'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f4,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F4,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2 (Max of F1 is f1),20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16',
                    'setLineWidth,1', 'rect,30,79,230,16',
                    'text,Max: f4,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'setLineWidth,1', 'rect,20,95,240,16',
                    'text,Max: f4,260,103,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,18.4',
                    'text,F4,260,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,18.4',
                    'text,F1: f1 (Max: f1),10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,350,18.4',
                    'text,F2: f2 (Max of F1 is f1),20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,340,18.4',
                    'text,f3,30,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,30,70.2,230,18.4',
                    'text,f4,260,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,260,70.2,100,18.4', 'setLineWidth,1', 'rect,30,88.6,230,18.4',
                    'text,Max: f4,260,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,260,88.6,100,18.4', 'setLineWidth,1', 'rect,20,107,240,18.4',
                    'text,Max: f4,260,116.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,107,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}] - height auto, word wrap enabled', function(assert) {
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
                            { column: 'f1', summaryType: 'max' },
                            { column: 'f4', summaryType: 'max', alignByColumn: true, showInGroupFooter: true }
                        ]
                    },
                    dataSource: [{ f1: 'f1 111111 1111111 11111111 1 111', f2: 'f2 1111111', f3: 'f3 1111111 11111111 11', f4: 'f4 1111 11111111' }]
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,250,18.4',
                    'text,F4,260,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,15,100,18.4',
                    'text,F1: f1 111111 1111111 11111111 1 111 (Max: f1,111111 1111111 11111111 1 111),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,350,36.8',
                    'text,F2: f2 1111111 (Max of F1 is f1 111111,1111111 11111111 1 111),20,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,70.2,340,36.8',
                    'text,f3 1111111 11111111 11,30,125.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,107,230,36.8',
                    'text,f4 1111,11111111,260,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,107,100,36.8',
                    'setLineWidth,1',
                    'rect,30,143.8,230,36.8',
                    'text,Max: f4 1111,11111111,260,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,143.8,100,36.8',
                    'setLineWidth,1',
                    'rect,20,180.6,240,36.8',
                    'text,Max: f4 1111,11111111,260,189.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,180.6,100,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F4,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2 (Max of F1 is f1),20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16',
                    'text,Max: f3,30,87,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,230,16',
                    'text,Max: f4,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'text,Max: f3,20,103,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,240,16',
                    'text,Max: f4,260,103,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F4,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2_1 (Max of F1 is f1),20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16',
                    'text,Max: f3,30,87,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,230,16',
                    'text,Max: f4,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'text,F2: f2_2 (Max of F1 is f1),20,103,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,340,16',
                    'text,f3,30,119,{baseline:middle}', 'setLineWidth,1', 'rect,30,111,230,16',
                    'text,f4,260,119,{baseline:middle}', 'setLineWidth,1', 'rect,260,111,100,16',
                    'text,Max: f3,30,135,{baseline:middle}', 'setLineWidth,1', 'rect,30,127,230,16',
                    'text,Max: f4,260,135,{baseline:middle}', 'setLineWidth,1', 'rect,260,127,100,16',
                    'text,Max: f3,20,151,{baseline:middle}', 'setLineWidth,1', 'rect,20,143,240,16',
                    'text,Max: f4,260,151,{baseline:middle}', 'setLineWidth,1', 'rect,260,143,100,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F4,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F5,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2 (Max of F1 is f1),20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,F3: f3 (Max of F1 is f1),30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,330,16',
                    'text,f4,40,87,{baseline:middle}', 'setLineWidth,1', 'rect,40,79,220,16',
                    'text,f5,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'setLineWidth,1', 'rect,40,95,220,16',
                    'text,Max: f5,260,103,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16',
                    'setLineWidth,1', 'rect,30,111,230,16',
                    'text,Max: f5,260,119,{baseline:middle}', 'setLineWidth,1', 'rect,260,111,100,16',
                    'setLineWidth,1', 'rect,20,127,240,16',
                    'text,Max: f5,260,135,{baseline:middle}', 'setLineWidth,1', 'rect,260,127,100,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F4,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F5,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2 (Max of F1 is f1),20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,F3: f3 (Max of F1 is f1),30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,330,16',
                    'text,f4,40,87,{baseline:middle}', 'setLineWidth,1', 'rect,40,79,220,16',
                    'text,f5,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'text,Max: f4,40,103,{baseline:middle}', 'setLineWidth,1', 'rect,40,95,220,16',
                    'text,Max: f5,260,103,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16',
                    'text,Max: f4,30,119,{baseline:middle}', 'setLineWidth,1', 'rect,30,111,230,16',
                    'text,Max: f5,260,119,{baseline:middle}', 'setLineWidth,1', 'rect,260,111,100,16',
                    'text,Max: f4,20,135,{baseline:middle}', 'setLineWidth,1', 'rect,20,127,240,16',
                    'text,Max: f5,260,135,{baseline:middle}', 'setLineWidth,1', 'rect,260,127,100,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F4,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F5,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2_1 (Max of F1 is f1),20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,F3: f3 (Max of F1 is f1),30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,330,16',
                    'text,f4,40,87,{baseline:middle}', 'setLineWidth,1', 'rect,40,79,220,16',
                    'text,f5,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'text,Max: f4,40,103,{baseline:middle}', 'setLineWidth,1', 'rect,40,95,220,16',
                    'text,Max: f5,260,103,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16',
                    'text,Max: f4,30,119,{baseline:middle}', 'setLineWidth,1', 'rect,30,111,230,16',
                    'text,Max: f5,260,119,{baseline:middle}', 'setLineWidth,1', 'rect,260,111,100,16',
                    'text,F2: f2_2 (Max of F1 is f1),20,135,{baseline:middle}', 'setLineWidth,1', 'rect,20,127,340,16',
                    'text,F3: f3 (Max of F1 is f1),30,151,{baseline:middle}', 'setLineWidth,1', 'rect,30,143,330,16',
                    'text,f4,40,167,{baseline:middle}', 'setLineWidth,1', 'rect,40,159,220,16',
                    'text,f5,260,167,{baseline:middle}', 'setLineWidth,1', 'rect,260,159,100,16',
                    'text,Max: f4,40,183,{baseline:middle}', 'setLineWidth,1', 'rect,40,175,220,16',
                    'text,Max: f5,260,183,{baseline:middle}', 'setLineWidth,1', 'rect,260,175,100,16',
                    'text,Max: f4,30,199,{baseline:middle}', 'setLineWidth,1', 'rect,30,191,230,16',
                    'text,Max: f5,260,199,{baseline:middle}', 'setLineWidth,1', 'rect,260,191,100,16',
                    'text,Max: f4,20,215,{baseline:middle}', 'setLineWidth,1', 'rect,20,207,240,16',
                    'text,Max: f5,260,215,{baseline:middle}', 'setLineWidth,1', 'rect,260,207,100,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, {f3, groupIndex: 2}, f4, f5], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}, {f5, alignByColumn, showInGroupFooter}], 2 groups - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
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
                    dataSource: [
                        { f1: 'f1', f2: 'f2_1 11111 111 111', f3: 'f3 111111 11111 111111 11111 111111 11', f4: 'f4 11111 111', f5: 'f5 11111' },
                        { f1: 'f1 111111 11111 11111', f2: 'f2_2 11111', f3: 'f3', f4: 'f4 11111 ', f5: 'f5 1111 111' }]
                });

                const expectedLog = [
                    'text,F4,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,250,18.4',
                    'text,F5,260,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,15,100,18.4',
                    'text,F1: f1 (Max: f1),10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,350,18.4',
                    'text,F2: f2_1 11111 111 111 (Max of F1 is f1),20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,340,18.4',
                    'text,F3: f3 111111 11111 111111 11111 111111,11 (Max of F1 is f1),30,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,70.2,330,36.8',
                    'text,f4 11111 111,40,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,40,107,220,18.4',
                    'text,f5 11111,260,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,107,100,18.4',
                    'text,Max: f4 11111 111,40,143.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,40,125.4,220,36.8',
                    'text,Max: f5,11111,260,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,125.4,100,36.8',
                    'text,Max: f4 11111 111,30,180.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,162.2,230,36.8',
                    'text,Max: f5,11111,260,171.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,162.2,100,36.8',
                    'text,Max: f4 11111 111,20,217.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,199,240,36.8',
                    'text,Max: f5,11111,260,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,199,100,36.8',
                    'text,F1: f1 111111 11111 11111 (Max: f1 111111,11111 11111),10,245,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,235.8,350,36.8',
                    'text,F2: f2_2 11111 (Max of F1 is f1 111111 11111,11111),20,281.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,272.6,340,36.8',
                    'text,F3: f3 (Max of F1 is f1 111111 11111 11111),30,318.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,309.4,330,18.4',
                    'text,f4 11111 ,40,337,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,40,327.8,220,18.4',
                    'text,f5 1111 111,260,337,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,327.8,100,18.4',
                    'text,Max: f4 11111 ,40,364.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,40,346.2,220,36.8',
                    'text,Max: f5 1111,111,260,355.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,346.2,100,36.8',
                    'text,Max: f4 11111 ,30,401.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,383,230,36.8',
                    'text,Max: f5 1111,111,260,392.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,383,100,36.8',
                    'text,Max: f4 11111 ,20,438.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,419.8,240,36.8',
                    'text,Max: f5 1111,111,260,429,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,260,419.8,100,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F2,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,16',
                    'text,f2,90,39,{baseline:middle}', 'setLineWidth,1', 'rect,90,31,90,16',
                    'text,Max: f1,10,55,{baseline:middle}', 'setLineWidth,1', 'rect,10,47,80,16',
                    'setLineWidth,1', 'rect,90,47,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,Max: f2,10,71,{baseline:middle}', 'setLineWidth,1', 'rect,10,63,80,16',
                    'setLineWidth,1', 'rect,90,63,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,18.4',
                    'text,F1: f1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'text,f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,70,18.4',
                    'text,f3,90,61,{baseline:middle}', 'setLineWidth,1', 'rect,90,51.8,90,18.4',
                    'text,Max: f2,10,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,10,70.2,80,18.4', 'setLineWidth,1', 'rect,90,70.2,90,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, f2, f3], totalItems: [f2] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
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
                    dataSource: [{ f1: 'f1 1111 1111 111', f2: 'f2 1111111 111111111 1111 11', f3: 'f3 111' }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'text,F1: f1 1111 1111 111,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'text,f2,1111111 ,1111111,11 1111,11,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,70,92',
                    'text,f3 111,90,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,51.8,90,92',
                    'text,Max: f2,1111111,111111111,1111 11,10,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,143.8,80,73.6',
                    'setLineWidth,1',
                    'rect,90,143.8,90,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,Max: f2,20,71,{baseline:middle}', 'setLineWidth,1', 'rect,20,63,70,16',
                    'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f2,10,87,{baseline:middle}', 'setLineWidth,1', 'rect,10,79,80,16',
                    'setLineWidth,1', 'rect,90,79,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,18.4',
                    'text,F1: f1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'text,f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,70,18.4',
                    'text,f3,90,61,{baseline:middle}', 'setLineWidth,1', 'rect,90,51.8,90,18.4',
                    'text,Max: f2,20,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,20,70.2,70,18.4', 'setLineWidth,1', 'rect,90,70.2,90,18.4',
                    'text,Max: f2,10,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,10,88.6,80,18.4', 'setLineWidth,1', 'rect,90,88.6,90,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, f2, f3], groupItems: [{f2, alignByColumn, showInGroupFooter}], totalItems: [f2] - height auto, word wrap enabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: true,
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
                    dataSource: [{ f1: 'f1 1111 111', f2: 'f2 11111 1111 111', f3: 'f3 1111 11111 1111 1111 1111' }]
                });

                const expectedLog = [
                    'text,F2,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F3,90,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'text,F1: f1 1111 111,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'text,f2 11111,1111 111,20,70.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,70,55.2',
                    'text,f3 1111,11111 1111,1111 1111,90,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,51.8,90,55.2',
                    'text,Max: f2,11111,1111 111,20,116.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,107,70,55.2',
                    'setLineWidth,1',
                    'rect,90,107,90,55.2',
                    'text,Max: f2,11111,1111 111,10,171.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,162.2,80,55.2',
                    'setLineWidth,1',
                    'rect,90,162.2,90,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,F2: f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,160,16',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f3,10,87,{baseline:middle}', 'setLineWidth,1', 'rect,10,79,80,16',
                    'setLineWidth,1', 'rect,90,79,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,18.4',
                    'text,F4,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,18.4',
                    'text,F1: f1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'text,F2: f2,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,160,18.4',
                    'text,f3,30,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,30,70.2,60,18.4',
                    'text,f4,90,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,90,70.2,90,18.4',
                    'text,Max: f3,10,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,10,88.6,80,18.4', 'setLineWidth,1', 'rect,90,88.6,90,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], totalItems: [f3] - height auto, word wrap enabled', function(assert) {
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
                        totalItems: [
                            { column: 'f3', summaryType: 'max' }
                        ]
                    },
                    dataSource: [{ f1: 'f1 111 11111 1', f2: 'f2 1111 111', f3: 'f3 111 1111 111', f4: 'f4 11' }]
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F4,90,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'text,F1: f1 111 11111 1,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'text,F2: f2 1111 111,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,160,18.4',
                    'text,f3 111,1111,111,30,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,70.2,60,55.2',
                    'text,f4 11,90,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,70.2,90,55.2',
                    'text,Max: f3,111 1111,111,10,134.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,125.4,80,55.2',
                    'setLineWidth,1',
                    'rect,90,125.4,90,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,F2: f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,160,16',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f3,30,87,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,60,16',
                    'setLineWidth,1', 'rect,90,79,90,16',
                    'text,Max: f3,20,103,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,70,16',
                    'setLineWidth,1', 'rect,90,95,90,16',
                    'text,Max: f3,10,119,{baseline:middle}', 'setLineWidth,1', 'rect,10,111,80,16',
                    'setLineWidth,1', 'rect,90,111,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,F2: f2_1,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,160,16',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,F2: f2_2,20,87,{baseline:middle}', 'setLineWidth,1', 'rect,20,79,160,16',
                    'text,f3,30,103,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,60,16',
                    'text,f4,90,103,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,16',
                    'text,Max: f3,10,119,{baseline:middle}', 'setLineWidth,1', 'rect,10,111,80,16',
                    'setLineWidth,1', 'rect,90,111,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,18.4',
                    'text,F4,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,18.4',
                    'text,F1: f1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'text,F2: f2_1,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,160,18.4',
                    'text,f3,30,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,30,70.2,60,18.4',
                    'text,f4,90,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,90,70.2,90,18.4',
                    'text,F2: f2_2,20,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,20,88.6,160,18.4',
                    'text,f3,30,116.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,107,60,18.4',
                    'text,f4,90,116.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,107,90,18.4',
                    'text,Max: f3,10,134.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,125.4,80,18.4', 'setLineWidth,1', 'rect,90,125.4,90,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], totalItems: [f3], 2 groups - height auto, word wrap enabled', function(assert) {
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
                        totalItems: [
                            { column: 'f3', summaryType: 'max' }
                        ]
                    },
                    dataSource: [
                        { f1: 'f1 1111 111 11111 11', f2: 'f2_1 11 1111 111', f3: 'f3 111 1111 1111', f4: 'f4 11111 11 1 11111' },
                        { f1: 'f1 11111 111', f2: 'f2_2 1 1 111111 11111 1111 11', f3: 'f3 1111 1', f4: 'f4' }
                    ]
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F4,90,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'text,F1: f1 1111 111 11111,11,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,36.8',
                    'text,F2: f2_1 11 1111 111,20,79.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,70.2,160,18.4',
                    'text,f3 111,1111,1111,30,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,88.6,60,55.2',
                    'text,f4 11111 11,1 11111,90,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,88.6,90,55.2',
                    'text,F1: f1 11111 111,10,153,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,143.8,170,18.4',
                    'text,F2: f2_2 1 1 111111,11111 1111 11,20,171.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,162.2,160,36.8',
                    'text,f3 1111,1,30,208.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,199,60,36.8',
                    'text,f4,90,217.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,199,90,36.8',
                    'text,Max: f3,1111 1,10,245,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,235.8,80,36.8',
                    'setLineWidth,1',
                    'rect,90,235.8,90,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
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
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,F2: f2_1,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,160,16',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f4,90,71,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f3,30,87,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,60,16',
                    'setLineWidth,1', 'rect,90,79,90,16',
                    'text,F2: f2_2,20,103,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,160,16',
                    'text,f3,30,119,{baseline:middle}', 'setLineWidth,1', 'rect,30,111,60,16',
                    'text,f4,90,119,{baseline:middle}', 'setLineWidth,1', 'rect,90,111,90,16',
                    'text,Max: f3,30,135,{baseline:middle}', 'setLineWidth,1', 'rect,30,127,60,16',
                    'setLineWidth,1', 'rect,90,127,90,16',
                    'text,Max: f3,20,151,{baseline:middle}', 'setLineWidth,1', 'rect,20,143,70,16',
                    'setLineWidth,1', 'rect,90,143,90,16',
                    'text,Max: f3,10,167,{baseline:middle}', 'setLineWidth,1', 'rect,10,159,80,16',
                    'setLineWidth,1', 'rect,90,159,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,18.4',
                    'text,F4,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,18.4',
                    'text,F1: f1,10,42.6,{baseline:middle}', 'setLineWidth,1', 'rect,10,33.4,170,18.4',
                    'text,F2: f2_1,20,61,{baseline:middle}', 'setLineWidth,1', 'rect,20,51.8,160,18.4',
                    'text,f3,30,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,30,70.2,60,18.4',
                    'text,f4,90,79.4,{baseline:middle}', 'setLineWidth,1', 'rect,90,70.2,90,18.4',
                    'text,Max: f3,30,97.8,{baseline:middle}', 'setLineWidth,1', 'rect,30,88.6,60,18.4', 'setLineWidth,1', 'rect,90,88.6,90,18.4',
                    'text,F2: f2_2,20,116.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,107,160,18.4',
                    'text,f3,30,134.6,{baseline:middle}', 'setLineWidth,1', 'rect,30,125.4,60,18.4',
                    'text,f4,90,134.6,{baseline:middle}', 'setLineWidth,1', 'rect,90,125.4,90,18.4',
                    'text,Max: f3,30,153,{baseline:middle}', 'setLineWidth,1', 'rect,30,143.8,60,18.4', 'setLineWidth,1', 'rect,90,143.8,90,18.4',
                    'text,Max: f3,20,171.4,{baseline:middle}', 'setLineWidth,1', 'rect,20,162.2,70,18.4', 'setLineWidth,1', 'rect,90,162.2,90,18.4',
                    'text,Max: f3,10,189.8,{baseline:middle}', 'setLineWidth,1', 'rect,10,180.6,80,18.4', 'setLineWidth,1', 'rect,90,180.6,90,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('[{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [{f3, alignByColumn, showInGroupFooter}], totalItems: [f3], 2 groups - height auto, word wrap enabled', function(assert) {
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
                        { f1: 'f1 111 1111 1111 1', f2: 'f2_1 1111', f3: 'f3', f4: 'f4 11111 1111 1111111 1111 1111 11111' },
                        { f1: 'f1 111', f2: 'f2_2 1111 1111 1111 11111 11111', f3: 'f3 11111 11111 11111', f4: 'f4 1111 1111 11111 11111' }
                    ]
                });

                const expectedLog = [
                    'text,F3,10,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,80,18.4',
                    'text,F4,90,24.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,15,90,18.4',
                    'text,F1: f1 111,10,42.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,33.4,170,18.4',
                    'text,F2: f2_2 1111 1111,1111 11111 11111,20,61,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,51.8,160,36.8',
                    'text,f3,11111,11111,11111,30,97.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,88.6,60,73.6',
                    'text,f4 1111,1111 11111,11111,90,107,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,88.6,90,73.6',
                    'text,Max: f3,11111,11111,11111,30,171.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,162.2,60,73.6',
                    'setLineWidth,1',
                    'rect,90,162.2,90,73.6',
                    'text,Max: f3,11111,11111,11111,20,245,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,235.8,70,73.6',
                    'setLineWidth,1',
                    'rect,90,235.8,90,73.6',
                    'text,F1: f1 111 1111 1111 1,10,318.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,309.4,170,18.4',
                    'text,F2: f2_1 1111,20,337,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,327.8,160,18.4',
                    'text,f3,30,392.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,346.2,60,92',
                    'text,f4 11111,1111,1111111,1111 1111,11111,90,355.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,90,346.2,90,92',
                    'text,Max: f3,30,447.4,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,30,438.2,60,18.4',
                    'setLineWidth,1',
                    'rect,90,438.2,90,18.4',
                    'text,Max: f3,20,465.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,456.6,70,18.4',
                    'setLineWidth,1',
                    'rect,90,456.6,90,18.4',
                    'text,Max: f3,11111,11111,11111,10,484.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,475,80,73.6',
                    'setLineWidth,1',
                    'rect,90,475,90,73.6'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting: () => {} }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfSummariesTests };
