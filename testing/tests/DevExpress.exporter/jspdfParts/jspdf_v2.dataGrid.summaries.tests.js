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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1 (Max: f1, Max of F2 is f2),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16'];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}',
                    'setLineWidth,1', 'line,10,31,160,31', 'line,10,31,10,47', 'line,10,47,160,47',
                    'text,Max: f3,160,40.2,{baseline:middle}',
                    'setLineWidth,1', 'line,160,31,250,31', 'line,160,47,250,47',
                    'setLineWidth,1', 'line,250,31,330,31', 'line,330,31,330,47', 'line,250,47,330,47',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16',
                    'text,f3,160,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16'];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'line,10,31,160,31', 'line,10,31,10,47', 'line,10,47,160,47',
                    'text,Max: f3,160,40.2,{baseline:middle}', 'setLineWidth,1', 'line,160,31,250,31', 'line,160,47,250,47',
                    'text,Max: f4,250,40.2,{baseline:middle}', 'setLineWidth,1', 'line,250,31,330,31', 'line,330,31,330,47', 'line,250,47,330,47',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16', 'text,f3,160,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16'];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'line,10,31,250,31', 'line,10,31,10,47', 'line,10,47,250,47',
                    'text,Max: f4,250,40.2,{baseline:middle}', 'setLineWidth,1', 'line,250,31,330,31', 'line,330,31,330,47', 'line,250,47,330,47',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16', 'text,f3,160,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16'];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1 (Max of F2 is f2),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16'];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,47', 'line,10,47,90,47',
                    'text,Max: f3,90,40.2,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,47,180,47',
                    'setLineWidth,1', 'line,180,31,260,31', 'line,260,31,260,47', 'line,180,47,260,47',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16' ];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'line,10,31,90,31', 'line,10,31,10,47', 'line,10,47,90,47',
                    'text,Max: f3,90,40.2,{baseline:middle}', 'setLineWidth,1', 'line,90,31,180,31', 'line,90,47,180,47',
                    'text,Max: f4,180,40.2,{baseline:middle}', 'setLineWidth,1', 'line,180,31,260,31', 'line,260,31,260,47', 'line,180,47,260,47',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16' ];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,47', 'line,10,47,180,47',
                    'text,Max: f4,180,40.2,{baseline:middle}', 'setLineWidth,1', 'line,180,31,260,31', 'line,260,31,260,47', 'line,180,47,260,47',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16'];

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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F4,260,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'line,10,31,260,31', 'line,10,31,10,47', 'line,10,47,260,47',
                    'text,Max: f4,260,40.2,{baseline:middle}', 'setLineWidth,1', 'line,260,31,360,31', 'line,360,31,360,47', 'line,260,47,360,47',
                    'text,F2: f2 (Max of F1 is f1),20,56.2,{baseline:middle}', 'setLineWidth,1', 'line,20,47,260,47', 'line,20,47,20,63', 'line,20,63,260,63',
                    'text,Max: f4,260,56.2,{baseline:middle}', 'setLineWidth,1', 'line,260,47,360,47', 'line,360,47,360,63', 'line,260,63,360,63',
                    'text,f3,30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,320,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16',
                    'text,f3,160,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16',
                    'setLineWidth,1', 'rect,20,63,140,16', 'text,Max: f3,160,72.2,{baseline:middle}',
                    'setLineWidth,1', 'rect,160,63,90,16',
                    'setLineWidth,1', 'rect,250,63,80,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 150, 90, 80 ], onRowExporting }).then(() => {
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,320,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16',
                    'text,f3,160,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16',
                    'setLineWidth,1', 'rect,20,63,140,16',
                    'text,Max: f3,160,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,63,90,16',
                    'text,Max: f4,250,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,63,80,16'];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,150,16',
                    'text,F3,160,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,15,90,16',
                    'text,F4,250,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,15,80,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,320,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,140,16',
                    'text,f3,160,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,160,47,90,16',
                    'text,f4,250,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,47,80,16',
                    'setLineWidth,1', 'rect,20,63,140,16',
                    'setLineWidth,1', 'rect,160,63,90,16',
                    'text,Max: f4,250,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,250,63,80,16' ];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16',
                    'setLineWidth,1', 'rect,20,63,70,16',
                    'text,Max: f3,90,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'setLineWidth,1', 'rect,180,63,80,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting }).then(() => {
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16',
                    'setLineWidth,1', 'rect,20,63,70,16',
                    'text,Max: f3,90,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f4,180,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16' ];

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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F4,180,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16',
                    'setLineWidth,1', 'rect,20,63,70,16',
                    'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f4,180,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16' ];

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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F4,260,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2 (Max of F1 is f1),20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,f3,30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16',
                    'setLineWidth,1', 'rect,30,79,230,16',
                    'text,Max: f4,260,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'setLineWidth,1', 'rect,20,95,240,16',
                    'text,Max: f4,260,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F4,260,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2 (Max of F1 is f1),20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,f3,30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16',
                    'text,Max: f3,30,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,230,16',
                    'text,Max: f4,260,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'text,Max: f3,20,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,240,16',
                    'text,Max: f4,260,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16'];

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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F4,260,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2_1 (Max of F1 is f1),20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,f3,30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16',
                    'text,Max: f3,30,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,230,16',
                    'text,Max: f4,260,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'text,F2: f2_2 (Max of F1 is f1),20,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,340,16',
                    'text,f3,30,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,111,230,16',
                    'text,f4,260,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,111,100,16',
                    'text,Max: f3,30,136.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,127,230,16',
                    'text,Max: f4,260,136.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,127,100,16',
                    'text,Max: f3,20,152.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,143,240,16',
                    'text,Max: f4,260,152.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,143,100,16' ];

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
                    'text,F4,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F5,260,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2 (Max of F1 is f1),20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,F3: f3 (Max of F1 is f1),30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,330,16',
                    'text,f4,40,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,40,79,220,16',
                    'text,f5,260,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'setLineWidth,1', 'rect,40,95,220,16',
                    'text,Max: f5,260,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16',
                    'setLineWidth,1', 'rect,30,111,230,16',
                    'text,Max: f5,260,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,111,100,16',
                    'setLineWidth,1', 'rect,20,127,240,16',
                    'text,Max: f5,260,136.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,127,100,16' ];

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
                    'text,F4,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F5,260,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2 (Max of F1 is f1),20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,F3: f3 (Max of F1 is f1),30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,330,16',
                    'text,f4,40,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,40,79,220,16',
                    'text,f5,260,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'text,Max: f4,40,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,40,95,220,16',
                    'text,Max: f5,260,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16',
                    'text,Max: f4,30,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,111,230,16',
                    'text,Max: f5,260,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,111,100,16',
                    'text,Max: f4,20,136.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,127,240,16',
                    'text,Max: f5,260,136.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,127,100,16' ];

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
                    'text,F4,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'text,F5,260,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'text,F1: f1 (Max: f1),10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'text,F2: f2_1 (Max of F1 is f1),20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,F3: f3 (Max of F1 is f1),30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,330,16',
                    'text,f4,40,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,40,79,220,16',
                    'text,f5,260,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'text,Max: f4,40,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,40,95,220,16',
                    'text,Max: f5,260,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16',
                    'text,Max: f4,30,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,111,230,16',
                    'text,Max: f5,260,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,111,100,16',
                    'text,F2: f2_2 (Max of F1 is f1),20,136.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,127,340,16',
                    'text,F3: f3 (Max of F1 is f1),30,152.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,143,330,16',
                    'text,f4,40,168.2,{baseline:middle}', 'setLineWidth,1', 'rect,40,159,220,16',
                    'text,f5,260,168.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,159,100,16',
                    'text,Max: f4,40,184.2,{baseline:middle}', 'setLineWidth,1', 'rect,40,175,220,16',
                    'text,Max: f5,260,184.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,175,100,16',
                    'text,Max: f4,30,200.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,191,230,16',
                    'text,Max: f5,260,200.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,191,100,16',
                    'text,Max: f4,20,216.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,207,240,16',
                    'text,Max: f5,260,216.2,{baseline:middle}', 'setLineWidth,1', 'rect,260,207,100,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting }).then(() => {
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
                    'text,F1,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F2,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,16',
                    'text,f2,90,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,31,90,16',
                    'text,Max: f1,10,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,47,80,16',
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,Max: f2,10,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,63,80,16',
                    'setLineWidth,1', 'rect,90,63,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'text,F2,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F3,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,Max: f2,20,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,63,70,16',
                    'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f2,10,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,79,80,16',
                    'setLineWidth,1', 'rect,90,79,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,F2: f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,160,16',
                    'text,f3,30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f4,90,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f3,10,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,79,80,16',
                    'setLineWidth,1', 'rect,90,79,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,F2: f2,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,160,16',
                    'text,f3,30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f4,90,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f3,30,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,60,16',
                    'setLineWidth,1', 'rect,90,79,90,16',
                    'text,Max: f3,20,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,70,16',
                    'setLineWidth,1', 'rect,90,95,90,16',
                    'text,Max: f3,10,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,111,80,16',
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,F2: f2_1,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,160,16',
                    'text,f3,30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f4,90,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,F2: f2_2,20,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,79,160,16',
                    'text,f3,30,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,60,16',
                    'text,f4,90,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,95,90,16',
                    'text,Max: f3,10,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,111,80,16',
                    'setLineWidth,1', 'rect,90,111,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
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
                    'text,F3,10,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'text,F4,90,24.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,F1: f1,10,40.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,F2: f2_1,20,56.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,160,16',
                    'text,f3,30,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,60,16',
                    'text,f4,90,72.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,63,90,16',
                    'text,Max: f3,30,88.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,79,60,16',
                    'setLineWidth,1', 'rect,90,79,90,16',
                    'text,F2: f2_2,20,104.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,95,160,16',
                    'text,f3,30,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,111,60,16',
                    'text,f4,90,120.2,{baseline:middle}', 'setLineWidth,1', 'rect,90,111,90,16',
                    'text,Max: f3,30,136.2,{baseline:middle}', 'setLineWidth,1', 'rect,30,127,60,16',
                    'setLineWidth,1', 'rect,90,127,90,16',
                    'text,Max: f3,20,152.2,{baseline:middle}', 'setLineWidth,1', 'rect,20,143,70,16',
                    'setLineWidth,1', 'rect,90,143,90,16',
                    'text,Max: f3,10,168.2,{baseline:middle}', 'setLineWidth,1', 'rect,10,159,80,16',
                    'setLineWidth,1', 'rect,90,159,90,16'];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfSummariesTests };
