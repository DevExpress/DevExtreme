import Class from '@js/core/class';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { isRenderer } from '@js/core/utils/type';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import type { CollectionItemKey } from '@ts/ui/collection/collection_widget.base';
import type CollectionWidget from '@ts/ui/collection/collection_widget.edit';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';

export interface CollectionGroupedItemIndex {
  group: number;
  item: number;
}

export type CollectionItemIndex = number | CollectionGroupedItemIndex;

export type EditStrategyComponent<
  TItem extends ItemLike = ItemLike,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends CollectionItemKey = any,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
> = Pick<CollectionWidget<CollectionWidgetEditProperties<any, TItem, TKey>, TItem, TKey>,
  'keyOf'
  | '_isKeySpecified'
  | '_itemElements'
  | '_itemContainer'
  | 'option'
  | '_dataController'
>;

interface KeysCache<TKey = CollectionItemKey> {
  [key: string]: unknown;
  keys?: TKey[];
}
class EditStrategy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey extends CollectionItemKey = any,
> {
  _collectionWidget!: EditStrategyComponent<TItem, TKey>;

  _cache?: KeysCache<TKey> | null;

  constructor(collectionWidget: EditStrategyComponent<TItem, TKey>) {
    this._collectionWidget = collectionWidget;
  }

  _getItems(): TItem[] {
    const { items = [] } = this._collectionWidget.option();
    return items;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIndexByItemData(value: TItem): CollectionItemIndex {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItemDataByIndex(index: number): TItem {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getKeysByItems(items: TItem[]): TKey[] {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItemsByKeys(keys: TKey[], items: TItem[] | undefined): TItem[] {
    return Class.abstract();
  }

  itemsGetter(): TItem[] {
    return Class.abstract();
  }

  getKeyByIndex(index: CollectionItemIndex): TKey {
    const resultIndex = this._denormalizeItemIndex(index);

    return this.getKeysByItems([this.getItemDataByIndex(resultIndex as number)])[0];
  }

  _equalKeys(key1: TKey, key2: TKey): boolean {
    if (this._collectionWidget._isKeySpecified()) {
      return equalByValue(key1, key2);
    }
    return key1 === key2;
  }

  beginCache(): void {
    this._cache = {};
  }

  endCache(): void {
    this._cache = null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIndexByKey(key: TKey): number {
    return Class.abstract();
  }

  getNormalizedIndex(
    value: CollectionItemIndex | Element | dxElementWrapper | TItem,
  ): number {
    if (this._isNode(value)) {
      return this._getNormalizedItemIndex(value);
    }

    if (this._isNormalizedItemIndex(value)) {
      return value;
    }

    if (this._isItemIndex(value)) {
      return this._normalizeItemIndex(value);
    }

    return this._normalizeItemIndex(this.getIndexByItemData(value));
  }

  getIndex(value: CollectionItemIndex | Element | TItem): CollectionItemIndex {
    if (this._isNode(value)) {
      return this._denormalizeItemIndex(this._getNormalizedItemIndex(value));
    }

    if (this._isNormalizedItemIndex(value)) {
      return this._denormalizeItemIndex(value);
    }

    if (this._isItemIndex(value)) {
      return value;
    }

    return this.getIndexByItemData(value);
  }

  getItemElement(
    value: Element | dxElementWrapper | CollectionItemIndex | TItem,
  ): dxElementWrapper {
    if (this._isNode(value)) {
      return $(value);
    }

    if (this._isNormalizedItemIndex(value)) {
      return this._getItemByNormalizedIndex(value);
    }

    if (this._isItemIndex(value)) {
      return this._getItemByNormalizedIndex(this._normalizeItemIndex(value));
    }

    const normalizedItemIndex = this._normalizeItemIndex(this.getIndexByItemData(value));
    return this._getItemByNormalizedIndex(normalizedItemIndex);
  }

  _isNode(
    el: CollectionItemIndex | TItem | Element | dxElementWrapper,
  ): el is Element | dxElementWrapper {
    return domAdapter.isNode(el && isRenderer(el) ? (el as dxElementWrapper).get(0) : el);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteItemAtIndex(index: number): void {
    return Class.abstract();
  }

  itemPlacementFunc(movingIndex: number, destinationIndex: number): 'after' | 'before' {
    return this._itemsFromSameParent(movingIndex, destinationIndex) && movingIndex < destinationIndex ? 'after' : 'before';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  moveItemAtIndexToIndex(movingIndex: number, destinationIndex: number): void {
    return Class.abstract();
  }

  _isNormalizedItemIndex(
    index: CollectionItemIndex | TItem,
  ): index is number {
    return (typeof index === 'number') && Math.round(index) === index;
  }

  _isItemIndex(
    index: CollectionItemIndex | TItem,
  ): index is CollectionItemIndex {
    return Class.abstract();
  }

  _getNormalizedItemIndex(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value: Element | dxElementWrapper,
  ): number {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _normalizeItemIndex(index: CollectionItemIndex): number {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _denormalizeItemIndex(index: CollectionItemIndex): CollectionItemIndex {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getItemByNormalizedIndex(index: CollectionItemIndex): dxElementWrapper {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _itemsFromSameParent(movingIndex: number, destinationIndex: number): boolean {
    return Class.abstract();
  }
}

export default EditStrategy;
