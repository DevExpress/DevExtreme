import type { LoadResult } from '@js/common/data';
import type { FilterDescriptor, LoadOptions, SelectDescriptor } from '@js/common/data.types';
import type { DeferredObj } from '@js/core/utils/deferred';
import type { Cancelable } from '@js/events';
import type DeferredStrategy from '@ts/ui/selection/m_selection.strategy.deferred';
import type StandardStrategy from '@ts/ui/selection/m_selection.strategy.standard';

export type SelectionFilter = FilterDescriptor[];

type Filter = () => SelectionFilter | undefined;
export interface SelectionItem {
  disabled?: boolean;
  loadIndex: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Sensitivity = 'case' | 'base' | 'variant' | any;

export type KeyExpr = string | string[];
export type KeyHash = string | number | symbol;

interface SelectionChangeEvent<TItem, TKey> {
  selectedItems: TItem[];
  selectedItemKeys: TKey[];
  addedItemKeys: TKey[];
  removedItemKeys: TKey[];
  addedItems: TItem[];
  removedItems: TItem[];
}

export interface PendingOptions { checkPending?: boolean }

export interface DefaultOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
  TDeferred extends boolean = boolean,
> {
  onSelectionChanged: (event: SelectionChangeEvent<TItem, TKey>) => void;
  key: () => KeyExpr | ((source: TItem) => TKey) | undefined;
  keyOf: (item: TItem) => TKey;
  load: (loadOptions: LoadOptions<TItem>) => DeferredObj<LoadResult<TItem>>;
  totalCount: () => number;
  isSelectableItem: (item: TItem) => boolean;
  isItemSelected: (arg: TItem | TKey, options?: PendingOptions) => boolean;
  getItemData: (item: TItem) => TItem;
  dataFields: () => SelectDescriptor<TItem> | undefined;
  filter: Filter;
  allowNullValue: boolean;
  deferred: TDeferred;
  equalByReference: boolean;
  mode: string;
  selectedItems: TItem[];
  selectionFilter: SelectionFilter;
  maxFilterLengthInRequest: number;
}

export type SelectionOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
  TDeferred extends boolean = boolean,
> = DefaultOptions<TItem, TKey, TDeferred> & {
  selectedKeys: TKey[];
  selectedItemKeys: TKey[];
  plainItems: (cached?: boolean) => TItem[];
  isVirtualPaging?: boolean;
  sensitivity?: Sensitivity;
  allowLoadByRange?: () => boolean | undefined;
  alwaysSelectByShift?: boolean;
  getLoadOptions?: (
    loadItemIndex: number,
    focusedItemIndex: number,
    shiftItemIndex?: number
  ) => LoadOptions;
  addedItemKeys: TKey[];
  removedItemKeys: TKey[];
  addedItems: TItem[];
  removedItems: TItem[];
  onSelectionChanging: (event: SelectionChangeEvent<TItem, TKey> & Cancelable) => void;
  keyHashIndices: {
    [keyHash: KeyHash]: number[];
  };
  ignoreDisabledItems?: boolean;
  disabledItemKeys: TKey[];
};

interface SelectionStrategyOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
> {
  disabledItemKeys: TKey[];
  addedItemKeys: TKey[];
  removedItemKeys: TKey[];
  addedItems: TItem[];
  removedItems: TItem[];
  onSelectionChanging?: (event: SelectionChangeEvent<TItem, TKey> & Cancelable) => void;
  keyHashIndices: {
    [keyHash: KeyHash]: number[];
  } | null;
}

export type StrategyOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
  TDeferred extends boolean = boolean,
> = SelectionStrategyOptions<TItem, TKey> & SelectionOptions<TItem, TKey, TDeferred>;

export type SelectionStrategy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends string | number = any,
  TDeferred extends boolean = boolean,
> = TDeferred extends true
  ? DeferredStrategy<TItem, TKey>
  : StandardStrategy<TItem, TKey>;

export type ClearedFilterItem = object;

export type RemoteFilterItem = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: any;
} & ClearedFilterItem;

export type RemoteFilter = SelectionFilter | RemoteFilterItem | RemoteFilterItem[];

export interface QueryParams {
  langParams: {
    collatorOptions: {
      sensitivity: Sensitivity;
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RequestItems<TItem extends SelectionItem = any, TKey = any> {
  added: (TItem | TKey)[];
  removed: (TItem | TKey)[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface RequestData<TItem extends SelectionItem = any, TKey = any> {
  addedItems: (TItem | TKey)[];
  removedItems: (TItem | TKey)[];
  keys: TKey[];
}
