import {
    UserDefinedElement,
} from '../core/element';

import DataSource, {
    Options as DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

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
 * @deprecated {ui/multi_view.Properties}
 * @namespace DevExpress.ui
 */
export interface dxMultiViewOptions<T = dxMultiView> extends CollectionWidgetOptions<T> {
    /**
     * @docid
     * @default true
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @type string | Array<string | dxMultiViewItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<string | Item | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true
     * @public
     */
    deferRendering?: boolean;
    /**
     * @docid
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @type Array<string | dxMultiViewItem | any>
     * @fires dxMultiViewOptions.onOptionChanged
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxMultiView extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxMultiViewOptions)
}

/**
 * @public
 * @namespace DevExpress.ui.dxMultiView
 */
export type Item = dxMultiViewItem;

/**
 * @deprecated {ui/multi_view.Item}
 * @namespace DevExpress.ui
 */
export interface dxMultiViewItem extends CollectionWidgetItem {
}

/** @public */
export type Properties = dxMultiViewOptions;

/** @deprecated {ui/multi_view.Properties} */
export type Options = dxMultiViewOptions;

/** @deprecated {ui/multi_view.Properties} */
export type IOptions = dxMultiViewOptions;
