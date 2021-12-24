import { isDefined } from '../../../core/utils/type';
import { round } from './draw_utils';

function splitRectsByPages(rects, margin, topLeft, maxBottomRight) {
    if(!isDefined(rects) || rects.length === 0) { // Empty Table
        return [[]];
    }

    const rectsByPage = splitRectsHorizontalByPages(rects, margin, topLeft, maxBottomRight);
    // TODO: splitRectsVerticalByPages

    return rectsByPage;
}

function splitRectsHorizontalByPages(rects, margin, topLeft, maxBottomRight) {
    const pages = [];
    const rectsToSplit = [...rects];

    while(rectsToSplit.length > 0) {
        let currentPageMaxRectRight = 0;
        const currentPageRects = rectsToSplit.filter(rect => {
            const currentRectRight = round(rect.x + rect.w);
            if(currentRectRight <= maxBottomRight.x) {
                if(currentPageMaxRectRight <= currentRectRight) {
                    currentPageMaxRectRight = currentRectRight;
                }
                return true;
            } else {
                return false;
            }
        });

        const currentPageCanBeSplitRects = rectsToSplit.filter(rect => {
            // Check cells that have 'rect.x' less than 'currentPageMaxRectRight'
            const currentRectLeft = round(rect.x);
            const currentRectRight = round(rect.x + rect.w);
            if(currentRectLeft < currentPageMaxRectRight && currentPageMaxRectRight < currentRectRight) {
                return true;
            }
        });

        currentPageCanBeSplitRects.forEach(rect => {
            // Split merged rects that can be split and put to neccessary array
            const leftRect = Object.assign({}, {
                x: rect.x,
                y: rect.y,
                w: currentPageMaxRectRight - rect.x,
                h: rect.h
            }, { sourceCellInfo: rect.sourceCellInfo });

            currentPageRects.push(leftRect);

            const rightRect = Object.assign({}, {
                x: currentPageMaxRectRight,
                y: rect.y,
                w: rect.w - (currentPageMaxRectRight - rect.x),
                h: rect.h
            }, { sourceCellInfo: Object.assign({}, rect.sourceCellInfo) });
            rightRect.sourceCellInfo.text = '';

            rectsToSplit.push(rightRect);

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

export { splitRectsByPages };
