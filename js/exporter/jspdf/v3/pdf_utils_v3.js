import { isDefined } from '../../../core/utils/type';

function getPageWidth(doc) {
    return doc.internal.pageSize.getWidth();
}

function getPageHeight(doc) {
    return doc.internal.pageSize.getHeight();
}

function getTextLines(doc, text, font, { wordWrapEnabled, targetRectWidth }) {
    if(wordWrapEnabled) {
        // it also splits text by '\n' automatically
        const usedFont = doc.getFont(font?.name, font?.style);
        return doc.splitTextToSize(text, targetRectWidth, {
            fontSize: font?.size || doc.getFontSize(),
            fontName: usedFont.fontName,
            fontStyle: usedFont.fontStyle
        });
    }
    return text.split('\n');
}

function calculateTargetRectWidth(columnWidth, padding) {
    return columnWidth - (padding.left + padding.right);
}

function calculateTextHeight(doc, text, font, { wordWrapEnabled, targetRectWidth }) {
    const height = doc.getTextDimensions(text, {
        font: doc.getFont(font?.name, font?.style),
        fontSize: font?.size || doc.getFontSize()
    }).h;

    const linesCount = getTextLines(doc, text, font, { wordWrapEnabled, targetRectWidth }).length;
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

export { calculateRowHeight, calculateTextHeight, calculateTargetRectWidth, getTextLines, getPageWidth, getPageHeight };
