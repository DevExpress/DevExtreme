import { isDefined } from '../../core/utils/type';
import { drawTextInRect, drawRect } from './pdf_utils';
import { extend } from '../../core/utils/extend';

function drawPDF(doc, rows, options) {
    const docStyles = getDocumentStyles(doc);

    let y = options?.topLeft?.y ?? 0;
    rows.forEach(row => {
        let x = options?.topLeft?.x ?? 0;
        row.cells.forEach(cell => {
            const pdfCell = cell.pdfCell;
            const rect = { x, y, w: pdfCell._width, h: pdfCell._height };
            drawCell(doc, cell, rect, docStyles);
            x += pdfCell._width;
        });
        y += row.height;
    });
    setDocumentStyles(doc, docStyles);
}

function drawCell(doc, cell, rect, docStyles) {
    const pdfCell = cell.pdfCell;
    specifyCellStyles(doc, pdfCell, docStyles);

    if(isDefined(pdfCell.text) && pdfCell.text !== '') { // TODO: use cell.text.trim() ?
        drawTextInRect(doc, pdfCell.text, rect, false, pdfCell.jsPdfTextOptions);
    }

    doc.setLineWidth(1);
    drawRect(doc, rect.x, rect.y, rect.w, rect.h);
}

function getDocumentStyles(doc) {
    const docFont = doc.getFont();

    return {
        borderColor: doc.getDrawColor(),
        font: {
            name: docFont.fontName,
            style: docFont.fontStyle,
            size: doc.getFontSize()
        },
        textColor: doc.getTextColor()
    };
}

function specifyCellStyles(doc, cell, styles) {
    const borderColor = isDefined(cell.borderColor) ? cell.borderColor : styles.borderColor;
    if(borderColor !== doc.getDrawColor()) {
        doc.setDrawColor(borderColor);
    }

    const font = isDefined(cell.font) ? extend({}, styles.font, cell.font) : styles.font;
    const docFont = doc.getFont();
    if(
        font.name !== docFont.fontName ||
        font.style !== docFont.fontStyle ||
        isDefined(font.weight) // fontWeight logic, https://raw.githack.com/MrRio/jsPDF/master/docs/jspdf.js.html#line4842
    ) {
        doc.setFont(font.name, font.style, font.weight);
    }
    if(font.size !== doc.getFontSize()) {
        doc.setFontSize(font.size);
    }

    const textColor = isDefined(cell.textColor) ? cell.textColor : styles.textColor;
    if(textColor !== doc.getTextColor()) {
        doc.setTextColor(textColor);
    }
}

function setDocumentStyles(doc, styles) {
    const {
        borderColor,
        font,
        textColor
    } = styles;

    const docFont = doc.getFont();
    if(
        docFont.fontName !== font.name ||
        docFont.fontStyle !== font.style
    ) {
        doc.setFont(font.name, font.style, undefined);
    }
    const docFontSize = doc.getFontSize();
    if(docFontSize !== font.size) {
        doc.setFontSize(font.size);
    }

    if(doc.getDrawColor() !== borderColor) {
        doc.setDrawColor(borderColor);
    }

    if(doc.getTextColor() !== textColor) {
        doc.setTextColor(textColor);
    }
}

export { drawPDF };

