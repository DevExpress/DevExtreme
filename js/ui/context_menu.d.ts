import {
    positionConfig,
} from '../animation/position';

import {
    UserDefinedElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import DataSource, {
    Options as DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import dxMenuBase, {
    dxMenuBaseOptions,
} from './context_menu/ui.menu_base';

import {
    dxMenuBaseItem,
} from './menu';

import {
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

/** @public */
export type ContentReadyEvent = EventInfo<dxContextMenu>;

/** @public */
export type DisposingEvent = EventInfo<dxContextMenu>;

/** @public */
export type HiddenEvent = EventInfo<dxContextMenu>;

/** @public */
export type HidingEvent = Cancelable & EventInfo<dxContextMenu>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxContextMenu>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxContextMenu, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxContextMenu, MouseEvent | PointerEvent | TouchEvent> & ItemInfo;

/** @public */
export type ItemRenderedEvent = EventInfo<dxContextMenu> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxContextMenu> & ChangedOptionInfo;

/** @public */
export type PositioningEvent = NativeEventInfo<dxContextMenu, MouseEvent | PointerEvent | TouchEvent> & {
    readonly position: positionConfig;
};

/** @public */
export type SelectionChangedEvent = EventInfo<dxContextMenu> & SelectionChangedInfo;

/** @public */
export type ShowingEvent = Cancelable & EventInfo<dxContextMenu>;

/** @public */
export type ShownEvent = EventInfo<dxContextMenu>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxContextMenuOptions extends dxMenuBaseOptions<dxContextMenu> {
    /**
     * @docid
     * @default true
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @type string | Array<dxContextMenuItem> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<Item> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Array<dxContextMenuItem>
     * @public
     */
    items?: Array<Item>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxContextMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onHidden?: ((e: HiddenEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field1 component:dxContextMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onHiding?: ((e: HidingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 position:positionConfig
     * @type_function_param1_field1 component:dxContextMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onPositioning?: ((e: PositioningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field1 component:dxContextMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onShowing?: ((e: ShowingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxContextMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onShown?: ((e: ShownEvent) => void);
    /**
     * @docid
     * @default { my: 'top left', at: 'top left' }
     * @ref
     * @public
     */
    position?: positionConfig;
    /**
     * @docid
     * @default "dxcontextmenu"
     * @public
     */
    showEvent?: {
      /**
       * @docid
       * @default undefined
       */
      delay?: number;
      /**
       * @docid
       * @default undefined
       */
      name?: string;
    } | string;
    /**
     * @docid
     * @type Enums.ContextMenuSubmenuDirection
     * @default "auto"
     * @public
     */
    submenuDirection?: 'auto' | 'left' | 'right';
    /**
     * @docid
     * @default undefined
     * @public
     */
    target?: string | UserDefinedElement;
    /**
     * @docid
     * @default false
     * @fires dxContextMenuOptions.onShowing
     * @fires dxContextMenuOptions.onHiding
     * @public
     */
    visible?: boolean;
}
/**
 * @docid
 * @inherits dxMenuBase
 * @namespace DevExpress.ui
 * @public
 */
export default class dxContextMenu extends dxMenuBase {
    constructor(element: UserDefinedElement, options?: dxContextMenuOptions)
    /**
     * @docid
     * @publicName hide()
     * @return Promise<void>
     * @public
     */
    hide(): DxPromise<void>;
    /**
     * @docid
     * @publicName show()
     * @return Promise<void>
     * @public
     */
    show(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggle(showing)
     * @return Promise<void>
     * @public
     */
    toggle(showing: boolean): DxPromise<void>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxContextMenu
 */
export type Item = dxContextMenuItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxContextMenuItem extends dxMenuBaseItem {
    /**
     * @docid
     * @public
     * @type Array<dxContextMenuItem>
     */
    items?: Array<Item>;
}

/** @public */
export type Properties = dxContextMenuOptions;

/** @deprecated use Properties instead */
export type Options = dxContextMenuOptions;

/** @deprecated use Properties instead */
export type IOptions = dxContextMenuOptions;
