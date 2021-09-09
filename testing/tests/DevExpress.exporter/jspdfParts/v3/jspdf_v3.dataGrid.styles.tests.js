import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfStylesTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Styles - Font', moduleConfig, () => {
            QUnit.test('1 col - 1 text line. customizeCell.set fontSize=20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line,10,26.5,{baseline:middle}',
                    'setFontSize,16',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. onRowExporting.set fontSize=20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line,10,26.5,{baseline:middle}',
                    'setFontSize,16',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                ];

                const onRowExporting = (e) => { e.rowCells[0].font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });

            QUnit.test('1 col - 1 text line. customizeCell.setFontSize=10, onRowExporting.set fontSize=20, height auto', function(assert) {
                const done = assert.async();
                const doc = createMockPdfDoc();

                const dataGrid = createDataGrid({
                    wordWrapEnabled: false,
                    columns: [{ caption: 'line' }]
                });

                const expectedLog = [
                    'setFontSize,20',
                    'text,line,10,26.5,{baseline:middle}',
                    'setFontSize,16',
                    'setLineWidth,1',
                    'rect,10,15,100,23',
                ];

                const customizeCell = ({ pdfCell }) => { pdfCell.font = { size: 10 }; };
                const onRowExporting = (e) => { e.rowCells[0].font = { size: 20 }; };
                exportDataGrid(doc, dataGrid, { topLeft: { x: 10, y: 15 }, columnWidths: [ 100 ], onRowExporting, customizeCell }).then(() => {
                    // doc.save();
                    assert.deepEqual(doc.__log, expectedLog);
                    done();
                });
            });
        });
    }
};

export { JSPdfStylesTests };
