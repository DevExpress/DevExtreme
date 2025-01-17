import type { DataSource } from '@js/common/data';
import type { dxElementWrapper } from '@js/core/renderer';
import type { CollectionWidgetOptions, ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.base';
import Widget from '@ts/core/widget/widget';

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
  _renderedItemsCount: number;

  getDataSource(): DataSource<TItem, TKey>;

  _renderItems(items: TItem[]): void;
  _renderItem(
    index: number,
    itemData: TItem,
    $container: dxElementWrapper,
    $itemToReplace?: dxElementWrapper,
  ): dxElementWrapper;
  _renderItemFrame(
    index: number,
    itemData: TItem,
    $container: dxElementWrapper,
    $itemToReplace?: dxElementWrapper,
  ): dxElementWrapper;
  _renderItemContent(args: {
    index: number;
    itemData: TItem;
    container: dxElementWrapper;
    contentClass: string;
    defaultTemplateName: string;
    uniqueKey?: string;
  }): dxElementWrapper;
  _renderContent(): void;
  _postprocessRenderItem(args: unknown): void;
  _prepareContent(): void;
  _itemSelector(): string;
  _itemContainer(): dxElementWrapper;

  _createItemByTemplate(
    itemTemplate: { source: () => unknown },
    args: { itemData: unknown }): void;

  _getItemData(item: Element | HTMLElement | dxElementWrapper): TItem;
  _getItemContent($item: dxElementWrapper): dxElementWrapper;
  _getIndexByItem(item: TItem): number;
  _getIndexByItemData(item: TItem): number;
  _getAvailableItems($items?: dxElementWrapper): dxElementWrapper;
  _itemElements(): dxElementWrapper;
  _getSummaryItemsSize(
    dimension: string,
    items: dxElementWrapper,
    includeMargin?: boolean
  ): number;
  _getActiveItem(last?: boolean): dxElementWrapper;
  _findItemElementByItem(item: TItem): dxElementWrapper;

  _itemOptionChanged(item: TItem, property: string, value: unknown, prevValue: unknown): void;
  _itemEventHandler($item: dxElementWrapper, eventName: string, eventData: unknown): void;
  _itemIndexKey(): number;

  _prevItem($items: dxElementWrapper): dxElementWrapper;
  _nextItem($items: dxElementWrapper): dxElementWrapper;

  _attachContextMenuEvent(): void;
  _itemContextMenuHandler(event: unknown): void;
  _itemPointerDownHandler(event: unknown): void;
  _itemDXEventHandler(event: unknown, eventHandlerName: string, args: unknown, actionConfig: {
    beforeExecute: (args?: unknown) => void;
    afterExecute: () => void;
  }): void;

  _refreshActiveDescendant($target: dxElementWrapper): void;
  _moveFocus(location: string, event?: unknown): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedCollectionWidget: typeof Base = CollectionWidget as any;

export default TypedCollectionWidget;
