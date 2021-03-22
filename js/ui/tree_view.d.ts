import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    TEvent
} from '../events/index';

import {
    CollectionWidgetItem
} from './collection/ui.collection_widget.base';

import HierarchicalCollectionWidget, {
    HierarchicalCollectionWidgetOptions
} from './hierarchical_collection/ui.hierarchical_collection_widget';

import {
    SearchBoxMixinOptions
} from './widget/ui.search_box_mixin';

export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions<dxTreeView>, SearchBoxMixinOptions<dxTreeView> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @type_function_param1 parentNode:dxTreeViewNode
     * @type_function_return Promise<any>|Array<Object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    createChildren?: ((parentNode: dxTreeViewNode) => TPromise<any> | Array<any>);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<dxTreeViewItem> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type Enums.TreeViewDataStructure
     * @default 'tree'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataStructure?: 'plain' | 'tree';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandAllEnabled?: boolean;
    /**
     * @docid
     * @type Enums.TreeViewExpandEvent
     * @default "dblclick"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandEvent?: 'dblclick' | 'click';
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandNodesRecursive?: boolean;
    /**
     * @docid
     * @default 'expanded'
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandedExpr?: string | Function;
    /**
     * @docid
     * @default 'hasItems'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasItemsExpr?: string | Function;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxTreeViewItem>;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: { component?: dxTreeView, element?: TElement, model?: any, itemData?: any, itemElement?: TElement, itemIndex?: number | any, event?: TEvent, node?: dxTreeViewNode }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:Number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemCollapsed?: ((e: { component?: dxTreeView, element?: TElement, model?: any, itemData?: any, itemElement?: TElement, itemIndex?: number, event?: TEvent, node?: dxTreeViewNode }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemContextMenu?: ((e: { component?: dxTreeView, element?: TElement, model?: any, itemData?: any, itemElement?: TElement, itemIndex?: number | any, event?: TEvent, node?: dxTreeViewNode }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:Number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemExpanded?: ((e: { component?: dxTreeView, element?: TElement, model?: any, itemData?: any, itemElement?: TElement, itemIndex?: number, event?: TEvent, node?: dxTreeViewNode }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemHold?: ((e: { component?: dxTreeView, element?: TElement, model?: any, itemData?: any, itemElement?: TElement, itemIndex?: number, event?: TEvent, node?: dxTreeViewNode }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 node:dxTreeViewNode
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemRendered?: ((e: { component?: dxTreeView, element?: TElement, model?: any, itemData?: any, itemElement?: TElement, itemIndex?: number, node?: dxTreeViewNode }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 node:dxTreeViewNode
     * @type_function_param1_field5 itemElement:dxElement
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemSelectionChanged?: ((e: { component?: dxTreeView, element?: TElement, model?: any, node?: dxTreeViewNode, itemElement?: TElement }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectAllValueChanged?: ((e: { component?: dxTreeView, element?: TElement, model?: any, value?: boolean }) => void);
    /**
     * @docid
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     * @override
     */
    onSelectionChanged?: ((e: { component?: dxTreeView, element?: TElement, model?: any }) => void);
    /**
     * @docid
     * @default 'parentId'
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    parentIdExpr?: string | Function;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rootValue?: any;
    /**
     * @docid
     * @type Enums.ScrollDirection
     * @default "vertical"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollDirection?: 'both' | 'horizontal' | 'vertical';
    /**
     * @docid
     * @default "Select All"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectAllText?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectByClick?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectNodesRecursive?: boolean;
    /**
     * @docid
     * @type Enums.NavSelectionMode
     * @default "multiple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @type Enums.TreeViewCheckBoxMode
     * @default 'none'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showCheckBoxesMode?: 'none' | 'normal' | 'selectAll';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    virtualModeEnabled?: boolean;
}
/**
 * @docid
 * @inherits HierarchicalCollectionWidget, SearchBoxMixin
 * @module ui/tree_view
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTreeView extends HierarchicalCollectionWidget {
    constructor(element: TElement, options?: dxTreeViewOptions)
    /**
     * @docid
     * @publicName collapseAll()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseAll(): void;
    /**
     * @docid
     * @publicName collapseItem(itemData)
     * @param1 itemData:Object
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseItem(itemData: any): TPromise<void>;
    /**
     * @docid
     * @publicName collapseItem(itemElement)
     * @param1 itemElement:Element
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseItem(itemElement: Element): TPromise<void>;
    /**
     * @docid
     * @publicName collapseItem(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseItem(key: any): TPromise<void>;
    /**
     * @docid
     * @publicName expandAll()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandAll(): void;
    /**
     * @docid
     * @publicName expandItem(itemData)
     * @param1 itemData:Object
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandItem(itemData: any): TPromise<void>;
    /**
     * @docid
     * @publicName expandItem(itemElement)
     * @param1 itemElement:Element
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandItem(itemElement: Element): TPromise<void>;
    /**
     * @docid
     * @publicName expandItem(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandItem(key: any): TPromise<void>;
    /**
     * @docid
     * @publicName getNodes()
     * @return Array<dxTreeViewNode>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getNodes(): Array<dxTreeViewNode>;
    /**
     * @docid
     * @publicName getSelectedNodes()
     * @return Array<dxTreeViewNode>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedNodes(): Array<dxTreeViewNode>;
    /**
     * @docid
     * @publicName getSelectedNodeKeys()
     * @return Array<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedNodeKeys(): Array<any>;
    /**
     * @docid
     * @publicName selectAll()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectAll(): void;
    /**
     * @docid
     * @publicName selectItem(itemData)
     * @param1 itemData:Object
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectItem(itemData: any): boolean;
    /**
     * @docid
     * @publicName selectItem(itemElement)
     * @param1 itemElement:Element
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectItem(itemElement: Element): boolean;
    /**
     * @docid
     * @publicName selectItem(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectItem(key: any): boolean;
    /**
     * @docid
     * @publicName unselectAll()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectAll(): void;
    /**
     * @docid
     * @publicName unselectItem(itemData)
     * @param1 itemData:Object
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectItem(itemData: any): boolean;
    /**
     * @docid
     * @publicName unselectItem(itemElement)
     * @param1 itemElement:Element
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectItem(itemElement: Element): boolean;
    /**
     * @docid
     * @publicName unselectItem(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unselectItem(key: any): boolean;
    /**
     * @docid
     * @publicName updateDimensions()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): TPromise<void>;
    /**
     * @docid
     * @publicName scrollToItem(itemData)
     * @param1 itemData:Object
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToItem(itemData: any): TPromise<void>;
    /**
     * @docid
     * @publicName scrollToItem(itemElement)
     * @param1 itemElement:Element
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToItem(itemElement: Element): TPromise<void>;
    /**
     * @docid
     * @publicName scrollToItem(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToItem(key: any): TPromise<void>;
}

/**
* @docid
* @inherits CollectionWidgetItem
* @type object
*/
export interface dxTreeViewItem extends CollectionWidgetItem {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expanded?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasItems?: boolean;
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
    items?: Array<dxTreeViewItem>;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    parentId?: number | string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selected?: boolean;
}

/**
 * @docid
 * @type object
 */
export interface dxTreeViewNode {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    children?: Array<dxTreeViewNode>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabled?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expanded?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemData?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    key?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    parent?: dxTreeViewNode;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selected?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    text?: string;
}

export type Options = dxTreeViewOptions;

/** @deprecated use Options instead */
export type IOptions = dxTreeViewOptions;
