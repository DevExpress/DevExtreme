import type { PagingChanges, PagingDataSource, SyncPagingOptions } from '../types';

export function resolvePaginate(
  enabled: boolean | undefined,
  scrollingMode: string | undefined,
): boolean | undefined {
  if (enabled === undefined) {
    return undefined;
  }

  return enabled || scrollingMode === 'virtual' || scrollingMode === 'infinite';
}

export function syncPaging(
  dataSource: PagingDataSource,
  options: SyncPagingOptions,
): PagingChanges {
  const { paginate, pageIndex, pageSize } = options;
  const isPaginateChanged = paginate !== undefined && dataSource.paginate() !== paginate;

  if (isPaginateChanged) {
    dataSource.paginate(paginate);
  }

  // Must be compared after dataSource.paginate: while paginate is off,
  // the adapter's pageSize() reports 0 rather than the real page size.
  const isPageSizeChanged = pageSize !== undefined && dataSource.pageSize() !== pageSize;

  if (isPageSizeChanged) {
    dataSource.pageSize(pageSize);
  }

  // Must be compared after dataSource.paginate: paginate() resets pageIndex to 0,
  // and this comparison has to see the reset value so the target page gets restored.
  const isPageIndexChanged = pageIndex !== undefined && dataSource.pageIndex() !== pageIndex;

  if (isPageIndexChanged) {
    dataSource.pageIndex(pageIndex);
  }

  return {
    hasChanges: isPaginateChanged || isPageSizeChanged || isPageIndexChanged,
    isPaginateChanged,
    isPageSizeChanged,
    isPageIndexChanged,
  };
}
