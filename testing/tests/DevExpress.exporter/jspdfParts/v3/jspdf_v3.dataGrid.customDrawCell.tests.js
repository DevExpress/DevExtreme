import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfCustomDrawCellTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Custom draw cell event', moduleConfig, () => {
            QUnit.test('customDrawCell check event args', function(assert) {
                const done = assert.async();
                const pdfDoc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    pdfCell.customDrawCell = ({ doc, rect, cell }) => {
                        const expectedRect = cell.text === 'f1'
                            ? { h: 18.4, w: 250, x: 10, y: 10 }
                            : { h: 18.4, w: 250, x: 260, y: 10 };
                        assert.equal(doc, pdfDoc, 'doc object is correct');
                        assert.deepEqual(rect, expectedRect, 'rect is correct');
                        assert.deepEqual(cell, {
                            backgroundColor: undefined,
                            horizontalAlign: 'left',
                            padding: {
                                bottom: 0,
                                left: 0,
                                right: 0,
                                top: 0
                            },
                            text: cell.text === 'f1' ? 'f1' : 'f2',
                            verticalAlign: 'middle',
                            wordWrapEnabled: false
                        }, 'cell is correct');
                    };
                };

                exportDataGrid(pdfDoc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    done();
                });
            });

            QUnit.test('cell1.customDrawCell = empty function', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'f1') {
                        pdfCell.backgroundColor = '#808080';
                        pdfCell.customDrawCell = () => { };
                    }
                };

                const expectedLog = [
                    'text,f2,260,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('cell2.customDrawCell = empty function', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    width: 500,
                    columns: [{ caption: 'f1' }, { caption: 'f2' }]
                });

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'f2') {
                        pdfCell.backgroundColor = '#808080';
                        pdfCell.customDrawCell = ({ rect }) => { };
                    }
                };

                const expectedLog = [
                    'text,f1,10,19.2,{baseline:middle}',
                    'setLineWidth,1',
                    'rect,10,10,250,18.4',
                    'setLineWidth,1',
                    'rect,260,10,250,18.4'
                ];

                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 10 }, customizeCell }).then(() => {
                    // doc.save(assert.test.testName + '.pdf');
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfCustomDrawCellTests };
