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
    const cellsByPage = [
        [] // Empty Page
    ];
    const buffer = cells.map(cell => cell);
    let pageIndex = 0;

    while(buffer.length > 0) {
        cellsByPage[pageIndex] = cellsByPage[pageIndex] ?? [];

        // Detect cell for current page
        const pageCells = buffer.filter(cell => {
            const cellLeftPos = cell._rect.x;
            const cellRightPos = cell._rect.x + cell._rect.w;
            return cellLeftPos === topLeft.x || cellRightPos <= pageWidth;
        });

        // Move cells from buffer to page array
        pageCells.forEach(cell => {
            cellsByPage[pageIndex].push(cell);

            const index = buffer.indexOf(cell);
            if(index !== -1) {
                buffer.splice(index, 1);
            }
        });

        // Cells that are outside the page move to the left
        let leftOffset;
        buffer.forEach(cell => {
            if(!isDefined(leftOffset) || leftOffset > cell._rect.x) {
                leftOffset = cell._rect.x - topLeft.x;
            }
        });

        if(leftOffset > 0) {
            buffer.forEach(cell => {
                cell._rect.x -= leftOffset;
            });
        }
        pageIndex += 1;
    }

    return cellsByPage;
}

export { applySplitting };
