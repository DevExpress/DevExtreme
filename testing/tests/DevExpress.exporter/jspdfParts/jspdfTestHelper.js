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

    checkCellsContent(expectedHead, expectedBody, actualAutoTableOptions) {
        this._iterateCells(expectedHead, (pdfCell, rowIndex, columnIndex) => {
            assert.equal(actualAutoTableOptions.head[rowIndex][columnIndex].content, pdfCell.content, `AutoTable head[${rowIndex}][${columnIndex}].content`);
        });
        this._iterateCells(expectedBody, (pdfCell, rowIndex, columnIndex) => {
            assert.equal(actualAutoTableOptions.body[rowIndex][columnIndex].content, pdfCell.content, `AutoTable body[${rowIndex}][${columnIndex}].content`);
        });
    }

    _iterateCells(rows, callback) {
        for(let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            for(let columnIndex = 0; columnIndex < rows[rowIndex].length; columnIndex++) {
                const pdfCell = {
                    content: rows[rowIndex][columnIndex]
                };
                callback(pdfCell, rowIndex, columnIndex);
            }
        }
    }
}

export { JSPdfDataGridTestHelper };
