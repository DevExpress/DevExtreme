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
        });
    }
};

export { JSPdfSummariesTests };
