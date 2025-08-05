import type { dxElementWrapper } from '@js/core/renderer';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import type { CollectionItemKey } from '@ts/ui/collection/collection_widget.base';
import type { CollectionItemIndex } from '@ts/ui/collection/collection_widget.edit.strategy';
import EditStrategy from '@ts/ui/collection/collection_widget.edit.strategy';

class PlainEditStrategy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends CollectionItemKey = any,
> extends EditStrategy<TItem, TKey> {
  _getPlainItems(): TItem[] {
    return this._getItems() ?? [];
  }

  getIndexByItemData(itemData: TItem): CollectionItemIndex {
    const keyOf = this._collectionWidget.keyOf.bind(this._collectionWidget);
    if (keyOf) {
      return this.getIndexByKey(keyOf(itemData));
    }
    return this._getPlainItems().indexOf(itemData);
  }

  getItemDataByIndex(index: number): TItem {
    return this._getPlainItems()[index];
  }

  deleteItemAtIndex(index: number): void {
    this._getPlainItems().splice(index, 1);
  }

  itemsGetter(): TItem[] {
    return this._getPlainItems();
  }

  getKeysByItems(items: TItem[]): TKey[] {
    const keyOf = this._collectionWidget.keyOf.bind(this._collectionWidget);
    let result: (TKey | TItem)[] = items;
    if (keyOf) {
      result = items.map((item) => keyOf(item));
    }
    return result as TKey[];
  }

  getIndexByKey(key: TKey): number {
    const cache = this._cache;
    const keys = cache?.keys ?? this.getKeysByItems(this._getPlainItems());

    if (cache && !cache.keys) {
      cache.keys = keys;
    }

    if (typeof key === 'object') {
      for (let i = 0; i < keys.length; i += 1) {
        if (this._equalKeys(key, keys[i])) return i;
      }
    } else {
      return keys.indexOf(key);
    }

    return -1;
  }

  getItemsByKeys(keys: TKey[], items: TItem[] | undefined): TItem[] {
    return (items ?? keys).slice() as TItem[];
  }

  moveItemAtIndexToIndex(
    movingIndex: number,
    destinationIndex: number,
  ): void {
    const items = this._getPlainItems();
    const movedItemData = items[movingIndex];

    items.splice(movingIndex, 1);
    items.splice(destinationIndex, 0, movedItemData);
  }

  _isItemIndex(index: CollectionItemIndex): index is CollectionItemIndex {
    return this._isNormalizedItemIndex(index);
  }

  _getNormalizedItemIndex(itemElement: Element): number {
    return this._collectionWidget._itemElements().index(itemElement);
  }

  _normalizeItemIndex(
    index: CollectionItemIndex,
  ): number {
    return index as number;
  }

  _denormalizeItemIndex(
    index: number,
  ): CollectionItemIndex {
    return index;
  }

  _getItemByNormalizedIndex(index: number): dxElementWrapper {
    // @ts-expect-error ts-error
    return index > -1 ? this._collectionWidget._itemElements().eq(index) : null;
  }

  _itemsFromSameParent(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _firstIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _secondIndex: number,
  ): boolean {
    return true;
  }
}

export default PlainEditStrategy;
