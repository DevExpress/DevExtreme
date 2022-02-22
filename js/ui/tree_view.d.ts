import { Skip } from '../core';
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
} from '../events/index';

import {
    CollectionWidgetItem,
} from './collection/ui.collection_widget.base';

import HierarchicalCollectionWidget, {
    HierarchicalCollectionWidgetOptions,
} from './hierarchical_collection/ui.hierarchical_collection_widget';

import {
    SearchBoxMixinOptions,
} from './widget/ui.search_box_mixin';

import dxScrollable from './scroll_view/ui.scrollable';

interface ItemInfo<TKey = any> {
    readonly itemData?: Item;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: Node<TKey>;
}

/** @public */
export type ContentReadyEvent<TKey = any> = EventInfo<dxTreeView<TKey>>;

/** @public */
export type DisposingEvent<TKey = any> = EventInfo<dxTreeView<TKey>>;

/** @public */
export type InitializedEvent<TKey = any> = InitializedEventInfo<dxTreeView<TKey>>;

/** @public */
export type ItemClickEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo<TKey>;

/** @public */
export type ItemCollapsedEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, MouseEvent | PointerEvent> & ItemInfo<TKey>;

/** @public */
export type ItemContextMenuEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TKey>;

/** @public */
export type ItemExpandedEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, MouseEvent | PointerEvent> & ItemInfo<TKey>;

/** @public */
export type ItemHoldEvent<TKey = any> = NativeEventInfo<dxTreeView<TKey>, MouseEvent | PointerEvent | TouchEvent> & ItemInfo<TKey>;

/** @public */
export type ItemRenderedEvent<TKey = any> = EventInfo<dxTreeView<TKey>> & ItemInfo<TKey>;

/** @public */
export type ItemSelectionChangedEvent<TKey = any> = EventInfo<dxTreeView<TKey>> & ItemInfo<TKey>;

/** @public */
export type OptionChangedEvent<TKey = any> = EventInfo<dxTreeView<TKey>> & ChangedOptionInfo;

/** @public */
export type SelectAllValueChangedEvent<TKey = any> = EventInfo<dxTreeView<TKey>> & {
    readonly value?: boolean | undefined;
};

/** @public */
export type SelectionChangedEvent<TKey = any> = EventInfo<dxTreeView<TKey>>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxTreeViewOptions<TKey = any>
    extends Skip<HierarchicalCollectionWidgetOptions<dxTreeView<TKey>, dxTreeViewItem, TKey>, 'dataSource'>, SearchBoxMixinOptions {
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
    createChildren?: ((parentNode: Node<TKey>) => PromiseLike<any> | Array<any>);
    /**
     * @docid
     * @type string | Array<dxTreeViewItem> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<Item, TKey>;
    /**
     * @docid
     * @type Enums.TreeViewDataStructure
     * @default 'tree'
     * @public
     */
    dataStructure?: 'plain' | 'tree';
    /**
     * @docid
     * @default false
     * @public
     */
    expandAllEnabled?: boolean;
    /**
     * @docid
     * @type Enums.TreeViewExpandEvent
     * @default "dblclick"
     * @public
     */
    expandEvent?: 'dblclick' | 'click';
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
     * @type Array<dxTreeViewItem>
     * @public
     */
    items?: Array<Item>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemClick?: ((e: ItemClickEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:Number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemCollapsed?: ((e: ItemCollapsedEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemContextMenu?: ((e: ItemContextMenuEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:Number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemExpanded?: ((e: ItemExpandedEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemHold?: ((e: ItemHoldEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onItemRendered?: ((e: ItemRenderedEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 node:dxTreeViewNode
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field6 itemData:object
     * @type_function_param1_field7 itemIndex:number
     * @action
     * @public
     */
    onItemSelectionChanged?: ((e: ItemSelectionChangedEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:boolean | undefined
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent<TKey>) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     * @override
     */
    onSelectionChanged?: ((e: SelectionChangedEvent<TKey>) => void);
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
     * @type Enums.ScrollDirection
     * @default "vertical"
     * @public
     */
    scrollDirection?: 'both' | 'horizontal' | 'vertical';
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
     * @type Enums.NavSelectionMode
     * @default "multiple"
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @type Enums.TreeViewCheckBoxMode
     * @default 'none'
     * @public
     */
    showCheckBoxesMode?: 'none' | 'normal' | 'selectAll';
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
export default class dxTreeView<TKey = any>
    extends HierarchicalCollectionWidget<dxTreeViewOptions<TKey>, dxTreeViewItem, TKey> {
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
    collapseItem(itemData: Item): DxPromise<void>;
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
    expandItem(itemData: Item): DxPromise<void>;
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
    getNodes(): Array<Node<TKey>>;
    /**
     * @docid
     * @publicName getSelectedNodes()
     * @public
     * @return Array<dxTreeViewNode>
     */
    getSelectedNodes(): Array<Node<TKey>>;
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
    selectItem(itemData: Item): boolean;
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
    unselectItem(itemData: Item): boolean;
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
    scrollToItem(itemData: Item): DxPromise<void>;
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
    hasItems?: boolean;
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
    id?: number | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    parentId?: number | string;
    /**
     * @docid
     * @default false
     * @public
     */
    selected?: boolean;

    [key: string]: any;
}

/** @public */
export type Node<TKey = any> = dxTreeViewNode<TKey>;

/**
 * @docid
 * @deprecated {ui/tree_view.Node}
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxTreeViewNode<TKey = any> {
    /**
     * @docid
     * @public
     * @type Array<dxTreeViewNode>;
     */
    children?: Array<dxTreeViewNode<TKey>>;
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
    itemData?: Item;
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
    parent?: dxTreeViewNode<TKey>;
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
export type Scrollable = Skip<dxScrollable, '_templateManager' | '_cancelOptionChange' | '_getTemplate' | '_invalidate' | '_refresh' | '_notifyOptionChanged' | '_createElement'>;

/** @public */
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

/** @public */
export type Properties<TKey = any> = dxTreeViewOptions<TKey>;

/** @deprecated use Properties instead */
export type Options<TKey = any> = Properties<TKey>;
