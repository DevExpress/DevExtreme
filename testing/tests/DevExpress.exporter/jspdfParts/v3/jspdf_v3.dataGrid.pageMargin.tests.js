import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfPageMarginsTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Page margins', moduleConfig, () => {
            QUnit.test('1 col - 1 row. grid.Width=600, Margin=undefined, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=undefined, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=0, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=0, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,0,0,595.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=10, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=10, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,10,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,10,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,left:10}, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,left:10}, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,10,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={right:10,bottom:10}, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={right:10,bottom:10}, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,0,0,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=undefined, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=undefined, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,0,0,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=0, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=0, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,0,0,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=10, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,20,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,10,565.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=10, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,575.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,10,565.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,20,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,10,565.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,575.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,10,565.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,left:10}, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,20,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,10,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,left:10}, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,10,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={right:10,bottom:10}, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={right:10,bottom:10}, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,575.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,0,0,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            /** *********************************************************************************************************/

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=undefined, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,10,595.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=undefined, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,0,10,595.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=0, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,10,595.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=0, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,0,10,595.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=10, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,20,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin=10, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,29.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,20,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,20,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,29.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,20,575.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,left:10}, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,20,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={top:10,left:10}, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,29.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,10,20,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={right:10,bottom:10}, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,10,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=600, Margin={right:10,bottom:10}, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 600,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,0,10,585.28,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,495.78,0,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,495.78,0,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,485.78,10,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,485.78,10,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,495.78,10,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,0,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,485.78,0,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            /** *******************************************************************************************************/

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,485.78,0,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,485.78,0,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,20,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,10,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,575.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,475.78,10,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,20,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,10,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,575.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,475.78,10,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,20,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,20,10,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,485.78,10,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=10,y=0}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,9.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,0,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=10,y=0}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,575.28,9.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,475.78,0,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 10, y: 0 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,10,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=undefined, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,495.78,10,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,10,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=0, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,495.78,10,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 0, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,20,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin=10, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,29.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,485.78,20,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: 10, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,20,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,right:10,bottom:10,left:10}, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,29.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,485.78,20,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, right: 10, bottom: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,10,29.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,20,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={top:10,left:10}, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,595.28,29.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,495.78,20,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { top: 10, left: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=10}', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,0,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,0,10,100,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 row. grid.Width=100, Margin={right:10,bottom:10}, topLeft={x=0,y=10}, rtlEnabled', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    rtlEnabled: true,
                    width: 100,
                    columns: [{ caption: 'f1' }]
                });

                const expectedLog = [
                    'text,f1,585.28,19.2,{baseline:middle,align:right}',
                    'setLineWidth,1',
                    'rect,485.78,10,99.5,18.4'
                ];

                exportDataGrid(doc, dataGrid, { margin: { right: 10, bottom: 10 }, topLeft: { x: 0, y: 10 } }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfPageMarginsTests };
