import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    CollectionWidgetItem,
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import dxMenuBase, {
    dxMenuBaseOptions
} from './context_menu/ui.menu_base';

/** @public */
export type ContentReadyEvent = EventInfo<dxMenu>;

/** @public */
export type DisposingEvent = EventInfo<dxMenu>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxMenu>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxMenu> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxMenu> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxMenu> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxMenu> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxMenu> & SelectionChangedInfo;

/** @public */
export type SubmenuHiddenEvent = EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
}

/** @public */
export type SubmenuHidingEvent = Cancelable & EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
}

/** @public */
export type SubmenuShowingEvent = EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
}

/** @public */
export type SubmenuShownEvent = EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
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
     * @type_function_param1_field4 rootItem:DxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:DxElement
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
     * @type_function_param1_field4 rootItem:DxElement
     * @type_function_param1_field5 cancel:boolean
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:DxElement
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
     * @type_function_param1_field4 rootItem:DxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:DxElement
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
     * @type_function_param1_field4 rootItem:DxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:DxElement
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxMenu extends dxMenuBase {
    constructor(element: UserDefinedElement, options?: dxMenuOptions)
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 * @namespace DevExpress.ui
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
 * @namespace DevExpress.ui
 */
export interface dxMenuItem extends dxMenuBaseItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxMenuItem>;
}

/** @public */
export type Properties = dxMenuOptions;

/** @deprecated use Properties instead */
export type Options = dxMenuOptions;

/** @deprecated use Properties instead */
export type IOptions = dxMenuOptions;
