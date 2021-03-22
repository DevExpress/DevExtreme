import {
    TElement,
    TElementsArray
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    TPromise
} from '../core/utils/deferred';

import DataSource from '../data/data_source';

import {
    TEvent
} from '../events/index';

import {
    GridBase,
    ColumnBase,
    ColumnButtonBase,
    EditingBase,
    EditingTextsBase,
    GridBaseOptions,
    PagingBase,
    ScrollingBase,
    SelectionBase
} from './data_grid';

import dxScrollable from './scroll_view/ui.scrollable';

import Widget from './widget/ui.widget';

/**
 * @public
 */
export interface CellClickEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly event: TEvent;
    readonly data: any;
    readonly key: any;
    readonly value?: any;
    readonly displayValue?: any;
    readonly text: string;
    readonly columnIndex: number;
    readonly column: any;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly cellElement: TElement;
    readonly row: RowObject;
}

/**
 * @public
 */
export interface CellDblClick {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly event: TEvent;
    readonly data: any;
    readonly key: any;
    readonly value?: any;
    readonly displayValue?: any;
    readonly text: string;
    readonly columnIndex: number;
    readonly column: Column;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly cellElement: TElement;
    readonly row: RowObject;
}

/**
 * @public
 */
export interface CellHoverChangedEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly eventType: string;
    readonly data: any;
    readonly key: any;
    readonly value?: any;
    readonly text: string;
    readonly displayValue?: any;
    readonly columnIndex: number;
    readonly rowIndex: number;
    readonly column: Column;
    readonly rowType: string;
    readonly cellElement: TElement;
    readonly row: RowObject;
}

/**
 * @public
 */
export interface CellPreparedEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly data: any;
    readonly key: any;
    readonly value?: any;
    readonly displayValue?: any;
    readonly text: string;
    readonly columnIndex: number;
    readonly column: Column;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly row: RowObject;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly cellElement: TElement;
    readonly watch?: Function;
    readonly oldValue?: any;
}

/**
 * @public
 */
export interface ContextMenuPreparingEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    items?: Array<any>;
    readonly target: string;
    readonly targetElement: TElement;
    readonly columnIndex: number;
    readonly column?: Column;
    readonly rowIndex: number;
    readonly row?: RowObject;
}

/**
 * @public
 */
export interface EditingStartEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly data: any;
    readonly key: any;
    cancel: boolean;
    readonly column: any;
}

/**
 * @public
 */
export interface EditorPreparedEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly parentType: string;
    readonly value?: any;
    readonly setValue?: any;
    readonly updateValueTimeout?: number;
    readonly width?: number;
    readonly disabled: boolean;
    readonly rtlEnabled: boolean;
    readonly editorElement: TElement;
    readonly readOnly: boolean;
    readonly dataField?: string;
    readonly row?: RowObject;
}

/**
 * @public
 */
export interface EditorPreparingEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly parentType: string;
    readonly value?: any;
    readonly setValue?: any;
    updateValueTimeout?: number;
    readonly width?: number;
    readonly disabled: boolean;
    readonly rtlEnabled: boolean;
    cancel: boolean;
    readonly editorElement: TElement;
    readonly readOnly: boolean;
    editorName: string;
    editorOptions: any;
    readonly dataField?: string;
    readonly row?: RowObject;
}

/**
 * @public
 */
export interface FocusedCellChangedEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly cellElement: TElement;
    readonly columnIndex: number;
    readonly rowIndex: number;
    readonly row: RowObject;
    readonly column: Column;
}

/**
 * @public
 */
export interface FocusedCellChangingEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly cellElement: TElement;
    readonly prevColumnIndex: number;
    readonly prevRowIndex: number;
    newColumnIndex: number;
    newRowIndex: number;
    readonly event?: TEvent;
    readonly rows: Array<RowObject>;
    readonly columns: Array<Column>;
    cancel: boolean;
    isHighlighted: boolean;
}

/**
 * @public
 */
export interface FocusedRowChangedEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly rowElement: TElement;
    readonly rowIndex: number;
    readonly row: RowObject;
}

interface FocusedRowChangingEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly rowElement: TElement;
    readonly prevRowIndex: number;
    newRowIndex: number;
    readonly event?: TEvent;
    readonly rows: Array<RowObject>;
    cancel: boolean;
}

/**
 * @public
 */
export interface NodesInitializedEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly root: Node;
}

/**
 * @public
 */
export interface RowClickEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly event: TEvent;
    readonly data: any;
    readonly key: any;
    readonly values: Array<any>;
    readonly columns: Array<any>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: TElement;
    readonly handled: boolean;
    readonly node: Node;
    readonly level: number;
}

/**
 * @public
 */
export interface RowDblClickEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly event: TEvent;
    readonly data: any;
    readonly key: any;
    readonly values: Array<any>;
    readonly columns: Array<Column>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: TElement;
}

/**
 * @public
 */
export interface RowPreparedEvent {
    readonly component: dxTreeList;
    readonly element: TElement;
    readonly model?: any;
    readonly data: any;
    readonly key: any;
    readonly values: Array<any>;
    readonly columns: Array<Column>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: TElement;
    readonly node: Node;
    readonly level: number;
}

export interface dxTreeListOptions extends GridBaseOptions<dxTreeList> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoExpandAll?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<Column | string>;
    /**
     * @docid
     * @type_function_param1 columns:Array<dxTreeListColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeColumns?: ((columns: Array<Column>) => any);
    /**
     * @docid
     * @type Enums.TreeListDataStructure
     * @default "plain"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataStructure?: 'plain' | 'tree';
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    editing?: Editing;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandNodesOnFiltering?: boolean;
    /**
     * @docid
     * @default []
     * @fires dxTreeListOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandedRowKeys?: Array<any>;
    /**
     * @docid
     * @type Enums.TreeListFilterMode
     * @default "withAncestors"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterMode?: 'fullBranch' | 'withAncestors' | 'matchOnly';
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasItemsExpr?: string | Function;
    /**
     * @docid
     * @default "items"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemsExpr?: string | Function;
    /**
     * @docid
     * @default "id"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 value:any
     * @type_function_param1_field8 displayValue:any
     * @type_function_param1_field9 text:string
     * @type_function_param1_field10 columnIndex:number
     * @type_function_param1_field11 column:object
     * @type_function_param1_field12 rowIndex:number
     * @type_function_param1_field13 rowType:string
     * @type_function_param1_field14 cellElement:dxElement
     * @type_function_param1_field15 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellClick?: ((e: CellClickEvent) => any) | string;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 value:any
     * @type_function_param1_field8 displayValue:any
     * @type_function_param1_field9 text:string
     * @type_function_param1_field10 columnIndex:number
     * @type_function_param1_field11 column:dxTreeListColumn
     * @type_function_param1_field12 rowIndex:number
     * @type_function_param1_field13 rowType:string
     * @type_function_param1_field14 cellElement:dxElement
     * @type_function_param1_field15 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellDblClick?: ((e: CellDblClick) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 eventType:string
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 value:any
     * @type_function_param1_field8 text:string
     * @type_function_param1_field9 displayValue:any
     * @type_function_param1_field10 columnIndex:number
     * @type_function_param1_field11 rowIndex:number
     * @type_function_param1_field12 column:dxTreeListColumn
     * @type_function_param1_field13 rowType:string
     * @type_function_param1_field14 cellElement:dxElement
     * @type_function_param1_field15 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellHoverChanged?: ((e: CellHoverChangedEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 value:any
     * @type_function_param1_field7 displayValue:any
     * @type_function_param1_field8 text:string
     * @type_function_param1_field9 columnIndex:number
     * @type_function_param1_field10 column:dxTreeListColumn
     * @type_function_param1_field11 rowIndex:number
     * @type_function_param1_field12 rowType:string
     * @type_function_param1_field13 row:dxTreeListRowObject
     * @type_function_param1_field14 isSelected:boolean
     * @type_function_param1_field15 isExpanded:boolean
     * @type_function_param1_field16 isNewRow:boolean
     * @type_function_param1_field17 cellElement:dxElement
     * @type_function_param1_field18 watch:function
     * @type_function_param1_field19 oldValue:any
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellPrepared?: ((e: CellPreparedEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:Object
     * @type_function_param1_field4 items:Array<Object>
     * @type_function_param1_field5 target:string
     * @type_function_param1_field6 targetElement:dxElement
     * @type_function_param1_field7 columnIndex:number
     * @type_function_param1_field8 column:dxTreeListColumn
     * @type_function_param1_field9 rowIndex:number
     * @type_function_param1_field10 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 cancel:boolean
     * @type_function_param1_field7 column:object
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditingStart?: ((e: EditingStartEvent) => any);
    /**
     * @docid
     * @type_function_param1 options:object
     * @type_function_param1_field4 parentType:string
     * @type_function_param1_field5 value:any
     * @type_function_param1_field6 setValue(newValue, newText):any
     * @type_function_param1_field7 updateValueTimeout:number
     * @type_function_param1_field8 width:number
     * @type_function_param1_field9 disabled:boolean
     * @type_function_param1_field10 rtlEnabled:boolean
     * @type_function_param1_field11 editorElement:dxElement
     * @type_function_param1_field12 readOnly:boolean
     * @type_function_param1_field13 dataField:string
     * @type_function_param1_field14 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorPrepared?: ((options: EditorPreparedEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 parentType:string
     * @type_function_param1_field5 value:any
     * @type_function_param1_field6 setValue(newValue, newText):any
     * @type_function_param1_field7 updateValueTimeout:number
     * @type_function_param1_field8 width:number
     * @type_function_param1_field9 disabled:boolean
     * @type_function_param1_field10 rtlEnabled:boolean
     * @type_function_param1_field11 cancel:boolean
     * @type_function_param1_field12 editorElement:dxElement
     * @type_function_param1_field13 readOnly:boolean
     * @type_function_param1_field14 editorName:string
     * @type_function_param1_field15 editorOptions:object
     * @type_function_param1_field16 dataField:string
     * @type_function_param1_field17 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorPreparing?: ((e: EditorPreparingEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 cellElement:dxElement
     * @type_function_param1_field5 columnIndex:number
     * @type_function_param1_field6 rowIndex:number
     * @type_function_param1_field7 row:dxTreeListRowObject
     * @type_function_param1_field8 column:dxTreeListColumn
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 cellElement:dxElement
     * @type_function_param1_field5 prevColumnIndex:number
     * @type_function_param1_field6 prevRowIndex:number
     * @type_function_param1_field7 newColumnIndex:number
     * @type_function_param1_field8 newRowIndex:number
     * @type_function_param1_field9 event:event
     * @type_function_param1_field10 rows:Array<dxTreeListRowObject>
     * @type_function_param1_field11 columns:Array<dxTreeListColumn>
     * @type_function_param1_field12 cancel:boolean
     * @type_function_param1_field13 isHighlighted:boolean
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 rowElement:dxElement
     * @type_function_param1_field5 rowIndex:number
     * @type_function_param1_field6 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 rowElement:dxElement
     * @type_function_param1_field5 prevRowIndex:number
     * @type_function_param1_field6 newRowIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 rows:Array<dxTreeListRowObject>
     * @type_function_param1_field9 cancel:boolean
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 root:dxTreeListNode
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onNodesInitialized?: ((e: NodesInitializedEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 values:Array<any>
     * @type_function_param1_field8 columns:Array<Object>
     * @type_function_param1_field9 rowIndex:number
     * @type_function_param1_field10 rowType:string
     * @type_function_param1_field11 isSelected:boolean
     * @type_function_param1_field12 isExpanded:boolean
     * @type_function_param1_field13 isNewRow:boolean
     * @type_function_param1_field14 rowElement:dxElement
     * @type_function_param1_field15 handled:boolean
     * @type_function_param1_field16 node:dxTreeListNode
     * @type_function_param1_field17 level:number
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowClick?: ((e: RowClickEvent) => any) | string;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 data:object
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 values:Array<any>
     * @type_function_param1_field8 columns:Array<dxTreeListColumn>
     * @type_function_param1_field9 rowIndex:number
     * @type_function_param1_field10 rowType:string
     * @type_function_param1_field11 isSelected:boolean
     * @type_function_param1_field12 isExpanded:boolean
     * @type_function_param1_field13 isNewRow:boolean
     * @type_function_param1_field14 rowElement:dxElement
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowDblClick?: ((e: RowDblClickEvent) => any);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 values:Array<any>
     * @type_function_param1_field7 columns:Array<dxTreeListColumn>
     * @type_function_param1_field8 rowIndex:number
     * @type_function_param1_field9 rowType:string
     * @type_function_param1_field10 isSelected:boolean
     * @type_function_param1_field11 isExpanded:boolean
     * @type_function_param1_field12 isNewRow:boolean
     * @type_function_param1_field13 rowElement:dxElement
     * @type_function_param1_field14 node:dxTreeListNode
     * @type_function_param1_field15 level:number
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowPrepared?: ((e: RowPreparedEvent) => any);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    paging?: Paging;
    /**
     * @docid
     * @default "parentId"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    parentIdExpr?: string | Function;
    /**
     * @docid
     * @type object|Enums.Mode
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    remoteOperations?: {
    /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      filtering?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      grouping?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      sorting?: boolean
    } | 'auto';
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rootValue?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    scrolling?: Scrolling;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     * @type object
     */
    selection?: Selection;
}

/** @deprecated Use Editing instead */
export type dxTreeListEditing = Editing;

/**
 * @public
 */
export interface Editing extends EditingBase {
    /**
     * @docid dxTreeListOptions.editing.allowAdding
     * @default false
     * @type_function_param1 options:object
     * @type_function_param1_field1 readonly component:dxTreeList
     * @type_function_param1_field2 row:dxTreeListRowObject
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowAdding?: boolean | ((options: { readonly component: dxTreeList, readonly row?: RowObject }) => boolean);
    /**
     * @docid dxTreeListOptions.editing.allowDeleting
     * @default false
     * @type_function_param1 options:object
     * @type_function_param1_field1 readonly component:dxTreeList
     * @type_function_param1_field2 row:dxTreeListRowObject
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowDeleting?: boolean | ((options: { readonly component: dxTreeList, readonly row?: RowObject }) => boolean);
    /**
     * @docid dxTreeListOptions.editing.allowUpdating
     * @default false
     * @type_function_param1 options:object
     * @type_function_param1_field1 readonly component:dxTreeList
     * @type_function_param1_field2 row:dxTreeListRowObject
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowUpdating?: boolean | ((options: { readonly component: dxTreeList, readonly row?: RowObject }) => boolean);
    /**
     * @docid dxTreeListOptions.editing.texts
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    texts?: EditingTexts;
}

/** @deprecated Use EditingTexts instead */
export type dxTreeListEditingTexts = EditingTexts;

/**
 * @public
 */
export interface EditingTexts extends EditingTextsBase {
    /**
     * @docid dxTreeListOptions.editing.texts.addRowToNode
     * @default "Add"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRowToNode?: string;
}

/** @deprecated Use Paging instead */
export type dxTreeListPaging = Paging;

/**
 * @public
 */
export interface Paging extends PagingBase {
    /**
     * @docid dxTreeListOptions.paging.enabled
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    enabled?: boolean;
}

/** @deprecated Use Scrolling instead */
export type dxTreeListScrolling = Scrolling;

/**
 * @public
 */
export interface Scrolling extends ScrollingBase {
    /**
     * @docid dxTreeListOptions.scrolling.mode
     * @type Enums.TreeListScrollingMode
     * @default "virtual"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mode?: 'standard' | 'virtual';
}

/** @deprecated Use Selection instead */
export type dxTreeListSelection = Selection;

/**
 * @public
 */
export interface Selection extends SelectionBase {
    /**
     * @docid dxTreeListOptions.selection.recursive
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    recursive?: boolean;
}
/**
 * @docid
 * @inherits GridBase
 * @module ui/tree_list
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTreeList extends Widget implements GridBase {
    constructor(element: TElement, options?: dxTreeListOptions)
    /**
     * @docid
     * @publicName addColumn(columnOptions)
     * @param1 columnOptions:object|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addColumn(columnOptions: any | string): void;
    /**
     * @docid
     * @publicName addRow()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRow(): TPromise<void>;
    /**
     * @docid
     * @publicName addRow(parentId)
     * @param1 parentId:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRow(parentId: any): TPromise<void>;
    /**
     * @docid
     * @publicName collapseRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseRow(key: any): TPromise<void>;
    /**
     * @docid
     * @publicName expandRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandRow(key: any): TPromise<void>;
    /**
     * @docid
     * @publicName forEachNode(callback)
     * @param1 callback:function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    forEachNode(callback: Function): void;
    /**
     * @docid
     * @publicName forEachNode(nodes, callback)
     * @param1 nodes:Array<dxTreeListNode>
     * @param2 callback:function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    forEachNode(nodes: Array<Node>, callback: Function): void;
    /**
     * @docid
     * @publicName getNodeByKey(key)
     * @param1 key:object|string|number
     * @return dxTreeListNode
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getNodeByKey(key: any | string | number): Node;
    /**
     * @docid
     * @publicName getRootNode()
     * @return dxTreeListNode
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getRootNode(): Node;
    /**
     * @docid
     * @publicName getSelectedRowKeys()
     * @return Array<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedRowKeys(): Array<any>;
    /**
     * @docid
     * @publicName getSelectedRowKeys(mode)
     * @param1 mode:string
     * @return Array<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedRowKeys(mode: string): Array<any>;
    /**
     * @docid
     * @publicName getSelectedRowsData()
     * @return Array<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedRowsData(): Array<any>;
    /**
     * @docid
     * @publicName getSelectedRowsData(mode)
     * @param1 mode:string
     * @return Array<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedRowsData(mode: string): Array<any>;
    /**
     * @docid
     * @publicName getVisibleColumns()
     * @return Array<dxTreeListColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleColumns(): Array<Column>;
    /**
     * @docid
     * @publicName getVisibleColumns(headerLevel)
     * @param1 headerLevel:number
     * @return Array<dxTreeListColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleColumns(headerLevel: number): Array<Column>;
    /**
     * @docid
     * @publicName getVisibleRows()
     * @return Array<dxTreeListRowObject>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleRows(): Array<RowObject>;
    /**
     * @docid
     * @publicName isRowExpanded(key)
     * @param1 key:any
     * @return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isRowExpanded(key: any): boolean;
    /**
     * @docid
     * @publicName loadDescendants()
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loadDescendants(): TPromise<void>;
    /**
     * @docid
     * @publicName loadDescendants(keys)
     * @param1 keys:Array<any>
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loadDescendants(keys: Array<any>): TPromise<void>;
    /**
     * @docid
     * @publicName loadDescendants(keys, childrenOnly)
     * @param1 keys:Array<any>
     * @param2 childrenOnly:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loadDescendants(keys: Array<any>, childrenOnly: boolean): TPromise<void>;

    beginCustomLoading(messageText: string): void;
    byKey(key: any | string | number): TPromise<any>;
    cancelEditData(): void;
    cellValue(rowIndex: number, dataField: string): any;
    cellValue(rowIndex: number, dataField: string, value: any): void;
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    clearFilter(): void;
    clearFilter(filterName: string): void;
    clearSelection(): void;
    clearSorting(): void;
    closeEditCell(): void;
    collapseAdaptiveDetailRow(): void;
    columnCount(): number;
    columnOption(id: number | string): any;
    columnOption(id: number | string, optionName: string): any;
    columnOption(id: number | string, optionName: string, optionValue: any): void;
    columnOption(id: number | string, options: any): void;
    deleteColumn(id: number | string): void;
    deleteRow(rowIndex: number): void;
    deselectAll(): TPromise<void>;
    deselectRows(keys: Array<any>): TPromise<any>;
    editCell(rowIndex: number, dataField: string): void;
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    editRow(rowIndex: number): void;
    endCustomLoading(): void;
    expandAdaptiveDetailRow(key: any): void;
    filter(): any;
    filter(filterExpr: any): void;
    focus(): void;
    focus(element: TElement): void;
    getCellElement(rowIndex: number, dataField: string): TElement | undefined;
    getCellElement(rowIndex: number, visibleColumnIndex: number): TElement | undefined;
    getCombinedFilter(): any;
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    getKeyByRowIndex(rowIndex: number): any;
    getRowElement(rowIndex: number): TElementsArray | undefined;
    getRowIndexByKey(key: any | string | number): number;
    getScrollable(): dxScrollable;
    getVisibleColumnIndex(id: number | string): number;
    hasEditData(): boolean;
    hideColumnChooser(): void;
    isAdaptiveDetailRowExpanded(key: any): boolean;
    isRowFocused(key: any): boolean;
    isRowSelected(key: any): boolean;
    keyOf(obj: any): any;
    navigateToRow(key: any): void;
    pageCount(): number;
    pageIndex(): number;
    pageIndex(newIndex: number): TPromise<void>;
    pageSize(): number;
    pageSize(value: number): void;
    refresh(): TPromise<void>;
    refresh(changesOnly: boolean): TPromise<void>;
    repaintRows(rowIndexes: Array<number>): void;
    saveEditData(): TPromise<void>;
    searchByText(text: string): void;
    selectAll(): TPromise<void>;
    selectRows(keys: Array<any>, preserve: boolean): TPromise<any>;
    selectRowsByIndexes(indexes: Array<number>): TPromise<any>;
    showColumnChooser(): void;
    state(): any;
    state(state: any): void;
    undeleteRow(rowIndex: number): void;
    updateDimensions(): void;
}

/** @deprecated Use Column instead */
export type dxTreeListColumn = Column;

/**
 * @public
 */
export interface CellTemplateInfo {
    readonly data: any;
    readonly component: dxTreeList;
    readonly value?: any;
    readonly oldValue?: any;
    readonly displayValue?: any;
    readonly text: string;
    readonly columnIndex: number;
    readonly rowIndex: number;
    readonly column: Column;
    readonly row: RowObject;
    readonly rowType: string;
    readonly watch?: Function;
}

/**
 * @public
 */
export interface EditCellTemplateInfo {
    readonly setValue?: any;
    readonly data: any;
    readonly component: dxTreeList;
    readonly value?: any;
    readonly displayValue?: any;
    readonly text: string;
    readonly columnIndex: number;
    readonly rowIndex: number;
    readonly column: Column;
    readonly row: RowObject;
    readonly rowType: string;
    readonly watch?: Function;
}

export interface HeaderCellTemplateInfo {
    readonly component: dxTreeList;
    readonly columnIndex: number;
    readonly column: Column;
}

/**
 * @docid
 * @inherits ColumnBase
 * @type object
 * @public
 */
export interface Column extends ColumnBase {
    /**
     * @docid
     * @type Array<Enums.TreeListColumnButtonName,ColumnButton>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttons?: Array<'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | ColumnButton>;
    /**
     * @docid
     * @type_function_param1 cellElement:dxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 data:object
     * @type_function_param2_field2 readonly component:dxTreeList
     * @type_function_param2_field3 value:any
     * @type_function_param2_field4 oldValue:any
     * @type_function_param2_field5 displayValue:any
     * @type_function_param2_field6 text:string
     * @type_function_param2_field7 columnIndex:number
     * @type_function_param2_field8 rowIndex:number
     * @type_function_param2_field9 column:dxTreeListColumn
     * @type_function_param2_field10 row:dxTreeListRowObject
     * @type_function_param2_field11 rowType:string
     * @type_function_param2_field12 watch:function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellTemplate?: template | ((cellElement: TElement, cellInfo: CellTemplateInfo) => any);
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<Column | string>;
    /**
     * @docid
     * @type_function_param1 cellElement:dxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 setValue(newValue, newText):any
     * @type_function_param2_field2 data:object
     * @type_function_param2_field3 readonly component:dxTreeList
     * @type_function_param2_field4 value:any
     * @type_function_param2_field5 displayValue:any
     * @type_function_param2_field6 text:string
     * @type_function_param2_field7 columnIndex:number
     * @type_function_param2_field8 rowIndex:number
     * @type_function_param2_field9 column:dxTreeListColumn
     * @type_function_param2_field10 row:dxTreeListRowObject
     * @type_function_param2_field11 rowType:string
     * @type_function_param2_field12 watch:function
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editCellTemplate?: template | ((cellElement: TElement, cellInfo: EditCellTemplateInfo) => any);
    /**
     * @docid
     * @type_function_param1 columnHeader:dxElement
     * @type_function_param2 headerInfo:object
     * @type_function_param2_field1 readonly component:dxTreeList
     * @type_function_param2_field2 columnIndex:number
     * @type_function_param2_field3 column:dxTreeListColumn
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerCellTemplate?: template | ((columnHeader: TElement, headerInfo: HeaderCellTemplateInfo) => any);
    /**
     * @docid
     * @publicName type
     * @type Enums.TreeListCommandColumnType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'adaptive' | 'buttons';
}

/** @deprecated Use ColumnButton instead */
export type dxTreeListColumnButton = ColumnButton;

/**
 * @docid
 * @inherits ColumnButtonBase
 * @type object
 * @public
 */
export interface ColumnButton extends ColumnButtonBase {
    /**
     * @docid
     * @type Enums.TreeListColumnButtonName|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 readonly component:dxTreeList
     * @type_function_param1_field2 readonly element:dxElement
     * @type_function_param1_field3 model:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 row:dxTreeListRowObject
     * @type_function_param1_field6 column:dxTreeListColumn
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: { readonly component: dxTreeList, readonly element: TElement, readonly model?: any, readonly event: TEvent, row?: RowObject, readonly column: Column }) => any) | string;
    /**
     * @docid
     * @type_function_param1 cellElement:dxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 readonly component:dxTreeList
     * @type_function_param2_field2 data:object
     * @type_function_param2_field3 key:any
     * @type_function_param2_field4 columnIndex:number
     * @type_function_param2_field5 column:dxTreeListColumn
     * @type_function_param2_field6 rowIndex:number
     * @type_function_param2_field7 rowType:string
     * @type_function_param2_field8 row:dxTreeListRowObject
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((cellElement: TElement, cellInfo: { readonly component: dxTreeList, readonly data: any, readonly key: any, readonly columnIndex: number, readonly column: Column, readonly rowIndex: number, readonly rowType: string, row?: RowObject }) => string | TElement);
    /**
     * @docid
     * @default true
     * @type_function_param1 options:object
     * @type_function_param1_field1 readonly component:dxTreeList
     * @type_function_param1_field2 row:dxTreeListRowObject
     * @type_function_param1_field3 column:dxTreeListColumn
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean | ((options: { readonly component: dxTreeList, row?: RowObject, readonly column: Column }) => boolean);
}

/** @deprecated Use Node instead */
export type dxTreeListNode = Node;

/**
 * @docid
 * @type object
 * @public
 */
export interface Node {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    children?: Array<Node>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    data?: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasChildren?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    key: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    level: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    parent?: Node;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}

/** @deprecated Use RowObject instead */
export type dxTreeListRowObject = RowObject;

/**
 * @docid
 * @type object
 * @public
 */
export interface RowObject {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly isEditing?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
     readonly isExpanded?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
     readonly isNewRow?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly isSelected?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly key: any;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly level: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly node: Node;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly rowIndex: number;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly rowType: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
     readonly values: Array<any>;
}

export type Options = dxTreeListOptions;

/** @deprecated use Options instead */
export type IOptions = dxTreeListOptions;
