import type { dxElementWrapper } from '@js/core/renderer';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import type { HierarchicalCollectionWidgetOptions } from '@js/ui/hierarchical_collection/ui.hierarchical_collection_widget';
import HierarchicalCollectionWidget from '@js/ui/hierarchical_collection/ui.hierarchical_collection_widget';

import AsyncCollectionWidget from './async';

export interface TypedCollectionWidgetOptions<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TComponent extends HierarchicalCollectionWidget<any, TItem, TKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TItem extends ItemLike = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey = any,
> extends HierarchicalCollectionWidgetOptions<TComponent, TItem, TKey> {
}

declare class Hierarchical<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TProperties extends TypedCollectionWidgetOptions<any, TItem, TKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TItem extends ItemLike = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey = any,
> extends AsyncCollectionWidget<TProperties> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dataAdapter?: any;

  _initDataAdapter(): void;

  _getIconContainer(itemData: TItem): dxElementWrapper;
  _getTextContainer(itemData: TItem): dxElementWrapper;
  _getLinkContainer(
    iconContainer: dxElementWrapper,
    textContainer: dxElementWrapper,
    itemData: TItem,
  ): dxElementWrapper;
  _addContent($container: dxElementWrapper, itemData: TItem): void;

  _addWidgetClass(): void;

  _getChildNodes(node: TItem): TItem[];
  _hasChildren(node: TItem): number | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedCollectionWidget: typeof Hierarchical = HierarchicalCollectionWidget as any;

export default TypedCollectionWidget;
