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

        let currentPageMaxCellRight = 0;
        cellsToSplit.filter(cell => {
            const currentCellRightX = cell._rect.x + cell._rect.w;
            if(currentCellRightX <= pageWidth) {
                if(currentPageMaxCellRight < currentCellRightX) {
                    currentPageMaxCellRight = currentCellRightX;
                }
                return true;
            } else {
                return false;
            }
        }).forEach(cell => currentPageCells.push(cell));

        currentPageCells.forEach(cell => {
            const index = cellsToSplit.indexOf(cell);
            if(index !== -1) {
                cellsToSplit.splice(index, 1);
            }
        });

        cellsToSplit.forEach(cell => {
            cell._rect.x = (currentPageMaxCellRight !== undefined) ? (cell._rect.x - currentPageMaxCellRight + topLeft.x) : cell._rect.x;
        });

        if(currentPageCells.length > 0) {
            pages.push(currentPageCells);
        } else {
            pages.push(cellsToSplit);
            break;
        }
    }

    return pages;
}

export { applySplitting };
