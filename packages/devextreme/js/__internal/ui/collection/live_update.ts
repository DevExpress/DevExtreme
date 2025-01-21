import type { ItemLike } from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidgetLiveUpdate from '@js/ui/collection/ui.collection_widget.live_update';
import type { CollectionWidgetBaseProperties } from '@ts/ui/collection/m_collection_widget.base';

import CollectionWidgetAsync from './async';

declare class LiveUpdate<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TProperties extends CollectionWidgetBaseProperties<any, TItem, TKey>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TItem extends ItemLike = any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TKey = any,
> extends CollectionWidgetAsync<TProperties> {
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedCollectionWidget: typeof LiveUpdate = CollectionWidgetLiveUpdate as any;

export default TypedCollectionWidget;
