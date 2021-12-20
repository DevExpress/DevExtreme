import { isDefined } from '../../../core/utils/type';

function splitRectsByPages(rects, topLeft, rightSplitBoundary) {
    if(!isDefined(rects) || rects.length === 0) { // Empty Table
        return [[]];
    }

    const rectsByPage = splitRectsHorizontalByPages(rects, rightSplitBoundary, topLeft);
    // TODO: splitRectsVerticalByPages

    return rectsByPage;
}

function splitRectsHorizontalByPages(rects, rightSplitBoundary, topLeft) {
    const pages = [];
    const rectsToSplit = [...rects];

    while(rectsToSplit.length > 0) {
        let currentPageMaxRectRight = 0;
        const currentPageRects = rectsToSplit.filter(rect => {
            const currentCellRight = Math.round((rect.x + rect.w) * 1000) / 1000;
            if(currentCellRight <= rightSplitBoundary) {
                if(currentPageMaxRectRight <= currentCellRight) {
                    currentPageMaxRectRight = currentCellRight;
                }
                return true;
            } else {
                return false;
            }
        });

        currentPageRects.forEach(rect => {
            const index = rectsToSplit.indexOf(rect);
            if(index !== -1) {
                rectsToSplit.splice(index, 1);
            }
        });

        rectsToSplit.forEach(rect => {
            rect.x = (currentPageMaxRectRight !== undefined) ? (rect.x - currentPageMaxRectRight + topLeft.x) : rect.x;
        });

        if(currentPageRects.length > 0) {
            pages.push(currentPageRects);
        } else {
            pages.push(rectsToSplit);
            break;
        }
    }

    return pages;
}

export { splitRectsByPages };
