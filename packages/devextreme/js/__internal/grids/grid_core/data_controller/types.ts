import type { DataSource } from '@js/common/data';
import type { DeferredObj } from '@js/core/utils/deferred';

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

export interface DataSourceAdapterLike {
  _dataSource: DataSource;
}

export type UserData = Record<string, unknown>;

export interface Item {
  rowType: 'data' | 'group' | 'groupFooter' | 'detailAdaptive';
  data: UserData;
  key: unknown;
  oldData?: UserData;
  dataIndex?: number;
  values?: unknown[];
  visible?: boolean;
  isExpanded?: boolean;
  isNewRow?: boolean;
  summaryCells?: unknown[];
  rowIndex?: number;
  cells?: unknown[];
  loadIndex?: number;
  isSelected?: boolean;
  removed?: boolean;
}

export type FilterExpression = ((data: UserData) => boolean) | unknown[];

export type Filter = FilterExpression | null | undefined;

export interface HandleDataChangedArguments {
  changeType?: 'refresh' | 'update' | 'loadError';
  isDelayed?: boolean;
  isLiveUpdate?: boolean;
  error?: unknown;
}

export interface DataChange {
  [field: string]: unknown;
  changeType?: string;
  repaintChangesOnly?: boolean;
  itemIndexes?: number[];
}

export type PagingOptionName = 'pageIndex' | 'pageSize';

export type PagingResult = number | DeferredObj<unknown> | Promise<unknown>;

export interface CallbackFlags {
  stopOnFalse: boolean;
}
