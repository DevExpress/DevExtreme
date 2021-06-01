import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    DxPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import CollectionWidget, {
    CollectionWidgetItem,
    CollectionWidgetOptions,
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import {
    dxSortableOptions
} from './sortable';

import {
    SearchBoxMixinOptions
} from './widget/ui.search_box_mixin';

interface ListItemInfo {
    readonly itemData?: any;
    readonly itemElement: DxElement;
    readonly itemIndex: number | { group: number; item: number; };
}

export interface ScrollInfo {
    readonly scrollOffset?: any;
    readonly reachedLeft: boolean;
    readonly reachedRight: boolean;
    readonly reachedTop: boolean;
    readonly reachedBottom: boolean;
}

/** @public */
export type ContentReadyEvent = EventInfo<dxList>;

/** @public */
export type DisposingEvent = EventInfo<dxList>;

/** @public */
export type GroupRenderedEvent = EventInfo<dxList> & {
    readonly groupData?: any;
    readonly groupElement?: DxElement;
    readonly groupIndex?: number;
}

/** @public */
export type InitializedEvent = InitializedEventInfo<dxList>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxList> & ListItemInfo;

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxList> & ListItemInfo;

/** @public */
export type ItemDeletedEvent = EventInfo<dxList> & ListItemInfo;

/** @public */
export type ItemDeletingEvent = EventInfo<dxList> & ListItemInfo & {
    cancel?: boolean | PromiseLike<void>;
}

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxList> & ListItemInfo;

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxList> & ItemInfo;

/** @public */
export type ItemReorderedEvent = EventInfo<dxList> & ListItemInfo & {
    readonly fromIndex: number;
    readonly toIndex: number;
}

/** @public */
export type ItemSwipeEvent = NativeEventInfo<dxList> & ListItemInfo & {
    readonly direction: string;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxList> & ChangedOptionInfo;

/** @public */
export type PageLoadingEvent = EventInfo<dxList>;

/** @public */
export type PullRefreshEvent = EventInfo<dxList>;

/** @public */
export type ScrollEvent = NativeEventInfo<dxList> & ScrollInfo;

/** @public */
export type SelectAllValueChangedEvent = EventInfo<dxList> & {
    readonly value: boolean;
}

/** @public */
export type SelectionChangedEvent = EventInfo<dxList> & SelectionChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxListOptions extends CollectionWidgetOptions<dxList>, SearchBoxMixinOptions<dxList> {
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
     * @default false [for](desktop)
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
     * @default null
     * @public
     */
    dataSource?: string | Array<string | dxListItem | any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 item:object
     * @type_function_return string
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default "group"
     * @type_function_param1 groupData:object
     * @type_function_param2 groupIndex:number
     * @type_function_param3 groupElement:DxElement
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
     * @type Enums.ListItemDeleteMode
     * @default 'static'
     * @default 'slideItem' [for](iOS)
     * @default 'swipe' [for](Android)
     * @public
     */
    itemDeleteMode?: 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
    /**
     * @docid
     * @public
     */
    itemDragging?: dxSortableOptions;
    /**
     * @docid
     * @fires dxListOptions.onOptionChanged
     * @public
     */
    items?: Array<string | dxListItem | any>;
    /**
     * @docid
     * @default []
     * @public
     */
    menuItems?: Array<{
      /**
       * @docid
       * @type_function_param1 itemElement:DxElement
       * @type_function_param2 itemData:object
       * @return void
       */
      action?: ((itemElement: DxElement, itemData: any) => any),
      /**
       * @docid
       */
      text?: string
    }>;
    /**
     * @docid
     * @type Enums.ListMenuMode
     * @default 'context'
     * @default 'slide' [for](iOS)
     * @public
     */
    menuMode?: 'context' | 'slide';
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
     * @type_function_param1_field4 groupData:object
     * @type_function_param1_field5 groupElement:DxElement
     * @type_function_param1_field6 groupIndex:number
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onGroupRendered?: ((e: GroupRenderedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void) | string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @hidden false
     * @public
     */
    onItemDeleted?: ((e: ItemDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 cancel:boolean | Promise<void>
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @hidden false
     * @public
     */
    onItemDeleting?: ((e: ItemDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemHold?: ((e: ItemHoldEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 fromIndex:number
     * @type_function_param1_field8 toIndex:number
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @hidden false
     * @public
     */
    onItemReordered?: ((e: ItemReorderedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 itemData:object
     * @type_function_param1_field6 itemElement:DxElement
     * @type_function_param1_field7 itemIndex:number | object
     * @type_function_param1_field8 direction:string
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemSwipe?: ((e: ItemSwipeEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onPageLoading?: ((e: PageLoadingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onPullRefresh?: ((e: PullRefreshEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 scrollOffset:object
     * @type_function_param1_field6 reachedLeft:boolean
     * @type_function_param1_field7 reachedRight:boolean
     * @type_function_param1_field8 reachedTop:boolean
     * @type_function_param1_field9 reachedBottom:boolean
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onScroll?: ((e: ScrollEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:boolean
     * @type_function_param1_field1 component:dxList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent) => void);
    /**
     * @docid
     * @type Enums.ListPageLoadMode
     * @default "scrollBottom"
     * @default "nextButton" [for](desktop except Mac)
     * @public
     */
    pageLoadMode?: 'nextButton' | 'scrollBottom';
    /**
     * @docid
     * @default "Loading..."
     * @default "" [for](Material)
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
     * @default "" [for](Material)
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid
     * @default "Pull down to refresh..."
     * @default "" [for](Material)
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid
     * @default "Refreshing..."
     * @default "" [for](Material)
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
     * @default false [for](non-touch_devices)
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default false
     * @default true [for](desktop)
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
     * @type Enums.SelectAllMode
     * @default 'page'
     * @public
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * @docid
     * @type Enums.ListSelectionMode
     * @default 'none'
     * @public
     */
    selectionMode?: 'all' | 'multiple' | 'none' | 'single';
    /**
     * @docid
     * @type Enums.ShowScrollbarMode
     * @default 'onScroll'
     * @default 'onHover' [for](desktop)
     * @public
     */
    showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
    /**
     * @docid
     * @default false
     * @public
     */
    showSelectionControls?: boolean;
    /**
     * @docid
     * @default false [for](desktop except Mac)
     * @default true
     * @public
     */
    useNativeScrolling?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget, SearchBoxMixin
 * @module ui/list
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxList extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxListOptions)
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
     * @param1 groupIndex:Number
     * @return Promise<void>
     * @public
     */
    collapseGroup(groupIndex: number): DxPromise<void>;
    /**
     * @docid
     * @publicName deleteItem(itemElement)
     * @param1 itemElement:Element
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
     * @param1 groupIndex:Number
     * @return Promise<void>
     * @public
     */
    expandGroup(groupIndex: number): DxPromise<void>;
    /**
     * @docid
     * @publicName isItemSelected(itemElement)
     * @param1 itemElement:Element
     * @return boolean
     * @public
     */
    isItemSelected(itemElement: Element): boolean;
    /**
     * @docid
     * @publicName isItemSelected(itemIndex)
     * @param1 itemIndex:Number|Object
     * @return boolean
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
     * @param1 itemElement:Element
     * @param2 toItemElement:Element
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
     * @param1 itemElement:Element
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
     * @param1 itemElement:Element
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
     * @param1 itemElement:Element
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
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
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
export type Properties = dxListOptions;

/** @deprecated use Properties instead */
export type Options = dxListOptions;

/** @deprecated use Properties instead */
export type IOptions = dxListOptions;
