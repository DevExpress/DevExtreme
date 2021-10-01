import {
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import DataSource, {
    DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

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

import {
    NavSelectionMode,
    ScrollDirection,
    TreeViewDataStructure,
    TreeViewCheckBoxMode,
    TreeViewExpandEvent,
} from '../types/enums';

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
};

/** @public */
export type ItemCollapsedEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
};

/** @public */
export type ItemContextMenuEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number | any;
    readonly node?: dxTreeViewNode;
};

/** @public */
export type ItemExpandedEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
};

/** @public */
export type ItemHoldEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
};

/** @public */
export type ItemRenderedEvent = NativeEventInfo<dxTreeView> & {
    readonly itemData?: any;
    readonly itemElement?: DxElement;
    readonly itemIndex?: number;
    readonly node?: dxTreeViewNode;
};

/** @public */
export type ItemSelectionChangedEvent = EventInfo<dxTreeView> & {
    readonly node?: dxTreeViewNode;
    readonly itemElement?: DxElement;
    readonly itemData?: any;
    readonly itemIndex?: number;
};

/** @public */
export type OptionChangedEvent = EventInfo<dxTreeView> & ChangedOptionInfo;

/** @public */
export type SelectAllValueChangedEvent = EventInfo<dxTreeView> & {
    readonly value?: boolean | undefined;
};

/** @public */
export type SelectionChangedEvent = EventInfo<dxTreeView>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTreeViewOptions extends HierarchicalCollectionWidgetOptions<dxTreeView>, SearchBoxMixinOptions {
    /**
     * @docid
     * @default true
     * @public
     */
    animationEnabled?: boolean;
    /**
     * @docid
     * @type_function_return Promise<any>|Array<Object>
     * @public
     */
    createChildren?: ((parentNode: dxTreeViewNode) => PromiseLike<any> | Array<any>);
    /**
     * @docid
     * @type string | Array<dxTreeViewItem> | Store | DataSource | DataSourceOptions
     * @default null
     * @public
     */
    dataSource?: string | Array<Item> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default 'tree'
     * @public
     */
    dataStructure?: TreeViewDataStructure;
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
     * @type_function_param1_field6 itemIndex:number | object
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 node:dxTreeViewNode
     * @type_function_param1_field1 component:dxTreeView
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
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
     * @public
     * @override
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
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
    selectionMode?: NavSelectionMode;
    /**
     * @docid
     * @default 'none'
     * @public
     */
    showCheckBoxesMode?: TreeViewCheckBoxMode;
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
export default class dxTreeView extends HierarchicalCollectionWidget<dxTreeViewOptions> {
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
    collapseItem(itemData: any): DxPromise<void>;
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
    collapseItem(key: any): DxPromise<void>;
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
    expandItem(itemData: any): DxPromise<void>;
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
    expandItem(key: any): DxPromise<void>;
    /**
     * @docid
     * @publicName getNodes()
     * @public
     */
    getNodes(): Array<dxTreeViewNode>;
    /**
     * @docid
     * @publicName getSelectedNodes()
     * @public
     */
    getSelectedNodes(): Array<dxTreeViewNode>;
    /**
     * @docid
     * @publicName getSelectedNodeKeys()
     * @public
     */
    getSelectedNodeKeys(): Array<any>;
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
    selectItem(itemData: any): boolean;
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
    selectItem(key: any): boolean;
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
    unselectItem(itemData: any): boolean;
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
    unselectItem(key: any): boolean;
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
    scrollToItem(itemData: any): DxPromise<void>;
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
    scrollToItem(key: any): DxPromise<void>;
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
     * @type Array<dxTreeViewItem>
     */
    items?: Array<Item>;
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

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxTreeViewNode {
    /**
     * @docid
     * @public
     */
    children?: Array<dxTreeViewNode>;
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
     */
    itemData?: any;
    /**
     * @docid
     * @public
     */
    key?: any;
    /**
     * @docid
     * @public
     */
    parent?: dxTreeViewNode;
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
export type Properties = dxTreeViewOptions;

/** @deprecated use Properties instead */
export type Options = dxTreeViewOptions;

/** @deprecated use Properties instead */
export type IOptions = dxTreeViewOptions;
