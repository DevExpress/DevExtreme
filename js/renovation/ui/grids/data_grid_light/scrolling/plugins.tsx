import {
  createValue, createGetter, createSelector,
} from '../../../../utils/plugin/context';
import { ViewportParamsProps, Row, ScrollingMode } from '../types';
import {
  VisibleRows, TotalCount,
} from '../data_grid_light';
import { RowsViewHeightValue } from '../views/table_content';
import {
  PageIndex, PageSize,
} from '../paging/plugins';
import { ScrollOffset } from '../../../scroll_view/common/types';

export const ROW_HEIGHT = 34;

export const ScrollingModeValue = createValue<ScrollingMode>();
export const ScrollingPositionValue = createValue<ScrollOffset>();
export const ViewportParamsValue = createGetter<ViewportParamsProps>({ skip: 0, take: 0 });
export const CalculateViewportParams = createSelector<ViewportParamsProps>(
  [ScrollingModeValue, TotalCount, RowsViewHeightValue, ScrollingPositionValue],
  (scrollingMode, totalCount, rowsViewHeight, scrollingPosition: ScrollOffset) => {
    const virtualMode = scrollingMode === 'virtual';
    const totalItemsCount = totalCount ?? 0;
    const viewportHeight = rowsViewHeight ?? 0;
    const topScrollPosition = scrollingPosition?.top ?? 0;
    const topIndex = topScrollPosition / ROW_HEIGHT;
    const bottomIndex = Math.ceil(viewportHeight / ROW_HEIGHT) + topIndex;
    const skip = Math.floor(topIndex);
    let take = Math.ceil(bottomIndex - skip);

    if (virtualMode) {
      const remainedItems = Math.max(0, totalItemsCount - skip);
      take = Math.min(take, remainedItems);
    }

    return { skip, take };
  },
);
export const ExtendVisibleRows = createSelector<Row[]>(
  [VisibleRows, PageIndex, PageSize],
  (visibleRows: Row[], pageIndex: number, pageSize) => {
    const pSize = typeof pageSize !== 'number' ? 0 : pageSize;
    let loadIndex = pageIndex * pSize - 1;

    visibleRows.forEach((row) => {
      const r = row;
      if (row.rowType === 'data') {
        loadIndex += 1;
      }
      r.loadIndex = loadIndex;
    });

    return visibleRows;
  },
);
export const CalculateVisibleRows = createSelector<Row[]>(
  [VisibleRows, ViewportParamsValue],
  (visibleRows: Row[], viewportParams: ViewportParamsProps) => visibleRows.filter((row) => {
    const { skip, take } = viewportParams;
    const isLoadIndexGreaterStart = row.loadIndex !== undefined && row.loadIndex >= skip;
    const isLoadIndexLessEnd = row.loadIndex !== undefined && row.loadIndex < skip + take;

    return isLoadIndexGreaterStart && isLoadIndexLessEnd;
  }),
);
