import type { LoadResult } from '@js/common/data';
import type { LoadOptions } from '@js/common/data.types';
import type { DeferredObj } from '@js/core/utils/deferred';
import type DeferredStrategy from '@ts/ui/selection/m_selection.strategy.deferred';
import type StandardStrategy from '@ts/ui/selection/m_selection.strategy.standard';

// type PlainKey = string | number | symbol;
// interface ComplexKey {
//   [key: string]: PlainKey;
// }
// export type Key = PlainKey | ComplexKey;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FilterItem<TKey = any> = string | TKey | FilterItem<TKey>[];
// type FilterItem<TKey = any> = string | TKey;

// type PlainSelectionFilter<TKey = any> = FilterItem<TKey>[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SelectionFilter<TKey = any> = FilterItem<TKey>[];
// export type SelectionFilter<TKey=any> = PlainSelectionFilter<TKey>|PlainSelectionFilter<TKey>[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Filter<TKey = any> = () => SelectionFilter<TKey> | undefined;
export interface SelectionItem {
  disabled?: boolean;
  loadIndex: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Sensitivity = 'case' | 'base' | 'variant' | any;

export type KeyExpr = string | string[];

export interface DefaultOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
  TDeferred extends boolean = boolean,
> {
  onSelectionChanged: (args: {
    selectedItems: TItem[];
    selectedItemKeys: TKey[];
    addedItemKeys: TKey[];
    removedItemKeys: TKey[];
    addedItems: TItem[];
    removedItems: TItem[];
  }) => void;
  key: () => KeyExpr | Function | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyOf: (item: TItem) => any;
  load: (loadOptions: LoadOptions<TItem>) => DeferredObj<LoadResult<TItem>>;
  totalCount: () => number;
  isSelectableItem: (item: TItem) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isItemSelected: (arg: any, options?: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemData: (item: TItem) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataFields: () => any | undefined;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plainItems: (cached?: boolean) => any[];
  isVirtualPaging?: boolean;

  sensitivity: Sensitivity;
  allowLoadByRange?: () => boolean | undefined;
  alwaysSelectByShift?: boolean;
  getLoadOptions: (loadItemIndex, focusedItemIndex, shiftItemIndex) => LoadOptions;
  addedItemKeys: TKey[];
  removedItemKeys: TKey[];
  addedItems: TItem[];
  removedItems: TItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectionChanging: (e: any) => void;
  keyHashIndices: {
    [keyHash: string | number | symbol]: number[];
  };
  ignoreDisabledItems?: boolean;
  disabledItemKeys: TKey[];
};

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
export type ClearedFilter = SelectionFilter | ClearedFilterItem | ClearedFilterItem[];

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
