import { isDefined } from '../../core/utils/type';
import { drawPdfTable } from './draw_pdf_table';

export class PdfTable {
    constructor(drawTableBorder, rect) {
        this.drawTableBorder = drawTableBorder;
        this.rect = rect;
        this.rows = [];
    }

    addRow(cells) {
        if(!isDefined(cells)) {
            throw 'cells is required';
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
        }
    }

    drawTo(doc) {
        drawPdfTable(doc, this);
    }
}
