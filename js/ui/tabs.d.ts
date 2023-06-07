import { DataSourceLike } from '../data/data_source';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
    SelectionChangedInfo,
} from './collection/ui.collection_widget.base';

import {
    SingleOrMultiple,
} from '../common';

export type ItemLike = string | Item | any;

export {
    SingleOrMultiple,
};

/**
 * @docid _ui_tabs_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>>;

/**
 * @docid _ui_tabs_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>>;

/**
 * @docid _ui_tabs_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<TabsInstance<TItem, TKey>>;

/**
 * @docid _ui_tabs_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<TabsInstance<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_tabs_ItemContextMenuEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<TabsInstance<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_tabs_ItemHoldEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<TabsInstance<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TItem>;

/**
 * @docid _ui_tabs_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ItemInfo
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>> & ItemInfo<TItem>;

/**
 * @docid _ui_tabs_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_tabs_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangedInfo
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<TabsInstance<TItem, TKey>> & SelectionChangedInfo<TItem>;

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
    TComponent extends dxTabs<any, TItem, TKey> = dxTabs<any, any, any>,
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
     * @docid dxTabsOptions.items
     * @type Array<string | dxTabsItem | any>
     * @fires dxTabsOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
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
}

/**
 * @docid
 * @inherits CollectionWidget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTabs<
    TProperties extends dxTabsOptions<TItem, TKey> = dxTabsOptions<any, any>,
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<TProperties, TItem, TKey> { }

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
};

interface TabsInstance<TItem, TKey> extends dxTabs<Properties<TItem, TKey>, TItem, TKey> { }

/** @public */
export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxTabsBaseOptions<TabsInstance<TItem, TKey>, TItem, TKey>;

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
 * @skip
 * @docid dxTabsOptions.onContentReady
 * @type_function_param1 e:{ui/tabs:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxTabsOptions.onDisposing
 * @type_function_param1 e:{ui/tabs:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxTabsOptions.onInitialized
 * @type_function_param1 e:{ui/tabs:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxTabsOptions.onItemClick
 * @type_function_param1 e:{ui/tabs:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxTabsOptions.onItemContextMenu
 * @type_function_param1 e:{ui/tabs:ItemContextMenuEvent}
 */
onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
/**
 * @skip
 * @docid dxTabsOptions.onItemHold
 * @type_function_param1 e:{ui/tabs:ItemHoldEvent}
 */
onItemHold?: ((e: ItemHoldEvent) => void);
/**
 * @skip
 * @docid dxTabsOptions.onItemRendered
 * @type_function_param1 e:{ui/tabs:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @skip
 * @docid dxTabsOptions.onOptionChanged
 * @type_function_param1 e:{ui/tabs:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxTabsOptions.onSelectionChanged
 * @type_function_param1 e:{ui/tabs:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
///#ENDDEBUG
