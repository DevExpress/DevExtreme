import { DataSourceLike } from '../data/data_source';
import {
    PositionConfig,
} from '../animation/position';

import {
    UserDefinedElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

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
export type ContextSubmenuDirection = 'auto' | 'left' | 'right';

/** @public */
export type ContentReadyEvent<TKey = any> = EventInfo<dxContextMenu<TKey>>;

/** @public */
export type DisposingEvent<TKey = any> = EventInfo<dxContextMenu<TKey>>;

/** @public */
export type HiddenEvent<TKey = any> = EventInfo<dxContextMenu<TKey>>;

/** @public */
export type HidingEvent<TKey = any> = Cancelable & EventInfo<dxContextMenu<TKey>>;

/** @public */
export type InitializedEvent<TKey = any> = InitializedEventInfo<dxContextMenu<TKey>>;

/** @public */
export type ItemClickEvent<TKey = any> = NativeEventInfo<dxContextMenu<TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<Item>;

/** @public */
export type ItemContextMenuEvent<TKey = any> = NativeEventInfo<dxContextMenu<TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<Item>;

/** @public */
export type ItemRenderedEvent<TKey = any> = EventInfo<dxContextMenu<TKey>> & ItemInfo<Item>;

/** @public */
export type OptionChangedEvent<TKey = any> = EventInfo<dxContextMenu<TKey>> & ChangedOptionInfo;

/** @public */
export type PositioningEvent<TKey = any> = NativeEventInfo<dxContextMenu<TKey>, MouseEvent | PointerEvent | TouchEvent> & {
    readonly position: PositionConfig;
};

/** @public */
export type SelectionChangedEvent<TKey = any> = EventInfo<dxContextMenu<TKey>> & SelectionChangedInfo<Item>;

/** @public */
export type ShowingEvent<TKey = any> = Cancelable & EventInfo<dxContextMenu<TKey>>;

/** @public */
export type ShownEvent<TKey = any> = EventInfo<dxContextMenu<TKey>>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxContextMenuOptions<
    TKey = any,
> extends dxMenuBaseOptions<dxContextMenu<TKey>, dxContextMenuItem, TKey> {
    /**
     * @docid
     * @deprecated dxContextMenuOptions.hideOnOutsideClick
     * @default true
     * @type_function_param1 event:event
     * @public
     */
    closeOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
    /**
     * @docid
     * @type string | Array<dxContextMenuItem> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<Item, TKey> | null;
    /**
     * @docid
     * @default true
     * @type boolean | function
     * @type_function_param1 event:event
     * @public
     */
    hideOnOutsideClick?: boolean | ((event: DxEvent<MouseEvent | PointerEvent | TouchEvent>) => boolean);
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
     * @type_function_param1_field component:dxContextMenu
     * @action
     * @public
     */
    onHidden?: ((e: HiddenEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxContextMenu
     * @action
     * @public
     */
    onHiding?: ((e: HidingEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:dxContextMenu
     * @action
     * @public
     */
    onPositioning?: ((e: PositioningEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxContextMenu
     * @action
     * @public
     */
    onShowing?: ((e: ShowingEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxContextMenu
     * @action
     * @public
     */
    onShown?: ((e: ShownEvent<TKey>) => void);
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
     * @default "auto"
     * @public
     */
    submenuDirection?: ContextSubmenuDirection;
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
    TKey = any,
> extends dxMenuBase<dxContextMenuOptions<TKey>, dxContextMenuItem, TKey> {
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
export type ExplicitTypes<TKey = any> = {
    Properties: Properties<TKey>;
    ContentReadyEvent: ContentReadyEvent<TKey>;
    DisposingEvent: DisposingEvent<TKey>;
    HiddenEvent: HiddenEvent<TKey>;
    HidingEvent: HidingEvent<TKey>;
    InitializedEvent: InitializedEvent<TKey>;
    ItemClickEvent: ItemClickEvent<TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TKey>;
    OptionChangedEvent: OptionChangedEvent<TKey>;
    PositioningEvent: PositioningEvent<TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TKey>;
    ShowingEvent: ShowingEvent<TKey>;
    ShownEvent: ShownEvent<TKey>;
};

/** @public */
export type Properties<TKey = any> = dxContextMenuOptions<TKey>;

/** @deprecated use Properties instead */
export type Options<TKey = any> = Properties<TKey>;

///#DEBUG
type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemHold' | 'onItemReordered'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxContextMenuOptions.onContentReady
 * @type_function_param1 e:{ui/context_menu:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onDisposing
 * @type_function_param1 e:{ui/context_menu:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onHidden
 * @type_function_param1 e:{ui/context_menu:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onHiding
 * @type_function_param1 e:{ui/context_menu:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onInitialized
 * @type_function_param1 e:{ui/context_menu:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onItemClick
 * @type_function_param1 e:{ui/context_menu:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onItemContextMenu
 * @type_function_param1 e:{ui/context_menu:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onItemRendered
 * @type_function_param1 e:{ui/context_menu:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onOptionChanged
 * @type_function_param1 e:{ui/context_menu:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onPositioning
 * @type_function_param1 e:{ui/context_menu:PositioningEvent}
 */
onPositioning?: ((e: PositioningEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onSelectionChanged
 * @type_function_param1 e:{ui/context_menu:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onShowing
 * @type_function_param1 e:{ui/context_menu:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @skip
 * @docid dxContextMenuOptions.onShown
 * @type_function_param1 e:{ui/context_menu:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
};
///#ENDDEBUG
