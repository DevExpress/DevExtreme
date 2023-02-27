const isHeader = (rect) => rect?.sourceCellInfo.gridCell.rowType === 'header';
const spitMultiPageRows = (
    rectsToPatch,
    isCurrentPageContainsOnlyHeader,
    firstRectYAdjustment,
    splitMultiPageRowFunc,
    checkIsFitToPageFunc,
) => {
    let [newPageRects, remainPageRects] = splitMultiPageRowFunc(isCurrentPageContainsOnlyHeader, rectsToPatch);
    const newPageRectsArray = [
        isCurrentPageContainsOnlyHeader
            ? newPageRects.map((rect) => ({ ...rect, y: firstRectYAdjustment }))
            : newPageRects
    ];
    while(!checkIsFitToPageFunc(false, remainPageRects[0].h)) {
        [newPageRects, remainPageRects] = splitMultiPageRowFunc(false, remainPageRects);
        newPageRectsArray.push(newPageRects);
    }
    return [newPageRectsArray, remainPageRects];
};
const patchRects = (
    rectsToSplit,
    rectsToPatch,
    remainPageRects,
) => {
    rectsToPatch.forEach((rect, rectIndex) => {
        rect.sourceCellInfo.text = remainPageRects[rectIndex].sourceCellInfo.text;
        rect.h = remainPageRects[rectIndex].h;
    });
    const untouchedRowIdx = rectsToSplit.indexOf(rectsToPatch[rectsToPatch.length - 1]) + 1;
    if(untouchedRowIdx >= rectsToSplit.length) {
        return;
    }
    const delta = rectsToSplit[untouchedRowIdx].y - (rectsToPatch[0].y + remainPageRects[0].h);
    for(let idx = untouchedRowIdx; idx < rectsToSplit.length; idx++) {
        rectsToSplit[idx].y = rectsToSplit[idx].y - delta;
    }
};
export const checkPageContainsOnlyHeader = (
    pageRects,
    isFirstPage,
) => isFirstPage && isHeader(pageRects[pageRects.length - 1]);
export const getMultiPageRowPages = (
    currentPageRects,
    rectsToSplit,
    isCurrentPageContainsOnlyHeader,
    splitMultiPageRowFunc,
    checkIsFitToPageFunc,
) => {
    if(!splitMultiPageRowFunc) {
        return [];
    }
    const currentPageLastRect = currentPageRects[currentPageRects.length - 1];
    const nextPageFirstRect = rectsToSplit[currentPageRects.length];
    if(!nextPageFirstRect || isHeader(nextPageFirstRect)) {
        return [];
    }
    const isRectsFitsToPage = checkIsFitToPageFunc(isCurrentPageContainsOnlyHeader, nextPageFirstRect.h);
    if(isRectsFitsToPage && !isCurrentPageContainsOnlyHeader) {
        return [];
    }
    const rectsToPatch = rectsToSplit.filter(({ y }) => y === nextPageFirstRect.y);
    const firstRectYAdjustment = currentPageLastRect.y + currentPageLastRect.h;
    const [multiPageRowPages, remainPageRects] = spitMultiPageRows(
        rectsToPatch,
        isCurrentPageContainsOnlyHeader,
        firstRectYAdjustment,
        splitMultiPageRowFunc,
        checkIsFitToPageFunc
    );
    patchRects(rectsToSplit, rectsToPatch, remainPageRects);
    return multiPageRowPages;
};
