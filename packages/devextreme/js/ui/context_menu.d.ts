import { DataSourceLike } from '../data/data_source';
import {
    PositionConfig,
} from '../common/core/animation';

import {
    UserDefinedElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
    DxEvent,
    PointerInteractionEvent,
} from '../events';

import dxMenuBase, {
    dxMenuBaseOptions,
} from './context_menu/ui.menu_base';

import {
    dxMenuBaseItem,
} from './menu';

import {
    SelectionChangeInfo,
} from './collection/ui.collection_widget.base';

type ItemLike = Item | any;

/** @public */
export type ContextSubmenuDirection = 'auto' | 'left' | 'right';

/**
 * @docid _ui_context_menu_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>>;

/**
 * @docid _ui_context_menu_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>>;

/**
 * @docid _ui_context_menu_HiddenEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type HiddenEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>>;

/**
 * @docid _ui_context_menu_HidingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type HidingEvent<TItem extends ItemLike = any, TKey = any> = Cancelable & EventInfo<dxContextMenu<TItem, TKey>>;

/**
 * @docid _ui_context_menu_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxContextMenu<TItem, TKey>>;

/**
 * @docid _ui_context_menu_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxContextMenu<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_context_menu_ItemContextMenuEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxContextMenu<TItem, TKey>, PointerInteractionEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_context_menu_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ItemInfo
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>> & ItemInfo<TItem>;

/**
 * @docid _ui_context_menu_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_context_menu_PositioningEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PositioningEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxContextMenu<TItem, TKey>, PointerInteractionEvent> & {
    /** @docid _ui_context_menu_PositioningEvent.position */
    readonly position: PositionConfig;
};

/**
 * @docid _ui_context_menu_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangeInfo
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>> & SelectionChangeInfo<TItem>;

/**
 * @docid _ui_context_menu_ShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ShowingEvent<TItem extends ItemLike = any, TKey = any> = Cancelable & EventInfo<dxContextMenu<TItem, TKey>>;

/**
 * @docid _ui_context_menu_ShownEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ShownEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxContextMenu<TItem, TKey>>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxContextMenuOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends dxMenuBaseOptions<dxContextMenu<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @type string | Array<dxContextMenuItem> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * @docid
     * @default true
     * @type boolean | function
     * @type_function_param1 event:event
     * @public
     */
    hideOnOutsideClick?: boolean | ((event: DxEvent<PointerInteractionEvent>) => boolean);
    /**
     * @docid
     * @type Array<dxContextMenuItem | any>
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/context_menu:HiddenEvent}
     * @action
     * @public
     */
    onHidden?: ((e: HiddenEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/context_menu:HidingEvent}
     * @action
     * @public
     */
    onHiding?: ((e: HidingEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/context_menu:PositioningEvent}
     * @action
     * @public
     */
    onPositioning?: ((e: PositioningEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/context_menu:ShowingEvent}
     * @action
     * @public
     */
    onShowing?: ((e: ShowingEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/context_menu:ShownEvent}
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
      delay?: number | undefined;
      /**
       * @docid
       * @default undefined
       */
      name?: string | undefined;
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
    target?: string | UserDefinedElement | undefined;
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
    TItem extends ItemLike = any,
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
export type ExplicitTypes<TItem extends ItemLike = any, TKey = any> = {
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
export type Properties<TItem extends ItemLike = any, TKey = any> = dxContextMenuOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<TItem extends ItemLike = any, TKey = any> = Properties<TItem, TKey>;

/// #DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemHold' | 'onItemReordered' | 'onSelectionChanging'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onHidden' | 'onHiding' | 'onPositioning' | 'onShowing' | 'onShown'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxContextMenuOptions.onContentReady
 * @type_function_param1 e:{ui/context_menu:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxContextMenuOptions.onDisposing
 * @type_function_param1 e:{ui/context_menu:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxContextMenuOptions.onInitialized
 * @type_function_param1 e:{ui/context_menu:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxContextMenuOptions.onItemClick
 * @type_function_param1 e:{ui/context_menu:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxContextMenuOptions.onItemContextMenu
 * @type_function_param1 e:{ui/context_menu:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxContextMenuOptions.onItemRendered
 * @type_function_param1 e:{ui/context_menu:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxContextMenuOptions.onOptionChanged
 * @type_function_param1 e:{ui/context_menu:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxContextMenuOptions.onSelectionChanged
 * @type_function_param1 e:{ui/context_menu:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
/// #ENDDEBUG
