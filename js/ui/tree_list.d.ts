import {
    UserDefinedElement,
    DxElement,
    UserDefinedElementsArray,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    DxPromise,
} from '../core/utils/deferred';

import DataSource from '../data/data_source';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    DataStructure,
    Mode,
    ScrollMode,
    SingleMultipleOrNone,
    ToolbarItemLocation,
} from '../common';

import {
    AdaptiveDetailRowPreparingInfo,
    ColumnBase,
    ColumnButtonBase,
    DataChangeInfo,
    DataErrorOccurredInfo,
    DragDropInfo,
    DragReorderInfo,
    DragStartEventInfo,
    EditingBase,
    EditingTextsBase,
    GridBase,
    GridBaseOptions,
    KeyDownInfo,
    NewRowInfo,
    PagingBase,
    ReducedNativeEventInfo,
    RowDraggingEventInfo,
    RowDraggingTemplateData,
    RowInsertedInfo,
    RowInsertingInfo,
    RowKeyInfo,
    RowRemovedInfo,
    RowRemovingInfo,
    RowUpdatedInfo,
    RowUpdatingInfo,
    RowValidatingInfo,
    SavingInfo,
    ScrollingBase,
    SelectionBase,
    SelectionChangedInfo,
    ToolbarPreparingInfo,
} from '../common/grids';

import { dxToolbarItem } from './toolbar';

import dxScrollable from './scroll_view/ui.scrollable';

import Widget from './widget/ui.widget';

interface CellInfo<TRowData = any, TKey = any> {
    readonly data: TRowData;
    readonly key: TKey;
    readonly value?: any;
    readonly displayValue?: any;
    readonly text: string;
    readonly columnIndex: number;
    readonly column: Column<TRowData, TKey>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly cellElement: DxElement;
    readonly row: Row<TRowData, TKey>;
}

export {
    SearchMode,
} from '../common';

export {
    ApplyFilterMode,
    ColumnChooser,
    ColumnChooserMode,
    ColumnChooserSearchConfig,
    ColumnChooserSelectionConfig,
    ColumnCustomizeTextArg,
    ColumnFixing,
    ColumnFixingTexts,
    ColumnHeaderFilter,
    ColumnHeaderFilterSearchConfig,
    ColumnLookup,
    ColumnResizeMode,
    DataChange,
    DataChangeType,
    DataRenderMode,
    EnterKeyAction,
    EnterKeyDirection,
    FilterOperation,
    FilterPanelTexts,
    FilterRow,
    FilterRowOperationDescriptions,
    FilterType,
    GridsEditMode,
    GridsEditRefreshMode,
    GroupExpandMode,
    HeaderFilter,
    HeaderFilterSearchConfig,
    HeaderFilterGroupInterval,
    HeaderFilterTexts,
    KeyboardNavigation,
    LoadPanel,
    NewRowPosition,
    Pager,
    PagerDisplayMode,
    PagerPageSize,
    RowDraggingTemplateData,
    SearchPanel,
    SelectedFilterOperation,
    SelectionColumnDisplayMode,
    Sorting,
    StartEditAction,
    StateStoreType,
    StateStoring,
    SummaryType,
} from '../common/grids';

export {
    DataStructure,
    Mode,
    ScrollMode,
    SingleMultipleOrNone,
    ToolbarItemLocation,
};

/** @public */
export type TreeListPredefinedColumnButton = 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete';
/** @public */
export type TreeListPredefinedToolbarItem = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'revertButton' | 'saveButton' | 'searchPanel';
/** @public */
export type TreeListCommandColumnType = 'adaptive' | 'buttons' | 'drag';
/** @public */
export type TreeListFilterMode = 'fullBranch' | 'withAncestors' | 'matchOnly';

/** @public */
export type Scrollable = Omit<dxScrollable, '_templateManager' | '_cancelOptionChange' | '_getTemplate' | '_invalidate' | '_refresh' | '_notifyOptionChanged' | '_createElement'>;

/** @public */
export type AdaptiveDetailRowPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & AdaptiveDetailRowPreparingInfo;

/** @public */
export type CellClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & CellInfo<TRowData, TKey>;

/** @public */
export type CellDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & CellInfo<TRowData, TKey>;

/** @public */
export type CellHoverChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & CellInfo<TRowData, TKey> & {
    readonly eventType: string;
};

/** @public */
export type CellPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & CellInfo<TRowData, TKey> & {
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly watch?: Function;
    readonly oldValue?: any;
};

/** @public */
export type ContentReadyEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>>;

/** @public */
export type ContextMenuPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
    items?: Array<any>;
    readonly target: string;
    readonly targetElement: DxElement;
    readonly columnIndex: number;
    readonly column?: Column<TRowData, TKey>;
    readonly rowIndex: number;
    readonly row?: Row<TRowData, TKey>;
};

/** @public */
export type DataErrorOccurredEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & DataErrorOccurredInfo;

/** @public */
export type DisposingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>>;

/** @public */
export type EditCanceledEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/** @public */
export type EditCancelingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/** @public */
export type EditingStartEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & {
    readonly data: TRowData;
    readonly key: TKey;
    readonly column: Column<TRowData, TKey>;
};

/** @public */
export type EditorPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
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
    readonly row?: Row<TRowData, TKey>;
};

/** @public */
export type EditorPreparingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & {
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
    readonly row?: Row<TRowData, TKey>;
};

/** @public */
export type FocusedCellChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
    readonly cellElement: DxElement;
    readonly columnIndex: number;
    readonly rowIndex: number;
    readonly row: Row<TRowData, TKey>;
    readonly column: Column<TRowData, TKey>;
};

/** @public */
export type FocusedCellChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxTreeList<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
    readonly cellElement: DxElement;
    readonly prevColumnIndex: number;
    readonly prevRowIndex: number;
    newColumnIndex: number;
    newRowIndex: number;
    readonly rows: Array<Row<TRowData, TKey>>;
    readonly columns: Array<Column<TRowData, TKey>>;
    isHighlighted: boolean;
};

/** @public */
export type FocusedRowChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
    readonly rowElement: DxElement;
    readonly rowIndex: number;
    readonly row: Row<TRowData, TKey>;
};

/** @public */
export type FocusedRowChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxTreeList<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
    readonly rowElement: DxElement;
    readonly prevRowIndex: number;
    newRowIndex: number;
    readonly rows: Array<Row<TRowData, TKey>>;
};

/** @public */
export type InitializedEvent<TRowData = any, TKey = any> = InitializedEventInfo<dxTreeList<TRowData, TKey>>;

/** @public */
export type InitNewRowEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & NewRowInfo<TRowData>;

/** @public */
export type KeyDownEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, KeyboardEvent> & KeyDownInfo;

/** @public */
export type NodesInitializedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
    readonly root: Node<TRowData, TKey>;
};

/** @public */
export type OptionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & ChangedOptionInfo;

/** @public */
export type RowClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & {
    readonly data: TRowData;
    readonly key: TKey;
    readonly values: Array<any>;
    readonly columns: Array<Column<TRowData, TKey>>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: DxElement;
    readonly handled: boolean;
    readonly node: Node<TRowData, TKey>;
    readonly level: number;
};

/** @public */
export type RowCollapsedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowKeyInfo<TKey>;

/** @public */
export type RowCollapsingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & RowKeyInfo<TKey>;

/** @public */
export type RowDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & {
    readonly data: TRowData;
    readonly key: TKey;
    readonly values: Array<any>;
    readonly columns: Array<Column<TRowData, TKey>>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: DxElement;
};

/** @public */
export type RowExpandedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowKeyInfo<TKey>;

/** @public */
export type RowExpandingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & RowKeyInfo<TKey>;

/** @public */
export type RowInsertedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowInsertedInfo<TRowData, TKey>;

/** @public */
export type RowInsertingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowInsertingInfo<TRowData>;

/** @public */
export type RowPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
    readonly data: TRowData;
    readonly key: TKey;
    readonly values: Array<any>;
    readonly columns: Array<Column<TRowData, TKey>>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly isSelected?: boolean;
    readonly isExpanded?: boolean;
    readonly isNewRow?: boolean;
    readonly rowElement: DxElement;
    readonly node: Node<TRowData, TKey>;
    readonly level: number;
};

/** @public */
export type RowRemovedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowRemovedInfo<TRowData, TKey>;

/** @public */
export type RowRemovingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowRemovingInfo<TRowData, TKey>;

/** @public */
export type RowUpdatedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowUpdatedInfo<TRowData, TKey>;

/** @public */
export type RowUpdatingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowUpdatingInfo<TRowData, TKey>;

/** @public */
export type RowValidatingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowValidatingInfo<TRowData, TKey>;

/** @public */
export type SavedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/** @public */
export type SavingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & SavingInfo<TRowData, TKey>;

/** @public */
export type SelectionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & SelectionChangedInfo<TRowData, TKey>;

/** @public */
export type ToolbarPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & ToolbarPreparingInfo;

/** @public */
export type RowDraggingAddEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

/** @public */
export type RowDraggingChangeEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

/** @public */
export type RowDraggingEndEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

/** @public */
export type RowDraggingMoveEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

/** @public */
export type RowDraggingStartEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & DragStartEventInfo<TRowData>;

/** @public */
export type RowDraggingRemoveEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData>;

/** @public */
export type RowDraggingReorderEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragReorderInfo;

/** @public */
export type ColumnButtonClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & {
    row?: Row<TRowData, TKey>;
    column?: Column<TRowData, TKey>;
};

/** @public */
export type ColumnButtonTemplateData<TRowData = any, TKey = any> = {
    readonly component: dxTreeList<TRowData, TKey>;
    readonly data: TRowData;
    readonly key: TKey;
    readonly columnIndex: number;
    readonly column: Column<TRowData, TKey>;
    readonly rowIndex: number;
    readonly rowType: string;
    readonly row: Row<TRowData, TKey>;
};

/** @public */
export type ColumnCellTemplateData<TRowData = any, TKey = any> = {
    readonly data: TRowData;
    readonly component: dxTreeList<TRowData, TKey>;
    readonly value?: any;
    readonly oldValue?: any;
    readonly displayValue?: any;
    readonly text: string;
    readonly columnIndex: number;
    readonly rowIndex: number;
    readonly column: Column<TRowData, TKey>;
    readonly row: Row<TRowData, TKey>;
    readonly rowType: string;
    readonly watch?: Function;
};

/** @public */
export type ColumnEditCellTemplateData<TRowData = any, TKey = any> = {
    readonly setValue?: any;
    readonly data: TRowData;
    readonly component: dxTreeList<TRowData, TKey>;
    readonly value?: any;
    readonly displayValue?: any;
    readonly text: string;
    readonly columnIndex: number;
    readonly rowIndex: number;
    readonly column: Column<TRowData, TKey>;
    readonly row: Row<TRowData, TKey>;
    readonly rowType: string;
    readonly watch?: Function;
};

export type ColumnHeaderCellTemplateData<TRowData = any, TKey = any> = {
    readonly component: dxTreeList<TRowData, TKey>;
    readonly columnIndex: number;
    readonly column: Column<TRowData, TKey>;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export type dxTreeListOptions<TRowData = any, TKey = any> = GridBaseOptions<dxTreeList<TRowData, TKey>, TRowData, TKey> & {
    /**
     * @docid
     * @default false
     * @public
     */
    autoExpandAll?: boolean;
    /**
     * @docid
     * @type Array<dxTreeListColumn|string>
     * @default undefined
     * @public
     */
    columns?: Array<Column<TRowData, TKey> | string>;
    /**
     * @docid
     * @type_function_param1 columns:Array<dxTreeListColumn>
     * @public
     */
    customizeColumns?: ((columns: Array<Column<TRowData, TKey>>) => void);
    /**
     * @docid
     * @default "plain"
     * @public
     */
    dataStructure?: DataStructure;
    /**
     * @docid
     * @public
     * @type object
     */
    editing?: Editing<TRowData, TKey>;
    /**
     * @docid
     * @default true
     * @public
     */
    expandNodesOnFiltering?: boolean;
    /**
     * @docid
     * @default []
     * @fires dxTreeListOptions.onOptionChanged
     * @public
     */
    expandedRowKeys?: Array<TKey>;
    /**
     * @docid
     * @default "withAncestors"
     * @public
     */
    filterMode?: TreeListFilterMode;
    /**
     * @docid
     * @public
     */
    hasItemsExpr?: string | Function;
    /**
     * @docid
     * @default "items"
     * @public
     */
    itemsExpr?: string | Function;
    /**
     * @docid
     * @default "id"
     * @public
     */
    keyExpr?: string | Function;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field event:event
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field column:object
     * @type_function_param1_field row:dxTreeListRowObject
     * @default null
     * @action
     * @public
     */
    onCellClick?: ((e: CellClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field event:event
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field column:dxTreeListColumn
     * @type_function_param1_field row:dxTreeListRowObject
     * @default null
     * @action
     * @public
     */
    onCellDblClick?: ((e: CellDblClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field column:dxTreeListColumn
     * @type_function_param1_field row:dxTreeListRowObject
     * @default null
     * @action
     * @public
     */
    onCellHoverChanged?: ((e: CellHoverChangedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field column:dxTreeListColumn
     * @type_function_param1_field row:dxTreeListRowObject
     * @default null
     * @action
     * @public
     */
    onCellPrepared?: ((e: CellPreparedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:Object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field items:Array<Object>
     * @type_function_param1_field column:dxTreeListColumn
     * @type_function_param1_field row:dxTreeListRowObject
     * @default null
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field column:object
     * @default null
     * @action
     * @public
     */
    onEditingStart?: ((e: EditingStartEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 options:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field setValue(newValue, newText):any
     * @type_function_param1_field row:dxTreeListRowObject
     * @default null
     * @action
     * @public
     */
    onEditorPrepared?: ((options: EditorPreparedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field setValue(newValue, newText):any
     * @type_function_param1_field editorOptions:object
     * @type_function_param1_field row:dxTreeListRowObject
     * @default null
     * @action
     * @public
     */
    onEditorPreparing?: ((e: EditorPreparingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field row:dxTreeListRowObject
     * @type_function_param1_field column:dxTreeListColumn
     * @default null
     * @action
     * @public
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field event:event
     * @type_function_param1_field rows:Array<dxTreeListRowObject>
     * @type_function_param1_field columns:Array<dxTreeListColumn>
     * @default null
     * @action
     * @public
     */
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field row:dxTreeListRowObject
     * @default null
     * @action
     * @public
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field element:DxElement
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field model:any
     * @type_function_param1_field event:event
     * @type_function_param1_field rowElement:DxElement
     * @type_function_param1_field prevRowIndex:number
     * @type_function_param1_field newRowIndex:number
     * @type_function_param1_field rows:Array<dxTreeListRowObject>
     * @type_function_param1_field cancel:boolean
     * @default null
     * @action
     * @public
     */
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field root:dxTreeListNode
     * @default null
     * @action
     * @public
     */
    onNodesInitialized?: ((e: NodesInitializedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field event:event
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field values:Array<any>
     * @type_function_param1_field columns:Array<Object>
     * @type_function_param1_field node:dxTreeListNode
     * @default null
     * @action
     * @public
     */
    onRowClick?: ((e: RowClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field event:event
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field values:Array<any>
     * @type_function_param1_field columns:Array<dxTreeListColumn>
     * @default null
     * @action
     * @public
     */
    onRowDblClick?: ((e: RowDblClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field values:Array<any>
     * @type_function_param1_field columns:Array<dxTreeListColumn>
     * @type_function_param1_field node:dxTreeListNode
     * @default null
     * @action
     * @public
     */
    onRowPrepared?: ((e: RowPreparedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @public
     * @type object
     */
    paging?: Paging;
    /**
     * @docid
     * @default "parentId"
     * @public
     */
    parentIdExpr?: string | Function;
    /**
     * @docid
     * @default "auto"
     * @public
     */
    remoteOperations?: {
        /**
         * @docid
         * @default false
         */
        filtering?: boolean;
        /**
         * @docid
         * @default false
         */
        grouping?: boolean;
        /**
         * @docid
         * @default false
         */
        sorting?: boolean;
    } | Mode;
    /**
     * @docid
     * @default 0
     * @public
     */
    rootValue?: TKey;
    /**
     * @docid
     * @public
     * @type object
     */
    scrolling?: Scrolling;
    /**
     * @docid
     * @public
     * @type object
     */
    selection?: Selection;
    /**
     * @docid
     * @type dxTreeListToolbar
     * @default undefined
     * @public
     */
    toolbar?: Toolbar;
};

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated Use Editing instead
 */
export type dxTreeListEditing<TRowData = any, TKey = any> = Editing<TRowData, TKey>;

/**
 * @public
 */
export interface Editing<TRowData = any, TKey = any> extends EditingBase<TRowData, TKey> {
    /**
     * @docid dxTreeListOptions.editing.allowAdding
     * @default false
     * @type boolean|function
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field row:dxTreeListRowObject
     * @public
     */
    allowAdding?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey> }) => boolean);
    /**
     * @docid dxTreeListOptions.editing.allowDeleting
     * @default false
     * @type boolean|function
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field row:dxTreeListRowObject
     * @public
     */
    allowDeleting?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey> }) => boolean);
    /**
     * @docid dxTreeListOptions.editing.allowUpdating
     * @default false
     * @type boolean|function
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field row:dxTreeListRowObject
     * @public
     */
    allowUpdating?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey> }) => boolean);
    /**
     * @docid dxTreeListOptions.editing.texts
     * @type object
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

/**
 * @docid
 */
export interface EditingTexts extends EditingTextsBase {
    /**
     * @docid dxTreeListOptions.editing.texts.addRowToNode
     * @default "Add"
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

/**
 * @docid
 */
export interface Paging extends PagingBase {
    /**
     * @docid dxTreeListOptions.paging.enabled
     * @default false
     * @public
     */
    enabled?: boolean;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated Use Scrolling instead
 */
export type dxTreeListScrolling = Scrolling;

/**
 * @public
 */
export interface Scrolling extends ScrollingBase {
    /**
     * @docid dxTreeListOptions.scrolling.mode
     * @default "virtual"
     * @public
     */
    mode?: ScrollMode;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated Use Selection instead
 */
export type dxTreeListSelection = Selection;

/**
 * @docid
 * @public
 */
export interface Selection extends SelectionBase {
    /**
     * @docid dxTreeListOptions.selection.recursive
     * @default false
     * @public
     */
    recursive?: boolean;
}
/**
 * @docid
 * @inherits GridBase
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTreeList<TRowData = any, TKey = any> extends Widget<dxTreeListOptions<TRowData, TKey>> implements GridBase<TRowData, TKey> {
    /**
     * @docid
     * @publicName addColumn(columnOptions)
     * @param1 columnOptions:object|string
     * @public
     */
    addColumn(columnOptions: Column<TRowData, TKey> | string): void;
    /**
     * @docid
     * @publicName addRow()
     * @return Promise<void>
     * @public
     */
    addRow(): DxPromise<void>;
    /**
     * @docid
     * @publicName addRow(parentId)
     * @return Promise<void>
     * @public
     */
    addRow(parentId: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName collapseRow(key)
     * @return Promise<void>
     * @public
     */
    collapseRow(key: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName expandRow(key)
     * @return Promise<void>
     * @public
     */
    expandRow(key: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName forEachNode(callback)
     * @public
     */
    forEachNode(callback: Function): void;
    /**
     * @docid
     * @publicName forEachNode(nodes, callback)
     * @param1 nodes:Array<dxTreeListNode>
     * @public
     */
    forEachNode(nodes: Array<Node<TRowData, TKey>>, callback: Function): void;
    /**
     * @docid
     * @publicName getNodeByKey(key)
     * @param1 key:object|string|number
     * @return dxTreeListNode
     * @public
     */
    getNodeByKey(key: TKey): Node<TRowData, TKey>;
    /**
     * @docid
     * @publicName getRootNode()
     * @return dxTreeListNode
     * @public
     */
    getRootNode(): Node<TRowData, TKey>;
    /**
     * @docid
     * @publicName getSelectedRowKeys()
     * @public
     */
    getSelectedRowKeys(): Array<TKey>;
    /**
     * @docid
     * @publicName getSelectedRowKeys(mode)
     * @public
     */
    getSelectedRowKeys(mode: string): Array<TKey>;
    /**
     * @docid
     * @publicName getSelectedRowsData()
     * @public
     */
    getSelectedRowsData(): Array<TRowData>;
    /**
     * @docid
     * @publicName getSelectedRowsData(mode)
     * @public
     */
    getSelectedRowsData(mode: string): Array<TRowData>;
    /**
     * @docid
     * @publicName getVisibleColumns()
     * @return Array<dxTreeListColumn>
     * @public
     */
    getVisibleColumns(): Array<Column<TRowData, TKey>>;
    /**
     * @docid
     * @publicName getVisibleColumns(headerLevel)
     * @return Array<dxTreeListColumn>
     * @public
     */
    getVisibleColumns(headerLevel: number): Array<Column<TRowData, TKey>>;
    /**
     * @docid
     * @publicName getVisibleRows()
     * @return Array<dxTreeListRowObject>
     * @public
     */
    getVisibleRows(): Array<Row<TRowData, TKey>>;
    /**
     * @docid
     * @publicName isRowExpanded(key)
     * @public
     */
    isRowExpanded(key: TKey): boolean;
    /**
     * @docid
     * @publicName loadDescendants()
     * @return Promise<void>
     * @public
     */
    loadDescendants(): DxPromise<void>;
    /**
     * @docid
     * @publicName loadDescendants(keys)
     * @return Promise<void>
     * @public
     */
    loadDescendants(keys: Array<TKey>): DxPromise<void>;
    /**
     * @docid
     * @publicName loadDescendants(keys, childrenOnly)
     * @return Promise<void>
     * @public
     */
    loadDescendants(keys: Array<TKey>, childrenOnly: boolean): DxPromise<void>;

    beginCustomLoading(messageText: string): void;
    byKey(key: TKey): DxPromise<TRowData>;
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
    deselectRows(keys: Array<TKey>): DxPromise<Array<TRowData>>;
    editCell(rowIndex: number, dataField: string): void;
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    editRow(rowIndex: number): void;
    endCustomLoading(): void;
    expandAdaptiveDetailRow(key: TKey): void;
    filter(): any;
    filter(filterExpr: any): void;
    focus(): void;
    focus(element: UserDefinedElement): void;
    getCellElement(rowIndex: number, dataField: string): DxElement | undefined;
    getCellElement(rowIndex: number, visibleColumnIndex: number): DxElement | undefined;
    getCombinedFilter(): any;
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource<TRowData, TKey>;
    getKeyByRowIndex(rowIndex: number): TKey | undefined;
    getRowElement(rowIndex: number): UserDefinedElementsArray | undefined;
    getRowIndexByKey(key: TKey): number;
    getScrollable(): Scrollable;
    getVisibleColumnIndex(id: number | string): number;
    hasEditData(): boolean;
    hideColumnChooser(): void;
    isAdaptiveDetailRowExpanded(key: TKey): boolean;
    isRowFocused(key: TKey): boolean;
    isRowSelected(key: TKey): boolean;
    keyOf(obj: TRowData): TKey;
    navigateToRow(key: TKey): DxPromise<void>;
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
    selectRows(keys: Array<TKey>, preserve: boolean): DxPromise<Array<TRowData>>;
    selectRowsByIndexes(indexes: Array<number>): DxPromise<Array<TRowData>>;
    showColumnChooser(): void;
    state(): any;
    state(state: any): void;
    undeleteRow(rowIndex: number): void;
    updateDimensions(): void;
}

type DefaultToolbarItemName = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'revertButton' | 'saveButton' | 'searchPanel';
export type dxTreeListToolbar = Toolbar;
export type dxTreeListToolbarItem = ToolbarItem;

/**
 * @docid dxTreeListToolbarItem
 * @inherits dxToolbarItem
 * @namespace DevExpress.ui.dxTreeList
 */
export interface ToolbarItem extends dxToolbarItem {
    /**
     * @docid dxTreeListToolbarItem.name
     * @public
     */
    name?: TreeListPredefinedToolbarItem | string;
    /**
     * @docid dxTreeListToolbarItem.location
     * @default 'after'
     * @public
     */
    location?: ToolbarItemLocation;
}

/**
 * @public
 * @docid dxTreeListToolbar
 * @namespace DevExpress.ui.dxTreeList
 */
export type Toolbar = {
    /**
     * @docid dxTreeListToolbar.items
     * @type Array<dxTreeListToolbarItem,Enums.TreeListPredefinedToolbarItem>
     * @public
     */
    items?: Array<TreeListPredefinedToolbarItem | ToolbarItem>;
    /**
     * @docid dxTreeListToolbar.visible
     * @default undefined
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxTreeListToolbar.disabled
     * @default false
     * @public
     */
    disabled?: boolean;
};

/**
 * @public
 */
export type Column<TRowData = any, TKey = any> = dxTreeListColumn<TRowData, TKey>;

/**
 * @namespace DevExpress.ui
 * @deprecated Use the Column type instead
 */
export interface dxTreeListColumn<TRowData = any, TKey = any> extends ColumnBase<TRowData> {
    /**
     * @docid dxTreeListColumn.buttons
     * @type Array<Enums.TreeListPredefinedColumnButton,dxTreeListColumnButton>
     * @public
     */
    buttons?: Array<TreeListPredefinedColumnButton | ColumnButton<TRowData, TKey>>;
    /**
     * @docid dxTreeListColumn.cellTemplate
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field data:object
     * @type_function_param2_field column:dxTreeListColumn
     * @type_function_param2_field row:dxTreeListRowObject
     * @public
     */
    cellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnCellTemplateData<TRowData, TKey>) => any);
    /**
     * @docid dxTreeListColumn.columns
     * @type Array<dxTreeListColumn|string>
     * @default undefined
     * @public
     */
    columns?: Array<Column<TRowData, TKey> | string>;
    /**
     * @docid dxTreeListColumn.editCellTemplate
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field setValue(newValue, newText):any
     * @type_function_param2_field data:object
     * @type_function_param2_field column:dxTreeListColumn
     * @type_function_param2_field row:dxTreeListRowObject
     * @public
     */
    editCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnEditCellTemplateData<TRowData, TKey>) => any);
    /**
     * @docid dxTreeListColumn.headerCellTemplate
     * @type_function_param2 headerInfo:object
     * @type_function_param2_field column:dxTreeListColumn
     * @public
     */
    headerCellTemplate?: template | ((columnHeader: DxElement, headerInfo: ColumnHeaderCellTemplateData<TRowData, TKey>) => any);
    /**
     * @docid dxTreeListColumn.type
     * @publicName type
     * @public
     */
    type?: TreeListCommandColumnType;
}

/**
 * @public
 */
export type ColumnButton<TRowData = any, TKey = any> = dxTreeListColumnButton<TRowData, TKey>;

/**
 * @namespace DevExpress.ui
 * @deprecated Use the TreeList's ColumnButton type instead
 */
export interface dxTreeListColumnButton<TRowData = any, TKey = any> extends ColumnButtonBase {
    /**
     * @docid dxTreeListColumnButton.name
     * @public
     */
    name?: TreeListPredefinedColumnButton | string;
    /**
     * @docid dxTreeListColumnButton.onClick
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field event:event
     * @type_function_param1_field row:dxTreeListRowObject
     * @type_function_param1_field column:dxTreeListColumn
     * @public
     */
    onClick?: ((e: ColumnButtonClickEvent<TRowData, TKey>) => void);
    /**
     * @docid dxTreeListColumnButton.template
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field data:object
     * @type_function_param2_field key:any
     * @type_function_param2_field column:dxTreeListColumn
     * @type_function_param2_field row:dxTreeListRowObject
     * @type_function_return string|Element|jQuery
     * @public
     */
    template?: template | ((cellElement: DxElement, cellInfo: ColumnButtonTemplateData<TRowData, TKey>) => string | UserDefinedElement);
    /**
     * @docid dxTreeListColumnButton.visible
     * @default true
     * @type boolean | function
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field row:dxTreeListRowObject
     * @type_function_param1_field column:dxTreeListColumn
     * @public
     */
    visible?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey>; readonly column: Column<TRowData, TKey> }) => boolean);
    /**
     * @docid dxTreeListColumnButton.disabled
     * @default false
     * @type boolean | function
     * @type_function_param1_field component:dxTreeList
     * @type_function_param1_field row:dxTreeListRowObject
     * @type_function_param1_field column:dxTreeListColumn
     * @public
     */
    disabled?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey>; readonly column: Column<TRowData, TKey> }) => boolean);
}

/**
 * @namespace DevExpress.ui
 * @deprecated Use Node instead
 */
export type dxTreeListNode<TRowData = any, TKey = any> = Node<TRowData, TKey>;

/**
 * @public
 * @docid dxTreeListNode
 */
export type Node<TRowData = any, TKey = any> = {
    /**
     * @docid dxTreeListNode.children
     * @type  Array<dxTreeListNode>
     * @public
     */
    children?: Array<Node<TRowData, TKey>>;
    /**
     * @docid dxTreeListNode.data
     * @public
     */
    data?: TRowData;
    /**
     * @docid dxTreeListNode.hasChildren
     * @public
     */
    hasChildren?: boolean;
    /**
     * @docid dxTreeListNode.key
     * @public
     */
    key: TKey;
    /**
     * @docid dxTreeListNode.level
     * @public
     */
    level: number;
    /**
     * @docid dxTreeListNode.parent
     * @type dxTreeListNode
     * @public
     */
    parent?: Node<TRowData, TKey>;
    /**
     * @docid dxTreeListNode.visible
     * @public
     */
    visible?: boolean;
};

/**
 * @namespace DevExpress.ui
 * @deprecated Use Row instead
 */
export type dxTreeListRowObject<TRowData = any, TKey = any> = Row<TRowData, TKey>;

/**
 * @public
 * @docid dxTreeListRowObject
 */
export type Row<TRowData = any, TKey = any> = {
    /**
     * @docid dxTreeListRowObject.isEditing
     * @public
     */
    readonly isEditing?: boolean;
    /**
     * @docid dxTreeListRowObject.isExpanded
     * @public
     */
    readonly isExpanded?: boolean;
    /**
     * @docid dxTreeListRowObject.isNewRow
     * @public
     */
    readonly isNewRow?: boolean;
    /**
     * @docid dxTreeListRowObject.isSelected
     * @public
     */
    readonly isSelected?: boolean;
    /**
     * @docid dxTreeListRowObject.key
     * @public
     */
    readonly key: TKey;
    /**
     * @docid dxTreeListRowObject.level
     * @public
     */
    readonly level: number;
    /**
     * @docid dxTreeListRowObject.node
     * @type dxTreeListNode
     * @public
     */
    readonly node: Node<TRowData, TKey>;
    /**
     * @docid dxTreeListRowObject.rowIndex
     * @public
     */
    readonly rowIndex: number;
    /**
     * @docid dxTreeListRowObject.rowType
     * @public
     */
    readonly rowType: string;
    /**
     * @docid dxTreeListRowObject.values
     * @public
     */
    readonly values: Array<any>;
    /**
     * @docid dxTreeListRowObject.data
     * @public
     */
    readonly data: TRowData;
};

/** @public */
export type ExplicitTypes<TRowData, TKey> = {
  AdaptiveDetailRowPreparingEvent: AdaptiveDetailRowPreparingEvent<TRowData, TKey>;
  CellClickEvent: CellClickEvent<TRowData, TKey>;
  CellDblClickEvent: CellDblClickEvent<TRowData, TKey>;
  CellHoverChangedEvent: CellHoverChangedEvent<TRowData, TKey>;
  CellPreparedEvent: CellPreparedEvent<TRowData, TKey>;
  ColumnButtonClickEvent: ColumnButtonClickEvent<TRowData, TKey>;
  ColumnButtonTemplateData: ColumnButtonTemplateData<TRowData, TKey>;
  ColumnCellTemplateData: ColumnCellTemplateData<TRowData, TKey>;
  ColumnEditCellTemplateData: ColumnEditCellTemplateData<TRowData, TKey>;
  ContentReadyEvent: ContentReadyEvent<TRowData, TKey>;
  ContextMenuPreparingEvent: ContextMenuPreparingEvent<TRowData, TKey>;
  DataErrorOccurredEvent: DataErrorOccurredEvent<TRowData, TKey>;
  DisposingEvent: DisposingEvent<TRowData, TKey>;
  EditCanceledEvent: EditCanceledEvent<TRowData, TKey>;
  EditCancelingEvent: EditCancelingEvent<TRowData, TKey>;
  Editing: Editing<TRowData, TKey>;
  EditingStartEvent: EditingStartEvent<TRowData, TKey>;
  EditorPreparedEvent: EditorPreparedEvent<TRowData, TKey>;
  EditorPreparingEvent: EditorPreparingEvent<TRowData, TKey>;
  FocusedCellChangedEvent: FocusedCellChangedEvent<TRowData, TKey>;
  FocusedCellChangingEvent: FocusedCellChangingEvent<TRowData, TKey>;
  FocusedRowChangedEvent: FocusedRowChangedEvent<TRowData, TKey>;
  FocusedRowChangingEvent: FocusedRowChangingEvent<TRowData, TKey>;
  InitializedEvent: InitializedEvent<TRowData, TKey>;
  InitNewRowEvent: InitNewRowEvent<TRowData, TKey>;
  KeyDownEvent: KeyDownEvent<TRowData, TKey>;
  NodesInitializedEvent: NodesInitializedEvent<TRowData, TKey>;
  OptionChangedEvent: OptionChangedEvent<TRowData, TKey>;
  Properties: Properties<TRowData, TKey>;
  RowClickEvent: RowClickEvent<TRowData, TKey>;
  RowCollapsedEvent: RowCollapsedEvent<TRowData, TKey>;
  RowCollapsingEvent: RowCollapsingEvent<TRowData, TKey>;
  RowDblClickEvent: RowDblClickEvent<TRowData, TKey>;
  RowDraggingAddEvent: RowDraggingAddEvent<TRowData, TKey>;
  RowDraggingChangeEvent: RowDraggingChangeEvent<TRowData, TKey>;
  RowDraggingEndEvent: RowDraggingEndEvent<TRowData, TKey>;
  RowDraggingMoveEvent: RowDraggingMoveEvent<TRowData, TKey>;
  RowDraggingRemoveEvent: RowDraggingRemoveEvent<TRowData, TKey>;
  RowDraggingReorderEvent: RowDraggingReorderEvent<TRowData, TKey>;
  RowDraggingStartEvent: RowDraggingStartEvent<TRowData, TKey>;
  RowDraggingTemplateData: RowDraggingTemplateData<TRowData>;
  RowExpandedEvent: RowExpandedEvent<TRowData, TKey>;
  RowExpandingEvent: RowExpandingEvent<TRowData, TKey>;
  RowInsertedEvent: RowInsertedEvent<TRowData, TKey>;
  RowInsertingEvent: RowInsertingEvent<TRowData, TKey>;
  RowPreparedEvent: RowPreparedEvent<TRowData, TKey>;
  RowRemovedEvent: RowRemovedEvent<TRowData, TKey>;
  RowRemovingEvent: RowRemovingEvent<TRowData, TKey>;
  RowUpdatedEvent: RowUpdatedEvent<TRowData, TKey>;
  RowUpdatingEvent: RowUpdatingEvent<TRowData, TKey>;
  RowValidatingEvent: RowValidatingEvent<TRowData, TKey>;
  SavedEvent: SavedEvent<TRowData, TKey>;
  SavingEvent: SavingEvent<TRowData, TKey>;
  Scrolling: Scrolling;
  Selection: Selection;
  SelectionChangedEvent: SelectionChangedEvent<TRowData, TKey>;
  Toolbar: Toolbar;
  ToolbarItem: ToolbarItem;
  ToolbarPreparingEvent: ToolbarPreparingEvent<TRowData, TKey>;
};

/** @public */
export type Properties<TRowData = any, TKey = any> = dxTreeListOptions<TRowData, TKey>;

/** @deprecated use Properties instead */
export type Options<TRowData = any, TKey = any> = dxTreeListOptions<TRowData, TKey>;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

type Events = {
/**
 * @skip
 * @docid dxTreeListOptions.onAdaptiveDetailRowPreparing
 * @type_function_param1 e:{ui/tree_list:AdaptiveDetailRowPreparingEvent}
 */
onAdaptiveDetailRowPreparing?: ((e: AdaptiveDetailRowPreparingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onCellClick
 * @type_function_param1 e:{ui/tree_list:CellClickEvent}
 */
onCellClick?: ((e: CellClickEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onCellDblClick
 * @type_function_param1 e:{ui/tree_list:CellDblClickEvent}
 */
onCellDblClick?: ((e: CellDblClickEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onCellHoverChanged
 * @type_function_param1 e:{ui/tree_list:CellHoverChangedEvent}
 */
onCellHoverChanged?: ((e: CellHoverChangedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onCellPrepared
 * @type_function_param1 e:{ui/tree_list:CellPreparedEvent}
 */
onCellPrepared?: ((e: CellPreparedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onContentReady
 * @type_function_param1 e:{ui/tree_list:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onContextMenuPreparing
 * @type_function_param1 e:{ui/tree_list:ContextMenuPreparingEvent}
 */
onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onDataErrorOccurred
 * @type_function_param1 e:{ui/tree_list:DataErrorOccurredEvent}
 */
onDataErrorOccurred?: ((e: DataErrorOccurredEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onDisposing
 * @type_function_param1 e:{ui/tree_list:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onEditCanceled
 * @type_function_param1 e:{ui/tree_list:EditCanceledEvent}
 */
onEditCanceled?: ((e: EditCanceledEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onEditCanceling
 * @type_function_param1 e:{ui/tree_list:EditCancelingEvent}
 */
onEditCanceling?: ((e: EditCancelingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onEditingStart
 * @type_function_param1 e:{ui/tree_list:EditingStartEvent}
 */
onEditingStart?: ((e: EditingStartEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onEditorPrepared
 * @type_function_param1 e:{ui/tree_list:EditorPreparedEvent}
 */
onEditorPrepared?: ((e: EditorPreparedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onEditorPreparing
 * @type_function_param1 e:{ui/tree_list:EditorPreparingEvent}
 */
onEditorPreparing?: ((e: EditorPreparingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onFocusedCellChanged
 * @type_function_param1 e:{ui/tree_list:FocusedCellChangedEvent}
 */
onFocusedCellChanged?: ((e: FocusedCellChangedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onFocusedCellChanging
 * @type_function_param1 e:{ui/tree_list:FocusedCellChangingEvent}
 */
onFocusedCellChanging?: ((e: FocusedCellChangingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onFocusedRowChanged
 * @type_function_param1 e:{ui/tree_list:FocusedRowChangedEvent}
 */
onFocusedRowChanged?: ((e: FocusedRowChangedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onFocusedRowChanging
 * @type_function_param1 e:{ui/tree_list:FocusedRowChangingEvent}
 */
onFocusedRowChanging?: ((e: FocusedRowChangingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onInitialized
 * @type_function_param1 e:{ui/tree_list:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onInitNewRow
 * @type_function_param1 e:{ui/tree_list:InitNewRowEvent}
 */
onInitNewRow?: ((e: InitNewRowEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onKeyDown
 * @type_function_param1 e:{ui/tree_list:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onNodesInitialized
 * @type_function_param1 e:{ui/tree_list:NodesInitializedEvent}
 */
onNodesInitialized?: ((e: NodesInitializedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onOptionChanged
 * @type_function_param1 e:{ui/tree_list:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowClick
 * @type_function_param1 e:{ui/tree_list:RowClickEvent}
 */
onRowClick?: ((e: RowClickEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowCollapsed
 * @type_function_param1 e:{ui/tree_list:RowCollapsedEvent}
 */
onRowCollapsed?: ((e: RowCollapsedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowCollapsing
 * @type_function_param1 e:{ui/tree_list:RowCollapsingEvent}
 */
onRowCollapsing?: ((e: RowCollapsingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowDblClick
 * @type_function_param1 e:{ui/tree_list:RowDblClickEvent}
 */
onRowDblClick?: ((e: RowDblClickEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowExpanded
 * @type_function_param1 e:{ui/tree_list:RowExpandedEvent}
 */
onRowExpanded?: ((e: RowExpandedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowExpanding
 * @type_function_param1 e:{ui/tree_list:RowExpandingEvent}
 */
onRowExpanding?: ((e: RowExpandingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowInserted
 * @type_function_param1 e:{ui/tree_list:RowInsertedEvent}
 */
onRowInserted?: ((e: RowInsertedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowInserting
 * @type_function_param1 e:{ui/tree_list:RowInsertingEvent}
 */
onRowInserting?: ((e: RowInsertingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowPrepared
 * @type_function_param1 e:{ui/tree_list:RowPreparedEvent}
 */
onRowPrepared?: ((e: RowPreparedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowRemoved
 * @type_function_param1 e:{ui/tree_list:RowRemovedEvent}
 */
onRowRemoved?: ((e: RowRemovedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowRemoving
 * @type_function_param1 e:{ui/tree_list:RowRemovingEvent}
 */
onRowRemoving?: ((e: RowRemovingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowUpdated
 * @type_function_param1 e:{ui/tree_list:RowUpdatedEvent}
 */
onRowUpdated?: ((e: RowUpdatedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowUpdating
 * @type_function_param1 e:{ui/tree_list:RowUpdatingEvent}
 */
onRowUpdating?: ((e: RowUpdatingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onRowValidating
 * @type_function_param1 e:{ui/tree_list:RowValidatingEvent}
 */
onRowValidating?: ((e: RowValidatingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onSaved
 * @type_function_param1 e:{ui/tree_list:SavedEvent}
 */
onSaved?: ((e: SavedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onSaving
 * @type_function_param1 e:{ui/tree_list:SavingEvent}
 */
onSaving?: ((e: SavingEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onSelectionChanged
 * @type_function_param1 e:{ui/tree_list:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @skip
 * @docid dxTreeListOptions.onToolbarPreparing
 * @type_function_param1 e:{ui/tree_list:ToolbarPreparingEvent}
 */
onToolbarPreparing?: ((e: ToolbarPreparingEvent) => void);
};
