import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    event
} from '../events/index';

import dxMultiView, {
    dxMultiViewItem,
    dxMultiViewOptions
} from './multi_view';

export interface dxTabPanelOptions extends dxMultiViewOptions<dxTabPanel> {
    /**
     * @docid
     * @default false
     * @default true [for](Android|iOS)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxTabPanelItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
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
     * @docid
     * @fires dxTabPanelOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxTabPanelItem | any>;
    /**
     * @docid
     * @extends Action
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
     * @docid
     * @extends Action
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
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTitleRendered?: ((e: { component?: dxTabPanel, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement }) => any);
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
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showNavButtons?: boolean;
    /**
     * @docid
     * @default false [for](non-touch_devices)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid
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

/**
 * @docid
 * @inherits dxMultiViewItem
 * @type object
 */
export interface dxTabPanelItem extends dxMultiViewItem {
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
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tabTemplate?: template | (() => string | Element | JQuery);
    /**
     * @docid
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
