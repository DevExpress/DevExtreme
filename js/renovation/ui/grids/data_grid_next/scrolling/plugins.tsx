import {
  createValue, createGetter, createSelector,
} from '../../../../utils/plugin/context';
import {
  Row, ScrollingMode, DataState, ViewportStateType,
} from '../types';
import {
  VisibleRows, TotalCount,
  DataStateValue,
} from '../plugins';
import { PageSize } from '../paging/plugins';
import { RowsViewHeightValue } from '../views/table_content';
import {
  calculateViewportItemIndex, getVirtualContentOffset,
  getNormalizedPageSize, calculatePageIndexByItemIndex,
} from './utils';

export const ScrollingModeValue = createValue<ScrollingMode>();
export const TopScrollingPositionValue = createValue<number>();
export const ViewportSkipValue = createGetter<number>(0);
export const ViewportTakeValue = createGetter<number>(0);
export const ItemHeightsValue = createValue<Record<number, number>>();
export const RowHeightValue = createValue<number>();
export const ViewportStateValue = createValue<ViewportStateType>();
export const TopVirtualRowHeightValue = createGetter<number>(0);
export const BottomVirtualRowHeightValue = createGetter<number>(0);
export const ViewportPageIndex = createGetter<number>(0);
export const ViewportLoadPageCount = createGetter<number>(0);

export const CalculateViewportSkipValue = createSelector<number>(
  [TopScrollingPositionValue, RowHeightValue, ItemHeightsValue, TotalCount],
  (topScrollingPosition, rowHeight, itemHeights, totalCount) => {
    const topScrollPosition = topScrollingPosition ?? 0;
    const topIndex = calculateViewportItemIndex(topScrollPosition, rowHeight, itemHeights);
    const skip = topIndex > totalCount ? totalCount : topIndex;
    return Math.floor(skip);
  },
);
export const CalculateViewportTakeValue = createSelector<number>(
  [
    ScrollingModeValue, TotalCount, RowsViewHeightValue, TopScrollingPositionValue,
    ViewportSkipValue, RowHeightValue, ItemHeightsValue,
  ],
  (
    scrollingMode, totalCount, rowsViewHeight: number, topScrollingPosition,
    skip, rowHeight, itemHeights,
  ) => {
    const virtualMode = scrollingMode === 'virtual';
    const totalItemsCount = totalCount ?? 0;
    const viewportHeight = rowsViewHeight ?? 0;
    const topScrollPosition: number = topScrollingPosition ?? 0;
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
      if (r.rowType === 'data') {
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
export const CalculateViewportPageIndex = createSelector<number>(
  [ViewportSkipValue, PageSize, TotalCount],
  (skip: number, pageSize, totalCount) => {
    const pSize = getNormalizedPageSize(pageSize);
    return calculatePageIndexByItemIndex(skip, pSize, totalCount);
  },
);
export const CalculateViewportLoadPageCount = createSelector<number>(
  [ViewportSkipValue, ViewportTakeValue, PageSize, ViewportPageIndex],
  (skip: number, take: number, pageSize, viewportPageIndex: number) => {
    const pSize = getNormalizedPageSize(pageSize);
    const pageOffset = viewportPageIndex * pSize;
    const skipForCurrentPage = skip - pageOffset;
    return Math.ceil(pageSize > 0 ? (take + skipForCurrentPage) / pageSize : 0);
  },
);
