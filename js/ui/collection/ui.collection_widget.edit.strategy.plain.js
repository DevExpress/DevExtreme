var inArray = require('../../core/utils/array').inArray,
    EditStrategy = require('./ui.collection_widget.edit.strategy');


var PlainEditStrategy = EditStrategy.inherit({

    _getPlainItems: function() {
        return this._collectionWidget.option('items') || [];
    },

    getIndexByItemData: function(itemData) {
        var keyOf = this._collectionWidget.keyOf.bind(this._collectionWidget);
        if(keyOf) {
            return this.getIndexByKey(keyOf(itemData));
        } else {
            return inArray(itemData, this._getPlainItems());
        }
    },

    getItemDataByIndex: function(index) {
        return this._getPlainItems()[index];
    },

    deleteItemAtIndex: function(index) {
        this._getPlainItems().splice(index, 1);
    },

    itemsGetter: function() {
        return this._getPlainItems();
    },

    getKeysByItems: function(items) {
        var keyOf = this._collectionWidget.keyOf.bind(this._collectionWidget);
        var result = items;
        if(keyOf) {
            result = [];
            for(var i = 0; i < items.length; i++) {
                result.push(keyOf(items[i]));
            }
        }
        return result;
    },

    getIndexByKey: function(key) {
        var cache = this._cache,
            keys = cache && cache.keys || this.getKeysByItems(this._getPlainItems());

        if(cache && !cache.keys) {
            cache.keys = keys;
        }

        if(typeof key === 'object') {
            for(var i = 0, length = keys.length; i < length; i++) {
                if(this._equalKeys(key, keys[i])) return i;
            }
        } else {
            return keys.indexOf(key);
        }

        return -1;
    },

    getItemsByKeys: function(keys, items) {
        return (items || keys).slice();
    },

    moveItemAtIndexToIndex: function(movingIndex, destinationIndex) {
        var items = this._getPlainItems(),
            movedItemData = items[movingIndex];

        items.splice(movingIndex, 1);
        items.splice(destinationIndex, 0, movedItemData);
    },

    _isItemIndex: function(index) {
        return (typeof index === 'number') && Math.round(index) === index;
    },

    _getNormalizedItemIndex: function(itemElement) {
        return this._collectionWidget._itemElements().index(itemElement);
    },

    _normalizeItemIndex: function(index) {
        return index;
    },

    _denormalizeItemIndex: function(index) {
        return index;
    },

    _getItemByNormalizedIndex: function(index) {
        return index > -1 ? this._collectionWidget._itemElements().eq(index) : null;
    },

    _itemsFromSameParent: function() {
        return true;
    }

});

module.exports = PlainEditStrategy;
