function getFontSize(doc) {
    return doc.getFontSize();
}

function splitTextToArray(doc, text, rectWidth) {
    return doc.splitTextToSize(text, rectWidth);
}

function calculateRowHeight(doc, cells, columnWidths) {
    if(cells.length !== columnWidths.length) {
        throw 'the length of the cells must be equal to the length of the column';
    }

    let rowHeight = 0;
    const lineHeight = doc.getLineHeightFactor();
    for(let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
        const cell = cells[cellIndex];
        const widthsForCurrentCell = columnWidths.slice(cellIndex, cellIndex + (cell.colSpan || 0) + 1);
        const cellWidth = widthsForCurrentCell.reduce((accumulator, val) => { return accumulator + val; });

        let cellHeight = 0;
        const lines = splitTextToArray(doc, cell.text, cellWidth);
        for(let textIndex = 0; textIndex < lines.length; textIndex++) {
            cellHeight += doc.getTextDimensions(lines[textIndex]).h * lineHeight;
        }
        if(rowHeight < cellHeight) {
            rowHeight = cellHeight;
        }
    }
    return rowHeight;
}

export { calculateRowHeight, splitTextToArray, getFontSize };
