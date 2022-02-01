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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,60.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,80,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,99.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,60.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,80,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,99.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,F1,56.667,60.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,F1,56.667,80,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,F1,56.667,99.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,58.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,78.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,98.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,58.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,78.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,98.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,F1,56.667,57.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,F1,56.667,77,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,F1,56.667,96.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,63.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,83.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,103.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,63.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,83.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,56.667,103.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,F1,56.667,67.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,F1,56.667,87,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,F1,56.667,106.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,60.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,74.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,88.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,60.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,74.25,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,88.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2,56.667,60.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2,56.667,68.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2,56.667,76.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,58.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,73.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,88.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,58.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,73.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,88.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2,56.667,57.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2,56.667,67,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2,56.667,76.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,63.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,76,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,88.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,63.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,76,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2,56.667,88.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2,56.667,67.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2,56.667,72,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2,56.667,76.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,60.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,68.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,76.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,60.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,68.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,76.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,60.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,57,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,53.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,58.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,68.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,78.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,58.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,68.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,78.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,57.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,57,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,56.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,63.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,68.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,73.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,63.833,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,68.5,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,73.167,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,67.333,{baseline:top}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,57,{baseline:middle}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
                    'setTextColor,128',
                    'setFontSize,20',
                    'text,f1\n' +
'f2\n' +
'f3,56.667,46.667,{baseline:bottom}',
                    'setLineWidth,0.6666666666666666',
                    'setDrawColor,128',
                    'rect,50,55,100,50',
                    'setFontSize,16',
                    'setDrawColor,#000000',
                    'setTextColor,#000000'
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
