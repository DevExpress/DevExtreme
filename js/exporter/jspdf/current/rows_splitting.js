import { isDefined } from '../../../core/utils/type';
import { roundToThreeDecimals } from './draw_utils';
import { getPageWidth, getPageHeight } from './pdf_utils';

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

    const maxBottomRight = {
        x: getPageWidth(doc) - options.margin.right,
        y: getPageHeight(doc) - options.margin.bottom
    };

    const headerRows = rowsInfo.filter(r => r.rowType === 'header');
    const headerHeight = headerRows.reduce((accumulator, row) => { return accumulator + row.height; }, 0);

    const verticallyPages = splitRectsByPages(convertToCellsArray(rowsInfo), options.margin.top, 'y', 'h',
        (pagesLength, currentCoordinate) => {
            const additionalHeight = (pagesLength > 0 && options.repeatHeaders)
                ? headerHeight
                : 0;
            return currentCoordinate + additionalHeight <= maxBottomRight.y;
        },
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

    if(options.repeatHeaders) {
        for(let i = 1; i < verticallyPages.length; i++) {
            verticallyPages[i].forEach(rect => rect.y += headerHeight);
            // create deep copy of headers for each page
            const headerCells = convertToCellsArray(headerRows);
            headerCells.forEach(cell => {
                cell.y -= options.topLeft.y;
                // cell.x -= options.topLeft.x; don't forget to uncomment this line after fixing topleft.x issue
            });
            verticallyPages[i] = [...headerCells, ...verticallyPages[i]];
        }
    }

    let pageIndex = 0;
    while(pageIndex < verticallyPages.length) {
        const horizontallyPages = splitRectsByPages(verticallyPages[pageIndex], options.margin.left, 'x', 'w',
            (pagesLength, currentCoordinate) => currentCoordinate <= maxBottomRight.x,
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

        if(horizontallyPages.length > 1) {
            verticallyPages.splice(pageIndex, 1, ...horizontallyPages);
            pageIndex += horizontallyPages.length;
        } else {
            pageIndex += 1;
        }
    }

    return verticallyPages.map(rects => {
        return rects.map(rect => Object.assign({}, rect.sourceCellInfo, { _rect: rect }));
    });
}


function splitRectsByPages(rects, marginValue, coordinate, dimension, checkPredicate, onSeparateCallback) {
    const pages = [];
    const rectsToSplit = [...rects];

    while(rectsToSplit.length > 0) {
        let currentPageMaxRectCoordinate = 0;
        const currentPageRects = rectsToSplit.filter(rect => {
            const currentRectCoordinate = roundToThreeDecimals(rect[coordinate] + rect[dimension]);
            if(checkPredicate(pages.length, currentRectCoordinate)) {
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
                ? (rect[coordinate] - currentPageMaxRectCoordinate + marginValue)
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
