import { indexByKey, insert, update } from '@js/common/data/array_utils';
import { keysEqual } from '@js/common/data/utils';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { findChanges } from '@js/core/utils/array_compare';
import { noop } from '@js/core/utils/common';
import { when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';

import CollectionWidget from './m_collection_widget.async';

const PRIVATE_KEY_FIELD = '__dx_key__';

export default CollectionWidget.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      repaintChangesOnly: false,
    });
  },

  ctor() {
    this.callBase.apply(this, arguments);

    this._customizeStoreLoadOptions = (e) => {
      const dataController = this._dataController;

      if (dataController.getDataSource() && !this._dataController.isLoaded()) {
        this._correctionIndex = 0;
      }
      if (this._correctionIndex && e.storeLoadOptions) {
        e.storeLoadOptions.skip += this._correctionIndex;
      }
    };

    this._dataController?.on('customizeStoreLoadOptions', this._customizeStoreLoadOptions);
  },

  reload() {
    this._correctionIndex = 0;
  },

  _init() {
    this.callBase();
    this._refreshItemsCache();
    this._correctionIndex = 0;
  },

  _findItemElementByKey(key) {
    let result = $();
    const keyExpr = this.key();
    // @ts-expect-error
    this.itemElements().each((_, item) => {
      const $item = $(item);
      const itemData = this._getItemData($item);
      if (keyExpr ? keysEqual(keyExpr, this.keyOf(itemData), key) : this._isItemEquals(itemData, key)) {
        result = $item;
        return false;
      }
    });
    return result;
  },

  _dataSourceChangedHandler(newItems, e) {
    if (e?.changes) {
      this._modifyByChanges(e.changes);
    } else {
      this.callBase(newItems, e);
      this._refreshItemsCache();
    }
  },

  _isItemEquals(item1, item2) {
    if (item1 && item1[PRIVATE_KEY_FIELD]) {
      item1 = item1.data;
    }

    try {
      return JSON.stringify(item1) === JSON.stringify(item2);
    } catch (e) {
      return item1 === item2;
    }
  },

  _isItemStrictEquals(item1, item2) {
    return this._isItemEquals(item1, item2);
  },

  _shouldAddNewGroup(changes, items) {
    let result = false;
    if (this.option('grouped')) {
      if (!changes.length) {
        result = true;
      }
      each(changes, (i, change) => {
        if (change.type === 'insert') {
          result = true;
          // @ts-expect-error
          each(items, (_, item) => {
            if (change.data.key !== undefined && change.data.key === item.key) {
              result = false;
              return false;
            }
          });
        }
      });
    }

    return result;
  },

  _partialRefresh() {
    if (this.option('repaintChangesOnly')) {
      const keyOf = (data) => {
        if (data && data[PRIVATE_KEY_FIELD] !== undefined) {
          return data[PRIVATE_KEY_FIELD];
        }
        return this.keyOf(data);
      };
      const result = findChanges(this._itemsCache, this._editStrategy.itemsGetter(), keyOf, this._isItemStrictEquals.bind(this));
      if (result && this._itemsCache.length && !this._shouldAddNewGroup(result, this._itemsCache)) {
        this._modifyByChanges(result, true);
        this._renderEmptyMessage();
        return true;
      }
      this._refreshItemsCache();
    }
    return false;
  },

  _refreshItemsCache() {
    if (this.option('repaintChangesOnly')) {
      const items = this._editStrategy.itemsGetter();
      try {
        this._itemsCache = extend(true, [], items);
        if (!this.key()) {
          this._itemsCache = this._itemsCache.map((itemCache, index) => ({
            [PRIVATE_KEY_FIELD]: items[index],
            data: itemCache,
          }));
        }
      } catch (e) {
        this._itemsCache = extend([], items);
      }
    }
  },

  _dispose() {
    this._dataController.off('customizeStoreLoadOptions', this._customizeStoreLoadOptions);
    this.callBase();
  },

  _updateByChange(keyInfo, items, change, isPartialRefresh) {
    if (isPartialRefresh) {
      this._renderItem(change.index, change.data, null, this._findItemElementByKey(change.key));
    } else {
      const changedItem = items[indexByKey(keyInfo, items, change.key)];
      if (changedItem) {
        // @ts-expect-error
        update(keyInfo, items, change.key, change.data).done(() => {
          this._renderItem(items.indexOf(changedItem), changedItem, null, this._findItemElementByKey(change.key));
        });
      }
    }
  },

  _insertByChange(keyInfo, items, change, isPartialRefresh) {
    // @ts-expect-error
    when(isPartialRefresh || insert(keyInfo, items, change.data, change.index)).done(() => {
      this._beforeItemElementInserted(change);

      this._renderItem(change.index ?? items.length, change.data);

      this._afterItemElementInserted();
      this._correctionIndex++;
    });
  },

  _updateSelectionAfterRemoveByChange(removeIndex) {
    const selectedIndex = this.option('selectedIndex');

    if (selectedIndex > removeIndex) {
      this.option('selectedIndex', selectedIndex - 1);
    } else if (selectedIndex === removeIndex && this.option('selectedItems').length === 1) {
      this.option('selectedItems', []);
    } else {
      this._normalizeSelectedItems();
    }
  },

  _beforeItemElementInserted(change) {
    const selectedIndex = this.option('selectedIndex');

    if (change.index <= selectedIndex) {
      this.option('selectedIndex', selectedIndex + 1);
    }
  },

  _afterItemElementInserted: noop,

  _removeByChange(keyInfo, items, change, isPartialRefresh) {
    const index = isPartialRefresh ? change.index : indexByKey(keyInfo, items, change.key);
    const removedItem = isPartialRefresh ? change.oldItem : items[index];
    if (removedItem) {
      const $removedItemElement = this._findItemElementByKey(change.key);
      const deletedActionArgs = this._extendActionArgs($removedItemElement);

      this._waitDeletingPrepare($removedItemElement).done(() => {
        if (isPartialRefresh) {
          this._updateIndicesAfterIndex(index - 1);
          this._afterItemElementDeleted($removedItemElement, deletedActionArgs);
          this._updateSelectionAfterRemoveByChange(index);
        } else {
          this._deleteItemElementByIndex(index);
          this._afterItemElementDeleted($removedItemElement, deletedActionArgs);
        }
      });

      this._correctionIndex--;
    }
  },

  _modifyByChanges(changes, isPartialRefresh) {
    const items = this._editStrategy.itemsGetter();
    const keyInfo = { key: this.key.bind(this), keyOf: this.keyOf.bind(this) };
    const dataController = this._dataController;
    const paginate = dataController.paginate();
    const group = dataController.group();

    if (paginate || group) {
      changes = changes.filter((item) => item.type !== 'insert' || item.index !== undefined);
    }

    changes.forEach((change) => this[`_${change.type}ByChange`](keyInfo, items, change, isPartialRefresh));
    this._renderedItemsCount = items.length;
    this._refreshItemsCache();
    this._fireContentReadyAction();
  },

  _appendItemToContainer($container, $itemFrame, index) {
    const nextSiblingElement = $container.children(this._itemSelector()).get(index);
    domAdapter.insertElement($container.get(0), $itemFrame.get(0), nextSiblingElement);
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'items': {
        const isItemsUpdated = this._partialRefresh(args.value);
        if (!isItemsUpdated) {
          this.callBase(args);
        }
        break;
      }
      case 'dataSource':
        if (!this.option('repaintChangesOnly') || !args.value) {
          this.option('items', []);
        }

        this.callBase(args);
        break;
      case 'repaintChangesOnly':
        break;
      default:
        this.callBase(args);
    }
  },
});
