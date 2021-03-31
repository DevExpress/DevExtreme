import { getKeyHash } from '../../core/utils/common';
import { isDefined, isObject } from '../../core/utils/type';
import { removeDuplicates, uniqueValues } from '../../core/utils/array';
import { isKeysEqual } from '../../core/utils/array_compare';
import dataQuery from '../../data/query';
import { Deferred, when } from '../../core/utils/deferred';
import { SelectionFilterCreator } from '../../core/utils/selection_filter';
import errors from '../widget/ui.errors';
import SelectionStrategy from './selection.strategy';

export default SelectionStrategy.inherit({
    ctor: function(options) {
        this.callBase(options);
        this._initSelectedItemKeyHash();
    },

    _initSelectedItemKeyHash: function() {
        this._setOption('keyHashIndices', this.options.equalByReference ? null : {});
    },

    getSelectedItemKeys: function() {
        return this.options.selectedItemKeys.slice(0);
    },

    getSelectedItems: function() {
        return this.options.selectedItems.slice(0);
    },

    _preserveSelectionUpdate: function(items, isDeselect) {
        const keyOf = this.options.keyOf;
        let keyIndicesToRemoveMap;
        let keyIndex;
        let i;

        if(!keyOf) return;

        const isBatchDeselect = isDeselect && items.length > 1 && !this.options.equalByReference;

        if(isBatchDeselect) {
            keyIndicesToRemoveMap = {};
        }

        for(i = 0; i < items.length; i++) {
            const item = items[i];
            const key = keyOf(item);
            if(isDeselect) {
                keyIndex = this.removeSelectedItem(key, keyIndicesToRemoveMap);
                if(keyIndicesToRemoveMap && keyIndex >= 0) {
                    keyIndicesToRemoveMap[keyIndex] = true;
                }
            } else {
                this.addSelectedItem(key, item);
            }
        }

        if(isBatchDeselect) {
            this._batchRemoveSelectedItems(keyIndicesToRemoveMap);
        }
    },

    _batchRemoveSelectedItems: function(keyIndicesToRemoveMap) {
        const selectedItemKeys = this.options.selectedItemKeys.slice(0);
        const selectedItems = this.options.selectedItems.slice(0);

        this.options.selectedItemKeys.length = 0;
        this.options.selectedItems.length = 0;

        for(let i = 0; i < selectedItemKeys.length; i++) {
            if(!keyIndicesToRemoveMap[i]) {
                this.options.selectedItemKeys.push(selectedItemKeys[i]);
                this.options.selectedItems.push(selectedItems[i]);
            }
        }

        this._initSelectedItemKeyHash();
        this.updateSelectedItemKeyHash(this.options.selectedItemKeys);
    },

    _loadSelectedItemsCore: function(keys, isDeselect, isSelectAll) {
        let deferred = new Deferred();
        const key = this.options.key();

        if(!keys.length && !isSelectAll) {
            deferred.resolve([]);
            return deferred;
        }

        const filter = this.options.filter();
        if(isSelectAll && isDeselect && !filter) {
            deferred.resolve(this.getSelectedItems());
            return deferred;
        }

        const selectionFilterCreator = new SelectionFilterCreator(keys, isSelectAll);
        const combinedFilter = selectionFilterCreator.getCombinedFilter(key, filter);

        let deselectedItems = [];
        if(isDeselect) {
            deselectedItems = combinedFilter ? dataQuery(this.options.selectedItems).filter(combinedFilter).toArray() : this.options.selectedItems.slice(0);
        }

        let filteredItems = deselectedItems.length ? deselectedItems : this.options.plainItems(true).filter(this.options.isSelectableItem).map(this.options.getItemData);

        const localFilter = selectionFilterCreator.getLocalFilter(this.options.keyOf, this.equalKeys.bind(this), this.options.equalByReference, key);

        filteredItems = filteredItems.filter(localFilter);

        if(deselectedItems.length || (!isSelectAll && filteredItems.length === keys.length)) {
            deferred.resolve(filteredItems);
        } else {
            deferred = this._loadFilteredData(combinedFilter, localFilter, null, isSelectAll);
        }

        return deferred;
    },

    _replaceSelectionUpdate: function(items) {
        const internalKeys = [];
        const keyOf = this.options.keyOf;

        if(!keyOf) return;

        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            const key = keyOf(item);

            internalKeys.push(key);
        }

        this.setSelectedItems(internalKeys, items);
    },

    _warnOnIncorrectKeys: function(keys) {
        const allowNullValue = this.options.allowNullValue;

        for(let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if((!allowNullValue || key !== null) && !this.isItemKeySelected(key)) {
                errors.log('W1002', key);
            }
        }
    },

    _isMultiSelectEnabled: function() {
        const mode = this.options.mode;
        return mode === 'all' || mode === 'multiple';
    },

    _requestInProgress: function() {
        return this._lastLoadDeferred?.state() === 'pending';
    },

    _concatRequestsItems: function(keys, isDeselect, oldRequestItems) {
        const deselectedItems = isDeselect ? keys : [];

        return {
            addedItems: oldRequestItems.added.concat(removeDuplicates(keys, this.options.selectedItemKeys)),
            removedItems: oldRequestItems.removed.concat(deselectedItems),
            keys: keys
        };
    },

    _collectLastRequestData: function(keys, isDeselect, isSelectAll) {
        const isDeselectAll = isDeselect && isSelectAll;
        const oldRequestItems = {
            added: [],
            removed: []
        };
        const multiSelectEnabled = this._isMultiSelectEnabled();
        let lastRequestData = multiSelectEnabled ? this._lastRequestData : {};

        if(multiSelectEnabled) {
            if(this._requestInProgress()) {
                if(isDeselectAll) {
                    this._lastLoadDeferred.reject();
                    lastRequestData = {};
                } else if(!isKeysEqual(keys, this.options.selectedItemKeys)) {
                    oldRequestItems.added = lastRequestData.addedItems;
                    oldRequestItems.removed = lastRequestData.removedItems;

                    if(!isDeselect) {
                        this._lastLoadDeferred.reject();
                    }
                } else {
                    lastRequestData = {};
                }
            }

            lastRequestData = this._concatRequestsItems(keys, isDeselect, oldRequestItems);
        }

        return lastRequestData;
    },

    _updateKeysByLastRequestData: function(keys, isDeselect, isSelectAll) {
        let currentKeys = keys;
        if(this._isMultiSelectEnabled() && !isDeselect && !isSelectAll) {
            currentKeys = removeDuplicates(keys.concat(this._lastRequestData?.addedItems), this._lastRequestData?.removedItems);
            currentKeys = uniqueValues(currentKeys);
        }

        return currentKeys;
    },

    _loadSelectedItems: function(keys, isDeselect, isSelectAll) {
        const that = this;
        const deferred = new Deferred();

        this._lastRequestData = this._collectLastRequestData(keys, isDeselect, isSelectAll);

        when(that._lastLoadDeferred).always(function() {
            const currentKeys = that._updateKeysByLastRequestData(keys, isDeselect, isSelectAll);

            that._loadSelectedItemsCore(currentKeys, isDeselect, isSelectAll)
                .done(deferred.resolve)
                .fail(deferred.reject);
        });

        that._lastLoadDeferred = deferred;

        return deferred;
    },

    selectedItemKeys: function(keys, preserve, isDeselect, isSelectAll) {
        const that = this;
        const deferred = that._loadSelectedItems(keys, isDeselect, isSelectAll);

        deferred.done(function(items) {
            if(preserve) {
                that._preserveSelectionUpdate(items, isDeselect);
            } else {
                that._replaceSelectionUpdate(items);
            }
            ///#DEBUG
            if(!isSelectAll && !isDeselect) {
                that._warnOnIncorrectKeys(keys);
            }
            ///#ENDDEBUG
            that.onSelectionChanged();
        });

        return deferred;
    },

    addSelectedItem: function(key, itemData) {
        if(isDefined(itemData) && itemData.disabled) {
            if(this.options.disabledItemKeys.indexOf(key) === -1) {
                this.options.disabledItemKeys.push(key);
            }
            return;
        }

        const keyHash = this._getKeyHash(key);

        if(this._indexOfSelectedItemKey(keyHash) === -1) {
            if(!isObject(keyHash) && this.options.keyHashIndices) {
                this.options.keyHashIndices[keyHash] = [this.options.selectedItemKeys.length];
            }

            this.options.selectedItemKeys.push(key);
            this.options.addedItemKeys.push(key);
            this.options.addedItems.push(itemData);
            this.options.selectedItems.push(itemData);
        }
    },

    _getSelectedIndexByKey: function(key, ignoreIndicesMap) {
        const selectedItemKeys = this.options.selectedItemKeys;

        for(let index = 0; index < selectedItemKeys.length; index++) {
            if((!ignoreIndicesMap || !ignoreIndicesMap[index]) && this.equalKeys(selectedItemKeys[index], key)) {
                return index;
            }
        }
        return -1;
    },

    _getSelectedIndexByHash: function(key, ignoreIndicesMap) {
        let indices = this.options.keyHashIndices[key];

        if(indices && indices.length > 1 && ignoreIndicesMap) {
            indices = indices.filter(function(index) {
                return !ignoreIndicesMap[index];
            });
        }

        return indices && indices[0] >= 0 ? indices[0] : -1;
    },

    _indexOfSelectedItemKey: function(key, ignoreIndicesMap) {
        let selectedIndex;

        if(this.options.equalByReference) {
            selectedIndex = this.options.selectedItemKeys.indexOf(key);
        } else if(isObject(key)) {
            selectedIndex = this._getSelectedIndexByKey(key, ignoreIndicesMap);
        } else {
            selectedIndex = this._getSelectedIndexByHash(key, ignoreIndicesMap);
        }

        return selectedIndex;
    },

    _shiftSelectedKeyIndices: function(keyIndex) {
        for(let currentKeyIndex = keyIndex; currentKeyIndex < this.options.selectedItemKeys.length; currentKeyIndex++) {
            const currentKey = this.options.selectedItemKeys[currentKeyIndex];
            const currentKeyHash = getKeyHash(currentKey);
            const currentKeyIndices = this.options.keyHashIndices[currentKeyHash];

            if(!currentKeyIndices) continue;

            for(let i = 0; i < currentKeyIndices.length; i++) {
                if(currentKeyIndices[i] > keyIndex) {
                    currentKeyIndices[i]--;
                }
            }
        }
    },

    removeSelectedItem: function(key, keyIndicesToRemoveMap) {
        const keyHash = this._getKeyHash(key);
        const isBatchDeselect = !!keyIndicesToRemoveMap;
        const keyIndex = this._indexOfSelectedItemKey(keyHash, keyIndicesToRemoveMap);

        if(keyIndex < 0) {
            return keyIndex;
        }

        this.options.removedItemKeys.push(key);
        this.options.removedItems.push(this.options.selectedItems[keyIndex]);

        if(isBatchDeselect) {
            return keyIndex;
        }

        this.options.selectedItemKeys.splice(keyIndex, 1);
        this.options.selectedItems.splice(keyIndex, 1);

        if(isObject(keyHash) || !this.options.keyHashIndices) {
            return keyIndex;
        }

        const keyIndices = this.options.keyHashIndices[keyHash];

        if(!keyIndices) {
            return keyIndex;
        }

        keyIndices.shift();

        if(!keyIndices.length) {
            delete this.options.keyHashIndices[keyHash];
        }

        this._shiftSelectedKeyIndices(keyIndex);

        return keyIndex;
    },

    _updateAddedItemKeys: function(keys, items) {
        for(let i = 0; i < keys.length; i++) {
            if(!this.isItemKeySelected(keys[i])) {
                this.options.addedItemKeys.push(keys[i]);
                this.options.addedItems.push(items[i]);
            }
        }
    },

    _updateRemovedItemKeys: function(keys, oldSelectedKeys, oldSelectedItems) {
        for(let i = 0; i < oldSelectedKeys.length; i++) {
            if(!this.isItemKeySelected(oldSelectedKeys[i])) {
                this.options.removedItemKeys.push(oldSelectedKeys[i]);
                this.options.removedItems.push(oldSelectedItems[i]);
            }
        }
    },

    _getKeyHash: function(key) {
        return this.options.equalByReference ? key : getKeyHash(key);
    },

    setSelectedItems: function(keys, items) {
        this._updateAddedItemKeys(keys, items);

        const oldSelectedKeys = this.options.selectedItemKeys;
        const oldSelectedItems = this.options.selectedItems;

        if(!this.options.equalByReference) {
            this._initSelectedItemKeyHash();
            this.updateSelectedItemKeyHash(keys);
        }

        this._setOption('selectedItemKeys', keys);
        this._setOption('selectedItems', items);

        this._updateRemovedItemKeys(keys, oldSelectedKeys, oldSelectedItems);
    },

    isItemDataSelected: function(itemData, checkPending) {
        const key = this.options.keyOf(itemData);
        return this.isItemKeySelected(key, checkPending);
    },

    isItemKeySelected: function(key, checkPending) {
        let result;
        if(checkPending && this._lastRequestData && this._requestInProgress()) {
            result = this._lastRequestData.addedItems.indexOf(key) !== -1;
        }

        if(!result) {
            const keyHash = this._getKeyHash(key);
            const index = this._indexOfSelectedItemKey(keyHash);
            result = index !== -1;
        }

        return result;
    },

    getSelectAllState: function(visibleOnly) {
        if(visibleOnly) {
            return this._getVisibleSelectAllState();
        } else {
            return this._getFullSelectAllState();
        }
    }
});
