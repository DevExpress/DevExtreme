import { indexByKey, insert, update } from '@js/common/data/array_utils';
import { keysEqual } from '@js/common/data/utils';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { findChanges } from '@js/core/utils/array_compare';
import { when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import type { OptionChanged } from '@ts/core/widget/types';
import CollectionWidgetAsync from '@ts/ui/collection/collection_widget.async';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';

import type { CollectionItemKey, DataChange } from './collection_widget.base';

export const PRIVATE_KEY_FIELD = '__dx_key__';

export type CachedItem<TItem> = TItem | {
  [PRIVATE_KEY_FIELD]: TItem;
  data: TItem;
};

export interface KeyInfo<TItem = unknown, TKey = CollectionItemKey> {
  key: () => string | Function | undefined;
  keyOf: (item: TItem) => TKey;
}

export interface ChangeHandlerParams<TItem, TKey> {
  keyInfo: KeyInfo<TItem, TKey>;
  items: TItem[];
  change: DataChange<TItem, TKey>;
  isPartialRefresh?: boolean;
}

export interface CollectionWidgetLiveUpdateProperties<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TComponent extends CollectionWidgetLiveUpdate<any, TItem, TKey> | any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends CollectionItemKey = any,
> extends CollectionWidgetEditProperties<TComponent, TItem, TKey> {
  repaintChangesOnly?: boolean;
}

class CollectionWidgetLiveUpdate<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TProperties extends CollectionWidgetLiveUpdateProperties<any, TItem, TKey>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends CollectionItemKey = any,
> extends CollectionWidgetAsync<TProperties, TItem, TKey> {
  _itemsCache!: CachedItem<TItem>[];

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      repaintChangesOnly: false,
    };
  }

  reload(): void {}

  _init(): void {
    super._init();
    this._refreshItemsCache();
  }

  _findItemElementByKey(key: TKey): dxElementWrapper {
    let result = $();
    const keyExpr = this.key();
    this.itemElements().each((_, item) => {
      const $item = $(item);
      const itemData = this._getItemData($item);
      if (keyExpr
        ? keysEqual(keyExpr, this.keyOf(itemData), key)
        : this._isItemEquals(itemData, key)) {
        result = $item;
        return false;
      }
      return true;
    });
    return result;
  }

  _dataSourceChangedHandler(
    newItems: TItem[],
    e?: { changes?: DataChange<TItem, TKey>[] },
  ): void {
    if (e?.changes) {
      this._modifyByChanges(e.changes);
    } else {
      super._dataSourceChangedHandler(newItems, e);
      this._refreshItemsCache();
    }
  }

  _isItemEquals(item1: unknown, item2: unknown): boolean {
    let itemToCompare = item1;
    if (item1 && typeof item1 === 'object' && item1[PRIVATE_KEY_FIELD]) {
      itemToCompare = (item1 as Record<string, unknown>).data;
    }

    try {
      return JSON.stringify(itemToCompare) === JSON.stringify(item2);
    } catch (e) {
      return itemToCompare === item2;
    }
  }

  _isItemStrictEquals(item1: unknown, item2: unknown): boolean {
    return this._isItemEquals(item1, item2);
  }

  _shouldAddNewGroup(
    changes: DataChange<TItem>[],
    items: CachedItem<TItem>[],
  ): boolean {
    let result = false;
    const { grouped } = this.option();

    if (grouped) {
      if (!changes.length) {
        result = true;
      }
      each(changes, (i, change) => {
        if (change.type === 'insert') {
          result = true;
          each(items, (_, item) => {
            if (change.data.key !== undefined && change.data.key === item.key) {
              result = false;
              return false;
            }
            return true;
          });
        }
      });
    }

    return result;
  }

  _partialRefresh(): boolean {
    const { repaintChangesOnly } = this.option();
    if (repaintChangesOnly) {
      const keyOf = (data): TKey => {
        if (data && data[PRIVATE_KEY_FIELD] !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return data[PRIVATE_KEY_FIELD];
        }

        return this.keyOf(data);
      };
      const result = findChanges({
        oldItems: this._itemsCache,
        newItems: this._editStrategy.itemsGetter(),
        getKey: keyOf,
        isItemEquals: this._isItemStrictEquals.bind(this),
        detectReorders: true,
      });
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
    const { repaintChangesOnly } = this.option();
    if (repaintChangesOnly) {
      const items: TItem[] = this._editStrategy.itemsGetter();
      try {
        this._itemsCache = extend(true, [], items);
        if (!this.key()) {
          this._itemsCache = this._itemsCache.map((itemCache, index) => ({
            [PRIVATE_KEY_FIELD]: items[index],
            data: itemCache as TItem,
          }));
        }
      } catch (e) {
        this._itemsCache = extend([], items);
      }
    }
  }

  _updateByChange(
    keyInfo: KeyInfo<TItem, TKey>,
    items: TItem[],
    change: DataChange<TItem, TKey>,
    isPartialRefresh?: boolean,
  ): void {
    if (isPartialRefresh) {
      this._renderItem(
        change.index,
        change.data,
        null,
        this._findItemElementByKey(change.key),
      );
    } else {
      const changedItem = items[indexByKey(keyInfo, items, change.key)];
      if (changedItem) {
        // @ts-expect-error ts-error
        update(keyInfo, items, change.key, change.data).done(() => {
          this._renderItem(
            items.indexOf(changedItem),
            changedItem,
            null,
            this._findItemElementByKey(change.key),
          );
        });
      }
    }
  }

  _insertByChange(
    keyInfo: KeyInfo<TItem, TKey>,
    items: TItem[],
    change: DataChange<TItem, TKey>,
    isPartialRefresh?: boolean,
  ): void {
    when(
      // @ts-expect-error ts-error
      isPartialRefresh ?? insert(keyInfo, items, change.data, change.index),
    ).done(() => {
      this._beforeItemElementInserted(change);

      this._renderItem(change.index ?? items.length, change.data);

      this._afterItemElementInserted();
    });
  }

  _updateSelectionAfterRemoveByChange(removeIndex: number): void {
    const { selectedIndex, selectedItems = [] } = this.option();
    const index = selectedIndex as number;

    if (index > removeIndex) {
      this.option('selectedIndex', index - 1);
    } else if (index === removeIndex && selectedItems.length === 1) {
      this.option('selectedItems', []);
    } else {
      this._normalizeSelectedItems();
    }
  }

  _beforeItemElementInserted(change: DataChange<TItem, TKey>): void {
    const { selectedIndex } = this.option();
    const index = selectedIndex as number;

    if (change.index <= index) {
      this.option('selectedIndex', index + 1);
    }
  }

  _afterItemElementInserted(): void {
    this._renderEmptyMessage();
  }

  _removeByChange(
    keyInfo: KeyInfo<TItem, TKey>,
    items: TItem[],
    change: DataChange<TItem, TKey>,
    isPartialRefresh?: boolean,
  ): void {
    const index = isPartialRefresh ? change.index : indexByKey(keyInfo, items, change.key);
    const removedItem = isPartialRefresh ? change.oldItem : items[index];
    if (removedItem) {
      const $removedItemElement = this._findItemElementByKey(change.key);
      const deletedActionArgs = this._extendActionArgs($removedItemElement);
      // @ts-expect-error ts-error
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
    }
  }

  _modifyByChanges(changes: DataChange<TItem, TKey>[], isPartialRefresh?: boolean): void {
    const items = this._editStrategy.itemsGetter();
    const keyInfo: KeyInfo<TItem, TKey> = {
      key: this.key.bind(this),
      keyOf: this.keyOf.bind(this),
    };
    const dataController = this._dataController;
    const paginate = dataController.paginate();
    const group = dataController.group();

    let filteredChanges = changes;
    if (paginate || group) {
      filteredChanges = changes.filter((
        item: DataChange<TItem, TKey>,
      ) => item.type !== 'insert' || item.index !== undefined);
    }

    filteredChanges.forEach((
      change: DataChange<TItem, TKey>,
    ) => this[`_${change.type}ByChange`](keyInfo, items, change, isPartialRefresh));
    this._renderedItemsCount = items.length;
    this._refreshItemsCache();
    this._fireContentReadyAction();
  }

  _appendItemToContainer(
    $container: dxElementWrapper,
    $itemFrame: dxElementWrapper,
    index: number,
  ): void {
    const nextSiblingElement = $container.children(this._itemSelector())[index];
    domAdapter.insertElement($container[0], $itemFrame[0], nextSiblingElement);
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value } = args;
    switch (name) {
      case 'items': {
        const isItemsUpdated = this._partialRefresh();
        if (!isItemsUpdated) {
          super._optionChanged(args);
        }
        break;
      }
      case 'dataSource': {
        const { repaintChangesOnly } = this.option();
        if (!repaintChangesOnly || !value) {
          this.option('items', []);
        }

        super._optionChanged(args);
        break;
      }
      case 'repaintChangesOnly':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default CollectionWidgetLiveUpdate;
