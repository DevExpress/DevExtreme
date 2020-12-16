import { isNumeric } from '../../../core/utils/type';
import getScrollRtlBehavior from '../../../core/utils/scroll_rtl_behavior';
import { camelize } from '../../../core/utils/inflector';

import {
  ScrollableLocation, ScrollOffset, ScrollableBoundary, ScrollableDirection,
} from './types.d';

export const DIRECTION_VERTICAL = 'vertical';
export const DIRECTION_HORIZONTAL = 'horizontal';
export const DIRECTION_BOTH = 'both';
export const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
export const SCROLLABLE_WRAPPER_CLASS = 'dx-scrollable-wrapper';
export const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
export const SCROLLVIEW_CONTENT_CLASS = 'dx-scrollview-content';
export const SCROLLVIEW_TOP_POCKET_CLASS = 'dx-scrollview-top-pocket';
export const SCROLLVIEW_BOTTOM_POCKET_CLASS = 'dx-scrollview-bottom-pocket';
export const SCROLLABLE_DISABLED_CLASS = 'dx-scrollable-disabled';

export function ensureLocation(
  location: number | Partial<ScrollableLocation>,
): ScrollableLocation {
  if (isNumeric(location)) {
    return {
      left: location,
      top: location,
    };
  }
  return { top: 0, left: 0, ...location };
}

function getRelativeLocation(element: HTMLElement): ScrollableLocation {
  const result = { top: 0, left: 0 };
  let targetElement = element;
  while (!targetElement.matches(`.${SCROLLABLE_CONTENT_CLASS}`)) {
    result.top += targetElement.offsetTop;
    result.left += targetElement.offsetLeft;
    targetElement = targetElement.offsetParent as HTMLElement;
  }
  return result;
}

export class ScrollDirection {
  direction: ScrollableDirection;

  readonly DIRECTION_HORIZONTAL = 'horizontal';

  readonly DIRECTION_VERTICAL = 'vertical';

  readonly DIRECTION_BOTH = 'both';

  constructor(direction: ScrollableDirection) {
    this.direction = direction;
  }

  get isHorizontal(): boolean {
    return this.direction === DIRECTION_HORIZONTAL || this.direction === DIRECTION_BOTH;
  }

  get isVertical(): boolean {
    return this.direction === DIRECTION_VERTICAL || this.direction === DIRECTION_BOTH;
  }
}

function getMaxScrollOffset(dimension: string, containerRef: HTMLDivElement): number {
  return containerRef[`scroll${camelize(dimension, true)}`] - containerRef[`client${camelize(dimension, true)}`];
}

export function getBoundaryProps(
  direction: ScrollableDirection,
  scrollOffset: ScrollableLocation,
  containerRef: HTMLDivElement,
): Partial<ScrollableBoundary> {
  const { left, top } = scrollOffset;
  const boundaryProps: Partial<ScrollableBoundary> = {};
  const { isHorizontal, isVertical } = new ScrollDirection(direction);

  if (isHorizontal) {
    boundaryProps.reachedLeft = left <= 0;
    boundaryProps.reachedRight = Math.round(left) >= getMaxScrollOffset('width', containerRef);
  }
  if (isVertical) {
    boundaryProps.reachedTop = top <= 0;
    boundaryProps.reachedBottom = top >= getMaxScrollOffset('height', containerRef);
  }
  return boundaryProps;
}

export function getContainerOffsetInternal(containerRef: HTMLDivElement): ScrollableLocation {
  return {
    left: containerRef.scrollLeft,
    top: containerRef.scrollTop,
  };
}

function getScrollBarSize(dimension: string, containerRef: HTMLDivElement): number {
  return containerRef[`offset${dimension}`] - containerRef[`client${dimension}`];
}

function needNormalizeCoordinate(prop: keyof ScrollOffset, rtlEnabled?: boolean): boolean {
  return rtlEnabled === true && prop === 'left';
}

export function normalizeCoordinate(
  prop: keyof ScrollOffset, coordinate: number, rtlEnabled?: boolean,
): number {
  return needNormalizeCoordinate(prop, rtlEnabled) && getScrollRtlBehavior().positive
    ? -1 * coordinate
    : coordinate;
}

export function getPublicCoordinate(
  prop: keyof ScrollOffset, coordinate: number, containerRef: HTMLDivElement, rtlEnabled?: boolean,
): number {
  return needNormalizeCoordinate(prop, rtlEnabled)
    ? getMaxScrollOffset('width', containerRef) + normalizeCoordinate(prop, coordinate, rtlEnabled)
    : coordinate;
}

function getElementLocationInternal(
  element: HTMLElement,
  prop: keyof ScrollOffset,
  offset: ScrollOffset,
  direction: ScrollableDirection,
  containerRef: HTMLDivElement,
  rtlEnabled?: boolean,
): number {
  const dimension = direction === DIRECTION_VERTICAL ? 'Height' : 'Width';
  const relativeLocation = getRelativeLocation(element)[prop];
  const scrollBarSize = getScrollBarSize(dimension, containerRef);
  const containerSize = containerRef[`offset${dimension}`];
  const elementOffset = element[`offset${dimension}`];
  const offsetStart = offset[prop];
  const offsetEnd = offset[direction === DIRECTION_VERTICAL ? 'bottom' : 'right'];

  const containerLocation = normalizeCoordinate(
    prop,
    getContainerOffsetInternal(containerRef)[prop],
    rtlEnabled,
  );

  if (relativeLocation < containerLocation + offsetStart) {
    if (elementOffset < containerSize - offsetStart - offsetEnd) {
      return relativeLocation - offsetStart;
    }
    return relativeLocation + elementOffset - containerSize + offsetEnd + scrollBarSize;
  }
  if (relativeLocation + elementOffset
    >= containerLocation + containerSize - offsetEnd - scrollBarSize) {
    if (elementOffset < containerSize - offsetStart - offsetEnd) {
      return relativeLocation + elementOffset + scrollBarSize - containerSize + offsetEnd;
    }
    return relativeLocation - offsetStart;
  }
  return containerLocation;
}

export function getElementLocation(
  element: HTMLElement,
  offset: ScrollOffset,
  direction: ScrollableDirection,
  containerRef: HTMLDivElement,
  rtlEnabled?: boolean,
): number {
  const prop = direction === DIRECTION_VERTICAL ? 'top' : 'left';
  const location = normalizeCoordinate(
    prop,
    getElementLocationInternal(element, prop, offset, direction, containerRef, rtlEnabled),
    rtlEnabled,
  );

  return getPublicCoordinate(prop, location, containerRef, rtlEnabled);
}
