import {
    ElementIntake
} from '../core/element';

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

export interface dxTabsOptions<T = dxTabs> extends CollectionWidgetOptions<T> {
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxTabsItem | any> | DataSource | DataSourceOptions;
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
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @fires dxTabsOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxTabsItem | any>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default true
     * @default false [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItems?: Array<string | number | any>;
    /**
     * @docid
     * @type Enums.NavSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @default true
     * @default false [for](mobile_devices)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showNavButtons?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/tabs
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTabs extends CollectionWidget {
    constructor(element: ElementIntake, options?: dxTabsOptions)
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 */
export interface dxTabsItem extends CollectionWidgetItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    badge?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
}

/** @public */
export type Options = dxTabsOptions;

/** @deprecated use Options instead */
export type IOptions = dxTabsOptions;
