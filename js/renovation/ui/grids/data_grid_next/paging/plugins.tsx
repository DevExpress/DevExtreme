import { createValue, createSelector } from '../../../../utils/plugin/context';
import {
  TotalCount, LocalVisibleItems, LoadOptionsValue, RemoteOperations, LocalDataState,
} from '../plugins';
import type { RowData, DataState } from '../types';
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
  [LocalVisibleItems, PagingEnabled, PageIndex, PageSize, LoadPageCount],
  (
    visibleItems: RowData[] | undefined, pagingEnabled: boolean, pageIndex: number,
    pageSize: number | 'all', loadPageCount: number,
  ) => {
    if (!pagingEnabled || pageSize === 'all' || visibleItems === undefined) {
      return visibleItems;
    }

    const start = pageIndex * pageSize;
    const end = start + pageSize * loadPageCount;

    return visibleItems.slice(start, end);
  },
);

export const AddPagingToLoadOptions = createSelector(
  [LoadOptionsValue, PagingEnabled, PageIndex, PageSize, LoadPageCount, RemoteOperations],
  (
    loadOptionsValue: LoadOptions, pagingEnabled,
    pageIndex, pageSize, loadPageCount, remoteOperations,
  ) => {
    if (!pagingEnabled || pageSize === 'all' || !remoteOperations) {
      return loadOptionsValue;
    }

    return {
      ...loadOptionsValue,
      skip: pageIndex * pageSize,
      take: pageSize * loadPageCount,
      requireTotalCount: true,
    };
  },
);

export const AddPagingToLocalDataState = createSelector(
  [LocalDataState, PageIndex, PageSize],
  (
    localState: DataState,
    pageIndex: number,
    pageSize: number,
  ) => {
    const state = localState !== undefined ? {
      ...localState,
      dataOffset: pageIndex * pageSize,
    } : undefined;

    return state;
  },
);
