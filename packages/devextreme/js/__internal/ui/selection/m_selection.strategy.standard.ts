import dataQuery from '@js/common/data/query';
import { getUniqueValues, removeDuplicates } from '@js/core/utils/array';
import { isKeysEqual } from '@js/core/utils/array_compare';
import { getKeyHash } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { SelectionFilterCreator } from '@js/core/utils/selection_filter';
import { isDefined, isObject } from '@js/core/utils/type';
import errors from '@js/ui/widget/ui.errors';

import SelectionStrategy from './m_selection.strategy';

export default class StandardStrategy extends SelectionStrategy {
  _shouldMergeWithLastRequest?: boolean;

  _lastLoadDeferred?: any;

  _lastRequestData?: any;

  _isCancelingInProgress?: boolean;

  _lastSelectAllPageDeferred = Deferred().reject();

  _storedSelectionState?: {
    selectedItems: any;
    selectedItemKeys: any;
    keyHashIndices: any;
  };

  constructor(options) {
    super(options);
    this._initSelectedItemKeyHash();
  }

  _initSelectedItemKeyHash() {
    this._setOption('keyHashIndices', this.options.equalByReference ? null : {});
  }

  getSelectedItemKeys() {
    return this.options.selectedItemKeys.slice(0);
  }

  getSelectedItems() {
    return this.options.selectedItems.slice(0);
  }

  _preserveSelectionUpdate(items, isDeselect) {
    const { keyOf } = this.options;
    let keyIndicesToRemoveMap;
    let keyIndex;
    let i;

    if (!keyOf) return;

    const isBatchDeselect = isDeselect && items.length > 1 && !this.options.equalByReference;

    if (isBatchDeselect) {
      keyIndicesToRemoveMap = {};
    }

    for (i = 0; i < items.length; i++) {
      const item = items[i];
      const key = keyOf(item);
      if (isDeselect) {
        keyIndex = this.removeSelectedItem(key, keyIndicesToRemoveMap, item?.disabled);
        if (keyIndicesToRemoveMap && keyIndex >= 0) {
          keyIndicesToRemoveMap[keyIndex] = true;
        }
      } else {
        this.addSelectedItem(key, item);
      }
    }

    if (isBatchDeselect) {
      this._batchRemoveSelectedItems(keyIndicesToRemoveMap);
    }
  }

  _batchRemoveSelectedItems(keyIndicesToRemoveMap) {
    const selectedItemKeys = this.options.selectedItemKeys.slice(0);
    const selectedItems = this.options.selectedItems.slice(0);

    this.options.selectedItemKeys.length = 0;
    this.options.selectedItems.length = 0;

    for (let i = 0; i < selectedItemKeys.length; i++) {
      if (!keyIndicesToRemoveMap[i]) {
        this.options.selectedItemKeys.push(selectedItemKeys[i]);
        this.options.selectedItems.push(selectedItems[i]);
      }
    }

    this._initSelectedItemKeyHash();
    this.updateSelectedItemKeyHash(this.options.selectedItemKeys);
  }

  _loadSelectedItemsCore(keys, isDeselect, isSelectAll, filter, forceCombinedFilter = false) {
    let deferred = Deferred();
    const key = this.options.key();

    if (!keys.length && !isSelectAll) {
      deferred.resolve([]);
      return deferred;
    }

    if (isSelectAll && isDeselect && !filter) {
      deferred.resolve(this.getSelectedItems());
      return deferred;
    }

    const selectionFilterCreator = new SelectionFilterCreator(keys, isSelectAll);
    const combinedFilter = selectionFilterCreator.getCombinedFilter(key, filter, forceCombinedFilter);

    let deselectedItems = [];
    if (isDeselect) {
      const { selectedItems } = this.options;
      deselectedItems = combinedFilter && keys.length !== selectedItems.length
        // @ts-expect-error
        ? dataQuery(selectedItems).filter(combinedFilter).toArray()
        : selectedItems.slice(0);
    }

    let filteredItems = deselectedItems.length ? deselectedItems : this.options.plainItems(true).filter(this.options.isSelectableItem).map(this.options.getItemData);

    const localFilter = selectionFilterCreator.getLocalFilter(this.options.keyOf, this.equalKeys.bind(this), this.options.equalByReference, key);

    filteredItems = filteredItems.filter(localFilter);

    if (deselectedItems.length || (!isSelectAll && filteredItems.length === keys.length)) {
      deferred.resolve(filteredItems);
    } else {
      deferred = this._loadFilteredData(combinedFilter, localFilter, null, isSelectAll);
    }

    return deferred;
  }

  _replaceSelectionUpdate(items) {
    const internalKeys = [];
    const { keyOf } = this.options;

    if (!keyOf) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const key = keyOf(item);
      // @ts-expect-error
      internalKeys.push(key);
    }

    this.setSelectedItems(internalKeys, items);
  }

  _warnOnIncorrectKeys(keys) {
    const { allowNullValue } = this.options;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if ((!allowNullValue || key !== null) && !this.isItemKeySelected(key)) {
        errors.log('W1002', key);
      }
    }
  }

  _isMultiSelectEnabled() {
    const { mode } = this.options;
    return mode === 'all' || mode === 'multiple';
  }

  _requestInProgress() {
    return this._lastLoadDeferred?.state() === 'pending';
  }

  _concatRequestsItems(keys, isDeselect, oldRequestItems, updatedKeys) {
    let selectedItems;
    const deselectedItems = isDeselect ? keys : [];

    if (updatedKeys) {
      selectedItems = updatedKeys;
    } else {
      selectedItems = removeDuplicates(keys, this.options.selectedItemKeys);
    }

    return {
      addedItems: oldRequestItems.added.concat(selectedItems),
      removedItems: oldRequestItems.removed.concat(deselectedItems),
      keys,
    };
  }

  _collectLastRequestData(keys, isDeselect, isSelectAll, updatedKeys) {
    const isDeselectAll = isDeselect && isSelectAll;
    const oldRequestItems = {
      added: [],
      removed: [],
    };
    const multiSelectEnabled = this._isMultiSelectEnabled();
    let lastRequestData = multiSelectEnabled ? this._lastRequestData : {};

    if (multiSelectEnabled) {
      if (this._shouldMergeWithLastRequest) {
        if (isDeselectAll) {
          this._lastLoadDeferred.reject();
          lastRequestData = {};
        } else if (!isKeysEqual(keys, this.options.selectedItemKeys)) {
          oldRequestItems.added = lastRequestData.addedItems;
          oldRequestItems.removed = lastRequestData.removedItems;

          if (!isDeselect) {
            this._lastLoadDeferred.reject();
          }
        }
      }

      lastRequestData = this._concatRequestsItems(keys, isDeselect, oldRequestItems, this._shouldMergeWithLastRequest ? undefined : updatedKeys);
    }

    return lastRequestData;
  }

  _updateKeysByLastRequestData(keys, isDeselect, isSelectAll) {
    let currentKeys = keys;
    if (this._isMultiSelectEnabled() && this._shouldMergeWithLastRequest && !isDeselect && !isSelectAll) {
      currentKeys = removeDuplicates(keys.concat(this._lastRequestData?.addedItems), this._lastRequestData?.removedItems);
      currentKeys = getUniqueValues(currentKeys);
    }

    return currentKeys;
  }

  _loadSelectedItems(keys, isDeselect, isSelectAll, updatedKeys, forceCombinedFilter = false) {
    const that = this;
    const deferred = Deferred();
    const filter = that.options.filter();

    this._shouldMergeWithLastRequest = this._requestInProgress();

    this._lastRequestData = this._collectLastRequestData(keys, isDeselect, isSelectAll, updatedKeys);

    when(that._lastLoadDeferred).always(() => {
      const currentKeys = that._updateKeysByLastRequestData(keys, isDeselect, isSelectAll);

      that._shouldMergeWithLastRequest = false;

      that._loadSelectedItemsCore(currentKeys, isDeselect, isSelectAll, filter, forceCombinedFilter)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .done(deferred.resolve)
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .fail(deferred.reject);
    });

    that._lastLoadDeferred = deferred;

    return deferred;
  }

  selectedItemKeys(keys, preserve, isDeselect, isSelectAll, updatedKeys, forceCombinedFilter = false) {
    if (this._isCancelingInProgress) {
      return Deferred().reject();
    }

    const loadingDeferred = this._loadSelectedItems(
      keys,
      isDeselect,
      isSelectAll,
      updatedKeys,
      forceCombinedFilter,
    );

    const selectionDeferred = Deferred();

    loadingDeferred.done((items) => {
      this._storeSelectionState();

      if (preserve) {
        this._preserveSelectionUpdate(items, isDeselect);
      } else {
        this._replaceSelectionUpdate(items);
      }
      /// #DEBUG
      if (!isSelectAll && !isDeselect) {
        this._warnOnIncorrectKeys(keys);
      }
      /// #ENDDEBUG

      this._isCancelingInProgress = true;
      this._callCallbackIfNotCanceled(() => {
        this._isCancelingInProgress = false;
        this.onSelectionChanged();
        selectionDeferred.resolve(items);
      }, () => {
        this._isCancelingInProgress = false;
        this._restoreSelectionState();
        selectionDeferred.reject();
      });
    });

    return selectionDeferred;
  }

  addSelectedItem(key, itemData) {
    if (isDefined(itemData) && !this.options.ignoreDisabledItems && itemData.disabled) {
      if (this.options.disabledItemKeys.indexOf(key) === -1) {
        this.options.disabledItemKeys.push(key);
      }
      return;
    }

    const keyHash = this._getKeyHash(key);

    if (this._indexOfSelectedItemKey(keyHash) === -1) {
      if (!isObject(keyHash) && this.options.keyHashIndices) {
        this.options.keyHashIndices[keyHash] = [this.options.selectedItemKeys.length];
      }

      this.options.selectedItemKeys.push(key);
      this.options.addedItemKeys.push(key);
      this.options.addedItems.push(itemData);
      this.options.selectedItems.push(itemData);
    }
  }

  _getSelectedIndexByKey(key, ignoreIndicesMap) {
    const { selectedItemKeys } = this.options;

    for (let index = 0; index < selectedItemKeys.length; index++) {
      if ((!ignoreIndicesMap || !ignoreIndicesMap[index]) && this.equalKeys(selectedItemKeys[index], key)) {
        return index;
      }
    }
    return -1;
  }

  _getSelectedIndexByHash(key, ignoreIndicesMap) {
    let indices = this.options.keyHashIndices[key];

    if (indices && indices.length > 1 && ignoreIndicesMap) {
      indices = indices.filter((index) => !ignoreIndicesMap[index]);
    }

    return indices && indices[0] >= 0 ? indices[0] : -1;
  }

  _indexOfSelectedItemKey(key, ignoreIndicesMap?: any[]) {
    let selectedIndex;

    if (this.options.equalByReference) {
      selectedIndex = this.options.selectedItemKeys.indexOf(key);
    } else if (isObject(key)) {
      selectedIndex = this._getSelectedIndexByKey(key, ignoreIndicesMap);
    } else {
      selectedIndex = this._getSelectedIndexByHash(key, ignoreIndicesMap);
    }

    return selectedIndex;
  }

  _shiftSelectedKeyIndices(keyIndex) {
    for (let currentKeyIndex = keyIndex; currentKeyIndex < this.options.selectedItemKeys.length; currentKeyIndex++) {
      const currentKey = this.options.selectedItemKeys[currentKeyIndex];
      const currentKeyHash = getKeyHash(currentKey);
      const currentKeyIndices = this.options.keyHashIndices[currentKeyHash];

      if (!currentKeyIndices) continue;

      for (let i = 0; i < currentKeyIndices.length; i++) {
        if (currentKeyIndices[i] > keyIndex) {
          currentKeyIndices[i]--;
        }
      }
    }
  }

  removeSelectedItem(
    key,
    keyIndicesToRemoveMap?: any[],
    isDisabled?: boolean,
  ) {
    if (!this.options.ignoreDisabledItems && isDisabled) {
      return;
    }

    const keyHash = this._getKeyHash(key);
    const isBatchDeselect = !!keyIndicesToRemoveMap;
    const keyIndex = this._indexOfSelectedItemKey(keyHash, keyIndicesToRemoveMap);

    if (keyIndex < 0) {
      return keyIndex;
    }

    this.options.removedItemKeys.push(key);
    this.options.removedItems.push(this.options.selectedItems[keyIndex]);

    if (isBatchDeselect) {
      return keyIndex;
    }

    this.options.selectedItemKeys.splice(keyIndex, 1);
    this.options.selectedItems.splice(keyIndex, 1);

    if (isObject(keyHash) || !this.options.keyHashIndices) {
      return keyIndex;
    }

    const keyIndices = this.options.keyHashIndices[keyHash];

    if (!keyIndices) {
      return keyIndex;
    }

    keyIndices.shift();

    if (!keyIndices.length) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.options.keyHashIndices[keyHash];
    }

    this._shiftSelectedKeyIndices(keyIndex);

    return keyIndex;
  }

  _updateAddedItemKeys(keys, items) {
    for (let i = 0; i < keys.length; i++) {
      if (!this.isItemKeySelected(keys[i])) {
        this.options.addedItemKeys.push(keys[i]);
        this.options.addedItems.push(items[i]);
      }
    }
  }

  _updateRemovedItemKeys(keys, oldSelectedKeys, oldSelectedItems) {
    for (let i = 0; i < oldSelectedKeys.length; i++) {
      if (!this.isItemKeySelected(oldSelectedKeys[i])) {
        this.options.removedItemKeys.push(oldSelectedKeys[i]);
        this.options.removedItems.push(oldSelectedItems[i]);
      }
    }
  }

  _isItemSelectionInProgress(key, checkPending) {
    const shouldCheckPending = checkPending && this._lastRequestData && this._requestInProgress();
    if (shouldCheckPending) {
      const addedItems = this._lastRequestData.addedItems ?? [];
      return addedItems.includes(key);
    }
    return false;
  }

  _getKeyHash(key) {
    return this.options.equalByReference ? key : getKeyHash(key);
  }

  setSelectedItems(keys, items) {
    this._updateAddedItemKeys(keys, items);

    const oldSelectedKeys = this.options.selectedItemKeys;
    const oldSelectedItems = this.options.selectedItems;

    if (!this.options.equalByReference) {
      this._initSelectedItemKeyHash();
      this.updateSelectedItemKeyHash(keys);
    }

    this._setOption('selectedItemKeys', keys);
    this._setOption('selectedItems', items);

    this._updateRemovedItemKeys(keys, oldSelectedKeys, oldSelectedItems);
  }

  isItemDataSelected(itemData, options = {}) {
    const key = this.options.keyOf(itemData);
    return this.isItemKeySelected(key, options);
  }

  isItemKeySelected(key, options: { checkPending?: boolean } = {}) {
    let result = this._isItemSelectionInProgress(key, options.checkPending);

    if (!result) {
      const keyHash = this._getKeyHash(key);
      const index = this._indexOfSelectedItemKey(keyHash);
      result = index !== -1;
    }

    return result;
  }

  getSelectAllState(visibleOnly) {
    if (visibleOnly) {
      return this._getVisibleSelectAllState();
    }
    return this._getFullSelectAllState();
  }

  loadSelectedItemsWithFilter() {
    const keyExpr = this.options.key();
    const keys = this.getSelectedItemKeys();
    const filter = this.options.filter();

    if (!keys.length) {
      return Deferred().resolve([]);
    }

    const selectionFilterCreator = new SelectionFilterCreator(keys);
    const combinedFilter = selectionFilterCreator.getCombinedFilter(keyExpr, filter, true);

    return this._loadFilteredData(combinedFilter);
  }

  _storeSelectionState(): void {
    const { selectedItems, selectedItemKeys, keyHashIndices } = this.options;

    this._storedSelectionState = {
      keyHashIndices: JSON.stringify(keyHashIndices),
      selectedItems: [...selectedItems],
      selectedItemKeys: [...selectedItemKeys],
    };
  }

  _restoreSelectionState(): void {
    this._clearItemKeys();

    const { selectedItemKeys, selectedItems, keyHashIndices } = this._storedSelectionState!;
    this._setOption('selectedItemKeys', selectedItemKeys);
    this._setOption('selectedItems', selectedItems);
    this._setOption('keyHashIndices', JSON.parse(keyHashIndices));
  }

  _onePageSelectAll(isDeselect: boolean): DeferredObj<unknown> {
    if (this._lastSelectAllPageDeferred.state() === 'pending') {
      return Deferred().reject();
    }

    this._storeSelectionState();

    this._selectAllPlainItems(isDeselect);

    this._lastSelectAllPageDeferred = Deferred();

    this._callCallbackIfNotCanceled(() => {
      this.onSelectionChanged();
      this._lastSelectAllPageDeferred.resolve();
    }, () => {
      this._restoreSelectionState();
      this._lastSelectAllPageDeferred.reject();
    });

    return this._lastSelectAllPageDeferred;
  }
}
