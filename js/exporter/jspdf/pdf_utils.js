import { isDefined } from '../../core/utils/type';
import { extend } from '../../core/utils/extend';

function round(value) {
    return Math.round(value * 1000) / 1000; // checked with browser zoom - 500%
}

function getArrayMaxValue(array) {
    return array.length
        ? Math.max(...array)
        : 0;
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
    if(!isDefined(text)) {
        return 0;
    }
    const height = doc.getTextDimensions(text, {
        fontSize: font?.size || doc.getFontSize()
    }).h;

    const linesCount = getTextLines(doc, text, font, { wordWrapEnabled, columnWidth }).length;
    return height * linesCount * doc.getLineHeightFactor();
}

function calculateRowHeight(doc, cells, columnWidths, rowIndex, customerHeight, additionalRowHeights) {
    if(cells.length !== columnWidths.length) {
        throw 'the cells count must be equal to the count of the columns';
    }

    const heightsInfo = cells.map((cell, index) => {
        return {
            rowSpan: cell.rowSpan,
            height: calculateTextHeight(doc, cell.text, cell.font, {
                wordWrapEnabled: cell.wordWrapEnabled,
                columnWidth: columnWidths[index]
            })
        };
    });

    const heightsWithoutMergedRows = heightsInfo
        .filter(cell => !isDefined(cell.rowSpan))
        .map(cell => cell.height);

    const maxHeightWithoutMergedRows = isDefined(customerHeight)
        ? customerHeight
        : getArrayMaxValue(heightsWithoutMergedRows);

    if(additionalRowHeights[rowIndex] > 0) {
        additionalRowHeights[rowIndex] -= Math.min(maxHeightWithoutMergedRows, additionalRowHeights[rowIndex]);
    }

    heightsInfo
        .filter(cell => isDefined(cell.rowSpan))
        .forEach((cell) => {
            let delta = (cell.height - maxHeightWithoutMergedRows) / (cell.rowSpan);
            for(let index = rowIndex + 1; index <= rowIndex + cell.rowSpan; index++) {
                const freeSpace = Math.max(additionalRowHeights[rowIndex], delta);
                if(delta > 0) {
                    additionalRowHeights[index] = freeSpace;
                }
                delta -= freeSpace;
            }
        });

    return maxHeightWithoutMergedRows + additionalRowHeights[rowIndex];
}

function calculateColumnWidthsByColSpanAndSplitInfo(pdfGrid, currentRowInfo) {
    const widthsArray = pdfGrid._currentHorizontalTables.flatMap((table) => table.columnWidths);
    const splitIndexes = pdfGrid._splitByColumns.map(splitInfo => splitInfo.columnIndex).sort();
    return widthsArray
        .map((value, index) => {
            const cell = currentRowInfo.cellsInfo[index];
            const collSpan = cell.colSpan || 0;
            let columnWidth = 0;
            for(let cellIndex = index; cellIndex <= index + collSpan; cellIndex++) {
                columnWidth += widthsArray[cellIndex];
                if(splitIndexes[0] === cellIndex + 1) {
                    splitIndexes.splice(0, 1);
                    break;
                }
            }
            return columnWidth;
        });
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

function drawTextInRect(doc, text, rect, wordWrapEnabled, jsPdfTextOptions) {
    const textArray = getTextLines(doc, text, doc.getFont(), { wordWrapEnabled, columnWidth: rect.w });
    const linesCount = textArray.length;

    const heightOfOneLine = calculateTextHeight(doc, textArray[0], doc.getFont(), { wordWrapEnabled: false });

    // TODO: check lineHeightFactor - https://github.com/MrRio/jsPDF/issues/3234
    const y = rect.y + (rect.h / 2)
        - heightOfOneLine * (linesCount - 1) / 2;

    // align by vertical 'middle', https://github.com/MrRio/jsPDF/issues/1573
    const textOptions = extend({ baseline: 'middle' }, jsPdfTextOptions);
    doc.text(textArray.join('\n'), round(rect.x), round(y), textOptions);
}

export { calculateRowHeight, drawLine, drawRect, drawTextInRect, calculateColumnWidthsByColSpanAndSplitInfo };
