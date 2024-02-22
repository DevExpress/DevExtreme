import $ from '@js/core/renderer';
import {
  normalizeStyleProp, styleProp,
} from '@js/core/utils/style';

const FLEX_PROPERTY_NAME = 'flexGrow';
const INVISIBLE_ITEM_CLASS = 'dx-state-invisible';
const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const DEFAULT_RESIZE_HANDLE_SIZE = 8;

const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getItemsDistribution(items): number[] {
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
    if (!$(items[i]).hasClass(INVISIBLE_ITEM_CLASS)) {
      return i;
    }
  }
  return -1;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getNewLayoutState(delta, handle, currentLayout, items): number[] {
  const newLayoutState = [...currentLayout];

  // @ts-expect-error todo: fix error
  const firstItemIndex: number = $(handle).prev().data().dxItemIndex;
  const secondItemIndex = findNextVisibleItemIndex(items, firstItemIndex);

  const decreasingItemIndex = delta < 0 ? firstItemIndex : secondItemIndex;
  const currentSize = currentLayout[decreasingItemIndex];
  const actualDelta: number = Math.min(Math.abs(delta), currentSize);
  newLayoutState[decreasingItemIndex] = currentSize - actualDelta;

  const increasingItemIndex = delta < 0 ? secondItemIndex : firstItemIndex;
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  newLayoutState[increasingItemIndex] = currentLayout[increasingItemIndex] + actualDelta;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return newLayoutState;
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
