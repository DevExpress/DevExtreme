const { assert } = QUnit;

class JSPdfDataGridTestHelper {
    constructor(jsPDFDocument) {
        this.jsPDFDocument = jsPDFDocument;
    }

    checkTableAndColumnWidths(expectedTableWidth, expectedColumnWidths, actualAutoTableOptions) {
        assert.equal(actualAutoTableOptions.tableWidth, expectedTableWidth, 'Table width');

        const columnStyles = actualAutoTableOptions.columnStyles;
        const actualWidths = [];

        for(let i = 0; i < expectedColumnWidths.length; i++) {
            const width = columnStyles[i] ? columnStyles[i].cellWidth : 'auto';
            actualWidths.push(width);
        }

        assert.deepEqual(actualWidths, expectedColumnWidths, 'Column widths');
    }

    checkCellsContent(headCellsArray, bodyCellsArray, actualAutoTableOptions) {
        this._iterateCells(headCellsArray, (content, rowIndex, columnIndex) => {
            assert.equal(actualAutoTableOptions.head[rowIndex][columnIndex].content, content, `AutoTable head[${rowIndex}][${columnIndex}].content`);
        });
        this._iterateCells(bodyCellsArray, (content, rowIndex, columnIndex) => {
            assert.equal(actualAutoTableOptions.body[rowIndex][columnIndex].content, content, `AutoTable body[${rowIndex}][${columnIndex}].content`);
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
