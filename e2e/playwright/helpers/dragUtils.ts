import type { Locator, Page } from '@playwright/test';

export interface DragOptions {
  offsetX?: number;
  offsetY?: number;
  steps?: number;
}

interface Point { x: number; y: number }

interface ScrollRequest {
  maxMargin: number;
  offsetX?: number;
  offsetY?: number;
}

const DEFAULT_STEPS = 10;
const MAX_SCROLL_MARGIN = 50;

const offsetWithin = (size: number, offset: number | undefined): number => {
  if (offset === undefined) {
    return size / 2;
  }

  return offset < 0 ? size + offset : offset;
};

// Mirrors TestCafe's ScrollAutomation, which leaves up to 50px between the element and the edge.
const scrollIntoView = (
  element: Locator,
  offsetX?: number,
  offsetY?: number,
): Promise<void> => element.evaluate((node, { maxMargin, ...offsets }: ScrollRequest) => {
  interface Axis {
    scroll: number;
    parentSize: number;
    relativeStart: number;
    relativeEnd: number;
    childSize: number;
    point: number;
  }

  const SCROLLABLE_OVERFLOW = /auto|scroll/;
  const root = document.documentElement;

  const hasScroll = (el: Element): boolean => {
    const { overflowX, overflowY } = getComputedStyle(el);

    if (el === root) {
      return !(overflowX === 'hidden' && overflowY === 'hidden')
        && (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    }

    return (SCROLLABLE_OVERFLOW.test(overflowX) && el.scrollWidth > el.clientWidth)
      || (SCROLLABLE_OVERFLOW.test(overflowY) && el.scrollHeight > el.clientHeight);
  };

  const resolveOffset = (size: number, offset: number | undefined): number => {
    if (offset === undefined) {
      return Math.floor(size / 2);
    }

    return offset < 0 ? size + offset : offset;
  };

  const getScroll = (axis: Axis, margin: number): number => {
    const {
      scroll, parentSize, relativeStart, relativeEnd, childSize, point,
    } = axis;

    if (parentSize >= childSize) {
      const fullViewMargin = Math.min(margin, parentSize - childSize);

      if (relativeStart < fullViewMargin) {
        return Math.max(scroll + relativeStart - fullViewMargin, 0);
      }

      if (relativeEnd < fullViewMargin) {
        return Math.max(scroll + Math.min(relativeStart, -relativeEnd) + fullViewMargin, 0);
      }
    }

    const pointMargin = Math.min(margin, Math.floor(parentSize / 2));

    if (point >= parentSize - pointMargin) {
      return Math.max(scroll + point - parentSize + pointMargin, 0);
    }

    if (point <= pointMargin) {
      return Math.max(scroll + point - pointMargin, 0);
    }

    return scroll;
  };

  const getAxes = (parent: Element, child: Element): [Axis, Axis] => {
    const isRoot = parent === root;
    const parentRect = parent.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    const targetRect = node.getBoundingClientRect();
    const style = getComputedStyle(parent);
    const border = {
      left: isRoot ? 0 : parseFloat(style.borderLeftWidth),
      right: isRoot ? 0 : parseFloat(style.borderRightWidth),
      top: isRoot ? 0 : parseFloat(style.borderTopWidth),
      bottom: isRoot ? 0 : parseFloat(style.borderBottomWidth),
    };
    const left = isRoot ? 0 : parentRect.left;
    const top = isRoot ? 0 : parentRect.top;
    const width = isRoot ? parent.clientWidth : parentRect.width;
    const height = isRoot ? parent.clientHeight : parentRect.height;
    const scrollbarRight = isRoot ? 0 : width - border.left - border.right - parent.clientWidth;
    const scrollbarBottom = isRoot ? 0 : height - border.top - border.bottom - parent.clientHeight;

    return [{
      scroll: parent.scrollLeft,
      parentSize: width,
      relativeStart: Math.ceil(childRect.left - left - border.left),
      relativeEnd: Math.floor(left + width - childRect.right - border.right - scrollbarRight),
      childSize: childRect.width,
      point: targetRect.left - left + resolveOffset(targetRect.width, offsets.offsetX),
    }, {
      scroll: parent.scrollTop,
      parentSize: height,
      relativeStart: Math.ceil(childRect.top - top - border.top),
      relativeEnd: Math.floor(top + height - childRect.bottom - border.bottom - scrollbarBottom),
      childSize: childRect.height,
      point: targetRect.top - top + resolveOffset(targetRect.height, offsets.offsetY),
    }];
  };

  let child: Element = node;

  for (let parent = node.parentElement; parent; parent = parent.parentElement) {
    if (hasScroll(parent)) {
      const [x, y] = getAxes(parent, child);
      const isFullyVisible = getScroll(x, 0) === x.scroll && getScroll(y, 0) === y.scroll;

      if (!isFullyVisible) {
        parent.scrollLeft = getScroll(x, maxMargin);
        parent.scrollTop = getScroll(y, maxMargin);
      }

      child = parent;
    }
  }
}, { maxMargin: MAX_SCROLL_MARGIN, offsetX, offsetY });

const pointWithin = async (
  element: Locator,
  offsetX?: number,
  offsetY?: number,
): Promise<Point> => {
  await scrollIntoView(element, offsetX, offsetY);

  const box = await element.boundingBox();

  if (!box) {
    throw new Error(`${element.toString()} has no box to point at`);
  }

  return {
    x: Math.round(box.x + offsetWithin(box.width, offsetX)),
    y: Math.round(box.y + offsetWithin(box.height, offsetY)),
  };
};

const press = async (
  page: Page,
  source: Locator,
  offsetX?: number,
  offsetY?: number,
): Promise<Point> => {
  const start = await pointWithin(source, offsetX, offsetY);

  await page.mouse.move(start.x, start.y);
  await page.mouse.down();

  return start;
};

export const startDragToOffset = async (
  page: Page,
  source: Locator,
  deltaX: number,
  deltaY: number,
  { offsetX, offsetY, steps = DEFAULT_STEPS }: DragOptions = {},
): Promise<void> => {
  const start = await press(page, source, offsetX, offsetY);

  await page.mouse.move(start.x + deltaX, start.y + deltaY, { steps });
};

export const startDragToElement = async (
  page: Page,
  source: Locator,
  target: Locator,
  { offsetX, offsetY, steps = DEFAULT_STEPS }: DragOptions = {},
): Promise<void> => {
  await press(page, source, offsetX, offsetY);

  const end = await pointWithin(target);

  await page.mouse.move(end.x, end.y, { steps });
};

export const finishDrag = async (page: Page): Promise<void> => {
  await page.mouse.up();
};

export const dragToOffset = async (
  page: Page,
  source: Locator,
  deltaX: number,
  deltaY: number,
  options?: DragOptions,
): Promise<void> => {
  await startDragToOffset(page, source, deltaX, deltaY, options);
  await finishDrag(page);
};

export const dragToElement = async (
  page: Page,
  source: Locator,
  target: Locator,
  options?: DragOptions,
): Promise<void> => {
  await startDragToElement(page, source, target, options);
  await finishDrag(page);
};
