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
} from '../common/core/events';

import { DxEvent } from '../events';

import dxMenuBase, {
    dxMenuBaseOptions,
} from './context_menu/ui.menu_base';

import {
    dxMenuBaseItem,
} from './menu';

import {
    SelectionChangeInfo,
} from './collection/ui.collection_widget.base';

/** @public */
export type ContextSubmenuDirection = 'auto' | 'left' | 'right';

/**
 * @docid _ui_context_menu_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TKey = any> = EventInfo<dxContextMenu<TKey>>;

/**
 * @docid _ui_context_menu_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TKey = any> = EventInfo<dxContextMenu<TKey>>;

/**
 * @docid _ui_context_menu_HiddenEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type HiddenEvent<TKey = any> = EventInfo<dxContextMenu<TKey>>;

/**
 * @docid _ui_context_menu_HidingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type HidingEvent<TKey = any> = Cancelable & EventInfo<dxContextMenu<TKey>>;

/**
 * @docid _ui_context_menu_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TKey = any> = InitializedEventInfo<dxContextMenu<TKey>>;

/**
 * @docid _ui_context_menu_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent<TKey = any> = NativeEventInfo<dxContextMenu<TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<Item>;

/**
 * @docid _ui_context_menu_ItemContextMenuEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemContextMenuEvent<TKey = any> = NativeEventInfo<dxContextMenu<TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<Item>;

/**
 * @docid _ui_context_menu_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ItemInfo
 */
export type ItemRenderedEvent<TKey = any> = EventInfo<dxContextMenu<TKey>> & ItemInfo<Item>;

/**
 * @docid _ui_context_menu_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TKey = any> = EventInfo<dxContextMenu<TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_context_menu_PositioningEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PositioningEvent<TKey = any> = NativeEventInfo<dxContextMenu<TKey>, MouseEvent | PointerEvent | TouchEvent> & {
    /** @docid _ui_context_menu_PositioningEvent.position */
    readonly position: PositionConfig;
};

/**
 * @docid _ui_context_menu_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangeInfo
 */
export type SelectionChangedEvent<TKey = any> = EventInfo<dxContextMenu<TKey>> & SelectionChangeInfo<Item>;

/**
 * @docid _ui_context_menu_ShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ShowingEvent<TKey = any> = Cancelable & EventInfo<dxContextMenu<TKey>>;

/**
 * @docid _ui_context_menu_ShownEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
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
     * @type_function_param1 e:{ui/context_menu:HiddenEvent}
     * @action
     * @public
     */
    onHidden?: ((e: HiddenEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/context_menu:HidingEvent}
     * @action
     * @public
     */
    onHiding?: ((e: HidingEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/context_menu:PositioningEvent}
     * @action
     * @public
     */
    onPositioning?: ((e: PositioningEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/context_menu:ShowingEvent}
     * @action
     * @public
     */
    onShowing?: ((e: ShowingEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/context_menu:ShownEvent}
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
///#ENDDEBUG
