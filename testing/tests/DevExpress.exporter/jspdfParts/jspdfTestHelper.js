import { isDefined, isNumeric } from 'core/utils/type';
import { Export } from 'exporter/jspdf/export';
const { assert } = QUnit;

class JSPdfDataGridTestHelper {
    constructor(jsPDFDocument) {
        this.jsPDFDocument = jsPDFDocument;
    }

    checkTableWidth(expectedWidth, actualAutoTableOptions) {
        let actualTableWidth = actualAutoTableOptions.tableWidth;

        if(isDefined(actualTableWidth) && isNumeric(actualTableWidth)) {
            actualTableWidth = Export.convertPointsToUnit(actualTableWidth, 'px');
        }

        assert.equal(expectedWidth, actualTableWidth, 'Table width');
    }

    checkColumnWidths(expectedWidths, actualAutoTableOptions) {
        const columnStyles = actualAutoTableOptions.columnStyles;
        const actualWidths = [];

        for(let i = 0; i < expectedWidths.length; i++) {
            let width = columnStyles[i] ? columnStyles[i].cellWidth : 'auto';

            if(isNumeric(width)) {
                width = Export.convertPointsToUnit(width, 'px');
            }

            actualWidths.push(width);
        }

        assert.deepEqual(actualWidths, expectedWidths, 'Column widths');
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
