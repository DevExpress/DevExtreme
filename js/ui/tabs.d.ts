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
     * @type string | Array<string | dxTabsItem | any> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<string | Item | any>;
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
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @type Array<string | dxTabsItem | any>
     * @fires dxTabsOptions.onOptionChanged
     * @public
     */
    items?: Array<string | Item | any>;
    /**
     * @docid
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default true
     * @default false &for(desktop)
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
     * @type Enums.NavSelectionMode
     * @default 'single'
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @default true
     * @default false &for(mobile_devices)
     * @public
     */
    showNavButtons?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTabs<TProperties = Properties> extends CollectionWidget<TProperties> { }

/**
 * @public
 * @namespace DevExpress.ui.dxTabs
 */
export type Item = dxTabsItem;

/**
 * @deprecated Use Item instead
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

interface TabsInstance extends dxTabs<Properties> { }

/** @public */
export type Properties = dxTabsOptions<TabsInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;
