import { isDefined } from '../../../core/utils/type';

function splitRectsByPages(rects, topLeft, pageWidth) {
    if(!isDefined(pageWidth)) {
        return [ rects ];
    }

    const rectsByPage = splitRectsHorizontalByPages(rects, pageWidth, topLeft);
    // TODO: splitRectsVerticalByPages

    return rectsByPage;
}

function splitRectsHorizontalByPages(rects, pageWidth, topLeft) {
    const pages = [];
    const rectsToSplit = [...rects];

    while(rectsToSplit.length > 0) {
        let currentPageMaxRectRight = 0;
        const currentPageRects = rectsToSplit.filter(rect => {
            const currentCellRight = rect.x + rect.w;
            if(currentCellRight <= pageWidth) {
                if(currentPageMaxRectRight < currentCellRight) {
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
