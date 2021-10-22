import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfCustomDrawCellTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Custom draw cell event', moduleConfig, () => {
            QUnit.test('check event args', function(assert) {
                const done = assert.async();
                const pdfDoc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customDrawCell = ({ doc, rect, pdfCell, gridCell, cancel }) => {
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

                    assert.equal(cancel, false, 'cancel value is correct');
                };

                exportDataGrid(pdfDoc, dataGrid, { topLeft: { x: 10, y: 10 }, customDrawCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    done();
                });
            });

            QUnit.test('customDrawCell -> set cancel=true for f1, set.cancel=false for f2', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customDrawCell = (arg) => {
                    arg.cancel = arg.pdfCell.text === 'f1';
                };
                const expectedLog = [
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customDrawCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('customDrawCell -> set cancel=false for f1, set.cancel=true for f2', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customDrawCell = (arg) => {
                    arg.cancel = arg.pdfCell.text === 'f2';
                };
                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customDrawCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('customDrawCell dont update cancel property', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customDrawCell = () => { };
                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customDrawCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('draw priority', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'f1') {
                        pdfCell.backgroundColor = '#808080';
                    }
                };

                const customDrawCell = ({ rect, pdfCell }) => {
                    doc.setFillColor('#880000');
                    doc.rect(rect.x, rect.y, rect.w, rect.h, 'F');
                };

                const expectedLog = [
                    'setFillColor,#880000',
                    'rect,10,10,250,18.4,F',
                    'setFillColor,#808080',
                    'rect,10,10,250,18.4,F',
                    'text,f1,10,19.2,{baseline:middle}',
                    'setFillColor,#880000',
                    'rect,260,10,250,18.4,F',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell, customDrawCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('styles from customDrawCells not used in default drawCellContent', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customDrawCell = ({ rect, pdfCell }) => {
                    doc.setFillColor('#880000');
                    doc.setTextColor('#880000');
                };

                const expectedLog = [
                    'setFillColor,#880000',
                    'setTextColor,#880000',
                    'setTextColor,#000000',
                    'text,f1,10,19.2,{baseline:middle}',
                    'setFillColor,#880000',
                    'setTextColor,#880000',
                    'setTextColor,#000000',
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customDrawCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfCustomDrawCellTests };
