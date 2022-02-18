import { isDefined } from '../../../core/utils/type';

const DOTS_TEXT = '...';

function toPdfUnit(doc, value) {
    const defaultScaleFactor = 1; // https://github.com/parallax/jsPDF/blob/master/src/jspdf.js#L3212
    const coefficient = defaultScaleFactor / doc.internal.scaleFactor;
    return value * coefficient;
}

function getPageWidth(doc) {
    return doc.internal.pageSize.getWidth();
}

function getPageHeight(doc) {
    return doc.internal.pageSize.getHeight();
}

function getTextLines(doc, text, font, { wordWrapEnabled, targetRectWidth }) {
    const usedFont = doc.getFont(font?.name, font?.style);
    const fontOptions = {
        fontSize: font?.size || doc.getFontSize(),
        fontName: usedFont.fontName,
        fontStyle: usedFont.fontStyle
    };

    if(wordWrapEnabled) {
        return doc.splitTextToSize(text, targetRectWidth, fontOptions);
    }

    const textWithoutLineBreak = text.split('\n').join(' ');
    const textWidth = getTextDimensions(doc, textWithoutLineBreak, font).w;
    if(textWidth > targetRectWidth) {
        const dotsWidth = getTextDimensions(doc, DOTS_TEXT, font).w;
        const textWithDots = doc.splitTextToSize(textWithoutLineBreak, targetRectWidth - dotsWidth, fontOptions)[0] + DOTS_TEXT;
        return [textWithDots];
    }

    return [textWithoutLineBreak];
}

function calculateTargetRectWidth(columnWidth, padding) {
    return columnWidth - (padding.left + padding.right);
}

function getTextDimensions(doc, text, font) {
    return doc.getTextDimensions(text, {
        font: doc.getFont(font?.name, font?.style),
        fontSize: font?.size || doc.getFontSize()
    });
}
function calculateTextHeight(doc, text, font, { wordWrapEnabled, targetRectWidth }) {
    const heightOfOneLine = getTextDimensions(doc, text, font).h;

    const linesCount = getTextLines(doc, text, font, { wordWrapEnabled, targetRectWidth }).length;
    return heightOfOneLine * linesCount * doc.getLineHeightFactor();
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
        const targetRectWidth = calculateTargetRectWidth(columnWidth, cellPadding);
        if(isDefined(cellText)) {
            const cellHeight = calculateTextHeight(doc, cellText, font, { wordWrapEnabled, targetRectWidth }) + cellPadding.top + cellPadding.bottom;
            if(rowHeight < cellHeight) {
                rowHeight = cellHeight;
            }
        }
    }
    return rowHeight;
}

function applyWordWrap(doc, rowsInfo) {
    rowsInfo.forEach(row => {
        row.cells.forEach(({ pdfCell }) => {
            if(isDefined(pdfCell.text)) {
                const lines = getTextLines(doc, pdfCell.text, pdfCell.font, {
                    wordWrapEnabled: pdfCell.wordWrapEnabled,
                    targetRectWidth: calculateTargetRectWidth(pdfCell._rect.w, pdfCell.padding)
                });
                pdfCell.text = lines.join('\n');
            }
        });
    });
}

function applyRtl(doc, rectsByPages, options) {
    rectsByPages.forEach(pageRects => {
        pageRects.forEach(pdfCell => {
            const mirroredX = getPageWidth(doc) - (pdfCell._rect.x + pdfCell._rect.w);
            const marginDiff = options.margin.left - options.margin.right;
            pdfCell._rect.x = mirroredX + marginDiff;
        });
    });
}

export { calculateRowHeight, calculateTextHeight, calculateTargetRectWidth, getTextLines, getPageWidth, getPageHeight, applyWordWrap, toPdfUnit, applyRtl };
