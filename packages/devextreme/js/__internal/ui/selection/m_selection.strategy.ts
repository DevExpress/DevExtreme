import {
  equalByValue,
  // @ts-expect-error
  getKeyHash,
  noop,
} from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { isObject, isPlainObject } from '@js/core/utils/type';
import dataQuery from '@js/data/query';

export default class SelectionStrategy {
  options: any;

  constructor(options) {
    this.options = options;

    this._setOption('disabledItemKeys', []);
    this._clearItemKeys();
  }

  _clearItemKeys() {
    this._setOption('addedItemKeys', []);
    this._setOption('removedItemKeys', []);
    this._setOption('removedItems', []);
    this._setOption('addedItems', []);
  }

  validate() {

  }

  _setOption(name, value) {
    this.options[name] = value;
  }

  onSelectionChanging(): void {
    const {
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
      onSelectionChanging = noop,
    } = this.options;

    onSelectionChanging({
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
      cancel: false,
    });
  }

  onSelectionChanged() {
    const {
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
      onSelectionChanged = noop,
    } = this.options;

    this._clearItemKeys();
    onSelectionChanged({
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
    });
  }

  equalKeys(key1, key2) {
    if (this.options.equalByReference) {
      if (isObject(key1) && isObject(key2)) {
        return key1 === key2;
      }
    }

    return equalByValue(key1, key2);
  }

  getSelectableItems(items) {
    return items.filter((item) => !item?.disabled);
  }

  _clearSelection(keys, preserve, isDeselect, isSelectAll) {
    keys = keys || [];
    keys = Array.isArray(keys) ? keys : [keys];
    this.validate();
    // @ts-expect-error
    return this.selectedItemKeys(keys, preserve, isDeselect, isSelectAll);
  }

  _removeTemplateProperty(remoteFilter: { template: any }) {
    if (Array.isArray(remoteFilter)) {
      return remoteFilter.map((f) => this._removeTemplateProperty(f));
    }

    if (isObject(remoteFilter)) {
      delete remoteFilter.template;
    }

    return remoteFilter;
  }

  _loadFilteredData(remoteFilter, localFilter?: any, select?: any, isSelectAll?: boolean) {
    const filterLength = encodeURI(JSON.stringify(this._removeTemplateProperty(remoteFilter))).length;
    const needLoadAllData = this.options.maxFilterLengthInRequest && (filterLength > this.options.maxFilterLengthInRequest);
    const deferred = Deferred();
    const loadOptions = {
      filter: needLoadAllData ? undefined : remoteFilter,
      select: needLoadAllData ? this.options.dataFields() : select || this.options.dataFields(),
    };

    if (remoteFilter && remoteFilter.length === 0) {
      deferred.resolve([]);
    } else {
      this.options.load(loadOptions)
        .done((items) => {
          let filteredItems = isPlainObject(items) ? items.data : items;

          if (localFilter && !isSelectAll) {
            filteredItems = filteredItems.filter(localFilter);
          } else if (needLoadAllData) {
            filteredItems = dataQuery(filteredItems).filter(remoteFilter).toArray();
          }

          deferred.resolve(filteredItems);
        })
        .fail(deferred.reject.bind(deferred));
    }

    return deferred;
  }

  updateSelectedItemKeyHash(keys) {
    for (let i = 0; i < keys.length; i++) {
      const keyHash = getKeyHash(keys[i]);

      if (!isObject(keyHash)) {
        this.options.keyHashIndices[keyHash] = this.options.keyHashIndices[keyHash] || [];

        const keyIndices = this.options.keyHashIndices[keyHash];
        keyIndices.push(i);
      }
    }
  }

  _isAnyItemSelected(items) {
    for (let i = 0; i < items.length; i++) {
      if (this.options.isItemSelected(items[i])) {
        return undefined;
      }
    }

    return false;
  }

  _getFullSelectAllState() {
    const items = this.options.plainItems();
    const dataFilter = this.options.filter();
    let selectedItems = this.options.ignoreDisabledItems ? this.options.selectedItems : this.options.selectedItems.filter((item) => !item?.disabled);

    if (dataFilter) {
      selectedItems = dataQuery(selectedItems).filter(dataFilter).toArray();
    }

    const selectedItemsLength = selectedItems.length;
    const disabledItemsLength = items.length - this.getSelectableItems(items).length;

    if (!selectedItemsLength) {
      return this._isAnyItemSelected(items);
    }

    if (selectedItemsLength >= this.options.totalCount() - disabledItemsLength) {
      return true;
    }
    return undefined;
  }

  _getVisibleSelectAllState() {
    const items = this.getSelectableItems(this.options.plainItems());
    let hasSelectedItems = false;
    let hasUnselectedItems = false;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemData = this.options.getItemData(item);
      const key = this.options.keyOf(itemData);

      if (this.options.isSelectableItem(item)) {
        // @ts-expect-error
        if (this.isItemKeySelected(key)) {
          hasSelectedItems = true;
        } else {
          hasUnselectedItems = true;
        }
      }
    }

    if (hasSelectedItems) {
      return !hasUnselectedItems ? true : undefined;
    }
    return false;
  }
}
