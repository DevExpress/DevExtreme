import { getScrollLeftMax } from './get_scroll_left_max';
import { getScrollTopMax } from './get_scroll_top_max';
import {
  ScrollableLocation,
  ScrollableBoundary,
  ScrollableDirection,
} from '../types.d';

import {
  ScrollDirection,
} from './scroll_direction';

export function isReachedRight(
  element: HTMLDivElement,
  scrollOffsetLeft: number,
): boolean {
  return getScrollLeftMax(element) - scrollOffsetLeft < 0.5;
}

export function isReachedBottom(
  element: HTMLDivElement,
  scrollOffsetTop: number,
  pocketHeight: number,
): boolean {
  return getScrollTopMax(element) - scrollOffsetTop - pocketHeight <= 0.5;
}

export function getBoundaryProps(
  direction: ScrollableDirection,
  scrollOffset: ScrollableLocation,
  element: HTMLDivElement,
  pocketHeight: number,
): Partial<ScrollableBoundary> {
  const { left, top } = scrollOffset;
  const boundaryProps: Partial<ScrollableBoundary> = {};
  const { isHorizontal, isVertical } = new ScrollDirection(direction);

  if (isHorizontal) {
    boundaryProps.reachedLeft = left <= 0;
    boundaryProps.reachedRight = isReachedRight(element, left);
  }
  if (isVertical) {
    boundaryProps.reachedTop = top <= 0;
    boundaryProps.reachedBottom = isReachedBottom(element, top, pocketHeight);
  }
  return boundaryProps;
}
