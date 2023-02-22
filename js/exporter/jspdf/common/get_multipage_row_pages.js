export function getMultiPageRowPages(currentPageRects, rectsToSplit, isFirstPage, onSplitMultiPageRow, isFitToPage) {
    const multiPageRowPages = [];
    const lastCurrentPageRect = currentPageRects[currentPageRects.length - 1];
    const currentPageRectsContainsOnlyHeader = isFirstPage && lastCurrentPageRect && lastCurrentPageRect.sourceCellInfo.gridCell.rowType === 'header';
    if(onSplitMultiPageRow) {
        const possibleMultiPageRectIsHeader = rectsToSplit[currentPageRects.length] && rectsToSplit[currentPageRects.length].sourceCellInfo.gridCell.rowType === 'header';
        const possibleMultiPageRect = possibleMultiPageRectIsHeader ? null : rectsToSplit[currentPageRects.length];
        let isCurrentPageFirst = currentPageRectsContainsOnlyHeader;
        if(possibleMultiPageRect && (currentPageRectsContainsOnlyHeader || !isFitToPage(isCurrentPageFirst, possibleMultiPageRect.h))) {
            const rectsToPatch = rectsToSplit.filter(({ y }) => (y === possibleMultiPageRect.y));
            const firstPageHeaderHeightAdjustment = lastCurrentPageRect.y + lastCurrentPageRect.h;
            let nextPageRects = rectsToPatch;
            let nextPageRectHeight = possibleMultiPageRect.h;
            do {
                const [newPageRects, pageRects] = onSplitMultiPageRow(isCurrentPageFirst, nextPageRects);
                if(currentPageRectsContainsOnlyHeader && isCurrentPageFirst) {
                    newPageRects.forEach((rect) => {
                        rect.y = firstPageHeaderHeightAdjustment;
                    });
                }
                multiPageRowPages.push(newPageRects);
                nextPageRectHeight = pageRects[0].h;
                nextPageRects = pageRects;
                isCurrentPageFirst = multiPageRowPages.length === 0;
            } while(!isFitToPage(isCurrentPageFirst, nextPageRectHeight));
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
    return { multiPageRowPages, currentPageRectsContainsOnlyHeader };
}
