"use strict";

var $ = require("jquery"),
    commonUtils = require("../../core/utils/common"),
    getKeyHash = commonUtils.getKeyHash,
    dataQuery = require("../../data/query"),
    when = require("../../integration/jquery/deferred").when,
    errors = require("../widget/ui.errors"),
    SelectionStrategy = require("./selection.strategy");

function SelectionFilterCreator(keyExpr, selectedItemKeys, isSelectAll, equalKeys, keyOf) {

    this.getLocalFilter = function() {
        return functionFilter;
    };

    this.getExpr = function() {
        if(!keyExpr) return;

        var filterExpr;
        for(var i = 0, length = selectedItemKeys.length; i < length; i++) {
            filterExpr = filterExpr || [];

            var itemKeyValue = selectedItemKeys[i],
                filterExprPart;

            if(i > 0) {
                filterExpr.push(isSelectAll ? "and" : "or");
            }

            if(commonUtils.isString(keyExpr)) {
                filterExprPart = getFilterForPlainKey(itemKeyValue);
            } else {
                filterExprPart = getFilterForCompositeKey(itemKeyValue);
            }

            filterExpr.push(filterExprPart);
        }
        if(filterExpr && filterExpr.length === 1) {
            filterExpr = filterExpr[0];
        }

        this._filter = filterExpr;
        return filterExpr;
    };

    this.getCombinedFilter = function(dataSourceFilter) {
        var filterExpr = this.getExpr(),
            combinedFilter = filterExpr;

        if(isSelectAll && dataSourceFilter) {
            if(filterExpr) {
                combinedFilter = [];
                combinedFilter.push(filterExpr);
                combinedFilter.push(dataSourceFilter);
            } else {
                combinedFilter = dataSourceFilter;
            }
        }

        return combinedFilter;
    };

    var functionFilter = function(item) {
        for(var i = 0; i < selectedItemKeys.length; i++) {
            if(equalKeys(selectedItemKeys[i], keyOf(item))) {
                return !isSelectAll;
            }
        }
        return !!isSelectAll;
    };

    var getFilterForPlainKey = function(keyValue, key) {
        return [key || keyExpr, isSelectAll ? "<>" : "=", keyValue];
    };

    var getFilterForCompositeKey = function(itemKeyValue) {
        var filterExpr = [];

        for(var i = 0, length = keyExpr.length; i < length; i++) {
            if(i > 0) {
                filterExpr.push(isSelectAll ? "or" : "and");
            }
            var currentKeyExpr = keyExpr[i],
                currentKeyValue = itemKeyValue && itemKeyValue[currentKeyExpr],
                filterExprPart = getFilterForPlainKey(currentKeyValue, currentKeyExpr);

            filterExpr.push(filterExprPart);
        }

        return filterExpr;
    };
}

module.exports = SelectionStrategy.inherit({
    ctor: function(options) {
        this.callBase(options);
        this._initSelectedItemKeyHash();
    },

    _initSelectedItemKeyHash: function() {
        this._setOption("keyHashIndices", this.options.equalByReference ? null : {});
    },

    getSelectedItemKeys: function() {
        return this.options.selectedItemKeys.slice(0);
    },

    getSelectedItems: function() {
        return this.options.selectedItems.slice(0);
    },

    _preserveSelectionUpdate: function(items, isDeselect) {
        var keyOf = this.options.keyOf,
            keyIndicesToRemoveMap,
            keyIndex,
            i;

        if(!keyOf) return;

        var isBatchDeselect = isDeselect && items.length > 1 && !this.options.equalByReference;

        if(isBatchDeselect) {
            keyIndicesToRemoveMap = {};
        }

        for(i = 0; i < items.length; i++) {
            var item = items[i],
                key = keyOf(item);
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
        var selectedItemKeys = this.options.selectedItemKeys.slice(0);
        var selectedItems = this.options.selectedItems.slice(0);

        this.options.selectedItemKeys.length = 0;
        this.options.selectedItems.length = 0;

        for(var i = 0; i < selectedItemKeys.length; i++) {
            if(!keyIndicesToRemoveMap[i]) {
                this.options.selectedItemKeys.push(selectedItemKeys[i]);
                this.options.selectedItems.push(selectedItems[i]);
            }
        }

        this._initSelectedItemKeyHash();
        this.updateSelectedItemKeyHash(this.options.selectedItemKeys);
    },

    _loadSelectedItemsCore: function(keys, isDeselect, isSelectAll) {
        var deferred = $.Deferred(),
            key = this.options.key;

        if(!keys.length && !isSelectAll) {
            deferred.resolve([]);
            return deferred;
        }

        if(isSelectAll && isDeselect && !this.options.filter) {
            return this._clearSelection();
        }

        var selectionFilterCreator = new SelectionFilterCreator(key(), keys, isSelectAll, this.equalKeys.bind(this), this.options.keyOf),
            combinedFilter = selectionFilterCreator.getCombinedFilter(this.options.filter());

        var deselectedItems = [];
        if(isDeselect) {
            deselectedItems = combinedFilter ? dataQuery(this.options.selectedItems).filter(combinedFilter).toArray() : this.options.selectedItems.slice(0);
        }

        var filteredItems = deselectedItems.length ? deselectedItems : this.options.plainItems().filter(this.options.isSelectableItem).map(this.options.getItemData);

        var localFilter = selectionFilterCreator.getLocalFilter();

        filteredItems = filteredItems.filter(localFilter);

        if(!isSelectAll && (deselectedItems.length || filteredItems.length === keys.length)) {
            deferred.resolve(filteredItems);
        } else {
            deferred = this._loadFilteredData(combinedFilter, localFilter);
        }

        return deferred;
    },

    _replaceSelectionUpdate: function(items) {
        var internalKeys = [],
            keyOf = this.options.keyOf;

        if(!keyOf) return;

        for(var i = 0; i < items.length; i++) {
            var item = items[i],
                key = keyOf(item);

            internalKeys.push(key);
        }

        this.setSelectedItems(internalKeys, items);
    },

    _warnOnIncorrectKeys: function(keys) {
        for(var i = 0; i < keys.length; i++) {
            if(!this.isItemKeySelected(keys[i])) {
                errors.log("W1002", keys[i]);
            }
        }
    },

    _loadSelectedItems: function(keys, isDeselect, isSelectAll) {
        var that = this,
            deferred = $.Deferred();

        when(that._lastLoadDeferred).always(function() {
            that._loadSelectedItemsCore(keys, isDeselect, isSelectAll)
                .done(deferred.resolve)
                .fail(deferred.reject);
        });

        that._lastLoadDeferred = deferred;

        return deferred;
    },

    selectedItemKeys: function(keys, preserve, isDeselect, isSelectAll) {
        var that = this,
            deferred = that._loadSelectedItems(keys, isDeselect, isSelectAll);

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
        var keyHash = this._getKeyHash(key);

        if(this._indexOfSelectedItemKey(keyHash) === -1) {
            if(!commonUtils.isObject(keyHash) && this.options.keyHashIndices) {
                this.options.keyHashIndices[keyHash] = [this.options.selectedItemKeys.length];
            }

            this.options.selectedItemKeys.push(key);
            this.options.addedItemKeys.push(key);
            this.options.addedItems.push(itemData);
            this.options.selectedItems.push(itemData);
        }
    },

    _getSelectedIndexByKey: function(key, ignoreIndicesMap) {
        var selectedItemKeys = this.options.selectedItemKeys;

        for(var index = 0; index < selectedItemKeys.length; index++) {
            if((!ignoreIndicesMap || !ignoreIndicesMap[index]) && this.equalKeys(selectedItemKeys[index], key)) {
                return index;
            }
        }
        return -1;
    },

    _getSelectedIndexByHash: function(key, ignoreIndicesMap) {
        var indices = this.options.keyHashIndices[key];

        if(indices && indices.length > 1 && ignoreIndicesMap) {
            indices = indices.filter(function(index) {
                return !ignoreIndicesMap[index];
            });
        }

        return indices && indices[0] >= 0 ? indices[0] : -1;
    },

    _indexOfSelectedItemKey: function(key, ignoreIndicesMap) {
        var selectedIndex;

        if(this.options.equalByReference) {
            selectedIndex = this.options.selectedItemKeys.indexOf(key);
        } else if(commonUtils.isObject(key)) {
            selectedIndex = this._getSelectedIndexByKey(key, ignoreIndicesMap);
        } else {
            selectedIndex = this._getSelectedIndexByHash(key, ignoreIndicesMap);
        }

        return selectedIndex;
    },

    _shiftSelectedKeyIndices: function(keyIndex) {
        for(var currentKeyIndex = keyIndex; currentKeyIndex < this.options.selectedItemKeys.length; currentKeyIndex++) {
            var currentKey = this.options.selectedItemKeys[currentKeyIndex],
                currentKeyHash = getKeyHash(currentKey),
                currentKeyIndices = this.options.keyHashIndices[currentKeyHash];

            if(!currentKeyIndices) continue;

            for(var i = 0; i < currentKeyIndices.length; i++) {
                if(currentKeyIndices[i] > keyIndex) {
                    currentKeyIndices[i]--;
                }
            }
        }
    },

    removeSelectedItem: function(key, keyIndicesToRemoveMap) {
        var keyHash = this._getKeyHash(key),
            isBatchDeselect = !!keyIndicesToRemoveMap,
            keyIndex = this._indexOfSelectedItemKey(keyHash, keyIndicesToRemoveMap);

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

        if(commonUtils.isObject(keyHash) || !this.options.keyHashIndices) {
            return keyIndex;
        }

        var keyIndices = this.options.keyHashIndices[keyHash];

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

    _needRemoveItemKey: function(keys, key) {
        var hashIndices = this.options.keyHashIndices;

        if(!hashIndices) {
            return keys.indexOf(key) < 0;
        }

        var hash = this._getKeyHash(key);

        for(var i = 0; i < keys.length; i++) {
            var keyHash = this._getKeyHash(keys[i]);

            if(this.equalKeys(hash, keyHash)) {
                return false;
            }
        }
        return true;
    },

    _updateAddedItemKeys: function(keys, items) {
        for(var i = 0; i < keys.length; i++) {
            if(this._indexOfSelectedItemKey(keys[i]) < 0) {
                this.options.addedItemKeys.push(keys[i]);
                this.options.addedItems.push(items[i]);
            }
        }
    },

    _updateRemovedItemKeys: function(keys) {
        var oldSelectedKeys = this.options.selectedItemKeys,
            oldSelectedItems = this.options.selectedItems;

        for(var i = 0; i < oldSelectedKeys.length; i++) {
            if(this._needRemoveItemKey(keys, oldSelectedKeys[i])) {
                this.options.removedItemKeys.push(oldSelectedKeys[i]);
                this.options.removedItems.push(oldSelectedItems[i]);
            }
        }
    },

    _getKeyHash: function(key) {
        return this.options.equalByReference ? key : getKeyHash(key);
    },

    setSelectedItems: function(keys, items) {
        this._updateRemovedItemKeys(keys, items);
        this._updateAddedItemKeys(keys, items);

        if(!this.options.equalByReference) {
            this._initSelectedItemKeyHash();
            this.updateSelectedItemKeyHash(keys);
        }

        this._setOption("selectedItemKeys", keys);
        this._setOption("selectedItems", items);
    },

    isItemDataSelected: function(itemData) {
        var key = this.options.keyOf(itemData);
        return this.isItemKeySelected(key);
    },

    isItemKeySelected: function(key) {
        var keyHash = this._getKeyHash(key);
        var index = this._indexOfSelectedItemKey(keyHash);

        return index !== -1;
    },

    getSelectAllState: function(visibleOnly) {
        if(visibleOnly) {
            return this._getVisibleSelectAllState();
        } else {
            return this._getFullSelectAllState();
        }
    }
});
