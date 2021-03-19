import '../jquery_augmentation';

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

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxSlideOutOptions extends CollectionWidgetOptions<dxSlideOut> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default "content"
     * @type_function_param1 container:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((container: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxSlideOutItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @fires dxSlideOutOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxSlideOutItem | any>;
    /**
     * @docid
     * @default "menuGroup"
     * @type_function_param1 groupData:object
     * @type_function_param2 groupIndex:number
     * @type_function_param3 groupElement:object
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuGroupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: any) => string | Element | JQuery);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuGrouped?: boolean;
    /**
     * @docid
     * @default "menuItem"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type Enums.SlideOutMenuPosition
     * @default "normal"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuVisible?: boolean;
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMenuGroupRendered?: ((e: { component?: dxSlideOut, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMenuItemRendered?: ((e: { component?: dxSlideOut, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget
 * @module ui/slide_out
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSlideOut extends CollectionWidget {
    constructor(element: Element, options?: dxSlideOutOptions)
    constructor(element: JQuery, options?: dxSlideOutOptions)
    /**
     * @docid
     * @publicName hideMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideMenu(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid
     * @publicName showMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMenu(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid
     * @publicName toggleMenuVisibility(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggleMenuVisibility(showing: boolean): Promise<void> & JQueryPromise<void>;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 */
export interface dxSlideOutItem extends CollectionWidgetItem {
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuTemplate?: template | (() => string | Element | JQuery);
}

declare global {
interface JQuery {
    dxSlideOut(): JQuery;
    dxSlideOut(options: "instance"): dxSlideOut;
    dxSlideOut(options: string): any;
    dxSlideOut(options: string, ...params: any[]): any;
    dxSlideOut(options: dxSlideOutOptions): JQuery;
}
}
export type Options = dxSlideOutOptions;

/** @deprecated use Options instead */
export type IOptions = dxSlideOutOptions;
