"use strict";

exports.getMultiPageRowPages = exports.checkPageContainsOnlyHeader = void 0;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const isHeader = rect => (rect === null || rect === void 0 ? void 0 : rect.sourceCellInfo.gridCell.rowType) === 'header';
const spitMultiPageRows = (rectsToPatch, isCurrentPageContainsOnlyHeader, firstRectYAdjustment, splitMultiPageRowFunc, checkIsFitToPageFunc) => {
  let [newPageRects, remainPageRects] = splitMultiPageRowFunc(isCurrentPageContainsOnlyHeader, rectsToPatch);
  const newPageRectsArray = [isCurrentPageContainsOnlyHeader ? newPageRects.map(rect => _extends({}, rect, {
    y: firstRectYAdjustment
  })) : newPageRects];
  while (!checkIsFitToPageFunc(false, remainPageRects[0].h)) {
    [newPageRects, remainPageRects] = splitMultiPageRowFunc(false, remainPageRects);
    newPageRectsArray.push(newPageRects);
  }
  return [newPageRectsArray, remainPageRects];
};
const patchRects = (rectsToSplit, rectsToPatch, remainPageRects) => {
  rectsToPatch.forEach((rect, rectIndex) => {
    rect.sourceCellInfo.text = remainPageRects[rectIndex].sourceCellInfo.text;
    rect.h = remainPageRects[rectIndex].h;
  });
  const untouchedRowIdx = rectsToSplit.indexOf(rectsToPatch[rectsToPatch.length - 1]) + 1;
  if (untouchedRowIdx >= rectsToSplit.length) {
    return;
  }
  const delta = rectsToSplit[untouchedRowIdx].y - (rectsToPatch[0].y + remainPageRects[0].h);
  for (let idx = untouchedRowIdx; idx < rectsToSplit.length; idx++) {
    rectsToSplit[idx].y = rectsToSplit[idx].y - delta;
  }
};
const checkPageContainsOnlyHeader = (pageRects, isFirstPage) => isFirstPage && isHeader(pageRects[pageRects.length - 1]);
exports.checkPageContainsOnlyHeader = checkPageContainsOnlyHeader;
const getMultiPageRowPages = (currentPageRects, rectsToSplit, isCurrentPageContainsOnlyHeader, splitMultiPageRowFunc, checkIsFitToPageFunc) => {
  if (!splitMultiPageRowFunc) {
    return [];
  }
  const currentPageLastRect = currentPageRects[currentPageRects.length - 1];
  const nextPageFirstRect = rectsToSplit[currentPageRects.length];
  if (!nextPageFirstRect || isHeader(nextPageFirstRect)) {
    return [];
  }
  const isRectsFitsToPage = checkIsFitToPageFunc(isCurrentPageContainsOnlyHeader, nextPageFirstRect.h);
  if (isRectsFitsToPage && !isCurrentPageContainsOnlyHeader) {
    return [];
  }
  const rectsToPatch = rectsToSplit.filter(_ref => {
    let {
      y
    } = _ref;
    return y === nextPageFirstRect.y;
  });
  const firstRectYAdjustment = currentPageLastRect.y + currentPageLastRect.h;
  const [multiPageRowPages, remainPageRects] = spitMultiPageRows(rectsToPatch, isCurrentPageContainsOnlyHeader, firstRectYAdjustment, splitMultiPageRowFunc, checkIsFitToPageFunc);
  patchRects(rectsToSplit, rectsToPatch, remainPageRects);
  return multiPageRowPages;
};
exports.getMultiPageRowPages = getMultiPageRowPages;