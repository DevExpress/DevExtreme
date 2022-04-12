import { Row, VirtualContentType } from '../types';

export const DEFAULT_ROW_HEIGHT = 20;
export const calculateRowHeight = (
  visibleRowHeights: number[],
  visibleRowCount: number,
): number => {
  const itemsSize = visibleRowHeights.reduce((sum, item) => sum + item, 0);
  const rowCount = visibleRowCount ?? 0;
  return itemsSize > 0 && rowCount > 0 ? itemsSize / rowCount : DEFAULT_ROW_HEIGHT;
};
export const calculateItemHeights = (
  visibleRows: Row[], rowHeights: number[],
): number[] => {
  const calculatedRowSizes: number[] = [];
  let itemSize = 0;
  let lastLoadIndex = -1;

  rowHeights.forEach((height, index) => {
    const currentItem = visibleRows[index];
    if (!currentItem) {
      return;
    }

    if (lastLoadIndex >= 0 && lastLoadIndex !== currentItem.loadIndex) {
      calculatedRowSizes.push(itemSize);
      itemSize = 0;
    }
    lastLoadIndex = currentItem.loadIndex as number;
    itemSize += height;
  });

  itemSize > 0 && calculatedRowSizes.push(itemSize);

  return calculatedRowSizes;
};
export const calculateViewportItemIndex = (
  topScrollPosition: number, rowHeight: number,
  itemHeights: Record<number, number>,
): number => {
  const position = topScrollPosition;
  const defaultItemSize = rowHeight;
  let offset = 0;
  let itemOffset = 0;

  const itemOffsetsWithSize = Object.keys(itemHeights).concat('-1');
  for (let i = 0; i < itemOffsetsWithSize.length && offset < position; i += 1) {
    const itemOffsetWithSize = parseInt(itemOffsetsWithSize[i], 10);
    let itemOffsetDiff = (position - offset) / defaultItemSize;
    if (itemOffsetWithSize < 0 || itemOffset + itemOffsetDiff < itemOffsetWithSize) {
      itemOffset += itemOffsetDiff;
      break;
    } else {
      itemOffsetDiff = itemOffsetWithSize - itemOffset;
      offset += itemOffsetDiff * defaultItemSize;
      itemOffset += itemOffsetDiff;
    }
    const itemSize = itemHeights[itemOffsetWithSize];
    offset += itemSize;
    itemOffset += offset < position ? 1 : (position - offset + itemSize) / itemSize;
  }
  return Math.round(itemOffset * 50) / 50;
};
export const getVirtualContentOffset = (
  type: VirtualContentType,
  itemIndex: number,
  totalCount: number,
  itemHeights: Record<number, number>,
  rowHeight: number,
): number => {
  let itemCount = itemIndex;
  if (!itemCount) return 0;
  let offset = 0;

  Object.keys(itemHeights).forEach((currentItemIndex) => {
    if (!itemCount) return;
    const isBottom = type === 'bottom';
    const currentIndex = currentItemIndex as unknown as number;
    if (isBottom
      ? currentIndex >= totalCount - itemIndex
      : currentIndex < itemIndex) {
      offset += itemHeights[currentIndex];
      itemCount -= 1;
    }
  });
  return Math.floor(offset + itemCount * rowHeight);
};
