import { indexByKey, insert, update } from '@js/common/data/array_utils';
import { keysEqual } from '@js/common/data/utils';
import domAdapter from '@js/core/dom_adapter';
import $ from '@js/core/renderer';
import { findChanges } from '@js/core/utils/array_compare';
import { when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import type { OptionChanged } from '@ts/core/widget/types';
import CollectionWidgetAsync from '@ts/ui/collection/m_collection_widget.async';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/m_collection_widget.edit';

const PRIVATE_KEY_FIELD = '__dx_key__';

class CollectionWidgetLiveUpdate<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetEditProperties<any, TItem, TKey>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
> extends CollectionWidgetAsync<TProperties> {
  _correctionIndex!: number;

  _itemsCache!: TItem[];

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      repaintChangesOnly: false,
    };
  }

  _customizeStoreLoadOptions(e) {
    // @ts-expect-error ts-error
    const dataController = this._dataController;
    // @ts-expect-error ts-error
    if (dataController.getDataSource() && !this._dataController.isLoaded()) {
      this._correctionIndex = 0;
    }
    if (this._correctionIndex && e.storeLoadOptions) {
      e.storeLoadOptions.skip += this._correctionIndex;
    }
  }

  reload(): void {
    this._correctionIndex = 0;
  }

  _init(): void {
    super._init();
    this._refreshItemsCache();
    this._correctionIndex = 0;
    this._subscribeLoadOptionsCustomization(true);
  }

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
  }

  _dataSourceChangedHandler(newItems, e) {
    if (e?.changes) {
      this._modifyByChanges(e.changes);
    } else {
      super._dataSourceChangedHandler(newItems, e);
      this._refreshItemsCache();
    }
  }

  _isItemEquals(item1, item2) {
    if (item1 && item1[PRIVATE_KEY_FIELD]) {
      item1 = item1.data;
    }

    try {
      return JSON.stringify(item1) === JSON.stringify(item2);
    } catch (e) {
      return item1 === item2;
    }
  }

  _isItemStrictEquals(item1, item2) {
    return this._isItemEquals(item1, item2);
  }

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
  }

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
  }

  _refreshItemsCache(): void {
    if (this.option('repaintChangesOnly')) {
      const items = this._editStrategy.itemsGetter();
      try {
        this._itemsCache = extend(true, [], items);
        if (!this.key()) {
          // @ts-expect-error
          this._itemsCache = this._itemsCache.map((itemCache, index) => ({
            [PRIVATE_KEY_FIELD]: items[index],
            data: itemCache,
          }));
        }
      } catch (e) {
        this._itemsCache = extend([], items);
      }
    }
  }

  _dispose(): void {
    this._subscribeLoadOptionsCustomization(false);
    super._dispose();
  }

  _updateByChange(keyInfo, items, change, isPartialRefresh): void {
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
  }

  _insertByChange(keyInfo, items, change, isPartialRefresh): void {
    // @ts-expect-error
    when(isPartialRefresh || insert(keyInfo, items, change.data, change.index)).done(() => {
      this._beforeItemElementInserted(change);

      this._renderItem(change.index ?? items.length, change.data);

      this._afterItemElementInserted();
      this._correctionIndex++;
    });
  }

  _updateSelectionAfterRemoveByChange(removeIndex): void {
    const { selectedIndex, selectedItems } = this.option();
    // @ts-expect-error
    if (selectedIndex > removeIndex) {
      // @ts-expect-error
      this.option('selectedIndex', selectedIndex - 1);
      // @ts-expect-error
    } else if (selectedIndex === removeIndex && selectedItems.length === 1) {
      this.option('selectedItems', []);
    } else {
      this._normalizeSelectedItems();
    }
  }

  _beforeItemElementInserted(change): void {
    const { selectedIndex } = this.option();

    // @ts-expect-error
    if (change.index <= selectedIndex) {
      // @ts-expect-error
      this.option('selectedIndex', selectedIndex + 1);
    }
  }

  _afterItemElementInserted(): void {}

  _removeByChange(keyInfo, items, change, isPartialRefresh): void {
    const index = isPartialRefresh ? change.index : indexByKey(keyInfo, items, change.key);
    const removedItem = isPartialRefresh ? change.oldItem : items[index];
    if (removedItem) {
      const $removedItemElement = this._findItemElementByKey(change.key);
      const deletedActionArgs = this._extendActionArgs($removedItemElement);
      // @ts-expect-error
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
  }

  _modifyByChanges(changes, isPartialRefresh?): void {
    const items = this._editStrategy.itemsGetter();
    const keyInfo = { key: this.key.bind(this), keyOf: this.keyOf.bind(this) };
    // @ts-expect-error
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
  }

  _appendItemToContainer($container, $itemFrame, index) {
    const nextSiblingElement = $container.children(this._itemSelector()).get(index);
    domAdapter.insertElement($container.get(0), $itemFrame.get(0), nextSiblingElement);
  }

  _subscribeLoadOptionsCustomization(enable: boolean): void {
    // @ts-expect-error ts-error
    if (!this._dataController) {
      return;
    }

    if (enable) {
      this._correctionIndex = 0;
      // @ts-expect-error ts-error
      this._dataController.on('customizeStoreLoadOptions', this._customizeStoreLoadOptions.bind(this));
    } else {
      // @ts-expect-error ts-error
      this._dataController.off('customizeStoreLoadOptions', this._customizeStoreLoadOptions.bind(this));
    }
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    switch (args.name) {
      case 'items': {
        // @ts-expect-error excess argument
        const isItemsUpdated = this._partialRefresh(args.value);
        if (!isItemsUpdated) {
          super._optionChanged(args);
        }
        break;
      }
      case 'dataSource':
        if (!this.option('repaintChangesOnly') || !args.value) {
          this.option('items', []);
        }

        this._subscribeLoadOptionsCustomization(false);
        super._optionChanged(args);
        this._subscribeLoadOptionsCustomization(true);
        break;
      case 'repaintChangesOnly':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default CollectionWidgetLiveUpdate;
