import type { dxElementWrapper } from '@js/core/renderer';
import type DataSource from '@js/data/data_source';
import type { CollectionWidgetOptions, ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.base';

import Widget from '../widget';

export interface TypedCollectionWidgetOptions<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TComponent extends CollectionWidget<any, TItem, TKey> | any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TItem extends ItemLike = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
  _itemAttributes?: Record<string, string>;
}

declare class Base<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TProperties extends TypedCollectionWidgetOptions<any, TItem, TKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TItem extends ItemLike = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey = any,
> extends Widget<TProperties> {
  getDataSource(): DataSource<TItem, TKey>;

  _renderItems(items: unknown): void;
  _renderItem(
    index: number,
    itemData: TItem,
    $container: dxElementWrapper,
    $itemToReplace: dxElementWrapper,
  ): dxElementWrapper;
  _renderItemContent(args: {
    index: number;
    itemData: TItem;
    container: dxElementWrapper;
    contentClass: string;
    defaultTemplateName: string;
  }): dxElementWrapper;
  _itemSelector(): string;
  _itemContainer(): dxElementWrapper;

  _createItemByTemplate(
    itemTemplate: { source: () => unknown },
    args: { itemData: unknown }): void;

  _getItemData(item: Element | HTMLElement | dxElementWrapper): TItem;
  _getIndexByItem(item: TItem): number;
  _getIndexByItemData(item: TItem): number;
  _findItemElementByItem(item: TItem): dxElementWrapper;

  _itemOptionChanged(item: TItem, property: string, value: unknown): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedCollectionWidget: typeof Base = CollectionWidget as any;

export default TypedCollectionWidget;
