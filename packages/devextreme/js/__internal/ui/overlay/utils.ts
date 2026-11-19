import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getInnerHeight, getOuterHeight } from '@js/core/utils/size';
import { isNumeric } from '@js/core/utils/type';
import { getWindow } from '@ts/core/utils/window';

const WINDOW_HEIGHT_PERCENT = 0.9;

export const getElementMaxHeightByWindow = (
  $element: dxElementWrapper,
  startLocation?: number,
): number | undefined => {
  const offset = $element.offset();

  // offset can be undefined if the element is not inserted into the DOM
  // or the element does not exist
  if (offset === undefined) {
    return undefined;
  }

  const $window = $(getWindow());
  const { top: elementOffset } = offset;

  let actualOffset = 0;

  const windowScrollTop = $window.scrollTop<number>();
  const windowHeight = Number(getInnerHeight($window));

  if (isNumeric(startLocation)) {
    if (startLocation < elementOffset) {
      return elementOffset - startLocation;
    }

    actualOffset = windowHeight - startLocation + windowScrollTop;
  } else {
    const offsetTop = elementOffset - windowScrollTop;
    const offsetBottom = windowHeight - offsetTop - Number(getOuterHeight($element));

    actualOffset = Math.max(offsetTop, offsetBottom);
  }

  return actualOffset * WINDOW_HEIGHT_PERCENT;
};

const isScrollableOverflow = (overflow: string): boolean => overflow !== 'visible' && overflow !== 'clip';

const getScrollDelta = (
  start: number,
  end: number,
  viewStart: number,
  viewEnd: number,
): number => {
  if (start < viewStart) {
    return start - viewStart;
  }

  if (end > viewEnd) {
    return Math.min(end - viewEnd, start - viewStart);
  }

  return 0;
};

export const scrollIntoViewWithin = (
  element: HTMLElement | undefined,
  container: HTMLElement | undefined,
): void => {
  if (!element || !container) {
    return;
  }

  const elementRect = element.getBoundingClientRect();
  let shiftTop = 0;
  let shiftLeft = 0;

  for (
    let parent = element.parentElement;
    parent && container.contains(parent);
    parent = parent.parentElement
  ) {
    const { overflowX, overflowY } = getWindow().getComputedStyle(parent);
    const parentRect = parent.getBoundingClientRect();
    const scaleX = parent.offsetWidth ? parentRect.width / parent.offsetWidth : 1;
    const scaleY = parent.offsetHeight ? parentRect.height / parent.offsetHeight : 1;
    const viewTop = parentRect.top + parent.clientTop * scaleY;
    const viewLeft = parentRect.left + parent.clientLeft * scaleX;

    const top = isScrollableOverflow(overflowY)
      ? getScrollDelta(
        elementRect.top - shiftTop,
        elementRect.bottom - shiftTop,
        viewTop,
        viewTop + parent.clientHeight * scaleY,
      )
      : 0;
    const left = isScrollableOverflow(overflowX)
      ? getScrollDelta(
        elementRect.left - shiftLeft,
        elementRect.right - shiftLeft,
        viewLeft,
        viewLeft + parent.clientWidth * scaleX,
      )
      : 0;

    if (top || left) {
      parent.scrollTo({
        top: parent.scrollTop + top / scaleY,
        left: parent.scrollLeft + left / scaleX,
      });
      shiftTop += top;
      shiftLeft += left;
    }
  }
};
