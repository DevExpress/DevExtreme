import { isDefined } from '../../core/utils/type';

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

function drawText(doc, text, x, y, options) {
    doc.text(text, round(x), round(y), options);
}

export { calculateRowHeight, drawLine, drawRect, drawText };
