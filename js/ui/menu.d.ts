import {
    dxElement
} from '../core/element';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    CollectionWidgetItem
} from './collection/ui.collection_widget.base';

import dxMenuBase, {
    dxMenuBaseOptions
} from './context_menu/ui.menu_base';

export interface dxMenuOptions extends dxMenuBaseOptions<dxMenu> {
    /**
     * @docid dxMenuOptions.adaptivityEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid dxMenuOptions.dataSource
     * @type string|Array<dxMenuItem>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxMenuItem> | DataSource | DataSourceOptions;
    /**
     * @docid dxMenuOptions.hideSubmenuOnMouseLeave
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideSubmenuOnMouseLeave?: boolean;
    /**
     * @docid dxMenuOptions.items
     * @type Array<dxMenuItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuItem>;
    /**
     * @docid dxMenuOptions.onSubmenuHidden
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSubmenuHidden?: ((e: { component?: dxMenu, element?: dxElement, model?: any, rootItem?: dxElement }) => any);
    /**
     * @docid dxMenuOptions.onSubmenuHiding
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:dxElement
     * @type_function_param1_field5 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSubmenuHiding?: ((e: { component?: dxMenu, element?: dxElement, model?: any, rootItem?: dxElement, cancel?: boolean }) => any);
    /**
     * @docid dxMenuOptions.onSubmenuShowing
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSubmenuShowing?: ((e: { component?: dxMenu, element?: dxElement, model?: any, rootItem?: dxElement }) => any);
    /**
     * @docid dxMenuOptions.onSubmenuShown
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSubmenuShown?: ((e: { component?: dxMenu, element?: dxElement, model?: any, rootItem?: dxElement }) => any);
    /**
     * @docid dxMenuOptions.orientation
     * @type Enums.Orientation
     * @default "horizontal"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * @docid dxMenuOptions.showFirstSubmenuMode
     * @type Object|Enums.ShowSubmenuMode
     * @default { name: "onClick", delay: { show: 50, hide: 300 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showFirstSubmenuMode?: { delay?: { hide?: number, show?: number } | number, name?: 'onClick' | 'onHover' } | 'onClick' | 'onHover';
    /**
     * @docid dxMenuOptions.submenuDirection
     * @type Enums.SubmenuDirection
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
}
/**
 * @docid dxMenu
 * @inherits dxMenuBase
 * @module ui/menu
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxMenu extends dxMenuBase {
    constructor(element: Element, options?: dxMenuOptions)
    constructor(element: JQuery, options?: dxMenuOptions)
}

export interface dxMenuBaseItem extends CollectionWidgetItem {
    /**
     * @docid dxMenuBaseItem.beginGroup
     * @type Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    beginGroup?: boolean;
    /**
     * @docid dxMenuBaseItem.closeMenuOnClick
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeMenuOnClick?: boolean;
    /**
     * @docid dxMenuBaseItem.disabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid dxMenuBaseItem.icon
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxMenuBaseItem.items
     * @type Array<dxMenuBaseItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * @docid dxMenuBaseItem.selectable
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectable?: boolean;
    /**
     * @docid dxMenuBaseItem.selected
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selected?: boolean;
    /**
     * @docid dxMenuBaseItem.text
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid dxMenuBaseItem.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}

export interface dxMenuItem extends dxMenuBaseItem {
    /**
     * @docid dxMenuItem.items
     * @type Array<dxMenuItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuItem>;
}

declare global {
interface JQuery {
    dxMenu(): JQuery;
    dxMenu(options: "instance"): dxMenu;
    dxMenu(options: string): any;
    dxMenu(options: string, ...params: any[]): any;
    dxMenu(options: dxMenuOptions): JQuery;
}
}
export type Options = dxMenuOptions;

/** @deprecated use Options instead */
export type IOptions = dxMenuOptions;