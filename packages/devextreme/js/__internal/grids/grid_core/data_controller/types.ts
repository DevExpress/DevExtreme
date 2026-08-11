import type { DataSource } from '@js/common/data';
import type { SearchOperation } from '@js/common/data.types';
import type { ScalarFilterValue } from '@js/common/grids';
import type { DeferredObj } from '@js/core/utils/deferred';

import type { Column } from '../columns_controller/types';
import type { ChangedEvent, OperationTypes, RawItemData } from '../data_source_adapter/types';

/** rows */

export interface ItemProcessingOptions {
  visibleColumns: Column[];
  dataIndex: number;
  rowIndex?: number;
  detailColumnIndex?: number;
  isDeferredSelection?: boolean;
}

export type RowUpdate = (row?: ProcessedItem, keepRow?: boolean) => void;

export type RowWatch = (
  getter: (data: RawItemData) => unknown,
  updateValue: (value: unknown) => void,
  updateRow?: (row: ProcessedItem) => void,
) => () => void;

export interface Cell {
  column?: Column;
  update?: RowUpdate;
}

export interface GeneratedItem {
  rowType: 'data' | 'group' | 'groupFooter' | 'detailAdaptive' | 'detail';
  data: RawItemData;
  key: unknown;
  isEditing?: boolean;
  isNewRow?: boolean;
  modified?: boolean;
  oldData?: RawItemData;
  modifiedValues?: unknown[];
  removed?: boolean;
}

export interface ProcessedItem extends GeneratedItem {
  values: unknown[];
  oldValues?: unknown[];
  dataIndex?: number;
  isSelected?: boolean;
  visible?: boolean;
  isExpanded?: boolean;
  loadIndex?: number;
  rowIndex?: number;
  cells?: Cell[];
  summaryCells?: unknown[];
  update?: RowUpdate;
  watch?: RowWatch;
}

/** changes */

export type RowChangeType = 'update' | 'insert' | 'remove';

export type RowOperation = RowChangeType | 'replace';

interface DataChangeBase {
  isFirstRender?: boolean;
  repaintChangesOnly?: boolean;
  needUpdateDimensions?: boolean;
  isDataChanged?: boolean;
  operationTypes?: OperationTypes | null;
  items?: ProcessedItem[];
  changes?: unknown[];
  cancel?: boolean;
  isLiveUpdate?: boolean;
}

export interface UpdateChange extends DataChangeBase {
  changeType: 'update';
  rowIndices: number[];
  changeTypes?: RowChangeType[];
  columnIndices?: (number[] | undefined)[];
  isFullUpdate?: boolean;
  allowInvisibleRowIndices?: boolean;
}

interface SelectionChange extends DataChangeBase {
  changeType: 'updateSelection';
  itemIndexes: number[];
}

interface FocusedRowChange extends DataChangeBase {
  changeType: 'updateFocusedRow';
  focusedRowKey: unknown | null;
}

export type DataChange = | UpdateChange
  | SelectionChange
  | FocusedRowChange
  | (DataChangeBase & ChangedEvent)
  | (DataChangeBase & { changeType: 'refresh' })
  | (DataChangeBase & { changeType: 'pageIndex' })
  | (DataChangeBase & { changeType: 'loadingAll' })
  | (DataChangeBase & { changeType: 'refresh', isLiveUpdate: boolean; isOptionChanged: boolean })
  | (DataChangeBase & { changeType: 'refresh', event: unknown; virtualColumnsScrolling: boolean })
  | (DataChangeBase & { changeType: 'refresh', useProcessedItemsCache: boolean; cancelEmptyChanges: boolean });

export type ChangedRows = Required<
  Pick<UpdateChange, 'items' | 'rowIndices' | 'changeTypes' | 'columnIndices'>
>;

export interface ChangedRow {
  changeType: RowChangeType;
  rowIndex: number;
  item?: ProcessedItem;
  columnIndices?: number[];
}

/** data source */

export interface DataSourceAdapterLike {
  _dataSource: DataSource;
}

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

export type DataFilterPredicate = (data: RawItemData) => boolean;

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
