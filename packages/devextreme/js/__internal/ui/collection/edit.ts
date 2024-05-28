import type { dxElementWrapper } from '@js/core/renderer';
import type { CollectionWidgetOptions, ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidgetEdit from '@js/ui/collection/ui.collection_widget.edit';

import CollectionWidgetBase from './base';

declare class Edit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TProperties extends CollectionWidgetOptions<any, TItem, TKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TItem extends ItemLike = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey = any,
> extends CollectionWidgetBase<TProperties> {
  _processSelectableItem($itemElement: dxElementWrapper, isSelected: boolean): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedCollectionWidget: typeof Edit = CollectionWidgetEdit as any;

export default TypedCollectionWidget;
