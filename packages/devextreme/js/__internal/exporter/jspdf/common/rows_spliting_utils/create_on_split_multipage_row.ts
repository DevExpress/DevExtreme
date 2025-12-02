/* eslint-disable no-return-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { calculateTextHeight, getTextDimensions, getTextLines } from '../pdf_utils';

function createMultiCellRect(rect, text, marginTop) {
  return {
    ...rect,
    sourceCellInfo: {
      ...rect.sourceCellInfo,
      text,
    },
    y: marginTop,
  };
}

export const createOnSplitMultiPageRow = (
  doc,
  options,
  headerHeight,
  maxBottomRight,
) => (isFirstPage, pageRects) => {
  const currentPageRects = [];
  const nextPageRects = [];
  let maxCurrentPageHeight = 0;
  let maxNextPageHeight = 0;

  pageRects.forEach((rect) => {
    const { w, sourceCellInfo } = rect;
    const additionalHeight = !isFirstPage && options.repeatHeaders
      ? headerHeight
      : headerHeight + options.topLeft.y;
    const heightOfOneLine = getTextDimensions(doc, sourceCellInfo.text, sourceCellInfo.font).h;
    const paddingHeight = sourceCellInfo.padding.top + sourceCellInfo.padding.bottom;
    const fullPageHeight = maxBottomRight.y - additionalHeight - paddingHeight - options.margin.top;
    const possibleLinesCount = Math.floor(fullPageHeight / (heightOfOneLine * doc.getLineHeightFactor()));
    const allLines = getTextLines(
      doc,
      sourceCellInfo.text,
      sourceCellInfo.font,
      {
        wordWrapEnabled: sourceCellInfo.wordWrapEnabled,
        targetRectWidth: w,
      },
    );

    if (possibleLinesCount < allLines.length) {
      const currentPageText = allLines.slice(0, possibleLinesCount).join('\n');
      const currentPageHeight = calculateTextHeight(doc, currentPageText, sourceCellInfo.font, {
        wordWrapEnabled: sourceCellInfo.wordWrapEnabled,
        targetRectWidth: w,
      });
      maxCurrentPageHeight = Math.max(maxCurrentPageHeight, currentPageHeight + paddingHeight);
      maxNextPageHeight = rect.h - currentPageHeight;
      // @ts-expect-error
      currentPageRects.push(createMultiCellRect(rect, currentPageText, options.margin.top));
      // @ts-expect-error
      nextPageRects.push(createMultiCellRect(rect, allLines.slice(possibleLinesCount).join('\n'), options.margin.top));
    } else {
      const currentPageHeight = calculateTextHeight(doc, sourceCellInfo.text, sourceCellInfo.font, {
        wordWrapEnabled: sourceCellInfo.wordWrapEnabled,
        targetRectWidth: w,
      });
      maxCurrentPageHeight = Math.max(maxCurrentPageHeight, currentPageHeight + paddingHeight);
      maxNextPageHeight = Math.max(maxNextPageHeight, currentPageHeight + paddingHeight);
      // @ts-expect-error
      currentPageRects.push(createMultiCellRect(rect, sourceCellInfo.text, options.margin.top));
      // @ts-expect-error
      nextPageRects.push(createMultiCellRect(rect, '', options.margin.top));
    }
  });

  // @ts-expect-error
  currentPageRects.forEach((rect) => rect.h = maxCurrentPageHeight);
  // @ts-expect-error
  nextPageRects.forEach((rect) => rect.h = maxNextPageHeight);

  return [currentPageRects, nextPageRects];
};
