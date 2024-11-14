import dataQuery from '@js/common/data/query';
import {
  equalByValue,
  getKeyHash,
  noop,
} from '@js/core/utils/common';
import { Deferred } from '@js/core/utils/deferred';
import { isObject, isPlainObject, isPromise } from '@js/core/utils/type';

export default class SelectionStrategy {
  options: any;

  _lastSelectAllPageDeferred = Deferred().reject();

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

  onSelectionChanging(): boolean | Promise<boolean> {
    const {
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
      onSelectionChanging = noop,
    } = this.options;

    const selectionChangingArgs = {
      selectedItems,
      selectedItemKeys,
      addedItemKeys,
      removedItemKeys,
      addedItems,
      removedItems,
      cancel: false,
    };

    onSelectionChanging(selectionChangingArgs);
    return selectionChangingArgs.cancel;
  }

  _callCallbackIfNotCanceled(callback: () => void, cancelCallback: () => void): void {
    const cancelResult = this.onSelectionChanging();

    if (isPromise(cancelResult)) {
      cancelResult
        .then((cancel) => {
          if (!cancel) {
            callback();
          } else {
            cancelCallback();
          }
        })
        .catch(() => {
          callback();
        });
    } else if (!cancelResult) {
      callback();
    } else {
      cancelCallback();
    }
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
            // @ts-expect-error
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
      // @ts-expect-error
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

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  isItemKeySelected(itemKey): boolean {
    throw new Error('isItemKeySelected method should be overriden');
  }

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  addSelectedItem(itemKey, itemData): void {
    throw new Error('addSelectedItem method should be overriden');
  }

  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  removeSelectedItem(itemKey): void {
    throw new Error('removeSelectedItem method should be overriden');
  }

  _selectAllPlainItems(isDeselect: boolean): void {
    const items = this.getSelectableItems(this.options.plainItems());
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (this.options.isSelectableItem(item)) {
        const itemData = this.options.getItemData(item);
        const itemKey = this.options.keyOf(itemData);
        const isSelected = this.isItemKeySelected(itemKey);

        if (!isSelected && !isDeselect) {
          this.addSelectedItem(itemKey, itemData);
        }

        if (isSelected && isDeselect) {
          this.removeSelectedItem(itemKey);
        }
      }
    }
  }
}
