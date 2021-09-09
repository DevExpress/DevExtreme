import { isDefined } from '../../../core/utils/type';
import { drawTextInRect, drawLine, drawRect } from './pdf_utils_v3';
import { extend } from '../../../core/utils/extend';

const defaultBorderLineWidth = 1;

function drawCellsContent(doc, cellsArray) {
    const docStyles = getDocumentStyles(doc);
    cellsArray.forEach(cell => {
        // TODO: drawCellBackground(doc, cell);
        drawCellText(doc, cell, docStyles);
    });
    setDocumentStyles(doc, docStyles);
}

function drawCellText(doc, cell, docStyles) {
    setCurrentFont(doc, cell, docStyles);

    if(isDefined(cell.text) && cell.text !== '') { // TODO: use cell.text.trim() ?
        drawTextInRect(doc, cell.text, cell._rect, cell.wordWrapEnabled, cell.jsPdfTextOptions);
    }
}

function drawCellsLines(doc, cellsArray) {
    cellsArray.forEach(cell => {
        // TODO: doc.setDrawColor(borderColor); // cell.borderColor OR docStyles.borderColor
        drawBorders(doc, cell._rect, cell.drawLeftBorder, cell.drawRightBorder, cell.drawTopBorder, cell.drawBottomBorder);
    });
}

function drawGridLines(doc, rect) {
    drawBorders(doc, rect);
}

function drawBorders(doc, rect, drawLeftBorder = true, drawRightBorder = true, drawTopBorder = true, drawBottomBorder = true) {
    if(!isDefined(rect)) {
        throw 'rect is required';
    }

    if(!drawLeftBorder && !drawRightBorder && !drawTopBorder && !drawBottomBorder) {
        return;
    } else if(drawLeftBorder && drawRightBorder && drawTopBorder && drawBottomBorder) {
        doc.setLineWidth(defaultBorderLineWidth);
        drawRect(doc, rect.x, rect.y, rect.w, rect.h);
    } else {
        doc.setLineWidth(defaultBorderLineWidth);

        if(drawTopBorder) {
            drawLine(doc, rect.x, rect.y, rect.x + rect.w, rect.y); // top
        }

        if(drawLeftBorder) {
            drawLine(doc, rect.x, rect.y, rect.x, rect.y + rect.h); // left
        }

        if(drawRightBorder) {
            drawLine(doc, rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h); // right
        }

        if(drawBottomBorder) {
            drawLine(doc, rect.x, rect.y + rect.h, rect.x + rect.w, rect.y + rect.h); // bottom
        }
    }
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

export { drawCellsContent, drawCellsLines, drawGridLines };

