import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';

function round(value) {
    return Math.round(value * 1000) / 1000; // checked with browser zoom - 500%
}

function getTextLines(doc, text, padding, font, { wordWrapEnabled, columnWidth }) {
    if(wordWrapEnabled) {
        const cellContentWidth = columnWidth - (padding.left + padding.right);
        // it also splits text by '\n' automatically
        return doc.splitTextToSize(text, cellContentWidth, {
            fontSize: font?.size || doc.getFontSize()
        });
    }
    return text.split('\n');
}

function calculateTextHeight(doc, text, padding, font, { wordWrapEnabled, columnWidth }) {
    const height = doc.getTextDimensions(text, {
        fontSize: font?.size || doc.getFontSize()
    }).h;

    const linesCount = getTextLines(doc, text, padding, font, { wordWrapEnabled, columnWidth }).length;
    return height * linesCount * doc.getLineHeightFactor() + (padding.top + padding.bottom);
}

function calculateRowHeight(doc, cells, columnWidths) {
    if(cells.length !== columnWidths.length) {
        throw 'the cells count must be equal to the count of the columns';
    }

    let rowHeight = 0;
    for(let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        if(isDefined(cells[cellIndex].rowSpan)) {
            // height will be computed at the recalculateHeightForMergedRows step
            continue;
        }
        const cellText = cells[cellIndex].pdfCell.text;
        const cellPadding = cells[cellIndex].pdfCell.padding;
        const font = cells[cellIndex].pdfCell.font;
        const wordWrapEnabled = cells[cellIndex].pdfCell.wordWrapEnabled;
        const columnWidth = columnWidths[cellIndex];
        if(isDefined(cellText)) {
            const cellHeight = calculateTextHeight(doc, cellText, cellPadding, font, { wordWrapEnabled, columnWidth });
            if(rowHeight < cellHeight) {
                rowHeight = cellHeight;
            }
        }
    }
    return rowHeight;
}

function drawLine(doc, startX, startY, endX, endY) {
    doc.line(round(startX), round(startY), round(endX), round(endY));
}

function drawRect(doc, x, y, width, height, style) {
    if(isDefined(style)) {
        doc.rect(round(x), round(y), round(width), round(height), style);
    } else {
        doc.rect(round(x), round(y), round(width), round(height));
    }
}

function drawTextInRect(doc, text, padding, rect, wordWrapEnabled, jsPdfTextOptions) {
    const textArray = getTextLines(doc, text, padding, doc.getFont(), { wordWrapEnabled, columnWidth: rect.w });
    const linesCount = textArray.length;

    const emptyPadding = { top: 0, right: 0, bottom: 0, left: 0 }; // for calculating height of one line only
    const heightOfOneLine = calculateTextHeight(doc, textArray[0], emptyPadding, doc.getFont(), { wordWrapEnabled: false });
    const textRect = {
        x: rect.x + padding.left,
        y: rect.y + padding.top,
        w: rect.w - (padding.left + padding.right),
        h: rect.h - (padding.top + padding.bottom)
    };

    // TODO: check lineHeightFactor - https://github.com/MrRio/jsPDF/issues/3234
    const y = textRect.y + (textRect.h / 2)
        - heightOfOneLine * (linesCount - 1) / 2;

    // align by vertical 'middle', https://github.com/MrRio/jsPDF/issues/1573
    const textOptions = extend({ baseline: 'middle' }, jsPdfTextOptions);
    doc.text(textArray.join('\n'), round(textRect.x), round(y), textOptions);
}

export { calculateRowHeight, calculateTextHeight, drawLine, drawRect, drawTextInRect };
