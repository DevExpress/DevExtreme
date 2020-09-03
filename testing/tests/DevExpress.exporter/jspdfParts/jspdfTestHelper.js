const { assert } = QUnit;

class JSPdfDataGridTestHelper {
    constructor(jsPDFDocument) {
        this.jsPDFDocument = jsPDFDocument;
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
            assert.strictEqual(expectedCells[rowType][rowIndex].length, actualAutoTableOptions[rowType][rowIndex].length, 'actual column count of the head');
        }
    }

    checkCellsContent(expectedCells, actualAutoTableOptions, rowType) {
        this._iterateCells(expectedCells[rowType], (cell, rowIndex, columnIndex) => {
            assert.strictEqual(actualAutoTableOptions[rowType][rowIndex][columnIndex].content, cell.content, `AutoTable ${rowType}[${rowIndex}][${columnIndex}].content`);
        });
    }

    checkMergeCells(expectedCells, actualAutoTableOptions, rowType) {
        this._iterateCells(expectedCells[rowType], (cell, rowIndex, columnIndex) => {
            assert.strictEqual(actualAutoTableOptions[rowType][rowIndex][columnIndex].colSpan, cell.colSpan, `AutoTable ${rowType}[${rowIndex}][${columnIndex}].colSpan`);
            assert.strictEqual(actualAutoTableOptions[rowType][rowIndex][columnIndex].rowSpan, cell.rowSpan, `AutoTable ${rowType}[${rowIndex}][${columnIndex}].rowSpan`);
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
