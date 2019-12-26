const dataQuery = require('../../data/query');
const commonUtils = require('../../core/utils/common');
const typeUtils = require('../../core/utils/type');
const getKeyHash = commonUtils.getKeyHash;
const Class = require('../../core/class');
const Deferred = require('../../core/utils/deferred').Deferred;

module.exports = Class.inherit({
    ctor: function(options) {
        this.options = options;

        this._setOption('disabledItemKeys', []);
        this._clearItemKeys();
    },

    _clearItemKeys: function() {
        this._setOption('addedItemKeys', []);
        this._setOption('removedItemKeys', []);
        this._setOption('removedItems', []);
        this._setOption('addedItems', []);
    },

    validate: commonUtils.noop,

    _setOption: function(name, value) {
        this.options[name] = value;
    },

    onSelectionChanged: function() {
        const addedItemKeys = this.options.addedItemKeys;
        const removedItemKeys = this.options.removedItemKeys;
        const addedItems = this.options.addedItems;
        const removedItems = this.options.removedItems;
        const selectedItems = this.options.selectedItems;
        const selectedItemKeys = this.options.selectedItemKeys;
        const onSelectionChanged = this.options.onSelectionChanged || commonUtils.noop;

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
            if(typeUtils.isObject(key1) && typeUtils.isObject(key2)) {
                return key1 === key2;
            }
        }

        return commonUtils.equalByValue(key1, key2);
    },

    getSelectableItems: function(items) {
        return items.filter(function(item) {
            return !item.disabled;
        });
    },

    _clearSelection: function(keys, preserve, isDeselect, isSelectAll) {
        keys = keys || [];
        keys = Array.isArray(keys) ? keys : [keys];
        this.validate();

        return this.selectedItemKeys(keys, preserve, isDeselect, isSelectAll);
    },

    _loadFilteredData: function(remoteFilter, localFilter, select, isSelectAll) {
        const filterLength = encodeURI(JSON.stringify(remoteFilter)).length,
              needLoadAllData = this.options.maxFilterLengthInRequest && (filterLength > this.options.maxFilterLengthInRequest),
              deferred = new Deferred(),
              loadOptions = {
                  filter: needLoadAllData ? undefined : remoteFilter,
                  select: needLoadAllData ? this.options.dataFields() : select || this.options.dataFields()
              };

        if(remoteFilter && remoteFilter.length === 0) {
            deferred.resolve([]);
        } else {
            this.options.load(loadOptions)
                .done(function(items) {
                    let filteredItems = typeUtils.isPlainObject(items) ? items.data : items;

                    if(localFilter && !isSelectAll) {
                        filteredItems = filteredItems.filter(localFilter);
                    } else if(needLoadAllData) {
                        filteredItems = dataQuery(filteredItems).filter(remoteFilter).toArray();
                    }

                    deferred.resolve(filteredItems);
                })
                .fail(deferred.reject.bind(deferred));
        }

        return deferred;
    },

    updateSelectedItemKeyHash: function(keys) {
        for(let i = 0; i < keys.length; i++) {
            const keyHash = getKeyHash(keys[i]);

            if(!typeUtils.isObject(keyHash)) {
                this.options.keyHashIndices[keyHash] = this.options.keyHashIndices[keyHash] || [];

                const keyIndices = this.options.keyHashIndices[keyHash];
                keyIndices.push(i);
            }
        }
    },

    _isAnyItemSelected: function(items) {
        for(let i = 0; i < items.length; i++) {
            if(this.options.isItemSelected(items[i])) {
                return undefined;
            }
        }

        return false;
    },

    _getFullSelectAllState: function() {
        const items = this.options.plainItems();
        const dataFilter = this.options.filter();
        let selectedItems = this.options.selectedItems;

        if(dataFilter) {
            selectedItems = dataQuery(selectedItems).filter(dataFilter).toArray();
        }

        const selectedItemsLength = selectedItems.length;

        if(!selectedItemsLength) {
            return this._isAnyItemSelected(items);
        }

        if(selectedItemsLength >= this.options.totalCount() - this.options.disabledItemKeys.length) {
            return true;
        }
        return undefined;
    },

    _getVisibleSelectAllState: function() {
        const items = this.getSelectableItems(this.options.plainItems());
        let hasSelectedItems = false;
        let hasUnselectedItems = false;

        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemData = this.options.getItemData(item);
            const key = this.options.keyOf(itemData);

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
