import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getInnerHeight, getOuterHeight } from '@js/core/utils/size';
import { isNumeric } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@ts/core/utils/window';

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

const OUT_OF_FLOW_POSITIONS = ['absolute', 'fixed'];

const getContainingElement = (element: HTMLElement): HTMLElement | null => (
  OUT_OF_FLOW_POSITIONS.includes(getWindow().getComputedStyle(element).position)
    ? element.offsetParent
    : element.parentElement
) as HTMLElement | null;

export const scrollIntoViewWithin = (
  element: HTMLElement | undefined,
  container: HTMLElement | undefined,
): void => {
  if (!element || !container || !hasWindow()) {
    return;
  }

  let pendingTop = 0;
  let pendingLeft = 0;

  for (
    let parent = getContainingElement(element);
    parent && container.contains(parent);
    parent = getContainingElement(parent)
  ) {
    const { overflowX, overflowY } = getWindow().getComputedStyle(parent);
    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const scaleX = parent.offsetWidth ? parentRect.width / parent.offsetWidth : 1;
    const scaleY = parent.offsetHeight ? parentRect.height / parent.offsetHeight : 1;
    const viewTop = parentRect.top + parent.clientTop * scaleY;
    const viewLeft = parentRect.left + parent.clientLeft * scaleX;

    const top = isScrollableOverflow(overflowY) && parent.scrollHeight > parent.clientHeight
      ? getScrollDelta(
        elementRect.top - pendingTop,
        elementRect.bottom - pendingTop,
        viewTop,
        viewTop + parent.clientHeight * scaleY,
      ) / scaleY
      : 0;
    const left = isScrollableOverflow(overflowX) && parent.scrollWidth > parent.clientWidth
      ? getScrollDelta(
        elementRect.left - pendingLeft,
        elementRect.right - pendingLeft,
        viewLeft,
        viewLeft + parent.clientWidth * scaleX,
      ) / scaleX
      : 0;

    if (top || left) {
      const targetTop = parent.scrollTop + top;
      const targetLeft = parent.scrollLeft + left;

      parent.scrollTo({ top: targetTop, left: targetLeft });

      pendingTop += (targetTop - parent.scrollTop) * scaleY;
      pendingLeft += (targetLeft - parent.scrollLeft) * scaleX;
    }
  }
};
