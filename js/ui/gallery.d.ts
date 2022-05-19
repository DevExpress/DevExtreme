import { DataSourceLike } from '../data/data_source';
import {
    DxPromise,
} from '../core/utils/deferred';

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

type ItemLike = string | Item | any;

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxGallery<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxGallery<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends ItemLike = Item, TKey = any> = InitializedEventInfo<dxGallery<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxGallery<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxGallery<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = Item, TKey = any> = NativeEventInfo<dxGallery<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxGallery<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxGallery<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent<TItem extends ItemLike = Item, TKey = any> = EventInfo<dxGallery<TItem, TKey>> & SelectionChangedInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxGalleryOptions<
    TItem extends ItemLike = Item,
    TKey = any,
> extends CollectionWidgetOptions<dxGallery<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @default 400
     * @public
     */
    animationDuration?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @type string | Array<string | dxGalleryItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey>;
    /**
     * @docid
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    indicatorEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    initialItemWidth?: number;
    /**
     * @docid
     * @type Array<string | dxGalleryItem | any>
     * @fires dxGalleryOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default false
     * @public
     */
    loop?: boolean;
    /**
     * @docid
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default 0
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @default true
     * @public
     */
    showIndicator?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showNavButtons?: boolean;
    /**
     * @docid
     * @default 0
     * @public
     */
    slideshowDelay?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    stretchImages?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    swipeEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    wrapAround?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxGallery<
    TItem extends ItemLike = Item,
    TKey = any,
> extends CollectionWidget<dxGalleryOptions<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @publicName goToItem(itemIndex, animation)
     * @param1 itemIndex:numeric
     * @return Promise<void>
     * @public
     */
    goToItem(itemIndex: number, animation: boolean): DxPromise<void>;
    /**
     * @docid
     * @publicName nextItem(animation)
     * @return Promise<void>
     * @public
     */
    nextItem(animation: boolean): DxPromise<void>;
    /**
     * @docid
     * @publicName prevItem(animation)
     * @return Promise<void>
     * @public
     */
    prevItem(animation: boolean): DxPromise<void>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxGallery
 */
export type Item = dxGalleryItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxGalleryItem extends CollectionWidgetItem {
    /**
     * @docid
     * @public
     */
    imageAlt?: string;
    /**
     * @docid
     * @public
     */
    imageSrc?: string;
}

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

/** @public */
export type Properties<
    TItem extends ItemLike = Item,
    TKey = any,
> = dxGalleryOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = Item,
    TKey = any,
> = Properties<TItem, TKey>;
