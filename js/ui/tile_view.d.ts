import {
    UserDefinedElement
} from '../core/element';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

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
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = EventInfo<dxTileView>;

/** @public */
export type DisposingEvent = EventInfo<dxTileView>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTileView>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxTileView> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxTileView> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxTileView> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxTileView> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxTileView> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTileViewOptions extends CollectionWidgetOptions<dxTileView> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default 100
     * @public
     */
    baseItemHeight?: number;
    /**
     * @docid
     * @default 100
     * @public
     */
    baseItemWidth?: number;
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxTileViewItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Enums.Orientation
     * @default 'horizontal'
     * @public
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default 500
     * @type_function_return number|string
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default 20
     * @public
     */
    itemMargin?: number;
    /**
     * @docid
     * @fires dxTileViewOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxTileViewItem | any>;
    /**
     * @docid
     * @default false
     * @public
     */
    showScrollbar?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/tile_view
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTileView extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxTileViewOptions)
    /**
     * @docid
     * @publicName scrollPosition()
     * @return numeric
     * @public
     */
    scrollPosition(): number;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxTileViewItem extends CollectionWidgetItem {
    /**
     * @docid
     * @default 1
     * @public
     */
    heightRatio?: number;
    /**
     * @docid
     * @default 1
     * @public
     */
    widthRatio?: number;
}

/** @public */
export type Properties = dxTileViewOptions;

/** @deprecated use Properties instead */
export type Options = dxTileViewOptions;

/** @deprecated use Properties instead */
export type IOptions = dxTileViewOptions;
