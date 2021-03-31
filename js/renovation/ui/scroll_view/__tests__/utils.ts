import {
  RefObject,
} from 'devextreme-generator/component_declaration/common';

import {
  ScrollableLocation,
  ScrollableDirection,
  ScrollableBoundary,
} from '../types.d';

import {
  SCROLLABLE_CONTENT_CLASS,
} from '../common/consts';

export function createElement({
  location,
  width = 50,
  height = 50,
  offsetParent = {},
  className = '',
  isInScrollableContent = false,
}: { [key: string]: any }): HTMLElement {
  const checkSelector = (selector: string): boolean => className.indexOf(selector.replace('.', '')) > -1;
  return {
    offsetHeight: height,
    offsetWidth: width,
    offsetTop: location.top,
    offsetLeft: location.left,
    offsetParent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    closest: (selector: string): Element | null => (
      isInScrollableContent ? {} as Element : null
    ),
    matches: (selector: string): boolean => checkSelector(selector),
  } as HTMLElement;
}

export function createContainerRef(
  location: Partial<ScrollableLocation>,
  direction: ScrollableDirection = 'vertical',
  scrollBarWidth = 17,
  isRtlEnabled = false,
): RefObject<HTMLDivElement> {
  const offsetWidth = 300;
  const offsetHeight = 300;
  const scrollWidth = 600;
  const scrollHeight = 600;
  return ({
    current: {
      scrollTop: location.top,
      scrollLeft: isRtlEnabled ? -1 * (location.left || 0) : location.left,
      offsetHeight: offsetWidth,
      offsetWidth: offsetHeight,
      scrollWidth: direction === 'horizontal' || direction === 'both' ? scrollWidth - scrollBarWidth : scrollWidth,
      scrollHeight: direction === 'vertical' || direction === 'both' ? scrollHeight - scrollBarWidth : scrollHeight,
      clientWidth: direction === 'horizontal' || direction === 'both' ? offsetWidth - scrollBarWidth : offsetWidth,
      clientHeight: direction === 'vertical' || direction === 'both' ? offsetHeight - scrollBarWidth : offsetHeight,
    },
  }) as RefObject<HTMLDivElement>;
}

export function normalizeRtl(isRtlEnabled: boolean, coordinate: number): number {
  return isRtlEnabled
    ? -1 * coordinate
    : coordinate;
}

export function calculateRtlScrollLeft(container: HTMLElement, coordinate: number): number {
  const scrollLeft = container.scrollWidth - container.clientWidth - coordinate;
  return normalizeRtl(true, scrollLeft) as number;
}

export function createTargetElement(args: { [key: string]: any }): HTMLElement {
  const scrollableContent = createElement({
    location: { },
    className: SCROLLABLE_CONTENT_CLASS,
  });
  return createElement({
    ...args,
    ...{ offsetParent: scrollableContent, isInScrollableContent: true },
  });
}

export function checkScrollParams({ direction, actual, expected }:
{ direction: ScrollableDirection;
  actual: ScrollableBoundary;
  expected: Partial<ScrollableBoundary>;
}): void {
  const expectedParams = expected;

  if (direction === 'vertical') {
    delete expectedParams.reachedLeft;
    delete expectedParams.reachedRight;
  } else if (direction === 'horizontal') {
    delete expectedParams.reachedTop;
    delete expectedParams.reachedBottom;
  }

  expect(actual).toMatchObject(expectedParams);
}
