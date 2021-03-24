import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    TEvent
} from '../events/index';

import dxMultiView, {
    dxMultiViewItem,
    dxMultiViewOptions
} from './multi_view';

/**
 * @public
*/
export interface TitleClickEvent {
    readonly component: dxTabPanel;
    readonly element: TElement;
    readonly model?: any;
    readonly itemData?: any;
    readonly itemElement?: TElement;
    readonly event?: TEvent
}

/**
 * @public
*/
export interface TitleHoldEvent {
    readonly component: dxTabPanel;
    readonly element: TElement;
    readonly model?: any;
    readonly itemData?: any;
    readonly itemElement?: TElement;
    readonly event?: TEvent;
}

/**
 * @public
*/
export interface TitleRenderedEvent {
    readonly component: dxTabPanel;
    readonly element: TElement;
    readonly model?: any;
    readonly itemData?: any;
    readonly itemElement?: TElement;
}

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
    dataSource?: string | Array<string | dxTabPanelItem | any> | DataSource | DataSourceOptions;
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
    itemTitleTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @fires dxTabPanelOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxTabPanelItem | any>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTitleClick?: ((e: TitleClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTitleHold?: ((e: TitleHoldEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTitleRendered?: ((e: TitleRenderedEvent) => void);
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
    constructor(element: TElement, options?: dxTabPanelOptions)
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
    tabTemplate?: template | (() => string | TElement);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    title?: string;
}

export type Options = dxTabPanelOptions;

/** @deprecated use Options instead */
export type IOptions = dxTabPanelOptions;
