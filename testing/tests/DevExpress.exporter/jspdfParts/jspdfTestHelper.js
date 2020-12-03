const { assert } = QUnit;
import { isDefined } from 'core/utils/type';

class JSPdfDataGridTestHelper {
    constructor(jsPDFDocument) {
        this.jsPDFDocument = jsPDFDocument;
    }

    checkCustomizeCell(eventArgs, expectedCells, callIndex) {
        const { pdfCell: actualPdfCell } = eventArgs;
        const { pdfCell: expectedPdfCell } = expectedCells[callIndex];

        assert.strictEqual(actualPdfCell.content, expectedPdfCell.content, `checkCustomizeCell: pdfCell.content ${callIndex}`);
        assert.deepEqual(actualPdfCell.styles, expectedPdfCell.styles || {}, `checkCustomizeCell: pdfCell.styles ${callIndex}`);

        this.checkGridCell(eventArgs, expectedCells, callIndex);
    }

    checkOnCellRendered(eventArgs, expectedCells, callIndex) {
        assert.strictEqual(eventArgs.jsPDFDocument, this.jsPDFDocument, `checkOnCellRendered: jsPDFDocument, ${callIndex}`);
        assert.ok(eventArgs.cellCoordinates, `checkOnCellRendered: cellCoordinates, ${callIndex}`);

        this.checkGridCell(eventArgs, expectedCells, callIndex);
    }

    checkGridCell(eventArgs, expectedCells, callIndex) {
        const { gridCell: actualGridCell } = eventArgs;
        const { gridCell: expectedGridCell } = expectedCells[callIndex];

        assert.strictEqual(actualGridCell.column.dataField, expectedGridCell.column.dataField, `checkGridCell: column.dataField, ${callIndex}`);
        assert.strictEqual(actualGridCell.column.dataType, expectedGridCell.column.dataType, `checkGridCell: column.dataType, ${callIndex}`);
        assert.strictEqual(actualGridCell.column.caption, expectedGridCell.column.caption, `checkGridCell: column.caption, ${callIndex}`);
        assert.strictEqual(actualGridCell.column.index, expectedGridCell.column.index, `checkGridCell: column.index, ${callIndex}`);

        const gridCellSkipProperties = ['column'];
        for(const propertyName in actualGridCell) {
            if(gridCellSkipProperties.indexOf(propertyName) === -1) {
                if(propertyName === 'groupSummaryItems' || propertyName === 'value') {
                    assert.deepEqual(actualGridCell[propertyName], expectedGridCell[propertyName], `checkGridCell: gridCell[${propertyName}], ${callIndex}`);
                } else {
                    assert.strictEqual(actualGridCell[propertyName], expectedGridCell[propertyName], `checkGridCell: gridCell[${propertyName}], ${callIndex}`);
                }
            }
        }

        callIndex++;
    }

    checkColumnWidths(expectedColumnWidths, actualAutoTableOptions) {
        const columnStyles = actualAutoTableOptions.columnStyles;
        const actualWidths = [];

        for(let i = 0; i < expectedColumnWidths.length; i++) {
            const width = columnStyles[i] ? columnStyles[i].cellWidth : 'auto';
            actualWidths.push(width);
        }

        assert.deepEqual(actualWidths, expectedColumnWidths, 'Column widths');
    }

    checkRowAndColumnCount(expectedCells, actualAutoTableOptions, rowType) {
        assert.strictEqual(expectedCells[rowType].length, actualAutoTableOptions[rowType].length, `actual row count of the ${rowType}`);
        for(let rowIndex = 0; rowIndex < expectedCells[rowType].length; rowIndex++) {
            assert.strictEqual(actualAutoTableOptions[rowType][rowIndex].length, expectedCells[rowType][rowIndex].length, 'actual column count of the head');
        }
    }

    checkCellsContent(expectedCells, actualAutoTableOptions, rowType) {
        this._iterateCells(expectedCells[rowType], (cell, rowIndex, columnIndex) => {
            assert.strictEqual(actualAutoTableOptions[rowType][rowIndex][columnIndex].content, cell.pdfCell.content, `AutoTable ${rowType}[${rowIndex}][${columnIndex}].content`);
        });
    }

    checkCellsStyles(expectedCells, actualAutoTableOptions, rowType) {
        this._iterateCells(expectedCells[rowType], (cell, rowIndex, columnIndex) => {
            const expectedPdfCellStyles = cell.pdfCell.styles || {};
            const actualPdfCellStyles = actualAutoTableOptions[rowType][rowIndex][columnIndex].styles;

            ['halign', 'fontStyle', 'cellWidth'].forEach((styleName) => {
                assert.strictEqual(
                    actualPdfCellStyles[styleName],
                    expectedPdfCellStyles[styleName],
                    `AutoTable ${rowType}[${rowIndex}][${columnIndex}].styles.${styleName}`);
                assert.strictEqual(
                    isDefined(actualPdfCellStyles[styleName]),
                    Object.prototype.hasOwnProperty.call(actualPdfCellStyles, styleName),
                    `AutoTable ${rowType}[${rowIndex}][${columnIndex}].styles.${styleName} is defined`);
            });
        });
    }

    checkMergeCells(expectedCells, actualAutoTableOptions, rowType) {
        this._iterateCells(expectedCells[rowType], (expectedCell, rowIndex, columnIndex) => {
            const actualPdfCell = actualAutoTableOptions[rowType][rowIndex][columnIndex];
            assert.strictEqual(actualPdfCell.colSpan, expectedCell.pdfCell.colSpan, `AutoTable ${rowType}[${rowIndex}][${columnIndex}].colSpan`);
            assert.strictEqual(actualPdfCell.rowSpan, expectedCell.pdfCell.rowSpan, `AutoTable ${rowType}[${rowIndex}][${columnIndex}].rowSpan`);
        });
    }

    _iterateCells(cellsArray, callback) {
        for(let rowIndex = 0; rowIndex < cellsArray.length; rowIndex++) {
            for(let columnIndex = 0; columnIndex < cellsArray[rowIndex].length; columnIndex++) {
                callback(cellsArray[rowIndex][columnIndex], rowIndex, columnIndex);
            }
        }
    }
}

export { JSPdfDataGridTestHelper };
