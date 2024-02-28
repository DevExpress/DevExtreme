import $ from '@js/core/renderer';
import {
  normalizeStyleProp, styleProp,
} from '@js/core/utils/style';
import type { CollectionWidgetItem as Item } from '@js/ui/collection/ui.collection_widget.base';

const FLEX_PROPERTY_NAME = 'flexGrow';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';
const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const DEFAULT_RESIZE_HANDLE_SIZE = 8;

const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getCurrentLayout(items): number[] {
  const itemsDistribution = [];
  items.each((index, item) => {
    // @ts-expect-error todo: fix error
    itemsDistribution.push(parseFloat($(item).css(FLEX_PROPERTY_NAME)));
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function findNextVisibleItemIndex(items, itemIndex: number): number {
  for (let i = itemIndex + 1; i < items.length; i += 1) {
    if (!$(items[i]).hasClass(INVISIBLE_STATE_CLASS)) {
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
export function getNewLayout(delta, handle, currentLayout, items): number[] {
  const newLayout = [...currentLayout];

  // @ts-expect-error todo: fix error
  const firstItemIndex: number = $(handle).prev().data().dxItemIndex;
  const secondItemIndex = findNextVisibleItemIndex(items, firstItemIndex);

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
function getOffsetValue(offset, orientation, rtlEnabled): number {
  const xOffset: number = rtlEnabled ? -offset.x : offset.x;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return orientation === ORIENTATION.horizontal ? xOffset : offset.y;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function getElementItemsSizeSum($element, orientation): number {
  const splitterSize = $element.get(0).getBoundingClientRect();
  const size: number = orientation === ORIENTATION.horizontal
    ? splitterSize.width : splitterSize.height;

  const handlesCount = $element.children(`.${RESIZE_HANDLE_CLASS}`).length;

  const handlesSizeSum = handlesCount * DEFAULT_RESIZE_HANDLE_SIZE;

  return size - handlesSizeSum;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getDelta(offset, orientation, rtlEnabled, $element): number {
  const delta = (getOffsetValue(offset, orientation, rtlEnabled)
    / getElementItemsSizeSum($element, orientation)) * 100;
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

export function getInitialLayout(items: Item[]): number[] {
  const layout: number[] = [];

  const visibleItemsCount = items.filter((item) => item.visible !== false).length;

  items.forEach((item) => {
    layout.push(item.visible === false ? 0 : 100 / visibleItemsCount);
  });

  return layout;
}
