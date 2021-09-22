import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';

function round(value) {
    return Math.round(value * 1000) / 1000; // checked with browser zoom - 500%
}

function getTextLines(doc, text, font, { wordWrapEnabled, columnWidth }) {
    if(wordWrapEnabled) {
        // it also splits text by '\n' automatically
        return doc.splitTextToSize(text, columnWidth, {
            fontSize: font?.size || doc.getFontSize()
        });
    }
    return text.split('\n');
}

function calculateTextHeight(doc, text, font, { wordWrapEnabled, columnWidth }) {
    const height = doc.getTextDimensions(text, {
        fontSize: font?.size || doc.getFontSize()
    }).h;

    const linesCount = getTextLines(doc, text, font, { wordWrapEnabled, columnWidth }).length;
    return height * linesCount * doc.getLineHeightFactor();
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
        const font = cells[cellIndex].pdfCell.font;
        const wordWrapEnabled = cells[cellIndex].pdfCell.wordWrapEnabled;
        const columnWidth = columnWidths[cellIndex];
        if(isDefined(cellText)) {
            const cellHeight = calculateTextHeight(doc, cellText, font, { wordWrapEnabled, columnWidth });
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

function getLineHeightShift(doc) {
    const DEFAULT_LINE_HEIGHT = 1.15;

    // TODO: check lineHeightFactor from text options. Currently supports only doc options - https://github.com/MrRio/jsPDF/issues/3234
    return (doc.getLineHeightFactor() - DEFAULT_LINE_HEIGHT) * doc.getFontSize();
}

function drawTextInRect(doc, text, rect, verticalAlign, wordWrapEnabled, jsPdfTextOptions) {
    const textArray = getTextLines(doc, text, doc.getFont(), { wordWrapEnabled, columnWidth: rect.w });
    const linesCount = textArray.length;

    const heightOfOneLine = calculateTextHeight(doc, textArray[0], doc.getFont(), { wordWrapEnabled: false });

    const vAlign = verticalAlign ?? 'middle';
    const verticalAlignCoefficientsMap = { top: 0, middle: 0.5, bottom: 1 };
    const y = rect.y
        + (rect.h * verticalAlignCoefficientsMap[vAlign])
        - heightOfOneLine * (linesCount - 1) * verticalAlignCoefficientsMap[vAlign]
        + getLineHeightShift(doc);

    const textOptions = extend({ baseline: vAlign }, jsPdfTextOptions);
    doc.text(textArray.join('\n'), round(rect.x), round(y), textOptions);
}

export { calculateRowHeight, calculateTextHeight, drawLine, drawRect, drawTextInRect };
