import { isDefined } from '../../core/utils/type';

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

export { calculateRowHeight };
