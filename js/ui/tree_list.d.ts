import {
    UserDefinedElement,
    DxElement,
    UserDefinedElementsArray
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    DxPromise
} from '../core/utils/deferred';

import DataSource from '../data/data_source';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
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
    SelectionBase,
    AdaptiveDetailRowPreparingInfo,
    DataErrorOccurredInfo,
    DataChangeInfo,
    DragStartEventInfo,
    RowDraggingEventInfo,
    DragDropInfo,
    DragReorderInfo,
    KeyDownInfo,
    NewRowInfo,
    RowInsertedInfo,
    RowInsertingInfo,
    RowKeyInfo,
    RowRemovedInfo,
    RowRemovingInfo,
    RowUpdatedInfo,
    RowUpdatingInfo,
    RowValidatingInfo,
    SavingInfo,
    SelectionChangedInfo,
    ToolbarPreparingInfo,
    RowDraggingTemplateDataModel
} from './data_grid';

import dxScrollable from './scroll_view/ui.scrollable';

import Widget from './widget/ui.widget';

interface CellInfo {
    readonly data: any;
    readonly key: any;
    readonly value?: any;
    readonly displayValue?: any;
    readonly text: string;
    readonly columnIndex: number;
    readonly column: Column;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly cellElement: DxElement;
    readonly row: RowObject;
}

/** @public */
export type AdaptiveDetailRowPreparingEvent = EventInfo<dxTreeList> & AdaptiveDetailRowPreparingInfo;

/** @public */
export type CellClickEvent = NativeEventInfo<dxTreeList> & CellInfo;

/** @public */
export type CellDblClickEvent = NativeEventInfo<dxTreeList> & CellInfo;

/** @public */
export type CellHoverChangedEvent = EventInfo<dxTreeList> & CellInfo & {
    readonly eventType: string;
}

/** @public */
export type CellPreparedEvent = EventInfo<dxTreeList> & CellInfo & {
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly watch?: Function;
    readonly oldValue?: any;
}

/** @public */
export type ContentReadyEvent = EventInfo<dxTreeList>;

/** @public */
export type ContextMenuPreparingEvent = EventInfo<dxTreeList> & {
    items?: Array<any>;
    readonly target: string;
    readonly targetElement: DxElement;
    readonly columnIndex: number;
    readonly column?: Column;
    readonly rowIndex: number;
    readonly row?: RowObject;
}

/** @public */
export type DataErrorOccurredEvent = EventInfo<dxTreeList> & DataErrorOccurredInfo;

/** @public */
export type DisposingEvent = EventInfo<dxTreeList>;

/** @public */
export type EditCanceledEvent = EventInfo<dxTreeList> & DataChangeInfo;

/** @public */
export type EditCancelingEvent = Cancelable & EventInfo<dxTreeList> & DataChangeInfo;

/** @public */
export type EditingStartEvent = Cancelable & EventInfo<dxTreeList> & {
    readonly data: any;
    readonly key: any;
    readonly column: any;
}

/** @public */
export type EditorPreparedEvent = EventInfo<dxTreeList> & {
    readonly parentType: string;
    readonly value?: any;
    readonly setValue?: any;
    readonly updateValueTimeout?: number;
    readonly width?: number;
    readonly disabled: boolean;
    readonly rtlEnabled: boolean;
    readonly editorElement: DxElement;
    readonly readOnly: boolean;
    readonly dataField?: string;
    readonly row?: RowObject;
}

/** @public */
export type EditorPreparingEvent = Cancelable & EventInfo<dxTreeList> & {
    readonly parentType: string;
    readonly value?: any;
    readonly setValue?: any;
    updateValueTimeout?: number;
    readonly width?: number;
    readonly disabled: boolean;
    readonly rtlEnabled: boolean;
    readonly editorElement: DxElement;
    readonly readOnly: boolean;
    editorName: string;
    editorOptions: any;
    readonly dataField?: string;
    readonly row?: RowObject;
}

/** @public */
export type FocusedCellChangedEvent = EventInfo<dxTreeList> & {
    readonly cellElement: DxElement;
    readonly columnIndex: number;
    readonly rowIndex: number;
    readonly row: RowObject;
    readonly column: Column;
}

/** @public */
export type FocusedCellChangingEvent = Cancelable & NativeEventInfo<dxTreeList> & {
    readonly cellElement: DxElement;
    readonly prevColumnIndex: number;
    readonly prevRowIndex: number;
    newColumnIndex: number;
    newRowIndex: number;
    readonly rows: Array<RowObject>;
    readonly columns: Array<Column>;
    isHighlighted: boolean;
}

/** @public */
export type FocusedRowChangedEvent = EventInfo<dxTreeList> & {
    readonly rowElement: DxElement;
    readonly rowIndex: number;
    readonly row: RowObject;
}

/** @public */
export type FocusedRowChangingEvent = NativeEventInfo<dxTreeList> & {
    readonly rowElement: DxElement;
    readonly prevRowIndex: number;
    newRowIndex: number;
    readonly rows: Array<RowObject>;
}

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTreeList>;

/** @public */
export type InitNewRowEvent = EventInfo<dxTreeList> & NewRowInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxTreeList> & KeyDownInfo;

/** @public */
export type NodesInitializedEvent = EventInfo<dxTreeList> & {
    readonly root: Node;
}

/** @public */
export type OptionChangedEvent = EventInfo<dxTreeList> & ChangedOptionInfo;

/** @public */
export type RowClickEvent = NativeEventInfo<dxTreeList> & {
    readonly data: any;
    readonly key: any;
    readonly values: Array<any>;
    readonly columns: Array<any>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: DxElement;
    readonly handled: boolean;
    readonly node: Node;
    readonly level: number;
}

/** @public */
export type RowCollapsedEvent = EventInfo<dxTreeList> & RowKeyInfo;

/** @public */
export type RowCollapsingEvent = Cancelable & EventInfo<dxTreeList> & RowKeyInfo;

/** @public */
export type RowDblClickEvent = NativeEventInfo<dxTreeList> & {
    readonly data: any;
    readonly key: any;
    readonly values: Array<any>;
    readonly columns: Array<Column>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: DxElement;
}

/** @public */
export type RowExpandedEvent = EventInfo<dxTreeList> & RowKeyInfo;

/** @public */
export type RowExpandingEvent = Cancelable & EventInfo<dxTreeList> & RowKeyInfo;

/** @public */
export type RowInsertedEvent = EventInfo<dxTreeList> & RowInsertedInfo;

/** @public */
export type RowInsertingEvent = EventInfo<dxTreeList> & RowInsertingInfo;

/** @public */
export type RowPreparedEvent = EventInfo<dxTreeList> & {
    readonly data: any;
    readonly key: any;
    readonly values: Array<any>;
    readonly columns: Array<Column>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: DxElement;
    readonly node: Node;
    readonly level: number;
}

/** @public */
export type RowRemovedEvent = EventInfo<dxTreeList> & RowRemovedInfo;

/** @public */
export type RowRemovingEvent = EventInfo<dxTreeList> & RowRemovingInfo;

/** @public */
export type RowUpdatedEvent = EventInfo<dxTreeList> & RowUpdatedInfo;

/** @public */
export type RowUpdatingEvent = EventInfo<dxTreeList> & RowUpdatingInfo;

/** @public */
export type RowValidatingEvent = EventInfo<dxTreeList> & RowValidatingInfo;

/** @public */
export type SavedEvent = EventInfo<dxTreeList> & DataChangeInfo;

/** @public */
export type SavingEvent = EventInfo<dxTreeList> & SavingInfo;

/** @public */
export type SelectionChangedEvent = EventInfo<dxTreeList> & SelectionChangedInfo;

/** @public */
export type ToolbarPreparingEvent = EventInfo<dxTreeList> & ToolbarPreparingInfo;


/** @public */
export type RowDraggingAddEvent = RowDraggingEventInfo<dxTreeList> & DragDropInfo;

/** @public */
export type RowDraggingChangeEvent = Cancelable & RowDraggingEventInfo<dxTreeList> & DragDropInfo;

/** @public */
export type RowDraggingEndEvent = Cancelable & RowDraggingEventInfo<dxTreeList> & DragDropInfo;

/** @public */
export type RowDraggingMoveEvent = Cancelable & RowDraggingEventInfo<dxTreeList> & DragDropInfo;

/** @public */
export type RowDraggingStartEvent = Cancelable & DragStartEventInfo<dxTreeList>;

/** @public */
export type RowDraggingRemoveEvent = RowDraggingEventInfo<dxTreeList>;

/** @public */
export type RowDraggingReorderEvent = RowDraggingEventInfo<dxTreeList> & DragReorderInfo;


/** @public */
export type ColumnButtonClickEvent = NativeEventInfo<dxTreeList> & {
    row?: RowObject;
    column?: Column;
}


/** @public */
export type ColumnButtonTemplateData = {
    readonly component: dxTreeList;
    readonly data: any;
    readonly key: any;
    readonly columnIndex: number;
    readonly column: Column;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly row: RowObject;
}

/** @public */
export type ColumnCellTemplateData = {
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

/** @public */
export type ColumnEditCellTemplateData = {
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

export type ColumnHeaderCellTemplateData = {
    readonly component: dxTreeList;
    readonly columnIndex: number;
    readonly column: Column;
}

/** @public */
export type RowDraggingTemplateData = RowDraggingTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
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
     * @type Array<dxTreeListColumn|string>
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
    customizeColumns?: ((columns: Array<Column>) => void);
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
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field14 cellElement:DxElement
     * @type_function_param1_field15 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellClick?: ((e: CellClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field14 cellElement:DxElement
     * @type_function_param1_field15 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellDblClick?: ((e: CellDblClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field14 cellElement:DxElement
     * @type_function_param1_field15 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellHoverChanged?: ((e: CellHoverChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field17 cellElement:DxElement
     * @type_function_param1_field18 watch:function
     * @type_function_param1_field19 oldValue:any
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCellPrepared?: ((e: CellPreparedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:Object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 items:Array<Object>
     * @type_function_param1_field5 target:string
     * @type_function_param1_field6 targetElement:DxElement
     * @type_function_param1_field7 columnIndex:number
     * @type_function_param1_field8 column:dxTreeListColumn
     * @type_function_param1_field9 rowIndex:number
     * @type_function_param1_field10 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 cancel:boolean
     * @type_function_param1_field7 column:object
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditingStart?: ((e: EditingStartEvent) => void);
    /**
     * @docid
     * @type_function_param1 options:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 parentType:string
     * @type_function_param1_field5 value:any
     * @type_function_param1_field6 setValue(newValue, newText):any
     * @type_function_param1_field7 updateValueTimeout:number
     * @type_function_param1_field8 width:number
     * @type_function_param1_field9 disabled:boolean
     * @type_function_param1_field10 rtlEnabled:boolean
     * @type_function_param1_field11 editorElement:DxElement
     * @type_function_param1_field12 readOnly:boolean
     * @type_function_param1_field13 dataField:string
     * @type_function_param1_field14 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorPrepared?: ((options: EditorPreparedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 parentType:string
     * @type_function_param1_field5 value:any
     * @type_function_param1_field6 setValue(newValue, newText):any
     * @type_function_param1_field7 updateValueTimeout:number
     * @type_function_param1_field8 width:number
     * @type_function_param1_field9 disabled:boolean
     * @type_function_param1_field10 rtlEnabled:boolean
     * @type_function_param1_field11 cancel:boolean
     * @type_function_param1_field12 editorElement:DxElement
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
    onEditorPreparing?: ((e: EditorPreparingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cellElement:DxElement
     * @type_function_param1_field5 columnIndex:number
     * @type_function_param1_field6 rowIndex:number
     * @type_function_param1_field7 row:dxTreeListRowObject
     * @type_function_param1_field8 column:dxTreeListColumn
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cellElement:DxElement
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
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 rowElement:DxElement
     * @type_function_param1_field5 rowIndex:number
     * @type_function_param1_field6 row:dxTreeListRowObject
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 rowElement:DxElement
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
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 root:dxTreeListNode
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onNodesInitialized?: ((e: NodesInitializedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field14 rowElement:DxElement
     * @type_function_param1_field15 handled:boolean
     * @type_function_param1_field16 node:dxTreeListNode
     * @type_function_param1_field17 level:number
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowClick?: ((e: RowClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
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
     * @type_function_param1_field14 rowElement:DxElement
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowDblClick?: ((e: RowDblClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 values:Array<any>
     * @type_function_param1_field7 columns:Array<dxTreeListColumn>
     * @type_function_param1_field8 rowIndex:number
     * @type_function_param1_field9 rowType:string
     * @type_function_param1_field10 isSelected:boolean
     * @type_function_param1_field11 isExpanded:boolean
     * @type_function_param1_field12 isNewRow:boolean
     * @type_function_param1_field13 rowElement:DxElement
     * @type_function_param1_field14 node:dxTreeListNode
     * @type_function_param1_field15 level:number
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onRowPrepared?: ((e: RowPreparedEvent) => void);
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

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxTreeListEditing = Editing;

export interface Editing extends EditingBase {
    /**
     * @docid dxTreeListOptions.editing.allowAdding
     * @default false
     * @type_function_param1 options:object
     * @type_function_param1_field1 component:dxTreeList
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
     * @type_function_param1_field1 component:dxTreeList
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
     * @type_function_param1_field1 component:dxTreeList
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

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxTreeListEditingTexts = EditingTexts;

export interface EditingTexts extends EditingTextsBase {
    /**
     * @docid dxTreeListOptions.editing.texts.addRowToNode
     * @default "Add"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRowToNode?: string;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxTreeListPaging = Paging;

export interface Paging extends PagingBase {
    /**
     * @docid dxTreeListOptions.paging.enabled
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    enabled?: boolean;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxTreeListScrolling = Scrolling;

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

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxTreeListSelection = Selection;

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
 * @namespace DevExpress.ui
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTreeList extends Widget implements GridBase {
    constructor(element: UserDefinedElement, options?: dxTreeListOptions)
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
    addRow(): DxPromise<void>;
    /**
     * @docid
     * @publicName addRow(parentId)
     * @param1 parentId:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    addRow(parentId: any): DxPromise<void>;
    /**
     * @docid
     * @publicName collapseRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    collapseRow(key: any): DxPromise<void>;
    /**
     * @docid
     * @publicName expandRow(key)
     * @param1 key:any
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    expandRow(key: any): DxPromise<void>;
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
    loadDescendants(): DxPromise<void>;
    /**
     * @docid
     * @publicName loadDescendants(keys)
     * @param1 keys:Array<any>
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loadDescendants(keys: Array<any>): DxPromise<void>;
    /**
     * @docid
     * @publicName loadDescendants(keys, childrenOnly)
     * @param1 keys:Array<any>
     * @param2 childrenOnly:boolean
     * @return Promise<void>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    loadDescendants(keys: Array<any>, childrenOnly: boolean): DxPromise<void>;

    beginCustomLoading(messageText: string): void;
    byKey(key: any | string | number): DxPromise<any>;
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
    deselectAll(): DxPromise<void>;
    deselectRows(keys: Array<any>): DxPromise<any>;
    editCell(rowIndex: number, dataField: string): void;
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    editRow(rowIndex: number): void;
    endCustomLoading(): void;
    expandAdaptiveDetailRow(key: any): void;
    filter(): any;
    filter(filterExpr: any): void;
    focus(): void;
    focus(element: UserDefinedElement): void;
    getCellElement(rowIndex: number, dataField: string): DxElement | undefined;
    getCellElement(rowIndex: number, visibleColumnIndex: number): DxElement | undefined;
    getCombinedFilter(): any;
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource;
    getKeyByRowIndex(rowIndex: number): any;
    getRowElement(rowIndex: number): UserDefinedElementsArray | undefined;
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
    pageIndex(newIndex: number): DxPromise<void>;
    pageSize(): number;
    pageSize(value: number): void;
    refresh(): DxPromise<void>;
    refresh(changesOnly: boolean): DxPromise<void>;
    repaintRows(rowIndexes: Array<number>): void;
    saveEditData(): DxPromise<void>;
    searchByText(text: string): void;
    selectAll(): DxPromise<void>;
    selectRows(keys: Array<any>, preserve: boolean): DxPromise<any>;
    selectRowsByIndexes(indexes: Array<number>): DxPromise<any>;
    showColumnChooser(): void;
    state(): any;
    state(state: any): void;
    undeleteRow(rowIndex: number): void;
    updateDimensions(): void;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxTreeListColumn = Column;

/**
 * @docid dxTreeListColumn
 * @inherits GridBaseColumn
 * @type object
 */
export interface Column extends ColumnBase {
    /**
     * @docid dxTreeListColumn.buttons
     * @type Array<Enums.TreeListColumnButtonName,dxTreeListColumnButton>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    buttons?: Array<'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | ColumnButton>;
    /**
     * @docid dxTreeListColumn.cellTemplate
     * @type_function_param1 cellElement:DxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 data:object
     * @type_function_param2_field2 component:dxTreeList
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
    cellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnCellTemplateData) => any);
    /**
     * @docid dxTreeListColumn.columns
     * @type Array<dxTreeListColumn|string>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<Column | string>;
    /**
     * @docid dxTreeListColumn.editCellTemplate
     * @type_function_param1 cellElement:DxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 setValue(newValue, newText):any
     * @type_function_param2_field2 data:object
     * @type_function_param2_field3 component:dxTreeList
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
    editCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnEditCellTemplateData) => any);
    /**
     * @docid dxTreeListColumn.headerCellTemplate
     * @type_function_param1 columnHeader:DxElement
     * @type_function_param2 headerInfo:object
     * @type_function_param2_field1 component:dxTreeList
     * @type_function_param2_field2 columnIndex:number
     * @type_function_param2_field3 column:dxTreeListColumn
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    headerCellTemplate?: template | ((columnHeader: DxElement, headerInfo: ColumnHeaderCellTemplateData) => any);
    /**
     * @docid dxTreeListColumn.type
     * @publicName type
     * @type Enums.TreeListCommandColumnType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'adaptive' | 'buttons';
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxTreeListColumnButton = ColumnButton;


/**
 * @docid dxTreeListColumnButton
 * @inherits GridBaseColumnButton
 * @type object
 */
export interface ColumnButton extends ColumnButtonBase {
    /**
     * @docid dxTreeListColumnButton.name
     * @type Enums.TreeListColumnButtonName|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete' | string;
    /**
     * @docid dxTreeListColumnButton.onClick
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 row:dxTreeListRowObject
     * @type_function_param1_field6 column:dxTreeListColumn
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onClick?: ((e: ColumnButtonClickEvent) => void);
    /**
     * @docid dxTreeListColumnButton.template
     * @type_function_param1 cellElement:DxElement
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field1 component:dxTreeList
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
    template?: template | ((cellElement: DxElement, cellInfo: ColumnButtonTemplateData) => string | UserDefinedElement);
    /**
     * @docid dxTreeListColumnButton.visible
     * @default true
     * @type_function_param1 options:object
     * @type_function_param1_field1 component:dxTreeList
     * @type_function_param1_field2 row:dxTreeListRowObject
     * @type_function_param1_field3 column:dxTreeListColumn
     * @type_function_return Boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean | ((options: { readonly component: dxTreeList, row?: RowObject, readonly column: Column }) => boolean);
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxTreeListNode = Node;

/**
 * @docid dxTreeListNode
 * @type object
 */
export interface Node {
    /**
     * @docid dxTreeListNode.children
     * @type  Array<dxTreeListNode>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    children?: Array<Node>;
    /**
     * @docid dxTreeListNode.data
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    data?: any;
    /**
     * @docid dxTreeListNode.hasChildren
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasChildren?: boolean;
    /**
     * @docid dxTreeListNode.key
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    key: any;
    /**
     * @docid dxTreeListNode.level
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    level: number;
    /**
     * @docid dxTreeListNode.parent
     * @type dxTreeListNode
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    parent?: Node;
    /**
     * @docid dxTreeListNode.visible
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type dxTreeListRowObject = RowObject;

/**
 * @docid dxTreeListRowObject
 * @type object
 */
export interface RowObject {
    /**
     * @docid dxTreeListRowObject.isEditing
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly isEditing?: boolean;
    /**
     * @docid dxTreeListRowObject.isExpanded
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly isExpanded?: boolean;
    /**
     * @docid dxTreeListRowObject.isNewRow
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly isNewRow?: boolean;
    /**
     * @docid dxTreeListRowObject.isSelected
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly isSelected?: boolean;
    /**
     * @docid dxTreeListRowObject.key
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly key: any;
    /**
     * @docid dxTreeListRowObject.level
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly level: number;
    /**
     * @docid dxTreeListRowObject.node
     * @type dxTreeListNode
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly node: Node;
    /**
     * @docid dxTreeListRowObject.rowIndex
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly rowIndex: number;
    /**
     * @docid dxTreeListRowObject.rowType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly rowType: string;
    /**
     * @docid dxTreeListRowObject.values
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readonly values: Array<any>;
}

/** @public */
export type Properties = dxTreeListOptions;

/** @deprecated use Properties instead */
export type Options = dxTreeListOptions;

/** @deprecated use Properties instead */
export type IOptions = dxTreeListOptions;
