import {
    UserDefinedElement,
    DxElement
} from '../core/element';

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
    ChangedOptionInfo
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

/** @public */
export type ContentReadyEvent = EventInfo<dxTreeView>;

/** @public */
export type DisposingEvent = EventInfo<dxTreeView>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTreeView>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number | any;
    readonly node?: dxTreeViewNode;
}

/** @public */
export type ItemCollapsedEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
}

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number | any;
    readonly node?: dxTreeViewNode;
}

/** @public */
export type ItemExpandedEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
}

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
}

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
}

/** @public */
export type ItemSelectionChangedEvent = EventInfo<dxTreeView> & {
    readonly node?: dxTreeViewNode;
    readonly itemElement?: DxElement;
    readonly itemData?: any;
    readonly itemIndex?: number;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxTreeView> & ChangedOptionInfo;

/** @public */
export type SelectAllValueChangedEvent = EventInfo<dxTreeView> & {
    readonly value?: boolean | undefined;
}

/** @public */
export type SelectionChangedEvent = EventInfo<dxTreeView>;

/** @deprecated use Properties instead */
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
    createChildren?: ((parentNode: dxTreeViewNode) => PromiseLike<any> | Array<any>);
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
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemClick?: ((e: ItemClickEvent) => void);
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemCollapsed?: ((e: ItemCollapsedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
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
     * @type_function_param1_field6 itemIndex:Number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemExpanded?: ((e: ItemExpandedEvent) => void);
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
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemRendered?: ((e: ItemRenderedEvent) => void);
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onItemSelectionChanged?: ((e: ItemSelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:boolean | undefined
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectAllValueChanged?: ((e: SelectAllValueChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     * @override
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
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
    constructor(element: UserDefinedElement, options?: dxTreeViewOptions)
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
    collapseItem(itemData: any): DxPromise<void>;
    /**
     * @docid
     * @publicName collapseItem(itemElement)
     * @param1 itemElement:Element
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseItem(itemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName collapseItem(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseItem(key: any): DxPromise<void>;
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
    expandItem(itemData: any): DxPromise<void>;
    /**
     * @docid
     * @publicName expandItem(itemElement)
     * @param1 itemElement:Element
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandItem(itemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName expandItem(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandItem(key: any): DxPromise<void>;
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
    updateDimensions(): DxPromise<void>;
    /**
     * @docid
     * @publicName scrollToItem(itemData)
     * @param1 itemData:Object
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToItem(itemData: any): DxPromise<void>;
    /**
     * @docid
     * @publicName scrollToItem(itemElement)
     * @param1 itemElement:Element
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToItem(itemElement: Element): DxPromise<void>;
    /**
     * @docid
     * @publicName scrollToItem(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToItem(key: any): DxPromise<void>;
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

/** @public */
export type Properties = dxTreeViewOptions;

/** @deprecated use Properties instead */
export type Options = dxTreeViewOptions;

/** @deprecated use Properties instead */
export type IOptions = dxTreeViewOptions;
