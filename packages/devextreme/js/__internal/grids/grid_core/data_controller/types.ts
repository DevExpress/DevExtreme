export interface SyncPagingOptions {
  paginate?: boolean;
  pageSize?: number;
  pageIndex?: number;
}

export interface PagingChanges {
  hasChanges: boolean;
  isPaginateChanged: boolean;
  isPageSizeChanged: boolean;
  isPageIndexChanged: boolean;
}

/**
 * Either a raw DataSource or a DataSourceAdapter — the two are not
 * interchangeable: the adapter's `pageSize()` returns 0 while paginate is off,
 * and its `pageIndex()` is routed through virtual scrolling.
 */
export interface PagingDataSource {
  paginate: (value?: boolean) => boolean | undefined;
  pageSize: (value?: number) => number | undefined;
  pageIndex: (value?: number) => number | undefined;
  requireTotalCount: (value?: boolean) => boolean | undefined;
}
