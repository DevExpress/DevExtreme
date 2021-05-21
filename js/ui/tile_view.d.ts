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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default 100
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    baseItemHeight?: number;
    /**
     * @docid
     * @default 100
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    baseItemWidth?: number;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxTileViewItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Enums.Orientation
     * @default 'horizontal'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    direction?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default 500
     * @type_function_return number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    height?: number | string | (() => number | string);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default 20
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemMargin?: number;
    /**
     * @docid
     * @fires dxTileViewOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxTileViewItem | any>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showScrollbar?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/tile_view
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTileView extends CollectionWidget<dxTileViewOptions> {
    /**
     * @docid
     * @publicName scrollPosition()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    heightRatio?: number;
    /**
     * @docid
     * @default 1
     * @prevFileNamespace DevExpress.ui
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
