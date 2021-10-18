import { DataSourceDefinition } from '../data/data_source_aliases';
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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxGalleryOptions extends CollectionWidgetOptions<dxGallery> {
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
    dataSource?: DataSourceDefinition<string | Item | any>;
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
    items?: Array<string | Item | any>;
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
export default class dxGallery extends CollectionWidget<dxGalleryOptions> {
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
export type Properties = dxGalleryOptions;

/** @deprecated use Properties instead */
export type Options = dxGalleryOptions;
