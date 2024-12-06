import { titleize } from '@js/core/utils/inflector';

import {
  DIRECTION_VERTICAL,
  SCROLLABLE_CONTENT_CLASS,
} from '../consts';
import type {
  ElementOffset,
  ScrollableDirection, ScrollOffset,
} from '../types';
import { getRelativeOffset } from './get_relative_offset';

// this function tested by testcafe
/* istanbul ignore next */
export function getElementLocationInternal(
  targetElement: HTMLElement,
  direction: ScrollableDirection,
  containerElement: HTMLDivElement,
  scrollOffset: ScrollOffset,
  offset?: ElementOffset,
  scrollableContentClass = SCROLLABLE_CONTENT_CLASS,
): number {
  const additionalOffset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    ...offset,
  };

  const isVertical = direction === DIRECTION_VERTICAL;

  const prop = isVertical ? 'top' : 'left';
  const inverseProp = isVertical ? 'bottom' : 'right';
  const dimension = isVertical ? 'height' : 'width';

  const containerOffsetSize: number = containerElement[`offset${titleize(dimension)}`];
  const containerClientSize: number = containerElement[`client${titleize(dimension)}`];
  const containerSize = containerElement.getBoundingClientRect()[dimension];
  const elementSize = targetElement.getBoundingClientRect()[dimension];

  let scale = 1;

  // For support zooming using styles: transform = scale(0.33) or zoom = 0.33
  if (Math.abs(containerSize - containerOffsetSize) > 1) {
    scale = containerSize / containerOffsetSize;
  }

  // T162489
  const relativeElementOffset = getRelativeOffset(
    scrollableContentClass,
    targetElement,
  )[prop] / scale;

  const containerScrollOffset = scrollOffset[prop];

  const relativeStartOffset = containerScrollOffset - relativeElementOffset
    + additionalOffset[prop];
  const relativeEndOffset = containerScrollOffset - relativeElementOffset
    - elementSize / scale
    + containerClientSize
    - additionalOffset[inverseProp];

  if (relativeStartOffset <= 0 && relativeEndOffset >= 0) {
    return containerScrollOffset;
  }

  return containerScrollOffset
    - (Math.abs(relativeStartOffset) > Math.abs(relativeEndOffset)
      ? relativeEndOffset
      : relativeStartOffset);
}
