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

/** @deprecated use Properties instead */
export interface dxListOptions extends CollectionWidgetOptions<dxList>, SearchBoxMixinOptions<dxList> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowItemDeleting?: boolean;
    /**
     * @docid
     * @default true
     * @default false [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    bounceEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapsibleGroups?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string | dxListItem | any> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default undefined
     * @type_function_param1 item:object
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupTemplate?: template | ((groupData: any, groupIndex: number, groupElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    grouped?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    indicateLoading?: boolean;
    /**
     * @docid
     * @type Enums.ListItemDeleteMode
     * @default 'static'
     * @default 'slideItem' [for](iOS)
     * @default 'swipe' [for](Android)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemDeleteMode?: 'context' | 'slideButton' | 'slideItem' | 'static' | 'swipe' | 'toggle';
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemDragging?: dxSortableOptions;
    /**
     * @docid
     * @fires dxListOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<string | dxListItem | any>;
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuItems?: Array<{
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @type_function_param1 itemElement:DxElement
       * @type_function_param2 itemData:object
       * @return void
       */
      action?: ((itemElement: DxElement, itemData: any) => any),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      text?: string
    }>;
    /**
     * @docid
     * @type Enums.ListMenuMode
     * @default 'context'
     * @default 'slide' [for](iOS)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    menuMode?: 'context' | 'slide';
    /**
     * @docid
     * @default "More"
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent) => void);
    /**
     * @docid
     * @type Enums.ListPageLoadMode
     * @default "scrollBottom"
     * @default "nextButton" [for](desktop except Mac)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageLoadMode?: 'nextButton' | 'scrollBottom';
    /**
     * @docid
     * @default "Loading..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pageLoadingText?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pullRefreshEnabled?: boolean;
    /**
     * @docid
     * @default "Release to refresh..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pulledDownText?: string;
    /**
     * @docid
     * @default "Pull down to refresh..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pullingDownText?: string;
    /**
     * @docid
     * @default "Refreshing..."
     * @default "" [for](Material)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refreshingText?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default true
     * @default false [for](non-touch_devices)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid
     * @default false
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollByThumb?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollingEnabled?: boolean;
    /**
     * @docid
     * @type Enums.SelectAllMode
     * @default 'page'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * @docid
     * @type Enums.ListSelectionMode
     * @default 'none'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'all' | 'multiple' | 'none' | 'single';
    /**
     * @docid
     * @type Enums.ShowScrollbarMode
     * @default 'onScroll'
     * @default 'onHover' [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showScrollbar?: 'always' | 'never' | 'onHover' | 'onScroll';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showSelectionControls?: boolean;
    /**
     * @docid
     * @default false [for](desktop except Mac)
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useNativeScrolling?: boolean;
}
/**
 * @docid
 * @inherits CollectionWidget, SearchBoxMixin
 * @module ui/list
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxList extends CollectionWidget {
    constructor(element: UserDefinedElement, options?: dxListOptions)
    /**
     * @docid
     * @publicName clientHeight()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clientHeight(): number;
    /**
     * @docid
     * @publicName collapseGroup(groupIndex)
     * @param1 groupIndex:Number
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseGroup(groupIndex: number): DxPromise<void>;
    /**
     * @docid
     * @publicName deleteItem(itemElement)
     * @param1 itemElement:Element
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteItem(itemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName deleteItem(itemIndex)
     * @param1 itemIndex:Number|Object
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteItem(itemIndex: number | any): DxPromise<void>;
    /**
     * @docid
     * @publicName expandGroup(groupIndex)
     * @param1 groupIndex:Number
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandGroup(groupIndex: number): DxPromise<void>;
    /**
     * @docid
     * @publicName isItemSelected(itemElement)
     * @param1 itemElement:Element
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isItemSelected(itemElement: Element): boolean;
    /**
     * @docid
     * @publicName isItemSelected(itemIndex)
     * @param1 itemIndex:Number|Object
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isItemSelected(itemIndex: number | any): boolean;
    /**
     * @docid
     * @publicName reload()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reload(): void;
    /**
     * @docid
     * @publicName reorderItem(itemElement, toItemElement)
     * @param1 itemElement:Element
     * @param2 toItemElement:Element
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reorderItem(itemElement: Element, toItemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName reorderItem(itemIndex, toItemIndex)
     * @param1 itemIndex:Number|Object
     * @param2 toItemIndex:Number|Object
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reorderItem(itemIndex: number | any, toItemIndex: number | any): DxPromise<void>;
    /**
     * @docid
     * @publicName scrollBy(distance)
     * @param1 distance:numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollBy(distance: number): void;
    /**
     * @docid
     * @publicName scrollHeight()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollHeight(): number;
    /**
     * @docid
     * @publicName scrollTo(location)
     * @param1 location:numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTo(location: number): void;
    /**
     * @docid
     * @publicName scrollToItem(itemElement)
     * @param1 itemElement:Element
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToItem(itemElement: Element): void;
    /**
     * @docid
     * @publicName scrollToItem(itemIndex)
     * @param1 itemIndex:Number|Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToItem(itemIndex: number | any): void;
    /**
     * @docid
     * @publicName scrollTop()
     * @return numeric
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollTop(): number;
    /**
     * @docid
     * @publicName selectAll()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectAll(): void;
    /**
     * @docid
     * @publicName selectItem(itemElement)
     * @param1 itemElement:Element
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectItem(itemElement: Element): void;
    /**
     * @docid
     * @publicName selectItem(itemIndex)
     * @param1 itemIndex:Number|Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectItem(itemIndex: number | any): void;
    /**
     * @docid
     * @publicName unselectAll()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectAll(): void;
    /**
     * @docid
     * @publicName unselectItem(itemElement)
     * @param1 itemElement:Element
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectItem(itemElement: Element): void;
    /**
     * @docid
     * @publicName unselectItem(itemIndex)
     * @param1 itemIndex:Number|Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectItem(itemIndex: number | any): void;
    /**
     * @docid
     * @publicName updateDimensions()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): DxPromise<void>;
}

/**
 * @docid
 * @inherits CollectionWidgetItem
 * @type object
 */
export interface dxListItem extends CollectionWidgetItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    badge?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    key?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
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
