import type { LoadResult } from '@js/common/data';
import { noop } from '@js/core/utils/common';
import { Deferred, type DeferredObj, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isPlainObject } from '@js/core/utils/type';

import DeferredStrategy from './m_selection.strategy.deferred';
import StandardStrategy from './m_selection.strategy.standard';
import type {
  DefaultOptions,
  SelectionFilter,
  SelectionItem,
  SelectionOptions,
  SelectionStrategy,
} from './types';
// import DeferredStrategy from '@ts/ui/selection/m_selection.strategy.deferred';
// import StandardStrategy from '@ts/ui/selection/m_selection.strategy.standard';
// import type { SelectionOptions, SelectionStrategy, DefaultOptions, SelectionItem } from '@ts/ui/selection/types';

export default class Selection<TItem extends SelectionItem = any, TKey extends string | number = any, TDeferred extends boolean = boolean> {
  options: SelectionOptions<TItem, TKey, TDeferred>;

  _selectionStrategy: SelectionStrategy<TItem, TKey, TDeferred>;
  // _selectionStrategy: DeferredStrategy<TItem, TKey> | StandardStrategy<TItem, TKey>;

  _focusedItemIndex: number;

  _shiftFocusedItemIndex?: number;

  constructor(options: Partial<SelectionOptions<TItem, TKey, TDeferred>>) {
    this.options = extend(this._getDefaultOptions(), options, {
      selectedItemKeys: options.selectedKeys ?? [],
    });

    this._selectionStrategy = (this.options.deferred
      ? new DeferredStrategy(this.options)
      : new StandardStrategy(this.options)) as SelectionStrategy<TItem, TKey, TDeferred>;

    this._focusedItemIndex = -1;

    if (!this.options.equalByReference) {
      this._selectionStrategy.updateSelectedItemKeyHash(this.options.selectedItemKeys);
    }
  }

  _getDefaultOptions(): DefaultOptions<TItem, TKey, false> {
    return {
      allowNullValue: false,
      deferred: false,
      equalByReference: false,
      mode: 'multiple',
      selectedItems: [],
      selectionFilter: [],
      maxFilterLengthInRequest: 0,
      onSelectionChanged: noop,
      key() { return undefined; },
      keyOf(item) { return item; },
      load() { return Deferred<TItem[]>().resolve([]); },
      totalCount() { return -1; },
      isSelectableItem() { return true; },
      isItemSelected() { return false; },
      getItemData(item) { return item; },
      dataFields: noop,
      filter() { return undefined; },
    };
  }

  validate(): void {
    this._selectionStrategy.validate();
  }

  // getSelectedItemKeys(): Promise<LoadResult<TKey>>
  // getSelectedItemKeys(): TKey[]
  // getSelectedItemKeys(): TDeferred extends true ? Promise<LoadResult<TKey>> : TKey[] {
  getSelectedItemKeys(): TDeferred extends true ? Promise<LoadResult<TKey>> : TKey[] {
  // getSelectedItemKeys(): Promise<LoadResult<TKey>> | TKey[] {
  // getSelectedItemKeys() {
    return this._selectionStrategy.getSelectedItemKeys() as TDeferred extends true ? Promise<LoadResult<TKey>> : TKey[];
  }

  // getSelectedItems() {
  getSelectedItems(): TDeferred extends true ? Promise<LoadResult<TItem>> : TItem[] {
    return this._selectionStrategy.getSelectedItems() as TDeferred extends true ? Promise<LoadResult<TItem>> : TItem[];
  }

  selectionFilter(value?: any): SelectionFilter | undefined {
    if (value === undefined) {
      return this.options.selectionFilter;
    }

    const filterIsChanged = this.options.selectionFilter !== value && JSON.stringify(this.options.selectionFilter) !== JSON.stringify(value);

    this.options.selectionFilter = value;

    filterIsChanged && this.onSelectionChanged();

    return undefined;
  }

  setSelection(keys: TKey[], updatedKeys?: TKey[]) {
    return this.selectedItemKeys(keys, false, false, false, updatedKeys);
  }

  select(keys: TKey[]) {
    return this.selectedItemKeys(keys, true);
  }

  deselect(keys: TKey[]) {
    return this.selectedItemKeys(keys, true, true);
  }

  selectedItemKeys(
    keys: TKey[],
    preserve?: boolean,
    isDeselect?: boolean,
    isSelectAll?: boolean,
    updatedKeys?: TKey[],
  ): DeferredObj<unknown> {
    const that = this;

    keys = keys ?? [];
    keys = Array.isArray(keys) ? keys : [keys];
    that.validate();

    return this._selectionStrategy.selectedItemKeys(keys, preserve, isDeselect, isSelectAll, updatedKeys);
  }

  clearSelection(): DeferredObj<unknown> {
    return this.selectedItemKeys([]);
  }

  _addSelectedItem(itemData: TItem, key: TKey): void {
    const { deferred } = this.options;
    this._selectionStrategy.addSelectedItem(key, deferred ? !!itemData : itemData);
  }

  _removeSelectedItem(key: TKey): void {
    this._selectionStrategy.removeSelectedItem(key);
  }

  _setSelectedItems(keys: TKey[], items: TItem[]): void {
    this._selectionStrategy.setSelectedItems(keys, items);
  }

  onSelectionChanged(): void {
    this._selectionStrategy.onSelectionChanged();
  }

  changeItemSelection(
    itemIndex: number,
    keys: { control?: boolean; shift?: boolean },
    setFocusOnly?: boolean,
  ): boolean | undefined {
    let isSelectedItemsChanged;
    const items = this.options.plainItems();
    const item = items[itemIndex];
    let deferred;
    const { isVirtualPaging } = this.options;
    const allowLoadByRange = this.options.allowLoadByRange?.();
    const { alwaysSelectByShift } = this.options;
    let indexOffset;
    let focusedItemNotInLoadedRange = false;
    let shiftFocusedItemNotInLoadedRange = false;

    const itemIsNotInLoadedRange = (index) => index >= 0 && !items.filter((it) => it.loadIndex === index).length;

    if (isVirtualPaging && isDefined(item)) {
      if (allowLoadByRange) {
        indexOffset = item.loadIndex - itemIndex;
        itemIndex = item.loadIndex;
      }
      focusedItemNotInLoadedRange = itemIsNotInLoadedRange(this._focusedItemIndex);
      if (isDefined(this._shiftFocusedItemIndex)) {
        shiftFocusedItemNotInLoadedRange = itemIsNotInLoadedRange(this._shiftFocusedItemIndex);
      }
    }

    if (!this.isSelectable() || !this.isDataItem(item)) {
      return false;
    }

    const itemData = this.options.getItemData(item);
    const itemKey = this.options.keyOf(itemData);

    keys = keys || {};
    let allowSelectByShift = keys.shift;

    if (alwaysSelectByShift === false && allowSelectByShift) {
      allowSelectByShift = allowLoadByRange !== false || (!focusedItemNotInLoadedRange && !shiftFocusedItemNotInLoadedRange);
    }

    if (allowSelectByShift && this.options.mode === 'multiple' && this._focusedItemIndex >= 0) {
      if (allowLoadByRange && (focusedItemNotInLoadedRange || shiftFocusedItemNotInLoadedRange)) {
        isSelectedItemsChanged = itemIndex !== this._shiftFocusedItemIndex || this._focusedItemIndex !== this._shiftFocusedItemIndex;

        if (isSelectedItemsChanged) {
          deferred = this.changeItemSelectionWhenShiftKeyInVirtualPaging(itemIndex);
        }
      } else {
        isSelectedItemsChanged = this.changeItemSelectionWhenShiftKeyPressed(itemIndex, items, indexOffset);
      }
    } else if (keys.control) {
      this._resetItemSelectionWhenShiftKeyPressed();
      if (!setFocusOnly) {
        const isSelected = this._selectionStrategy.isItemDataSelected(itemData);
        if (this.options.mode === 'single') {
          this.clearSelectedItems();
        }
        if (isSelected) {
          this._removeSelectedItem(itemKey);
        } else {
          this._addSelectedItem(itemData, itemKey);
        }
      }
      isSelectedItemsChanged = true;
    } else {
      this._resetItemSelectionWhenShiftKeyPressed();
      const isKeysEqual = this._selectionStrategy.equalKeys(this.options.selectedItemKeys[0], itemKey);
      if (this.options.selectedItemKeys.length !== 1 || !isKeysEqual) {
        this._setSelectedItems([itemKey], [itemData]);
        isSelectedItemsChanged = true;
      }
    }

    if (isSelectedItemsChanged) {
      when(deferred).done(() => {
        this._focusedItemIndex = itemIndex;
        !setFocusOnly && this.onSelectionChanged();
      });
      return true;
    }

    return undefined;
  }

  isDataItem(item: TItem): boolean {
    return this.options.isSelectableItem(item);
  }

  isSelectable(): boolean {
    return this.options.mode === 'single' || this.options.mode === 'multiple';
  }

  isItemDataSelected(data: any): boolean {
    return this._selectionStrategy.isItemDataSelected(data, { checkPending: true });
  }

  isItemSelected(arg, options?: any): boolean {
    return this._selectionStrategy.isItemKeySelected(arg, options);
  }

  _resetItemSelectionWhenShiftKeyPressed(): void {
    delete this._shiftFocusedItemIndex;
  }

  _resetFocusedItemIndex(): void {
    this._focusedItemIndex = -1;
  }

  changeItemSelectionWhenShiftKeyInVirtualPaging(loadIndex: number): Promise<unknown> {
    const loadOptions = this.options.getLoadOptions(loadIndex, this._focusedItemIndex, this._shiftFocusedItemIndex);
    const deferred = Deferred();
    const indexOffset = loadOptions.skip;

    this.options.load(loadOptions).done((items) => {
      const filteredItems = !Array.isArray(items) && isPlainObject(items) ? items.data : items;
      this.changeItemSelectionWhenShiftKeyPressed(loadIndex, filteredItems, indexOffset);

      deferred.resolve();
    });

    return deferred.promise();
  }

  changeItemSelectionWhenShiftKeyPressed(itemIndex: number, items: TItem[], indexOffset?: number): boolean {
    let isSelectedItemsChanged = false;
    let itemIndexStep;
    const indexOffsetDefined = isDefined(indexOffset);
    let index = indexOffsetDefined ? this._focusedItemIndex - indexOffset : this._focusedItemIndex;
    const { keyOf } = this.options;
    const focusedItem = items[index];
    const focusedData = this.options.getItemData(focusedItem);
    const focusedKey = keyOf(focusedData);
    const isFocusedItemSelected = focusedItem && this.isItemDataSelected(focusedData);

    if (!isDefined(this._shiftFocusedItemIndex)) {
      this._shiftFocusedItemIndex = this._focusedItemIndex;
    }

    let data;
    let itemKey;
    let startIndex;
    let endIndex;

    if (this._shiftFocusedItemIndex !== this._focusedItemIndex) {
      itemIndexStep = this._focusedItemIndex < this._shiftFocusedItemIndex ? 1 : -1;
      startIndex = indexOffsetDefined ? this._focusedItemIndex - indexOffset : this._focusedItemIndex;
      endIndex = indexOffsetDefined ? this._shiftFocusedItemIndex - indexOffset : this._shiftFocusedItemIndex;
      for (index = startIndex; index !== endIndex; index += itemIndexStep) {
        if (indexOffsetDefined || this.isDataItem(items[index])) {
          itemKey = keyOf(this.options.getItemData(items[index]));
          this._removeSelectedItem(itemKey);
          isSelectedItemsChanged = true;
        }
      }
    }

    if (itemIndex !== this._shiftFocusedItemIndex) {
      itemIndexStep = itemIndex < this._shiftFocusedItemIndex ? 1 : -1;
      startIndex = indexOffsetDefined ? itemIndex - indexOffset : itemIndex;
      endIndex = indexOffsetDefined
        ? this._shiftFocusedItemIndex - indexOffset
        : this._shiftFocusedItemIndex;
      for (index = startIndex; index !== endIndex; index += itemIndexStep) {
        if (indexOffsetDefined || this.isDataItem(items[index])) {
          data = this.options.getItemData(items[index]);
          itemKey = keyOf(data);

          this._addSelectedItem(data, itemKey);
          isSelectedItemsChanged = true;
        }
      }
    }

    if ((indexOffsetDefined || this.isDataItem(focusedItem)) && !isFocusedItemSelected) {
      this._addSelectedItem(focusedData, focusedKey);
      isSelectedItemsChanged = true;
    }

    return isSelectedItemsChanged;
  }

  clearSelectedItems(): void {
    this._setSelectedItems([], []);
  }

  selectAll(isOnePage: boolean): DeferredObj<unknown> {
    this._resetFocusedItemIndex();

    if (isOnePage) {
      return this._selectionStrategy._onePageSelectAll(false);
    }
    return this.selectedItemKeys([], true, false, true);
  }

  deselectAll(isOnePage: boolean): DeferredObj<unknown> {
    this._resetFocusedItemIndex();

    if (isOnePage) {
      return this._selectionStrategy._onePageSelectAll(true);
    }
    return this.selectedItemKeys([], true, true, true);
  }

  getSelectAllState(visibleOnly: boolean): boolean | undefined {
    return this._selectionStrategy.getSelectAllState(visibleOnly);
  }

  loadSelectedItemsWithFilter(): DeferredObj<unknown> {
    return this._selectionStrategy.loadSelectedItemsWithFilter();
  }
}
