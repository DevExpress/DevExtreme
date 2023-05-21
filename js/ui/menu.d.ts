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
} from '../events/index';

import {
    CollectionWidgetItem,
    SelectionChangedInfo,
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

/** @public */
export type ContentReadyEvent<TKey = any> = EventInfo<dxMenu<TKey>>;

/** @public */
export type DisposingEvent<TKey = any> = EventInfo<dxMenu<TKey>>;

/** @public */
export type InitializedEvent<TKey = any> = InitializedEventInfo<dxMenu<TKey>>;

/** @public */
export type ItemClickEvent<TKey = any> = NativeEventInfo<dxMenu<TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<Item>;

/** @public */
export type ItemContextMenuEvent<TKey = any> = NativeEventInfo<dxMenu<TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<Item>;

/** @public */
export type ItemRenderedEvent<TKey = any> = EventInfo<dxMenu<TKey>> & ItemInfo<Item>;

/** @public */
export type OptionChangedEvent<TKey = any> = EventInfo<dxMenu<TKey>> & ChangedOptionInfo;

/** @public */
export type SelectionChangedEvent<TKey = any> = EventInfo<dxMenu<TKey>> & SelectionChangedInfo<Item>;

/** @public */
export type SubmenuHiddenEvent<TKey = any> = EventInfo<dxMenu<TKey>> & {
    readonly rootItem?: DxElement;
};

/** @public */
export type SubmenuHidingEvent<TKey = any> = Cancelable & EventInfo<dxMenu<TKey>> & {
    readonly rootItem?: DxElement;
};

/** @public */
export type SubmenuShowingEvent<TKey = any> = EventInfo<dxMenu<TKey>> & {
    readonly rootItem?: DxElement;
};

/** @public */
export type SubmenuShownEvent<TKey = any> = EventInfo<dxMenu<TKey>> & {
    readonly rootItem?: DxElement;
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
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxMenu
     * @action
     * @public
     */
    onSubmenuHidden?: ((e: SubmenuHiddenEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxMenu
     * @action
     * @public
     */
    onSubmenuHiding?: ((e: SubmenuHidingEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxMenu
     * @action
     * @public
     */
    onSubmenuShowing?: ((e: SubmenuShowingEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxMenu
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

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemHold' | 'onItemReordered' | 'onSelectionChange'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxMenuOptions.onContentReady
 * @type_function_param1 e:{ui/menu:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onDisposing
 * @type_function_param1 e:{ui/menu:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onInitialized
 * @type_function_param1 e:{ui/menu:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onItemClick
 * @type_function_param1 e:{ui/menu:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onItemContextMenu
 * @type_function_param1 e:{ui/menu:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onItemRendered
 * @type_function_param1 e:{ui/menu:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onOptionChanged
 * @type_function_param1 e:{ui/menu:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onSelectionChanged
 * @type_function_param1 e:{ui/menu:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onSubmenuHidden
 * @type_function_param1 e:{ui/menu:SubmenuHiddenEvent}
 */
onSubmenuHidden?: ((e: SubmenuHiddenEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onSubmenuHiding
 * @type_function_param1 e:{ui/menu:SubmenuHidingEvent}
 */
onSubmenuHiding?: ((e: SubmenuHidingEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onSubmenuShowing
 * @type_function_param1 e:{ui/menu:SubmenuShowingEvent}
 */
onSubmenuShowing?: ((e: SubmenuShowingEvent) => void);
/**
 * @skip
 * @docid dxMenuOptions.onSubmenuShown
 * @type_function_param1 e:{ui/menu:SubmenuShownEvent}
 */
onSubmenuShown?: ((e: SubmenuShownEvent) => void);
};
