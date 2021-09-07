import { isDefined } from '../../core/utils/type';
import { drawTextInRect, drawRect } from './pdf_utils';
import { extend } from '../../core/utils/extend';

const defaultBorderLineWidth = 1;

function drawPdfCells(doc, cellsArray) {
    const docStyles = getDocumentStyles(doc);
    cellsArray.forEach(cell => {
        drawCell(doc, cell, docStyles);
    });
    setDocumentStyles(doc, docStyles);
}

function drawCell(doc, cell, docStyles) {
    setCurrentFont(doc, cell, docStyles);

    if(isDefined(cell.text) && cell.text !== '') { // TODO: use cell.text.trim() ?
        drawTextInRect(doc, cell.text, cell._rect, cell.wordWrapEnabled, cell.jsPdfTextOptions);
    }

    doc.setLineWidth(defaultBorderLineWidth);
    drawRect(doc, cell._rect.x, cell._rect.y, cell._rect.w, cell._rect.h);
}

function setCurrentFont(doc, cell, styles) {
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

export { drawPdfCells };

