import Class from '@js/core/class';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { isRenderer } from '@js/core/utils/type';

const { abstract } = Class;

const EditStrategy = Class.inherit({

  ctor(collectionWidget) {
    this._collectionWidget = collectionWidget;
  },

  getIndexByItemData: abstract,

  getItemDataByIndex: abstract,

  getKeysByItems: abstract,

  getItemsByKeys: abstract,

  itemsGetter: abstract,

  getKeyByIndex(index) {
    const resultIndex = this._denormalizeItemIndex(index);

    return this.getKeysByItems([this.getItemDataByIndex(resultIndex)])[0];
  },

  _equalKeys(key1, key2) {
    if (this._collectionWidget._isKeySpecified()) {
      return equalByValue(key1, key2);
    }
    return key1 === key2;
  },

  beginCache() {
    this._cache = {};
  },

  endCache() {
    this._cache = null;
  },

  getIndexByKey: abstract,

  getNormalizedIndex(value) {
    if (this._isNormalizedItemIndex(value)) {
      return value;
    }

    if (this._isItemIndex(value)) {
      return this._normalizeItemIndex(value);
    }

    if (this._isNode(value)) {
      return this._getNormalizedItemIndex(value);
    }

    return this._normalizeItemIndex(this.getIndexByItemData(value));
  },

  getIndex(value) {
    if (this._isNormalizedItemIndex(value)) {
      return this._denormalizeItemIndex(value);
    }

    if (this._isItemIndex(value)) {
      return value;
    }

    if (this._isNode(value)) {
      return this._denormalizeItemIndex(this._getNormalizedItemIndex(value));
    }

    return this.getIndexByItemData(value);
  },

  getItemElement(value) {
    if (this._isNormalizedItemIndex(value)) {
      return this._getItemByNormalizedIndex(value);
    }

    if (this._isItemIndex(value)) {
      return this._getItemByNormalizedIndex(this._normalizeItemIndex(value));
    }

    if (this._isNode(value)) {
      return $(value);
    }

    const normalizedItemIndex = this._normalizeItemIndex(this.getIndexByItemData(value));
    return this._getItemByNormalizedIndex(normalizedItemIndex);
  },

  _isNode: (el) => domAdapter.isNode(el && isRenderer(el) ? el.get(0) : el),

  deleteItemAtIndex: abstract,

  itemPlacementFunc(movingIndex, destinationIndex) {
    return this._itemsFromSameParent(movingIndex, destinationIndex) && movingIndex < destinationIndex ? 'after' : 'before';
  },

  moveItemAtIndexToIndex: abstract,

  _isNormalizedItemIndex(index) {
    return (typeof index === 'number') && Math.round(index) === index;
  },

  _isItemIndex: abstract,

  _getNormalizedItemIndex: abstract,

  _normalizeItemIndex: abstract,

  _denormalizeItemIndex: abstract,

  _getItemByNormalizedIndex: abstract,

  _itemsFromSameParent: abstract,

});

export default EditStrategy;
