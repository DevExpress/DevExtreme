import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';

function round(value) {
    return Math.round(value * 1000) / 1000; // checked with browser zoom - 500%
}

function calculateHeightInner(doc, text) {
    return doc.getTextDimensions(text).h * doc.getLineHeightFactor();
}

function calculateTextHeight(doc, text, { wordWrapEnabled, maxWidth }) {
    if(wordWrapEnabled && !isDefined(maxWidth)) {
        throw 'maxWidth is not defined';
    }

    if(wordWrapEnabled) {
        return doc
            .splitTextToSize(text, maxWidth)
            .reduce((accumulator, lineText) => accumulator + calculateHeightInner(doc, lineText), 0);
    }

    return calculateHeightInner(doc, text);
}

function calculateRowHeight(doc, cells, wordWrapEnabled, columnWidths) {
    if(cells.length !== columnWidths.length) {
        throw 'the length of the cells must be equal to the length of the column';
    }

    let rowHeight = 0;
    for(let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cell = cells[cellIndex];
        if(isDefined(cell.text)) {
            const cellHeight = calculateTextHeight(doc, cell.text, { wordWrapEnabled, maxWidth: columnWidths[cellIndex] });
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

function drawTextInRect(doc, text, rect, wordWrapEnabled, options) {
    const lines = doc.splitTextToSize(text, rect.w);
    const linesCount = wordWrapEnabled
        ? lines.length
        : 1;

    const textToDraw = wordWrapEnabled
        ? lines
        : text;

    // align by vertical 'middle', https://github.com/MrRio/jsPDF/issues/1573
    const textOptions = extend({ baseline: 'middle' }, options);

    const heightOfOneLine = calculateHeightInner(doc, lines[0]);
    const y = rect.y + (rect.h / 2) - heightOfOneLine * (linesCount - 1) / 2;
    doc.text(textToDraw, round(rect.x), round(y), textOptions);
}

export { calculateRowHeight, drawLine, drawRect, drawTextInRect };
