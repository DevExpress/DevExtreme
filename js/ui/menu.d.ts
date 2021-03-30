import {
    TElement
} from '../core/element';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    CollectionWidgetItem,
    ComponentItemClickEvent,
    ComponentItemContextMenuEvent,
    ComponentItemRenderedEvent,
    ComponentSelectionChangedEvent
} from './collection/ui.collection_widget.base';

import dxMenuBase, {
    dxMenuBaseOptions
} from './context_menu/ui.menu_base';

import {
    ComponentHidingEvent,
    ComponentHiddenEvent,
    ComponentShowingEvent,
    ComponentShownEvent
} from './overlay';

import {
    ComponentContentReadyEvent
} from './widget/ui.widget';

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxMenu>;
/**
 * @public
 */
export type ItemClickEvent = ComponentItemClickEvent<dxMenu>;
/**
 * @public
 */
export type ItemContextMenuEvent = ComponentItemContextMenuEvent<dxMenu>;
/**
 * @public
 */
export type ItemRenderedEvent = ComponentItemRenderedEvent<dxMenu>;
/**
 * @public
 */
export type SelectionChangedEvent = ComponentSelectionChangedEvent<dxMenu>;
/**
 * @public
 */
export type SubmenuHiddenEvent = ComponentHiddenEvent<dxMenu> & {
    readonly rootItem?: TElement;
}
/**
 * @public
 */
export type SubmenuHidingEvent = ComponentHidingEvent<dxMenu> & {
    readonly rootItem?: TElement;
}
/**
 * @public
 */
export type SubmenuShowingEvent = ComponentShowingEvent<dxMenu> & {
    readonly rootItem?: TElement;
}
/**
 * @public
 */
export type SubmenuShownEvent = ComponentShownEvent<dxMenu> & {
    readonly rootItem?: TElement;
}

export interface dxMenuOptions extends dxMenuBaseOptions<dxMenu> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxMenuItem> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideSubmenuOnMouseLeave?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuItem>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:dxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSubmenuHidden?: ((e: SubmenuHiddenEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:dxElement
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSubmenuHiding?: ((e: SubmenuHidingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:dxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSubmenuShowing?: ((e: SubmenuShowingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:dxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSubmenuShown?: ((e: SubmenuShownEvent) => void);
    /**
     * @docid
     * @type Enums.Orientation
     * @default "horizontal"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @type Object|Enums.ShowSubmenuMode
     * @default { name: "onClick", delay: { show: 50, hide: 300 } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showFirstSubmenuMode?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default { show: 50, hide: 300 }
      */
      delay?: {
        /**
        * @docid
        * @prevFileNamespace DevExpress.ui
        * @default 300
        */
        hide?: number,
        /**
        * @docid
        * @prevFileNamespace DevExpress.ui
        * @default 50
        */
        show?: number
      } | number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @type Enums.ShowSubmenuMode
      * @default "onClick"
      */
      name?: 'onClick' | 'onHover'
    } | 'onClick' | 'onHover';
    /**
     * @docid
     * @type Enums.SubmenuDirection
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
}
/**
 * @docid
 * @inherits dxMenuBase
 * @module ui/menu
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxMenu extends dxMenuBase {
    constructor(element: TElement, options?: dxMenuOptions)
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 */
export interface dxMenuBaseItem extends CollectionWidgetItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    beginGroup?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeMenuOnClick?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectable?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selected?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}

/**
* @docid
* @inherits dxMenuBaseItem
* @type object
 */
export interface dxMenuItem extends dxMenuBaseItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuItem>;
}

export type Options = dxMenuOptions;

/** @deprecated use Options instead */
export type IOptions = dxMenuOptions;
