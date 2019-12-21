import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxTabsOptions<T = dxTabs> extends CollectionWidgetOptions<T> {
    /**
     * @docid dxTabsOptions.dataSource
     * @type string|Array<string,dxTabsItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxTabsItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid dxTabsOptions.focusStateEnabled
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxTabsOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxTabsOptions.items
     * @type Array<string, dxTabsItem, object>
     * @fires dxTabsOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxTabsItem | any>;
    /**
     * @docid dxTabsOptions.repaintChangesOnly
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid dxTabsOptions.scrollByContent
     * @type boolean
     * @default true
     * @default false [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid dxTabsOptions.scrollingEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid dxTabsOptions.selectedItems
     * @type Array<string,number,Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItems?: Array<string | number | any>;
    /**
     * @docid dxTabsOptions.selectionMode
     * @type Enums.NavSelectionMode
     * @default 'single'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid dxTabsOptions.showNavButtons
     * @type boolean
     * @default true
     * @default false [for](mobile_devices)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showNavButtons?: boolean;
}
/**
 * @docid dxTabs
 * @inherits CollectionWidget
 * @module ui/tabs
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTabs extends CollectionWidget {
    constructor(element: Element, options?: dxTabsOptions)
    constructor(element: JQuery, options?: dxTabsOptions)
}

export interface dxTabsItem extends CollectionWidgetItem {
    /**
     * @docid dxTabsItem.badge
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    badge?: string;
    /**
     * @docid dxTabsItem.icon
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
}

declare global {
interface JQuery {
    dxTabs(): JQuery;
    dxTabs(options: "instance"): dxTabs;
    dxTabs(options: string): any;
    dxTabs(options: string, ...params: any[]): any;
    dxTabs(options: dxTabsOptions): JQuery;
}
}
export type Options = dxTabsOptions;

/** @deprecated use Options instead */
export type IOptions = dxTabsOptions;