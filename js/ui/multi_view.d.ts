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
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = EventInfo<dxMultiView>;

/** @public */
export type DisposingEvent = EventInfo<dxMultiView>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxMultiView>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxMultiView> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxMultiView> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxMultiView> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxMultiView> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxMultiView> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxMultiView> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxMultiViewOptions<TComponent> extends CollectionWidgetOptions<TComponent> {
    /**
     * @docid
     * @default true
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxMultiViewItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @fires dxMultiViewOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxMultiViewItem | any>;
    /**
     * @docid
     * @default false
     * @public
     */
    loop?: boolean;
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
    swipeEnabled?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/multi_view
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxMultiView<TProperties = Properties> extends CollectionWidget<TProperties> { }

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxMultiViewItem extends CollectionWidgetItem {
}

/** @public */
export type Properties = dxMultiViewOptions<dxMultiView<Properties>>;

/** @deprecated use Properties instead */
export type Options = Properties;

/** @deprecated use Properties instead */
export type IOptions = Properties;
