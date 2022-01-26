import { isDefined } from '../../../core/utils/type';
import { roundToThreeDecimals } from './draw_utils';
import { getPageWidth, getPageHeight } from './pdf_utils_v3';

function splitByPages(doc, rowsInfo, options, onSeparateRectHorizontally, onSeparateRectVertically) {
    const rects = [].concat.apply([],
        rowsInfo.map(rowInfo => {
            return rowInfo.cells
                .filter(cell => !isDefined(cell.pdfCell.isMerged))
                .map(cellInfo => {
                    return Object.assign({}, cellInfo.pdfCell._rect, { sourceCellInfo: { ...cellInfo.pdfCell, gridCell: cellInfo.gridCell } });
                });
        })
    );

    if(!isDefined(rects) || rects.length === 0) { // Empty Table
        return [[]];
    }

    const maxBottomRight = {
        x: getPageWidth(doc) - options.margin.right,
        y: getPageHeight(doc) - options.margin.bottom
    };

    const rectsByPage = splitRects(rects, options.margin.left, options.topLeft.x, maxBottomRight, 'x', 'w',
        (rect, currentPageMaxRectCoordinate, currentPageRects, rectsToSplit) => {
            const args = {
                sourceRect: rect,
                leftRect: {
                    x: rect.x,
                    y: rect.y,
                    w: currentPageMaxRectCoordinate - rect.x,
                    h: rect.h
                },
                rightRect: {
                    x: currentPageMaxRectCoordinate,
                    y: rect.y,
                    w: rect.w - (currentPageMaxRectCoordinate - rect.x),
                    h: rect.h
                }
            };
            onSeparateRectHorizontally(args);

            currentPageRects.push(args.leftRect);
            rectsToSplit.push(args.rightRect);
        });

    let pageIndex = 0;
    while(pageIndex < rectsByPage.length) {

        const splitPages = splitRects(rectsByPage[pageIndex], options.margin.top, /* options.topLeft.y */ 0, maxBottomRight, 'y', 'h',
            (rect, currentPageMaxRectCoordinate, currentPageRects, rectsToSplit) => {
                const args = {
                    sourceRect: rect,
                    topRect: {
                        x: rect.x,
                        y: rect.y,
                        w: rect.w,
                        h: currentPageMaxRectCoordinate - rect.y
                    },
                    bottomRect: {
                        x: rect.x,
                        y: currentPageMaxRectCoordinate,
                        w: rect.w,
                        h: rect.h - (currentPageMaxRectCoordinate - rect.y)
                    }
                };
                onSeparateRectVertically(args);

                currentPageRects.push(args.topRect);
                rectsToSplit.push(args.bottomRect);
            });

        if(splitPages.length > 1) {
            rectsByPage.splice(pageIndex, 1, ...splitPages);
            pageIndex += splitPages.length;
        } else {
            pageIndex += 1;
        }
    }

    return rectsByPage.map(rects => {
        return rects.map(rect => Object.assign({}, rect.sourceCellInfo, { _rect: rect }));
    });
}


function splitRects(rects, marginValue, topLeftValue, maxBottomRight, coordinate, dimension, onSeparateCallback) {
    const pages = [];
    const rectsToSplit = [...rects];

    while(rectsToSplit.length > 0) {
        let currentPageMaxRectCoordinate = 0;
        const currentPageRects = rectsToSplit.filter(rect => {
            const currentRectCoordinate = roundToThreeDecimals(rect[coordinate] + rect[dimension]);
            if(currentRectCoordinate <= maxBottomRight[coordinate]) {
                if(currentPageMaxRectCoordinate <= currentRectCoordinate) {
                    currentPageMaxRectCoordinate = currentRectCoordinate;
                }
                return true;
            } else {
                return false;
            }
        });

        const rectsToSeparate = rectsToSplit.filter(rect => {
            // Check cells that have 'coordinate' less than 'currentPageMaxRectCoordinate'
            const currentRectLeft = roundToThreeDecimals(rect[coordinate]);
            const currentRectRight = roundToThreeDecimals(rect[coordinate] + rect[dimension]);
            if(currentRectLeft < currentPageMaxRectCoordinate && currentPageMaxRectCoordinate < currentRectRight) {
                return true;
            }
        });

        rectsToSeparate.forEach(rect => {
            onSeparateCallback(rect, currentPageMaxRectCoordinate, currentPageRects, rectsToSplit);
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
            rect[coordinate] = isDefined(currentPageMaxRectCoordinate)
                ? (rect[coordinate] - currentPageMaxRectCoordinate + marginValue + topLeftValue)
                : rect[coordinate];
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

export { splitByPages };
