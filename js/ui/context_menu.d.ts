import {
    PositionConfig,
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
export type ContentReadyEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>>;

/** @public */
export type HiddenEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>>;

/** @public */
export type HidingEvent<TItem extends Item<any> = Item<any>, TKey = any> = Cancelable & EventInfo<dxContextMenu<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends Item<any> = Item<any>, TKey = any> = InitializedEventInfo<dxContextMenu<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxContextMenu<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxContextMenu<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxContextMenu<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type OptionChangedEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type PositioningEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxContextMenu<TItem, TKey>> & {
    readonly position: PositionConfig;
};

/** @public */
export type SelectionChangedEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>> & SelectionChangedInfo<TItem>;

/** @public */
export type ShowingEvent<TItem extends Item<any> = Item<any>, TKey = any> = Cancelable & EventInfo<dxContextMenu<TItem, TKey>>;

/** @public */
export type ShownEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxContextMenuOptions<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> extends dxMenuBaseOptions<dxContextMenu<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @default true
     * @type_function_param1 event:event
     * @type_function_return Boolean
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent) => boolean);
    /**
     * @docid
     * @type string | Array<dxContextMenuItem> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<TItem> | Store<TItem, string | Array<string>, TKey> | DataSource<TItem, string | Array<string>, TKey> | DataSourceOptions<TItem, TItem, TItem, string | Array<string>, TKey>;
    /**
     * @docid
     * @type Array<dxContextMenuItem>
     * @public
     */
    items?: Array<TItem>;
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
    onHidden?: ((e: HiddenEvent<TItem, TKey>) => void);
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
    onHiding?: ((e: HidingEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 position:PositionConfig
     * @type_function_param1_field1 component:dxContextMenu
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onPositioning?: ((e: PositioningEvent<TItem, TKey>) => void);
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
    onShowing?: ((e: ShowingEvent<TItem, TKey>) => void);
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
    onShown?: ((e: ShownEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default { my: 'top left', at: 'top left' }
     * @ref
     * @public
     */
    position?: PositionConfig;
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
export default class dxContextMenu<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> extends dxMenuBase<dxContextMenuOptions<TItem, TKey>, TItem, TKey> {
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
export type Item<TItem extends Item<any> = Item<any>> = dxContextMenuItem<TItem>;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxContextMenuItem<TItem extends dxContextMenuItem<any>> extends dxMenuBaseItem<TItem> {
    /**
     * @docid
     * @public
     * @type Array<dxContextMenuItem>
     */
    items?: Array<TItem>;
}

/** @public */
export type ExplicitTypes<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = {
    Properties: Properties<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    HiddenEvent: HiddenEvent<TItem, TKey>;
    HidingEvent: HidingEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TItem, TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
    PositioningEvent: PositioningEvent<TItem, TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
    ShowingEvent: ShowingEvent<TItem, TKey>;
    ShownEvent: ShownEvent<TItem, TKey>;
};

/** @public */
export type Properties<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = dxContextMenuOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = Properties<TItem, TKey>;

/** @deprecated use Properties instead */
export type IOptions<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = Properties<TItem, TKey>;
