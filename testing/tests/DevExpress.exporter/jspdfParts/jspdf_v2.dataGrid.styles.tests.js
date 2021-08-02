import { exportDataGrid } from 'exporter/jspdf/export_data_grid_2';

const JSPdfStylesTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {

        const onCellExporting = ({ pdfCell }) => {
            pdfCell.drawLeftBorder = false;
            pdfCell.drawRightBorder = false;
            pdfCell.drawTopBorder = false;
            pdfCell.drawBottomBorder = false;
            pdfCell.textOptions = { baseline: 'alphabetic' };
        };

        const rowOptions = {
            headerStyles: { backgroundColor: '#808080' },
            groupStyles: { backgroundColor: '#d3d3d3' },
            totalStyles: { backgroundColor: '#ffffe0' },
            rowHeight: 16
        };

        QUnit.module('Styles - Background color', moduleConfig, () => {
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
                    'text,F1,10,23,',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F2,100,23,',
                    'text,f1_1,10,39,',
                    'text,f1_2,100,39,'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom color in Header', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'header' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#ffff00', 'rect,10,15,90,16,F',
                    'text,F1,10,23,',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F2,100,23,',
                    'text,f1_1,10,39,',
                    'text,f1_2,100,39,'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Simple - [f1, f2] - custom color in data row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,90,16,F',
                    'text,F1,10,23,',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F2,100,23,',
                    'setFillColor,#ffff00', 'rect,10,31,90,16,F',
                    'text,f1_1,10,39,',
                    'text,f1_2,100,39,'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
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
                    'text,F2,10,23,',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F3,100,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1_1,10,39,',
                    'text,f1_2,20,55,',
                    'text,f1_3,100,55,',
                    'setFillColor,#d3d3d3', 'rect,10,63,170,16,F',
                    'text,F1: f2_1,10,71,',
                    'text,f2_2,20,87,',
                    'text,f2_3,100,87,'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 1 level - [{f1, groupIndex: 0}, f2, f3] - custom color in grouped row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'group' && gridCell.value === 'f1_1') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,90,16,F',
                    'text,F2,10,23,',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F3,100,23,',
                    'setFillColor,#ffff00', 'rect,10,31,170,16,F',
                    'text,F1: f1_1,10,39,',
                    'text,f1_2,20,55,',
                    'text,f1_3,100,55,',
                    'setFillColor,#d3d3d3', 'rect,10,63,170,16,F',
                    'text,F1: f2_1,10,71,',
                    'text,f2_2,20,87,',
                    'text,f2_3,100,87,'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 1 level - [{f1, groupIndex: 0}, f2, f3] - custom color in data row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'data' && gridCell.column.dataField === 'f2') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,90,16,F',
                    'text,F2,10,23,',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F3,100,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1_1,10,39,',
                    'setFillColor,#ffff00', 'rect,20,47,80,16,F',
                    'text,f1_2,20,55,',
                    'text,f1_3,100,55,',
                    'setFillColor,#d3d3d3', 'rect,10,63,170,16,F',
                    'text,F1: f2_1,10,71,',
                    'setFillColor,#ffff00', 'rect,20,79,80,16,F',
                    'text,f2_2,20,87,',
                    'text,f2_3,100,87,'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
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
                    'text,F3,10,23,',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F4,100,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1,10,39,',
                    'setFillColor,#d3d3d3', 'rect,20,47,160,16,F',
                    'text,F2: f1_2,20,55,',
                    'text,f1_3,30,71,',
                    'text,f1_4,100,71,',
                    'setFillColor,#d3d3d3', 'rect,20,79,160,16,F',
                    'text,F2: f2_2,20,87,',
                    'text,f2_3,30,103,',
                    'text,f2_4,100,103,'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Grouped rows - 2 level - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4] - custom color in grouped row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'group') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,90,16,F',
                    'text,F3,10,23,',
                    'setFillColor,#808080', 'rect,100,15,80,16,F',
                    'text,F4,100,23,',
                    'setFillColor,#ffff00', 'rect,10,31,170,16,F',
                    'text,F1: f1,10,39,',
                    'setFillColor,#ffff00', 'rect,20,47,160,16,F',
                    'text,F2: f1_2,20,55,',
                    'text,f1_3,30,71,',
                    'text,f1_4,100,71,',
                    'setFillColor,#ffff00', 'rect,20,79,160,16,F',
                    'text,F2: f2_2,20,87,',
                    'text,f2_3,30,103,',
                    'text,f2_4,100,103,'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 90, 80 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
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
                    'text,F2,10,23,',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F3,90,23,',
                    'setFillColor,#808080', 'rect,180,15,80,16,F',
                    'text,F4,180,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1,10,39,',
                    'setFillColor,#d3d3d3', 'rect,180,31,80,16,F',
                    'text,Max: f4,180,39,',
                    'text,f2,20,55,',
                    'text,f3,90,55,',
                    'text,f4,180,55,' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 1 level - [{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f4, alignByColumn}] - custom color in grouped row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'group' && gridCell.column.dataField === 'f4') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,80,16,F',
                    'text,F2,10,23,',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F3,90,23,',
                    'setFillColor,#808080', 'rect,180,15,80,16,F',
                    'text,F4,180,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1,10,39,',
                    'setFillColor,#ffff00', 'rect,180,31,80,16,F',
                    'text,Max: f4,180,39,',
                    'text,f2,20,55,',
                    'text,f3,90,55,',
                    'text,f4,180,55,' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
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
                    'text,F2,10,23,',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F3,90,23,',
                    'setFillColor,#808080', 'rect,180,15,80,16,F',
                    'text,F4,180,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,250,16,F',
                    'text,F1: f1,10,39,',
                    'text,f2,20,55,',
                    'text,f3,90,55,',
                    'text,f4,180,55,',
                    'setFillColor,#ffffe0', 'rect,20,63,70,16,F',
                    'setFillColor,#ffffe0', 'rect,90,63,90,16,F',
                    'setFillColor,#ffffe0', 'rect,180,63,80,16,F',
                    'text,Max: f4,180,71,' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 1 level - [{f1, groupIndex: 0}, f2, f3, f4], groupItems: [{f4, alignByColumn, showInGroupFooter}] - custom color in group footer row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'groupFooter' && gridCell.column.dataField === 'f4') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,80,16,F',
                    'text,F2,10,23,',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F3,90,23,',
                    'setFillColor,#808080', 'rect,180,15,80,16,F',
                    'text,F4,180,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,250,16,F',
                    'text,F1: f1,10,39,',
                    'text,f2,20,55,',
                    'text,f3,90,55,',
                    'text,f4,180,55,',
                    'setFillColor,#ffffe0', 'rect,20,63,70,16,F',
                    'setFillColor,#ffffe0', 'rect,90,63,90,16,F',
                    'setFillColor,#ffff00', 'rect,180,63,80,16,F',
                    'text,Max: f4,180,71,' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90, 80 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
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
                    'text,F3,10,23,',
                    'setFillColor,#808080', 'rect,260,15,100,16,F',
                    'text,F4,260,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,250,16,F',
                    'text,F1: f1 (Max: f1),10,39,',
                    'setFillColor,#d3d3d3', 'rect,260,31,100,16,F',
                    'text,Max: f4,260,39,',
                    'setFillColor,#d3d3d3', 'rect,20,47,240,16,F',
                    'text,F2: f2 (Max of F1 is f1),20,55,',
                    'setFillColor,#d3d3d3', 'rect,260,47,100,16,F',
                    'text,Max: f4,260,55,',
                    'text,f3,30,71,',
                    'text,f4,260,71,' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 2 level - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f4, alignByColumn}] - custom color in grouped row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'group' && gridCell.column.dataField === 'f4') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,250,16,F',
                    'text,F3,10,23,',
                    'setFillColor,#808080', 'rect,260,15,100,16,F',
                    'text,F4,260,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,250,16,F',
                    'text,F1: f1 (Max: f1),10,39,',
                    'setFillColor,#ffff00', 'rect,260,31,100,16,F',
                    'text,Max: f4,260,39,',
                    'setFillColor,#d3d3d3', 'rect,20,47,240,16,F',
                    'text,F2: f2 (Max of F1 is f1),20,55,',
                    'setFillColor,#ffff00', 'rect,260,47,100,16,F',
                    'text,Max: f4,260,55,',
                    'text,f3,30,71,',
                    'text,f4,260,71,' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
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
                    'text,F3,10,23,',
                    'setFillColor,#808080', 'rect,260,15,100,16,F',
                    'text,F4,260,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,350,16,F',
                    'text,F1: f1 (Max: f1),10,39,',
                    'setFillColor,#d3d3d3', 'rect,20,47,340,16,F',
                    'text,F2: f2 (Max of F1 is f1),20,55,',
                    'text,f3,30,71,',
                    'text,f4,260,71,',
                    'setFillColor,#ffffe0', 'rect,30,79,230,16,F',
                    'setFillColor,#ffffe0', 'rect,260,79,100,16,F',
                    'text,Max: f4,260,87,',
                    'setFillColor,#ffffe0', 'rect,20,95,240,16,F',
                    'setFillColor,#ffffe0', 'rect,260,95,100,16,F',
                    'text,Max: f4,260,103,' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Group summaries - 2 level - [{f1, groupIndex: 0}, {f2, groupIndex: 1}, f3, f4], groupItems: [f1, {f4, alignByColumn, showInGroupFooter}] - custom color in group footer row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'groupFooter' && gridCell.column.dataField === 'f4') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,250,16,F',
                    'text,F3,10,23,',
                    'setFillColor,#808080', 'rect,260,15,100,16,F',
                    'text,F4,260,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,350,16,F',
                    'text,F1: f1 (Max: f1),10,39,',
                    'setFillColor,#d3d3d3', 'rect,20,47,340,16,F',
                    'text,F2: f2 (Max of F1 is f1),20,55,',
                    'text,f3,30,71,',
                    'text,f4,260,71,',
                    'setFillColor,#ffffe0', 'rect,30,79,230,16,F',
                    'setFillColor,#ffff00', 'rect,260,79,100,16,F',
                    'text,Max: f4,260,87,',
                    'setFillColor,#ffffe0', 'rect,20,95,240,16,F',
                    'setFillColor,#ffff00', 'rect,260,95,100,16,F',
                    'text,Max: f4,260,103,' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 250, 100 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
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
                    'text,F1,10,23,',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F2,90,23,',
                    'text,f1,10,39,',
                    'text,f2,90,39,',
                    'setFillColor,#ffffe0', 'rect,10,47,80,16,F',
                    'text,Max: f1,10,55,',
                    'setFillColor,#ffffe0', 'rect,90,47,90,16,F' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Total summaries - [f1, f2], totalItems: [f1] - custom color in summary row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'totalFooter' && gridCell.column.dataField === 'f1') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,80,16,F',
                    'text,F1,10,23,',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F2,90,23,',
                    'text,f1,10,39,',
                    'text,f2,90,39,',
                    'setFillColor,#ffff00', 'rect,10,47,80,16,F',
                    'text,Max: f1,10,55,',
                    'setFillColor,#ffffe0', 'rect,90,47,90,16,F' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
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
                    'text,F2,10,23,',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F3,90,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1,10,39,',
                    'text,f2,20,55,',
                    'text,f3,90,55,',
                    'setFillColor,#ffffe0', 'rect,10,63,80,16,F',
                    'text,Max: f2,10,71,',
                    'setFillColor,#ffffe0', 'rect,90,63,90,16,F' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('Total summaries - [{f1, groupIndex: 0}, f2, f3], totalItems: [f2] - custom color in summary row', function(assert) {
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

                const _onCellExporting = ({ gridCell, pdfCell }) => {
                    onCellExporting({ gridCell, pdfCell });
                    if(gridCell.rowType === 'totalFooter' && gridCell.column.dataField === 'f2') {
                        pdfCell.backgroundColor = '#ffff00';
                    }
                };

                const expectedLog = [
                    'setFillColor,#808080', 'rect,10,15,80,16,F',
                    'text,F2,10,23,',
                    'setFillColor,#808080', 'rect,90,15,90,16,F',
                    'text,F3,90,23,',
                    'setFillColor,#d3d3d3', 'rect,10,31,170,16,F',
                    'text,F1: f1,10,39,',
                    'text,f2,20,55,',
                    'text,f3,90,55,',
                    'setFillColor,#ffff00', 'rect,10,63,80,16,F',
                    'text,Max: f2,10,71,',
                    'setFillColor,#ffffe0', 'rect,90,63,90,16,F' ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 80, 90 ], onCellExporting: _onCellExporting, rowOptions }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });

    }
};

export { JSPdfStylesTests };
