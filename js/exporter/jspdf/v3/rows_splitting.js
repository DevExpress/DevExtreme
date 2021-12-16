import { isDefined } from '../../../core/utils/type';

function applySplitting(pdfCellsInfo, options) {
    if(!isDefined(options.pageWidth)) {
        return [ pdfCellsInfo ];
    }

    const topLeft = options?.topLeft ?? { x: 0, y: 0 };
    const pageWidth = options.pageWidth;

    const cellsByPage = splitCellsHorizontalByPages(pdfCellsInfo, pageWidth, topLeft);
    // TODO: splitCellsVerticalByPages

    return cellsByPage;
}

function splitCellsHorizontalByPages(cells, pageWidth, topLeft) {
    const pages = [];
    const cellsToSplit = cells.map(cell => {
        const result = Object.assign({}, cell);
        result.rect = Object.assign({}, cell.rect);
        return result;
    });

    while(cellsToSplit.length > 0) {
        const currentPageCells = [];
        cellsToSplit.filter(cell => {
            return (cell._rect.x + cell._rect.w) <= pageWidth;
        }).forEach(cell => currentPageCells.push(cell));

        currentPageCells.forEach(cell => {
            const index = cellsToSplit.indexOf(cell);
            if(index !== -1) {
                cellsToSplit.splice(index, 1);
            }
        });

        let moveBufferCellsToLeftOffset = 0;
        currentPageCells.forEach((cell) => {
            const offset = (cell._rect.x + cell._rect.w) - topLeft.x;
            moveBufferCellsToLeftOffset = moveBufferCellsToLeftOffset > offset ? moveBufferCellsToLeftOffset : offset;
        });

        cellsToSplit.forEach(cell => {
            cell._rect.x = moveBufferCellsToLeftOffset ? (cell._rect.x - moveBufferCellsToLeftOffset) : cell._rect.x;
        });

        if(currentPageCells.length > 0) {
            pages.push(currentPageCells);
        } else {
            break;
        }
    }

    return pages;
}

export { applySplitting };
