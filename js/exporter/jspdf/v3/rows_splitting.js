import { isDefined } from '../../../core/utils/type';
import { roundToThreeDecimals } from './draw_utils';

function allocateRectsByPages(rects, margin, topLeft, maxBottomRight, onSeparateRectHorizontally) {
    if(!isDefined(rects) || rects.length === 0) { // Empty Table
        return [[]];
    }

    const rectsByPage = allocateRectsHorizontalByPages(rects, margin, topLeft, maxBottomRight, onSeparateRectHorizontally);
    // TODO: splitRectsVerticalByPages

    return rectsByPage;
}

function allocateRectsHorizontalByPages(rects, margin, topLeft, maxBottomRight, onSeparateRectHorizontally) {
    const pages = [];
    const rectsToSplit = [...rects];

    while(rectsToSplit.length > 0) {
        let currentPageMaxRectRight = 0;
        const currentPageRects = rectsToSplit.filter(rect => {
            const currentRectRight = roundToThreeDecimals(rect.x + rect.w);
            if(currentRectRight <= maxBottomRight.x) {
                if(currentPageMaxRectRight <= currentRectRight) {
                    currentPageMaxRectRight = currentRectRight;
                }
                return true;
            } else {
                return false;
            }
        });

        const rectsToSeparate = rectsToSplit.filter(rect => {
            // Check cells that have 'rect.x' less than 'currentPageMaxRectRight'
            const currentRectLeft = roundToThreeDecimals(rect.x);
            const currentRectRight = roundToThreeDecimals(rect.x + rect.w);
            if(currentRectLeft < currentPageMaxRectRight && currentPageMaxRectRight < currentRectRight) {
                return true;
            }
        });

        rectsToSeparate.forEach(rect => {
            const separatedRects = onSeparateRectHorizontally(rect, {
                x: rect.x,
                y: rect.y,
                w: currentPageMaxRectRight - rect.x,
                h: rect.h
            }, {
                x: currentPageMaxRectRight,
                y: rect.y,
                w: rect.w - (currentPageMaxRectRight - rect.x),
                h: rect.h
            });

            currentPageRects.push(separatedRects.left);
            rectsToSplit.push(separatedRects.right);

            const index = rectsToSplit.indexOf(rect);
            if(index !== -1) {
                rectsToSplit.splice(index, 1);
            }
        });

        currentPageRects.forEach(rect => {
            const index = rectsToSplit.indexOf(rect);
            if(index !== -1) {
                rectsToSplit.splice(index, 1);
            }
        });

        rectsToSplit.forEach(rect => {
            rect.x = (currentPageMaxRectRight !== undefined) ? (rect.x - currentPageMaxRectRight + margin.left + topLeft.x) : rect.x;
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

export { allocateRectsByPages };
