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
export type ContentReadyEvent = EventInfo<dxTabs>;

/** @public */
export type DisposingEvent = EventInfo<dxTabs>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTabs>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxTabs> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxTabs> & ItemInfo;

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxTabs> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxTabs> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxTabs> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxTabs> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTabsOptions<TComponent> extends CollectionWidgetOptions<TComponent> {
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxTabsItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @fires dxTabsOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxTabsItem | any>;
    /**
     * @docid
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default true
     * @default false [for](desktop)
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid
     * @public
     */
    selectedItems?: Array<string | number | any>;
    /**
     * @docid
     * @type Enums.NavSelectionMode
     * @default 'single'
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @default true
     * @default false [for](mobile_devices)
     * @public
     */
    showNavButtons?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/tabs
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTabs<TProperties = Properties> extends CollectionWidget<TProperties> { }

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxTabsItem extends CollectionWidgetItem {
    /**
     * @docid
     * @public
     */
    badge?: string;
    /**
     * @docid
     * @public
     */
    icon?: string;
}

/** @public */
export type Properties = dxTabsOptions<dxTabs<Properties>>;

/** @deprecated use Properties instead */
export type Options = Properties;

/** @deprecated use Properties instead */
export type IOptions = Properties;
