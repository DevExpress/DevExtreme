var Class = require('../../core/class'),
    deferredStrategy = require('./selection.strategy.deferred'),
    standardStrategy = require('./selection.strategy.standard'),
    extend = require('../../core/utils/extend').extend,
    noop = require('../../core/utils/common').noop,
    isDefined = require('../../core/utils/type').isDefined,
    Deferred = require('../../core/utils/deferred').Deferred;

module.exports = Class.inherit({
    ctor: function(options) {
        this.options = extend(this._getDefaultOptions(), options, {
            selectedItemKeys: options.selectedKeys || []
        });

        this._selectionStrategy = this.options.deferred ? new deferredStrategy(this.options) : new standardStrategy(this.options);
        this._focusedItemIndex = -1;

        if(!this.options.equalByReference) {
            this._selectionStrategy.updateSelectedItemKeyHash(this.options.selectedItemKeys);
        }
    },

    _getDefaultOptions: function() {
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
            keyOf: function(item) { return item; },
            load: function() { return new Deferred().resolve([]); },
            totalCount: function() { return -1; },
            isSelectableItem: function() { return true; },
            isItemSelected: function() { return false; },
            getItemData: function(item) { return item; },
            dataFields: noop,
            filter: noop
        };
    },

    validate: function() {
        this._selectionStrategy.validate();
    },

    getSelectedItemKeys: function() {
        return this._selectionStrategy.getSelectedItemKeys();
    },

    getSelectedItems: function() {
        return this._selectionStrategy.getSelectedItems();
    },

    selectionFilter: function(value) {
        if(value === undefined) {
            return this.options.selectionFilter;
        }

        var filterIsChanged = this.options.selectionFilter !== value && JSON.stringify(this.options.selectionFilter) !== JSON.stringify(value);

        this.options.selectionFilter = value;

        filterIsChanged && this.onSelectionChanged();
    },

    setSelection: function(keys) {
        return this.selectedItemKeys(keys);
    },

    select: function(keys) {
        return this.selectedItemKeys(keys, true);
    },

    deselect: function(keys) {
        return this.selectedItemKeys(keys, true, true);
    },

    selectedItemKeys: function(keys, preserve, isDeselect, isSelectAll) {
        var that = this;

        keys = keys || [];
        keys = Array.isArray(keys) ? keys : [keys];
        that.validate();

        return this._selectionStrategy.selectedItemKeys(keys, preserve, isDeselect, isSelectAll);
    },

    clearSelection: function() {
        return this.selectedItemKeys([]);
    },

    _addSelectedItem: function(itemData, key) {
        this._selectionStrategy.addSelectedItem(key, itemData);
    },

    _removeSelectedItem: function(key) {
        this._selectionStrategy.removeSelectedItem(key);
    },

    _setSelectedItems: function(keys, items) {
        this._selectionStrategy.setSelectedItems(keys, items);
    },

    onSelectionChanged: function() {
        this._selectionStrategy.onSelectionChanged();
    },

    changeItemSelection: function(itemIndex, keys) {
        var isSelectedItemsChanged,
            items = this.options.plainItems(),
            item = items[itemIndex];

        if(!this.isSelectable() || !this.isDataItem(item)) {
            return false;
        }

        var itemData = this.options.getItemData(item),
            itemKey = this.options.keyOf(itemData);

        keys = keys || {};

        if(keys.shift && this.options.mode === 'multiple' && this._focusedItemIndex >= 0) {
            isSelectedItemsChanged = this.changeItemSelectionWhenShiftKeyPressed(itemIndex, items);
        } else if(keys.control) {
            this._resetItemSelectionWhenShiftKeyPressed();
            var isSelected = this._selectionStrategy.isItemDataSelected(itemData);
            if(this.options.mode === 'single') {
                this.clearSelectedItems();
            }
            if(isSelected) {
                this._removeSelectedItem(itemKey);
            } else {
                this._addSelectedItem(itemData, itemKey);
            }
            isSelectedItemsChanged = true;
        } else {
            this._resetItemSelectionWhenShiftKeyPressed();
            var isKeysEqual = this._selectionStrategy.equalKeys(this.options.selectedItemKeys[0], itemKey);
            if(this.options.selectedItemKeys.length !== 1 || !isKeysEqual) {
                this._setSelectedItems([itemKey], [itemData]);
                isSelectedItemsChanged = true;
            }
        }

        if(isSelectedItemsChanged) {
            this._focusedItemIndex = itemIndex;
            this.onSelectionChanged();
            return true;
        }
    },

    isDataItem: function(item) {
        return this.options.isSelectableItem(item);
    },

    isSelectable: function() {
        return this.options.mode === 'single' || this.options.mode === 'multiple';
    },

    isItemDataSelected: function(data) {
        return this._selectionStrategy.isItemDataSelected(data);
    },

    isItemSelected: function(arg) {
        return this._selectionStrategy.isItemKeySelected(arg);
    },

    _resetItemSelectionWhenShiftKeyPressed: function() {
        delete this._shiftFocusedItemIndex;
    },

    _resetFocusedItemIndex: function() {
        this._focusedItemIndex = -1;
    },

    changeItemSelectionWhenShiftKeyPressed: function(itemIndex, items) {
        var isSelectedItemsChanged = false,
            itemIndexStep,
            index,
            keyOf = this.options.keyOf,
            focusedItem = items[this._focusedItemIndex],
            focusedData = this.options.getItemData(focusedItem),
            focusedKey = keyOf(focusedData),
            isFocusedItemSelected = focusedItem && this.isItemDataSelected(focusedData);

        if(!isDefined(this._shiftFocusedItemIndex)) {
            this._shiftFocusedItemIndex = this._focusedItemIndex;
        }

        var data,
            itemKey;

        if(this._shiftFocusedItemIndex !== this._focusedItemIndex) {
            itemIndexStep = this._focusedItemIndex < this._shiftFocusedItemIndex ? 1 : -1;
            for(index = this._focusedItemIndex; index !== this._shiftFocusedItemIndex; index += itemIndexStep) {
                if(this.isDataItem(items[index])) {
                    itemKey = keyOf(this.options.getItemData(items[index]));
                    this._removeSelectedItem(itemKey);
                    isSelectedItemsChanged = true;
                }
            }
        }

        if(itemIndex !== this._shiftFocusedItemIndex) {
            itemIndexStep = itemIndex < this._shiftFocusedItemIndex ? 1 : -1;
            for(index = itemIndex; index !== this._shiftFocusedItemIndex; index += itemIndexStep) {
                if(this.isDataItem(items[index])) {
                    data = this.options.getItemData(items[index]);
                    itemKey = keyOf(data);

                    this._addSelectedItem(data, itemKey);
                    isSelectedItemsChanged = true;
                }
            }
        }

        if(this.isDataItem(focusedItem) && !isFocusedItemSelected) {
            this._addSelectedItem(focusedData, focusedKey);
            isSelectedItemsChanged = true;
        }

        return isSelectedItemsChanged;
    },

    clearSelectedItems: function() {
        this._setSelectedItems([], []);
    },

    selectAll: function(isOnePage) {
        this._resetFocusedItemIndex();

        if(isOnePage) {
            return this._onePageSelectAll(false);
        } else {
            return this.selectedItemKeys([], true, false, true);
        }
    },

    deselectAll: function(isOnePage) {
        this._resetFocusedItemIndex();

        if(isOnePage) {
            return this._onePageSelectAll(true);
        } else {
            return this.selectedItemKeys([], true, true, true);
        }
    },

    _onePageSelectAll: function(isDeselect) {
        var items = this._selectionStrategy.getSelectableItems(this.options.plainItems());
        for(var i = 0; i < items.length; i++) {
            var item = items[i];

            if(this.isDataItem(item)) {
                var itemData = this.options.getItemData(item),
                    itemKey = this.options.keyOf(itemData),
                    isSelected = this.isItemSelected(itemKey);

                if(!isSelected && !isDeselect) {
                    this._addSelectedItem(itemData, itemKey);
                }

                if(isSelected && isDeselect) {
                    this._removeSelectedItem(itemKey);
                }
            }
        }

        this.onSelectionChanged();

        return new Deferred().resolve();
    },

    getSelectAllState: function(visibleOnly) {
        return this._selectionStrategy.getSelectAllState(visibleOnly);
    }
});
