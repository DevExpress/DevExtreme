import CollectionWidgetAsync from '@js/ui/collection/ui.collection_widget.async';
import type { CollectionWidgetOptions, ItemLike } from '@js/ui/collection/ui.collection_widget.base';

import CollectionWidgetEdit from './edit';

declare class Async<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TProperties extends CollectionWidgetOptions<any, TItem, TKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TItem extends ItemLike = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey = any,
> extends CollectionWidgetEdit<TProperties> {
  _renderItemsAsync(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedCollectionWidget: typeof Async = CollectionWidgetAsync as any;

export default TypedCollectionWidget;
