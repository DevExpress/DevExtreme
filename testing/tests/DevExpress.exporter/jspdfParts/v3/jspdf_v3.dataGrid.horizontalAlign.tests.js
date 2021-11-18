import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfHorizontalAlignTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Horizontal align', moduleConfig, () => {
            QUnit.test('1 col - 1 row. Font size default, horizontal align: undefined. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const expectedLog = [
                    'text,line 1,10,24.2,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. Font size default, horizontal align: left. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

                const expectedLog = [
                    'text,line 1,10,24.2,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. Font size default, horizontal align: center. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

                const expectedLog = [
                    'text,line 1,110,24.2,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. Font size default, horizontal align: right. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

                const expectedLog = [
                    'text,line 1,210,24.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. Font size 10, horizontal align: left. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'left';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,line 1,10,20.75,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,11.5',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. Font size 10, horizontal align: center. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'center';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,line 1,110,20.75,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,11.5',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. Font size 10, horizontal align: right. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'right';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,line 1,210,20.75,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,11.5',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. Font size 20, horizontal align: left. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'left';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,line 1,10,26.5,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,23',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. Font size 20, horizontal align: center. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'center';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,line 1,110,26.5,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,23',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. Font size 20, horizontal align: right. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'right';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,line 1,210,26.5,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,23',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 row. Font size default, horizontal align: left. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

                const expectedLog = [
                    'text,line 1\nlong line 2,10,24.2,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 row. Font size default, horizontal align: center. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

                const expectedLog = [
                    'text,line 1\nlong line 2,110,24.2,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 row. Font size default, horizontal align: right. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

                const expectedLog = [
                    'text,line 1\nlong line 2,210,24.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,36.8'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 row. Font size 10, horizontal align: left. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'left';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,line 1\nlong line 2,10,20.75,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,23',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 row. Font size 10, horizontal align: center. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'center';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,line 1\nlong line 2,110,20.75,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,23',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 row. Font size 10, horizontal align: right. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'right';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,line 1\nlong line 2,210,20.75,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,23',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 row. Font size 20, horizontal align: left. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'left';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,line 1\nlong line 2,10,26.5,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,46',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 row. Font size 20, horizontal align: center. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'center';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,line 1\nlong line 2,110,26.5,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,46',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 row. Font size 20, horizontal align: right. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'right';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,line 1\nlong line 2,210,26.5,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,46',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. Font size default, horizontal align: left. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

                const expectedLog = [
                    'text,line 1\nlong line 2\nvery long line 3,10,24.2,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. Font size default, horizontal align: center. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'center'; };

                const expectedLog = [
                    'text,line 1\nlong line 2\nvery long line 3,110,24.2,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. Font size default, horizontal align: right. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

                const expectedLog = [
                    'text,line 1\nlong line 2\nvery long line 3,210,24.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,55.2'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. Font size 10, horizontal align: left. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'left';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,line 1\nlong line 2\nvery long line 3,10,20.75,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,34.5',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. Font size 10, horizontal align: center. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'center';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,line 1\nlong line 2\nvery long line 3,110,20.75,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,34.5',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. Font size 10, horizontal align: right. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'right';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,line 1\nlong line 2\nvery long line 3,210,20.75,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,34.5',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. Font size 20, horizontal align: left. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'left';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,line 1\nlong line 2\nvery long line 3,10,26.5,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,69',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. Font size 20, horizontal align: center. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'center';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,line 1\nlong line 2\nvery long line 3,110,26.5,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,69',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. Font size 20, horizontal align: right. Cell width = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'line 1\nlong line 2\nvery long line 3' } ],
                    dataSource: [],
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.horizontalAlign = 'right';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,line 1\nlong line 2\nvery long line 3,210,26.5,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,69',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

        });

        QUnit.module('Pass horizontal alignment settings from dxDataGrid', moduleConfig, () => {

            QUnit.test('1 col - 3 row. col.dataType: number, col.alignment: undefined, pdfCell.alignment: undefined, cellWidth = 200px', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', dataType: 'number', caption: 'F1' } ],
                    dataSource: [{ f1: 1 }, { f1: 2 }],
                });

                const expectedLog = [
                    'text,F1,210,24.2,{baseline:middle,align:right}',
                    'text,1,210,42.6,{baseline:middle,align:right}',
                    'text,2,210,61,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. col.dataType: number, col.alignment: center, pdfCell.alignment: undefined, cellWidth = 200px', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', dataType: 'number', alignment: 'center', caption: 'F1' } ],
                    dataSource: [{ f1: 1 }, { f1: 2 }],
                });

                const expectedLog = [
                    'text,F1,110,24.2,{baseline:middle,align:center}',
                    'text,1,110,42.6,{baseline:middle,align:center}',
                    'text,2,110,61,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. col.dataType: number, col.alignment: center, pdfCell.alignment: left, Cell width = 200px', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', dataType: 'number', alignment: 'center', caption: 'F1' } ],
                    dataSource: [{ f1: 1 }, { f1: 2 }],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'left'; };

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle,align:left}',
                    'text,1,10,42.6,{baseline:middle,align:left}',
                    'text,2,10,61,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. col.dataType: string, col.alignment: undefined, pdfCell.alignment: undefined, cellWidth = 200px', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', dataType: 'string', caption: 'F1' } ],
                    dataSource: [{ f1: 'f1_1' }, { f1: 'f1_2' }],
                });

                const expectedLog = [
                    'text,F1,10,24.2,{baseline:middle,align:left}',
                    'text,f1_1,10,42.6,{baseline:middle,align:left}',
                    'text,f1_2,10,61,{baseline:middle,align:left}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. col.dataType: string, col.alignment: center, pdfCell.alignment: undefined, cellWidth = 200px', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', dataType: 'string', alignment: 'center', caption: 'F1' } ],
                    dataSource: [{ f1: 'f1_1' }, { f1: 'f1_2' }],
                });

                const expectedLog = [
                    'text,F1,110,24.2,{baseline:middle,align:center}',
                    'text,f1_1,110,42.6,{baseline:middle,align:center}',
                    'text,f1_2,110,61,{baseline:middle,align:center}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ] }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 row. col.dataType: string, col.alignment: center, pdfCell.alignment: right, cellWidth = 200px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();
                doc.__logOptions.textOptions.hAlign = true;

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', dataType: 'string', alignment: 'center', caption: 'F1' } ],
                    dataSource: [{ f1: 'f1_1' }, { f1: 'f1_2' }],
                });

                const customizeCell = ({ pdfCell }) => { pdfCell.horizontalAlign = 'right'; };

                const expectedLog = [
                    'text,F1,210,24.2,{baseline:middle,align:right}',
                    'text,f1_1,210,42.6,{baseline:middle,align:right}',
                    'text,f1_2,210,61,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,15,200,18.4',
                    'setLineWidth,1',
                    'rect,10,33.4,200,18.4',
                    'setLineWidth,1',
                    'rect,10,51.8,200,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 200 ], customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

        });
    }
};

export { JSPdfHorizontalAlignTests };
