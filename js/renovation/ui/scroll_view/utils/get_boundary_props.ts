import { getScrollLeftMax } from './get_scroll_left_max';
import { getScrollTopMax } from './get_scroll_top_max';
import {
  ScrollOffset,
  ScrollableBoundary,
  ScrollableDirection,
} from '../common/types';

import {
  ScrollDirection,
} from './scroll_direction';

export function isReachedRight(
  element: HTMLDivElement,
  scrollOffsetLeft: number,
): boolean {
  return Math.round(getScrollLeftMax(element) - scrollOffsetLeft) <= 0;
}

export function isReachedBottom(
  element: HTMLDivElement,
  scrollOffsetTop: number,
  pocketHeight: number,
): boolean {
  return Math.round(getScrollTopMax(element) - scrollOffsetTop - pocketHeight) <= 0;
}

export function getBoundaryProps(
  direction: ScrollableDirection,
  scrollOffset: ScrollOffset,
  element: HTMLDivElement,
  pocketHeight: number,
): Partial<ScrollableBoundary> {
  const { left, top } = scrollOffset;
  const boundaryProps: Partial<ScrollableBoundary> = {};
  const { isHorizontal, isVertical } = new ScrollDirection(direction);

  if (isHorizontal) {
    boundaryProps.reachedLeft = Math.round(left) <= 0;
    boundaryProps.reachedRight = isReachedRight(element, left);
  }
  if (isVertical) {
    boundaryProps.reachedTop = Math.round(top) <= 0;
    boundaryProps.reachedBottom = isReachedBottom(element, top, pocketHeight);
  }
  return boundaryProps;
}
