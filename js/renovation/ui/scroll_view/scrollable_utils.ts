import {
  isDefined,
  isPlainObject,
} from '../../../core/utils/type';
import getScrollRtlBehavior from '../../../core/utils/scroll_rtl_behavior';
import { titleize } from '../../../core/utils/inflector';
import { ensureDefined } from '../../../core/utils/common';

import {
  ScrollableLocation,
  ScrollOffset,
  ScrollableDirection,
  AllowedDirection,
} from './types.d';

import {
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
} from './common/consts';

import {
  ScrollDirection,
} from './utils/scroll_direction';

function isScrollInverted(rtlEnabled: boolean): boolean {
  // const { rtlEnabled, useNative } = this.option();

  const { decreasing, positive } = getScrollRtlBehavior();

  // eslint-disable-next-line no-bitwise
  return rtlEnabled && !!(decreasing ^ positive); // useNative &&
}

export function getScrollSign(rtlEnabled: boolean): number {
  return isScrollInverted(rtlEnabled) && getScrollRtlBehavior().positive ? -1 : 1;
}

export function restoreLocation(
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

  const { isVertical, isHorizontal } = new ScrollDirection(direction);
  return {
    left: isHorizontal ? -location : undefined,
    top: isVertical ? -location : undefined,
  };
}

/* istanbul ignore next */
function getElementLocationInternal(
  element: HTMLElement,
  offset: ScrollOffset,
  direction: ScrollableDirection,
  containerElement: HTMLDivElement,
): number {
  const prop = direction === DIRECTION_VERTICAL ? 'top' : 'left';
  const dimension = direction === DIRECTION_VERTICAL ? 'Height' : 'Width';
  // let relativeLocation = getRelativePosition(element, `.${SCROLLABLE_CONTENT_CLASS}`)[prop];
  const relativeLocation = containerElement[`scroll${titleize(prop)}`] + element.getBoundingClientRect()[prop] - containerElement.getBoundingClientRect()[prop];
  const containerLocation = containerElement[`scroll${titleize(prop)}`];

  const scrollBarSize = containerElement[`offset${dimension}`] - containerElement[`client${dimension}`];
  const containerSize = containerElement[`offset${dimension}`];
  const elementOffset = element[`offset${dimension}`];
  const offsetStart = offset[prop];
  const offsetEnd = offset[direction === DIRECTION_VERTICAL ? 'bottom' : 'right'] || 0;

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

export function normalizeOffsetLeft(
  scrollLeft: number, maxLeftOffset: number, rtlEnabled: boolean,
): number {
  if (isScrollInverted(rtlEnabled)) {
    if (getScrollRtlBehavior().positive) {
      // for ie11 support
      return maxLeftOffset - scrollLeft;
    }

    return maxLeftOffset + scrollLeft;
  }

  return scrollLeft;
}

/* istanbul ignore next */
export function getLocation(
  element: HTMLElement,
  offset: ScrollOffset,
  direction: ScrollableDirection,
  containerElement: HTMLDivElement,
): number {
  const location = getElementLocationInternal(
    element,
    offset,
    direction,
    containerElement,
  );

  return location;
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
