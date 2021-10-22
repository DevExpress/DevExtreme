import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfOnCellExportingTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Custom draw cell event', moduleConfig, () => {
            QUnit.test('check event args', function(assert) {
                const done = assert.async();
                const pdfDoc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const onCellExporting = ({ doc, rect, pdfCell, gridCell }) => {
                    const expectedRect = pdfCell.text === 'f1'
                        ? { h: 18.4, w: 250, x: 10, y: 10 }
                        : { h: 18.4, w: 250, x: 260, y: 10 };

                    assert.equal(doc, pdfDoc, 'doc object is correct');
                    assert.deepEqual(rect, expectedRect, 'rect is correct');

                    assert.deepEqual(pdfCell, {
                        backgroundColor: undefined,
                        horizontalAlign: 'left',
                        padding: {
                            bottom: 0,
                            left: 0,
                            right: 0,
                            top: 0
                        },
                        text: pdfCell.text === 'f1' ? 'f1' : 'f2',
                        verticalAlign: 'middle',
                        wordWrapEnabled: false
                    }, 'pdfCell is correct');

                    const expectedGridCellCaption = pdfCell.text === 'f1' ? 'f1' : 'f2';
                    const expectedGridCellIndex = pdfCell.text === 'f1' ? 0 : 1;
                    assert.equal(gridCell.column.caption, expectedGridCellCaption, 'gridCell.caption is correct');
                    assert.equal(gridCell.column.index, expectedGridCellIndex, 'gridCell.index is correct');
                    assert.equal(gridCell.column.visibleIndex, expectedGridCellIndex, 'gridCell.visibleIndex is correct');
                    assert.equal(gridCell.rowType, 'header', 'gridCell.caption is correct');
                };

                exportDataGrid(pdfDoc, dataGrid, { topLeft: { x: 10, y: 10 }, onCellExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    done();
                });
            });

            QUnit.test('onCellExporting for f1 returns false (not draw content of the f1)', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.backgroundColor = '#808080';
                };

                const onCellExporting = ({ pdfCell }) => {
                    return pdfCell.text !== 'f1';
                };
                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,260,10,250,18.4,F',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell, onCellExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('onCellExporting for f2 returns false  (not draw content of the f2)', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.backgroundColor = '#808080';
                };

                const onCellExporting = ({ pdfCell }) => {
                    return pdfCell.text !== 'f2';
                };
                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,10,10,250,18.4,F',
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell, onCellExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('onCellExporting returns undefined', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.backgroundColor = '#808080';
                };

                const onCellExporting = () => { return undefined; };
                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,10,10,250,18.4,F',
                    'text,f1,10,19.2,{baseline:middle}',
                    'setFillColor,#808080',
                    'rect,260,10,250,18.4,F',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell, onCellExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('onCellExporting returns null', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.backgroundColor = '#808080';
                };

                const onCellExporting = () => { return null; };
                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,10,10,250,18.4,F',
                    'text,f1,10,19.2,{baseline:middle}',
                    'setFillColor,#808080',
                    'rect,260,10,250,18.4,F',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell, onCellExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('onCellExporting returns nothing', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.backgroundColor = '#808080';
                };

                const onCellExporting = () => { };
                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,10,10,250,18.4,F',
                    'text,f1,10,19.2,{baseline:middle}',
                    'setFillColor,#808080',
                    'rect,260,10,250,18.4,F',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell, onCellExporting }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('onCellExporting not exists', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.backgroundColor = '#808080';
                };

                const expectedLog = [
                    'setFillColor,#808080',
                    'rect,10,10,250,18.4,F',
                    'text,f1,10,19.2,{baseline:middle}',
                    'setFillColor,#808080',
                    'rect,260,10,250,18.4,F',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell, onCellExporting: undefined }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfOnCellExportingTests };
