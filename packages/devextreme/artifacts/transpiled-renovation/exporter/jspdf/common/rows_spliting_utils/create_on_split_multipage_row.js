"use strict";

exports.createOnSplitMultiPageRow = void 0;
var _pdf_utils = require("../pdf_utils");
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function createMultiCellRect(rect, text, marginTop) {
  return _extends({}, rect, {
    sourceCellInfo: _extends({}, rect.sourceCellInfo, {
      text
    }),
    y: marginTop
  });
}
const createOnSplitMultiPageRow = (doc, options, headerHeight, maxBottomRight) => (isFirstPage, pageRects) => {
  const currentPageRects = [];
  const nextPageRects = [];
  let maxCurrentPageHeight = 0;
  let maxNextPageHeight = 0;
  pageRects.forEach(rect => {
    const {
      w,
      sourceCellInfo
    } = rect;
    const additionalHeight = !isFirstPage && options.repeatHeaders ? headerHeight : headerHeight + options.topLeft.y;
    const heightOfOneLine = (0, _pdf_utils.getTextDimensions)(doc, sourceCellInfo.text, sourceCellInfo.font).h;
    const paddingHeight = sourceCellInfo.padding.top + sourceCellInfo.padding.bottom;
    const fullPageHeight = maxBottomRight.y - additionalHeight - paddingHeight - options.margin.top;
    const possibleLinesCount = Math.floor(fullPageHeight / (heightOfOneLine * doc.getLineHeightFactor()));
    const allLines = (0, _pdf_utils.getTextLines)(doc, sourceCellInfo.text, sourceCellInfo.font, {
      wordWrapEnabled: sourceCellInfo.wordWrapEnabled,
      targetRectWidth: w
    });
    if (possibleLinesCount < allLines.length) {
      const currentPageText = allLines.slice(0, possibleLinesCount).join('\n');
      const currentPageHeight = (0, _pdf_utils.calculateTextHeight)(doc, currentPageText, sourceCellInfo.font, {
        wordWrapEnabled: sourceCellInfo.wordWrapEnabled,
        targetRectWidth: w
      });
      maxCurrentPageHeight = Math.max(maxCurrentPageHeight, currentPageHeight + paddingHeight);
      maxNextPageHeight = rect.h - currentPageHeight;
      currentPageRects.push(createMultiCellRect(rect, currentPageText, options.margin.top));
      nextPageRects.push(createMultiCellRect(rect, allLines.slice(possibleLinesCount).join('\n'), options.margin.top));
    } else {
      const currentPageHeight = (0, _pdf_utils.calculateTextHeight)(doc, sourceCellInfo.text, sourceCellInfo.font, {
        wordWrapEnabled: sourceCellInfo.wordWrapEnabled,
        targetRectWidth: w
      });
      maxCurrentPageHeight = Math.max(maxCurrentPageHeight, currentPageHeight + paddingHeight);
      maxNextPageHeight = Math.max(maxNextPageHeight, currentPageHeight + paddingHeight);
      currentPageRects.push(createMultiCellRect(rect, sourceCellInfo.text, options.margin.top));
      nextPageRects.push(createMultiCellRect(rect, '', options.margin.top));
    }
  });
  currentPageRects.forEach(rect => rect.h = maxCurrentPageHeight);
  nextPageRects.forEach(rect => rect.h = maxNextPageHeight);
  return [currentPageRects, nextPageRects];
};
exports.createOnSplitMultiPageRow = createOnSplitMultiPageRow;