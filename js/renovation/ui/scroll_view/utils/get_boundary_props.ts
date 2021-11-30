import { getScrollLeftMax } from './get_scroll_left_max';
import { getScrollTopMax } from './get_scroll_top_max';
import {
  ScrollOffset,
  ScrollableBoundary,
  ScrollableDirection,
} from '../types.d';

import {
  ScrollDirection,
} from './scroll_direction';

export function isReachedLeft(
  scrollOffsetLeft: number,
  epsilon: number,
): boolean {
  return Math.round(scrollOffsetLeft) <= epsilon;
}

export function isReachedRight(
  element: HTMLDivElement,
  scrollOffsetLeft: number,
  epsilon: number,
): boolean {
  return Math.round(getScrollLeftMax(element) - scrollOffsetLeft) <= epsilon;
}

export function isReachedTop(
  scrollOffsetTop: number,
  epsilon: number,
): boolean {
  return Math.round(scrollOffsetTop) <= epsilon;
}

export function isReachedBottom(
  element: HTMLDivElement,
  scrollOffsetTop: number,
  pocketHeight: number,
  epsilon: number,
): boolean {
  return Math.round(getScrollTopMax(element) - scrollOffsetTop - pocketHeight) <= epsilon;
}

export function getBoundaryProps(
  direction: ScrollableDirection,
  scrollOffset: ScrollOffset,
  element: HTMLDivElement,
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  pocketHeight = 0,
): Partial<ScrollableBoundary> {
  const { left, top } = scrollOffset;
  const boundaryProps: Partial<ScrollableBoundary> = {};
  const { isHorizontal, isVertical } = new ScrollDirection(direction);

  if (isHorizontal) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    boundaryProps.reachedLeft = isReachedLeft(left, 0);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    boundaryProps.reachedRight = isReachedRight(element, left, 0);
  }
  if (isVertical) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    boundaryProps.reachedTop = isReachedTop(top, 0);
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    boundaryProps.reachedBottom = isReachedBottom(element, top, pocketHeight, 0);
  }
  return boundaryProps;
}
