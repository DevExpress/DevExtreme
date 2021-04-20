import { isDefined } from '../../core/utils/type';
import { drawPdfTable } from './draw_pdf_table';

export class PdfTable {
    constructor(drawTableBorder, rect, columnWidths) {
        this.drawTableBorder = drawTableBorder;
        this.rect = rect;
        this.columnWidths = columnWidths ?? [];
        this.rows = [];
    }

    getCellX(cellIndex) {
        return this.rect.x + this.columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
    }

    getCellY(cellIndex) {
        let currentYPos = this.rect.y;
        for(let index = 0; index < this.rows.length - 1; index++) {
            const cell = this.rows[index][cellIndex];
            if(isDefined(cell?._rect?.h)) {
                currentYPos += cell._rect.h;
            }
        }
        return currentYPos;
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


            if(!cells[i].skip) {
                if(!isDefined(cells[i]._rect)) {
                    cells[i]._rect = {};
                }

                if(!isDefined(cells[i]._rect.x)) {
                    cells[i]._rect.x = this.getCellX(i);
                }

                if(!isDefined(cells[i]._rect.y)) {
                    cells[i]._rect.y = this.getCellY(i);
                }

                const columnWidth = this.columnWidths[i];
                if(isDefined(columnWidth)) {
                    if(!isDefined(cells[i]._rect.w)) {
                        cells[i]._rect.w = columnWidth;
                    }
                } else {
                    // TODO
                }

                if(!isDefined(cells[i]._rect.h)) {
                    cells[i]._rect.h = rowHeight;
                }
            }
        }
    }

    drawTo(doc) {
        drawPdfTable(doc, this);
    }
}
