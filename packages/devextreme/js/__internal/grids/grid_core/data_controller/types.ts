import type { DataSource } from '@js/common/data';
import type { SearchOperation } from '@js/common/data.types';
import type { ScalarFilterValue } from '@js/common/grids';
import type { DeferredObj } from '@js/core/utils/deferred';

import type { ChangedEvent, OperationTypes } from '../data_source_adapter/types';

/** data */

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

interface DataChangeBase {
  isFirstRender?: boolean;
  repaintChangesOnly?: boolean;
  needUpdateDimensions?: boolean;
  isDataChanged?: boolean;
  operationTypes?: OperationTypes | null;
  items?: unknown[];
  changes?: unknown[];
  cancel?: boolean;
  isLiveUpdate?: boolean;
}

interface SelectionChange extends DataChangeBase {
  changeType: 'updateSelection';
  itemIndexes: number[];
}

interface FocusedRowChange extends DataChangeBase {
  changeType: 'updateFocusedRow';
  focusedRowKey: unknown | null;
}

interface UpdateChange extends DataChangeBase {
  changeType: 'update';
  rowIndices: number[];
  isFullUpdate?: boolean;
  allowInvisibleRowIndices?: boolean;
}

export type DataChange = | UpdateChange
  | SelectionChange
  | FocusedRowChange
  | (DataChangeBase & ChangedEvent)
  | (DataChangeBase & { changeType: 'refresh' })
  | (DataChangeBase & { changeType: 'pageIndex' })
  | (DataChangeBase & { changeType: 'refresh', isLiveUpdate: boolean; isOptionChanged: boolean })
  | (DataChangeBase & { changeType: 'refresh', event: unknown; virtualColumnsScrolling: boolean })
  | (DataChangeBase & { changeType: 'refresh', useProcessedItemsCache: boolean; cancelEmptyChanges: boolean });

/** callbacks */

export interface CallbackFlags {
  stopOnFalse: boolean;
}

/** paging */

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

export type PagingOptionName = 'pageIndex' | 'pageSize';

export type PagingResult = number | DeferredObj<unknown> | Promise<unknown>;

/** filter */

export type FilterCombiner = 'and' | 'or';

/**
 * The operator may be omitted — `=` is implied. Only data layer operations
 * are allowed here: column operations such as `between` or `anyof` belong to
 * `filterValue` and are expanded into these before they reach the store.
 */
export type BinaryDataFilterExpression = [string, ScalarFilterValue]
  | [string, SearchOperation, ScalarFilterValue];

/**
 * A binary expression, a negation, or a group of expressions.
 * The combiner between neighbors may be omitted — `and` is implied.
 */
export type DataFilterExpression = BinaryDataFilterExpression
  | ['!', DataFilterExpression]
  | [DataFilterExpression, ...(FilterCombiner | DataFilterExpression)[]];

export type DataFilterPredicate = (data: UserData) => boolean;

/**
 * The grid-internal "match nothing" filter. Not a data layer filter expression:
 * the data controller intercepts it and resolves the load with an empty result.
 */
export type MatchNothingFilter = ['!'];

export type DataFilter = DataFilterExpression
  | DataFilterPredicate
  | MatchNothingFilter
  | null
  | undefined;
