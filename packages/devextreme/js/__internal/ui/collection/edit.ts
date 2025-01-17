import type { dxElementWrapper } from '@js/core/renderer';
import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidgetEdit from '@js/ui/collection/ui.collection_widget.edit';
import type { CollectionWidgetBaseProperties } from '@ts/ui/collection/m_collection_widget.base';
import CollectionWidgetBase from '@ts/ui/collection/m_collection_widget.base';

declare class Edit<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TProperties extends CollectionWidgetBaseProperties<any, TItem, TKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TItem extends ItemLike = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey = any,
> extends CollectionWidgetBase<TProperties> {
  _processSelectableItem($itemElement: dxElementWrapper, isSelected: boolean): void;
  _setAriaSelectionAttribute($itemElement: dxElementWrapper, isSelected: string): void;
  _clearSelectedItems(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedCollectionWidget: typeof Edit = CollectionWidgetEdit as any;

export default TypedCollectionWidget;
