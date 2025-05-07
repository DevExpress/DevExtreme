import { DataSourceLike } from '../data/data_source';
import {
    DxElement,
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

import {
    CollectionWidgetItem,
    SelectionChangeInfo,
} from './collection/ui.collection_widget.base';

import dxMenuBase, {
    dxMenuBaseOptions,
} from './context_menu/ui.menu_base';

import {
    Orientation,
    SubmenuShowMode,
} from '../common';

export {
    Orientation,
    SubmenuShowMode,
};

/** @public */
export type SubmenuDirection = 'auto' | 'leftOrTop' | 'rightOrBottom';

/**
 * @docid _ui_menu_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TKey = any> = EventInfo<dxMenu<TKey>>;

/**
 * @docid _ui_menu_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TKey = any> = EventInfo<dxMenu<TKey>>;

/**
 * @docid _ui_menu_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TKey = any> = InitializedEventInfo<dxMenu<TKey>>;

/**
 * @docid _ui_menu_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent<TKey = any> = NativeEventInfo<dxMenu<TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<Item>;

/**
 * @docid _ui_menu_ItemContextMenuEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemContextMenuEvent<TKey = any> = NativeEventInfo<dxMenu<TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<Item>;

/**
 * @docid _ui_menu_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ItemInfo
 */
export type ItemRenderedEvent<TKey = any> = EventInfo<dxMenu<TKey>> & ItemInfo<Item>;

/**
 * @docid _ui_menu_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TKey = any> = EventInfo<dxMenu<TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_menu_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangeInfo
 */
export type SelectionChangedEvent<TKey = any> = EventInfo<dxMenu<TKey>> & SelectionChangeInfo<Item>;

/**
 * @docid _ui_menu_SubmenuHiddenEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SubmenuHiddenEvent<TKey = any> = EventInfo<dxMenu<TKey>> & {
    /**
     * @docid _ui_menu_SubmenuHiddenEvent.itemData
     * @type dxMenuItem
     */
    readonly itemData?: Item;
    /** @docid _ui_menu_SubmenuHiddenEvent.rootItem */
    readonly rootItem?: DxElement;
    /** @docid _ui_menu_SubmenuHiddenEvent.submenuContainer */
    readonly submenuContainer?: DxElement;
};

/**
 * @docid _ui_menu_SubmenuHidingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type SubmenuHidingEvent<TKey = any> = Cancelable & EventInfo<dxMenu<TKey>> & {
    /**
     * @docid _ui_menu_SubmenuHidingEvent.itemData
     * @type dxMenuItem
     */
    readonly itemData?: Item;
    /** @docid _ui_menu_SubmenuHidingEvent.rootItem */
    readonly rootItem?: DxElement;
    /** @docid _ui_menu_SubmenuHidingEvent.submenuContainer */
    readonly submenuContainer?: DxElement;
};

/**
 * @docid _ui_menu_SubmenuShowingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SubmenuShowingEvent<TKey = any> = EventInfo<dxMenu<TKey>> & {
    /**
     * @docid _ui_menu_SubmenuShowingEvent.itemData
     * @type dxMenuItem
     */
    readonly itemData?: Item;
    /** @docid _ui_menu_SubmenuShowingEvent.rootItem */
    readonly rootItem?: DxElement;
    /** @docid _ui_menu_SubmenuShowingEvent.submenuContainer */
    readonly submenuContainer?: DxElement;
};

/**
 * @docid _ui_menu_SubmenuShownEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SubmenuShownEvent<TKey = any> = EventInfo<dxMenu<TKey>> & {
    /**
     * @docid _ui_menu_SubmenuShownEvent.itemData
     * @type dxMenuItem
     */
    readonly itemData?: Item;
    /** @docid _ui_menu_SubmenuShownEvent.rootItem */
    readonly rootItem?: DxElement;
    /** @docid _ui_menu_SubmenuShownEvent.submenuContainer */
    readonly submenuContainer?: DxElement;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxMenuOptions<
    TKey = any,
> extends dxMenuBaseOptions<dxMenu<TKey>, dxMenuItem, TKey> {
    /**
     * @docid
     * @default false
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid
     * @type string | Array<dxMenuItem> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<Item, TKey> | null;
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
     * @type_function_param1 e:{ui/menu:SubmenuHiddenEvent}
     * @action
     * @public
     */
    onSubmenuHidden?: ((e: SubmenuHiddenEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/menu:SubmenuHidingEvent}
     * @action
     * @public
     */
    onSubmenuHiding?: ((e: SubmenuHidingEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/menu:SubmenuShowingEvent}
     * @action
     * @public
     */
    onSubmenuShowing?: ((e: SubmenuShowingEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/menu:SubmenuShownEvent}
     * @action
     * @public
     */
    onSubmenuShown?: ((e: SubmenuShownEvent<TKey>) => void);
    /**
     * @docid
     * @default "horizontal"
     * @public
     */
    orientation?: Orientation;
    /**
     * @docid
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
       * @default "onClick"
       */
      name?: SubmenuShowMode;
    } | SubmenuShowMode;
    /**
     * @docid
     * @default "auto"
     * @public
     */
    submenuDirection?: SubmenuDirection;
}
/**
 * @docid
 * @inherits dxMenuBase
 * @namespace DevExpress.ui
 * @public
 */
export default class dxMenu<
    TKey = any,
> extends dxMenuBase<dxMenuOptions<TKey>, dxMenuItem, TKey> { }

export interface MenuBasePlainItem extends CollectionWidgetItem {
  /**
   * @docid dxMenuBaseItem.beginGroup
   * @public
   */
  beginGroup?: boolean;
  /**
   * @docid dxMenuBaseItem.closeMenuOnClick
   * @default true
   * @public
   */
  closeMenuOnClick?: boolean;
  /**
   * @docid dxMenuBaseItem.disabled
   * @default false
   * @public
   */
  disabled?: boolean;
  /**
   * @docid dxMenuBaseItem.icon
   * @public
   */
  icon?: string;
  /**
   * @docid dxMenuBaseItem.selectable
   * @default false
   * @public
   */
  selectable?: boolean;
  /**
   * @docid dxMenuBaseItem.selected
   * @default false
   * @public
   */
  selected?: boolean;
  /**
   * @docid dxMenuBaseItem.text
   * @public
   */
  text?: string;
  /**
   * @docid dxMenuBaseItem.visible
   * @default true
   * @public
   */
  visible?: boolean;

  [key: string]: any;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxMenuBaseItem extends MenuBasePlainItem {
    /**
     * @docid
     * @public
     */
    items?: Array<dxMenuBaseItem>;
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
    /**
     * @docid
     * @public
     */
    url?: string;
    /**
     * @docid
     * @public
     * @default {}
     */
    linkAttr?: { [key: string]: any };
}

/** @public */
export type ExplicitTypes<TKey = any> = {
    Properties: Properties<TKey>;
    ContentReadyEvent: ContentReadyEvent<TKey>;
    DisposingEvent: DisposingEvent<TKey>;
    InitializedEvent: InitializedEvent<TKey>;
    ItemClickEvent: ItemClickEvent<TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TKey>;
    OptionChangedEvent: OptionChangedEvent<TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TKey>;
    SubmenuHiddenEvent: SubmenuHiddenEvent<TKey>;
    SubmenuHidingEvent: SubmenuHidingEvent<TKey>;
    SubmenuShowingEvent: SubmenuShowingEvent<TKey>;
    SubmenuShownEvent: SubmenuShownEvent<TKey>;
};

/** @public */
export type Properties<TKey = any> = dxMenuOptions<TKey>;

/** @deprecated use Properties instead */
export type Options<TKey = any> = Properties<TKey>;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemHold' | 'onItemReordered' | 'onSelectionChanging'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onSubmenuHidden' | 'onSubmenuHiding' | 'onSubmenuShowing' | 'onSubmenuShown'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxMenuOptions.onContentReady
 * @type_function_param1 e:{ui/menu:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxMenuOptions.onDisposing
 * @type_function_param1 e:{ui/menu:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxMenuOptions.onInitialized
 * @type_function_param1 e:{ui/menu:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxMenuOptions.onItemClick
 * @type_function_param1 e:{ui/menu:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxMenuOptions.onItemContextMenu
 * @type_function_param1 e:{ui/menu:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxMenuOptions.onItemRendered
 * @type_function_param1 e:{ui/menu:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxMenuOptions.onOptionChanged
 * @type_function_param1 e:{ui/menu:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxMenuOptions.onSelectionChanged
 * @type_function_param1 e:{ui/menu:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
///#ENDDEBUG
