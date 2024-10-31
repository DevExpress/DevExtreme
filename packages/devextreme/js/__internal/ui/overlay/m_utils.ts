import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getInnerHeight, getOuterHeight } from '@js/core/utils/size';
import { isNumeric } from '@js/core/utils/type';

import windowUtils from '../../core/utils/m_window';

const WINDOW_HEIGHT_PERCENT = 0.9;

export const getElementMaxHeightByWindow = ($element: dxElementWrapper, startLocation?: number) => {
  const $window = $(windowUtils.getWindow());
  // @ts-expect-error
  const { top: elementOffset } = $element.offset();
  let actualOffset;

  if (isNumeric(startLocation)) {
    if (startLocation < elementOffset) {
      return elementOffset - startLocation;
    }
    // @ts-expect-error
    actualOffset = getInnerHeight($window) - startLocation + $window.scrollTop();
  } else {
    // @ts-expect-error
    const offsetTop = elementOffset - $window.scrollTop();
    const offsetBottom = getInnerHeight($window) - offsetTop - getOuterHeight($element);
    actualOffset = Math.max(offsetTop, offsetBottom);
  }

  return actualOffset * WINDOW_HEIGHT_PERCENT;
};
