import { exportDataGrid } from 'exporter/jspdf/v3/export_data_grid_3';

const JSPdfMeasureUnitsTests = {
    runTests(moduleConfig, createMockPdfDoc, createDataGrid) {
        QUnit.module('Measure units', moduleConfig, () => {
            QUnit.test('1 cols - 1 rows, columnWidth = 200, padding: 20, margin: 30, units = [px,pt,cm,mm,in]', function(assert) {
                const done = assert.async();

                const dataGrid = createDataGrid({
                    width: 600,
                    columns: [
                        { dataField: 'f1' }
                    ],
                    dataSource: [{ f1: 'v1_1' }]
                });

                const expectedLog = [
                    'setTextColor,128',
                    'setFontSize,10',
                    'text,F1,50,55.75,{baseline:middle}',
                    'setTextColor,#000000',
                    'text,v1_1,50,107.25,{baseline:middle}',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,30,30,200,51.5',
                    'setLineWidth,0.6',
                    'setDrawColor,128',
                    'rect,30,81.5,200,51.5',
                    'setFontSize,16',
                    'setDrawColor,#000000'
                ];

                const customizeCell = ({ pdfCell }) => {
                    if(pdfCell.text === 'f1') {
                        pdfCell.padding = 10;
                    } else {
                        pdfCell.padding = 20;
                    }
                };

                ['pt', 'px', 'cm', 'mm', 'in'].forEach(unit => {
                    const doc = createMockPdfDoc({ unit });
                    exportDataGrid(doc, dataGrid, {
                        margin: 30,
                        topLeft: { x: 0, y: 0 },
                        columnWidths: [200],
                        customizeCell
                    }).then(() => {
                        // doc.save(assert.test.testName + '.pdf');
                        assert.deepEqual(doc.__log, expectedLog);

                        if(unit === 'in') {
                            done();
                        }
                    });
                });
            });
        });
    }
};

export { JSPdfMeasureUnitsTests };


