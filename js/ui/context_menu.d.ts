import {
    positionConfig
} from '../animation/position';

import {
    JQueryEventObject,
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events';

import dxMenuBase, {
    dxMenuBaseOptions
} from './context_menu/ui.menu_base';

import {
    dxMenuBaseItem
} from './menu';

export interface dxContextMenuOptions extends dxMenuBaseOptions<dxContextMenu> {
    /**
     * @docid dxContextMenuOptions.closeOnOutsideClick
     * @type boolean|function
     * @default true
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: event) => boolean);
    /**
     * @docid dxContextMenuOptions.dataSource
     * @type string|Array<dxContextMenuItem>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxContextMenuItem> | DataSource | DataSourceOptions;
    /**
     * @docid dxContextMenuOptions.items
     * @type Array<dxContextMenuItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxContextMenuItem>;
    /**
     * @docid dxContextMenuOptions.onHidden
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onHidden?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxContextMenuOptions.onHiding
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onHiding?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any, cancel?: boolean }) => any);
    /**
     * @docid dxContextMenuOptions.onPositioning
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 position:positionConfig
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPositioning?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any, jQueryEvent?: JQueryEventObject, event?: event, position?: positionConfig }) => any);
    /**
     * @docid dxContextMenuOptions.onShowing
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShowing?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any, cancel?: boolean }) => any);
    /**
     * @docid dxContextMenuOptions.onShown
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShown?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxContextMenuOptions.position
     * @type positionConfig
     * @default { my: 'top left', at: 'top left' }
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: positionConfig;
    /**
     * @docid dxContextMenuOptions.showEvent
     * @type Object|string
     * @default "dxcontextmenu"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showEvent?: { delay?: number, name?: string } | string;
    /**
     * @docid dxContextMenuOptions.submenuDirection
     * @type Enums.ContextMenuSubmenuDirection
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    submenuDirection?: 'auto' | 'left' | 'right';
    /**
     * @docid dxContextMenuOptions.target
     * @type string|Node|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    target?: string | Element | JQuery;
    /**
     * @docid dxContextMenuOptions.visible
     * @type boolean
     * @default false
     * @fires dxContextMenuOptions.onShowing
     * @fires dxContextMenuOptions.onHiding
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}
/**
 * @docid dxContextMenu
 * @inherits dxMenuBase
 * @module ui/context_menu
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxContextMenu extends dxMenuBase {
    constructor(element: Element, options?: dxContextMenuOptions)
    constructor(element: JQuery, options?: dxContextMenuOptions)
    /**
     * @docid dxContextMenuMethods.hide
     * @publicName hide()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxContextMenuMethods.show
     * @publicName show()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid dxContextMenuMethods.toggle
     * @publicName toggle(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
}

export interface dxContextMenuItem extends dxMenuBaseItem {
    /**
     * @docid dxContextMenuItem.items
     * @type Array<dxContextMenuItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxContextMenuItem>;
}

declare global {
interface JQuery {
    dxContextMenu(): JQuery;
    dxContextMenu(options: "instance"): dxContextMenu;
    dxContextMenu(options: string): any;
    dxContextMenu(options: string, ...params: any[]): any;
    dxContextMenu(options: dxContextMenuOptions): JQuery;
}
}
export type Options = dxContextMenuOptions;

/** @deprecated use Options instead */
export type IOptions = dxContextMenuOptions;