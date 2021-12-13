import { isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';

function applySplitting(pdfCellsInfo, options) {
    if(!isDefined(options.pageWidth)) {
        return [ pdfCellsInfo ];
    }

    const topLeft = options?.topLeft ?? { x: 0, y: 0 };
    const pageWidth = options.pageWidth;
    const cells = extend([], pdfCellsInfo);
    const cellsByPage = [
        [] // Empty Page
    ];

    shiftCellsHorizontalByPages(cells, pageWidth);
    splitCellsHorizontalByPages(cells, cellsByPage, pageWidth, topLeft);

    return cellsByPage;
}

function splitCellsHorizontalByPages(cells, cellsByPage, pageWidth, topLeft) {
    cells
        .forEach(cell => {
            const { _rect, pdfRowInfo, gridCell, ...pdfCell } = cell;
            const _newRect = extend({}, cell._rect);

            let pageIndex = 0;
            if((_rect.x + _rect.w) > pageWidth) {
                pageIndex = Math.floor((_rect.x + _rect.w) / pageWidth);
                _newRect.x = topLeft.x;
            }

            const newPdfCellInfo = {
                _rect: _newRect,
                pdfRowInfo,
                gridCell,
                ...pdfCell
            };

            cellsByPage[pageIndex] = cellsByPage[pageIndex] ?? [];
            cellsByPage[pageIndex].push(newPdfCellInfo);
        });
}

function shiftCellsHorizontalByPages(cells, pageWidth) {
    cells
        .forEach(cell => {
            let pageIndex = 0;
            if((cell._rect.x + cell._rect.w) > pageWidth) {
                pageIndex = Math.floor((cell._rect.x + cell._rect.w) / pageWidth);

                const offset = (pageWidth * pageIndex) - cell._rect.x;
                shiftCellsToTheRight(cells, cell._rect.y, cell._rect.x, offset);
            }
        });
}

function shiftCellsToTheRight(pdfCellsInfo, yPos, xPos, xOffset) {
    pdfCellsInfo
        .filter((cell) => cell._rect.y === yPos && cell._rect.x >= xPos)
        .forEach(cell => cell._rect.x += xOffset);
}

export { applySplitting };
