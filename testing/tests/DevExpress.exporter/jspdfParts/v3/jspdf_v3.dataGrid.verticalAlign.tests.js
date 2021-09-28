import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfVerticalAlignTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Vertical align', moduleConfig, () => {
            QUnit.test('1 col - 1 lines. Font size default, line height default, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'text,F1,10,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size default, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'text,F1,10,40,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size default, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'text,F1,10,65,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 10px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,F1,10,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 10, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,F1,10,40,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 10, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,F1,10,65,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 20px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,F1,10,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 20, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,F1,10,40,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 20, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,F1,10,65,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size default, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'text,F1,10,12.6,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size default, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'text,F1,10,37.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size default, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'text,F1,10,62.6,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 10px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,10',
                    'text,F1,10,13.5,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 10, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,10',
                    'text,F1,10,38.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 10, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,10',
                    'text,F1,10,63.5,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 20px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,20',
                    'text,F1,10,12,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 20, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,20',
                    'text,F1,10,37,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 20, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,20',
                    'text,F1,10,62,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size default, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'text,F1,10,20.6,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size default, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'text,F1,10,45.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size default, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'text,F1,10,70.6,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 10px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,10',
                    'text,F1,10,18.5,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 10, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,10',
                    'text,F1,10,43.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 10, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,10',
                    'text,F1,10,68.5,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 20px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,20',
                    'text,F1,10,22,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 20, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,20',
                    'text,F1,10,47,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 lines. Font size 20, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,20',
                    'text,F1,10,72,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            /// -------------------------------------------------------------------------------

            QUnit.test('1 col - 2 lines. Font size default, line height default, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'text,f1\nf2,10,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size default, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'text,f1\nf2,10,30.8,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size default, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'text,f1\nf2,10,46.6,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 10px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,f1\nf2,10,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 10, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,f1\nf2,10,34.25,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 10, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,f1\nf2,10,53.5,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 20px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,f1\nf2,10,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 20, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,f1\nf2,10,28.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 20, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,f1\nf2,10,42,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size default, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'text,f1\nf2,10,12.6,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size default, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'text,f1\nf2,10,29.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size default, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'text,f1\nf2,10,46.6,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 10px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,10',
                    'text,f1\nf2,10,13.5,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 10, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,10',
                    'text,f1\nf2,10,33.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 10, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,10',
                    'text,f1\nf2,10,53.5,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 20px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,20',
                    'text,f1\nf2,10,12,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 20, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,20',
                    'text,f1\nf2,10,27,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 20, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,20',
                    'text,f1\nf2,10,42,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size default, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'text,f1\nf2,10,20.6,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size default, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'text,f1\nf2,10,33.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size default, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'text,f1\nf2,10,46.6,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 10px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,10',
                    'text,f1\nf2,10,18.5,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 10, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,10',
                    'text,f1\nf2,10,36,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 10, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,10',
                    'text,f1\nf2,10,53.5,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 20px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,20',
                    'text,f1\nf2,10,22,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 20, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,20',
                    'text,f1\nf2,10,32,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 2 lines. Font size 20, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,20',
                    'text,f1\nf2,10,42,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size default, line height default, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'text,f1\nf2\nf3,10,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size default, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'text,f1\nf2\nf3,10,21.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size default, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'text,f1\nf2\nf3,10,28.2,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 10px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,f1\nf2\nf3,10,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 10, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,f1\nf2\nf3,10,28.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 10, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setFontSize,10',
                    'text,f1\nf2\nf3,10,42,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 20px, line height default, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,f1\nf2\nf3,10,15,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 20, line height default, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,f1\nf2\nf3,10,17,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 20, line height default, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setFontSize,20',
                    'text,f1\nf2\nf3,10,19,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size default, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'text,f1\nf2\nf3,10,12.6,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size default, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'text,f1\nf2\nf3,10,21.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size default, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'text,f1\nf2\nf3,10,30.6,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 10px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,10',
                    'text,f1\nf2\nf3,10,13.5,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 10, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,10',
                    'text,f1\nf2\nf3,10,28.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 10, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,10',
                    'text,f1\nf2\nf3,10,43.5,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 20px, line height 1, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,20',
                    'text,f1\nf2\nf3,10,12,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 20, line height 1, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,20',
                    'text,f1\nf2\nf3,10,17,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 20, line height 1, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1',
                    'setFontSize,20',
                    'text,f1\nf2\nf3,10,22,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size default, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'top'; };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'text,f1\nf2\nf3,10,20.6,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size default, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'middle'; };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'text,f1\nf2\nf3,10,21.6,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size default, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => { pdfCell.verticalAlign = 'bottom'; };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'text,f1\nf2\nf3,10,22.6,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 10px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,10',
                    'text,f1\nf2\nf3,10,18.5,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 10, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,10',
                    'text,f1\nf2\nf3,10,28.5,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 10, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 10 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,10',
                    'text,f1\nf2\nf3,10,38.5,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 20px, line height 1.5, vertical align: top. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'top';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,20',
                    'text,f1\nf2\nf3,10,22,{baseline:top}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 20, line height 1.5, vertical align: middle. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'middle';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,20',
                    'text,f1\nf2\nf3,10,17,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 3 lines. Font size 20, line height 1.5, vertical align: bottom. Cell height = 50px ', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    columns: [ { dataField: 'f1', caption: 'f1\nf2\nf3' } ],
                    dataSource: [],
                });

                doc.setLineHeightFactor(1.5);
                const onRowExporting = (e) => { e.rowHeight = 50; };
                const customizeCell = ({ pdfCell }) => {
                    pdfCell.verticalAlign = 'bottom';
                    pdfCell.font = { size: 20 };
                };

                const expectedLog = [
                    'setLineHeightFactor,1.5',
                    'setFontSize,20',
                    'text,f1\nf2\nf3,10,12,{baseline:bottom}',
                    'setLineWidth,1',
                    'rect,10,15,100,50',
                    'setFontSize,16'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfVerticalAlignTests };
