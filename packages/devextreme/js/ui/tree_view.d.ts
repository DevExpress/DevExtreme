import { DataSourceLike } from '../data/data_source';
import {
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    PointerInteractionEvent,
} from '../events';

import {
    CollectionWidgetItem,
} from './collection/ui.collection_widget.base';

import HierarchicalCollectionWidget, {
    HierarchicalCollectionWidgetOptions,
} from './hierarchical_collection/ui.hierarchical_collection_widget';

import {
    SearchBoxMixinOptions,
} from './widget/ui.search_box_mixin';

import {
    DataStructure,
    SingleOrMultiple,
    ScrollDirection,
} from '../common';

import dxScrollable from './scroll_view/ui.scrollable';

type ItemLike = Item | any;

/**
 * @docid _ui_tree_view_ItemInfo
 * @hidden
 */
export interface ItemInfo<TItem extends ItemLike = any, TKey= any> {
    /**
     * @docid _ui_tree_view_ItemInfo.itemData
     * @type object
     */
    readonly itemData?: TItem;
    /** @docid _ui_tree_view_ItemInfo.itemElement */
    readonly itemElement?: DxElement;
    /** @docid _ui_tree_view_ItemInfo.itemIndex */
    readonly itemIndex?: number;
    /**
     * @docid _ui_tree_view_ItemInfo.node
     * @type dxTreeViewNode
     */
    readonly node?: Node<TItem, TKey>;
}

export {
    DataStructure,
    SingleOrMultiple,
    ScrollDirection,
};

/** @public */
export type TreeViewCheckBoxMode = 'none' | 'normal' | 'selectAll';
/** @public */
export type TreeViewExpandEvent = 'dblclick' | 'click';
/** @public */
export type DisabledNodeSelectionMode = 'recursiveAndAll' | 'never';

/**
 * @docid _ui_tree_view_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTreeView<TItem, TKey>>;

/**
 * @docid _ui_tree_view_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTreeView<TItem, TKey>>;

/**
 * @docid _ui_tree_view_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TItem extends ItemLike = any, TKey = any> = InitializedEventInfo<dxTreeView<TItem, TKey>>;

/**
 * @docid _ui_tree_view_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,_ui_tree_view_ItemInfo
 */
export type ItemClickEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TItem, TKey>;

/**
 * @docid _ui_tree_view_ItemCollapsedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,_ui_tree_view_ItemInfo
 */
export type ItemCollapsedEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem, TKey>;

/**
 * @docid _ui_tree_view_ItemContextMenuEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,_ui_tree_view_ItemInfo
 */
export type ItemContextMenuEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>, PointerInteractionEvent> & ItemInfo<TItem, TKey>;

/**
 * @docid _ui_tree_view_ItemExpandedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,_ui_tree_view_ItemInfo
 */
export type ItemExpandedEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>, MouseEvent | PointerEvent> & ItemInfo<TItem, TKey>;

/**
 * @docid _ui_tree_view_ItemHoldEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,_ui_tree_view_ItemInfo
 */
export type ItemHoldEvent<TItem extends ItemLike = any, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>, PointerInteractionEvent> & ItemInfo<TItem, TKey>;

/**
 * @docid _ui_tree_view_ItemRenderedEvent
 * @public
 * @type object
 * @inherits EventInfo,_ui_tree_view_ItemInfo
 */
export type ItemRenderedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTreeView<TItem, TKey>> & ItemInfo<TItem, TKey>;

/**
 * @docid _ui_tree_view_ItemSelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,_ui_tree_view_ItemInfo
 */
export type ItemSelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTreeView<TItem, TKey>> & ItemInfo<TItem, TKey>;

/**
 * @docid _ui_tree_view_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTreeView<TItem, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_tree_view_SelectAllValueChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectAllValueChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTreeView<TItem, TKey>> & {
    /** @docid _ui_tree_view_SelectAllValueChangedEvent.value */
    readonly value?: boolean | undefined;
};

/**
 * @docid _ui_tree_view_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectionChangedEvent<TItem extends ItemLike = any, TKey = any> = EventInfo<dxTreeView<TItem, TKey>>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxTreeViewOptions<TItem extends ItemLike = any, TKey = any>
    extends Omit<HierarchicalCollectionWidgetOptions<dxTreeView<TItem, TKey>, TItem, TKey>, 'dataSource'>, SearchBoxMixinOptions {
    /**
     * @docid
     * @default true
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @type_function_param1 parentNode:dxTreeViewNode
     * @type_function_return Promise<any>|Array<Object>
     * @public
     */
    createChildren?: ((parentNode: Node<TItem, TKey>) => PromiseLike<any> | Array<any>);
    /**
     * @docid
     * @type string | Array<dxTreeViewItem> | Store | DataSource | DataSourceOptions | null
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey> | null;
    /**
     * @docid
     * @default 'tree'
     * @public
     */
    dataStructure?: DataStructure;
    /**
     * @docid
     * @default 'recursiveAndAll'
     * @public
     */
    disabledNodeSelectionMode?: DisabledNodeSelectionMode;
    /**
     * @docid
     * @default false
     * @public
     */
    expandAllEnabled?: boolean;
    /**
     * @docid
     * @default "dblclick"
     * @public
     */
    expandEvent?: TreeViewExpandEvent;
    /**
     * @docid
     * @default true
     * @public
     */
    expandNodesRecursive?: boolean;
    /**
     * @docid
     * @default 'expanded'
     * @hidden false
     * @public
     */
    expandedExpr?: string | Function;
    /**
     * @docid
     * @default 'hasItems'
     * @public
     */
    hasItemsExpr?: string | Function;
    /**
     * @docid
     * @type Array<dxTreeViewItem | any>
     * @public
     */
    items?: Array<TItem>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tree_view:ItemClickEvent}

     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tree_view:ItemCollapsedEvent}
     * @action
     * @public
     */
    onItemCollapsed?: ((e: ItemCollapsedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tree_view:ItemContextMenuEvent}
     * @action
     * @public
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tree_view:ItemExpandedEvent}
     * @action
     * @public
     */
    onItemExpanded?: ((e: ItemExpandedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tree_view:ItemHoldEvent}
     * @action
     * @public
     */
    onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tree_view:ItemRenderedEvent}
     * @action
     * @public
     */
    onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tree_view:ItemSelectionChangedEvent}
     * @action
     * @public
     */
    onItemSelectionChanged?: ((e: ItemSelectionChangedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tree_view:SelectAllValueChangedEvent}
     * @action
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/tree_view:SelectionChangedEvent}
     * @action
     * @public
     * @override
     */
    onSelectionChanged?: ((e: SelectionChangedEvent<TItem, TKey>) => void);
    /**
     * @docid
     * @default 'parentId'
     * @hidden false
     * @public
     */
    parentIdExpr?: string | Function;
    /**
     * @docid
     * @default 0
     * @public
     */
    rootValue?: any;
    /**
     * @docid
     * @default "vertical"
     * @public
     */
    scrollDirection?: ScrollDirection;
    /**
     * @docid
     * @default "Select All"
     * @public
     */
    selectAllText?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    selectByClick?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    selectNodesRecursive?: boolean;
    /**
     * @docid
     * @default "multiple"
     * @public
     */
    selectionMode?: SingleOrMultiple;
    /**
     * @docid
     * @default 'none'
     * @public
     */
    showCheckBoxesMode?: TreeViewCheckBoxMode;
    /**
     * @docid
     * @default null
     * @public
     */
    collapseIcon?: string | null;
    /**
     * @docid
     * @default null
     * @public
     */
    expandIcon?: string | null;
    /**
     * @docid
     * @default false
     * @public
     */
    virtualModeEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @default false &for(desktop except Mac)
     * @public
     */
    useNativeScrolling?: boolean;
}
/**
 * @docid
 * @inherits HierarchicalCollectionWidget, SearchBoxMixin
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTreeView<TItem extends ItemLike = any, TKey = any>
    extends HierarchicalCollectionWidget<dxTreeViewOptions<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @publicName collapseAll()
     * @public
     */
    collapseAll(): void;
    /**
     * @docid
     * @publicName collapseItem(itemData)
     * @param1 itemData:dxTreeViewItem
     * @return Promise<void>
     * @public
     */
    collapseItem(itemData: TItem): DxPromise<void>;
    /**
     * @docid
     * @publicName collapseItem(itemElement)
     * @return Promise<void>
     * @public
     */
    collapseItem(itemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName collapseItem(key)
     * @return Promise<void>
     * @public
     */
    collapseItem(key: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName expandAll()
     * @public
     */
    expandAll(): void;
    /**
     * @docid
     * @publicName expandItem(itemData)
     * @param1 itemData:dxTreeViewItem
     * @return Promise<void>
     * @public
     */
    expandItem(itemData: TItem): DxPromise<void>;
    /**
     * @docid
     * @publicName expandItem(itemElement)
     * @return Promise<void>
     * @public
     */
    expandItem(itemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName expandItem(key)
     * @return Promise<void>
     * @public
     */
    expandItem(key: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName getNodes()
     * @public
     * @return Array<dxTreeViewNode>
     */
    getNodes(): Array<Node<TItem, TKey>>;
    /**
     * @docid
     * @publicName getSelectedNodes()
     * @public
     * @return Array<dxTreeViewNode>
     */
    getSelectedNodes(): Array<Node<TItem, TKey>>;
    /**
     * @docid
     * @publicName getSelectedNodeKeys()
     * @public
     */
    getSelectedNodeKeys(): Array<TKey>;
    /**
     * @docid
     * @publicName selectAll()
     * @public
     */
    selectAll(): void;
    /**
     * @docid
     * @publicName getScrollable()
     * @public
     * @return dxScrollable
     */
    getScrollable(): Scrollable;
    /**
     * @docid
     * @publicName selectItem(itemData)
     * @param1 itemData:dxTreeViewItem
     * @public
     */
    selectItem(itemData: TItem): boolean;
    /**
     * @docid
     * @publicName selectItem(itemElement)
     * @public
     */
    selectItem(itemElement: Element): boolean;
    /**
     * @docid
     * @publicName selectItem(key)
     * @public
     */
    selectItem(key: TKey): boolean;
    /**
     * @docid
     * @publicName unselectAll()
     * @public
     */
    unselectAll(): void;
    /**
     * @docid
     * @publicName unselectItem(itemData)
     * @param1 itemData:dxTreeViewItem
     * @public
     */
    unselectItem(itemData: TItem): boolean;
    /**
     * @docid
     * @publicName unselectItem(itemElement)
     * @public
     */
    unselectItem(itemElement: Element): boolean;
    /**
     * @docid
     * @publicName unselectItem(key)
     * @public
     */
    unselectItem(key: TKey): boolean;
    /**
     * @docid
     * @publicName updateDimensions()
     * @return Promise<void>
     * @public
     */
    updateDimensions(): DxPromise<void>;
    /**
     * @docid
     * @publicName scrollToItem(itemData)
     * @param1 itemData:dxTreeViewItem
     * @return Promise<void>
     * @public
     */
    scrollToItem(itemData: TItem): DxPromise<void>;
    /**
     * @docid
     * @publicName scrollToItem(itemElement)
     * @return Promise<void>
     * @public
     */
    scrollToItem(itemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName scrollToItem(key)
     * @return Promise<void>
     * @public
     */
    scrollToItem(key: TKey): DxPromise<void>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxTreeView
 */
export type Item = dxTreeViewItem;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxTreeViewItem extends CollectionWidgetItem {
    /**
     * @docid
     * @default false
     * @public
     */
    expanded?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    hasItems?: boolean | undefined;
    /**
     * @docid
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @public
     */
    items?: Array<dxTreeViewItem>;
    /**
     * @docid
     * @default undefined
     * @public
     */
    id?: number | string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    parentId?: number | string | undefined;
    /**
     * @docid
     * @default false
     * @public
     */
    selected?: boolean;
}

/**
 * @public
 * @docid dxTreeViewNode
 * @type object
 */
export type Node<TItem extends ItemLike = any, TKey = any> = dxTreeViewNode<TItem, TKey>;

/**
 * @docid
 * @deprecated {ui/tree_view.Node}
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxTreeViewNode<TItem extends ItemLike = any, TKey = any> {
    /**
     * @docid
     * @public
     * @type Array<dxTreeViewNode>;
     */
    children?: Array<dxTreeViewNode<TItem, TKey>>;
    /**
     * @docid
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @public
     */
    expanded?: boolean;
    /**
     * @docid
     * @public
     * @type dxTreeViewItem
     */
    itemData?: TItem;
    /**
     * @docid
     * @public
     */
    key?: TKey;
    /**
     * @docid
     * @public
     * @type dxTreeViewNode
     */
    parent?: dxTreeViewNode<TItem, TKey>;
    /**
     * @docid
     * @public
     */
    selected?: boolean;
    /**
     * @docid
     * @public
     */
    text?: string;
}

/** @public */
export type Scrollable = Omit<dxScrollable, '_templateManager' | '_cancelOptionChange' | '_getTemplate' | '_invalidate' | '_refresh' | '_notifyOptionChanged' | '_createElement'>;

/** @public */
export type ExplicitTypes<TItem extends ItemLike = any, TKey = any> = {
    Properties: Properties<TItem, TKey>;
    Node: Node<TItem, TKey>;
    ContentReadyEvent: ContentReadyEvent<TItem, TKey>;
    DisposingEvent: DisposingEvent<TItem, TKey>;
    InitializedEvent: InitializedEvent<TItem, TKey>;
    ItemClickEvent: ItemClickEvent<TItem, TKey>;
    ItemCollapsedEvent: ItemCollapsedEvent<TItem, TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TItem, TKey>;
    ItemExpandedEvent: ItemExpandedEvent<TItem, TKey>;
    ItemHoldEvent: ItemHoldEvent<TItem, TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TItem, TKey>;
    ItemSelectionChangedEvent: ItemSelectionChangedEvent<TItem, TKey>;
    OptionChangedEvent: OptionChangedEvent<TItem, TKey>;
    SelectAllValueChangedEvent: SelectAllValueChangedEvent<TItem, TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TItem, TKey>;
};

/** @public */
export type Properties<TItem extends ItemLike = any, TKey = any> = dxTreeViewOptions<TItem, TKey>;

/// #DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onItemDeleted' | 'onItemDeleting' | 'onItemReordered' | 'onSelectionChanging'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onItemClick' | 'onItemCollapsed' | 'onItemContextMenu' | 'onItemExpanded' | 'onItemHold' | 'onItemRendered' | 'onItemSelectionChanged' | 'onSelectAllValueChanged' | 'onSelectionChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTreeViewOptions.onContentReady
 * @type_function_param1 e:{ui/tree_view:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxTreeViewOptions.onDisposing
 * @type_function_param1 e:{ui/tree_view:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTreeViewOptions.onInitialized
 * @type_function_param1 e:{ui/tree_view:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTreeViewOptions.onOptionChanged
 * @type_function_param1 e:{ui/tree_view:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
/// #ENDDEBUG
