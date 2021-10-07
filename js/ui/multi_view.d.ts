import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import {
    CollectionWidgetItem,
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import dxMultiViewBase, {
    dxMultiViewBaseOptions,
} from './multi_view_base';

/** @public */
export type ContentReadyEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxMultiView<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxMultiView<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends string | Item<any> | any = any, TKey = any> = InitializedEventInfo<dxMultiView<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxMultiView<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxMultiView<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxMultiView<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends string | Item<any> | any = any, TKey = any> = NativeEventInfo<dxMultiView<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxMultiView<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent<TItem extends string | Item<any> | any = any, TKey = any> = EventInfo<dxMultiView<TItem, TKey>> & SelectionChangedInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxMultiViewOptions<
    TItem extends string | Item<any> | any = any,
    TKey = any,
> extends dxMultiViewBaseOptions<dxMultiView<TItem, TKey>, TItem, TKey> { }

/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxMultiView<
    TItem extends string | Item<any> | any = any,
    TKey = any,
> extends dxMultiViewBase<dxMultiViewOptions<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxMultiView
 */
export type Item<TItem extends Item<any> | any = any> = dxMultiViewItem<TItem>;

 /**
  * @deprecated Use Item instead
  * @namespace DevExpress.ui
  */
export interface dxMultiViewItem<TItem extends dxMultiViewItem<any> | any = any> extends CollectionWidgetItem<TItem> {}

/** @public */
export type ExplicitTypes<
    TItem extends string | Item<any> | any = any,
    TKey = any,
> = {
    Properties: Properties<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TItem, TKey>;
    ItemHoldEvent: ItemHoldEvent<TItem, TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
};

/** @public */
export type Properties<
    TItem extends string | Item<any> | any = any,
    TKey = any,
> = dxMultiViewOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends string | Item<any> | any = any,
    TKey = any,
> = Properties<TItem, TKey>;

/** @deprecated use Properties instead */
export type IOptions<
    TItem extends string | Item<any> | any = any,
    TKey = any,
> = Properties<TItem, TKey>;
