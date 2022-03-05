import { createValue, createSelector } from '../../../../utils/plugin/context';
import { TotalCount, VisibleItems } from '../data_grid_next';
import type { RowData } from '../types';

export const PageIndex = createValue<number>();
export const SetPageIndex = createValue<(pageIndex: number) => void>();
export const PageSize = createValue<number | 'all'>();
export const SetPageSize = createValue<(pageSize: number | 'all') => void>();
export const PagingEnabled = createValue<boolean>();

export const PageCount = createSelector(
  [TotalCount, PageSize],
  (totalCount, pageSize) => {
    if (pageSize === 'all') {
      return 1;
    }
    return Math.ceil(totalCount / pageSize);
  },
);

export const CalculateVisibleItems = createSelector(
  [VisibleItems, PagingEnabled, PageIndex, PageSize],
  (visibleItems: RowData[], pagingEnabled, pageIndex, pageSize) => {
    if (!pagingEnabled || pageSize === 'all') {
      return visibleItems;
    }

    const start = (pageIndex as number) * (pageSize as number);
    const end = start + (pageSize as number);

    return visibleItems.slice(start, end);
  },
);
