import {
  isNumeric, isDefined, isPlainObject, isWindow,
} from '../../../core/utils/type';
import getScrollRtlBehavior from '../../../core/utils/scroll_rtl_behavior';
import { camelize } from '../../../core/utils/inflector';
import getElementComputedStyle from '../../utils/get_computed_style';
import { toNumber } from '../../utils/type_conversion';
import { ensureDefined } from '../../../core/utils/common';

import {
  ScrollableLocation,
  ScrollOffset, ScrollableBoundary, ScrollableDirection,
  allowedDirection,
} from './types.d';

export const SCROLL_LINE_HEIGHT = 40;

export const DIRECTION_VERTICAL = 'vertical';
export const DIRECTION_HORIZONTAL = 'horizontal';
export const DIRECTION_BOTH = 'both';
export const SCROLLABLE_SIMULATED_CLASS = 'dx-scrollable-simulated';
export const SCROLLABLE_CONTENT_CLASS = 'dx-scrollable-content';
export const SCROLLABLE_WRAPPER_CLASS = 'dx-scrollable-wrapper';
export const SCROLLABLE_CONTAINER_CLASS = 'dx-scrollable-container';
export const SCROLLVIEW_CONTENT_CLASS = 'dx-scrollview-content';
export const SCROLLVIEW_BOTTOM_POCKET_CLASS = 'dx-scrollview-bottom-pocket';
export const SCROLLABLE_DISABLED_CLASS = 'dx-scrollable-disabled';
export const SCROLLABLE_SCROLLBAR_SIMULATED = 'dx-scrollable-scrollbar-simulated';
export const SCROLLABLE_SCROLLBARS_HIDDEN = 'dx-scrollable-scrollbars-hidden';
export const SCROLLABLE_SCROLLBARS_ALWAYSVISIBLE = 'dx-scrollable-scrollbars-alwaysvisible';

export const SCROLLABLE_SCROLLBAR_CLASS = 'dx-scrollable-scrollbar';

export function getElementWidth(element: Element | undefined): number {
  return toNumber(getElementComputedStyle(element)?.width);
}

export function getElementHeight(element: Element | undefined): number {
  return toNumber(getElementComputedStyle(element)?.height);
}

export function getElementStyle(
  name: keyof CSSStyleDeclaration, element?: Element,
): number | string {
  const computedStyle = getElementComputedStyle(element) || {};
  return computedStyle[name];
}

export function getWindowByElement(element: Element): Element {
  return isWindow(element) ? element : (element as any).defaultView;
}

export function getElementOffset(
  element?: Element,
): { left: number; top: number } {
  if (!element) return { left: 0, top: 0 };

  if (!element.getClientRects().length) {
    return {
      top: 0,
      left: 0,
    };
  }

  const rect = element.getBoundingClientRect();
  const window = getWindowByElement((element as any).ownerDocument);
  const docElem = element.ownerDocument.documentElement;

  return {
    top: rect.top + (window as any).pageYOffset - docElem.clientTop,
    left: rect.left + (window as any).pageXOffset - docElem.clientLeft,
  };
}

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

  get isBoth(): boolean {
    return this.direction === DIRECTION_BOTH;
  }
}

function getMaxScrollOffset(dimension: string, containerRef: HTMLDivElement): number {
  return containerRef[`scroll${camelize(dimension, true)}`] - containerRef[`client${camelize(dimension, true)}`];
}

export function getBoundaryProps(
  direction: ScrollableDirection,
  scrollOffset: ScrollableLocation,
  element: HTMLDivElement,
  pushBackValue = 0,
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
    boundaryProps.reachedBottom = top >= getMaxScrollOffset('height', element) - 2 * pushBackValue;
  }
  return boundaryProps;
}

export function getContainerOffsetInternal(element: HTMLDivElement): ScrollableLocation {
  return {
    left: element.scrollLeft,
    top: element.scrollTop,
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

export function normalizeLocation(
  location: number | Partial<{ x: number; y: number; top: number; left: number }>,
  direction?: ScrollableDirection,
): Partial<ScrollableLocation> {
  if (isPlainObject(location)) {
    const left = ensureDefined(location.left, location.x);
    const top = ensureDefined(location.top, location.y);

    return {
      left: isDefined(left) ? -left : undefined,
      top: isDefined(top) ? -top : undefined,
    };
  }

  const { isVertical, isHorizontal } = new ScrollDirection(direction || 'vertical');
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

export function updateAllowedDirection(
  allowedDirections: allowedDirection, direction: ScrollableDirection,
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
