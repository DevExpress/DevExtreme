import {
  createValue, createGetter, createSelector,
} from '../../../../utils/plugin/context';
import { Row, ScrollingMode, DataState } from '../types';
import {
  VisibleRows, TotalCount,
  DataStateValue,
} from '../plugins';
import { RowsViewHeightValue } from '../views/table_content';
import { ScrollOffset } from '../../../scroll_view/common/types';
import { calculateViewportItemIndex, getVirtualContentOffset } from './utils';

export const ScrollingModeValue = createValue<ScrollingMode>();
export const ScrollingPositionValue = createValue<ScrollOffset>();
export const ViewportSkipValue = createGetter<number>(0);
export const ViewportTakeValue = createGetter<number>(0);
export const ItemHeightsValue = createValue<Record<number, number>>();
export const RowHeightValue = createValue<number>();
export const TopVirtualRowHeightValue = createGetter<number>(0);
export const BottomVirtualRowHeightValue = createGetter<number>(0);

export const CalculateViewportSkipValue = createSelector<number>(
  [ScrollingPositionValue, RowHeightValue, ItemHeightsValue],
  (scrollingPosition: ScrollOffset, rowHeight, itemHeights) => {
    const topScrollPosition = scrollingPosition?.top ?? 0;
    const topIndex = calculateViewportItemIndex(topScrollPosition, rowHeight, itemHeights);
    return Math.floor(topIndex);
  },
);
export const CalculateViewportTakeValue = createSelector<number>(
  [
    ScrollingModeValue, TotalCount, RowsViewHeightValue, ScrollingPositionValue,
    ViewportSkipValue, RowHeightValue, ItemHeightsValue,
  ],
  (
    scrollingMode, totalCount, rowsViewHeight: number, scrollingPosition: ScrollOffset,
    skip, rowHeight, itemHeights,
  ) => {
    const virtualMode = scrollingMode === 'virtual';
    const totalItemsCount = totalCount ?? 0;
    const viewportHeight = rowsViewHeight ?? 0;
    const topScrollPosition = scrollingPosition?.top ?? 0;
    const bottomIndex = calculateViewportItemIndex(topScrollPosition + viewportHeight,
      rowHeight, itemHeights);
    let take = Math.ceil(bottomIndex - skip);

    if (virtualMode) {
      const remainedItems = Math.max(0, totalItemsCount - skip);
      take = Math.min(take, remainedItems);
    }

    return take;
  },
);
export const AddLoadIndexToVisibleRows = createSelector<Row[]>(
  [VisibleRows, DataStateValue],
  (visibleRows: Row[], dataState: DataState) => {
    let loadIndex = (dataState.dataOffset ?? 0) - 1;
    const newRows = visibleRows.map((row) => {
      const r = row;
      if (row.rowType === 'data') {
        loadIndex += 1;
      }
      r.loadIndex = loadIndex;
      return r;
    });
    return newRows;
  },
);
export const CalculateVisibleRowsInViewport = createSelector<Row[]>(
  [VisibleRows, ViewportSkipValue, ViewportTakeValue],
  (visibleRows: Row[], skip: number, take: number) => visibleRows.filter((row) => {
    const isLoadIndexGreaterStart = row.loadIndex !== undefined && row.loadIndex >= skip;
    const isLoadIndexLessEnd = row.loadIndex !== undefined && row.loadIndex < skip + take;

    return isLoadIndexGreaterStart && isLoadIndexLessEnd;
  }),
);
export const CalculateTopVirtualRowHeight = createSelector<number>(
  [ViewportSkipValue, RowHeightValue, TotalCount, ItemHeightsValue],
  (
    skip: number, rowHeight: number,
    totalCount: number, itemHeights: Record<number, number>,
  ) => getVirtualContentOffset('top', skip, totalCount, itemHeights, rowHeight),
);
export const CalculateBottomVirtualRowHeight = createSelector<number>(
  [ViewportSkipValue, TotalCount, RowHeightValue, ItemHeightsValue, VisibleRows],
  (
    skip: number, totalCount: number, rowHeight: number,
    itemHeights: Record<number, number>,
    visibleRows: Row[],
  ) => {
    const rowCount = visibleRows.filter((r) => r.rowType === 'data').length;
    return getVirtualContentOffset('bottom', totalCount - skip - rowCount, totalCount, itemHeights, rowHeight);
  },
);
