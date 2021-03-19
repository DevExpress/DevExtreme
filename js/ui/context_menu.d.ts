import {
    positionConfig
} from '../animation/position';

import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    event
} from '../events/index';

import dxMenuBase, {
    dxMenuBaseOptions
} from './context_menu/ui.menu_base';

import {
    dxMenuBaseItem
} from './menu';

export interface dxContextMenuOptions extends dxMenuBaseOptions<dxContextMenu> {
    /**
     * @docid
     * @default true
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: event) => boolean);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxContextMenuItem> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxContextMenuItem>;
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onHidden?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onHiding?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any, cancel?: boolean }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 position:positionConfig
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onPositioning?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any, event?: event, position?: positionConfig }) => any);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShowing?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any, cancel?: boolean }) => any);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShown?: ((e: { component?: dxContextMenu, element?: dxElement, model?: any }) => any);
    /**
     * @docid
     * @default { my: 'top left', at: 'top left' }
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    position?: positionConfig;
    /**
     * @docid
     * @default "dxcontextmenu"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showEvent?: {
      /**
      * @docid
      * @default undefined
      * @prevFileNamespace DevExpress.ui
      */
      delay?: number,
      /**
      * @docid
      * @default undefined
      * @prevFileNamespace DevExpress.ui
      */
      name?: string
    } | string;
    /**
     * @docid
     * @type Enums.ContextMenuSubmenuDirection
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    submenuDirection?: 'auto' | 'left' | 'right';
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    target?: string | Element | JQuery;
    /**
     * @docid
     * @default false
     * @fires dxContextMenuOptions.onShowing
     * @fires dxContextMenuOptions.onHiding
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
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
     * @docid
     * @publicName hide()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid
     * @publicName show()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): Promise<void> & JQueryPromise<void>;
    /**
     * @docid
     * @publicName toggle(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(showing: boolean): Promise<void> & JQueryPromise<void>;
}

/**
 * @docid
 * @inherits dxMenuBaseItem
 * @type object
 */
export interface dxContextMenuItem extends dxMenuBaseItem {
    /**
     * @docid
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
