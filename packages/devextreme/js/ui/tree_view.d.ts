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
} from '../common/core/events';

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

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ItemInfo<TKey = any> {
    /**
     * 
     */
    readonly itemData?: Item;
    /**
     * 
     */
    readonly itemElement?: DxElement;
    /**
     * 
     */
    readonly itemIndex?: number;
    /**
     * 
     */
    readonly node?: Node<TKey>;
}

export {
    DataStructure,
    SingleOrMultiple,
    ScrollDirection,
};

export type TreeViewCheckBoxMode = 'none' | 'normal' | 'selectAll';
export type TreeViewExpandEvent = 'dblclick' | 'click';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TKey = any> = EventInfo<dxTreeView<TKey>>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TKey = any> = EventInfo<dxTreeView<TKey>>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TKey = any> = InitializedEventInfo<dxTreeView<TKey>>;

/**
 * The type of the itemClick event handler&apos;s argument.
 */
export type ItemClickEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TKey>;

/**
 * The type of the itemCollapsed event handler&apos;s argument.
 */
export type ItemCollapsedEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, MouseEvent | PointerEvent> & ItemInfo<TKey>;

/**
 * The type of the itemContextMenu event handler&apos;s argument.
 */
export type ItemContextMenuEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TKey>;

/**
 * The type of the itemExpanded event handler&apos;s argument.
 */
export type ItemExpandedEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, MouseEvent | PointerEvent> & ItemInfo<TKey>;

/**
 * The type of the itemHold event handler&apos;s argument.
 */
export type ItemHoldEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TKey>;

/**
 * The type of the itemRendered event handler&apos;s argument.
 */
export type ItemRenderedEvent<TKey = any> = EventInfo<dxTreeView<TKey>> & ItemInfo<TKey>;

/**
 * The type of the itemSelectionChanged event handler&apos;s argument.
 */
export type ItemSelectionChangedEvent<TKey = any> = EventInfo<dxTreeView<TKey>> & ItemInfo<TKey>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TKey = any> = EventInfo<dxTreeView<TKey>> & ChangedOptionInfo;

/**
 * The type of the selectAllValueChanged event handler&apos;s argument.
 */
export type SelectAllValueChangedEvent<TKey = any> = EventInfo<dxTreeView<TKey>> & {
    /**
     * 
     */
    readonly value?: boolean | undefined;
};

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent<TKey = any> = EventInfo<dxTreeView<TKey>>;

/**
 * 
 * @deprecated 
 */
export interface dxTreeViewOptions<TKey = any>
    extends Omit<HierarchicalCollectionWidgetOptions<dxTreeView<TKey>, dxTreeViewItem, TKey>, 'dataSource'>, SearchBoxMixinOptions {
    /**
     * Specifies whether or not to animate item collapsing and expanding.
     */
    animationEnabled?: boolean;
    /**
     * Allows you to load nodes on demand.
     */
    createChildren?: ((parentNode: Node<TKey>) => PromiseLike<any> | Array<any>);
    /**
     * Binds the UI component to data.
     */
    dataSource?: DataSourceLike<Item, TKey> | null;
    /**
     * Notifies the UI component of the data structure in use.
     */
    dataStructure?: DataStructure;
    /**
     * Specifies whether or not a user can expand all tree view items by the &apos;*&apos; hot key.
     */
    expandAllEnabled?: boolean;
    /**
     * Specifies the event on which to expand/collapse a node.
     */
    expandEvent?: TreeViewExpandEvent;
    /**
     * Specifies whether or not all parent nodes of an initially expanded node are displayed expanded.
     */
    expandNodesRecursive?: boolean;
    /**
     * Specifies which data source field specifies whether an item is expanded.
     */
    expandedExpr?: string | Function;
    /**
     * Specifies the name of the data source item field whose value defines whether or not the corresponding node includes child nodes.
     */
    hasItemsExpr?: string | Function;
    /**
     * An array of items displayed by the UI component.
     */
    items?: Array<Item>;
    /**
     * A function that is executed when a collection item is clicked or tapped.
     */
    onItemClick?: ((e: ItemClickEvent<TKey>) => void);
    /**
     * A function that is executed when a tree view item is collapsed.
     */
    onItemCollapsed?: ((e: ItemCollapsedEvent<TKey>) => void);
    /**
     * A function that is executed when a collection item is right-clicked or pressed.
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent<TKey>) => void);
    /**
     * A function that is executed when a tree view item is expanded.
     */
    onItemExpanded?: ((e: ItemExpandedEvent<TKey>) => void);
    /**
     * A function that is executed when a collection item has been held for a specified period.
     */
    onItemHold?: ((e: ItemHoldEvent<TKey>) => void);
    /**
     * A function that is executed after a collection item is rendered.
     */
    onItemRendered?: ((e: ItemRenderedEvent<TKey>) => void);
    /**
     * A function that is executed when a single TreeView item is selected or selection is canceled.
     */
    onItemSelectionChanged?: ((e: ItemSelectionChangedEvent<TKey>) => void);
    /**
     * A function that is executed when the &apos;Select All&apos; check box value is changed. Applies only if showCheckBoxesMode is &apos;selectAll&apos; and selectionMode is &apos;multiple&apos;.
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent<TKey>) => void);
    /**
     * A function that is executed when a TreeView item is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent<TKey>) => void);
    /**
     * Specifies the name of the data source item field for holding the parent key of the corresponding node.
     */
    parentIdExpr?: string | Function;
    /**
     * Specifies the parent ID value of the root item.
     */
    rootValue?: any;
    /**
     * A string value specifying available scrolling directions.
     */
    scrollDirection?: ScrollDirection;
    /**
     * Specifies the text displayed at the &apos;Select All&apos; check box.
     */
    selectAllText?: string;
    /**
     * Specifies whether an item is selected if a user clicks it.
     */
    selectByClick?: boolean;
    /**
     * Specifies whether all child nodes should be selected when their parent node is selected. Applies only if the selectionMode is &apos;multiple&apos;.
     */
    selectNodesRecursive?: boolean;
    /**
     * Specifies item selection mode. Applies only if selection is enabled.
     */
    selectionMode?: SingleOrMultiple;
    /**
     * Specifies the checkbox display mode.
     */
    showCheckBoxesMode?: TreeViewCheckBoxMode;
    /**
     * Specifies a custom collapse icon.
     */
    collapseIcon?: string | null;
    /**
     * Specifies a custom expand icon.
     */
    expandIcon?: string | null;
    /**
     * Enables the virtual mode in which nodes are loaded on demand. Use it to enhance the performance on large datasets.
     */
    virtualModeEnabled?: boolean;
    /**
     * Specifies whether or not the UI component uses native scrolling.
     */
    useNativeScrolling?: boolean;
}
/**
 * The TreeView UI component is a tree-like representation of textual data.
 */
export default class dxTreeView<TKey = any>
    extends HierarchicalCollectionWidget<dxTreeViewOptions<TKey>, dxTreeViewItem, TKey> {
    /**
     * Collapses all items.
     */
    collapseAll(): void;
    /**
     * Collapses an item with a specific key.
     */
    collapseItem(itemData: Item): DxPromise<void>;
    /**
     * Collapses an item found using its DOM node.
     */
    collapseItem(itemElement: Element): DxPromise<void>;
    /**
     * Collapses an item with a specific key.
     */
    collapseItem(key: TKey): DxPromise<void>;
    /**
     * Expands all items. If you load items on demand, this method expands only the loaded items.
     */
    expandAll(): void;
    /**
     * Expands an item found using its data object.
     */
    expandItem(itemData: Item): DxPromise<void>;
    /**
     * Expands an item found using its DOM node.
     */
    expandItem(itemElement: Element): DxPromise<void>;
    /**
     * Expands an item with a specific key.
     */
    expandItem(key: TKey): DxPromise<void>;
    /**
     * Gets all nodes.
     */
    getNodes(): Array<Node<TKey>>;
    /**
     * Gets selected nodes.
     */
    getSelectedNodes(): Array<Node<TKey>>;
    /**
     * Gets the keys of selected nodes.
     */
    getSelectedNodeKeys(): Array<TKey>;
    /**
     * Selects all nodes.
     */
    selectAll(): void;
    /**
     * Gets the instance of the UI component&apos;s scrollable part.
     */
    getScrollable(): Scrollable;
    /**
     * Selects a node found using its data object.
     */
    selectItem(itemData: Item): boolean;
    /**
     * Selects a TreeView node found using its DOM node.
     */
    selectItem(itemElement: Element): boolean;
    /**
     * Selects a node with a specific key.
     */
    selectItem(key: TKey): boolean;
    /**
     * Cancels the selection of all nodes.
     */
    unselectAll(): void;
    /**
     * Cancels the selection of a node found using its data object.
     */
    unselectItem(itemData: Item): boolean;
    /**
     * Cancels the selection of a TreeView node found using its DOM node.
     */
    unselectItem(itemElement: Element): boolean;
    /**
     * Cancels the selection of a node with a specific key.
     */
    unselectItem(key: TKey): boolean;
    /**
     * Updates the tree view scrollbars according to the current size of the UI component content.
     */
    updateDimensions(): DxPromise<void>;
    /**
     * Scrolls the content to an item found using its data.
     */
    scrollToItem(itemData: Item): DxPromise<void>;
    /**
     * Scrolls the content to an item found using its DOM node.
     */
    scrollToItem(itemElement: Element): DxPromise<void>;
    /**
     * Scrolls the content to an item found using its key.
     */
    scrollToItem(key: TKey): DxPromise<void>;
}

export type Item = dxTreeViewItem;

/**
 * @deprecated Use Item instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTreeViewItem extends CollectionWidgetItem {
    /**
     * Specifies whether or not the tree view item is displayed expanded.
     */
    expanded?: boolean;
    /**
     * Specifies whether or not the tree view item has children.
     */
    hasItems?: boolean | undefined;
    /**
     * Specifies the tree view item&apos;s icon.
     */
    icon?: string;
    /**
     * Specifies nested tree view items.
     */
    items?: Array<dxTreeViewItem>;
    /**
     * Holds the unique key of an item.
     */
    id?: number | string | undefined;
    /**
     * Holds the key of the parent item.
     */
    parentId?: number | string | undefined;
    /**
     * Specifies whether the TreeView item should be displayed as selected.
     */
    selected?: boolean;

    [key: string]: any;
}

/**
 * A TreeView node.
 */
export type Node<TKey = any> = dxTreeViewNode<TKey>;

/**
 * A TreeView node.
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTreeViewNode<TKey = any> {
    /**
     * Contains all the child nodes of the current node.
     */
    children?: Array<dxTreeViewNode<TKey>>;
    /**
     * Equals to true if the node is disabled; otherwise false.
     */
    disabled?: boolean;
    /**
     * Equals true if the node is expanded; false if collapsed.
     */
    expanded?: boolean;
    /**
     * Contains the data source object corresponding to the node.
     */
    itemData?: Item;
    /**
     * Contains the key value of the node.
     */
    key?: TKey;
    /**
     * Refers to the parent node of the current node.
     */
    parent?: dxTreeViewNode<TKey>;
    /**
     * Equals to true if the node is selected; false if not.
     */
    selected?: boolean;
    /**
     * Contains the text displayed by the node.
     */
    text?: string;
}

export type Scrollable = Omit<dxScrollable, '_templateManager' | '_cancelOptionChange' | '_getTemplate' | '_invalidate' | '_refresh' | '_notifyOptionChanged' | '_createElement'>;

export type ExplicitTypes<TKey = any> = {
    Properties: Properties<TKey>;
    Node: Node<TKey>;
    ContentReadyEvent: ContentReadyEvent<TKey>;
    DisposingEvent: DisposingEvent<TKey>;
    InitializedEvent: InitializedEvent<TKey>;
    ItemClickEvent: ItemClickEvent<TKey>;
    ItemCollapsedEvent: ItemCollapsedEvent<TKey>;
    ItemContextMenuEvent: ItemContextMenuEvent<TKey>;
    ItemExpandedEvent: ItemExpandedEvent<TKey>;
    ItemHoldEvent: ItemHoldEvent<TKey>;
    ItemRenderedEvent: ItemRenderedEvent<TKey>;
    ItemSelectionChangedEvent: ItemSelectionChangedEvent<TKey>;
    OptionChangedEvent: OptionChangedEvent<TKey>;
    SelectAllValueChangedEvent: SelectAllValueChangedEvent<TKey>;
    SelectionChangedEvent: SelectionChangedEvent<TKey>;
};

export type Properties<TKey = any> = dxTreeViewOptions<TKey>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options<TKey = any> = Properties<TKey>;

///#DEBUG
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
///#ENDDEBUG
