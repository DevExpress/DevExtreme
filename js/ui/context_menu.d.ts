import {
    positionConfig
} from '../animation/position';

import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    TEvent
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
    closeOnOutsideClick?: boolean | ((event: TEvent) => boolean);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxContextMenuItem> | DataSource | DataSourceOptions;
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
    onHidden?: ((e: { component?: dxContextMenu, element?: TElement, model?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onHiding?: ((e: { component?: dxContextMenu, element?: TElement, model?: any, cancel?: boolean }) => void);
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
    onPositioning?: ((e: { component?: dxContextMenu, element?: TElement, model?: any, event?: TEvent, position?: positionConfig }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShowing?: ((e: { component?: dxContextMenu, element?: TElement, model?: any, cancel?: boolean }) => void);
    /**
     * @docid
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShown?: ((e: { component?: dxContextMenu, element?: TElement, model?: any }) => void);
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
    target?: string | TElement;
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
    constructor(element: TElement, options?: dxContextMenuOptions)
    /**
     * @docid
     * @publicName hide()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): TPromise<void>;
    /**
     * @docid
     * @publicName show()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): TPromise<void>;
    /**
     * @docid
     * @publicName toggle(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(showing: boolean): TPromise<void>;
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

export type Options = dxContextMenuOptions;

/** @deprecated use Options instead */
export type IOptions = dxContextMenuOptions;
