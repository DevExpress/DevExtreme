import { isDefined } from '../../../core/utils/type';
import { getPageWidth, getPageHeight, getTextLines, getTextDimensions, calculateTextHeight } from './pdf_utils';
import { roundToThreeDecimals } from './draw_utils';

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
    function createMultiCellRect(rect, text) {
        return {
            ...rect,
            sourceCellInfo: {
                ...rect.sourceCellInfo,
                text
            },
            y: options.margin.top,
        };
    }

    const verticallyPages = splitRectsByPages(convertToCellsArray(rowsInfo), options.margin.top, 'y', 'h',
        (pagesLength, currentCoordinate) => {
            const additionalHeight = (pagesLength > 0 && options.repeatHeaders)
                ? headerHeight
                : 0;
            return roundToThreeDecimals(currentCoordinate + additionalHeight) <= roundToThreeDecimals(maxBottomRight.y);
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
        },
        (isFirstPage, pageRects) => {
            const currentPageRects = [];
            const nextPageRects = [];
            let maxCurrentPageHeight = 0;
            let maxNextPageHeight = 0;
            pageRects.forEach((rect) => {
                const { w, sourceCellInfo } = rect;
                const additionalHeight = (!isFirstPage && options.repeatHeaders)
                    ? headerHeight
                    : headerHeight + options.topLeft.y;
                const heightOfOneLine = getTextDimensions(doc, sourceCellInfo.text, sourceCellInfo.font).h;
                const paddingHeight = sourceCellInfo.padding.top + sourceCellInfo.padding.bottom;
                const fullPageHeight = (maxBottomRight.y - additionalHeight - paddingHeight - options.margin.top);
                const possibleLinesCount = Math.floor(fullPageHeight / (heightOfOneLine * doc.getLineHeightFactor()));
                const allLines = getTextLines(doc, sourceCellInfo.text,
                    sourceCellInfo.font, {
                        wordWrapEnabled: sourceCellInfo.wordWrapEnabled,
                        targetRectWidth: w
                    });
                if(possibleLinesCount < allLines.length) {
                    const currentPageText = allLines.slice(0, possibleLinesCount).join('\n');
                    const currentPageHeight = calculateTextHeight(doc, currentPageText, sourceCellInfo.font, {
                        wordWrapEnabled: sourceCellInfo.wordWrapEnabled,
                        targetRectWidth: w
                    });
                    maxCurrentPageHeight = Math.max(maxCurrentPageHeight, currentPageHeight + paddingHeight);
                    maxNextPageHeight = rect.h - currentPageHeight;
                    currentPageRects.push(createMultiCellRect(rect, currentPageText));
                    nextPageRects.push(createMultiCellRect(rect, allLines.slice(possibleLinesCount).join('\n')));
                } else {
                    const currentPageHeight = calculateTextHeight(doc, sourceCellInfo.text, sourceCellInfo.font, {
                        wordWrapEnabled: sourceCellInfo.wordWrapEnabled,
                        targetRectWidth: w
                    });
                    maxCurrentPageHeight = Math.max(maxCurrentPageHeight, currentPageHeight + paddingHeight);
                    maxNextPageHeight = Math.max(maxNextPageHeight, currentPageHeight + paddingHeight);
                    currentPageRects.push(createMultiCellRect(rect, sourceCellInfo.text));
                    nextPageRects.push(createMultiCellRect(rect, ''));
                }
            });
            currentPageRects.forEach((rect) => rect.h = maxCurrentPageHeight);
            nextPageRects.forEach((rect) => rect.h = maxNextPageHeight);
            return [currentPageRects, nextPageRects];
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
            (pagesLength, currentCoordinate) => roundToThreeDecimals(currentCoordinate) <= roundToThreeDecimals(maxBottomRight.x),
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

function splitRectsByPages(rects, marginValue, coordinate, dimension, isFitToPage, onSeparateCallback, onSplitMultiPageRow) {
    const pages = [];
    const rectsToSplit = [...rects];

    while(rectsToSplit.length > 0) {
        let currentPageMaxRectCoordinate = 0;
        const multiPageRowPages = [];
        const currentPageRects = rectsToSplit.filter(rect => {
            const currentRectCoordinate = rect[coordinate] + rect[dimension];
            if(isFitToPage(pages.length, currentRectCoordinate)) {
                if(currentPageMaxRectCoordinate <= currentRectCoordinate) {
                    currentPageMaxRectCoordinate = currentRectCoordinate;
                }
                return true;
            } else {
                return false;
            }
        });
        const lastCurrentPageRect = currentPageRects[currentPageRects.length - 1];
        const currentPageRectsContainsOnlyHeader = pages.length === 0 && lastCurrentPageRect && lastCurrentPageRect.sourceCellInfo.gridCell.rowType === 'header';
        if(onSplitMultiPageRow) {
            const possibleMultiPageRectIsHeader = rectsToSplit[currentPageRects.length] && rectsToSplit[currentPageRects.length].sourceCellInfo.gridCell.rowType === 'header';
            const possibleMultiPageRect = possibleMultiPageRectIsHeader ? null : rectsToSplit[currentPageRects.length];
            let isFirstPage = currentPageRectsContainsOnlyHeader;
            if(possibleMultiPageRect && (currentPageRectsContainsOnlyHeader || !isFitToPage(isFirstPage ? 0 : 1, possibleMultiPageRect.h + marginValue))) {
                const rectsToPatch = rectsToSplit.filter(({ y }) => (y === possibleMultiPageRect.y));
                const firstPageHeaderHeightAdjustment = lastCurrentPageRect.y + lastCurrentPageRect.h;
                let nextPageRects = rectsToPatch;
                let nextPageRectHeight = possibleMultiPageRect.h;
                do {
                    const [ newPageRects, pageRects ] = onSplitMultiPageRow(isFirstPage, nextPageRects);
                    if(currentPageRectsContainsOnlyHeader && isFirstPage) {
                        newPageRects.forEach((rect) => {
                            rect.y = firstPageHeaderHeightAdjustment;
                        });
                    }
                    multiPageRowPages.push(newPageRects);
                    nextPageRectHeight = pageRects[0].h;
                    nextPageRects = pageRects;
                    isFirstPage = multiPageRowPages.length === 0;
                } while(!isFitToPage(isFirstPage ? 0 : 1, nextPageRectHeight + marginValue));
                rectsToPatch.forEach((rect, rectIndex) => {
                    rect.sourceCellInfo.text = nextPageRects[rectIndex].sourceCellInfo.text;
                    rect.h = nextPageRects[rectIndex].h;
                });
                const nextRectAfterPatchedRowIndex = rectsToSplit.indexOf(rectsToPatch[rectsToPatch.length - 1]) + 1;
                if(nextRectAfterPatchedRowIndex < rectsToSplit.length) {
                    const delta = rectsToSplit[nextRectAfterPatchedRowIndex].y - (rectsToPatch[0].y + rectsToPatch[0].h);
                    for(let i = nextRectAfterPatchedRowIndex; i < rectsToSplit.length; i++) {
                        rectsToSplit[i].y = rectsToSplit[i].y - delta;
                    }
                }
            }
        }
        const rectsToSeparate = rectsToSplit.filter(rect => {
            // Check cells that have 'coordinate' less than 'currentPageMaxRectCoordinate'
            const currentRectLeft = rect[coordinate];
            const currentRectRight = rect[coordinate] + rect[dimension];
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
        const firstPageContainsHeaderAndMultiPageRow = currentPageRectsContainsOnlyHeader && multiPageRowPages.length > 0;
        if(firstPageContainsHeaderAndMultiPageRow) {
            const [firstPage, ...restOfPages] = multiPageRowPages;
            pages.push([...currentPageRects, ...firstPage]);
            if(restOfPages.length > 0) {
                pages.push(...restOfPages);
            }
        } else {
            if(currentPageRects.length > 0) {
                pages.push(currentPageRects);
                if(multiPageRowPages.length > 0) {
                    pages.push(...multiPageRowPages);
                }
            } else {
                if(multiPageRowPages.length > 0) {
                    pages.push(...multiPageRowPages);
                } else {
                    pages.push(rectsToSplit);
                    break;
                }
            }
        }
    }

    return pages;
}

export { splitByPages };
