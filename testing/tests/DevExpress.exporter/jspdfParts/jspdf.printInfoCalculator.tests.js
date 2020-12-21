import { ExportPrintInfoCalculator } from 'exporter/jspdf/export_print_info_calculator.js';
import { JSPdfPrintInfoCalculatorTestHelper } from './jspdfTestHelper.js';

let helper;

const JSPdfPrintInfoCalculatorTests = {
    runTests(moduleConfig) {
        helper = new JSPdfPrintInfoCalculatorTestHelper(this.jsPDFDocument);

        QUnit.module('Print Info Calculator', moduleConfig, () => {
            QUnit.test('Empty grid', function(assert) {
                const done = assert.async();

                const options = {
                    jsPDFDocument: this.jsPDFDocument,
                    cells: []
                };
                const calculatedOptions = ExportPrintInfoCalculator.calculate(options);
                assert.strictEqual(calculatedOptions.columnStyles[0], undefined, 'columnStyles[0]');

                done();
            });

            QUnit.test('1 column, 1 rows', function(assert) {
                const done = assert.async();

                const options = {
                    jsPDFDocument: this.jsPDFDocument,
                    cells: [[{ content: 'text' }]]
                };
                const calculatedOptions = ExportPrintInfoCalculator.calculate(options);
                helper.checkColumnWidths([calculatedOptions.tableWidth], calculatedOptions);

                done();
            });

            QUnit.test('2 columns, 1 rows', function(assert) {
                const done = assert.async();

                const options = {
                    jsPDFDocument: this.jsPDFDocument,
                    cells: [[{ content: 'text_1' }, { content: 'text_2' }]]
                };
                const calculatedOptions = ExportPrintInfoCalculator.calculate(options);

                const columnWidth = calculatedOptions.tableWidth / 2;
                const expectedWidths = [ columnWidth, columnWidth ];
                helper.checkColumnWidths(expectedWidths, calculatedOptions);

                done();
            });

            QUnit.test('2 columns, 2 rows', function(assert) {
                const done = assert.async();

                const options = {
                    jsPDFDocument: this.jsPDFDocument,
                    cells: [
                        [{ content: 'text_1_1' }, { content: 'text_1_2' }],
                        [{ content: 'text_2_1' }, { content: 'text_2_2' }]
                    ]
                };
                const calculatedOptions = ExportPrintInfoCalculator.calculate(options);

                const columnWidth = calculatedOptions.tableWidth / 2;
                const startX = calculatedOptions.startX;
                const startY = calculatedOptions.startX;
                const cellHeight = ExportPrintInfoCalculator._defaultMinCellHeight;
                const expectedCellsCoordinates = [
                    [
                        { x: startX, y: startY, width: columnWidth, height: cellHeight },
                        { x: startX + columnWidth, y: startY, width: columnWidth, height: cellHeight }
                    ], [
                        { x: startX, y: startY + cellHeight, width: columnWidth, height: cellHeight },
                        { x: startX + columnWidth, y: startY + cellHeight, width: columnWidth, height: cellHeight }
                    ]
                ];
                helper.checkColumnWidths([columnWidth, columnWidth], calculatedOptions);
                helper.checkCellsCoordinates(expectedCellsCoordinates, calculatedOptions);

                done();
            });

            QUnit.test('2 columns, 2 rows - margin, startPos, table width is defined', function(assert) {
                const done = assert.async();

                const options = {
                    jsPDFDocument: this.jsPDFDocument,
                    startX: 50,
                    startY: 20,
                    tableWidth: 100,
                    cells: [
                        [{ content: 'text_1_1' }, { content: 'text_1_2' }],
                        [{ content: 'text_2_1' }, { content: 'text_2_2' }]
                    ]
                };
                ExportPrintInfoCalculator._defaultMinCellHeight = 8;
                const calculatedOptions = ExportPrintInfoCalculator.calculate(options);

                const expectedCellsCoordinates = [
                    [
                        { x: 50, y: 20, width: 50, height: 8 },
                        { x: 100, y: 20, width: 50, height: 8 }
                    ], [
                        { x: 50, y: 28, width: 50, height: 8 },
                        { x: 100, y: 28, width: 50, height: 8 }
                    ]
                ];
                helper.checkColumnWidths([ 50, 50 ], calculatedOptions);
                helper.checkCellsCoordinates(expectedCellsCoordinates, calculatedOptions);

                done();
            });

            QUnit.test('2 columns, 2 rows - table width and 1 column width is defined', function(assert) {
                const done = assert.async();

                const options = {
                    jsPDFDocument: this.jsPDFDocument,
                    startX: 50,
                    startY: 20,
                    tableWidth: 100,
                    cells: [
                        [{ content: 'text_1_1' }, { content: 'text_1_2' }],
                        [{ content: 'text_2_1' }, { content: 'text_2_2' }]
                    ],
                    columnStyles: {
                        1: { width: 30 }
                    }
                };
                ExportPrintInfoCalculator._defaultMinCellHeight = 8;
                const calculatedOptions = ExportPrintInfoCalculator.calculate(options);

                const expectedCellsCoordinates = [
                    [
                        { x: 50, y: 20, width: 70, height: 8 },
                        { x: 120, y: 20, width: 30, height: 8 }
                    ], [
                        { x: 50, y: 28, width: 70, height: 8 },
                        { x: 120, y: 28, width: 30, height: 8 }
                    ]
                ];
                helper.checkColumnWidths([ 70, 30 ], calculatedOptions);
                helper.checkCellsCoordinates(expectedCellsCoordinates, calculatedOptions);

                done();
            });

            QUnit.test('2 columns, 2 rows - amount of columns widths are less than table width', function(assert) {
                const done = assert.async();

                const options = {
                    jsPDFDocument: this.jsPDFDocument,
                    startX: 50,
                    startY: 20,
                    tableWidth: 100,
                    cells: [
                        [{ content: 'text_1_1' }, { content: 'text_1_2' }],
                        [{ content: 'text_2_1' }, { content: 'text_2_2' }]
                    ],
                    columnStyles: {
                        0: { width: 30 },
                        1: { width: 30 }
                    }
                };
                const calculatedOptions = ExportPrintInfoCalculator.calculate(options);

                const expectedCellsCoordinates = [
                    [
                        { x: 50, y: 20, width: 30, height: 8 },
                        { x: 80, y: 20, width: 30, height: 8 }
                    ], [
                        { x: 50, y: 28, width: 30, height: 8 },
                        { x: 80, y: 28, width: 30, height: 8 }
                    ]
                ];
                helper.checkColumnWidths([ 30, 30 ], calculatedOptions);
                helper.checkCellsCoordinates(expectedCellsCoordinates, calculatedOptions);

                done();
            });

            QUnit.test('2 columns, 2 rows - amount of columns widths are greater than table width', function(assert) {
                const done = assert.async();

                const options = {
                    jsPDFDocument: this.jsPDFDocument,
                    startX: 50,
                    startY: 20,
                    tableWidth: 100,
                    cells: [
                        [{ content: 'text_1_1' }, { content: 'text_1_2' }],
                        [{ content: 'text_2_1' }, { content: 'text_2_2' }]
                    ],
                    columnStyles: {
                        0: { width: 70 },
                        1: { width: 70 }
                    }
                };
                ExportPrintInfoCalculator._defaultMinCellHeight = 8;
                const calculatedOptions = ExportPrintInfoCalculator.calculate(options);

                const expectedCellsCoordinates = [
                    [
                        { x: 50, y: 20, width: 70, height: 8 },
                        { x: 120, y: 20, width: 70, height: 8 }
                    ], [
                        { x: 50, y: 28, width: 70, height: 8 },
                        { x: 120, y: 28, width: 70, height: 8 }
                    ]
                ];
                helper.checkColumnWidths([ 70, 70 ], calculatedOptions);
                helper.checkCellsCoordinates(expectedCellsCoordinates, calculatedOptions);

                done();
            });

            QUnit.test('2 columns, 2 rows - the minCellHeight is set', function(assert) {
                const done = assert.async();

                const options = {
                    jsPDFDocument: this.jsPDFDocument,
                    startX: 50,
                    startY: 20,
                    tableWidth: 100,
                    cells: [
                        [{ content: 'text_1_1' }, { content: 'text_1_2' }],
                        [{ content: 'text_2_1' }, { content: 'text_2_2' }]
                    ],
                    columnStyles: {
                        1: { width: 70, minCellHeight: 20 }
                    }
                };
                ExportPrintInfoCalculator._defaultMinCellHeight = 8;
                const calculatedOptions = ExportPrintInfoCalculator.calculate(options);

                const expectedCellsCoordinates = [
                    [
                        { x: 50, y: 20, width: 30, height: 20 },
                        { x: 80, y: 20, width: 70, height: 20 }
                    ], [
                        { x: 50, y: 40, width: 30, height: 20 },
                        { x: 80, y: 40, width: 70, height: 20 }
                    ]
                ];
                helper.checkColumnWidths([ 30, 70 ], calculatedOptions);
                helper.checkCellsCoordinates(expectedCellsCoordinates, calculatedOptions);

                done();
            });
        });
    }
};

export { JSPdfPrintInfoCalculatorTests };
