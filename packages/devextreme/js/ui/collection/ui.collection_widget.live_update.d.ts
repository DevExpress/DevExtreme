import CollectionWidget, { CollectionWidgetOptions } from './ui.collection_widget.base';

export type ItemLike = string | CollectionWidgetItem | any;

export default class CollectionWidgetLiveUpdate<
    TProperties extends CollectionWidgetOptions<any, TItem, TKey>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<TProperties> {}
