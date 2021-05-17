import {
    positionConfig
} from '../animation/position';

import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import dxMenuBase, {
    dxMenuBaseOptions
} from './context_menu/ui.menu_base';

import {
    dxMenuBaseItem
} from './menu';

import {
    SelectionChangedInfo
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
export type ItemClickEvent = NativeEventInfo<dxContextMenu> & ItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxContextMenu> & ItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxContextMenu> & ItemInfo;

/** @public */
export type OptionChangedEvent = EventInfo<dxContextMenu> & ChangedOptionInfo;

/** @public */
export type PositioningEvent = NativeEventInfo<dxContextMenu> & {
    readonly position: positionConfig;
}

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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
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
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxContextMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onShown?: ((e: ShownEvent) => void);
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
    target?: string | UserDefinedElement;
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxContextMenu extends dxMenuBase {
    constructor(element: UserDefinedElement, options?: dxContextMenuOptions)
    /**
     * @docid
     * @publicName hide()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hide(): DxPromise<void>;
    /**
     * @docid
     * @publicName show()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    show(): DxPromise<void>;
    /**
     * @docid
     * @publicName toggle(showing)
     * @param1 showing:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toggle(showing: boolean): DxPromise<void>;
}

/**
 * @docid
 * @inherits dxMenuBaseItem
 * @namespace DevExpress.ui
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

/** @public */
export type Properties = dxContextMenuOptions;

/** @deprecated use Properties instead */
export type Options = dxContextMenuOptions;

/** @deprecated use Properties instead */
export type IOptions = dxContextMenuOptions;
