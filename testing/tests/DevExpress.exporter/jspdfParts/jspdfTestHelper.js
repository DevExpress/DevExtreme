import { isNumeric } from 'core/utils/type';
import { Export } from 'exporter/jspdf/export';

const { assert } = QUnit;

class JSPdfDataGridTestHelper {
    constructor(jsPDFDocument) {
        this.jsPDFDocument = jsPDFDocument;
    }

    checkTableAndColumnWidths(expectedTableWidth, expectedColumnWidths, actualAutoTableOptions) {
        const expectedTableWidthInPoints = isNumeric(expectedTableWidth)
            ? Export.convertPixelsToPdfUnits(this.jsPDFDocument, expectedTableWidth)
            : expectedTableWidth;
        const expectedColumnWidthsInPoints = expectedColumnWidths.map((w) => {
            return isNumeric(w) ? Export.convertPixelsToPoints(w) : w;
        });

        const actualColumnWidths = [];
        const columnStyles = actualAutoTableOptions.columnStyles;
        for(let i = 0; i < expectedColumnWidths.length; i++) {
            actualColumnWidths.push(columnStyles[i].cellWidth);
        }

        assert.equal(actualAutoTableOptions.tableWidth, expectedTableWidthInPoints, 'Table width');
        assert.deepEqual(actualColumnWidths, expectedColumnWidthsInPoints, 'Column widths');
    }

    checkTableAndColumnWidthsInOutput(expectedTableWidth, expectedColumnWidths) {
        const expectedTableWidthInPoints = isNumeric(expectedTableWidth)
            ? Export.convertPixelsToPoints(expectedTableWidth)
            : expectedTableWidth;
        const expectedColumnWidthsInPoints = expectedColumnWidths.map((w) => {
            return isNumeric(w) ? Export.convertPixelsToPoints(w) : w;
        });

        const pdfTable = this._getTableFromPdfOutput();
        const pdfColumnWidths = pdfTable.rows[0].map((cell) => { return cell.rect.w; });

        assert.equal(pdfTable.tableWidth, expectedTableWidthInPoints, 'Table width');
        assert.deepEqual(pdfColumnWidths, expectedColumnWidthsInPoints, 'Column widths');
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

    _getTableFromPdfOutput() {
        const buffer = this.jsPDFDocument.output('arraybuffer');
        const pdfContent = String.fromCharCode.apply(null, new Uint8Array(buffer));
        const stream = pdfContent.substring(pdfContent.indexOf('stream'), pdfContent.indexOf('endstream'));
        const lines = stream.replace(/\r/g, '').split(/\n/g);

        const rects = lines
            .filter(line => line.indexOf(' re') !== -1)
            .map((line) => {
                const parts = line.split(' ');
                const rect = {
                    x: Math.round(parseFloat(parts[0]) * 1000) / 1000,
                    y: Math.round(parseFloat(parts[1]) * 1000) / 1000,
                    w: Math.round(parseFloat(parts[2]) * 1000) / 1000,
                    h: Math.round(parseFloat(parts[3]) * 1000) / 1000
                };

                if(rect.h < 0) {
                    const _h = Math.abs(rect.h);
                    rect.y = rect.y - _h;
                    rect.h = _h;
                }

                return rect;
            });

        const xPositions = [];
        const yPositions = [];
        for(let r = 0; r < rects.length; r++) {
            if(xPositions.indexOf(rects[r].x) === -1) { xPositions.push(rects[r].x); }
            if(yPositions.indexOf(rects[r].y) === -1) { yPositions.push(rects[r].y); }
        }

        let text = {};
        const texts = [];
        for(let i = 0; i < lines.length; i++) {
            const parts = lines[i].split(' ');
            const operator = parts[parts.length - 1];

            if(operator === 'BT') { text = {}; }
            if(operator === 'Td') { text.pos = { x: parts[0], y: parts[1] }; }
            if(operator === 'Tj') { text.content = parts[0].replace(/[()]/g, ''); }
            if(operator === 'ET') { texts.push(text); }
        }

        const rows = [];
        for(let y = 0; y < yPositions.length; y++) {
            const row = [];
            for(let x = 0; x < xPositions.length; x++) {
                const cell = {};
                cell.rect = rects.filter((rect) => {
                    return rect.x === xPositions[x] && rect.y === yPositions[y];
                })[0];
                cell.texts = texts.filter((text) => {
                    return cell.rect.x < text.pos.x && text.pos.x < (cell.rect.x + cell.rect.w) &&
                        cell.rect.y < text.pos.y && text.pos.y < (cell.rect.y + cell.rect.h);
                });
                row.push(cell);
            }
            rows.push(row);
        }

        let tableWidth;
        if(rows.length > 0) {
            tableWidth = rows[0].reduce((a, b) => { return a.rect.w + b.rect.w; });
        }

        return {
            rows: rows,
            tableWidth: tableWidth
        };
    }
}

export { JSPdfDataGridTestHelper };
