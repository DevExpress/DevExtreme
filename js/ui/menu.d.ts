import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import DataSource, {
    Options as DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import {
    CollectionWidgetItem,
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import dxMenuBase, {
    dxMenuBaseOptions,
} from './context_menu/ui.menu_base';

/** @public */
export type ContentReadyEvent = EventInfo<dxMenu>;

/** @public */
export type DisposingEvent = EventInfo<dxMenu>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxMenu>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxMenu, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxMenu, MouseEvent | PointerEvent | TouchEvent> & ItemInfo;

/** @public */
export type ItemRenderedEvent = EventInfo<dxMenu> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxMenu> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxMenu> & SelectionChangedInfo;

/** @public */
export type SubmenuHiddenEvent = EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
};

/** @public */
export type SubmenuHidingEvent = Cancelable & EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
};

/** @public */
export type SubmenuShowingEvent = EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
};

/** @public */
export type SubmenuShownEvent = EventInfo<dxMenu> & {
    readonly rootItem?: DxElement;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxMenuOptions extends dxMenuBaseOptions<dxMenu> {
    /**
     * @docid
     * @default false
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid
     * @type string | Array<dxMenuItem> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<Item> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default false
     * @public
     */
    hideSubmenuOnMouseLeave?: boolean;
    /**
     * @docid
     * @type Array<dxMenuItem>
     * @public
     */
    items?: Array<Item>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 rootItem:DxElement
     * @type_function_param1_field1 component:dxMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
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
     * @public
     */
    onSubmenuShown?: ((e: SubmenuShownEvent) => void);
    /**
     * @docid
     * @type Enums.Orientation
     * @default "horizontal"
     * @public
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * @docid
     * @type Object|Enums.ShowSubmenuMode
     * @default { name: "onClick", delay: { show: 50, hide: 300 } }
     * @public
     */
    showFirstSubmenuMode?: {
      /**
       * @docid
       * @default { show: 50, hide: 300 }
       */
      delay?: {
        /**
         * @docid
         * @default 300
         */
        hide?: number;
        /**
         * @docid
         * @default 50
         */
        show?: number;
      } | number;
      /**
       * @docid
       * @type Enums.ShowSubmenuMode
       * @default "onClick"
       */
      name?: 'onClick' | 'onHover';
    } | 'onClick' | 'onHover';
    /**
     * @docid
     * @type Enums.SubmenuDirection
     * @default "auto"
     * @public
     */
    submenuDirection?: 'auto' | 'leftOrTop' | 'rightOrBottom';
}
/**
 * @docid
 * @inherits dxMenuBase
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
     * @public
     */
    beginGroup?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    closeMenuOnClick?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @public
     */
    items?: Array<dxMenuBaseItem>;
    /**
     * @docid
     * @default false
     * @public
     */
    selectable?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    selected?: boolean;
    /**
     * @docid
     * @public
     */
    text?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
}

/**
 * @public
 * @namespace DevExpress.ui.dxMenu
 */
export type Item = dxMenuItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxMenuItem extends dxMenuBaseItem {
    /**
     * @docid
     * @public
     * @type Array<dxMenuItem>
     */
    items?: Array<Item>;
}

/** @public */
export type Properties = dxMenuOptions;

/** @deprecated use Properties instead */
export type Options = dxMenuOptions;

/** @deprecated use Properties instead */
export type IOptions = dxMenuOptions;
