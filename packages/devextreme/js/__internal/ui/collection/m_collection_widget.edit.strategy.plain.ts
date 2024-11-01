import EditStrategy from './m_collection_widget.edit.strategy';

const PlainEditStrategy = EditStrategy.inherit({

  _getPlainItems() {
    return this._collectionWidget.option('items') || [];
  },

  getIndexByItemData(itemData) {
    const keyOf = this._collectionWidget.keyOf.bind(this._collectionWidget);
    if (keyOf) {
      return this.getIndexByKey(keyOf(itemData));
    }
    return this._getPlainItems().indexOf(itemData);
  },

  getItemDataByIndex(index) {
    return this._getPlainItems()[index];
  },

  deleteItemAtIndex(index) {
    this._getPlainItems().splice(index, 1);
  },

  itemsGetter() {
    return this._getPlainItems();
  },

  getKeysByItems(items) {
    const keyOf = this._collectionWidget.keyOf.bind(this._collectionWidget);
    let result = items;
    if (keyOf) {
      result = [];
      for (let i = 0; i < items.length; i++) {
        result.push(keyOf(items[i]));
      }
    }
    return result;
  },

  getIndexByKey(key) {
    const cache = this._cache;
    const keys = cache && cache.keys || this.getKeysByItems(this._getPlainItems());

    if (cache && !cache.keys) {
      cache.keys = keys;
    }

    if (typeof key === 'object') {
      for (let i = 0, { length } = keys; i < length; i++) {
        if (this._equalKeys(key, keys[i])) return i;
      }
    } else {
      return keys.indexOf(key);
    }

    return -1;
  },

  getItemsByKeys(keys, items) {
    return (items || keys).slice();
  },

  moveItemAtIndexToIndex(movingIndex, destinationIndex) {
    const items = this._getPlainItems();
    const movedItemData = items[movingIndex];

    items.splice(movingIndex, 1);
    items.splice(destinationIndex, 0, movedItemData);
  },

  _isItemIndex(index) {
    return (typeof index === 'number') && Math.round(index) === index;
  },

  _getNormalizedItemIndex(itemElement) {
    return this._collectionWidget._itemElements().index(itemElement);
  },

  _normalizeItemIndex(index) {
    return index;
  },

  _denormalizeItemIndex(index) {
    return index;
  },

  _getItemByNormalizedIndex(index) {
    return index > -1 ? this._collectionWidget._itemElements().eq(index) : null;
  },

  _itemsFromSameParent() {
    return true;
  },

});

export default PlainEditStrategy;
