import { isDefined } from '../../core/utils/type';
import { drawPdfTable } from './draw_pdf_table';

export class PdfTable {
    constructor(drawTableBorder, topLeft, columnWidths) {
        if(!isDefined(columnWidths)) {
            throw 'columnWidths is required';
        }
        if(!isDefined(topLeft)) {
            throw 'topLeft is required';
        }

        this.drawTableBorder = drawTableBorder;
        this.rect = {
            x: topLeft.x,
            y: topLeft.y,
            w: columnWidths.reduce((a, b) => a + b, 0),
            h: 0
        };
        this.columnWidths = columnWidths; // TODO
        this.rowHeights = [];
        this.rows = [];
    }

    getCellX(cellIndex) {
        return this.rect.x + this.columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
    }

    getCellY(rowIndex) {
        return this.rect.y + this.rowHeights.slice(0, rowIndex).reduce((a, b) => a + b, 0);
    }

    addRow(cells, rowHeight) {
        if(!isDefined(cells)) {
            throw 'cells is required';
        }
        if(cells.length !== this.columnWidths.length) {
            throw 'the length of the cells must be equal to the length of the column';
        }
        if(!isDefined(rowHeight)) {
            throw 'rowHeight is required';
        }
        this.rows.push(cells);
        this.rowHeights.push(rowHeight);
        for(let i = 0; i < cells.length; i++) {
            const currentCell = cells[i];
            if(currentCell.drawLeftBorder === false) {
                if(i >= 1) {
                    cells[i - 1].drawRightBorder = false;
                }
            } else if(!isDefined(currentCell.drawLeftBorder)) {
                if(i >= 1 && cells[i - 1].drawRightBorder === false) {
                    currentCell.drawLeftBorder = false;
                }
            }

            if(currentCell.drawTopBorder === false) {
                if(this.rows.length >= 2) {
                    this.rows[this.rows.length - 2][i].drawBottomBorder = false;
                }
            } else if(!isDefined(currentCell.drawTopBorder)) {
                if(this.rows.length >= 2 && this.rows[this.rows.length - 2][i].drawBottomBorder === false) {
                    currentCell.drawTopBorder = false;
                }
            }

            const columnWidth = this.columnWidths[i];
            if(!isDefined(columnWidth)) {
                throw 'column width is required'; // TODO
            }

            currentCell._rect = {
                x: this.getCellX(i),
                y: this.getCellY(this.rows.length - 1),
                w: columnWidth,
                h: rowHeight
            };
        }
        this.rect.h = this.rowHeights.reduce((a, b) => a + b, 0);
    }

    drawTo(doc) {
        drawPdfTable(doc, this);
    }
}
