import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';

function round(value) {
    return Math.round(value * 1000) / 1000; // checked with browser zoom - 500%
}

function calculateTextHeight(doc, text) {
    return doc.getTextDimensions(text).h * doc.getLineHeightFactor();
}

function calculateRowHeight(doc, cells) {
    let rowHeight = 0;
    for(let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cellText = cells[cellIndex].text;
        if(isDefined(cellText)) {
            const cellHeight = calculateTextHeight(doc, cellText);
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
    return (doc.getLineHeightFactor() - 1.15) * doc.getFontSize();
}

function drawTextInRect(doc, text, rect, options) {
    const textArray = text.split('\n');
    const linesCount = textArray.length;

    const heightOfOneLine = calculateTextHeight(doc, textArray[0]);
    const y = rect.y + (rect.h / 2)
        - heightOfOneLine * (linesCount - 1) / 2
        + getLineHeightShift(doc);

    // align by vertical 'middle', https://github.com/MrRio/jsPDF/issues/1573
    const textOptions = extend({ baseline: 'middle' }, options);
    doc.text(text, round(rect.x), round(y), textOptions);
}

export { calculateRowHeight, drawLine, drawRect, drawTextInRect };
