import type { LoadResult } from '@js/common/data';
import type { LoadOptions } from '@js/common/data.types';
import { noop } from '@js/core/utils/common';
import { Deferred, type DeferredObj, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';

import DeferredStrategy from './m_selection.strategy.deferred';
import StandardStrategy from './m_selection.strategy.standard';

interface DefaultOptions<TItem = any, TKey = any> {
  onSelectionChanged: (args: {
    selectedItems: TItem[];
    selectedItemKeys: TKey[];
    addedItemKeys: TKey[];
    removedItemKeys: TKey[];
    addedItems: TItem[];
    removedItems: TItem[];
  }) => void;
  key: () => void;
  keyOf: (item: any) => any;
  load: (loadOptions: LoadOptions) => DeferredObj<unknown>;
  totalCount: () => number;
  isSelectableItem: (item: TItem) => boolean;
  isItemSelected: (arg: any, options?: any) => boolean;
  getItemData: (item: TItem) => any;
  dataFields: () => void;
  filter: () => any;
  allowNullValue: boolean;
  deferred: boolean;
  equalByReference: boolean;
  mode: string;
  selectedItems: TItem[];
  selectionFilter: any[];
  maxFilterLengthInRequest: number;
}

export type SelectOptions<TItem = any, TKey = any> = DefaultOptions<TItem, TKey> & {
  selectedKeys: TKey[];
  selectedItemKeys: TKey[];
  plainItems: (cached?: boolean) => any;
  isVirtualPaging?: boolean;
  sensitivity: 'case' | 'base' | 'variant' | any;
  allowLoadByRange?: () => boolean | undefined;
  alwaysSelectByShift?: boolean;
  getLoadOptions: (loadItemIndex, focusedItemIndex, shiftItemIndex) => LoadOptions;
  addedItemKeys: TKey[];
  removedItemKeys: TKey[];
  addedItems: TItem[];
  removedItems: TItem[];
  onSelectionChanging: (e: any) => void;
  keyHashIndices: any;
  ignoreDisabledItems?: boolean;
  disabledItemKeys: TKey[];
};

export default class Selection<TItem = any, TKey = any> {
  options: SelectOptions<TItem, TKey>;

  _selectionStrategy: DeferredStrategy | StandardStrategy;

  _focusedItemIndex: number;

  _shiftFocusedItemIndex?: number;

  constructor(options: Partial<SelectOptions>) {
    this.options = extend(this._getDefaultOptions(), options, {
      selectedItemKeys: options.selectedKeys ?? [],
    });

    this._selectionStrategy = this.options.deferred
      ? new DeferredStrategy(this.options)
      : new StandardStrategy(this.options);

    this._focusedItemIndex = -1;

    if (!this.options.equalByReference) {
      this._selectionStrategy.updateSelectedItemKeyHash(this.options.selectedItemKeys);
    }
  }

  _getDefaultOptions(): DefaultOptions<TItem, TKey> {
    return {
      allowNullValue: false,
      deferred: false,
      equalByReference: false,
      mode: 'multiple',
      selectedItems: [],
      selectionFilter: [],
      maxFilterLengthInRequest: 0,
      onSelectionChanged: noop,
      key: noop,
      keyOf(item) { return item; },
      load() { return Deferred<LoadResult<TItem>>().resolve([]); },
      totalCount() { return -1; },
      isSelectableItem() { return true; },
      isItemSelected() { return false; },
      getItemData(item) { return item; },
      dataFields: noop,
      filter: noop,
    };
  }

  validate() {
    this._selectionStrategy.validate();
  }

  getSelectedItemKeys() {
    return this._selectionStrategy.getSelectedItemKeys();
  }

  getSelectedItems() {
    return this._selectionStrategy.getSelectedItems();
  }

  selectionFilter(value?: any) {
    if (value === undefined) {
      return this.options.selectionFilter;
    }

    const filterIsChanged = this.options.selectionFilter !== value && JSON.stringify(this.options.selectionFilter) !== JSON.stringify(value);

    this.options.selectionFilter = value;

    filterIsChanged && this.onSelectionChanged();

    return undefined;
  }

  setSelection(keys, updatedKeys?) {
    return this.selectedItemKeys(keys, false, false, false, updatedKeys);
  }

  select(keys) {
    return this.selectedItemKeys(keys, true);
  }

  deselect(keys) {
    return this.selectedItemKeys(keys, true, true);
  }

  selectedItemKeys(
    keys: TKey[],
    preserve?: boolean,
    isDeselect?: boolean,
    isSelectAll?: boolean,
    updatedKeys?: TKey[],
  ) {
    const that = this;

    keys = keys ?? [];
    keys = Array.isArray(keys) ? keys : [keys];
    that.validate();

    return this._selectionStrategy.selectedItemKeys(keys, preserve, isDeselect, isSelectAll, updatedKeys);
  }

  clearSelection() {
    return this.selectedItemKeys([]);
  }

  _addSelectedItem(itemData, key) {
    this._selectionStrategy.addSelectedItem(key, itemData);
  }

  _removeSelectedItem(key) {
    this._selectionStrategy.removeSelectedItem(key);
  }

  _setSelectedItems(keys, items) {
    this._selectionStrategy.setSelectedItems(keys, items);
  }

  onSelectionChanged() {
    this._selectionStrategy.onSelectionChanged();
  }

  changeItemSelection(itemIndex, keys, setFocusOnly) {
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

  isDataItem(item) {
    return this.options.isSelectableItem(item);
  }

  isSelectable() {
    return this.options.mode === 'single' || this.options.mode === 'multiple';
  }

  isItemDataSelected(data) {
    return this._selectionStrategy.isItemDataSelected(data, { checkPending: true });
  }

  isItemSelected(arg, options?: any): boolean {
    return this._selectionStrategy.isItemKeySelected(arg, options);
  }

  _resetItemSelectionWhenShiftKeyPressed() {
    delete this._shiftFocusedItemIndex;
  }

  _resetFocusedItemIndex() {
    this._focusedItemIndex = -1;
  }

  changeItemSelectionWhenShiftKeyInVirtualPaging(loadIndex) {
    const loadOptions = this.options.getLoadOptions(loadIndex, this._focusedItemIndex, this._shiftFocusedItemIndex);
    const deferred = Deferred();
    const indexOffset = loadOptions.skip;

    this.options.load(loadOptions).done((items) => {
      this.changeItemSelectionWhenShiftKeyPressed(loadIndex, items, indexOffset);

      deferred.resolve();
    });

    return deferred.promise();
  }

  changeItemSelectionWhenShiftKeyPressed(itemIndex, items, indexOffset) {
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

  clearSelectedItems() {
    this._setSelectedItems([], []);
  }

  selectAll(isOnePage) {
    this._resetFocusedItemIndex();

    if (isOnePage) {
      return this._selectionStrategy._onePageSelectAll(false);
    }
    return this.selectedItemKeys([], true, false, true);
  }

  deselectAll(isOnePage) {
    this._resetFocusedItemIndex();

    if (isOnePage) {
      return this._selectionStrategy._onePageSelectAll(true);
    }
    return this.selectedItemKeys([], true, true, true);
  }

  getSelectAllState(visibleOnly) {
    return this._selectionStrategy.getSelectAllState(visibleOnly);
  }

  loadSelectedItemsWithFilter() {
    return this._selectionStrategy.loadSelectedItemsWithFilter();
  }
}
