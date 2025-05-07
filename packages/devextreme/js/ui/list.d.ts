import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    SelectAllMode,
    ScrollbarMode,
    PageLoadMode,
    SingleMultipleAllOrNone,
} from '../common';

import {
    DxPromise,
} from '../core/utils/deferred';

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
    dxSortableOptions,
} from './sortable';

import {
    SearchBoxMixinOptions,
} from './widget/ui.search_box_mixin';

export {
    SelectAllMode,
    ScrollbarMode,
    PageLoadMode,
};

type ItemLike = string | Item | any;

/**
 * @docid
 * @hidden
 */
export interface ListItemInfo<TItem extends ItemLike> {
    /**
     * @docid
     * @type object
     */
    readonly itemData?: TItem;
    /** @docid */
    readonly itemElement: DxElement;
    /** @docid */
    readonly itemIndex: number | { group: number; item: number };
}

/** @public */
export type ItemDeleteMode = 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
/** @public */
export type ListMenuMode = 'context' | 'slide';

/**
 * @docid
 * @hidden
 */
export interface ScrollInfo {
    /**
     * @docid
     * @type object
     */
    readonly scrollOffset?: any;
    /** @docid */
    readonly reachedLeft: boolean;
    /** @docid */
    readonly reachedRight: boolean;
    /** @docid */
    readonly reachedTop: boolean;
    /** @docid */
    readonly reachedBottom: boolean;
}

/**
 * @docid _ui_list_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/**
 * @docid _ui_list_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/**
 * @docid _ui_list_GroupRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type GroupRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & {
    /**
     * @docid _ui_list_GroupRenderedEvent.groupData
     * @type object
     */
    readonly groupData?: any;
    /** @docid _ui_list_GroupRenderedEvent.groupElement */
    readonly groupElement?: DxElement;
    /** @docid _ui_list_GroupRenderedEvent.groupIndex */
    readonly groupIndex?: number;
};

/**
 * @docid _ui_list_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxList<TItem, TKey>>;

/**
 * @docid _ui_list_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ListItemInfo
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ListItemInfo<TItem>;

/**
 * @docid _ui_list_ItemContextMenuEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ListItemInfo
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ListItemInfo<TItem>;

/**
 * @docid _ui_list_ItemDeletedEvent
 * @public
 * @type object
 * @inherits EventInfo,ListItemInfo
 */
export type ItemDeletedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ListItemInfo<TItem>;

/**
 * @docid _ui_list_ItemDeletingEvent
 * @public
 * @type object
 * @inherits EventInfo,ListItemInfo
 */
export type ItemDeletingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ListItemInfo<TItem> & {
    /**
     * @docid _ui_list_ItemDeletingEvent.cancel
     * @type boolean
     */
    cancel?: boolean | PromiseLike<boolean> | PromiseLike<void>;
};

/**
 * @docid _ui_list_ItemHoldEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ListItemInfo
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ListItemInfo<TItem>;

/**
 * @docid _ui_list_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ItemInfo
 */
export type ItemRenderedEvent<TItem extends Item | any = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ItemInfo<TItem>;

/**
 * @docid _ui_list_ItemReorderedEvent
 * @public
 * @type object
 * @inherits EventInfo,ListItemInfo
 */
export type ItemReorderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ListItemInfo<TItem> & {
    /** @docid _ui_list_ItemReorderedEvent.fromIndex */
    readonly fromIndex: number;
    /** @docid _ui_list_ItemReorderedEvent.toIndex */
    readonly toIndex: number;
};

/**
 * @docid _ui_list_ItemSwipeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ListItemInfo
 */
export type ItemSwipeEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ListItemInfo<TItem> & {
    /** @docid _ui_list_ItemSwipeEvent.direction */
    readonly direction: string;
};

/**
 * @docid _ui_list_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_list_PageLoadingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type PageLoadingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/**
 * @docid _ui_list_PullRefreshEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type PullRefreshEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/**
 * @docid _ui_list_ScrollEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ScrollInfo
 */
export type ScrollEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, Event> & ScrollInfo;

/**
 * @docid _ui_list_SelectAllValueChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectAllValueChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & {
    /** @docid _ui_list_SelectAllValueChangedEvent.value */
    readonly value: boolean;
};

/**
 * @docid _ui_list_SelectionChangingEvent
 * @public
 * @type object
 * @inherits AsyncCancelable,EventInfo,SelectionChangeInfo
 */
export type SelectionChangingEvent<TItem extends ItemLike = any, TKey = any> = SelectionChangingEventBase<dxList<TItem, TKey>>;

/**
 * @docid _ui_list_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,SelectionChangeInfo
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & SelectionChangeInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxListOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<dxList<TItem, TKey>, TItem, TKey>, SearchBoxMixinOptions {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    allowItemDeleting?: boolean;
    /**
     * @docid
     * @default true
     * @default false &for(desktop)
     * @public
     */
    bounceEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    collapsibleGroups?: boolean;
    /**
     * @docid
     * @type string | Array<string | dxListItem | any> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 item:object
     * @public
     */
    displayExpr?: string | ((item: TItem) => string) | undefined;
    /**
     * @docid
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default "group"
     * @type_function_param1 groupData:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    groupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default false
     * @public
     */
    grouped?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    indicateLoading?: boolean;
    /**
     * @docid
     * @default 'static'
     * @default 'slideItem' &for(iOS)
     * @default 'swipe' &for(Android)
     * @public
     */
    itemDeleteMode?: ItemDeleteMode;
    /**
     * @docid
     * @public
     */
    itemDragging?: dxSortableOptions;
    /**
     * @docid
     * @type Array<string | dxListItem | any>
     * @fires dxListOptions.onOptionChanged
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default []
     * @public
     */
    menuItems?: Array<{
      /**
       * @docid
       * @type_function_param2 itemData:object
       * @type_function_return void
       */
      action?: ((itemElement: DxElement, itemData: TItem) => any);
      /**
       * @docid
       */
      text?: string;
    }>;
    /**
     * @docid
     * @default 'context'
     * @default 'slide' &for(iOS)
     * @public
     */
    menuMode?: ListMenuMode;
    /**
     * @docid
     * @default "More"
     * @public
     */
    nextButtonText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:GroupRenderedEvent}
     * @action
     * @public
     */
    onGroupRendered?: ((e: GroupRenderedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:{ui/list:ItemClickEvent}
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:ItemContextMenuEvent}
     * @action
     * @public
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:ItemDeletedEvent}
     * @action
     * @hidden false
     * @public
     */
    onItemDeleted?: ((e: ItemDeletedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:ItemDeletingEvent}
     * @action
     * @hidden false
     * @public
     */
    onItemDeleting?: ((e: ItemDeletingEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:ItemHoldEvent}
     * @action
     * @public
     */
    onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:ItemReorderedEvent}
     * @action
     * @hidden false
     * @public
     */
    onItemReordered?: ((e: ItemReorderedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:ItemSwipeEvent}
     * @action
     * @public
     */
    onItemSwipe?: ((e: ItemSwipeEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:PageLoadingEvent}
     * @action
     * @public
     */
    onPageLoading?: ((e: PageLoadingEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:PullRefreshEvent}
     * @action
     * @public
     */
    onPullRefresh?: ((e: PullRefreshEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:ScrollEvent}
     * @action
     * @public
     */
    onScroll?: ((e: ScrollEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/list:SelectAllValueChangedEvent}
     * @action
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default "scrollBottom"
     * @default "nextButton" &for(desktop except Mac)
     * @public
     */
    pageLoadMode?: PageLoadMode;
    /**
     * @docid
     * @default "Loading..."
     * @default "" &for(Material)
     * @default "" &for(Fluent)
     * @public
     */
    pageLoadingText?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    pullRefreshEnabled?: boolean;
    /**
     * @docid
     * @default "Release to refresh..."
     * @default "" &for(Material)
     * @default "" &for(Fluent)
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid
     * @default "Pull down to refresh..."
     * @default "" &for(Material)
     * @default "" &for(Fluent)
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid
     * @default "Refreshing..."
     * @default "" &for(Material)
     * @default "" &for(Fluent)
     * @public
     */
    refreshingText?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default true
     * @default false &for(non-touch_devices)
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default false
     * @default true &for(desktop)
     * @public
     */
    scrollByThumb?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid
     * @default 'page'
     * @public
     */
    selectAllMode?: SelectAllMode;
    /**
     * @docid
     * @default 'true'
     * @public
     */
    selectByClick?: boolean;
    /**
     * @docid
     * @default 'none'
     * @public
     */
    selectionMode?: SingleMultipleAllOrNone;
    /**
     * @docid
     * @default 'onScroll'
     * @default 'onHover' &for(desktop)
     * @public
     */
    showScrollbar?: ScrollbarMode;
    /**
     * @docid
     * @default false
     * @public
     */
    showSelectionControls?: boolean;
    /**
     * @docid
     * @default "Select All"
     * @public
     */
    selectAllText?: string;
    /**
     * @docid
     * @default false &for(desktop except Mac)
     * @default true
     * @public
     */
    useNativeScrolling?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget, SearchBoxMixin
 * @namespace DevExpress.ui
 * @public
 */
export default class dxList<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<dxListOptions<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @publicName clientHeight()
     * @return numeric
     * @public
     */
    clientHeight(): number;
    /**
     * @docid
     * @publicName collapseGroup(groupIndex)
     * @return Promise<void>
     * @public
     */
    collapseGroup(groupIndex: number): DxPromise<void>;
    /**
     * @docid
     * @publicName deleteItem(itemElement)
     * @return Promise<void>
     * @public
     */
    deleteItem(itemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName deleteItem(itemIndex)
     * @param1 itemIndex:Number|Object
     * @return Promise<void>
     * @public
     */
    deleteItem(itemIndex: number | any): DxPromise<void>;
    /**
     * @docid
     * @publicName expandGroup(groupIndex)
     * @return Promise<void>
     * @public
     */
    expandGroup(groupIndex: number): DxPromise<void>;
    /**
     * @docid
     * @publicName isItemSelected(itemElement)
     * @public
     */
    isItemSelected(itemElement: Element): boolean;
    /**
     * @docid
     * @publicName isItemSelected(itemIndex)
     * @param1 itemIndex:Number|Object
     * @public
     */
    isItemSelected(itemIndex: number | any): boolean;
    /**
     * @docid
     * @publicName reload()
     * @public
     */
    reload(): void;
    /**
     * @docid
     * @publicName reorderItem(itemElement, toItemElement)
     * @return Promise<void>
     * @public
     */
    reorderItem(itemElement: Element, toItemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName reorderItem(itemIndex, toItemIndex)
     * @param1 itemIndex:Number|Object
     * @param2 toItemIndex:Number|Object
     * @return Promise<void>
     * @public
     */
    reorderItem(itemIndex: number | any, toItemIndex: number | any): DxPromise<void>;
    /**
     * @docid
     * @publicName scrollBy(distance)
     * @param1 distance:numeric
     * @public
     */
    scrollBy(distance: number): void;
    /**
     * @docid
     * @publicName scrollHeight()
     * @return numeric
     * @public
     */
    scrollHeight(): number;
    /**
     * @docid
     * @publicName scrollTo(location)
     * @param1 location:numeric
     * @public
     */
    scrollTo(location: number): void;
    /**
     * @docid
     * @publicName scrollToItem(itemElement)
     * @public
     */
    scrollToItem(itemElement: Element): void;
    /**
     * @docid
     * @publicName scrollToItem(itemIndex)
     * @param1 itemIndex:Number|Object
     * @public
     */
    scrollToItem(itemIndex: number | any): void;
    /**
     * @docid
     * @publicName scrollTop()
     * @return numeric
     * @public
     */
    scrollTop(): number;
    /**
     * @docid
     * @publicName selectAll()
     * @public
     */
    selectAll(): void;
    /**
     * @docid
     * @publicName selectItem(itemElement)
     * @public
     */
    selectItem(itemElement: Element): void;
    /**
     * @docid
     * @publicName selectItem(itemIndex)
     * @param1 itemIndex:Number|Object
     * @public
     */
    selectItem(itemIndex: number | any): void;
    /**
     * @docid
     * @publicName unselectAll()
     * @public
     */
    unselectAll(): void;
    /**
     * @docid
     * @publicName unselectItem(itemElement)
     * @public
     */
    unselectItem(itemElement: Element): void;
    /**
     * @docid
     * @publicName unselectItem(itemIndex)
     * @param1 itemIndex:Number|Object
     * @public
     */
    unselectItem(itemIndex: number | any): void;
    /**
     * @docid
     * @publicName updateDimensions()
     * @return Promise<void>
     * @public
     */
    updateDimensions(): DxPromise<void>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxList
 */
export type Item = dxListItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxListItem extends CollectionWidgetItem {
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
    /**
     * @docid
     * @public
     */
    key?: string;
    /**
     * @docid
     * @public
     */
    showChevron?: boolean;
}

/** @public */
export type ExplicitTypes<
    TItem extends ItemLike,
    TKey,
> = {
    Properties: Properties<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    GroupRenderedEvent: GroupRenderedEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TItem, TKey>;
    ItemDeletedEvent: ItemDeletedEvent<TItem, TKey>;
    ItemDeletingEvent: ItemDeletingEvent<TItem, TKey>;
    ItemHoldEvent: ItemHoldEvent<TItem, TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    ItemReorderedEvent: ItemReorderedEvent<TItem, TKey>;
    ItemSwipeEvent: ItemSwipeEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
    PageLoadingEvent: PageLoadingEvent<TItem, TKey>;
    PullRefreshEvent: PullRefreshEvent<TItem, TKey>;
    ScrollEvent: ScrollEvent<TItem, TKey>;
    SelectAllValueChangedEvent: SelectAllValueChangedEvent<TItem, TKey>;
    SelectionChangingEvent: SelectionChangingEvent<TItem, TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
};

/** @public */
export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxListOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends ItemLike = any,
    TKey = any,
> = Properties<TItem, TKey>;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onGroupRendered' | 'onItemClick' | 'onItemContextMenu' | 'onItemDeleted' | 'onItemDeleting' | 'onItemHold' | 'onItemReordered' | 'onItemSwipe' | 'onPageLoading' | 'onPullRefresh' | 'onScroll' | 'onSelectAllValueChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxListOptions.onContentReady
 * @type_function_param1 e:{ui/list:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxListOptions.onDisposing
 * @type_function_param1 e:{ui/list:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxListOptions.onInitialized
 * @type_function_param1 e:{ui/list:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxListOptions.onItemRendered
 * @type_function_param1 e:{ui/list:ItemRenderedEvent}
 */
onItemRendered?: ((e: ItemRenderedEvent) => void);
/**
 * @docid dxListOptions.onOptionChanged
 * @type_function_param1 e:{ui/list:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxListOptions.onSelectionChanging
 * @type_function_param1 e:{ui/list:SelectionChangingEvent}
 */
onSelectionChanging?: ((e: SelectionChangingEvent) => void);
/**
 * @docid dxListOptions.onSelectionChanged
 * @type_function_param1 e:{ui/list:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
};
///#ENDDEBUG
