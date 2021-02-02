import React from 'react';
import { mount } from 'enzyme';

import {
  RefObject,
} from 'devextreme-generator/component_declaration/common';

import {
  ScrollableLocation,
  ScrollableDirection,
} from '../types.d';

import { Scrollbar } from '../scrollbar';

import {
  SCROLLABLE_CONTENT_CLASS,
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
} from '../scrollable_utils';

export function createElement({
  location,
  width = 50,
  height = 50,
  offsetParent = {},
  className = '',
  isInScrollableContent = false,
}): HTMLElement {
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
    scrollTop: location.top,
    scrollLeft: isRtlEnabled ? -1 * (location.left || 0) : location.left,
    offsetHeight: offsetWidth,
    offsetWidth: offsetHeight,
    scrollWidth: direction === 'horizontal' || direction === 'both' ? scrollWidth - scrollBarWidth : scrollWidth,
    scrollHeight: direction === 'vertical' || direction === 'both' ? scrollHeight - scrollBarWidth : scrollHeight,
    clientWidth: direction === 'horizontal' || direction === 'both' ? offsetWidth - scrollBarWidth : offsetWidth,
    clientHeight: direction === 'vertical' || direction === 'both' ? offsetHeight - scrollBarWidth : offsetHeight,
  }) as RefObject<HTMLDivElement>;
}

export function normalizeRtl(isRtlEnabled: boolean, coordinate: number) {
  return (isRtlEnabled
    ? -1 * coordinate
    : coordinate) as number;
}

export function calculateRtlScrollLeft(container: HTMLElement, coordinate: number): number {
  const scrollLeft = container.scrollWidth - container.clientWidth - coordinate;
  return normalizeRtl(true, scrollLeft) as number;
}

export function createTargetElement(args): HTMLElement {
  const scrollableContent = createElement({
    location: { },
    className: SCROLLABLE_CONTENT_CLASS,
  });
  return createElement({
    ...args,
    ...{ offsetParent: scrollableContent, isInScrollableContent: true },
  });
}

export function checkScrollParams({ direction, actual, expected }) {
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

export function initRefs(model, viewFunction, {
  strategy, direction, contentSize, containerSize,
}) {
  const viewModel = model as any;

  viewModel.containerRef = React.createRef();
  viewModel.contentRef = React.createRef();

  const scrollable = mount(viewFunction(model as any) as JSX.Element);

  viewModel.containerRef = viewModel.containerRef.current;
  viewModel.contentRef = viewModel.contentRef.current;

  if (strategy === 'simulated') {
    const scrollbar = scrollable.find(Scrollbar);
    if (direction === DIRECTION_VERTICAL) {
      viewModel.verticalScrollbarRef = scrollbar.instance();
      Object.assign(viewModel.verticalScrollbarRef,
        { props: { contentSize, containerSize } });
    } else if (direction === DIRECTION_HORIZONTAL) {
      viewModel.horizontalScrollbarRef = scrollbar.instance();
      Object.assign(viewModel.horizontalScrollbarRef,
        { props: { contentSize, containerSize } });
    } else {
      viewModel.horizontalScrollbarRef = scrollbar.at(0).instance();
      Object.assign(viewModel.horizontalScrollbarRef,
        { props: { contentSize, containerSize } });
      viewModel.verticalScrollbarRef = scrollbar.at(1).instance();
      Object.assign(viewModel.verticalScrollbarRef,
        { props: { contentSize, containerSize } });
    }
  }
}

export function setScrollbarPosition(scrollbar, { position, contentSize, containerSize }) {
  if (scrollbar
        && contentSize > containerSize
        && Math.abs(contentSize) > Math.abs(position)) {
    // eslint-disable-next-line no-param-reassign
    scrollbar.cachedVariables.location = position;
  }
}

export function initStyles({ ref, size, overflow }) {
  const elementRef = ref;

  ['width', 'height', 'outerWidth', 'outerHeight', 'scrollWidth', 'scrollHeight'].forEach((prop) => {
    elementRef.style[prop] = `${size}px`;
  });

  ['overflowX', 'overflowY'].forEach((prop) => {
    elementRef.style[prop] = overflow;
  });
  elementRef.getBoundingClientRect = jest.fn(() => ({
    width: size,
    height: size,
  }));

  return elementRef;
}
