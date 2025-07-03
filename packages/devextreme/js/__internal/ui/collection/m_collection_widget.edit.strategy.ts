import Class from '@js/core/class';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { isRenderer } from '@js/core/utils/type';
import type { CollectionWidgetItem } from '@js/ui/collection/ui.collection_widget.base';
import type CollectionWidget from '@ts/ui/collection/m_collection_widget.edit';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/m_collection_widget.edit';

export type CollectionItemIndex = number | { group: number; item: number };

export type EditStrategyComponent<
  TItem extends CollectionWidgetItem = CollectionWidgetItem,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
> = Pick<CollectionWidget<CollectionWidgetEditProperties<any, TItem>, TItem>,
  'keyOf'
  | '_isKeySpecified'
  | '_itemElements'
  | '_itemContainer'
  | 'option'
  | '_dataController'
>;

interface KeysCache {
  [key: string]: unknown;
  keys?: (string | number)[];
}
class EditStrategy<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends CollectionWidgetItem = any,
> {
  _collectionWidget!: EditStrategyComponent<TItem>;

  _cache?: KeysCache | null;

  constructor(collectionWidget: EditStrategyComponent<TItem>) {
    this._collectionWidget = collectionWidget;
  }

  _getItems(): TItem[] {
    const { items = [] } = this._collectionWidget.option();
    return items;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  getIndexByItemData(value: TItem): number {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  getItemDataByIndex(index: number): TItem {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  getKeysByItems(items: TItem[]): (string | number)[] {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  getItemsByKeys(keys: (string | number)[], items?: TItem[]): TItem[] {
    return Class.abstract();
  }

  // eslint-disable-next-line class-methods-use-this
  itemsGetter(): TItem[] {
    return Class.abstract();
  }

  getKeyByIndex(index: number): string | number {
    const resultIndex = this._denormalizeItemIndex(index);

    return this.getKeysByItems([this.getItemDataByIndex(resultIndex as number)])[0];
  }

  _equalKeys(key1: string | number, key2: string | number): boolean {
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  getIndexByKey(key: string | number): number {
    return Class.abstract();
  }

  getNormalizedIndex(
    value: number | Element | TItem,
  ): number {
    if (this._isNormalizedItemIndex(value)) {
      return value as number;
    }

    if (this._isItemIndex(value)) {
      return this._normalizeItemIndex(value as number);
    }

    if (this._isNode(value)) {
      return this._getNormalizedItemIndex(value);
    }

    return this._normalizeItemIndex(this.getIndexByItemData(value as TItem));
  }

  getIndex(value: number | Element | TItem): CollectionItemIndex {
    if (this._isNormalizedItemIndex(value)) {
      return this._denormalizeItemIndex(value as number);
    }

    if (this._isItemIndex(value)) {
      return value as number;
    }

    if (this._isNode(value)) {
      return this._denormalizeItemIndex(this._getNormalizedItemIndex(value));
    }

    return this.getIndexByItemData(value as TItem);
  }

  getItemElement(value: Element | number | TItem): dxElementWrapper {
    if (this._isNormalizedItemIndex(value)) {
      return this._getItemByNormalizedIndex(value as number);
    }

    if (this._isItemIndex(value)) {
      return this._getItemByNormalizedIndex(this._normalizeItemIndex(value as number));
    }

    if (this._isNode(value)) {
      return $(value);
    }

    const normalizedItemIndex = this._normalizeItemIndex(this.getIndexByItemData(value as TItem));
    return this._getItemByNormalizedIndex(normalizedItemIndex);
  }

  // eslint-disable-next-line class-methods-use-this
  _isNode(el: unknown): el is Element {
    // @ts-expect-error Property 'get' does not exist on type 'unknown'
    return domAdapter.isNode(el && isRenderer(el) ? el.get(0) : el);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  deleteItemAtIndex(index: number): void {
    return Class.abstract();
  }

  itemPlacementFunc(movingIndex: number, destinationIndex: number): 'after' | 'before' {
    return this._itemsFromSameParent(movingIndex, destinationIndex) && movingIndex < destinationIndex ? 'after' : 'before';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  moveItemAtIndexToIndex(movingIndex: number, destinationIndex: number): void {
    return Class.abstract();
  }

  // eslint-disable-next-line class-methods-use-this
  _isNormalizedItemIndex(index: number | Element | TItem): boolean {
    return (typeof index === 'number') && Math.round(index) === index;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _isItemIndex(index: number | Element | TItem): boolean {
    return Class.abstract();
  }

  // eslint-disable-next-line class-methods-use-this
  _getNormalizedItemIndex(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value: Element,
  ): number {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _normalizeItemIndex(index: number): number {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _denormalizeItemIndex(index: number): CollectionItemIndex {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _getItemByNormalizedIndex(index: number): dxElementWrapper {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _itemsFromSameParent(movingIndex: number, destinationIndex: number): boolean {
    return Class.abstract();
  }
}

export default EditStrategy;
