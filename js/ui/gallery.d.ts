import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = EventInfo<dxGallery>;

/** @public */
export type DisposingEvent = EventInfo<dxGallery>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxGallery>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxGallery> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxGallery> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxGallery> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxGallery> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxGallery> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxGallery> & SelectionChangedInfo;

export interface dxGalleryOptions extends CollectionWidgetOptions<dxGallery> {
    /**
     * @docid
     * @default 400
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationDuration?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxGalleryItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    indicatorEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    initialItemWidth?: number;
    /**
     * @docid
     * @fires dxGalleryOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxGalleryItem | any>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loop?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showIndicator?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showNavButtons?: boolean;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    slideshowDelay?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stretchImages?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    swipeEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    wrapAround?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/gallery
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxGallery extends CollectionWidget {
    constructor(element: TElement, options?: dxGalleryOptions)
    /**
     * @docid
     * @publicName goToItem(itemIndex, animation)
     * @param1 itemIndex:numeric
     * @param2 animation:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    goToItem(itemIndex: number, animation: boolean): TPromise<void>;
    /**
     * @docid
     * @publicName nextItem(animation)
     * @param1 animation:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    nextItem(animation: boolean): TPromise<void>;
    /**
     * @docid
     * @publicName prevItem(animation)
     * @param1 animation:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    prevItem(animation: boolean): TPromise<void>;
}

/**
 * @docid
 * @type object
 * @inherits CollectionWidgetItem
 */
export interface dxGalleryItem extends CollectionWidgetItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    imageAlt?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    imageSrc?: string;
}

/** @public */
export type Options = dxGalleryOptions;

/** @deprecated use Options instead */
export type IOptions = dxGalleryOptions;
