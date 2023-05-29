import dataQuery from '../../data/query';
import { getKeyHash, noop, equalByValue } from '../../core/utils/common';
import { isPlainObject, isObject } from '../../core/utils/type';
import { Deferred } from '../../core/utils/deferred';

export default class SelectionStrategy {
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

    onSelectionChanged() {
        const addedItemKeys = this.options.addedItemKeys;
        const removedItemKeys = this.options.removedItemKeys;
        const addedItems = this.options.addedItems;
        const removedItems = this.options.removedItems;
        const selectedItems = this.options.selectedItems;
        const selectedItemKeys = this.options.selectedItemKeys;
        const onSelectionChanged = this.options.onSelectionChanged || noop;

        this._clearItemKeys();
        onSelectionChanged({
            selectedItems: selectedItems,
            selectedItemKeys: selectedItemKeys,
            addedItemKeys: addedItemKeys,
            removedItemKeys: removedItemKeys,
            addedItems: addedItems,
            removedItems: removedItems
        });
    }

    equalKeys(key1, key2) {
        if(this.options.equalByReference) {
            if(isObject(key1) && isObject(key2)) {
                return key1 === key2;
            }
        }

        return equalByValue(key1, key2);
    }

    getSelectableItems(items) {
        return items.filter(function(item) {
            return !item?.disabled;
        });
    }

    _clearSelection(keys, preserve, isDeselect, isSelectAll) {
        keys = keys || [];
        keys = Array.isArray(keys) ? keys : [keys];
        this.validate();

        return this.selectedItemKeys(keys, preserve, isDeselect, isSelectAll);
    }

    _removeTemplateProperty(remoteFilter) {
        if(Array.isArray(remoteFilter)) {
            return remoteFilter.map((f) => this._removeTemplateProperty(f));
        }

        if(isObject(remoteFilter)) {
            delete remoteFilter.template;
        }

        return remoteFilter;
    }

    _loadFilteredData(remoteFilter, localFilter, select, isSelectAll) {
        const filterLength = encodeURI(JSON.stringify(this._removeTemplateProperty(remoteFilter))).length;
        const needLoadAllData = this.options.maxFilterLengthInRequest && (filterLength > this.options.maxFilterLengthInRequest);
        const deferred = new Deferred();
        const loadOptions = {
            filter: needLoadAllData ? undefined : remoteFilter,
            select: needLoadAllData ? this.options.dataFields() : select || this.options.dataFields()
        };

        if(remoteFilter && remoteFilter.length === 0) {
            deferred.resolve([]);
        } else {
            this.options.load(loadOptions)
                .done(function(items) {
                    let filteredItems = isPlainObject(items) ? items.data : items;

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
    }

    updateSelectedItemKeyHash(keys) {
        for(let i = 0; i < keys.length; i++) {
            const keyHash = getKeyHash(keys[i]);

            if(!isObject(keyHash)) {
                this.options.keyHashIndices[keyHash] = this.options.keyHashIndices[keyHash] || [];

                const keyIndices = this.options.keyHashIndices[keyHash];
                keyIndices.push(i);
            }
        }
    }

    _isAnyItemSelected(items) {
        for(let i = 0; i < items.length; i++) {
            if(this.options.isItemSelected(items[i])) {
                return undefined;
            }
        }

        return false;
    }

    _getFullSelectAllState() {
        const items = this.options.plainItems();
        const dataFilter = this.options.filter();
        let selectedItems = this.options.ignoreDisabledItems ? this.options.selectedItems : this.options.selectedItems.filter(item => !item?.disabled);

        if(dataFilter) {
            selectedItems = dataQuery(selectedItems).filter(dataFilter).toArray();
        }

        const selectedItemsLength = selectedItems.length;
        const disabledItemsLength = items.length - this.getSelectableItems(items).length;

        if(!selectedItemsLength) {
            return this._isAnyItemSelected(items);
        }

        if(selectedItemsLength >= this.options.totalCount() - disabledItemsLength) {
            return true;
        }
        return undefined;
    }

    _getVisibleSelectAllState() {
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
}
