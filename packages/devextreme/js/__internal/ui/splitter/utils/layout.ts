import type { Orientation } from '@js/common';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import {
  getHeight,
  getWidth,
} from '@js/core/utils/size';
import {
  normalizeStyleProp, styleProp,
} from '@js/core/utils/style';
import { isDefined, isNumeric, isString } from '@js/core/utils/type';
import type { Item } from '@js/ui/splitter';

import { compareNumbersWithPrecision, PRECISION } from './number_comparison';
import type { FlexProperty, PaneRestrictions, ResizeOffset } from './types';

const FLEX_PROPERTY_NAME = 'flexGrow';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findIndexOfNextVisibleItem(items: any[], index: number): number {
  for (let i = index + 1; i < items.length; i += 1) {
    if (items[i].visible !== false) {
      return i;
    }
  }
  return -1;
}

export function normalizePanelSize(paneRestrictions: PaneRestrictions, size: number): number {
  const {
    minSize = 0,
    maxSize = 100,
    resizable,
  } = paneRestrictions;

  if (paneRestrictions.collapsed === true) {
    return 0;
  }
  if (resizable === false) {
    return paneRestrictions.size as number;
  }

  let adjustedSize = compareNumbersWithPrecision(size, minSize) < 0 ? minSize : size;

  adjustedSize = Math.min(maxSize, adjustedSize);
  adjustedSize = parseFloat(adjustedSize.toFixed(PRECISION));

  return adjustedSize;
}

// eslint-disable-next-line max-len
function findMaxAvailableDelta(
  increment: number,
  currentLayout: number[],
  paneRestrictions: PaneRestrictions[],
  paneIndex: number,
  maxDelta = 0,
): number {
  if (paneIndex < 0 || paneIndex >= paneRestrictions.length) {
    return maxDelta;
  }

  const prevSize = currentLayout[paneIndex];

  const maxPaneSize = normalizePanelSize(paneRestrictions[paneIndex], 100);

  const delta = maxPaneSize - prevSize;

  const nextMaxDelta = maxDelta + delta;

  return findMaxAvailableDelta(
    increment,
    currentLayout,
    paneRestrictions,
    paneIndex + increment,
    nextMaxDelta,
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getNewLayout(
  currentLayout: number[],
  delta: number,
  prevPaneIndex: number,
  paneRestrictions: PaneRestrictions[],
): number[] {
  const nextLayout = [...currentLayout];
  const nextPaneIndex = prevPaneIndex + 1;

  let currentDelta = delta;
  const increment = currentDelta < 0 ? 1 : -1;
  let currentItemIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;

  // eslint-disable-next-line max-len
  const maxDelta = findMaxAvailableDelta(
    increment,
    currentLayout,
    paneRestrictions,
    currentItemIndex,
  );
  const minAbsDelta = Math.min(Math.abs(currentDelta), Math.abs(maxDelta));

  let deltaApplied = 0;
  currentDelta = currentDelta < 0 ? -minAbsDelta : minAbsDelta;
  currentItemIndex = currentDelta < 0 ? prevPaneIndex : nextPaneIndex;

  while (currentItemIndex >= 0 && currentItemIndex < paneRestrictions.length) {
    const deltaRemaining = Math.abs(currentDelta) - Math.abs(deltaApplied);
    const prevSize = currentLayout[currentItemIndex];

    const unsafeSize = prevSize - deltaRemaining;
    const safeSize = normalizePanelSize(paneRestrictions[currentItemIndex], unsafeSize);
    if (!(compareNumbersWithPrecision(prevSize, safeSize) === 0)) {
      deltaApplied += prevSize - safeSize;
      nextLayout[currentItemIndex] = safeSize;

      if (parseFloat(deltaApplied.toFixed(PRECISION))
        >= parseFloat(Math.abs(currentDelta).toFixed(PRECISION))) {
        break;
      }
    }
    if (currentDelta < 0) {
      currentItemIndex -= 1;
    } else {
      currentItemIndex += 1;
    }
  }
  if (compareNumbersWithPrecision(deltaApplied, 0) === 0) {
    return currentLayout;
  }

  let pivotIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;
  let prevSize = currentLayout[pivotIndex];
  let unsafeSize = prevSize + deltaApplied;
  let safeSize = normalizePanelSize(
    paneRestrictions[pivotIndex],
    unsafeSize,
  );

  nextLayout[pivotIndex] = safeSize;

  if (!(compareNumbersWithPrecision(safeSize, unsafeSize) === 0)) {
    let deltaRemaining = unsafeSize - safeSize;

    pivotIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;

    let index = pivotIndex;
    while (index >= 0 && index < paneRestrictions.length) {
      prevSize = nextLayout[index];

      unsafeSize = prevSize + deltaRemaining;
      safeSize = normalizePanelSize(
        paneRestrictions[index],
        unsafeSize,
      );
      if (!(compareNumbersWithPrecision(prevSize, safeSize) === 0)) {
        deltaRemaining -= safeSize - prevSize;
        nextLayout[index] = safeSize;
      }
      if (compareNumbersWithPrecision(deltaRemaining, 0) === 0) {
        break;
      }
      if (currentDelta > 0) {
        index -= 1;
      } else {
        index += 1;
      }
    }
  }

  const totalSize = nextLayout.reduce((total, size) => size + total, 0);

  if (!(compareNumbersWithPrecision(totalSize, 100, 3) === 0)) {
    return currentLayout;
  }

  return nextLayout;
}

function normalizeOffset(
  offset: ResizeOffset,
  orientation: Orientation,
  rtlEnabled: boolean,
): number {
  if (orientation === ORIENTATION.vertical) {
    return offset.y ?? 0;
  }

  return (rtlEnabled ? -1 : 1) * (offset.x ?? 0);
}

export function getDimensionByOrientation(orientation: string): string {
  return orientation === ORIENTATION.horizontal ? 'width' : 'height';
}

export function calculateDelta(
  offset: ResizeOffset,
  orientation: Orientation,
  rtlEnabled: boolean,
  totalWidth: number,
): number {
  const delta = (normalizeOffset(offset, orientation, rtlEnabled) / totalWidth) * 100;
  return delta;
}

export function setFlexProp(
  element: HTMLElement,
  prop: FlexProperty,
  value: string | number,
): void {
  const normalizedProp = normalizeStyleProp(prop, value);
  element.style[styleProp(prop)] = normalizedProp;
}

export function updateItemsSize(
  items: unknown,
  sizeDistribution: number[],
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (items as any).each((index, item) => {
    setFlexProp(item, FLEX_PROPERTY_NAME, sizeDistribution[index]);
  });
}

function isPercentWidth(size: string | number): boolean {
  return isString(size) && size.endsWith('%');
}

function isPixelWidth(size: string | number | undefined): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return isNumeric(size) || (isString(size) && size.endsWith('px'));
}

function calculatePercentage(
  totalSize: number,
  size: number,
): number {
  if (totalSize === 0) {
    return 0;
  }

  const percentage = (size / totalSize) * 100;
  return percentage;
}

// We can do it better
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function convertSizeToRatio(
  size: string | number | undefined,
  totalPanesSize: number,
): number | undefined {
  if (!isDefined(size)) {
    return size;
  }

  const isPixel = isPixelWidth(size);
  const sizeNumber = parseFloat(size as string);

  if (isPixel) {
    return parseFloat(calculatePercentage(totalPanesSize, sizeNumber).toFixed(4));
  }

  const isPercentage = isPercentWidth(size);
  if (isPercentage) {
    return sizeNumber;
  }

  // todo: handle incorrect size input
  return 0;
}

export function getDefaultLayout(layoutRestrictions: PaneRestrictions[]): number[] {
  const layout: number[] = new Array(layoutRestrictions.length).fill(0);

  let numPanelsWithSizes = 0;
  let remainingSize = 100;

  layoutRestrictions.forEach((panelConstraints, index) => {
    const { size, visible, collapsed } = panelConstraints;

    if (visible === false) {
      numPanelsWithSizes += 1;

      layout[index] = 0;
      remainingSize -= 0;

      return;
    }

    if (collapsed === true) {
      numPanelsWithSizes += 1;

      layout[index] = 0;
      remainingSize -= 0;

      return;
    }

    if (isDefined(size)) {
      numPanelsWithSizes += 1;

      layout[index] = size;
      remainingSize -= size;
    }
  });

  layoutRestrictions.forEach((panelConstraints, index) => {
    const { size, visible, collapsed } = panelConstraints;

    if (size == null && visible !== false && collapsed !== true) {
      const numRemainingPanels = layoutRestrictions.length - numPanelsWithSizes;
      const newSize = remainingSize / numRemainingPanels;

      numPanelsWithSizes += 1;

      layout[index] = newSize;
      remainingSize -= newSize;
    }
  });

  return layout;
}

function adjustAndDistributeLayoutSize(
  layout: number[],
  layoutRestrictions: PaneRestrictions[],
): number[] {
  let remainingSize = 0;

  const nextLayout = layout.map((panelSize, index) => {
    const restriction = layoutRestrictions[index];
    const adjustedSize = normalizePanelSize(restriction, panelSize);

    remainingSize += panelSize - adjustedSize;
    return adjustedSize;
  });

  if (compareNumbersWithPrecision(remainingSize, 0) !== 0) {
    for (
      let index = 0;
      index < nextLayout.length && compareNumbersWithPrecision(remainingSize, 0) !== 0;
      index += 1
    ) {
      const currentSize = nextLayout[index];
      const adjustedSize = normalizePanelSize(
        layoutRestrictions[index],
        currentSize + remainingSize,
      );

      remainingSize -= adjustedSize - currentSize;

      nextLayout[index] = adjustedSize;
    }
  }

  return nextLayout;
}

export function validateLayout(
  prevLayout: number[],
  layoutRestrictions: PaneRestrictions[],
): number[] {
  const nextLayout = [...prevLayout];
  const nextLayoutTotalSize = nextLayout.reduce(
    (accumulated, current) => accumulated + current,
    0,
  );

  if (!(compareNumbersWithPrecision(nextLayoutTotalSize, 100) === 0)) {
    for (let index = 0; index < layoutRestrictions.length; index += 1) {
      const unsafeSize = nextLayout[index];

      const safeSize = (100 / nextLayoutTotalSize) * unsafeSize;
      nextLayout[index] = safeSize;
    }
  }

  return adjustAndDistributeLayoutSize(nextLayout, layoutRestrictions);
}

function getElementItemsSizeSum(
  $element: dxElementWrapper,
  orientation: Orientation,
  handlesSizeSum: number,
): number {
  const size: number = orientation === ORIENTATION.horizontal
    ? getWidth($element) : getHeight($element);

  return size - handlesSizeSum;
}

export function getVisibleItems(items: Item[]): Item[] {
  return items.filter((p) => p.visible !== false);
}

export function getVisibleItemsCount(items: Item[]): number {
  return getVisibleItems(items).length;
}

export function getElementSize(
  $element: dxElementWrapper,
  orientation: Orientation,
  width: number | string | undefined,
  height: number | string | undefined,
  handlesSizeSum: number,
): number {
  const sizeOption = orientation === ORIENTATION.horizontal ? width : height;

  if (isPixelWidth(sizeOption)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return sizeOption - handlesSizeSum;
  }

  return getElementItemsSizeSum($element, orientation, handlesSizeSum);
}

export function isElementVisible(element: HTMLElement | undefined | null): boolean {
  if (element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects?.().length);
  }

  return false;
}
