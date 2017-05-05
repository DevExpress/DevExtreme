"use strict";

var $ = require("jquery"),
    dataQuery = require("../../data/query"),
    commonUtils = require("../../core/utils/common"),
    getKeyHash = commonUtils.getKeyHash,
    Class = require("../../core/class");

module.exports = Class.inherit({
    ctor: function(options) {
        this.options = options;

        this._clearItemKeys();
    },

    _clearItemKeys: function() {
        this._setOption("addedItemKeys", []);
        this._setOption("removedItemKeys", []);
        this._setOption("removedItems", []);
        this._setOption("addedItems", []);
    },

    validate: $.noop,

    _setOption: function(name, value) {
        this.options[name] = value;
    },

    onSelectionChanged: function() {
        var addedItemKeys = this.options.addedItemKeys,
            removedItemKeys = this.options.removedItemKeys,
            addedItems = this.options.addedItems,
            removedItems = this.options.removedItems,
            selectedItems = this.options.selectedItems,
            selectedItemKeys = this.options.selectedItemKeys,
            onSelectionChanged = this.options.onSelectionChanged || $.noop;

        this._clearItemKeys();
        onSelectionChanged({
            selectedItems: selectedItems,
            selectedItemKeys: selectedItemKeys,
            addedItemKeys: addedItemKeys,
            removedItemKeys: removedItemKeys,
            addedItems: addedItems,
            removedItems: removedItems
        });
    },

    equalKeys: function(key1, key2) {
        if(this.options.equalByReference) {
            if(commonUtils.isObject(key1) && commonUtils.isObject(key2)) {
                return key1 === key2;
            }
        }

        return commonUtils.equalByValue(key1, key2);
    },

    _clearSelection: function(keys, preserve, isDeselect, isSelectAll) {
        keys = keys || [];
        keys = $.isArray(keys) ? keys : [keys];
        this.validate();

        return this.selectedItemKeys(keys, preserve, isDeselect, isSelectAll);
    },

    _loadFilteredData: function(remoteFilter, localFilter, select) {
        var filterLength = encodeURI(JSON.stringify(remoteFilter)).length,
            needLoadAllData = this.options.maxFilterLengthInRequest && (filterLength > this.options.maxFilterLengthInRequest),
            deferred = $.Deferred(),
            loadOptions = {
                filter: needLoadAllData ? undefined : remoteFilter,
                select: needLoadAllData ? this.options.dataFields() : select || this.options.dataFields()
            };

        if(remoteFilter && remoteFilter.length === 0) {
            deferred.resolve([]);
        } else {
            this.options.load(loadOptions)
                .done(function(items) {
                    var filteredItems = $.isPlainObject(items) ? items.data : items;

                    if(needLoadAllData) {
                        filteredItems = dataQuery(filteredItems).filter(remoteFilter).toArray();
                    }

                    if(localFilter) {
                        filteredItems = filteredItems.filter(localFilter);
                    }

                    deferred.resolve(filteredItems);
                })
                .fail($.proxy(deferred.reject, deferred));
        }

        return deferred;
    },

    updateSelectedItemKeyHash: function(keys) {
        for(var i = 0; i < keys.length; i++) {
            var keyHash = getKeyHash(keys[i]);

            if(!commonUtils.isObject(keyHash)) {
                this.options.keyHashIndices[keyHash] = this.options.keyHashIndices[keyHash] || [];

                var keyIndices = this.options.keyHashIndices[keyHash];
                keyIndices.push(i);
            }
        }
    },

    _isAnyItemSelected: function(items) {
        for(var i = 0; i < items.length; i++) {
            if(this.options.isItemSelected(items[i])) {
                return undefined;
            }
        }

        return false;
    },

    _getFullSelectAllState: function() {
        var items = this.options.plainItems(),
            dataFilter = this.options.filter(),
            selectedItems = this.options.selectedItems;

        if(dataFilter) {
            selectedItems = dataQuery(selectedItems).filter(dataFilter).toArray();
        }

        var selectedItemsLength = selectedItems.length;

        if(!selectedItemsLength) {
            return this._isAnyItemSelected(items);
        }

        if(selectedItemsLength >= this.options.totalCount()) {
            return true;
        }
        return undefined;
    },

    _getVisibleSelectAllState: function() {
        var items = this.options.plainItems(),
            hasSelectedItems = false,
            hasUnselectedItems = false;

        for(var i = 0; i < items.length; i++) {
            var item = items[i],
                itemData = this.options.getItemData(item),
                key = this.options.keyOf(itemData);

            if(this.options.isSelectableItem(item)) {
                if(this.isItemKeySelected(key)) {
                    hasSelectedItems = true;
                } else {
                    hasUnselectedItems = true;
                }
            }
        }

        if(hasSelectedItems) {
            return !hasUnselectedItems ? true : undefined;
        } else {
            return false;
        }
    }
});
