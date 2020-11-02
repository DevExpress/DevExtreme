import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events/index';

import dxMultiView, {
    dxMultiViewItem,
    dxMultiViewOptions
} from './multi_view';

export interface dxTabPanelOptions extends dxMultiViewOptions<dxTabPanel> {
    /**
     * @docid dxTabPanelOptions.animationEnabled
     * @type boolean
     * @default false
     * @default true [for](Android|iOS)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid dxTabPanelOptions.dataSource
     * @type string|Array<string,dxTabPanelItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxTabPanelItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid dxTabPanelOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxTabPanelOptions.itemTitleTemplate
     * @type template|function
     * @default "title"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxTabPanelOptions.items
     * @type Array<string, dxTabPanelItem, object>
     * @fires dxTabPanelOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxTabPanelItem | any>;
    /**
     * @docid dxTabPanelOptions.onTitleClick
     * @extends Action
     * @type function(e)|string
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTitleClick?: ((e: { component?: dxTabPanel, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, event?: event }) => any) | string;
    /**
     * @docid dxTabPanelOptions.onTitleHold
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTitleHold?: ((e: { component?: dxTabPanel, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, event?: event }) => any);
    /**
     * @docid dxTabPanelOptions.onTitleRendered
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTitleRendered?: ((e: { component?: dxTabPanel, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement }) => any);
    /**
     * @docid dxTabPanelOptions.repaintChangesOnly
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid dxTabPanelOptions.scrollByContent
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid dxTabPanelOptions.scrollingEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid dxTabPanelOptions.showNavButtons
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showNavButtons?: boolean;
    /**
     * @docid dxTabPanelOptions.swipeEnabled
     * @type boolean
     * @default false [for](non-touch_devices)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid dxTabPanel
 * @inherits dxMultiView
 * @module ui/tab_panel
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTabPanel extends dxMultiView {
    constructor(element: Element, options?: dxTabPanelOptions)
    constructor(element: JQuery, options?: dxTabPanelOptions)
}

export interface dxTabPanelItem extends dxMultiViewItem {
    /**
     * @docid dxTabPanelItem.badge
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    badge?: string;
    /**
     * @docid dxTabPanelItem.icon
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxTabPanelItem.tabTemplate
     * @type template|function
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tabTemplate?: template | (() => string | Element | JQuery);
    /**
     * @docid dxTabPanelItem.title
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    title?: string;
}

declare global {
interface JQuery {
    dxTabPanel(): JQuery;
    dxTabPanel(options: "instance"): dxTabPanel;
    dxTabPanel(options: string): any;
    dxTabPanel(options: string, ...params: any[]): any;
    dxTabPanel(options: dxTabPanelOptions): JQuery;
}
}
export type Options = dxTabPanelOptions;

/** @deprecated use Options instead */
export type IOptions = dxTabPanelOptions;