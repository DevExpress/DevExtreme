import { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

export type ItemLike = string | Item | any;

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<MultiViewInstance<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<MultiViewInstance<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<MultiViewInstance<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<MultiViewInstance<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<MultiViewInstance<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<MultiViewInstance<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<MultiViewInstance<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<MultiViewInstance<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<MultiViewInstance<TItem, TKey>> & SelectionChangedInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxMultiViewOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends Properties<TItem, TKey> {}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxMultiViewBaseOptions<
    TComponent extends dxMultiView<any, TItem, TKey> = dxMultiView<any, any, any>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
    /**
     * @docid dxMultiViewOptions.animationEnabled
     * @default true
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid dxMultiViewOptions.dataSource
     * @type string | Array<string | dxMultiViewItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey>;
    /**
     * @docid dxMultiViewOptions.deferRendering
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid dxMultiViewOptions.focusStateEnabled
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxMultiViewOptions.items
     * @type Array<string | dxMultiViewItem | any>
     * @fires dxMultiViewOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid dxMultiViewOptions.loop
     * @default false
     * @public
     */
    loop?: boolean;
    /**
     * @docid dxMultiViewOptions.selectedIndex
     * @default 0
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid dxMultiViewOptions.swipeEnabled
     * @default true
     * @public
     */
    swipeEnabled?: boolean;
}

/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxMultiView<
    TProperties extends dxMultiViewOptions<TItem, TKey> = dxMultiViewOptions<any, any>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<TProperties, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxMultiView
 */
export type Item = dxMultiViewItem;

 /**
  * @deprecated Use Item instead
  * @namespace DevExpress.ui
  */
export interface dxMultiViewItem extends CollectionWidgetItem {}

/** @public */
export type ExplicitTypes<
    TItem extends ItemLike,
    TKey,
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

interface MultiViewInstance<TItem, TKey> extends dxMultiView<Properties<TItem, TKey>, TItem, TKey> { }

/** @public */
export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxMultiViewBaseOptions<MultiViewInstance<TItem, TKey>, TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = any,
    TKey = any,
> = Properties<TItem, TKey>;
