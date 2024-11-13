import CollectionWidgetAsync from '@js/ui/collection/ui.collection_widget.async';

import type CollectionWidgetEdit from './edit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TypedCollectionWidget: typeof CollectionWidgetEdit = CollectionWidgetAsync as any;

export default TypedCollectionWidget;
