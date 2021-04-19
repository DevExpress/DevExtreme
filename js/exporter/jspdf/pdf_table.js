import { isDefined } from '../../core/utils/type';
import { drawPdfTable } from './draw_pdf_table';

export class PdfTable {
    constructor(drawTableBorder, rect, columnWidths) {
        this.drawTableBorder = drawTableBorder;
        this.rect = rect;
        this.columnWidths = columnWidths ?? [];
        this.rows = [];
    }

    tryGetXPos(cellIndex) {
        return this.rect.x + this.columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
    }

    tryGetYPos(cellIndex) {
        let currentYPos = this.rect.y;
        for(let index = 0; index < this.rows.length - 1; index++) {
            const cell = this.rows[index][cellIndex];
            if(cell && cell.rect.h) {
                currentYPos += cell.rect.h;
            }
        }
        return currentYPos;
    }

    addRow(cells, rowHeight) {
        if(!isDefined(cells)) {
            throw 'cells is required';
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
                if(!isDefined(cells[i].rect)) {
                    cells[i].rect = {};
                }

                if(!isDefined(cells[i].rect.x)) {
                    cells[i].rect.x = this.tryGetXPos(i);
                }

                if(!isDefined(cells[i].rect.y)) {
                    cells[i].rect.y = this.tryGetYPos(i);
                }

                const columnWidth = this.columnWidths[i];
                if(isDefined(columnWidth)) {
                    if(!isDefined(cells[i].rect.w)) {
                        cells[i].rect.w = columnWidth;
                    }
                } else {
                    // TODO
                }

                if(!isDefined(cells[i].rect.h)) {
                    cells[i].rect.h = rowHeight;
                }
            }
        }
    }

    drawTo(doc) {
        drawPdfTable(doc, this);
    }
}
