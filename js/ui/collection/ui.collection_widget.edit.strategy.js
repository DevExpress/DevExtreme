var $ = require('../../core/renderer'),
    Class = require('../../core/class'),
    commonUtils = require('../../core/utils/common'),
    abstract = Class.abstract;


var EditStrategy = Class.inherit({

    ctor: function(collectionWidget) {
        this._collectionWidget = collectionWidget;
    },

    getIndexByItemData: abstract,

    getItemDataByIndex: abstract,

    getKeysByItems: abstract,

    getItemsByKeys: abstract,

    itemsGetter: abstract,

    getKeyByIndex: function(index) {
        var resultIndex = this._denormalizeItemIndex(index);

        return this.getKeysByItems([this.getItemDataByIndex(resultIndex)])[0];
    },

    _equalKeys: function(key1, key2) {
        if(this._collectionWidget._isKeySpecified()) {
            return commonUtils.equalByValue(key1, key2);
        } else {
            return key1 === key2;
        }
    },

    beginCache: function() {
        this._cache = {};
    },

    endCache: function() {
        this._cache = null;
    },

    getIndexByKey: abstract,

    getNormalizedIndex: function(value) {
        if(this._isNormalizedItemIndex(value)) {
            return value;
        }

        if(this._isItemIndex(value)) {
            return this._normalizeItemIndex(value);
        }

        if(this._isDOMNode(value)) {
            return this._getNormalizedItemIndex(value);
        }

        return this._normalizeItemIndex(this.getIndexByItemData(value));
    },

    getIndex: function(value) {
        if(this._isNormalizedItemIndex(value)) {
            return this._denormalizeItemIndex(value);
        }

        if(this._isItemIndex(value)) {
            return value;
        }

        if(this._isDOMNode(value)) {
            return this._denormalizeItemIndex(this._getNormalizedItemIndex(value));
        }

        return this.getIndexByItemData(value);
    },

    getItemElement: function(value) {
        if(this._isNormalizedItemIndex(value)) {
            return this._getItemByNormalizedIndex(value);
        }

        if(this._isItemIndex(value)) {
            return this._getItemByNormalizedIndex(this._normalizeItemIndex(value));
        }

        if(this._isDOMNode(value)) {
            return $(value);
        }

        var normalizedItemIndex = this._normalizeItemIndex(this.getIndexByItemData(value));
        return this._getItemByNormalizedIndex(normalizedItemIndex);
    },

    deleteItemAtIndex: abstract,

    itemPlacementFunc: function(movingIndex, destinationIndex) {
        return this._itemsFromSameParent(movingIndex, destinationIndex) && movingIndex < destinationIndex ? 'after' : 'before';
    },

    moveItemAtIndexToIndex: abstract,

    _isNormalizedItemIndex: function(index) {
        return (typeof index === 'number') && Math.round(index) === index;
    },

    _isDOMNode: function(value) {
        var $value;

        try {
            $value = $(value);
        } catch(error) {
            return false;
        }

        return $value && $value.length && $value.get(0).nodeType;
    },

    _isItemIndex: abstract,

    _getNormalizedItemIndex: abstract,

    _normalizeItemIndex: abstract,

    _denormalizeItemIndex: abstract,

    _getItemByNormalizedIndex: abstract,

    _itemsFromSameParent: abstract

});


module.exports = EditStrategy;
