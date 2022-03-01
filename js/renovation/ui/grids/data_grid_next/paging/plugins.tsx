import { createValue, createSelector } from '../../../../utils/plugin/context';
import {
  TotalCount, LocalVisibleItems, LoadOptionsValue, RemoteOperations,
} from '../data_grid_next';
import type { RowData } from '../types';
import type { LoadOptions } from '../../../../../data';

export const PageIndex = createValue<number>();
export const SetPageIndex = createValue<(pageIndex: number) => void>();
export const PageSize = createValue<number | 'all'>();
export const SetPageSize = createValue<(pageSize: number | 'all') => void>();
export const PagingEnabled = createValue<boolean>();
export const LoadPageCount = createValue<number>();
export const SetLoadPageCount = createValue<(loadPageCount: number) => void>();

export const PageCount = createSelector(
  [TotalCount, PageSize],
  (totalCount, pageSize) => {
    if (pageSize === 'all') {
      return 1;
    }
    return Math.ceil(totalCount / pageSize);
  },
);

export const ApplyPagingToVisibleItems = createSelector(
  [LocalVisibleItems, PagingEnabled, PageIndex, PageSize],
  (visibleItems: RowData[] | undefined, pagingEnabled: boolean, pageIndex: number, pageSize: number | 'all') => {
    if (!pagingEnabled || pageSize === 'all' || visibleItems === undefined) {
      return visibleItems;
    }

    const start = pageIndex * pageSize;
    const end = start + pageSize;

    return visibleItems.slice(start, end);
  },
);

export const AddPagingToLoadOptions = createSelector(
  [LoadOptionsValue, PagingEnabled, PageIndex, PageSize, RemoteOperations],
  (loadOptionsValue: LoadOptions, pagingEnabled, pageIndex, pageSize, remoteOperations) => {
    if (!pagingEnabled || pageSize === 'all' || !remoteOperations) {
      return loadOptionsValue;
    }

    return {
      ...loadOptionsValue,
      skip: pageIndex * pageSize,
      take: pageSize,
      requireTotalCount: true,
    };
  },
);
