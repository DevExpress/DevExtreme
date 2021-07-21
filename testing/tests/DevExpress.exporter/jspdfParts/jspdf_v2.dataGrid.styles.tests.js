import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

const JSPdfStylesTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        const onRowExporting = (e) => { e.rowHeight = 16; };

        const rowTypeStyles = {
            headerStyles: { backgroundColor: '#808080' },
            groupStyles: { backgroundColor: '#d3d3d3' },
            totalStyles: { backgroundColor: '#ffffe0' }
        };

        QUnit.module('Styles', moduleConfig, () => {
            QUnit.test('Simple - [{f1, f2]', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [
                        { dataField: 'f1' },
                        { dataField: 'f2' },
                    ],
                    dataSource: [
                        { f1: 'f1_1', f2: 'f1_2' },
                    ],
                });

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,90,16,F',
                    'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F2,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'text,f1_1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,90,16',
                    'text,f1_2,100,39,{baseline:middle}', 'setLineWidth,1', 'rect,100,31,80,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting, ...rowTypeStyles }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 1 level - [{f1, groupIndex: 0}, f2, f3]', function(assert) {
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
                    'setFillColor,#808080', 'rect,10,15,90,16,F',
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F3,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1_1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,80,16',
                    'text,f1_3,100,55,{baseline:middle}', 'setLineWidth,1', 'rect,100,47,80,16',
                    'setFillColor,#d3d3d3', 'rect,10,63,170,16,F',
                    'text,F1: f2_1,10,71,{baseline:middle}', 'setLineWidth,1', 'rect,10,63,170,16',
                    'text,f2_2,20,87,{baseline:middle}', 'setLineWidth,1', 'rect,20,79,80,16',
                    'text,f2_3,100,87,{baseline:middle}', 'setLineWidth,1', 'rect,100,79,80,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting, ...rowTypeStyles }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 2 level - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4]', function(assert) {
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
                    'setFillColor,#808080', 'rect,10,15,90,16,F',
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,90,16',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F4,100,23,{baseline:middle}', 'setLineWidth,1', 'rect,100,15,80,16',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'setFillColor,#d3d3d3', 'rect,20,47,160,16,F',
                    'text,F2: f1_2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,160,16',
                    'text,f1_3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,70,16',
                    'text,f1_4,100,71,{baseline:middle}', 'setLineWidth,1', 'rect,100,63,80,16',
                    'setFillColor,#d3d3d3', 'rect,20,79,160,16,F',
                    'text,F2: f2_2,20,87,{baseline:middle}', 'setLineWidth,1', 'rect,20,79,160,16',
                    'text,f2_3,30,103,{baseline:middle}', 'setLineWidth,1', 'rect,30,95,70,16',
                    'text,f2_4,100,103,{baseline:middle}', 'setLineWidth,1', 'rect,100,95,80,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onRowExporting, ...rowTypeStyles }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 1 level - [{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f4, alignByColumn}]', function(assert) {
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
                    'setFillColor,#808080', 'rect,10,15,80,16,F',
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'setFillColor,#808080', 'rect,180,15,80,16,F',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,180,31', 'line,10,31,10,47', 'line,10,47,180,47',
                    'setFillColor,#d3d3d3', 'rect,180,31,80,16,F',
                    'text,Max: f4,180,39,{baseline:middle}', 'setLineWidth,1', 'line,180,31,260,31', 'line,260,31,260,47', 'line,180,47,260,47',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting, ...rowTypeStyles }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 1 level - [{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f4, alignByColumn, showInGroupFooter}]', function(assert) {
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
                    'setFillColor,#808080', 'rect,10,15,80,16,F',
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'setFillColor,#808080', 'rect,180,15,80,16,F',
                    'text,F4,180,23,{baseline:middle}', 'setLineWidth,1', 'rect,180,15,80,16',
                    'setFillColor,#d3d3d3', 'rect,10,31,250,16,F',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,250,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'text,f4,180,55,{baseline:middle}', 'setLineWidth,1', 'rect,180,47,80,16',
                    'setFillColor,#ffffe0', 'rect,20,63,70,16,F',
                    'setLineWidth,1', 'rect,20,63,70,16',
                    'setFillColor,#ffffe0', 'rect,90,63,90,16,F',
                    'setLineWidth,1', 'rect,90,63,90,16',
                    'setFillColor,#ffffe0', 'rect,180,63,80,16,F',
                    'text,Max: f4,180,71,{baseline:middle}', 'setLineWidth,1', 'rect,180,63,80,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onRowExporting, ...rowTypeStyles }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 2 level - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f4, alignByColumn}]', function(assert) {
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
                            { column: 'f4', summaryType: 'max', alignByColumn: true }
                        ]
                    },
                    dataSource: [{ f1: 'f1', f2: 'f2', f3: 'f3', f4: 'f4' }]
                });

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,250,16,F',
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'setFillColor,#808080', 'rect,260,15,100,16,F',
                    'text,F4,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'setFillColor,#d3d3d3', 'rect,10,31,250,16,F',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'line,10,31,260,31', 'line,10,31,10,47', 'line,10,47,260,47',
                    'setFillColor,#d3d3d3', 'rect,260,31,100,16,F',
                    'text,Max: f4,260,39,{baseline:middle}', 'setLineWidth,1', 'line,260,31,360,31', 'line,360,31,360,47', 'line,260,47,360,47',
                    'setFillColor,#d3d3d3', 'rect,20,47,240,16,F',
                    'text,F2: f2 (Max of F1 is f1),20,55,{baseline:middle}', 'setLineWidth,1', 'line,20,47,260,47', 'line,20,47,20,63', 'line,20,63,260,63',
                    'setFillColor,#d3d3d3', 'rect,260,47,100,16,F',
                    'text,Max: f4,260,55,{baseline:middle}', 'setLineWidth,1', 'line,260,47,360,47', 'line,360,47,360,63', 'line,260,63,360,63',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting, ...rowTypeStyles }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 2 level - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}]', function(assert) {
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
                    'setFillColor,#808080', 'rect,10,15,250,16,F',
                    'text,F3,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,250,16',
                    'setFillColor,#808080', 'rect,260,15,100,16,F',
                    'text,F4,260,23,{baseline:middle}', 'setLineWidth,1', 'rect,260,15,100,16',
                    'setFillColor,#d3d3d3', 'rect,10,31,350,16,F',
                    'text,F1: f1 (Max: f1),10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,350,16',
                    'setFillColor,#d3d3d3', 'rect,20,47,340,16,F',
                    'text,F2: f2 (Max of F1 is f1),20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,340,16',
                    'text,f3,30,71,{baseline:middle}', 'setLineWidth,1', 'rect,30,63,230,16',
                    'text,f4,260,71,{baseline:middle}', 'setLineWidth,1', 'rect,260,63,100,16',
                    'setFillColor,#ffffe0', 'rect,30,79,230,16,F',
                    'setLineWidth,1', 'rect,30,79,230,16',
                    'setFillColor,#ffffe0', 'rect,260,79,100,16,F',
                    'text,Max: f4,260,87,{baseline:middle}', 'setLineWidth,1', 'rect,260,79,100,16',
                    'setFillColor,#ffffe0', 'rect,20,95,240,16,F',
                    'setLineWidth,1', 'rect,20,95,240,16',
                    'setFillColor,#ffffe0', 'rect,260,95,100,16,F',
                    'text,Max: f4,260,103,{baseline:middle}', 'setLineWidth,1', 'rect,260,95,100,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onRowExporting, ...rowTypeStyles }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Total summaries - [f1, f2], totalItems: [f1]', function(assert) {
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
                    'setFillColor,#808080', 'rect,10,15,80,16,F',
                    'text,F1,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F2,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'text,f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,80,16',
                    'text,f2,90,39,{baseline:middle}', 'setLineWidth,1', 'rect,90,31,90,16',
                    'setFillColor,#ffffe0', 'rect,10,47,80,16,F',
                    'text,Max: f1,10,55,{baseline:middle}', 'setLineWidth,1', 'rect,10,47,80,16',
                    'setFillColor,#ffffe0', 'rect,90,47,90,16,F',
                    'setLineWidth,1', 'rect,90,47,90,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting, ...rowTypeStyles }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Total summaries - [{f1, groupIndex: 0}, f2, f3], totalItems: [f2]', function(assert) {
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
                    'setFillColor,#808080', 'rect,10,15,80,16,F',
                    'text,F2,10,23,{baseline:middle}', 'setLineWidth,1', 'rect,10,15,80,16',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F3,90,23,{baseline:middle}', 'setLineWidth,1', 'rect,90,15,90,16',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1,10,39,{baseline:middle}', 'setLineWidth,1', 'rect,10,31,170,16',
                    'text,f2,20,55,{baseline:middle}', 'setLineWidth,1', 'rect,20,47,70,16',
                    'text,f3,90,55,{baseline:middle}', 'setLineWidth,1', 'rect,90,47,90,16',
                    'setFillColor,#ffffe0', 'rect,10,63,80,16,F',
                    'text,Max: f2,10,71,{baseline:middle}', 'setLineWidth,1', 'rect,10,63,80,16',
                    'setFillColor,#ffffe0', 'rect,90,63,90,16,F',
                    'setLineWidth,1', 'rect,90,63,90,16' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onRowExporting, ...rowTypeStyles }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

    }
};

export { JSPdfStylesTests };
