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

interface TreeViewItemInfo<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> {
    readonly itemData?: TItem;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: Node<TItem, TKey>;
}

/** @public */
export type ContentReadyEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxTreeView<TItem, TKey>>;

/** @public */
export type DisposingEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxTreeView<TItem, TKey>>;

/** @public */
export type InitializedEvent<TItem extends Item<any> = Item<any>, TKey = any> = InitializedEventInfo<dxTreeView<TItem, TKey>>;

/** @public */
export type ItemClickEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>> & TreeViewItemInfo<TItem, TKey>;

/** @public */
export type ItemCollapsedEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>> & TreeViewItemInfo<TItem, TKey>;

/** @public */
export type ItemContextMenuEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>> & TreeViewItemInfo<TItem, TKey>;

/** @public */
export type ItemExpandedEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>> & TreeViewItemInfo<TItem, TKey>;

/** @public */
export type ItemHoldEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>> & TreeViewItemInfo<TItem, TKey>;

/** @public */
export type ItemRenderedEvent<TItem extends Item<any> = Item<any>, TKey = any> = NativeEventInfo<dxTreeView<TItem, TKey>> & TreeViewItemInfo<TItem, TKey>;

/** @public */
export type ItemSelectionChangedEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxTreeView<TItem, TKey>> & TreeViewItemInfo<TItem, TKey>;

/** @public */
export type OptionChangedEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxTreeView<TItem, TKey>> & ChangedOptionInfo;

/** @public */
export type SelectAllValueChangedEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxTreeView<TItem, TKey>> & {
    readonly value?: boolean | undefined;
};

/** @public */
export type SelectionChangedEvent<TItem extends Item<any> = Item<any>, TKey = any> = EventInfo<dxTreeView<TItem, TKey>>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxTreeViewOptions<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> extends Skip<HierarchicalCollectionWidgetOptions<dxTreeView<TItem, TKey>, TItem, TKey>, 'dataSource'>, SearchBoxMixinOptions {
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
     * @type string | Array<dxTreeViewItem> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: DataSourceLike<TItem, TKey>;
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
    items?: Array<TItem>;
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
    onItemClick?: ((e: ItemClickEvent<TItem, TKey>) => void);
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
    onItemCollapsed?: ((e: ItemCollapsedEvent<TItem, TKey>) => void);
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
    onItemContextMenu?: ((e: ItemContextMenuEvent<TItem, TKey>) => void);
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
    onItemExpanded?: ((e: ItemExpandedEvent<TItem, TKey>) => void);
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
    onItemHold?: ((e: ItemHoldEvent<TItem, TKey>) => void);
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
    onItemRendered?: ((e: ItemRenderedEvent<TItem, TKey>) => void);
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
    onItemSelectionChanged?: ((e: ItemSelectionChangedEvent<TItem, TKey>) => void);
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
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent<TItem, TKey>) => void);
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
export default class dxTreeView<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> extends HierarchicalCollectionWidget<dxTreeViewOptions<TItem, TKey>, TItem, TKey> {
    /**
     * @docid
     * @publicName collapseAll()
     * @public
     */
    collapseAll(): void;
    /**
     * @docid
     * @publicName collapseItem(itemData)
     * @param1 itemData:Object
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
     * @param1 itemData:Object
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
     * @publicName selectItem(itemData)
     * @param1 itemData:Object
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
     * @param1 itemData:Object
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
     * @param1 itemData:Object
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
export type Item<TItem extends Item<any> = Item<any>> = dxTreeViewItem<TItem>;

/**
 * @deprecated Use Item instead
 * @namespace DevExpress.ui
 */
export interface dxTreeViewItem<TItem extends dxTreeViewItem<any> = dxTreeViewItem<any>> extends CollectionWidgetItem<TItem> {
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
     * @type Array<dxTreeViewItem>
     */
    items?: Array<TItem>;
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
}

/** @public */
export type Node<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = dxTreeViewNode<TItem, TKey>;

/**
 * @docid
 * @deprecated {ui/tree_view.Node}
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxTreeViewNode<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> {
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
     * @type any
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
export type ExplicitTypes<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = {
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
export type Properties<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = dxTreeViewOptions<TItem, TKey>;

/** @deprecated use Properties instead */
export type Options<
    TItem extends Item<any> = Item<any>,
    TKey = any,
> = Properties<TItem, TKey>;
