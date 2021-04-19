import {
  RefObject,
} from '@devextreme-generator/declarations';

import {
  ScrollableLocation,
  ScrollableDirection,
} from '../types.d';

import {
  SCROLLABLE_CONTENT_CLASS,
  TopPocketState,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  DIRECTION_BOTH,
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

const permutations = (array1, array2) => {
  const result = [] as any;
  let counter = 0;

  if (array1.length === 0) {
    return array2;
  }

  array1.forEach((opt1) => {
    array2.forEach((opt2) => {
      if (Array.isArray(opt1)) {
        result[counter] = [...opt1, opt2];
      } else {
        result[counter] = [opt1, opt2];
      }
      counter += 1;
    });
  });

  return result;
};

export function getPermutations(sourceOptionArr: any[][]): any[] {
  return sourceOptionArr.reduce((arr1, arr2) => permutations(arr1, arr2), []);
}

export const optionValues = {
  direction: [DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH],
  allowedDirection: [DIRECTION_VERTICAL, DIRECTION_HORIZONTAL, DIRECTION_BOTH, undefined],
  pocketState: [
    TopPocketState.STATE_RELEASED, TopPocketState.STATE_READY, TopPocketState.STATE_PULLED,
    TopPocketState.STATE_LOADING, TopPocketState.STATE_TOUCHED,
    TopPocketState.STATE_REFRESHING,
  ],
  pullDownEnabled: [true, false],
  reachBottomEnabled: [true, false],
  nativeRefreshStrategy: ['swipeDown', 'pullDown'],
  forceGeneratePockets: [true, false],
  useSimulatedScrollbar: [true, false],
  isReachBottom: [true, false],
  isSwipeDown: [true, false],
  platforms: ['android', 'ios', 'generic'],
  showScrollbar: ['never', 'always', 'onScroll', 'onHover'],
  bounceEnabled: [true, false],
  inertiaEnabled: [true, false],
  isDxWheelEvent: [true, false],
  scrollByThumb: [true, false],
  scrollByContent: [true, false],
};
