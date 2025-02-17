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
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ListItemInfo<TItem extends ItemLike> {
    /**
     * 
     */
    readonly itemData?: TItem;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly itemIndex: number | { group: number; item: number };
}

export type ItemDeleteMode = 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
export type ListMenuMode = 'context' | 'slide';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ScrollInfo {
    /**
     * 
     */
    readonly scrollOffset?: any;
    /**
     * 
     */
    readonly reachedLeft: boolean;
    /**
     * 
     */
    readonly reachedRight: boolean;
    /**
     * 
     */
    readonly reachedTop: boolean;
    /**
     * 
     */
    readonly reachedBottom: boolean;
}

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/**
 * The type of the groupRendered event handler&apos;s argument.
 */
export type GroupRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & {
    /**
     * 
     */
    readonly groupData?: any;
    /**
     * 
     */
    readonly groupElement?: DxElement;
    /**
     * 
     */
    readonly groupIndex?: number;
};

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxList<TItem, TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ListItemInfo<TItem>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ListItemInfo<TItem>;

/**
 * The type of the itemDeleted event handler&apos;s argument.
 */
export type ItemDeletedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ListItemInfo<TItem>;

/**
 * The type of the itemDeleting event handler&apos;s argument.
 */
export type ItemDeletingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ListItemInfo<TItem> & {
    /**
     * 
     */
    cancel?: boolean | PromiseLike<boolean> | PromiseLike<void>;
};

/**
 * The type of the itemHold event handler&apos;s argument.
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ListItemInfo<TItem>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TItem extends Item | any = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ItemInfo<TItem>;

/**
 * The type of the itemReordered event handler&apos;s argument.
 */
export type ItemReorderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ListItemInfo<TItem> & {
    /**
     * 
     */
    readonly fromIndex: number;
    /**
     * 
     */
    readonly toIndex: number;
};

/**
 * The type of the itemSwipe event handler&apos;s argument.
 */
export type ItemSwipeEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ListItemInfo<TItem> & {
    /**
     * 
     */
    readonly direction: string;
};

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ChangedOptionInfo;

/**
 * The type of the pageLoading event handler&apos;s argument.
 */
export type PageLoadingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/**
 * The type of the pullRefresh event handler&apos;s argument.
 */
export type PullRefreshEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/**
 * The type of the scroll event handler&apos;s argument.
 */
export type ScrollEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, Event> & ScrollInfo;

/**
 * The type of the selectAllValueChanged event handler&apos;s argument.
 */
export type SelectAllValueChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & {
    /**
     * 
     */
    readonly value: boolean;
};

/**
 * The type of the selectionChanging event handler&apos;s argument.
 */
export type SelectionChangingEvent<TItem extends ItemLike = any, TKey = any> = SelectionChangingEventBase<dxList<TItem, TKey>>;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & SelectionChangeInfo<TItem>;

/**
 * 
 * @deprecated 
 */
export interface dxListOptions<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidgetOptions<dxList<TItem, TKey>, TItem, TKey>, SearchBoxMixinOptions {
    /**
     * Specifies whether the UI component changes its visual state as a result of user interaction.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies whether or not an end user can delete list items.
     */
    allowItemDeleting?: boolean;
    /**
     * A Boolean value specifying whether to enable or disable the bounce-back effect.
     */
    bounceEnabled?: boolean;
    /**
     * Specifies whether or not an end user can collapse groups.
     */
    collapsibleGroups?: boolean;
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * Specifies the data field whose values should be displayed. Defaults to &apos;text&apos; when the data source contains objects.
     */
    displayExpr?: string | ((item: TItem) => string) | undefined;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies a custom template for group captions.
     */
    groupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies whether data items should be grouped.
     */
    grouped?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies whether or not to show the loading panel when the DataSource bound to the UI component is loading data.
     */
    indicateLoading?: boolean;
    /**
     * Specifies the way a user can delete items from the list.
     */
    itemDeleteMode?: ItemDeleteMode;
    /**
     * Configures item reordering using drag and drop gestures.
     */
    itemDragging?: dxSortableOptions;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<TItem>;
    /**
     * Specifies the array of items for a context menu called for a list item.
     */
    menuItems?: Array<{
      /**
       * Holds on a function called when the item is clicked.
       */
      action?: ((itemElement: DxElement, itemData: TItem) => any);
      /**
       * Specifies the menu item text.
       */
      text?: string;
    }>;
    /**
     * Specifies whether an item context menu is shown when a user holds or swipes an item.
     */
    menuMode?: ListMenuMode;
    /**
     * The text displayed on the button used to load the next page from the data source.
     */
    nextButtonText?: string;
    /**
     * A function that is executed when a group element is rendered.
     */
    onGroupRendered?: ((e: GroupRenderedEvent<TItem, TKey>) => void);
    /**
     * A function that is executed when a collection item is clicked or tapped.
     */
    onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void) | string;
    /**
     * A function that is executed when a collection item is right-clicked or pressed.
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
    /**
     * A function that is executed after a list item is deleted from the data source.
     */
    onItemDeleted?: ((e: ItemDeletedEvent<TItem, TKey>) => void);
    /**
     * A function that is executed before a collection item is deleted from the data source.
     */
    onItemDeleting?: ((e: ItemDeletingEvent<TItem, TKey>) => void);
    /**
     * A function that is executed when a collection item has been held for a specified period.
     */
    onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
    /**
     * A function that is executed after a list item is moved to another position.
     */
    onItemReordered?: ((e: ItemReorderedEvent<TItem, TKey>) => void);
    /**
     * A function that is executed when a list item is swiped.
     */
    onItemSwipe?: ((e: ItemSwipeEvent<TItem, TKey>) => void);
    /**
     * A function that is executed before the next page is loaded.
     */
    onPageLoading?: ((e: PageLoadingEvent<TItem, TKey>) => void);
    /**
     * A function that is executed when the &apos;pull to refresh&apos; gesture is performed. Supported on mobile devices only.
     */
    onPullRefresh?: ((e: PullRefreshEvent<TItem, TKey>) => void);
    /**
     * A function that is executed on each scroll gesture.
     */
    onScroll?: ((e: ScrollEvent<TItem, TKey>) => void);
    /**
     * A function that is executed when the &apos;Select All&apos; check box value is changed. Applies only if the selectionMode is &apos;all&apos;.
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent<TItem, TKey>) => void);
    /**
     * Specifies whether the next page is loaded when a user scrolls the UI component to the bottom or when the &apos;next&apos; button is clicked.
     */
    pageLoadMode?: PageLoadMode;
    /**
     * Specifies the text shown in the pullDown panel, which is displayed when the list is scrolled to the bottom.
     */
    pageLoadingText?: string;
    /**
     * A Boolean value specifying whether or not the UI component supports the &apos;pull down to refresh&apos; gesture.
     */
    pullRefreshEnabled?: boolean;
    /**
     * Specifies the text displayed in the pullDown panel when the list is pulled below the refresh threshold.
     */
    pulledDownText?: string;
    /**
     * Specifies the text shown in the pullDown panel while the list is being pulled down to the refresh threshold.
     */
    pullingDownText?: string;
    /**
     * Specifies the text displayed in the pullDown panel while the list is being refreshed.
     */
    refreshingText?: string;
    /**
     * Specifies whether to repaint only those elements whose data changed.
     */
    repaintChangesOnly?: boolean;
    /**
     * A Boolean value specifying if the list is scrolled by content.
     */
    scrollByContent?: boolean;
    /**
     * Specifies whether a user can scroll the content with the scrollbar. Applies only if useNativeScrolling is false.
     */
    scrollByThumb?: boolean;
    /**
     * A Boolean value specifying whether to enable or disable list scrolling.
     */
    scrollingEnabled?: boolean;
    /**
     * Specifies the mode in which all items are selected.
     */
    selectAllMode?: SelectAllMode;
    /**
     * Specifies whether an item is selected if a user clicks it.
     */
    selectByClick?: boolean;
    /**
     * Specifies item selection mode.
     */
    selectionMode?: SingleMultipleAllOrNone;
    /**
     * Specifies when the UI component shows the scrollbar.
     */
    showScrollbar?: ScrollbarMode;
    /**
     * Specifies whether or not to display controls used to select list items. Not available if selectionMode is set to &apos;none&apos;.
     */
    showSelectionControls?: boolean;
    /**
     * Specifies the text displayed at the &apos;Select All&apos; check box.
     */
    selectAllText?: string;
    /**
     * Specifies whether or not the UI component uses native scrolling.
     */
    useNativeScrolling?: boolean;
}
/**
 * The List is a UI component that represents a collection of items in a scrollable list.
 */
export default class dxList<
    TItem extends ItemLike = any,
    TKey = any,
> extends CollectionWidget<dxListOptions<TItem, TKey>, TItem, TKey> {
    /**
     * Gets the UI component&apos;s height in pixels.
     */
    clientHeight(): number;
    /**
     * Collapses a group with a specific index.
     */
    collapseGroup(groupIndex: number): DxPromise<void>;
    /**
     * Removes an item found using its DOM node.
     */
    deleteItem(itemElement: Element): DxPromise<void>;
    /**
     * Removes an item with a specific index.
     */
    deleteItem(itemIndex: number | any): DxPromise<void>;
    /**
     * Expands a group with a specific index.
     */
    expandGroup(groupIndex: number): DxPromise<void>;
    /**
     * Checks whether an item found using its DOM node is selected.
     */
    isItemSelected(itemElement: Element): boolean;
    /**
     * Checks whether an item with a specific index is selected.
     */
    isItemSelected(itemIndex: number | any): boolean;
    /**
     * Reloads list data.
     */
    reload(): void;
    /**
     * Reorders items found using their DOM nodes.
     */
    reorderItem(itemElement: Element, toItemElement: Element): DxPromise<void>;
    /**
     * Reorders items with specific indexes.
     */
    reorderItem(itemIndex: number | any, toItemIndex: number | any): DxPromise<void>;
    /**
     * Scrolls the content by a specified distance.
     */
    scrollBy(distance: number): void;
    /**
     * Gets the content&apos;s height in pixels.
     */
    scrollHeight(): number;
    /**
     * Scrolls the content to a specific position.
     */
    scrollTo(location: number): void;
    /**
     * Scrolls the content to an item found using its DOM node.
     */
    scrollToItem(itemElement: Element): void;
    /**
     * Scrolls the content to an item with a specific index.
     */
    scrollToItem(itemIndex: number | any): void;
    /**
     * Gets the top scroll offset.
     */
    scrollTop(): number;
    /**
     * Selects all items.
     */
    selectAll(): void;
    /**
     * Selects an item found using its DOM node.
     */
    selectItem(itemElement: Element): void;
    /**
     * Selects an item with a specific index.
     */
    selectItem(itemIndex: number | any): void;
    /**
     * Cancels the selection of all items.
     */
    unselectAll(): void;
    /**
     * Cancels the selection of an item found using its DOM node.
     */
    unselectItem(itemElement: Element): void;
    /**
     * Cancels the selection of an item with a specific index.
     */
    unselectItem(itemIndex: number | any): void;
    /**
     * Updates the UI component scrollbar according to UI component content size.
     */
    updateDimensions(): DxPromise<void>;
}

export type Item = dxListItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxListItem extends CollectionWidgetItem {
    /**
     * Specifies the text of a badge displayed for the list item.
     */
    badge?: string;
    /**
     * Specifies the list item&apos;s icon.
     */
    icon?: string;
    /**
     * Specifies the name of the list items group in a grouped list.
     */
    key?: string;
    /**
     * Specifies whether or not to display a chevron for the list item.
     */
    showChevron?: boolean;
}

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

export type Properties<
    TItem extends ItemLike = any,
    TKey = any,
> = dxListOptions<TItem, TKey>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
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
