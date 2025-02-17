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

export type SubmenuDirection = 'auto' | 'leftOrTop' | 'rightOrBottom';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TKey = any> = EventInfo<dxMenu<TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TKey = any> = EventInfo<dxMenu<TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TKey = any> = InitializedEventInfo<dxMenu<TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TKey = any> = NativeEventInfo<dxMenu<TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<Item>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TKey = any> = NativeEventInfo<dxMenu<TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<Item>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TKey = any> = EventInfo<dxMenu<TKey>> & ItemInfo<Item>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TKey = any> = EventInfo<dxMenu<TKey>> & ChangedOptionInfo;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent<TKey = any> = EventInfo<dxMenu<TKey>> & SelectionChangeInfo<Item>;

/**
 * The type of the submenuHidden event handler&apos;s argument.
 */
export type SubmenuHiddenEvent<TKey = any> = EventInfo<dxMenu<TKey>> & {
    /**
     * 
     */
    readonly itemData?: Item;
    /**
     * 
     */
    readonly rootItem?: DxElement;
    /**
     * 
     */
    readonly submenuContainer?: DxElement;
};

/**
 * The type of the submenuHiding event handler&apos;s argument.
 */
export type SubmenuHidingEvent<TKey = any> = Cancelable & EventInfo<dxMenu<TKey>> & {
    /**
     * 
     */
    readonly itemData?: Item;
    /**
     * 
     */
    readonly rootItem?: DxElement;
    /**
     * 
     */
    readonly submenuContainer?: DxElement;
};

/**
 * The type of the submenuShowing event handler&apos;s argument.
 */
export type SubmenuShowingEvent<TKey = any> = EventInfo<dxMenu<TKey>> & {
    /**
     * 
     */
    readonly itemData?: Item;
    /**
     * 
     */
    readonly rootItem?: DxElement;
    /**
     * 
     */
    readonly submenuContainer?: DxElement;
};

/**
 * The type of the submenuShown event handler&apos;s argument.
 */
export type SubmenuShownEvent<TKey = any> = EventInfo<dxMenu<TKey>> & {
    /**
     * 
     */
    readonly itemData?: Item;
    /**
     * 
     */
    readonly rootItem?: DxElement;
    /**
     * 
     */
    readonly submenuContainer?: DxElement;
};

/**
 * 
 * @deprecated 
 */
export interface dxMenuOptions<
    TKey = any,
> extends dxMenuBaseOptions<dxMenu<TKey>, dxMenuItem, TKey> {
    /**
     * Specifies whether adaptive rendering is enabled. This property is in effect only if the orientation is &apos;horizontal&apos;.
     */
    adaptivityEnabled?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<Item, TKey> | null;
    /**
     * Specifies whether or not the submenu is hidden when the mouse pointer leaves it.
     */
    hideSubmenuOnMouseLeave?: boolean;
    /**
     * Holds an array of menu items.
     */
    items?: Array<Item>;
    /**
     * A function that is executed after a submenu is hidden.
     */
    onSubmenuHidden?: ((e: SubmenuHiddenEvent<TKey>) => void);
    /**
     * A function that is executed before a submenu is hidden.
     */
    onSubmenuHiding?: ((e: SubmenuHidingEvent<TKey>) => void);
    /**
     * A function that is executed before a submenu is displayed.
     */
    onSubmenuShowing?: ((e: SubmenuShowingEvent<TKey>) => void);
    /**
     * A function that is executed after a submenu is displayed.
     */
    onSubmenuShown?: ((e: SubmenuShownEvent<TKey>) => void);
    /**
     * Specifies whether the menu has horizontal or vertical orientation.
     */
    orientation?: Orientation;
    /**
     * Specifies properties for showing and hiding the first level submenu.
     */
    showFirstSubmenuMode?: {
      /**
       * Specifies the delay in submenu showing and hiding.
       */
      delay?: {
        /**
         * The time span after which the submenu is hidden.
         */
        hide?: number;
        /**
         * The time span after which the submenu is shown.
         */
        show?: number;
      } | number;
      /**
       * Specifies the mode name.
       */
      name?: SubmenuShowMode;
    } | SubmenuShowMode;
    /**
     * Specifies the direction at which the submenus are displayed.
     */
    submenuDirection?: SubmenuDirection;
}
/**
 * The Menu UI component is a panel with clickable items. A click on an item opens a drop-down menu, which can contain several submenus.
 */
export default class dxMenu<
    TKey = any,
> extends dxMenuBase<dxMenuOptions<TKey>, dxMenuItem, TKey> { }

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface MenuBasePlainItem extends CollectionWidgetItem {
  /**
   * Specifies whether a group separator is displayed over the item.
   */
  beginGroup?: boolean;
  /**
   * Specifies if a menu is closed when a user clicks the item. Does not apply to the root items.
   */
  closeMenuOnClick?: boolean;
  /**
   * Specifies whether the menu item responds to user interaction.
   */
  disabled?: boolean;
  /**
   * Specifies the menu item&apos;s icon.
   */
  icon?: string;
  /**
   * Specifies whether or not a user can select a menu item.
   */
  selectable?: boolean;
  /**
   * Specifies whether or not the item is selected.
   */
  selected?: boolean;
  /**
   * Specifies the text inserted into the item element.
   */
  text?: string;
  /**
   * Specifies whether or not the menu item is visible.
   */
  visible?: boolean;

  [key: string]: any;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxMenuBaseItem extends MenuBasePlainItem {
    /**
     * Specifies nested menu items.
     */
    items?: Array<dxMenuBaseItem>;
}

export type Item = dxMenuItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxMenuItem extends dxMenuBaseItem {
    /**
     * Specifies nested menu items.
     */
    items?: Array<Item>;
    /**
     * Specifies a web address to be opened when a user clicks on an item.
     */
    url?: string;
    /**
     * Specifies link attributes for the url option.
     */
    linkAttr?: { [key: string]: any };
}

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

export type Properties<TKey = any> = dxMenuOptions<TKey>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
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
