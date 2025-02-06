import Class from '@js/core/class';
import domAdapter from '@js/core/dom_adapter';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { equalByValue } from '@js/core/utils/common';
import { isRenderer } from '@js/core/utils/type';
import type CollectionWidget from '@ts/ui/collection/m_collection_widget.edit';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/m_collection_widget.edit';

class EditStrategy<
  // @ts-expect-error ts-error
  TComponent extends CollectionWidget<CollectionWidgetEditProperties>,
  // @ts-expect-error dxClass inheritance issue
  // eslint-disable-next-line @typescript-eslint/ban-types
> extends (Class.inherit({}) as new() => {}) {
  _collectionWidget!: TComponent;

  _cache?: Record<string, unknown> | null;

  constructor(collectionWidget: TComponent) {
    super();

    this._collectionWidget = collectionWidget;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getIndexByItemData(value): number {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItemDataByIndex(index) {
    Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getKeysByItems(items) {
    Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItemsByKeys(keys, items) {
    Class.abstract();
  }

  itemsGetter() {
    Class.abstract();
  }

  getKeyByIndex(index) {
    const resultIndex = this._denormalizeItemIndex(index);

    return this.getKeysByItems([this.getItemDataByIndex(resultIndex)])[0];
  }

  _equalKeys(key1, key2): boolean {
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
  getIndexByKey(key): number {
    return Class.abstract();
  }

  getNormalizedIndex(
    value: number | Element,
  ): number {
    if (this._isNormalizedItemIndex(value)) {
      return value as number;
    }

    if (this._isItemIndex(value)) {
      return this._normalizeItemIndex(value);
    }

    if (this._isNode(value)) {
      return this._getNormalizedItemIndex(value);
    }

    return this._normalizeItemIndex(this.getIndexByItemData(value));
  }

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
  }

  getItemElement(value: Element | number): dxElementWrapper {
    if (this._isNormalizedItemIndex(value)) {
      return this._getItemByNormalizedIndex(value);
    }

    if (this._isItemIndex(value)) {
      return this._getItemByNormalizedIndex(this._normalizeItemIndex(value));
    }

    if (this._isNode(value)) {
      // @ts-expect-error ts-error
      return $(value);
    }

    const normalizedItemIndex = this._normalizeItemIndex(this.getIndexByItemData(value));
    return this._getItemByNormalizedIndex(normalizedItemIndex);
  }

  _isNode(el) {
    return domAdapter.isNode(el && isRenderer(el) ? el.get(0) : el);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteItemAtIndex(index: number) {
    Class.abstract();
  }

  itemPlacementFunc(movingIndex, destinationIndex): 'after' | 'before' {
    return this._itemsFromSameParent(movingIndex, destinationIndex) && movingIndex < destinationIndex ? 'after' : 'before';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  moveItemAtIndexToIndex(movingIndex, destinationIndex): void {
    Class.abstract();
  }

  // eslint-disable-next-line class-methods-use-this
  _isNormalizedItemIndex(index: number | Element): boolean {
    return (typeof index === 'number') && Math.round(index) === index;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _isItemIndex(index: number | Element): boolean {
    return Class.abstract();
  }

  _getNormalizedItemIndex(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value: number | Element,
  ): number {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _normalizeItemIndex(index: number | Element): number {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  _denormalizeItemIndex(index: number): number {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getItemByNormalizedIndex(value: number | Element): dxElementWrapper {
    return Class.abstract();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _itemsFromSameParent(movingIndex, destinationIndex): boolean {
    return Class.abstract();
  }
}

export default EditStrategy;
