import type { DeferredObj } from '@js/core/utils/deferred';

import type { Column } from '../columns_controller/types';
import type { ChangedEvent, OperationTypes, RawItemData } from '../data_source_adapter/types';

/** rows */

export interface RefreshOptions {
  load?: boolean;
  reload?: boolean;
  changesOnly?: boolean;
  lookup?: boolean;
  selection?: boolean;
  allowCancelEditing?: boolean;
  isPageChanged?: boolean;
}

export interface UserState {
  pageIndex: number;
  pageSize: number;
  searchText?: string;
  expandedRowKeys?: unknown[];
}

export interface ItemProcessingOptions<TColumn extends Column = Column> {
  visibleColumns: TColumn[];
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
  isEditing?: boolean;
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

type LoadAllItemsCallback = (items: ProcessedItem[], totalAggregates?: unknown[]) => void;

export type LoadAllItemsDeferred = Omit<DeferredObj<ProcessedItem[]>, 'done' | 'resolve'> & {
  done: (callback: LoadAllItemsCallback) => LoadAllItemsDeferred;
  resolve: LoadAllItemsCallback;
};

/** changes */

export type RowChangeType = 'update' | 'insert' | 'remove';

export type RowOperation = RowChangeType | 'replace';

export interface DataChangeBase {
  isFirstRender?: boolean;
  repaintChangesOnly?: boolean;
  needUpdateDimensions?: boolean;
  isDataChanged?: boolean;
  operationTypes?: OperationTypes | null;
  items?: ProcessedItem[];
  changes?: unknown[];
  cancel?: boolean;
  isLiveUpdate?: boolean;
  totalColumnIndices?: number[];
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
  | (DataChangeBase & { changeType: 'append' | 'prepend' })
  | (DataChangeBase & { changeType: 'pageIndex' })
  | (DataChangeBase & { changeType: 'loadingAll' })
  | (DataChangeBase & { changeType: 'refresh', isLiveUpdate: boolean; isOptionChanged: boolean })
  | (DataChangeBase & { changeType: 'refresh', event: unknown; virtualColumnsScrolling: boolean })
  | (DataChangeBase & { changeType: 'refresh', useProcessedItemsCache: boolean; cancelEmptyChanges: boolean });

export interface UpdateItemChange {
  changeType: RowChangeType;
  rowIndex: number;
  item?: ProcessedItem;
  columnIndices?: number[];
}

export type GetUpdatedColumnIndices = (
  oldItem: ProcessedItem,
  newItem: ProcessedItem,
  visibleRowIndex: number,
  isLiveUpdate?: boolean,
) => number[] | undefined;

export interface ItemChangeOptions {
  rowIndexDelta: number;
  isPartialUpdate: boolean;
  isLiveUpdate?: boolean;
}

export interface ItemOperationOptions extends ItemChangeOptions {
  newItems: ProcessedItem[];
}

export type RowIndexByKey = Record<string, number | undefined>;

export type RowIndexCorrection = (rowIndex: number) => number;

export type ItemChange = | { type: 'insert'; index: number; data: ProcessedItem }
  | { type: 'update'; index: number; data: ProcessedItem; oldItem: ProcessedItem }
  | { type: 'remove'; index: number; oldItem: ProcessedItem }
  | { type: 'replace'; index: number; data: ProcessedItem }
  | { type: 'updateVisibility'; index: number; data: ProcessedItem };

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
