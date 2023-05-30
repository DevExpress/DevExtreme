import DataSource, {
} from '../data/data_source';

import {
  UserDefinedElement,
  DxElement,
  UserDefinedElementsArray,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    template,
} from '../core/templates/template';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    dxToolbarItem,
} from './toolbar';

import Widget, {
} from './widget/ui.widget';

import {
  Format,
} from '../localization';

import {
    HorizontalAlignment,
    Mode,
    Scrollable,
    SelectAllMode,
    SortOrder,
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
    FilterPanel as ComponentFilterPanel,
    FilterPanelCustomizeTextArg as ComponentFilterPanelCustomizeTextArg,
    GridBase,
    GridBaseOptions,
    GroupExpandMode,
    KeyDownInfo,
    NewRowInfo,
    NewRowPosition,
    PagingBase,
    ReducedNativeEventInfo,
    RowDragging as ComponentRowDragging,
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
    SelectionColumnDisplayMode,
    SummaryType,
    ToolbarPreparingInfo,
} from '../common/grids';

export {
    DataType,
    DragDirection,
    Draggable,
    DragHighlight,
    HorizontalAlignment,
    HorizontalEdge,
    Mode,
    Scrollable,
    ScrollbarMode,
    SearchMode,
    SelectAllMode,
    Sortable,
    SortOrder,
    ToolbarItemLocation,
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
    KeyDownInfo,
    NewRowInfo,
    PagingBase,
    RowDraggingEventInfo,
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

/** @public */
export type DataGridCommandColumnType = 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection' | 'drag';
/** @public */
export type DataGridExportFormat = 'pdf' | 'xlsx';
/** @public */
export type DataGridScrollMode = 'infinite' | 'standard' | 'virtual';
/** @public */
export type DataGridPredefinedColumnButton = 'cancel' | 'delete' | 'edit' | 'save' | 'undelete';
/** @public */
export type DataGridPredefinedToolbarItem = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'exportButton' | 'groupPanel' | 'revertButton' | 'saveButton' | 'searchPanel';

type GroupKey = any[];

/**
 * @docid
 * @public
 */
export type GroupData<TRowData> = {
  key: any;
  items: Array<TRowData> | Array<GroupData<TRowData>> | null;
  /** @deprecated Attention! This property is for internal purposes only. */
  collapsedItems?: Array<TRowData> | Array<GroupData<TRowData>>;
  /** @deprecated Attention! This property is for internal purposes only. */
  aggregates?: Array<any>;
  /** @deprecated Attention! This property is for internal purposes only. */
  summary?: Array<any>;
  /** @deprecated Attention! This property is for internal purposes only. */
  isContinuation?: boolean;
  /** @deprecated Attention! This property is for internal purposes only. */
  isContinuationOnNextPage?: boolean;
};

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseEditing<TRowData = any, TKey = any> = EditingBase<TRowData, TKey>;

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseEditingTexts = EditingTextsBase;

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBasePaging = PagingBase;

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseScrolling = ScrollingBase;

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseSelection = SelectionBase;

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseColumn<TRowData = any> = ColumnBase<TRowData>;

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseColumnButton = ColumnButtonBase;

/** @public */
export type AdaptiveDetailRowPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & AdaptiveDetailRowPreparingInfo;

/** @public */
export type CellClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
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
};

/** @public */
export type CellDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
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
};

/** @public */
export type CellHoverChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  readonly eventType: string;
  readonly data: TRowData;
  readonly key: TKey;
  readonly value?: any;
  readonly text: string;
  readonly displayValue?: any;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column<TRowData, TKey>;
  readonly rowType: string;
  readonly cellElement: DxElement;
  readonly row: Row<TRowData, TKey>;
};

/** @public */
export type CellPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  readonly data: TRowData;
  readonly key: TKey;
  readonly value?: any;
  readonly displayValue?: any;
  readonly text: string;
  readonly columnIndex: number;
  readonly column: Column<TRowData, TKey>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly row: Row<TRowData, TKey>;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly cellElement: DxElement;
  readonly watch?: Function;
  readonly oldValue?: any;
};

/** @public */
export type ContentReadyEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>>;

/** @public */
export type ContextMenuPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  items?: Array<any>;
  readonly target: string;
  readonly targetElement: DxElement;
  readonly columnIndex: number;
  readonly column?: Column<TRowData, TKey>;
  readonly rowIndex: number;
  readonly row?: Row<TRowData, TKey>;
};

/** @public */
export type DataErrorOccurredEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & DataErrorOccurredInfo;

/** @public */
export type DisposingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>>;

/** @public */
export type EditCanceledEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/** @public */
export type EditCancelingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/** @public */
export type EditingStartEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & {
  readonly data: TRowData;
  readonly key: TKey;
  readonly column?: Column<TRowData, TKey>;
};

/** @public */
export type EditorPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
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
export type EditorPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  readonly parentType: string;
  readonly value?: any;
  readonly setValue?: any;
  readonly updateValueTimeout?: number;
  readonly width?: number;
  readonly disabled: boolean;
  readonly rtlEnabled: boolean;
  cancel: boolean;
  readonly editorElement: DxElement;
  readonly readOnly: boolean;
  editorName: string;
  editorOptions: any;
  readonly dataField?: string;
  readonly row?: Row<TRowData, TKey>;
};

/** @public */
export type ExportingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & {
  fileName?: string;
  selectedRowsOnly: boolean;
  format: DataGridExportFormat | string;
};

/** @public */
export type FocusedCellChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  readonly cellElement: DxElement;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly row?: Row<TRowData, TKey>;
  readonly column?: Column<TRowData, TKey>;
};

/** @public */
export type FocusedCellChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxDataGrid<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
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
export type FocusedRowChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  readonly rowElement: DxElement;
  readonly rowIndex: number;
  readonly row?: Row<TRowData, TKey>;
};

/** @public */
export type FocusedRowChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxDataGrid<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
  readonly rowElement: DxElement;
  readonly prevRowIndex: number;
  newRowIndex: number;
  readonly rows: Array<Row<TRowData, TKey>>;
};

/** @public */
export type InitializedEvent<TRowData = any, TKey = any> = InitializedEventInfo<dxDataGrid<TRowData, TKey>>;

/** @public */
export type InitNewRowEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & NewRowInfo<TRowData>;

/** @public */
export type KeyDownEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, KeyboardEvent> & KeyDownInfo;

/** @public */
export type OptionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & ChangedOptionInfo;

/** @public */
export type RowClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  readonly data: TRowData;
  readonly key: TKey;
  readonly values: Array<any>;
  readonly columns: Array<Column<TRowData, TKey>>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly groupIndex?: number;
  readonly rowElement: DxElement;
  readonly handled: boolean;
};

/** @public */
export type RowCollapsedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/** @public */
export type RowCollapsingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/** @public */
export type RowDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  readonly data: TRowData;
  readonly key: TKey;
  readonly values: Array<any>;
  readonly columns: Array<Column<TRowData, TKey>>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly groupIndex?: number;
  readonly rowElement: DxElement;
};

/** @public */
export type RowExpandedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/** @public */
export type RowExpandingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/** @public */
export type RowInsertedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowInsertedInfo<TRowData, TKey>;

/** @public */
export type RowInsertingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowInsertingInfo<TRowData>;

/** @public */
export type RowPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  readonly data: TRowData;
  readonly key: TKey;
  readonly values: Array<any>;
  readonly columns: Array<Column<TRowData, TKey>>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly groupIndex?: number;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
  readonly isNewRow?: boolean;
  readonly rowElement: DxElement;
};

/** @public */
export type RowRemovedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowRemovedInfo<TRowData, TKey>;

/** @public */
export type RowRemovingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowRemovingInfo<TRowData, TKey>;

/** @public */
export type RowUpdatedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowUpdatedInfo<TRowData, TKey>;

/** @public */
export type RowUpdatingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowUpdatingInfo<TRowData, TKey>;

/** @public */
export type RowValidatingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowValidatingInfo<TRowData, TKey>;

/** @public */
export type SavedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/** @public */
export type SavingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & SavingInfo<TRowData, TKey>;

/** @public */
export type SelectionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & SelectionChangedInfo<TRowData, TKey>;

/** @public */
export type ToolbarPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & ToolbarPreparingInfo;

/** @public */
export type RowDraggingAddEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

/** @public */
export type RowDraggingChangeEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

/** @public */
export type RowDraggingEndEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

/** @public */
export type RowDraggingMoveEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

/** @public */
export type RowDraggingStartEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & DragStartEventInfo<TRowData>;

/** @public */
export type RowDraggingRemoveEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData>;

/** @public */
export type RowDraggingReorderEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragReorderInfo;

/** @public */
export type ColumnButtonClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  row?: Row<TRowData, TKey>;
  column?: Column<TRowData, TKey>;
};

/** @public */
export type ColumnButtonTemplateData<TRowData = any, TKey = any> = {
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly data?: TRowData;
  readonly key?: TKey;
  readonly columnIndex: number;
  readonly column: Column<TRowData, TKey>;
  readonly rowIndex: number;
  readonly rowType: string;
  readonly row: Row<TRowData, TKey>;
};

/** @public */
export type ColumnCellTemplateData<TRowData = any, TKey = any> = {
  readonly data?: TRowData;
  readonly component: dxDataGrid<TRowData, TKey>;
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
  readonly data?: TRowData;
  readonly component: dxDataGrid<TRowData, TKey>;
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

/** @public */
export type ColumnGroupCellTemplateData<TRowData = any, TKey = any> = {
  readonly data?: GroupData<TRowData>;
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly value?: any;
  readonly text: string;
  readonly displayValue?: any;
  readonly columnIndex: number;
  readonly rowIndex: number;
  readonly column: Column<TRowData, TKey>;
  readonly row: Row<GroupData<TRowData>, GroupKey>;
  readonly summaryItems: Array<any>;
  readonly groupContinuesMessage?: string;
  readonly groupContinuedMessage?: string;
};

/** @public */
export type ColumnHeaderCellTemplateData<TRowData = any, TKey = any> = {
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly columnIndex: number;
  readonly column: Column<TRowData, TKey>;
};

/** @public */
export type MasterDetailTemplateData<TRowData = any, TKey = any> = {
  readonly key: TKey;
  readonly data: TRowData;
  readonly watch?: Function;
};

/** @public */
export type RowTemplateData<TRowData = any, TKey = any> = {
  readonly key: TKey;
  readonly data: TRowData;
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly values: Array<any>;
  readonly rowIndex: number;
  readonly columns: Array<Column<TRowData, TKey>>;
  readonly isSelected?: boolean;
  readonly rowType: string;
  readonly groupIndex?: number;
  readonly isExpanded?: boolean;
};

/** @public */
export type DataRowTemplateData<TRowData = any, TKey = any> = {
  readonly key: TKey;
  readonly data: TRowData;
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly values: Array<any>;
  readonly rowIndex: number;
  readonly columns: Array<Column<TRowData, TKey>>;
  readonly isSelected?: boolean;
  readonly isExpanded?: boolean;
};

type OverriddenKeys = 'columns' | 'customizeColumns' | 'dataRowTemplate' | 'editing' | 'export' | 'grouping' | 'groupPanel' | 'keyExpr' | 'masterDetail' | 'onCellClick' | 'onCellDblClick' | 'onCellHoverChanged' | 'onCellPrepared' | 'onContextMenuPreparing' | 'onEditingStart' | 'onEditorPrepared' | 'onEditorPreparing' | 'onExporting' | 'onFocusedCellChanged' | 'onFocusedCellChanging' | 'onFocusedRowChanged' | 'onFocusedRowChanging' | 'onRowClick' | 'onRowDblClick' | 'onRowPrepared' | 'remoteOperations' | 'rowTemplate' | 'scrolling' | 'selection' | 'selectionFilter' | 'sortByGroupSummaryInfo' | 'summary' | 'toolbar';

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 * @type object
 */
export type dxDataGridOptions<TRowData = any, TKey = any> = Omit<GridBaseOptions<dxDataGrid<TRowData, TKey>, TRowData, TKey>, OverriddenKeys> & {
    /**
     * @docid
     * @type Array<dxDataGridColumn|string>
     * @default undefined
     * @public
     */
    columns?: Array<Column<TRowData, TKey> | string>;
    /**
     * @docid
     * @type_function_param1 columns:Array<dxDataGridColumn>
     * @public
     */
    customizeColumns?: ((columns: Array<Column<TRowData, TKey>>) => void);
    /**
     * @docid
     * @public
     * @type object
     */
    editing?: Editing<TRowData, TKey>;
    /**
     * @docid
     * @type object
     * @public
     */
    export?: Export;
    /**
     * @docid
     * @type object
     * @public
     */
    groupPanel?: GroupPanel;
    /**
     * @docid
     * @type object
     * @public
     */
    grouping?: Grouping;
    /**
     * @docid
     * @default undefined
     * @public
     */
    keyExpr?: string | Array<string>;
    /**
     * @docid
     * @type object
     * @public
     */
    masterDetail?: MasterDetail<TRowData, TKey>;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field event:event
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field column:object
     * @type_function_param1_field row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onCellClick?: ((e: CellClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field event:event
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field column:dxDataGridColumn
     * @type_function_param1_field row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onCellDblClick?: ((e: CellDblClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field column:dxDataGridColumn
     * @type_function_param1_field row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onCellHoverChanged?: ((e: CellHoverChangedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field column:dxDataGridColumn
     * @type_function_param1_field row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onCellPrepared?: ((e: CellPreparedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:Object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field items:Array<Object>
     * @type_function_param1_field column:dxDataGridColumn
     * @type_function_param1_field row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
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
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field setValue(newValue, newText):any
     * @type_function_param1_field row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onEditorPrepared?: ((options: EditorPreparedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field setValue(newValue, newText):any
     * @type_function_param1_field editorOptions:object
     * @type_function_param1_field row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onEditorPreparing?: ((e: EditorPreparingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field format:Enums.DataGridExportFormat|string
     * @default null
     * @action
     * @public
     */
    onExporting?: ((e: ExportingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field row:dxDataGridRowObject
     * @type_function_param1_field column:dxDataGridColumn
     * @default null
     * @action
     * @public
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field event:event
     * @type_function_param1_field rows:Array<dxDataGridRowObject>
     * @type_function_param1_field columns:Array<dxDataGridColumn>
     * @default null
     * @action
     * @public
     */
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field row:dxDataGridRowObject
     * @default null
     * @action
     * @public
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field event:event
     * @type_function_param1_field rows:Array<dxDataGridRowObject>
     * @default null
     * @action
     * @public
     */
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field event:event
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field values:Array<any>
     * @type_function_param1_field columns:Array<Object>
     * @default null
     * @action
     * @public
     */
    onRowClick?: ((e: RowClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field event:event
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field values:Array<any>
     * @type_function_param1_field columns:Array<dxDataGridColumn>
     * @default null
     * @action
     * @public
     */
    onRowDblClick?: ((e: RowDblClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field values:Array<any>
     * @type_function_param1_field columns:Array<dxDataGridColumn>
     * @default null
     * @action
     * @public
     */
    onRowPrepared?: ((e: RowPreparedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @default "auto"
     * @public
     */
    remoteOperations?: boolean | {
      /**
       * @docid
       * @default false
       */
      filtering?: boolean;
      /**
       * @docid
       * @default false
       */
      groupPaging?: boolean;
      /**
       * @docid
       * @default false
       */
      grouping?: boolean;
      /**
       * @docid
       * @default false
       */
      paging?: boolean;
      /**
       * @docid
       * @default false
       */
      sorting?: boolean;
      /**
       * @docid
       * @default false
       */
      summary?: boolean;
    } | Mode;
    /**
     * @docid
     * @type_function_param2 rowInfo:object
     * @type_function_param2_field key:any
     * @type_function_param2_field data:any
     * @type_function_param2_field values:Array<any>
     * @type_function_param2_field columns:Array<dxDataGridColumn>
     * @public
     * @deprecated dxDataGridOptions.dataRowTemplate
     */
    rowTemplate?: template | ((rowElement: DxElement, rowInfo: RowTemplateData<TRowData, TKey>) => any);
        /**
     * @docid
     * @type_function_param2 rowInfo:object
     * @type_function_param2_field key:any
     * @type_function_param2_field data:any
     * @type_function_param2_field values:Array<any>
     * @type_function_param2_field columns:Array<dxDataGridColumn>
     * @public
     */
    dataRowTemplate?: template | ((rowElement: DxElement, rowInfo: DataRowTemplateData<TRowData, TKey>) => any);
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
     * @type Filter expression
     * @default []
     * @fires dxDataGridOptions.onOptionChanged
     * @public
     */
    selectionFilter?: string | Array<any> | Function;
    /**
     * @docid
     * @type Array<object>
     * @default undefined
     * @public
     */
    sortByGroupSummaryInfo?: Array<dxDataGridSortByGroupSummaryInfoItem>;
    /**
     * @docid
     * @type object
     * @public
     */
    summary?: Summary<TRowData, TKey>;
    /**
     * @docid
     * @type dxDataGridToolbar
     * @default undefined
     * @public
     */
    toolbar?: Toolbar;
};

/**
 * @docid
 * @public
 */
export type Export = {
  /**
   * @docid dxDataGridOptions.export.allowExportSelectedData
   * @default false
   */
  allowExportSelectedData?: boolean;
  /**
   * @docid dxDataGridOptions.export.enabled
   * @default false
   */
  enabled?: boolean;
  /**
   * @docid dxDataGridOptions.export.formats
   * @type Array<Enums.DataGridExportFormat,string>
   * @default "DataGrid"
   */
  formats?: ('xlsx' | 'pdf' | string)[];
  /**
   * @docid dxDataGridOptions.export.texts
   * @type object
   */
  texts?: ExportTexts;
};

/**
 * @docid
 * @public
 */
export type ExportTexts = {
  /**
   * @docid dxDataGridOptions.export.texts.exportAll
   * @default "Export all data to {0}"
   */
  exportAll?: string;
  /**
   * @docid dxDataGridOptions.export.texts.exportSelectedRows
   * @default "Export selected rows to {0}"
   */
  exportSelectedRows?: string;
  /**
   * @docid dxDataGridOptions.export.texts.exportTo
   * @default "Export"
   */
  exportTo?: string;
};

/** @public */
export type FilterPanel<TRowData = any, TKey = any> = ComponentFilterPanel<dxDataGrid, TRowData, TKey>;

/** @public */
export type FilterPanelCustomizeTextArg = ComponentFilterPanelCustomizeTextArg<dxDataGrid>;

/**
 * @docid
 * @public
 */
export type GroupPanel = {
  /**
   * @docid dxDataGridOptions.groupPanel.allowColumnDragging
   * @default true
   */
  allowColumnDragging?: boolean;
  /**
   * @docid dxDataGridOptions.groupPanel.emptyPanelText
   * @default "Drag a column header here to group by that column"
   */
  emptyPanelText?: string;
  /**
   * @docid dxDataGridOptions.groupPanel.visible
   * @fires dxDataGridOptions.onOptionChanged
   * @default false
   */
  visible?: boolean | Mode;
};

/**
 * @docid
 * @public
 */
export type Grouping = {
  /**
   * @docid dxDataGridOptions.grouping.allowCollapsing
   * @default true
   */
  allowCollapsing?: boolean;
  /**
   * @docid dxDataGridOptions.grouping.autoExpandAll
   * @default true
   */
  autoExpandAll?: boolean;
  /**
   * @docid dxDataGridOptions.grouping.contextMenuEnabled
   * @default false
   */
  contextMenuEnabled?: boolean;
  /**
   * @docid dxDataGridOptions.grouping.expandMode
   * @default 'rowClick' &for(mobile_devices)
   * @default "buttonClick"
   */
  expandMode?: GroupExpandMode;
  /**
   * @docid dxDataGridOptions.grouping.texts
   * @type object
   */
  texts?: GroupingTexts;
};

/**
 * @docid
 * @public
 */
export type GroupingTexts = {
  /**
   * @docid dxDataGridOptions.grouping.texts.groupByThisColumn
   * @default "Group by This Column"
   */
  groupByThisColumn?: string;
  /**
   * @docid dxDataGridOptions.grouping.texts.groupContinuedMessage
   * @default "Continued from the previous page"
   */
  groupContinuedMessage?: string;
  /**
   * @docid dxDataGridOptions.grouping.texts.groupContinuesMessage
   * @default "Continues on the next page"
   */
  groupContinuesMessage?: string;
  /**
   * @docid dxDataGridOptions.grouping.texts.ungroup
   * @default "Ungroup"
   */
  ungroup?: string;
  /**
   * @docid dxDataGridOptions.grouping.texts.ungroupAll
   * @default "Ungroup All"
   */
  ungroupAll?: string;
};

/**
 * @docid
 * @public
 */
export type MasterDetail<TRowData = any, TKey = any> = {
  /**
   * @docid dxDataGridOptions.masterDetail.autoExpandAll
   * @default false
   */
  autoExpandAll?: boolean;
  /**
   * @docid dxDataGridOptions.masterDetail.enabled
   * @default false
   */
  enabled?: boolean;
  /**
   * @docid dxDataGridOptions.masterDetail.template
   * @type_function_param2 detailInfo:object
   * @type_function_param2_field key:any
   * @type_function_param2_field data:object
   */
  template?: template | ((detailElement: DxElement, detailInfo: MasterDetailTemplateData<TRowData, TKey>) => any);
};

/**
 * @docid
 */
export interface dxDataGridSortByGroupSummaryInfoItem {
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo.groupColumn
     * @default undefined
     */
    groupColumn?: string;
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo.sortOrder
     * @default undefined
     * @acceptValues undefined
     */
    sortOrder?: SortOrder;
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo.summaryItem
     * @default undefined
     */
    summaryItem?: string | number;
}

/** @public */
export type CustomSummaryInfo<TRowData = any, TKey = any> = {
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly name?: string;
  readonly summaryProcess: string;
  readonly value?: any;
  totalValue?: any;
  readonly groupIndex?: number;
};

/** @public */
export type RowDragging<TRowData = any, TKey = any> = ComponentRowDragging<dxDataGrid, TRowData, TKey>;

/**
 * @docid
 * @public
 */
export type Summary<TRowData = any, TKey = any> = {
  /**
   * @docid dxDataGridOptions.summary.calculateCustomSummary
   * @type_function_param1 options:object
   */
  calculateCustomSummary?: ((options: CustomSummaryInfo<TRowData, TKey>) => void);
  /**
   * @docid dxDataGridOptions.summary.groupItems
   * @type Array<object>
   * @default undefined
   */
  groupItems?: Array<SummaryGroupItem>;
  /**
   * @docid dxDataGridOptions.summary.recalculateWhileEditing
   * @default false
   */
  recalculateWhileEditing?: boolean;
  /**
   * @docid dxDataGridOptions.summary.skipEmptyValues
   * @default true
   */
  skipEmptyValues?: boolean;
  /**
   * @docid dxDataGridOptions.summary.texts
   * @type object
   */
  texts?: SummaryTexts;
  /**
   * @docid dxDataGridOptions.summary.totalItems
   * @type Array<object>
   * @default undefined
   */
  totalItems?: Array<SummaryTotalItem>;
};

/** @public */
export type SummaryItemTextInfo = {
  readonly value?: string | number | Date;
  readonly valueText: string;
};

/**
 * @docid
 * @public
 */
export type SummaryGroupItem = {
    /**
     * @docid dxDataGridOptions.summary.groupItems.alignByColumn
     * @default false
     */
    alignByColumn?: boolean;
    /**
     * @docid dxDataGridOptions.summary.groupItems.column
     * @default undefined
     */
    column?: string;
    /**
     * @docid dxDataGridOptions.summary.groupItems.customizeText
     * @type_function_param1 itemInfo:object
     */
    customizeText?: ((itemInfo: SummaryItemTextInfo) => string);
    /**
     * @docid dxDataGridOptions.summary.groupItems.displayFormat
     * @default undefined
     */
    displayFormat?: string;
    /**
     * @docid dxDataGridOptions.summary.groupItems.name
     * @default undefined
     */
    name?: string;
    /**
     * @docid dxDataGridOptions.summary.groupItems.showInColumn
     * @default undefined
     */
    showInColumn?: string;
    /**
     * @docid dxDataGridOptions.summary.groupItems.showInGroupFooter
     * @default false
     */
    showInGroupFooter?: boolean;
    /**
     * @docid dxDataGridOptions.summary.groupItems.skipEmptyValues
     */
    skipEmptyValues?: boolean;
    /**
     * @docid dxDataGridOptions.summary.groupItems.summaryType
     * @default undefined
     */
    summaryType?: SummaryType | string;
    /**
     * @docid dxDataGridOptions.summary.groupItems.valueFormat
     * @default undefined
     */
    valueFormat?: Format;
};

/**
 * @docid
 * @public
 */
export type SummaryTotalItem = {
  /**
   * @docid dxDataGridOptions.summary.totalItems.alignment
   * @default undefined
   */
  alignment?: HorizontalAlignment;
  /**
   * @docid dxDataGridOptions.summary.totalItems.column
   * @default undefined
   */
  column?: string;
  /**
   * @docid dxDataGridOptions.summary.totalItems.cssClass
   * @default undefined
   */
  cssClass?: string;
  /**
   * @docid dxDataGridOptions.summary.totalItems.customizeText
   * @type_function_param1 itemInfo:object
   */
  customizeText?: ((itemInfo: SummaryItemTextInfo) => string);
  /**
   * @docid dxDataGridOptions.summary.totalItems.displayFormat
   * @default undefined
   */
  displayFormat?: string;
  /**
   * @docid dxDataGridOptions.summary.totalItems.name
   * @default undefined
   */
  name?: string;
  /**
   * @docid dxDataGridOptions.summary.totalItems.showInColumn
   * @default undefined
   */
  showInColumn?: string;
  /**
   * @docid dxDataGridOptions.summary.totalItems.skipEmptyValues
   */
  skipEmptyValues?: boolean;
  /**
   * @docid dxDataGridOptions.summary.totalItems.summaryType
   * @default undefined
   */
  summaryType?: SummaryType | string;
  /**
   * @docid dxDataGridOptions.summary.totalItems.valueFormat
   * @default undefined
   */
  valueFormat?: Format;
};

/**
 * @docid
 * @public
 */
export type SummaryTexts = {
    /**
     * @docid dxDataGridOptions.summary.texts.avg
     * @default "Avg={0}"
     */
    avg?: string;
    /**
     * @docid dxDataGridOptions.summary.texts.avgOtherColumn
     * @default "Avg of {1} is {0}"
     */
    avgOtherColumn?: string;
    /**
     * @docid dxDataGridOptions.summary.texts.count
     * @default "Count={0}"
     */
    count?: string;
    /**
     * @docid dxDataGridOptions.summary.texts.max
     * @default "Max={0}"
     */
    max?: string;
    /**
     * @docid dxDataGridOptions.summary.texts.maxOtherColumn
     * @default "Max of {1} is {0}"
     */
    maxOtherColumn?: string;
    /**
     * @docid dxDataGridOptions.summary.texts.min
     * @default "Min={0}"
     */
    min?: string;
    /**
     * @docid dxDataGridOptions.summary.texts.minOtherColumn
     * @default "Min of {1} is {0}"
     */
    minOtherColumn?: string;
    /**
     * @docid dxDataGridOptions.summary.texts.sum
     * @default "Sum={0}"
     */
    sum?: string;
    /**
     * @docid dxDataGridOptions.summary.texts.sumOtherColumn
     * @default "Sum of {1} is {0}"
     */
    sumOtherColumn?: string;
};

export type dxDataGridToolbar = Toolbar;
export type dxDataGridToolbarItem = ToolbarItem;

/**
 * @docid dxDataGridToolbarItem
 * @inherits dxToolbarItem
 * @namespace DevExpress.ui.dxDataGrid
 * @public
 */
export type ToolbarItem = dxToolbarItem & {
  /**
   * @docid dxDataGridToolbarItem.name
   * @public
   */
  name?: DataGridPredefinedToolbarItem | string;
  /**
   * @docid dxDataGridToolbarItem.location
   * @default 'after'
   * @public
   */
  location?: ToolbarItemLocation;
};

/**
 * @public
 * @docid dxDataGridToolbar
 * @namespace DevExpress.ui.dxDataGrid
 */
export type Toolbar = {
  /**
   * @docid dxDataGridToolbar.items
   * @type Array<dxDataGridToolbarItem,Enums.DataGridPredefinedToolbarItem>
   * @public
   */
  items?: Array<DataGridPredefinedToolbarItem | ToolbarItem>;
  /**
   * @docid dxDataGridToolbar.visible
   * @default undefined
   * @public
   */
  visible?: boolean;
  /**
   * @docid dxDataGridToolbar.disabled
   * @default false
   * @public
   */
  disabled?: boolean;
};

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated Use Editing instead
 */
export type dxDataGridEditing<TRowData, TKey = any> = Editing<TRowData, TKey>;

/**
 * @public
 */
export type Editing<TRowData = any, TKey = any> = EditingBase<TRowData, TKey> & {
    /**
     * @docid dxDataGridOptions.editing.allowAdding
     * @default false
     * @public
     */
    allowAdding?: boolean;
    /**
     * @docid dxDataGridOptions.editing.allowDeleting
     * @default false
     * @type boolean|function
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field row:dxDataGridRowObject
     * @public
     */
    allowDeleting?: boolean | ((options: { component?: dxDataGrid<TRowData, TKey>; row?: Row<TRowData, TKey> }) => boolean);
    /**
     * @docid dxDataGridOptions.editing.allowUpdating
     * @default false
     * @type boolean|function
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field row:dxDataGridRowObject
     * @public
     */
    allowUpdating?: boolean | ((options: { component?: dxDataGrid<TRowData, TKey>; row?: Row<TRowData, TKey> }) => boolean);
    /**
     * @docid dxDataGridOptions.editing.texts
     * @public
     */
    texts?: any;
    /**
     * @docid dxDataGridOptions.editing.newRowPosition
     * @default "viewportTop"
     * @public
     */
    newRowPosition?: NewRowPosition;
};

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated Use Scrolling instead
 */
export type dxDataGridScrolling = Scrolling;

/**
 * @public
 */
export type Scrolling = ScrollingBase & {
    /**
     * @docid dxDataGridOptions.scrolling.mode
     * @default "standard"
     * @public
     */
    mode?: DataGridScrollMode;
};

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated Use Selection instead
 */
export type dxDataGridSelection = Selection;

/** @public */
export type Selection = SelectionBase & {
    /**
     * @docid dxDataGridOptions.selection.deferred
     * @default false
     * @public
     */
    deferred?: boolean;
    /**
     * @docid dxDataGridOptions.selection.selectAllMode
     * @default "allPages"
     * @public
     */
    selectAllMode?: SelectAllMode;
    /**
     * @docid dxDataGridOptions.selection.showCheckBoxesMode
     * @default "onClick"
     * @default "always" &for(Material)
     * @public
     */
    showCheckBoxesMode?: SelectionColumnDisplayMode;
};
/**
 * @docid
 * @inherits GridBase
 * @namespace DevExpress.ui
 * @public
 * @options dxDataGridOptions
 */
export default class dxDataGrid<TRowData = any, TKey = any> extends Widget<dxDataGridOptions<TRowData, TKey>> implements GridBase<TRowData, TKey> {
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
     * @publicName clearGrouping()
     * @public
     */
    clearGrouping(): void;
    /**
     * @docid
     * @publicName collapseAll(groupIndex)
     * @param1 groupIndex:number | undefined
     * @public
     */
    collapseAll(groupIndex?: number): void;
    /**
     * @docid
     * @publicName collapseRow(key)
     * @return Promise<void>
     * @public
     */
    collapseRow(key: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName expandAll(groupIndex)
     * @param1 groupIndex:number | undefined
     * @public
     */
    expandAll(groupIndex?: number): void;
    /**
     * @docid
     * @publicName expandRow(key)
     * @return Promise<void>
     * @public
     */
    expandRow(key: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName getSelectedRowKeys()
     * @return Array<any> | Promise<any>
     * @public
     */
    getSelectedRowKeys(): Array<TKey> & DxPromise<Array<TKey>>;
    /**
     * @docid
     * @publicName getSelectedRowsData()
     * @return Array<any> | Promise<any>
     * @public
     */
    getSelectedRowsData(): Array<TRowData> & DxPromise<Array<TRowData>>;
    /**
     * @docid
     * @publicName getTotalSummaryValue(summaryItemName)
     * @public
     */
    getTotalSummaryValue(summaryItemName: string): any;
    /**
     * @docid
     * @publicName getVisibleColumns()
     * @return Array<dxDataGridColumn>
     * @public
     */
    getVisibleColumns(): Array<Column<TRowData, TKey>>;
    /**
     * @docid
     * @publicName getVisibleColumns(headerLevel)
     * @return Array<dxDataGridColumn>
     * @public
     */
    getVisibleColumns(headerLevel: number): Array<Column<TRowData, TKey>>;
    /**
     * @docid
     * @publicName getVisibleRows()
     * @return Array<dxDataGridRowObject>
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
     * @publicName isRowSelected(data)
     * @public
     */
    isRowSelected(data: TRowData): boolean;
    isRowSelected(key: TKey): boolean;
    /**
     * @docid
     * @publicName totalCount()
     * @return numeric
     * @public
     */
    totalCount(): number;

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

/**
 * @public
 */
export type Column<TRowData = any, TKey = any> = dxDataGridColumn<TRowData, TKey>;

/**
 * @namespace DevExpress.ui
 * @deprecated Use the Column type instead
 */
export interface dxDataGridColumn<TRowData = any, TKey = any> extends ColumnBase<TRowData> {
    /**
     * @docid dxDataGridColumn.allowExporting
     * @default true
     * @public
     */
    allowExporting?: boolean;
    /**
     * @docid dxDataGridColumn.allowGrouping
     * @default true
     * @public
     */
    allowGrouping?: boolean;
    /**
     * @docid dxDataGridColumn.autoExpandGroup
     * @default true
     * @public
     */
    autoExpandGroup?: boolean;
    /**
     * @docid dxDataGridColumn.buttons
     * @type Array<Enums.DataGridPredefinedColumnButton,dxDataGridColumnButton>
     * @public
     */
    buttons?: Array<DataGridPredefinedColumnButton | ColumnButton<TRowData, TKey>>;
    /**
     * @docid dxDataGridColumn.calculateGroupValue
     * @type_function_context GridBaseColumn
     * @type_function_param1 rowData:object
     * @public
     */
    calculateGroupValue?: string | ((this: ColumnBase, rowData: TRowData) => any);
    /**
     * @docid dxDataGridColumn.cellTemplate
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field data:object
     * @type_function_param2_field column:dxDataGridColumn
     * @type_function_param2_field row:dxDataGridRowObject
     * @public
     */
    cellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnCellTemplateData<TRowData, TKey>) => any);
    /**
     * @docid dxDataGridColumn.columns
     * @type Array<dxDataGridColumn|string>
     * @default undefined
     * @public
     */
    columns?: Array<Column<TRowData, TKey> | string>;
    /**
     * @docid dxDataGridColumn.editCellTemplate
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field setValue(newValue, newText):any
     * @type_function_param2_field data:object
     * @type_function_param2_field column:dxDataGridColumn
     * @type_function_param2_field row:dxDataGridRowObject
     * @public
     */
    editCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnEditCellTemplateData<TRowData, TKey>) => any);
    /**
     * @docid dxDataGridColumn.groupCellTemplate
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field data:object
     * @type_function_param2_field column:dxDataGridColumn
     * @type_function_param2_field row:dxDataGridRowObject
     * @type_function_param2_field summaryItems:Array<any>
     * @public
     */
    groupCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnGroupCellTemplateData<TRowData, TKey>) => any);
    /**
     * @docid dxDataGridColumn.groupIndex
     * @default undefined
     * @fires dxDataGridOptions.onOptionChanged
     * @public
     */
    groupIndex?: number;
    /**
     * @docid dxDataGridColumn.headerCellTemplate
     * @type_function_param2 headerInfo:object
     * @type_function_param2_field column:dxDataGridColumn
     * @public
     */
    headerCellTemplate?: template | ((columnHeader: DxElement, headerInfo: ColumnHeaderCellTemplateData<TRowData, TKey>) => any);
    /**
     * @docid dxDataGridColumn.showWhenGrouped
     * @default false
     * @public
     */
    showWhenGrouped?: boolean;
    /**
     * @docid dxDataGridColumn.type
     * @publicName type
     * @public
     */
    type?: DataGridCommandColumnType;
}

/**
 * @public
 */
export type ColumnButton<TRowData = any, TKey = any> = dxDataGridColumnButton<TRowData, TKey>;
/**
 * @namespace DevExpress.ui
 * @deprecated Use the DataGrid's ColumnButton type instead
 */
export interface dxDataGridColumnButton<TRowData = any, TKey = any> extends ColumnButtonBase {
    /**
     * @docid dxDataGridColumnButton.name
     * @public
     */
    name?: DataGridPredefinedColumnButton | string;
    /**
     * @docid dxDataGridColumnButton.onClick
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field model:object
     * @type_function_param1_field event:event
     * @type_function_param1_field row:dxDataGridRowObject
     * @type_function_param1_field column:dxDataGridColumn
     * @public
     */
    onClick?: ((e: ColumnButtonClickEvent<TRowData, TKey>) => void);
    /**
     * @docid dxDataGridColumnButton.template
     * @type_function_param2 cellInfo:object
     * @type_function_param2_field data:object
     * @type_function_param2_field key:any
     * @type_function_param2_field column:dxDataGridColumn
     * @type_function_param2_field row:dxDataGridRowObject
     * @type_function_return string|Element|jQuery
     * @public
     */
    template?: template | ((cellElement: DxElement, cellInfo: ColumnButtonTemplateData<TRowData, TKey>) => string | UserDefinedElement);
    /**
     * @docid dxDataGridColumnButton.visible
     * @default true
     * @type boolean | function
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field row:dxDataGridRowObject
     * @type_function_param1_field column:dxDataGridColumn
     * @public
     */
    visible?: boolean | ((options: { component?: dxDataGrid<TRowData, TKey>; row?: Row<TRowData, TKey>; column?: Column<TRowData, TKey> }) => boolean);
    /**
     * @docid dxDataGridColumnButton.disabled
     * @default false
     * @type boolean | function
     * @type_function_param1_field component:dxDataGrid
     * @type_function_param1_field row:dxDataGridRowObject
     * @type_function_param1_field column:dxDataGridColumn
     * @public
     */
    disabled?: boolean | ((options: { component?: dxDataGrid<TRowData, TKey>; row?: Row<TRowData, TKey>; column?: Column<TRowData, TKey> }) => boolean);
}

/**
 * @namespace DevExpress.ui
 * @deprecated Use Row instead
 */
export type dxDataGridRowObject<TRowData = any, TKey = any> = Row<TRowData, TKey>;

/**
 * @public
 * @docid dxDataGridRowObject
 */
export type Row<TRowData = any, TKey = any> = {
    /**
     * @docid dxDataGridRowObject.data
     * @public
     */
    readonly data: TRowData;
    /**
     * @docid dxDataGridRowObject.groupIndex
     * @public
     */
    readonly groupIndex?: number;
    /**
     * @docid dxDataGridRowObject.isEditing
     * @public
     */
    readonly isEditing?: boolean;
    /**
     * @docid dxDataGridRowObject.isExpanded
     * @public
     */
    readonly isExpanded?: boolean;
    /**
     * @docid dxDataGridRowObject.isNewRow
     * @public
     */
    readonly isNewRow?: boolean;
    /**
     * @docid dxDataGridRowObject.isSelected
     * @public
     */
    readonly isSelected?: boolean;
    /**
     * @docid dxDataGridRowObject.key
     * @public
     */
    readonly key: TKey;
    /**
     * @docid dxDataGridRowObject.rowIndex
     * @public
     */
    readonly rowIndex: number;
    /**
     * @docid dxDataGridRowObject.rowType
     * @public
     */
    readonly rowType: string;
    /**
     * @docid dxDataGridRowObject.values
     * @public
     */
    readonly values: Array<any>;
};

/** @public */
export type ExplicitTypes<TRowData, TKey> = {
  AdaptiveDetailRowPreparingEvent: AdaptiveDetailRowPreparingEvent<TRowData, TKey>;
  CellClickEvent: CellClickEvent<TRowData, TKey>;
  CellDblClickEvent: CellDblClickEvent<TRowData, TKey>;
  CellHoverChangedEvent: CellHoverChangedEvent<TRowData, TKey>;
  CellPreparedEvent: CellPreparedEvent<TRowData, TKey>;
  Column: Column<TRowData, TKey>;
  ColumnButton: ColumnButton<TRowData, TKey>;
  ColumnButtonClickEvent: ColumnButtonClickEvent<TRowData, TKey>;
  ColumnButtonTemplateData: ColumnButtonTemplateData<TRowData, TKey>;
  ColumnCellTemplateData: ColumnCellTemplateData<TRowData, TKey>;
  ColumnEditCellTemplateData: ColumnEditCellTemplateData<TRowData, TKey>;
  ColumnGroupCellTemplateData: ColumnGroupCellTemplateData<TRowData, TKey>;
  ColumnHeaderCellTemplateData: ColumnHeaderCellTemplateData<TRowData, TKey>;
  ContentReadyEvent: ContentReadyEvent<TRowData, TKey>;
  ContextMenuPreparingEvent: ContextMenuPreparingEvent<TRowData, TKey>;
  CustomSummaryInfo: CustomSummaryInfo<TRowData, TKey>;
  DataErrorOccurredEvent: DataErrorOccurredEvent<TRowData, TKey>;
  DataRowTemplateData: DataRowTemplateData<TRowData, TKey>;
  DisposingEvent: DisposingEvent<TRowData, TKey>;
  EditCanceledEvent: EditCanceledEvent<TRowData, TKey>;
  EditCancelingEvent: EditCancelingEvent<TRowData, TKey>;
  Editing: Editing<TRowData, TKey>;
  EditingStartEvent: EditingStartEvent<TRowData, TKey>;
  EditorPreparedEvent: EditorPreparedEvent<TRowData, TKey>;
  EditorPreparingEvent: EditorPreparingEvent<TRowData, TKey>;
  Export: Export;
  ExportingEvent: ExportingEvent<TRowData, TKey>;
  ExportTexts: ExportTexts;
  FocusedCellChangedEvent: FocusedCellChangedEvent<TRowData, TKey>;
  FocusedCellChangingEvent: FocusedCellChangingEvent<TRowData, TKey>;
  FocusedRowChangedEvent: FocusedRowChangedEvent<TRowData, TKey>;
  FocusedRowChangingEvent: FocusedRowChangingEvent<TRowData, TKey>;
  GroupData: GroupData<TRowData>;
  Grouping: Grouping;
  GroupingTexts: GroupingTexts;
  GroupPanel: GroupPanel;
  InitializedEvent: InitializedEvent<TRowData, TKey>;
  InitNewRowEvent: InitNewRowEvent<TRowData, TKey>;
  KeyDownEvent: KeyDownEvent<TRowData, TKey>;
  MasterDetail: MasterDetail<TRowData, TKey>;
  MasterDetailTemplateData: MasterDetailTemplateData<TRowData, TKey>;
  OptionChangedEvent: OptionChangedEvent<TRowData, TKey>;
  Properties: Properties<TRowData, TKey>;
  Row: Row<TRowData, TKey>;
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
  RowTemplateData: RowTemplateData<TRowData, TKey>;
  RowUpdatedEvent: RowUpdatedEvent<TRowData, TKey>;
  RowUpdatingEvent: RowUpdatingEvent<TRowData, TKey>;
  RowValidatingEvent: RowValidatingEvent<TRowData, TKey>;
  SavedEvent: SavedEvent<TRowData, TKey>;
  SavingEvent: SavingEvent<TRowData, TKey>;
  Scrolling: Scrolling;
  Selection: Selection;
  SelectionChangedEvent: SelectionChangedEvent<TRowData, TKey>;
  Summary: Summary<TRowData, TKey>;
  SummaryGroupItem: SummaryGroupItem;
  SummaryItemTextInfo: SummaryItemTextInfo;
  SummaryTexts: SummaryTexts;
  SummaryTotalItem: SummaryTotalItem;
  Toolbar: Toolbar;
  ToolbarItem: ToolbarItem;
  ToolbarPreparingEvent: ToolbarPreparingEvent<TRowData, TKey>;
};

/** @deprecated RowDraggingTemplateData from 'devextreme/common/grids' instead */
export type RowDraggingTemplateDataModel = RowDraggingTemplateData;

/** @public */
export type Properties<TRowData = any, TKey = any> = dxDataGridOptions<TRowData, TKey>;

/** @deprecated use Properties instead */
export type Options<TRowData = any, TKey = any> = dxDataGridOptions<TRowData, TKey>;

///#DEBUG
type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxDataGridOptions.onAdaptiveDetailRowPreparing
 * @type_function_param1 e:{ui/data_grid:AdaptiveDetailRowPreparingEvent}
 */
onAdaptiveDetailRowPreparing?: ((e: AdaptiveDetailRowPreparingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onCellClick
 * @type_function_param1 e:{ui/data_grid:CellClickEvent}
 */
onCellClick?: ((e: CellClickEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onCellDblClick
 * @type_function_param1 e:{ui/data_grid:CellDblClickEvent}
 */
onCellDblClick?: ((e: CellDblClickEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onCellHoverChanged
 * @type_function_param1 e:{ui/data_grid:CellHoverChangedEvent}
 */
onCellHoverChanged?: ((e: CellHoverChangedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onCellPrepared
 * @type_function_param1 e:{ui/data_grid:CellPreparedEvent}
 */
onCellPrepared?: ((e: CellPreparedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onContentReady
 * @type_function_param1 e:{ui/data_grid:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onContextMenuPreparing
 * @type_function_param1 e:{ui/data_grid:ContextMenuPreparingEvent}
 */
onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onDataErrorOccurred
 * @type_function_param1 e:{ui/data_grid:DataErrorOccurredEvent}
 */
onDataErrorOccurred?: ((e: DataErrorOccurredEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onDisposing
 * @type_function_param1 e:{ui/data_grid:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onEditCanceled
 * @type_function_param1 e:{ui/data_grid:EditCanceledEvent}
 */
onEditCanceled?: ((e: EditCanceledEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onEditCanceling
 * @type_function_param1 e:{ui/data_grid:EditCancelingEvent}
 */
onEditCanceling?: ((e: EditCancelingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onEditingStart
 * @type_function_param1 e:{ui/data_grid:EditingStartEvent}
 */
onEditingStart?: ((e: EditingStartEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onEditorPrepared
 * @type_function_param1 e:{ui/data_grid:EditorPreparedEvent}
 */
onEditorPrepared?: ((e: EditorPreparedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onEditorPreparing
 * @type_function_param1 e:{ui/data_grid:EditorPreparingEvent}
 */
onEditorPreparing?: ((e: EditorPreparingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onExporting
 * @type_function_param1 e:{ui/data_grid:ExportingEvent}
 */
onExporting?: ((e: ExportingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onFocusedCellChanged
 * @type_function_param1 e:{ui/data_grid:FocusedCellChangedEvent}
 */
onFocusedCellChanged?: ((e: FocusedCellChangedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onFocusedCellChanging
 * @type_function_param1 e:{ui/data_grid:FocusedCellChangingEvent}
 */
onFocusedCellChanging?: ((e: FocusedCellChangingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onFocusedRowChanged
 * @type_function_param1 e:{ui/data_grid:FocusedRowChangedEvent}
 */
onFocusedRowChanged?: ((e: FocusedRowChangedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onFocusedRowChanging
 * @type_function_param1 e:{ui/data_grid:FocusedRowChangingEvent}
 */
onFocusedRowChanging?: ((e: FocusedRowChangingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onInitialized
 * @type_function_param1 e:{ui/data_grid:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onInitNewRow
 * @type_function_param1 e:{ui/data_grid:InitNewRowEvent}
 */
onInitNewRow?: ((e: InitNewRowEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onKeyDown
 * @type_function_param1 e:{ui/data_grid:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onOptionChanged
 * @type_function_param1 e:{ui/data_grid:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowClick
 * @type_function_param1 e:{ui/data_grid:RowClickEvent}
 */
onRowClick?: ((e: RowClickEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowCollapsed
 * @type_function_param1 e:{ui/data_grid:RowCollapsedEvent}
 */
onRowCollapsed?: ((e: RowCollapsedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowCollapsing
 * @type_function_param1 e:{ui/data_grid:RowCollapsingEvent}
 */
onRowCollapsing?: ((e: RowCollapsingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowDblClick
 * @type_function_param1 e:{ui/data_grid:RowDblClickEvent}
 */
onRowDblClick?: ((e: RowDblClickEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowExpanded
 * @type_function_param1 e:{ui/data_grid:RowExpandedEvent}
 */
onRowExpanded?: ((e: RowExpandedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowExpanding
 * @type_function_param1 e:{ui/data_grid:RowExpandingEvent}
 */
onRowExpanding?: ((e: RowExpandingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowInserted
 * @type_function_param1 e:{ui/data_grid:RowInsertedEvent}
 */
onRowInserted?: ((e: RowInsertedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowInserting
 * @type_function_param1 e:{ui/data_grid:RowInsertingEvent}
 */
onRowInserting?: ((e: RowInsertingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowPrepared
 * @type_function_param1 e:{ui/data_grid:RowPreparedEvent}
 */
onRowPrepared?: ((e: RowPreparedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowRemoved
 * @type_function_param1 e:{ui/data_grid:RowRemovedEvent}
 */
onRowRemoved?: ((e: RowRemovedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowRemoving
 * @type_function_param1 e:{ui/data_grid:RowRemovingEvent}
 */
onRowRemoving?: ((e: RowRemovingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowUpdated
 * @type_function_param1 e:{ui/data_grid:RowUpdatedEvent}
 */
onRowUpdated?: ((e: RowUpdatedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowUpdating
 * @type_function_param1 e:{ui/data_grid:RowUpdatingEvent}
 */
onRowUpdating?: ((e: RowUpdatingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onRowValidating
 * @type_function_param1 e:{ui/data_grid:RowValidatingEvent}
 */
onRowValidating?: ((e: RowValidatingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onSaved
 * @type_function_param1 e:{ui/data_grid:SavedEvent}
 */
onSaved?: ((e: SavedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onSaving
 * @type_function_param1 e:{ui/data_grid:SavingEvent}
 */
onSaving?: ((e: SavingEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onSelectionChanged
 * @type_function_param1 e:{ui/data_grid:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @skip
 * @docid dxDataGridOptions.onToolbarPreparing
 * @type_function_param1 e:{ui/data_grid:ToolbarPreparingEvent}
 */
onToolbarPreparing?: ((e: ToolbarPreparingEvent) => void);
};
///#ENDDEBUG
