import { isDefined } from '../../../core/utils/type';
import { roundToThreeDecimals } from './draw_utils';
import { getPageWidth, getPageHeight } from './pdf_utils_v3';

function convertToCellsArray(rows) {
    return [].concat.apply([],
        rows.map(rowInfo => {
            return rowInfo.cells
                .filter(cell => !isDefined(cell.pdfCell.isMerged))
                .map(cellInfo => {
                    return Object.assign({}, cellInfo.pdfCell._rect, { sourceCellInfo: { ...cellInfo.pdfCell, gridCell: cellInfo.gridCell } });
                });
        })
    );
}

function splitByPages(doc, rowsInfo, options, onSeparateRectHorizontally, onSeparateRectVertically) {
    if(rowsInfo.length === 0) { // Empty Table
        return [[]];
    }

    const headerRows = rowsInfo.filter(r => r.rowType === 'header');
    const contentRows = rowsInfo.filter(r => r.rowType !== 'header');
    const contentRects = convertToCellsArray(contentRows);

    const headerInfo = {
        displayHeaderOnEachPage: options.displayHeaderOnEachPage,
        rects: convertToCellsArray(headerRows),
        height: headerRows.reduce((accumulator, row) => { return accumulator + row.height; }, 0),
    };

    const maxBottomRight = {
        x: getPageWidth(doc) - options.margin.right,
        y: getPageHeight(doc) - options.margin.bottom
    };
    const rectsByPage = splitRectsVerticallyByPages(contentRects, options.margin, options.topLeft, maxBottomRight, onSeparateRectVertically, headerInfo);

    let pageIndex = 0;
    while(pageIndex < rectsByPage.length) {
        const splitPages = splitRectsHorizontalByPages(rectsByPage[pageIndex], options.margin, options.topLeft, maxBottomRight, onSeparateRectHorizontally);
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

function splitRectsHorizontalByPages(rects, margin, topLeft, maxBottomRight, onSeparateRectHorizontally) {
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
            const args = {
                sourceRect: rect,
                leftRect: {
                    x: rect.x,
                    y: rect.y,
                    w: currentPageMaxRectRight - rect.x,
                    h: rect.h
                },
                rightRect: {
                    x: currentPageMaxRectRight,
                    y: rect.y,
                    w: rect.w - (currentPageMaxRectRight - rect.x),
                    h: rect.h
                }
            };
            onSeparateRectHorizontally(args);

            currentPageRects.push(args.leftRect);
            rectsToSplit.push(args.rightRect);

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
            rect.x = isDefined(currentPageMaxRectRight) ? (rect.x - currentPageMaxRectRight + margin.left + topLeft.x) : rect.x;
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

function splitRectsVerticallyByPages(rects, margin, topLeft, maxBottomRight, onSeparateRectVertically, headersInfo) {
    const pages = [];

    const cloneHeadersRects = () => {
        return headersInfo.rects.map(rect => Object.assign({}, rect));
    };

    const rectsToSplit = [...cloneHeadersRects(), ...rects];
    while(rectsToSplit.length > 0) {
        let currentPageMaxRectBottom = 0;
        const headerHeight = (pages.length > 0 && headersInfo.displayHeaderOnEachPage === true) ? headersInfo.height : 0;
        const currentPageRects = rectsToSplit.filter(rect => {
            const currentRectBottom = roundToThreeDecimals(rect.y + rect.h);
            if(currentRectBottom + headerHeight <= maxBottomRight.y) {
                if(currentPageMaxRectBottom <= currentRectBottom) {
                    currentPageMaxRectBottom = currentRectBottom;
                }
                return true;
            } else {
                return false;
            }
        });

        const rectsToSeparate = rectsToSplit.filter(rect => {
            // Check cells that have 'rect.y' less than 'currentPageMaxRectBottom'
            const currentRectTop = roundToThreeDecimals(rect.y);
            const currentRectBottom = roundToThreeDecimals(rect.y + rect.h);
            if(currentRectTop < currentPageMaxRectBottom && currentPageMaxRectBottom < currentRectBottom) {
                return true;
            }
        });

        rectsToSeparate.forEach(rect => {
            const args = {
                sourceRect: rect,
                topRect: {
                    x: rect.x,
                    y: rect.y,
                    w: rect.w,
                    h: currentPageMaxRectBottom - rect.y
                },
                bottomRect: {
                    x: rect.x,
                    y: currentPageMaxRectBottom,
                    w: rect.w,
                    h: rect.h - (currentPageMaxRectBottom - rect.y)
                }
            };
            onSeparateRectVertically(args);

            currentPageRects.push(args.topRect);
            rectsToSplit.push(args.bottomRect);

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
            rect.y = isDefined(currentPageMaxRectBottom)
                ? (rect.y - currentPageMaxRectBottom + margin.top)
                : rect.y;
        });

        if(currentPageRects.length > 0) {
            pages.push(currentPageRects);
        } else {
            pages.push(rectsToSplit);
            break;
        }
    }

    if(headersInfo.displayHeaderOnEachPage) {
        for(let i = 1; i < pages.length; i++) {
            pages[i].forEach(rect => rect.y += headersInfo.height);
            pages[i] = [...cloneHeadersRects(), ...pages[i]];
        }
    }

    return pages;
}

export { splitByPages };
