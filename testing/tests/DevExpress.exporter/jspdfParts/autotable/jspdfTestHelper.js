const { assert } = QUnit;
import { isDefined } from 'core/utils/type';

class JSPdfDataGridTestHelper {
    constructor(jsPDFDocument) {
        this.jsPDFDocument = jsPDFDocument;
    }

    checkCustomizeCell(eventArgs, expectedCells, callIndex) {
        const { gridCell: actualGridCell, pdfCell: actualPdfCell } = eventArgs;
        const { gridCell: expectedGridCell, pdfCell: expectedPdfCell } = expectedCells[callIndex];

        assert.strictEqual(actualPdfCell.content, expectedPdfCell.content, `checkCustomizeCell: pdfCell.content ${callIndex}`);
        assert.deepEqual(actualPdfCell.styles, expectedPdfCell.styles || {}, `checkCustomizeCell: pdfCell.styles ${callIndex}`);

        assert.strictEqual(actualGridCell.column.dataField, actualGridCell.column.dataField, `checkCustomizeCell: column.dataField, ${callIndex}`);
        assert.strictEqual(actualGridCell.column.dataType, actualGridCell.column.dataType, `checkCustomizeCell: column.dataType, ${callIndex}`);
        assert.strictEqual(actualGridCell.column.caption, actualGridCell.column.caption, `checkCustomizeCell: column.caption, ${callIndex}`);
        assert.strictEqual(actualGridCell.column.index, actualGridCell.column.index, `checkCustomizeCell: column.index, ${callIndex}`);

        const gridCellSkipProperties = ['column'];
        for(const propertyName in actualGridCell) {
            if(gridCellSkipProperties.indexOf(propertyName) === -1) {
                if(propertyName === 'groupSummaryItems' || propertyName === 'value') {
                    assert.deepEqual(actualGridCell[propertyName], expectedGridCell[propertyName], `checkCustomizeCell: gridCell[${propertyName}], ${callIndex}`);
                } else {
                    assert.strictEqual(actualGridCell[propertyName], expectedGridCell[propertyName], `checkCustomizeCell: gridCell[${propertyName}], ${callIndex}`);
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
