import {
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions
} from './collection/ui.collection_widget.base';

export interface dxSlideOutOptions extends CollectionWidgetOptions<dxSlideOut> {
    /**
     * @docid dxSlideOutOptions.activeStateEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid dxSlideOutOptions.contentTemplate
     * @type template|function
     * @default "content"
     * @type_function_param1 container:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((container: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSlideOutOptions.dataSource
     * @type string|Array<string,dxSlideOutItem,object>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxSlideOutItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid dxSlideOutOptions.items
     * @type Array<string, dxSlideOutItem, object>
     * @fires dxSlideOutOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxSlideOutItem | any>;
    /**
     * @docid dxSlideOutOptions.menuGroupTemplate
     * @type template|function
     * @default "menuGroup"
     * @type_function_param1 groupData:object
     * @type_function_param2 groupIndex:number
     * @type_function_param3 groupElement:object
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuGroupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: any) => string | Element | JQuery);
    /**
     * @docid dxSlideOutOptions.menuGrouped
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuGrouped?: boolean;
    /**
     * @docid dxSlideOutOptions.menuItemTemplate
     * @type template|function
     * @default "menuItem"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuItemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSlideOutOptions.menuPosition
     * @type Enums.SlideOutMenuPosition
     * @default "normal"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuPosition?: 'inverted' | 'normal';
    /**
     * @docid dxSlideOutOptions.menuVisible
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuVisible?: boolean;
    /**
     * @docid dxSlideOutOptions.onMenuGroupRendered
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMenuGroupRendered?: ((e: { component?: dxSlideOut, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxSlideOutOptions.onMenuItemRendered
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMenuItemRendered?: ((e: { component?: dxSlideOut, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxSlideOutOptions.selectedIndex
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedIndex?: number;
    /**
     * @docid dxSlideOutOptions.swipeEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    swipeEnabled?: boolean;
}
/**
 * @docid dxSlideOut
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
     * @docid dxSlideOutMethods.hide
     * @publicName hideMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideMenu(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxSlideOutMethods.show
     * @publicName showMenu()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMenu(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxSlideOutMethods.toggleMenuVisibility
     * @publicName toggleMenuVisibility(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggleMenuVisibility(showing: boolean): Promise<void> & JQueryPromise<void>;
}

export interface dxSlideOutItem extends CollectionWidgetItem {
    /**
     * @docid dxSlideOutItem.menuTemplate
     * @type template|function
     * @type_function_return string|Node|jQuery
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