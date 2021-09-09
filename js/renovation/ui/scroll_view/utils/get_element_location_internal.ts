import {
  ScrollableDirection, ScrollOffset,
} from '../common/types.d';

import { getRelativeOffset } from './get_relative_offset';

import {
  DIRECTION_VERTICAL,
  SCROLLABLE_CONTENT_CLASS,
} from '../common/consts';

/* istanbul ignore next */
export function getElementLocationInternal(
  targetElement: HTMLElement,
  direction: ScrollableDirection,
  containerElement: HTMLDivElement,
  scrollOffset: ScrollOffset,
  offset?: Partial<Omit<ClientRect, 'width' | 'height'>>,
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

  const dimension = isVertical ? 'Height' : 'Width';

  // T162489
  const relativeElementOffset = getRelativeOffset(targetElement.closest(`.${SCROLLABLE_CONTENT_CLASS}`), targetElement)[prop];
  const containerScrollOffset = scrollOffset[prop];

  const containerSize: number = containerElement[`client${dimension}`];

  const targetElementRect = targetElement.getBoundingClientRect();
  const elementSize = targetElementRect[inverseProp] - targetElementRect[prop];

  const relativeStartOffset = containerScrollOffset - relativeElementOffset
    + additionalOffset[prop];
  const relativeEndOffset = containerScrollOffset - relativeElementOffset
    - elementSize
    + containerSize
    - additionalOffset[inverseProp];

  if (relativeStartOffset <= 0 && relativeEndOffset >= 0) {
    return containerScrollOffset;
  }

  return containerScrollOffset
    - (Math.abs(relativeStartOffset) > Math.abs(relativeEndOffset)
      ? relativeEndOffset
      : relativeStartOffset);
}
