import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import {
  normalizeStyleProp, styleProp,
} from '@js/core/utils/style';
import { isNumeric, isString } from '@js/core/utils/type';

const FLEX_PROPERTY_NAME = 'flexGrow';
const DEFAULT_RESIZE_HANDLE_SIZE = 8;

const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

export function getCurrentLayout($items: dxElementWrapper): number[] {
  const itemsDistribution: number[] = [];
  $items.each((index, item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemsDistribution.push(parseFloat(($(item) as any).css(FLEX_PROPERTY_NAME)));

    return true;
  });

  return itemsDistribution;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findLastIndexOfVisibleItem(items: any[]): number {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (items[i].visible !== false) {
      return i;
    }
  }
  return -1;
}

// eslint-disable-next-line max-len
function findMaxAvailableDelta(currentLayout, firstItemIndex, secondItemIndex, isSizeDecreasing): number {
  const firstIndex = isSizeDecreasing ? 0 : secondItemIndex;
  const lastIndex = isSizeDecreasing ? firstItemIndex : currentLayout.length - 1;
  let maxAvailableDelta = 0;

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  for (let i = firstIndex; i <= lastIndex; i += 1) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    maxAvailableDelta += currentLayout[i];
  }

  return maxAvailableDelta;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getNewLayout(
  currentLayout: number[],
  delta: number,
  prevPaneIndex: number,
): number[] {
  const newLayout = [...currentLayout];

  const firstItemIndex: number = prevPaneIndex;
  const secondItemIndex = firstItemIndex + 1;

  const isSizeDecreasing = delta < 0;
  // eslint-disable-next-line max-len
  const maxAvailableDelta = findMaxAvailableDelta(currentLayout, firstItemIndex, secondItemIndex, isSizeDecreasing);
  let currentSplitterItemIndex = isSizeDecreasing ? firstItemIndex : secondItemIndex;
  const actualDelta: number = Math.min(Math.abs(delta), maxAvailableDelta);
  let remainingDelta = actualDelta;

  while (remainingDelta > 0) {
    const currentSize = currentLayout[currentSplitterItemIndex];
    if (currentSize >= remainingDelta) {
      newLayout[currentSplitterItemIndex] = currentSize - remainingDelta;
      remainingDelta = 0;
    } else {
      remainingDelta -= currentSize;
      newLayout[currentSplitterItemIndex] = 0;
    }

    currentSplitterItemIndex += isSizeDecreasing ? -1 : 1;
  }

  const increasingItemIndex = isSizeDecreasing ? secondItemIndex : firstItemIndex;
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  newLayout[increasingItemIndex] = currentLayout[increasingItemIndex] + actualDelta;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return newLayout;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function normalizeOffset(offset, orientation, rtlEnabled): number {
  const xOffset: number = rtlEnabled ? -offset.x : offset.x;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return orientation === ORIENTATION.horizontal ? xOffset : offset.y;
}

export function getDimensionByOrientation(orientation: string): string {
  return orientation === ORIENTATION.horizontal ? 'width' : 'height';
}

export function calculateDelta(
  offset: number,
  orientation: string,
  rtlEnabled: boolean,
  totalWidth: number,
): number {
  const delta = (normalizeOffset(offset, orientation, rtlEnabled) / totalWidth) * 100;
  return delta;
}

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, class-methods-use-this
export function setFlexProp(element, prop, value): void {
  const normalizedProp = normalizeStyleProp(prop, value);
  element.style[styleProp(prop)] = normalizedProp;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function updateItemsSize(items, sizeDistribution): void {
  items.each((index, item) => {
    setFlexProp(item, FLEX_PROPERTY_NAME, sizeDistribution[index]);
  });
}

// eslint-disable-next-line class-methods-use-this
function isPercentWidth(size: string | number): boolean {
  return isString(size) && size.endsWith('%');
}

// eslint-disable-next-line class-methods-use-this
function isPixelWidth(size: string | number): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return isNumeric(size) || (isString(size) && size.endsWith('px'));
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function calculatePercentage(totalSize, size) {
  if (totalSize === 0) {
    return 0;
  }

  const percentage = (size / totalSize) * 100;
  return percentage;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getPercentSize(size: string | number, totalPanesSize: number): number {
  const isPixel = isPixelWidth(size);
  const sizeNumber = parseFloat(size as string);

  if (isPixel) {
    return calculatePercentage(totalPanesSize, sizeNumber);
  }

  const isPercentage = isPercentWidth(size);
  if (isPercentage) {
    return sizeNumber;
  }

  // todo: handle incorrect size input
  return 0;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getInitialLayout(panes, totalPanesSize: number): number[] {
  const layout: number[] = [];
  let totalSize = 0;
  let sizeOverflow = false;

  // eslint-disable-next-line no-restricted-syntax
  for (const pane of panes) {
    if (pane.visible === false || sizeOverflow || pane.size === 0) {
      layout.push(0);
      // todo: refactor
    } else if (pane.size && (isPercentWidth(pane.size) || isPixelWidth(pane.size))) {
      let percentSize = getPercentSize(pane.size, totalPanesSize);
      percentSize = Math.min(100 - totalSize, percentSize);
      totalSize += percentSize;
      layout.push(percentSize);

      if (totalSize >= 100) {
        sizeOverflow = true;
      }
    } else {
      layout.push(-1);
    }
  }

  const noSizePanes = panes.filter((p) => p.visible !== false && !p.size && p.size !== 0);

  if (noSizePanes.length) {
    const remainingSpace = Math.max(100 - totalSize, 0);

    layout.forEach((pane, index) => {
      if (layout[index] === -1) {
        layout[index] = remainingSpace / noSizePanes.length;
      }
    });
  } else if (totalSize < 100) {
    layout[findLastIndexOfVisibleItem(panes)] += 100 - totalSize;
  }

  return layout;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getElementItemsSizeSum($element, orientation, handlesCount): number {
  const splitterSize = $element.get(0).getBoundingClientRect();
  const size: number = orientation === ORIENTATION.horizontal
    ? splitterSize.width : splitterSize.height;

  const handlesSizeSum = handlesCount * DEFAULT_RESIZE_HANDLE_SIZE;

  return size - handlesSizeSum;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getElementSize($element, items, orientation, width, height): number {
  const handlesCount = Math.max(items.filter((p) => p.visible !== false).length - 1, 0);

  const sizeOption = orientation === ORIENTATION.horizontal ? width : height;

  if (sizeOption) {
    return sizeOption - handlesCount * DEFAULT_RESIZE_HANDLE_SIZE;
  }
  return getElementItemsSizeSum($element, orientation, handlesCount);
}
