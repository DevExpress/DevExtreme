import type { Orientation } from '@js/common';
import { toFixed } from '@js/common/core/localization/utils';
import type { dxElementWrapper } from '@js/core/renderer';
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

const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

const PERCENT_UNIT = '%';
const PIXEL_UNIT = 'px';

export function findLastIndexOfVisibleItem(items: Item[]): number {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (items[i].visible !== false) {
      return i;
    }
  }
  return -1;
}

export function findLastIndexOfNonCollapsedItem(items: Item[]): number {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (items[i].collapsed !== true) {
      return i;
    }
  }
  return -1;
}

export function findLastVisibleExpandedItemIndex(items: Item[]): number {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    const { collapsed, visible } = items[i];

    if (collapsed !== true && visible !== false) {
      return i;
    }
  }
  return -1;
}

export function findIndexOfNextVisibleItem(items: Item[], index: number): number {
  for (let i = index + 1; i < items.length; i += 1) {
    if (items[i].visible !== false) {
      return i;
    }
  }
  return -1;
}

export function normalizePanelSize(
  paneRestrictions: PaneRestrictions,
  size: number,
): number {
  const {
    minSize = 0,
    maxSize = 100,
    resizable,
    visible,
    collapsed,
    collapsedSize = 0,
  } = paneRestrictions;

  if (visible === false) {
    return 0;
  }

  if (collapsed === true) {
    return collapsedSize ?? 0;
  }

  if (resizable === false && isDefined(paneRestrictions.size)) {
    return paneRestrictions.size;
  }

  let adjustedSize = compareNumbersWithPrecision(size, minSize) < 0 ? minSize : size;

  adjustedSize = Math.min(maxSize, adjustedSize);
  adjustedSize = parseFloat(toFixed(adjustedSize, PRECISION));

  return adjustedSize;
}

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

export function getNextLayout(
  currentLayout: number[],
  delta: number,
  prevPaneIndex: number | undefined,
  paneRestrictions: PaneRestrictions[],
): number[] {
  if (!isDefined(prevPaneIndex)) {
    return currentLayout;
  }

  const nextLayout = [...currentLayout];
  const nextPaneIndex = prevPaneIndex + 1;

  let currentDelta = delta;
  const increment = currentDelta < 0 ? 1 : -1;
  let currentItemIndex = currentDelta < 0 ? nextPaneIndex : prevPaneIndex;

  const maxDelta = findMaxAvailableDelta(
    increment,
    currentLayout,
    paneRestrictions,
    currentItemIndex,
    0,
  );
  const minAbsDelta = Math.min(Math.abs(currentDelta), Math.abs(maxDelta));

  let deltaApplied = 0;
  currentDelta = currentDelta < 0 ? -minAbsDelta : minAbsDelta;
  currentItemIndex = currentDelta < 0 ? prevPaneIndex : nextPaneIndex;

  while (currentItemIndex >= 0 && currentItemIndex < paneRestrictions.length) {
    const deltaRemaining = Math.abs(currentDelta) - Math.abs(deltaApplied);
    const prevSize = currentLayout[currentItemIndex];

    const unsafeSize = prevSize - deltaRemaining;
    const safeSize = normalizePanelSize(
      paneRestrictions[currentItemIndex],
      unsafeSize,
    );

    if (!(compareNumbersWithPrecision(prevSize, safeSize) === 0)) {
      deltaApplied += prevSize - safeSize;
      nextLayout[currentItemIndex] = safeSize;

      if (parseFloat(toFixed(deltaApplied, PRECISION))
        >= parseFloat(toFixed(Math.abs(currentDelta), PRECISION))) {
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
  if (!(compareNumbersWithPrecision(totalSize, 100, 2) === 0)) {
    return currentLayout;
  }

  return nextLayout;
}

function normalizeOffset(
  offset: ResizeOffset,
  orientation: Orientation | undefined,
  rtlEnabled: boolean | undefined,
): number {
  if (orientation === ORIENTATION.vertical) {
    return offset.y ?? 0;
  }

  return (rtlEnabled ? -1 : 1) * (offset.x ?? 0);
}

export function calculateDelta(
  offset: ResizeOffset,
  orientation: Orientation | undefined,
  rtlEnabled: boolean | undefined,
  ratio: number | undefined = 0,
): number {
  const delta = normalizeOffset(offset, orientation, rtlEnabled) * ratio;
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

function isValidFormat(size: string | number, unit: string): boolean {
  if (!isString(size)) {
    return false;
  }

  const regex = new RegExp(`^\\d+(\\.\\d+)?${unit}$`);

  return regex.test(size);
}

export function isPercentWidth(size: string | number): boolean {
  return isValidFormat(size, PERCENT_UNIT);
}

export function isPixelWidth(size: string | number): boolean {
  if (typeof size === 'number') {
    return size >= 0;
  }
  return isValidFormat(size, PIXEL_UNIT);
}

function computeRatio(
  totalSize: number,
  size: number,
): number {
  if (totalSize === 0) {
    return 0;
  }

  const percentage = (size / totalSize) * 100;
  return percentage;
}

export function tryConvertToNumber(
  size: string | number | undefined,
  totalPanesSize: number,
): number | undefined {
  if (!isDefined(size)) {
    return undefined;
  }

  if (isNumeric(size) && size >= 0) {
    return Number(size);
  }

  if (isString(size)) {
    if (isPercentWidth(size)) {
      return (parseFloat(size) / 100) * totalPanesSize;
    } if (isPixelWidth(size)) {
      return parseFloat(size.slice(0, -2));
    }
  }

  return undefined;
}

export function convertSizeToRatio(
  size: string | number | undefined,
  totalPanesSize: number,
  handlesSizeSum: number,
): number | undefined {
  const sizeInPx = tryConvertToNumber(size, totalPanesSize);

  if (!isDefined(sizeInPx)) {
    return undefined;
  }

  const adjustedSize = totalPanesSize - handlesSizeSum;
  const ratio = computeRatio(adjustedSize, sizeInPx);

  return parseFloat(toFixed(ratio, PRECISION));
}

export function getVisibleItems(items: Item[]): Item[] {
  return items.filter((p) => p.visible !== false);
}

export function getVisibleItemsCount(items: Item[]): number {
  return getVisibleItems(items).length;
}

export function getElementSize(
  $element: dxElementWrapper,
  orientation: Orientation | undefined,
): number {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return orientation === ORIENTATION.horizontal
    ? getWidth($element)
    : getHeight($element);
}

export function isElementVisible(element: HTMLElement | undefined | null): boolean {
  if (element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects?.().length);
  }

  return false;
}
