import { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
    SelectionChangeInfo,
    SelectionChangingEventBase,
} from './collection/ui.collection_widget.base';

import {
    Orientation,
    SingleOrMultiple,
    TabsIconPosition,
    TabsStyle,
} from '../common';

export type ItemLike = string | Item | any;

export {
    SingleOrMultiple,
    Orientation,
    TabsIconPosition,
    TabsStyle,
};

/**
 * @docid _ui_tabs_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>>;

/**
 * @docid _ui_tabs_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>>;

/**
 * @docid _ui_tabs_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxTabs<TItem, TKey>>;

/**
 * @docid _ui_tabs_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabs<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_tabs_ItemContextMenuEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabs<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_tabs_ItemHoldEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTabs<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_tabs_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ItemInfo
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>> & ItemInfo<TItem>;

/**
 * @docid _ui_tabs_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_tabs_SelectionChangingEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo,SelectionChangeInfo
 */
export type SelectionChangingEvent<TItem extends ItemLike = any, TKey = any> = SelectionChangingEventBase<dxTabs<TItem, TKey>>;

/**
 * @docid _ui_tabs_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangeInfo
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTabs<TItem, TKey>> & SelectionChangeInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxTabsOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends Properties<TItem, TKey> {}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid dxTabsOptions
 */
export interface dxTabsBaseOptions<
    TComponent extends dxTabs<TItem, TKey> = dxTabs<any, any>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<TComponent, TItem, TKey> {
    /**
     * @docid dxTabsOptions.dataSource
     * @type string | Array<string | dxTabsItem | any> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * @docid dxTabsOptions.focusStateEnabled
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxTabsOptions.hoverStateEnabled
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxTabsOptions.iconPosition
     * @default 'start'
     * @default 'top' &for(Material)
     * @default 'top' &for(Fluent)
     * @public
     */
    iconPosition?: TabsIconPosition;
    /**
     * @docid dxTabsOptions.items
     * @type Array<string | dxTabsItem | any>
     * @fires dxTabsOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid dxTabsOptions.orientation
     * @default 'horizontal'
     * @public
     */
    orientation?: Orientation;
    /**
     * @docid dxTabsOptions.repaintChangesOnly
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid dxTabsOptions.scrollByContent
     * @default true
     * @default false &for(desktop)
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid dxTabsOptions.scrollingEnabled
     * @default true
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid dxTabsOptions.selectionMode
     * @default 'single'
     * @public
     */
    selectionMode?: SingleOrMultiple;
    /**
     * @docid dxTabsOptions.showNavButtons
     * @default true
     * @default false &for(mobile_devices)
     * @public
     */
    showNavButtons?: boolean;
    /**
     * @docid dxTabsOptions.stylingMode
     * @default 'primary'
     * @default 'secondary' &for(Fluent)
     * @public
     */
    stylingMode?: TabsStyle;
}

/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 * @options dxTabsOptions
 */
export default class dxTabs<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<Properties<TItem, TKey>, TItem, TKey> { }

/**
 * @public
 * @namespace DevExpress.ui.dxTabs
 */
export type Item = dxTabsItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxTabsItem extends CollectionWidgetItem {
    /**
     * @docid
     * @public
     */
    badge?: string;
    /**
     * @docid
     * @public
     */
    icon?: string;
}

/** @public */
export type ExplicitTypes<
    TItem extends ItemLike,
    TKey,
> = {
    Properties: Properties<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TItem, TKey>;
    ItemHoldEvent: ItemHoldEvent<TItem, TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
    SelectionChangingEvent: SelectionChangingEvent<TItem, TKey>;
};

/** @public */
export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxTabsBaseOptions<dxTabs<TItem, TKey>, TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = any,
    TKey = any,
> = Properties<TItem, TKey>;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTabsOptions.onContentReady
 * @type_function_param1 e:{ui/tabs:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxTabsOptions.onDisposing
 * @type_function_param1 e:{ui/tabs:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTabsOptions.onInitialized
 * @type_function_param1 e:{ui/tabs:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTabsOptions.onItemClick
 * @type_function_param1 e:{ui/tabs:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxTabsOptions.onItemContextMenu
 * @type_function_param1 e:{ui/tabs:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @docid dxTabsOptions.onItemHold
 * @type_function_param1 e:{ui/tabs:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @docid dxTabsOptions.onItemRendered
 * @type_function_param1 e:{ui/tabs:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxTabsOptions.onOptionChanged
 * @type_function_param1 e:{ui/tabs:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxTabsOptions.onSelectionChanging
 * @type_function_param1 e:{ui/tabs:SelectionChangingEvent}
 */
onSelectionChanging?: ((e: SelectionChangingEvent) => void);
/**
 * @docid dxTabsOptions.onSelectionChanged
 * @type_function_param1 e:{ui/tabs:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
///#ENDDEBUG
