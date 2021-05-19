import { titleize } from '../../../../core/utils/inflector';

import {
  ScrollableDirection,
} from '../types.d';

import {
  DIRECTION_VERTICAL,
} from '../common/consts';

/* istanbul ignore next */
export function getElementLocationInternal(
  element: HTMLElement,
  offset: Omit<ClientRect, 'width' | 'height'>,
  direction: ScrollableDirection,
  containerElement: HTMLDivElement,
): number {
  const prop = direction === DIRECTION_VERTICAL ? 'top' : 'left';
  const dimension = direction === DIRECTION_VERTICAL ? 'Height' : 'Width';
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
