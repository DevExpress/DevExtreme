import type { LoadResult } from '@js/common/data';
import type { LoadOptions } from '@js/common/data.types';
import type { DeferredObj } from '@js/core/utils/deferred';
import type DeferredStrategy from '@ts/ui/selection/m_selection.strategy.deferred';
import type StandardStrategy from '@ts/ui/selection/m_selection.strategy.standard';

// export type SelectionFilter = string | Array<any> | Function;
export type SelectionFilter = Function;
// export type SelectionItem = any;
export interface SelectionItem {
  disabled?: boolean;
  loadIndex: number;
}

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
  key: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyOf: (item: any) => any;
  load: (loadOptions: LoadOptions) => DeferredObj<LoadResult<TItem>>;
  //   load: (loadOptions: LoadOptions) => DeferredObj<TItem[]>;
  //   load: (loadOptions: LoadOptions) => DeferredObj<unknown>;
  totalCount: () => number;
  isSelectableItem: (item: TItem) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isItemSelected: (arg: any, options?: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemData: (item: TItem) => any;
  dataFields: () => void;
  filter: SelectionFilter;
  allowNullValue: boolean;
  deferred: TDeferred;
  equalByReference: boolean;
  mode: string;
  selectedItems: TItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectionFilter: any[];
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
  //   plainItems: (cached?: boolean) => TItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plainItems: (cached?: boolean) => any[];
  isVirtualPaging?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sensitivity: 'case' | 'base' | 'variant' | any;
  allowLoadByRange?: () => boolean | undefined;
  alwaysSelectByShift?: boolean;
  getLoadOptions: (loadItemIndex, focusedItemIndex, shiftItemIndex) => LoadOptions;
  addedItemKeys: TKey[];
  removedItemKeys: TKey[];
  addedItems: TItem[];
  removedItems: TItem[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectionChanging: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyHashIndices: any;
  ignoreDisabledItems?: boolean;
  disabledItemKeys: TKey[];
};

export type SelectionStrategy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends SelectionItem = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
  TDeferred extends boolean = boolean,
> = TDeferred extends true
  ? DeferredStrategy<TItem, TKey>
  : StandardStrategy<TItem, TKey>;
