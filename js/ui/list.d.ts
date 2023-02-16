import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    DxPromise,
} from '../core/utils/deferred';

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
    dxSortableOptions,
} from './sortable';

import {
    SearchBoxMixinOptions,
} from './widget/ui.search_box_mixin';

import {
    SelectAllMode,
    ScrollbarMode,
    PageLoadMode,
    SingleMultipleAllOrNone,
} from '../common';

export {
    SelectAllMode,
    ScrollbarMode,
    PageLoadMode,
};

type ItemLike = string | Item | any;

interface ListItemInfo<TItem extends ItemLike> {
    readonly itemData?: TItem;
    readonly itemElement: DxElement;
    readonly itemIndex: number | { group: number; item: number };
}

/** @public */
export type ItemDeleteMode = 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
/** @public */
export type ListMenuMode = 'context' | 'slide';

export interface ScrollInfo {
    readonly scrollOffset?: any;
    readonly reachedLeft: boolean;
    readonly reachedRight: boolean;
    readonly reachedTop: boolean;
    readonly reachedBottom: boolean;
}

/** @public */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/** @public */
export type GroupRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & {
    readonly groupData?: any;
    readonly groupElement?: DxElement;
    readonly groupIndex?: number;
};

/** @public */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxList<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ListItemInfo<TItem>;

/** @public */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ListItemInfo<TItem>;

/** @public */
export type ItemDeletedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ListItemInfo<TItem>;

/** @public */
export type ItemDeletingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ListItemInfo<TItem> & {
    cancel?: boolean | PromiseLike<boolean> | PromiseLike<void>;
};

/** @public */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ListItemInfo<TItem>;

/** @public */
export type ItemRenderedEvent<TItem extends Item | any = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ItemInfo<TItem>;

/** @public */
export type ItemReorderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ListItemInfo<TItem> & {
    readonly fromIndex: number;
    readonly toIndex: number;
};

/** @public */
export type ItemSwipeEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, MouseEvent | PointerEvent | TouchEvent> & ListItemInfo<TItem> & {
    readonly direction: string;
};

/** @public */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type PageLoadingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/** @public */
export type PullRefreshEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>>;

/** @public */
export type ScrollEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxList<TItem, TKey>, Event> & ScrollInfo;

/** @public */
export type SelectAllValueChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & {
    readonly value: boolean;
};

/** @public */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxList<TItem, TKey>> & SelectionChangedInfo<TItem>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
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
    displayExpr?: string | ((item: TItem) => string);
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
     * @type_function_param1 e:object
     * @type_function_param1_field groupData:object
     * @type_function_param1_field component:dxList
     * @action
     * @public
     */
    onGroupRendered?: ((e: GroupRenderedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type function
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxList
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:object
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxList
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:object
     * @action
     * @public
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field itemData:object
     * @type_function_param1_field component:dxList
     * @action
     * @hidden false
     * @public
     */
    onItemDeleted?: ((e: ItemDeletedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field itemData:object
     * @type_function_param1_field cancel:boolean | Promise<boolean> | Promise<void>
     * @type_function_param1_field component:dxList
     * @action
     * @hidden false
     * @public
     */
    onItemDeleting?: ((e: ItemDeletingEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxList
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:object
     * @action
     * @public
     */
    onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field itemData:object
     * @type_function_param1_field component:dxList
     * @action
     * @hidden false
     * @public
     */
    onItemReordered?: ((e: ItemReorderedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:object
     * @type_function_param1_field component:dxList
     * @action
     * @public
     */
    onItemSwipe?: ((e: ItemSwipeEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxList
     * @action
     * @public
     */
    onPageLoading?: ((e: PageLoadingEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxList
     * @action
     * @public
     */
    onPullRefresh?: ((e: PullRefreshEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field scrollOffset:object
     * @type_function_param1_field component:dxList
     * @action
     * @public
     */
    onScroll?: ((e: ScrollEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxList
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
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid
     * @default "Pull down to refresh..."
     * @default "" &for(Material)
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid
     * @default "Refreshing..."
     * @default "" &for(Material)
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
