"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _array = require("../../../core/utils/array");
var _array_compare = require("../../../core/utils/array_compare");
var _common = require("../../../core/utils/common");
var _deferred = require("../../../core/utils/deferred");
var _selection_filter = require("../../../core/utils/selection_filter");
var _type = require("../../../core/utils/type");
var _query = _interopRequireDefault(require("../../../data/query"));
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.errors"));
var _m_selection = _interopRequireDefault(require("./m_selection.strategy"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

class StandardStrategy extends _m_selection.default {
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
    const {
      keyOf
    } = this.options;
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
        keyIndex = this.removeSelectedItem(key, keyIndicesToRemoveMap, item === null || item === void 0 ? void 0 : item.disabled);
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
  _loadSelectedItemsCore(keys, isDeselect, isSelectAll, filter) {
    let forceCombinedFilter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    let deferred = (0, _deferred.Deferred)();
    const key = this.options.key();
    if (!keys.length && !isSelectAll) {
      deferred.resolve([]);
      return deferred;
    }
    if (isSelectAll && isDeselect && !filter) {
      deferred.resolve(this.getSelectedItems());
      return deferred;
    }
    const selectionFilterCreator = new _selection_filter.SelectionFilterCreator(keys, isSelectAll);
    const combinedFilter = selectionFilterCreator.getCombinedFilter(key, filter, forceCombinedFilter);
    let deselectedItems = [];
    if (isDeselect) {
      const {
        selectedItems
      } = this.options;
      deselectedItems = combinedFilter && keys.length !== selectedItems.length ? (0, _query.default)(selectedItems).filter(combinedFilter).toArray() : selectedItems.slice(0);
    }
    let filteredItems = deselectedItems.length ? deselectedItems : this.options.plainItems(true).filter(this.options.isSelectableItem).map(this.options.getItemData);
    const localFilter = selectionFilterCreator.getLocalFilter(this.options.keyOf, this.equalKeys.bind(this), this.options.equalByReference, key);
    filteredItems = filteredItems.filter(localFilter);
    if (deselectedItems.length || !isSelectAll && filteredItems.length === keys.length) {
      deferred.resolve(filteredItems);
    } else {
      deferred = this._loadFilteredData(combinedFilter, localFilter, null, isSelectAll);
    }
    return deferred;
  }
  _replaceSelectionUpdate(items) {
    const internalKeys = [];
    const {
      keyOf
    } = this.options;
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
    const {
      allowNullValue
    } = this.options;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if ((!allowNullValue || key !== null) && !this.isItemKeySelected(key)) {
        _ui.default.log('W1002', key);
      }
    }
  }
  _isMultiSelectEnabled() {
    const {
      mode
    } = this.options;
    return mode === 'all' || mode === 'multiple';
  }
  _requestInProgress() {
    var _this$_lastLoadDeferr;
    return ((_this$_lastLoadDeferr = this._lastLoadDeferred) === null || _this$_lastLoadDeferr === void 0 ? void 0 : _this$_lastLoadDeferr.state()) === 'pending';
  }
  _concatRequestsItems(keys, isDeselect, oldRequestItems, updatedKeys) {
    let selectedItems;
    const deselectedItems = isDeselect ? keys : [];
    if (updatedKeys) {
      selectedItems = updatedKeys;
    } else {
      selectedItems = (0, _array.removeDuplicates)(keys, this.options.selectedItemKeys);
    }
    return {
      addedItems: oldRequestItems.added.concat(selectedItems),
      removedItems: oldRequestItems.removed.concat(deselectedItems),
      keys
    };
  }
  _collectLastRequestData(keys, isDeselect, isSelectAll, updatedKeys) {
    const isDeselectAll = isDeselect && isSelectAll;
    const oldRequestItems = {
      added: [],
      removed: []
    };
    const multiSelectEnabled = this._isMultiSelectEnabled();
    let lastRequestData = multiSelectEnabled ? this._lastRequestData : {};
    if (multiSelectEnabled) {
      if (this._shouldMergeWithLastRequest) {
        if (isDeselectAll) {
          this._lastLoadDeferred.reject();
          lastRequestData = {};
        } else if (!(0, _array_compare.isKeysEqual)(keys, this.options.selectedItemKeys)) {
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
      var _this$_lastRequestDat, _this$_lastRequestDat2;
      currentKeys = (0, _array.removeDuplicates)(keys.concat((_this$_lastRequestDat = this._lastRequestData) === null || _this$_lastRequestDat === void 0 ? void 0 : _this$_lastRequestDat.addedItems), (_this$_lastRequestDat2 = this._lastRequestData) === null || _this$_lastRequestDat2 === void 0 ? void 0 : _this$_lastRequestDat2.removedItems);
      currentKeys = (0, _array.getUniqueValues)(currentKeys);
    }
    return currentKeys;
  }
  _loadSelectedItems(keys, isDeselect, isSelectAll, updatedKeys) {
    let forceCombinedFilter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    const that = this;
    const deferred = (0, _deferred.Deferred)();
    const filter = that.options.filter();
    this._shouldMergeWithLastRequest = this._requestInProgress();
    this._lastRequestData = this._collectLastRequestData(keys, isDeselect, isSelectAll, updatedKeys);
    (0, _deferred.when)(that._lastLoadDeferred).always(() => {
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
  selectedItemKeys(keys, preserve, isDeselect, isSelectAll, updatedKeys) {
    let forceCombinedFilter = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    const that = this;
    const deferred = that._loadSelectedItems(keys, isDeselect, isSelectAll, updatedKeys, forceCombinedFilter);
    deferred.done(items => {
      if (preserve) {
        that._preserveSelectionUpdate(items, isDeselect);
      } else {
        that._replaceSelectionUpdate(items);
      }
      
      that.onSelectionChanged();
    });
    return deferred;
  }
  addSelectedItem(key, itemData) {
    if ((0, _type.isDefined)(itemData) && !this.options.ignoreDisabledItems && itemData.disabled) {
      if (this.options.disabledItemKeys.indexOf(key) === -1) {
        this.options.disabledItemKeys.push(key);
      }
      return;
    }
    const keyHash = this._getKeyHash(key);
    if (this._indexOfSelectedItemKey(keyHash) === -1) {
      if (!(0, _type.isObject)(keyHash) && this.options.keyHashIndices) {
        this.options.keyHashIndices[keyHash] = [this.options.selectedItemKeys.length];
      }
      this.options.selectedItemKeys.push(key);
      this.options.addedItemKeys.push(key);
      this.options.addedItems.push(itemData);
      this.options.selectedItems.push(itemData);
    }
  }
  _getSelectedIndexByKey(key, ignoreIndicesMap) {
    const {
      selectedItemKeys
    } = this.options;
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
      indices = indices.filter(index => !ignoreIndicesMap[index]);
    }
    return indices && indices[0] >= 0 ? indices[0] : -1;
  }
  _indexOfSelectedItemKey(key, ignoreIndicesMap) {
    let selectedIndex;
    if (this.options.equalByReference) {
      selectedIndex = this.options.selectedItemKeys.indexOf(key);
    } else if ((0, _type.isObject)(key)) {
      selectedIndex = this._getSelectedIndexByKey(key, ignoreIndicesMap);
    } else {
      selectedIndex = this._getSelectedIndexByHash(key, ignoreIndicesMap);
    }
    return selectedIndex;
  }
  _shiftSelectedKeyIndices(keyIndex) {
    for (let currentKeyIndex = keyIndex; currentKeyIndex < this.options.selectedItemKeys.length; currentKeyIndex++) {
      const currentKey = this.options.selectedItemKeys[currentKeyIndex];
      const currentKeyHash = (0, _common.getKeyHash)(currentKey);
      const currentKeyIndices = this.options.keyHashIndices[currentKeyHash];
      if (!currentKeyIndices) continue;
      for (let i = 0; i < currentKeyIndices.length; i++) {
        if (currentKeyIndices[i] > keyIndex) {
          currentKeyIndices[i]--;
        }
      }
    }
  }
  removeSelectedItem(key, keyIndicesToRemoveMap, isDisabled) {
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
    if ((0, _type.isObject)(keyHash) || !this.options.keyHashIndices) {
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
    return this.options.equalByReference ? key : (0, _common.getKeyHash)(key);
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
  isItemDataSelected(itemData) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const key = this.options.keyOf(itemData);
    return this.isItemKeySelected(key, options);
  }
  isItemKeySelected(key) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
      return (0, _deferred.Deferred)().resolve([]);
    }
    const selectionFilterCreator = new _selection_filter.SelectionFilterCreator(keys);
    const combinedFilter = selectionFilterCreator.getCombinedFilter(keyExpr, filter, true);
    return this._loadFilteredData(combinedFilter);
  }
}
exports.default = StandardStrategy;