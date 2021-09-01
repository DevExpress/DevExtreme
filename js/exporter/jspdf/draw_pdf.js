import { isDefined } from '../../core/utils/type';
import { drawTextInRect, drawRect } from './pdf_utils';

function drawPDF(doc, rows, options) {
    let y = options?.topLeft?.y ?? 0;
    rows.forEach(row => {
        let x = options?.topLeft?.x ?? 0;
        row.cells.forEach(cell => {
            const pdfCell = cell.pdfCell;
            const rect = { x, y, w: pdfCell._width, h: pdfCell._height };
            drawCell(doc, cell, rect);
            x += pdfCell._width;
        });
        y += row.height;
    });
}

function drawCell(doc, cell, rect) {
    const pdfCell = cell.pdfCell;
    if(isDefined(pdfCell.text) && pdfCell.text !== '') { // TODO: use cell.text.trim() ?
        drawTextInRect(doc, pdfCell.text, rect, false, pdfCell.jsPdfTextOptions);
    }

    doc.setLineWidth(1);
    drawRect(doc, rect.x, rect.y, rect.w, rect.h);
}

export { drawPDF };

