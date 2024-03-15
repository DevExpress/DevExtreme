import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import {
  getOuterHeight,
  getOuterWidth,
} from '@js/core/utils/size';
import {
  normalizeStyleProp, styleProp,
} from '@js/core/utils/style';
import { isDefined, isNumeric, isString } from '@js/core/utils/type';
import type { Item } from '@js/ui/splitter';

import { compareNumbersWithPrecision, PRECISION } from './number_comparison';
import type { FlexProperty, PaneRestrictions } from './types';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findIndexOfNextVisibleItem(items: any[], index: number): number {
  for (let i = index + 1; i < items.length; i += 1) {
    if (items[i].visible !== false) {
      return i;
    }
  }
  return -1;
}

export function resizePanel(paneConstraints: PaneRestrictions, size: number): number {
  const {
    minSize = 0,
    maxSize = 100,
  } = paneConstraints;

  let adjustedSize = compareNumbersWithPrecision(size, minSize) < 0 ? minSize : size;

  adjustedSize = Math.min(maxSize, adjustedSize);
  adjustedSize = parseFloat(adjustedSize.toFixed(PRECISION));

  return adjustedSize;
}

// eslint-disable-next-line max-len
function findMaxAvailableDelta(
  increment: number,
  currentLayout: number[],
  paneConstraints: PaneRestrictions[],
  paneIndex: number,
  maxDelta = 0,
): number {
  if (paneIndex < 0 || paneIndex >= paneConstraints.length) {
    return maxDelta;
  }

  const prevSize = currentLayout[paneIndex];

  const maxPaneSize = resizePanel(paneConstraints[paneIndex], 100);

  const delta = maxPaneSize - prevSize;

  const nextMaxDelta = maxDelta + delta;

  return findMaxAvailableDelta(
    increment,
    currentLayout,
    paneConstraints,
    paneIndex + increment,
    nextMaxDelta,
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getNewLayout(
  currentLayout: number[],
  delta: number,
  prevPaneIndex: number,
  paneConstraints: PaneRestrictions[],
): number[] {
  const nextLayout = [...currentLayout];
  const nextPaneIndex = prevPaneIndex + 1;

  // -----------------------------------
  const increment = delta < 0 ? 1 : -1;
  let currentItemIndex = delta < 0 ? nextPaneIndex : prevPaneIndex;

  // eslint-disable-next-line max-len
  const maxDelta = findMaxAvailableDelta(increment, currentLayout, paneConstraints, currentItemIndex);
  const minAbsDelta = Math.min(Math.abs(delta), Math.abs(maxDelta));

  let deltaApplied = 0;
  // eslint-disable-next-line no-param-reassign
  delta = delta < 0 ? -minAbsDelta : minAbsDelta;

  currentItemIndex = delta < 0 ? prevPaneIndex : nextPaneIndex;
  while (currentItemIndex >= 0 && currentItemIndex < paneConstraints.length) {
    const deltaRemaining = Math.abs(delta) - Math.abs(deltaApplied);
    const prevSize = currentLayout[currentItemIndex];

    const unsafeSize = prevSize - deltaRemaining;
    const safeSize = resizePanel(paneConstraints[currentItemIndex], unsafeSize);
    if (!(compareNumbersWithPrecision(prevSize, safeSize) === 0)) {
      deltaApplied += prevSize - safeSize;
      nextLayout[currentItemIndex] = safeSize;
      if (deltaApplied
        .toPrecision(3)
        .localeCompare(Math.abs(delta).toPrecision(3), undefined, {
          numeric: true,
        }) >= 0) {
        break;
      }
    }
    if (delta < 0) {
      // eslint-disable-next-line no-plusplus
      currentItemIndex--;
    } else {
      // eslint-disable-next-line no-plusplus
      currentItemIndex++;
    }
  }
  if (compareNumbersWithPrecision(deltaApplied, 0) === 0) {
    return currentLayout;
  }

  let pivotIndex = delta < 0 ? nextPaneIndex : prevPaneIndex;
  let prevSize = currentLayout[pivotIndex];
  let unsafeSize = prevSize + deltaApplied;
  let safeSize = resizePanel(
    paneConstraints[pivotIndex],
    unsafeSize,
  );

  nextLayout[pivotIndex] = safeSize;

  if (!(compareNumbersWithPrecision(safeSize, unsafeSize) === 0)) {
    let deltaRemaining = unsafeSize - safeSize;

    pivotIndex = delta < 0 ? nextPaneIndex : prevPaneIndex;

    let index = pivotIndex;
    while (index >= 0 && index < paneConstraints.length) {
      prevSize = nextLayout[index];

      unsafeSize = prevSize + deltaRemaining;
      safeSize = resizePanel(
        paneConstraints[index],
        unsafeSize,
      );
      if (!(compareNumbersWithPrecision(prevSize, safeSize) === 0)) {
        deltaRemaining -= safeSize - prevSize;
        nextLayout[index] = safeSize;
      }
      if (compareNumbersWithPrecision(deltaRemaining, 0) === 0) {
        break;
      }
      if (delta > 0) {
        // eslint-disable-next-line no-plusplus
        index--;
      } else {
        // eslint-disable-next-line no-plusplus
        index++;
      }
    }
  }

  const totalSize = nextLayout.reduce((total, size) => size + total, 0);

  if (!(compareNumbersWithPrecision(totalSize, 100, 3) === 0)) {
    return currentLayout;
  }

  return nextLayout;
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

// eslint-disable-next-line class-methods-use-this
function isPercentWidth(size: string | number): boolean {
  return isString(size) && size.endsWith('%');
}

// eslint-disable-next-line class-methods-use-this
function isPixelWidth(size: string | number): boolean {
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
  const layout = Array<number>(layoutRestrictions.length);

  const panelConstraintsArray = layoutRestrictions; // panes.filter((p) => p.visible !== false);

  let numPanelsWithSizes = 0;
  let remainingSize = 100;

  for (let index = 0; index < panelConstraintsArray.length; index += 1) {
    const panelConstraints = panelConstraintsArray[index];
    const { size, visible } = panelConstraints;

    if (size != null) {
      numPanelsWithSizes += 1;

      layout[index] = size;
      remainingSize -= size;
    }

    if (visible === false) {
      numPanelsWithSizes += 1;

      layout[index] = 0;
      remainingSize -= 0;
    }
  }

  for (let index = 0; index < panelConstraintsArray.length; index += 1) {
    const panelConstraints = panelConstraintsArray[index];

    const { size, visible } = panelConstraints;

    if (size != null || visible === false) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const numRemainingPanels = panelConstraintsArray.length - numPanelsWithSizes;
    const newSize = remainingSize / numRemainingPanels;

    numPanelsWithSizes += 1;

    layout[index] = newSize;
    remainingSize -= newSize;
  }

  return layout;
}

// eslint-disable-next-line class-methods-use-this
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

  let remainingSize = 0;

  // First pass: Validate the proposed layout given each panel's constraints
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < layoutRestrictions.length; index++) {
    const unsafeSize = nextLayout[index];
    // assert(unsafeSize != null);

    const safeSize = resizePanel(layoutRestrictions[index], unsafeSize);

    // eslint-disable-next-line eqeqeq
    if (unsafeSize != safeSize) {
      remainingSize += unsafeSize - safeSize;

      nextLayout[index] = safeSize;
    }
  }

  // If there is additional, left over space, assign it to any panel(s) that permits it
  // (It's not worth taking multiple additional passes to evenly distribute)
  if (!(compareNumbersWithPrecision(remainingSize, 0) === 0)) {
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < layoutRestrictions.length; index++) {
      const prevSize = nextLayout[index];

      const unsafeSize = prevSize + remainingSize;
      const safeSize = resizePanel(layoutRestrictions[index], unsafeSize);

      if (prevSize !== safeSize) {
        remainingSize -= safeSize - prevSize;
        nextLayout[index] = safeSize;

        // Once we've used up the remainder, bail
        // eslint-disable-next-line max-depth
        if (compareNumbersWithPrecision(remainingSize, 0) === 0) {
          break;
        }
      }
    }
  }

  return nextLayout;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// export function getInitialLayout(panes, totalPanesSize: number): number[] {
//   const layout: number[] = [];
//   let totalSize = 0;
//   let sizeOverflow = false;

//   // eslint-disable-next-line no-restricted-syntax
//   for (const pane of panes) {
//     if (pane.visible === false || sizeOverflow || pane.size === 0) {
//       layout.push(0);
//       // todo: refactor
//     } else if (pane.size && (isPercentWidth(pane.size) || isPixelWidth(pane.size))) {
//       let ratio = convertSizeToRatio(pane.size, totalPanesSize) ?? 0;

//       ratio = Math.min(100 - totalSize, ratio);
//       totalSize += ratio;

//       layout.push(ratio);

//       if (totalSize >= 100) {
//         sizeOverflow = true;
//       }
//     } else {
//       layout.push(-1);
//     }
//   }

//   const noSizePanes = panes.filter((p) => p.visible !== false && !p.size && p.size !== 0);

//   if (noSizePanes.length) {
//     const remainingSpace = Math.max(100 - totalSize, 0);

//     layout.forEach((pane, index) => {
//       if (layout[index] === -1) {
//         layout[index] = remainingSpace / noSizePanes.length;
//       }
//     });
//   } else if (totalSize < 100) {
//     layout[findLastIndexOfVisibleItem(panes)] += 100 - totalSize;
//   }

//   return layout;
// }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getElementItemsSizeSum($element, orientation, handlesCount): number {
  const size: number = orientation === ORIENTATION.horizontal
    ? getOuterWidth($element) : getOuterHeight($element);

  const handlesSizeSum = handlesCount * DEFAULT_RESIZE_HANDLE_SIZE;

  return size - handlesSizeSum;
}

export function getVisibleItems(items: Item[]): Item[] {
  return items.filter((p) => p.visible !== false);
}

export function getVisibleItemsCount(items: Item[]): number {
  return getVisibleItems(items).length;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getElementSize($element, items, orientation, width, height): number {
  const handlesCount = Math.max(getVisibleItemsCount(items) - 1, 0);

  const sizeOption = orientation === ORIENTATION.horizontal ? width : height;

  if (sizeOption) {
    return sizeOption - handlesCount * DEFAULT_RESIZE_HANDLE_SIZE;
  }
  return getElementItemsSizeSum($element, orientation, handlesCount);
}

export function isElementVisible(element: HTMLElement | undefined | null): boolean {
  if (element) {
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects?.().length);
  }

  return false;
}
