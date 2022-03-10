import {
  createValue, createGetter, createSelector,
} from '../../../../utils/plugin/context';
import { Row, ScrollingMode } from '../types';
import {
  VisibleRows, TotalCount,
} from '../data_grid_light';
import { RowsViewHeightValue } from '../views/table_content';
import {
  PageIndex, PageSize,
} from '../paging/plugins';
import { ScrollOffset } from '../../../scroll_view/common/types';
import { calculateViewportItemIndex } from './utils';

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
    const topIndex = calculateViewportItemIndex(topScrollPosition, rowHeight, itemHeights);
    const viewportItemCount = calculateViewportItemIndex(topScrollPosition + viewportHeight,
      rowHeight, itemHeights);
    const bottomIndex = Math.ceil(viewportItemCount) + topIndex;
    let take = Math.ceil(bottomIndex - skip);

    if (virtualMode) {
      const remainedItems = Math.max(0, totalItemsCount - skip);
      take = Math.min(take, remainedItems);
    }

    return take;
  },
);
export const ExtendVisibleRows = createSelector<Row[]>(
  [VisibleRows, PageIndex, PageSize],
  (visibleRows: Row[], pageIndex: number, pageSize) => {
    const pSize = typeof pageSize !== 'number' ? 0 : pageSize;
    let loadIndex = pageIndex * pSize - 1;

    return visibleRows.map((row) => {
      const r = row;
      if (row.rowType === 'data') {
        loadIndex += 1;
      }
      r.loadIndex = loadIndex;
      return r;
    });
  },
);
export const CalculateVisibleRows = createSelector<Row[]>(
  [VisibleRows, ViewportSkipValue, ViewportTakeValue],
  (visibleRows: Row[], skip: number, take: number) => visibleRows.filter((row) => {
    const isLoadIndexGreaterStart = row.loadIndex !== undefined && row.loadIndex >= skip;
    const isLoadIndexLessEnd = row.loadIndex !== undefined && row.loadIndex < skip + take;

    return isLoadIndexGreaterStart && isLoadIndexLessEnd;
  }),
);
export const CalculateTopVirtualRowHeight = createSelector<number>(
  [ViewportSkipValue, RowHeightValue],
  (skip: number, rowHeight: number) => skip * rowHeight,
);
export const CalculateBottomVirtualRowHeight = createSelector<number>(
  [ViewportSkipValue, ViewportTakeValue, TotalCount, RowHeightValue],
  (
    skip: number, take: number,
    totalCount: number, rowHeight: number,
  ) => (totalCount - skip - take) * rowHeight,
);
