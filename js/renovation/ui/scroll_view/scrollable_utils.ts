import {
  isNumeric, isPlainObject,
} from '../../../core/utils/type';
import getScrollRtlBehavior from '../../../core/utils/scroll_rtl_behavior';
import { titleize } from '../../../core/utils/inflector';
import { ensureDefined } from '../../../core/utils/common';

import {
  ScrollableLocation,
  ScrollOffset, ScrollableBoundary, ScrollableDirection,
  AllowedDirection,
} from './types.d';

import {
  SCROLLABLE_CONTENT_CLASS,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
} from './common/consts';

import {
  ScrollDirection,
} from './utils/scroll_direction';

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

export function getMaxScrollOffset(dimension: string, containerRef: HTMLDivElement): number {
  return containerRef[`scroll${titleize(dimension)}`] - containerRef[`client${titleize(dimension)}`];
}

export function getBoundaryProps(
  direction: ScrollableDirection,
  scrollOffset: ScrollableLocation,
  element: HTMLDivElement,
  topPocketHeight: number,
): Partial<ScrollableBoundary> {
  const { left, top } = scrollOffset;
  const boundaryProps: Partial<ScrollableBoundary> = {};
  const { isHorizontal, isVertical } = new ScrollDirection(direction);

  if (isHorizontal) {
    boundaryProps.reachedLeft = left <= 0;
    boundaryProps.reachedRight = Math.round(left) >= getMaxScrollOffset('width', element);
  }
  if (isVertical) {
    boundaryProps.reachedTop = top <= 0;
    boundaryProps.reachedBottom = top >= getMaxScrollOffset('height', element) - topPocketHeight;
  }
  return boundaryProps;
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
  prop: keyof ScrollOffset, coordinate: number, maxLeftOffset: number, rtlEnabled?: boolean,
): number {
  return needNormalizeCoordinate(prop, rtlEnabled)
    ? maxLeftOffset + normalizeCoordinate(prop, coordinate, rtlEnabled)
    : coordinate;
}

export function normalizeLocation(
  location: number | Partial<{ x: number; y: number; top: number; left: number }>,
  direction?: ScrollableDirection,
): Partial<ScrollableLocation> {
  if (isPlainObject(location)) {
    return {
      left: -ensureDefined(location.left, location.x),
      top: -ensureDefined(location.top, location.y),
    };
  }

  const { isVertical, isHorizontal } = new ScrollDirection(direction);
  return {
    left: isHorizontal ? -location : undefined,
    top: isVertical ? -location : undefined,
  };
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
  const offsetEnd = offset[direction === DIRECTION_VERTICAL ? 'bottom' : 'right'] || 0;

  const containerLocation = normalizeCoordinate(
    prop,
    containerRef[`scroll${titleize(prop)}`],
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
  const maxScrollLeftOffset = getMaxScrollOffset('width', containerRef);
  const location = normalizeCoordinate(
    prop,
    getElementLocationInternal(element, prop, offset, direction, containerRef, rtlEnabled),
    rtlEnabled,
  );

  return getPublicCoordinate(prop, location, maxScrollLeftOffset, rtlEnabled);
}

export function updateAllowedDirection(
  allowedDirections: AllowedDirection, direction: ScrollableDirection,
): string | undefined {
  const { isVertical, isHorizontal, isBoth } = new ScrollDirection(direction);

  if (isBoth && allowedDirections.vertical && allowedDirections.horizontal) {
    return DIRECTION_BOTH;
  } if (isHorizontal && allowedDirections.horizontal) {
    return DIRECTION_HORIZONTAL;
  } if (isVertical && allowedDirections.vertical) {
    return DIRECTION_VERTICAL;
  }
  return undefined;
}
