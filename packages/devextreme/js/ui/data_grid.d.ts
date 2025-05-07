import { DataSource } from '../common/data';

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
    HorizontalAlignment,
    Mode,
    Scrollable,
    SelectAllMode,
    SortOrder,
    ToolbarItemLocation,
} from '../common';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    dxToolbarItem,
} from './toolbar';

import Widget, {
} from './widget/ui.widget';

import {
  Format,
} from '../localization';

import {
    AdaptiveDetailRowPreparingInfo,
    ColumnBase as ComponentColumnBase,
    ColumnButtonBase as ComponentColumnButtonBase,
    EditingBase as ComponentEditingBase,
    EditingTextsBase as ComponentEditingTextsBase,
    DataChangeInfo,
    DataErrorOccurredInfo,
    DragDropInfo,
    DragReorderInfo,
    DragStartEventInfo,
    FilterPanel as ComponentFilterPanel,
    FilterPanelCustomizeTextArg as ComponentFilterPanelCustomizeTextArg,
    GridBase,
    GridBaseOptions,
    GroupExpandMode,
    KeyDownInfo,
    NewRowInfo,
    NewRowPosition,
    PagingBase as ComponentPaging,
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
    ScrollingBase as ComponentScrollingBase,
    SelectionBase as ComponentSelectionBase,
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
    FixedPosition,
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
    DataChangeInfo,
    DataErrorOccurredInfo,
    DragDropInfo,
    DragReorderInfo,
    DragStartEventInfo,
    KeyDownInfo,
    NewRowInfo,
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
    SelectionChangedInfo,
    ToolbarPreparingInfo,
} from '../common/grids';

/** @deprecated Use Column instead */
export type ColumnBase<TRowData = any> = ComponentColumnBase<TRowData>;
/** @deprecated Use ColumnButton instead */
export type ColumnButtonBase = ComponentColumnButtonBase;
/** @deprecated Use Editing instead */
export type EditingBase<TRowData = any, TKey = any> = ComponentEditingBase<TRowData, TKey>;
/** @deprecated Use EditingTexts instead */
export type EditingTextsBase = ComponentEditingTextsBase;
/** @deprecated Use Paging instead */
export type PagingBase = ComponentPaging;
/** @deprecated Use Scrolling instead */
export type ScrollingBase = ComponentScrollingBase;
/** @deprecated Use Selection instead */
export type SelectionBase = ComponentSelectionBase;

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
 * @namespace DevExpress.ui
 * @deprecated Use Editing instead
 */
export type GridBaseEditing<TRowData = any, TKey = any> = EditingBase<TRowData, TKey>;

/**
 * @namespace DevExpress.ui
 * @deprecated Use EditingTexts instead
 */
export type GridBaseEditingTexts = EditingTextsBase;

/**
 * @namespace DevExpress.ui
 * @deprecated Use Paging instead
 */
export type GridBasePaging = ComponentPaging;

/**
 * @namespace DevExpress.ui
 * @deprecated Use Scrolling instead
 */
export type GridBaseScrolling = ScrollingBase;

/**
 * @namespace DevExpress.ui
 * @deprecated Use Selection instead
 */
export type GridBaseSelection = SelectionBase;

/**
 * @namespace DevExpress.ui
 * @deprecated Use Column instead
 */
export type GridBaseColumn<TRowData = any> = ColumnBase<TRowData>;

/**
 * @namespace DevExpress.ui
 * @deprecated Use ColumnButton instead
 */
export type GridBaseColumnButton = ColumnButtonBase;

/**
 * @docid _ui_data_grid_AdaptiveDetailRowPreparingEvent
 * @public
 * @type object
 * @inherits EventInfo,AdaptiveDetailRowPreparingInfo
 */
export type AdaptiveDetailRowPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & AdaptiveDetailRowPreparingInfo;

/**
 * @docid _ui_data_grid_CellClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CellClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * @docid _ui_data_grid_CellClickEvent.data
   * @type object
   */
  readonly data: TRowData;
  /**
   * @docid _ui_data_grid_CellClickEvent.key
   * @type any
   */
  readonly key: TKey;
  /** @docid _ui_data_grid_CellClickEvent.value */
  readonly value?: any;
  /** @docid _ui_data_grid_CellClickEvent.displayValue */
  readonly displayValue?: any;
  /** @docid _ui_data_grid_CellClickEvent.text */
  readonly text: string;
  /** @docid _ui_data_grid_CellClickEvent.columnIndex */
  readonly columnIndex: number;
  /**
   * @docid _ui_data_grid_CellClickEvent.column
   * @type object
   */
  readonly column: Column<TRowData, TKey>;
  /** @docid _ui_data_grid_CellClickEvent.rowIndex */
  readonly rowIndex: number;
  /** @docid _ui_data_grid_CellClickEvent.rowType */
  readonly rowType: string;
  /** @docid _ui_data_grid_CellClickEvent.cellElement */
  readonly cellElement: DxElement;
  /**
   * @docid _ui_data_grid_CellClickEvent.row
   * @type dxDataGridRowObject
   */
  readonly row: Row<TRowData, TKey>;
};

/**
 * @docid _ui_data_grid_CellDblClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CellDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * @docid _ui_data_grid_CellDblClickEvent.data
   * @type object
   */
  readonly data: TRowData;
  /**
   * @docid _ui_data_grid_CellDblClickEvent.key
   * @type any
   */
  readonly key: TKey;
  /** @docid _ui_data_grid_CellDblClickEvent.value */
  readonly value?: any;
  /** @docid _ui_data_grid_CellDblClickEvent.displayValue */
  readonly displayValue?: any;
  /** @docid _ui_data_grid_CellDblClickEvent.text */
  readonly text: string;
  /** @docid _ui_data_grid_CellDblClickEvent.columnIndex */
  readonly columnIndex: number;
  /**
   * @docid _ui_data_grid_CellDblClickEvent.column
   * @type dxDataGridColumn
   */
  readonly column: Column<TRowData, TKey>;
  /** @docid _ui_data_grid_CellDblClickEvent.rowIndex */
  readonly rowIndex: number;
  /** @docid _ui_data_grid_CellDblClickEvent.rowType */
  readonly rowType: string;
  /** @docid _ui_data_grid_CellDblClickEvent.cellElement */
  readonly cellElement: DxElement;
  /**
   * @docid _ui_data_grid_CellDblClickEvent.row
   * @type dxDataGridRowObject
   */
  readonly row: Row<TRowData, TKey>;
};

/**
 * @docid _ui_data_grid_CellHoverChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type CellHoverChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /** @docid _ui_data_grid_CellHoverChangedEvent.eventType */
  readonly eventType: string;
  /**
   * @docid _ui_data_grid_CellHoverChangedEvent.data
   * @type object
   */
  readonly data: TRowData;
  /** @docid _ui_data_grid_CellHoverChangedEvent.key */
  readonly key: TKey;
  /** @docid _ui_data_grid_CellHoverChangedEvent.value */
  readonly value?: any;
  /** @docid _ui_data_grid_CellHoverChangedEvent.text */
  readonly text: string;
  /** @docid _ui_data_grid_CellHoverChangedEvent.displayValue */
  readonly displayValue?: any;
  /** @docid _ui_data_grid_CellHoverChangedEvent.columnIndex */
  readonly columnIndex: number;
  /** @docid _ui_data_grid_CellHoverChangedEvent.rowIndex */
  readonly rowIndex: number;
  /**
   * @docid _ui_data_grid_CellHoverChangedEvent.column
   * @type dxDataGridColumn
   */
  readonly column: Column<TRowData, TKey>;
  /** @docid _ui_data_grid_CellHoverChangedEvent.rowType */
  readonly rowType: string;
  /** @docid _ui_data_grid_CellHoverChangedEvent.cellElement */
  readonly cellElement: DxElement;
  /**
   * @docid _ui_data_grid_CellHoverChangedEvent.row
   * @type dxDataGridRowObject
   */
  readonly row: Row<TRowData, TKey>;
};

/**
 * @docid _ui_data_grid_CellPreparedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type CellPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * @docid _ui_data_grid_CellPreparedEvent.data
   * @type object
   */
  readonly data: TRowData;
  /** @docid _ui_data_grid_CellPreparedEvent.key */
  readonly key: TKey;
  /** @docid _ui_data_grid_CellPreparedEvent.value */
  readonly value?: any;
  /** @docid _ui_data_grid_CellPreparedEvent.displayValue */
  readonly displayValue?: any;
  /** @docid _ui_data_grid_CellPreparedEvent.text */
  readonly text: string;
  /** @docid _ui_data_grid_CellPreparedEvent.columnIndex */
  readonly columnIndex: number;
  /**
   * @docid _ui_data_grid_CellPreparedEvent.column
   * @type dxDataGridColumn
   */
  readonly column: Column<TRowData, TKey>;
  /** @docid _ui_data_grid_CellPreparedEvent.rowIndex */
  readonly rowIndex: number;
  /** @docid _ui_data_grid_CellPreparedEvent.rowType */
  readonly rowType: string;
  /**
   * @docid _ui_data_grid_CellPreparedEvent.row
   * @type dxDataGridRowObject
   */
  readonly row: Row<TRowData, TKey>;
  /** @docid _ui_data_grid_CellPreparedEvent.isSelected */
  readonly isSelected?: boolean;
  /** @docid _ui_data_grid_CellPreparedEvent.isExpanded */
  readonly isExpanded?: boolean;
  /** @docid _ui_data_grid_CellPreparedEvent.isNewRow */
  readonly isNewRow?: boolean;
  /** @docid _ui_data_grid_CellPreparedEvent.cellElement */
  readonly cellElement: DxElement;
  /** @docid _ui_data_grid_CellPreparedEvent.watch */
  readonly watch?: Function;
  /** @docid _ui_data_grid_CellPreparedEvent.oldValue */
  readonly oldValue?: any;
};

/**
 * @docid _ui_data_grid_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>>;

/**
 * @docid _ui_data_grid_ContextMenuPreparingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContextMenuPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * @docid _ui_data_grid_ContextMenuPreparingEvent.items
   * @type Array<Object>
   */
  items?: Array<any>;
  /** @docid _ui_data_grid_ContextMenuPreparingEvent.target */
  readonly target: string;
  /** @docid _ui_data_grid_ContextMenuPreparingEvent.targetElement */
  readonly targetElement: DxElement;
  /** @docid _ui_data_grid_ContextMenuPreparingEvent.columnIndex */
  readonly columnIndex: number;
  /**
   * @docid _ui_data_grid_ContextMenuPreparingEvent.column
   * @type dxDataGridColumn
   */
  readonly column?: Column<TRowData, TKey>;
  /** @docid _ui_data_grid_ContextMenuPreparingEvent.rowIndex */
  readonly rowIndex: number;
  /**
   * @docid _ui_data_grid_ContextMenuPreparingEvent.row
   * @type dxDataGridRowObject
   */
  readonly row?: Row<TRowData, TKey>;
};

/**
 * @docid _ui_data_grid_DataErrorOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo,DataErrorOccurredInfo
 */
export type DataErrorOccurredEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & DataErrorOccurredInfo;

/**
 * @docid _ui_data_grid_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>>;

/**
 * @docid _ui_data_grid_EditCanceledEvent
 * @public
 * @type object
 * @inherits EventInfo,DataChangeInfo
 */
export type EditCanceledEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_EditCancelingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo,DataChangeInfo
 */
export type EditCancelingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_EditingStartEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type EditingStartEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * @docid _ui_data_grid_EditingStartEvent.data
   * @type object
   */
  readonly data: TRowData;
  /**
   * @docid _ui_data_grid_EditingStartEvent.key
   * @type any
   */
  readonly key: TKey;
  /**
   * @docid _ui_data_grid_EditingStartEvent.column
   * @type object
   */
  readonly column?: Column<TRowData, TKey>;
};

/**
 * @docid _ui_data_grid_EditorPreparedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type EditorPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /** @docid _ui_data_grid_EditorPreparedEvent.parentType */
  readonly parentType: string;
  /** @docid _ui_data_grid_EditorPreparedEvent.value */
  readonly value?: any;
  /** @docid _ui_data_grid_EditorPreparedEvent.setValue */
  readonly setValue?: any;
  /** @docid _ui_data_grid_EditorPreparedEvent.updateValueTimeout */
  readonly updateValueTimeout?: number;
  /** @docid _ui_data_grid_EditorPreparedEvent.width */
  readonly width?: number;
  /** @docid _ui_data_grid_EditorPreparedEvent.disabled */
  readonly disabled: boolean;
  /** @docid _ui_data_grid_EditorPreparedEvent.rtlEnabled */
  readonly rtlEnabled: boolean;
  /** @docid _ui_data_grid_EditorPreparedEvent.editorElement */
  readonly editorElement: DxElement;
  /** @docid _ui_data_grid_EditorPreparedEvent.readOnly */
  readonly readOnly: boolean;
  /** @docid _ui_data_grid_EditorPreparedEvent.dataField */
  readonly dataField?: string;
  /**
   * @docid _ui_data_grid_EditorPreparedEvent.row
   * @type dxDataGridRowObject
   */
  readonly row?: Row<TRowData, TKey>;
};

/**
 * @docid _ui_data_grid_EditorPreparingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type EditorPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /** @docid _ui_data_grid_EditorPreparingEvent.parentType */
  readonly parentType: string;
  /** @docid _ui_data_grid_EditorPreparingEvent.value */
  readonly value?: any;
  /** @docid _ui_data_grid_EditorPreparingEvent.setValue */
  readonly setValue?: any;
  /** @docid _ui_data_grid_EditorPreparingEvent.updateValueTimeout */
  readonly updateValueTimeout?: number;
  /** @docid _ui_data_grid_EditorPreparingEvent.width */
  readonly width?: number;
  /** @docid _ui_data_grid_EditorPreparingEvent.disabled */
  readonly disabled: boolean;
  /** @docid _ui_data_grid_EditorPreparingEvent.rtlEnabled */
  readonly rtlEnabled: boolean;
  /** @docid _ui_data_grid_EditorPreparingEvent.cancel */
  cancel: boolean;
  /** @docid _ui_data_grid_EditorPreparingEvent.editorElement */
  readonly editorElement: DxElement;
  /** @docid _ui_data_grid_EditorPreparingEvent.readOnly */
  readonly readOnly: boolean;
  /** @docid _ui_data_grid_EditorPreparingEvent.editorName */
  editorName: string;
  /**
   * @docid _ui_data_grid_EditorPreparingEvent.editorOptions
   * @type object
   */
  editorOptions: any;
  /** @docid _ui_data_grid_EditorPreparingEvent.dataField */
  readonly dataField?: string;
  /**
   * @docid _ui_data_grid_EditorPreparingEvent.row
   * @type dxDataGridRowObject
   */
  readonly row?: Row<TRowData, TKey>;
};

/**
 * @docid _ui_data_grid_ExportingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ExportingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & {
  /** @docid _ui_data_grid_ExportingEvent.fileName */
  fileName?: string;
  /** @docid _ui_data_grid_ExportingEvent.selectedRowsOnly */
  selectedRowsOnly: boolean;
  /**
   * @docid _ui_data_grid_ExportingEvent.format
   * @type Enums.DataGridExportFormat|string
   */
  format: DataGridExportFormat | string;
};

/**
 * @docid _ui_data_grid_FocusedCellChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type FocusedCellChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /** @docid _ui_data_grid_FocusedCellChangedEvent.cellElement */
  readonly cellElement: DxElement;
  /** @docid _ui_data_grid_FocusedCellChangedEvent.columnIndex */
  readonly columnIndex: number;
  /** @docid _ui_data_grid_FocusedCellChangedEvent.rowIndex */
  readonly rowIndex: number;
  /**
   * @docid _ui_data_grid_FocusedCellChangedEvent.row
   * @type dxDataGridRowObject
   */
  readonly row?: Row<TRowData, TKey>;
  /**
   * @docid _ui_data_grid_FocusedCellChangedEvent.column
   * @type dxDataGridColumn
   */
  readonly column?: Column<TRowData, TKey>;
};

/**
 * @docid _ui_data_grid_FocusedCellChangingEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type FocusedCellChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxDataGrid<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
  /** @docid _ui_data_grid_FocusedCellChangingEvent.cellElement */
  readonly cellElement: DxElement;
  /** @docid _ui_data_grid_FocusedCellChangingEvent.prevColumnIndex */
  readonly prevColumnIndex: number;
  /** @docid _ui_data_grid_FocusedCellChangingEvent.prevRowIndex */
  readonly prevRowIndex: number;
  /** @docid _ui_data_grid_FocusedCellChangingEvent.newColumnIndex */
  newColumnIndex: number;
  /** @docid _ui_data_grid_FocusedCellChangingEvent.newRowIndex */
  newRowIndex: number;
  /**
   * @docid _ui_data_grid_FocusedCellChangingEvent.rows
   * @type Array<dxDataGridRowObject>
   */
  readonly rows: Array<Row<TRowData, TKey>>;
  /**
   * @docid _ui_data_grid_FocusedCellChangingEvent.columns
   * @type Array<dxDataGridColumn>
   */
  readonly columns: Array<Column<TRowData, TKey>>;
  /** @docid _ui_data_grid_FocusedCellChangingEvent.isHighlighted */
  isHighlighted: boolean;
};

/**
 * @docid _ui_data_grid_FocusedRowChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type FocusedRowChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /** @docid _ui_data_grid_FocusedRowChangedEvent.rowElement */
  readonly rowElement: DxElement;
  /** @docid _ui_data_grid_FocusedRowChangedEvent.rowIndex */
  readonly rowIndex: number;
  /**
   * @docid _ui_data_grid_FocusedRowChangedEvent.row
   * @type dxDataGridRowObject
   */
  readonly row?: Row<TRowData, TKey>;
};

/**
 * @docid _ui_data_grid_FocusedRowChangingEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type FocusedRowChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxDataGrid<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
  /** @docid _ui_data_grid_FocusedRowChangingEvent.rowElement */
  readonly rowElement: DxElement;
  /** @docid _ui_data_grid_FocusedRowChangingEvent.prevRowIndex */
  readonly prevRowIndex: number;
  /** @docid _ui_data_grid_FocusedRowChangingEvent.newRowIndex */
  newRowIndex: number;
  /**
   * @docid _ui_data_grid_FocusedRowChangingEvent.rows
   * @type Array<dxDataGridRowObject>
   */
  readonly rows: Array<Row<TRowData, TKey>>;
};

/**
 * @docid _ui_data_grid_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent<TRowData = any, TKey = any> = InitializedEventInfo<dxDataGrid<TRowData, TKey>>;

/**
 * @docid _ui_data_grid_InitNewRowEvent
 * @public
 * @type object
 * @inherits EventInfo,NewRowInfo
 */
export type InitNewRowEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & NewRowInfo<TRowData>;

/**
 * @docid _ui_data_grid_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,KeyDownInfo
 */
export type KeyDownEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, KeyboardEvent> & KeyDownInfo;

/**
 * @docid _ui_data_grid_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & ChangedOptionInfo;

/**
 * @docid _ui_data_grid_RowClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type RowClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * @docid _ui_data_grid_RowClickEvent.data
   * @type object
   */
  readonly data: TRowData;
  /**
   * @docid _ui_data_grid_RowClickEvent.key
   * @type any
   */
  readonly key: TKey;
  /**
   * @docid _ui_data_grid_RowClickEvent.values
   * @type Array<any>
   */
  readonly values: Array<any>;
  /**
   * @docid _ui_data_grid_RowClickEvent.columns
   * @type Array<Object>
   */
  readonly columns: Array<Column<TRowData, TKey>>;
  /** @docid _ui_data_grid_RowClickEvent.rowIndex */
  readonly rowIndex: number;
  /** @docid _ui_data_grid_RowClickEvent.rowType */
  readonly rowType: string;
  /** @docid _ui_data_grid_RowClickEvent.isSelected */
  readonly isSelected?: boolean;
  /** @docid _ui_data_grid_RowClickEvent.isExpanded */
  readonly isExpanded?: boolean;
  /** @docid _ui_data_grid_RowClickEvent.isNewRow */
  readonly isNewRow?: boolean;
  /** @docid _ui_data_grid_RowClickEvent.groupIndex */
  readonly groupIndex?: number;
  /** @docid _ui_data_grid_RowClickEvent.rowElement */
  readonly rowElement: DxElement;
  /** @docid _ui_data_grid_RowClickEvent.handled */
  readonly handled: boolean;
};

/**
 * @docid _ui_data_grid_RowCollapsedEvent
 * @public
 * @type object
 * @inherits EventInfo,RowKeyInfo
 */
export type RowCollapsedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * @docid _ui_data_grid_RowCollapsingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo,RowKeyInfo
 */
export type RowCollapsingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * @docid _ui_data_grid_RowDblClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type RowDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * @docid _ui_data_grid_RowDblClickEvent.data
   * @type object
   */
  readonly data: TRowData;
  /**
   * @docid _ui_data_grid_RowDblClickEvent.key
   * @type any
   */
  readonly key: TKey;
  /**
   * @docid _ui_data_grid_RowDblClickEvent.values
   * @type Array<any>
   */
  readonly values: Array<any>;
  /**
   * @docid _ui_data_grid_RowDblClickEvent.columns
   * @type Array<dxDataGridColumn>
   */
  readonly columns: Array<Column<TRowData, TKey>>;
  /** @docid _ui_data_grid_RowDblClickEvent.rowIndex */
  readonly rowIndex: number;
  /** @docid _ui_data_grid_RowDblClickEvent.rowType */
  readonly rowType: string;
  /** @docid _ui_data_grid_RowDblClickEvent.isSelected */
  readonly isSelected?: boolean;
  /** @docid _ui_data_grid_RowDblClickEvent.isExpanded */
  readonly isExpanded?: boolean;
  /** @docid _ui_data_grid_RowDblClickEvent.isNewRow */
  readonly isNewRow?: boolean;
  /** @docid _ui_data_grid_RowDblClickEvent.groupIndex */
  readonly groupIndex?: number;
  /** @docid _ui_data_grid_RowDblClickEvent.rowElement */
  readonly rowElement: DxElement;
};

/**
 * @docid _ui_data_grid_RowExpandedEvent
 * @public
 * @type object
 * @inherits EventInfo,RowKeyInfo
 */
export type RowExpandedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * @docid _ui_data_grid_RowExpandingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo,RowKeyInfo
 */
export type RowExpandingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * @docid _ui_data_grid_RowInsertedEvent
 * @public
 * @type object
 * @inherits EventInfo,RowInsertedInfo
 */
export type RowInsertedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowInsertedInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_RowInsertingEvent
 * @public
 * @type object
 * @inherits EventInfo,RowInsertingInfo
 */
export type RowInsertingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowInsertingInfo<TRowData>;

/**
 * @docid _ui_data_grid_RowPreparedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type RowPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * @docid _ui_data_grid_RowPreparedEvent.data
   * @type object
   */
  readonly data: TRowData;
  /**
   * @docid _ui_data_grid_RowPreparedEvent.key
   * @type any
   */
  readonly key: TKey;
  /**
   * @docid _ui_data_grid_RowPreparedEvent.values
   * @type Array<any>
   */
  readonly values: Array<any>;
  /**
   * @docid _ui_data_grid_RowPreparedEvent.columns
   * @type Array<dxDataGridColumn>
   */
  readonly columns: Array<Column<TRowData, TKey>>;
  /** @docid _ui_data_grid_RowPreparedEvent.rowIndex */
  readonly rowIndex: number;
  /** @docid _ui_data_grid_RowPreparedEvent.rowType */
  readonly rowType: string;
  /** @docid _ui_data_grid_RowPreparedEvent.groupIndex */
  readonly groupIndex?: number;
  /** @docid _ui_data_grid_RowPreparedEvent.isSelected */
  readonly isSelected?: boolean;
  /** @docid _ui_data_grid_RowPreparedEvent.isExpanded */
  readonly isExpanded?: boolean;
  /** @docid _ui_data_grid_RowPreparedEvent.isNewRow */
  readonly isNewRow?: boolean;
  /** @docid _ui_data_grid_RowPreparedEvent.rowElement */
  readonly rowElement: DxElement;
};

/**
 * @docid _ui_data_grid_RowRemovedEvent
 * @public
 * @type object
 * @inherits EventInfo,RowRemovedInfo
 */
export type RowRemovedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowRemovedInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_RowRemovingEvent
 * @public
 * @type object
 * @inherits EventInfo,RowRemovingInfo
 */
export type RowRemovingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowRemovingInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_RowUpdatedEvent
 * @public
 * @type object
 * @inherits EventInfo,RowUpdatedInfo
 */
export type RowUpdatedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowUpdatedInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_RowUpdatingEvent
 * @public
 * @type object
 * @inherits EventInfo,RowUpdatingInfo
 */
export type RowUpdatingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowUpdatingInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_RowValidatingEvent
 * @public
 * @type object
 * @inherits EventInfo,RowValidatingInfo
 */
export type RowValidatingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowValidatingInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_SavedEvent
 * @public
 * @type object
 * @inherits EventInfo,DataChangeInfo
 */
export type SavedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_SavingEvent
 * @public
 * @type object
 * @inherits EventInfo,SavingInfo
 */
export type SavingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & SavingInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,_common_grids_SelectionChangedInfo
 */
export type SelectionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & SelectionChangedInfo<TRowData, TKey>;

/**
 * @docid _ui_data_grid_ToolbarPreparingEvent
 * @public
 * @type object
 * @inherits EventInfo,ToolbarPreparingInfo
 */
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

/**
 * @docid _ui_data_grid_ColumnButtonClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ColumnButtonClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * @docid _ui_data_grid_ColumnButtonClickEvent.row
   * @type dxDataGridRowObject
   */
  row?: Row<TRowData, TKey>;
  /**
   * @docid _ui_data_grid_ColumnButtonClickEvent.column
   * @type dxDataGridColumn
   */
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
    columns?: Array<Column<TRowData, TKey> | string> | undefined;
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
    keyExpr?: string | Array<string> | undefined;
    /**
     * @docid
     * @type object
     * @public
     */
    masterDetail?: MasterDetail<TRowData, TKey>;
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:CellClickEvent}
     * @default null
     * @action
     * @public
     */
    onCellClick?: ((e: CellClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:CellDblClickEvent}
     * @default null
     * @action
     * @public
     */
    onCellDblClick?: ((e: CellDblClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:CellHoverChangedEvent}
     * @default null
     * @action
     * @public
     */
    onCellHoverChanged?: ((e: CellHoverChangedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:CellPreparedEvent}
     * @default null
     * @action
     * @public
     */
    onCellPrepared?: ((e: CellPreparedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:ContextMenuPreparingEvent}
     * @default null
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:EditingStartEvent}
     * @default null
     * @action
     * @public
     */
    onEditingStart?: ((e: EditingStartEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:EditorPreparedEvent}
     * @default null
     * @action
     * @public
     */
    onEditorPrepared?: ((options: EditorPreparedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:EditorPreparingEvent}
     * @default null
     * @action
     * @public
     */
    onEditorPreparing?: ((e: EditorPreparingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:ExportingEvent}
     * @default null
     * @action
     * @public
     */
    onExporting?: ((e: ExportingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:FocusedCellChangedEvent}
     * @default null
     * @action
     * @public
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:FocusedCellChangingEvent}
     * @default null
     * @action
     * @public
     */
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:FocusedRowChangedEvent}
     * @default null
     * @action
     * @public
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:FocusedRowChangingEvent}
     * @default null
     * @action
     * @public
     */
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:RowClickEvent}
     * @default null
     * @action
     * @public
     */
    onRowClick?: ((e: RowClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:RowDblClickEvent}
     * @default null
     * @action
     * @public
     */
    onRowDblClick?: ((e: RowDblClickEvent<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/data_grid:RowPreparedEvent}
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
    sortByGroupSummaryInfo?: Array<SortByGroupSummaryInfoItem> | undefined;
    /**
     * @docid
     * @type object
     * @public
     */
    summary?: Summary<TRowData, TKey>;
    /**
     * @docid
     * @type dxDataGridToolbar | undefined
     * @default undefined
     * @public
     */
    toolbar?: Toolbar | undefined;
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
 * @public
 * @docid dxDataGridSortByGroupSummaryInfoItem
 */
export type SortByGroupSummaryInfoItem = {
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo.groupColumn
     * @default undefined
     */
    groupColumn?: string | undefined;
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo.sortOrder
     * @default undefined
     * @acceptValues undefined
     */
    sortOrder?: SortOrder | undefined;
    /**
     * @docid dxDataGridOptions.sortByGroupSummaryInfo.summaryItem
     * @default undefined
     */
    summaryItem?: string | number | undefined;
};

/** @public */
export type CustomSummaryInfo<TRowData = any, TKey = any> = {
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly name?: string;
  readonly summaryProcess: string;
  readonly value?: any;
  totalValue?: any;
  readonly groupIndex?: number;
};

/**
 * @public
 */
export type Paging = ComponentPaging;

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
  groupItems?: Array<SummaryGroupItem> | undefined;
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
  totalItems?: Array<SummaryTotalItem> | undefined;
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
    column?: string | undefined;
    /**
     * @docid dxDataGridOptions.summary.groupItems.customizeText
     * @type_function_param1 itemInfo:object
     */
    customizeText?: ((itemInfo: SummaryItemTextInfo) => string);
    /**
     * @docid dxDataGridOptions.summary.groupItems.displayFormat
     * @default undefined
     */
    displayFormat?: string | undefined;
    /**
     * @docid dxDataGridOptions.summary.groupItems.name
     * @default undefined
     */
    name?: string | undefined;
    /**
     * @docid dxDataGridOptions.summary.groupItems.showInColumn
     * @default undefined
     */
    showInColumn?: string | undefined;
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
    summaryType?: SummaryType | string | undefined;
    /**
     * @docid dxDataGridOptions.summary.groupItems.valueFormat
     * @default undefined
     */
    valueFormat?: Format | undefined;
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
  alignment?: HorizontalAlignment | undefined;
  /**
   * @docid dxDataGridOptions.summary.totalItems.column
   * @default undefined
   */
  column?: string | undefined;
  /**
   * @docid dxDataGridOptions.summary.totalItems.cssClass
   * @default undefined
   */
  cssClass?: string | undefined;
  /**
   * @docid dxDataGridOptions.summary.totalItems.customizeText
   * @type_function_param1 itemInfo:object
   */
  customizeText?: ((itemInfo: SummaryItemTextInfo) => string);
  /**
   * @docid dxDataGridOptions.summary.totalItems.displayFormat
   * @default undefined
   */
  displayFormat?: string | undefined;
  /**
   * @docid dxDataGridOptions.summary.totalItems.name
   * @default undefined
   */
  name?: string | undefined;
  /**
   * @docid dxDataGridOptions.summary.totalItems.showInColumn
   * @default undefined
   */
  showInColumn?: string | undefined;
  /**
   * @docid dxDataGridOptions.summary.totalItems.skipEmptyValues
   */
  skipEmptyValues?: boolean;
  /**
   * @docid dxDataGridOptions.summary.totalItems.summaryType
   * @default undefined
   */
  summaryType?: SummaryType | string | undefined;
  /**
   * @docid dxDataGridOptions.summary.totalItems.valueFormat
   * @default undefined
   */
  valueFormat?: Format | undefined;
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
  visible?: boolean | undefined;
  /**
   * @docid dxDataGridToolbar.disabled
   * @default false
   * @public
   */
  disabled?: boolean;
};

/**
 * @namespace DevExpress.ui
 * @deprecated Use Editing instead
 */
export type dxDataGridEditing<TRowData, TKey = any> = Editing<TRowData, TKey>;

/**
 * @docid dxDataGridEditing
 * @public
 * @type object
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
 */
export type EditingTexts = ComponentEditingTextsBase;

/**
 * @namespace DevExpress.ui
 * @deprecated Use Scrolling instead
 */
export type dxDataGridScrolling = Scrolling;

/**
 * @docid dxDataGridScrolling
 * @public
 * @type object
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
 * @namespace DevExpress.ui
 * @deprecated Use Selection instead
 */
export type dxDataGridSelection = Selection;

/** @public */
export type SelectionSensitivity = 'base' | 'accent' | 'case' | 'variant';

/** @public */
export type Selection = SelectionBase & {
    /**
     * @docid dxDataGridOptions.selection.deferred
     * @default false
     * @public
     */
    deferred?: boolean;
    /**
      * @docid dxDataGridOptions.selection.sensitivity
      * @default "base"
      * @public
    */
    sensitivity?: SelectionSensitivity;
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
     * @default "always" &for(Fluent)
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
    columns?: Array<Column<TRowData, TKey> | string> | undefined;
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
    groupIndex?: number | undefined;
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
     * @type_function_param1 e:{ui/data_grid:ColumnButtonClickEvent}
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
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onCellClick' | 'onCellDblClick' | 'onCellHoverChanged' | 'onCellPrepared' | 'onContextMenuPreparing' | 'onEditingStart' | 'onEditorPrepared' | 'onEditorPreparing' | 'onExporting' | 'onFocusedCellChanged' | 'onFocusedCellChanging' | 'onFocusedRowChanged' | 'onFocusedRowChanging' | 'onRowClick' | 'onRowDblClick' | 'onRowPrepared'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxDataGridOptions.onAdaptiveDetailRowPreparing
 * @type_function_param1 e:{ui/data_grid:AdaptiveDetailRowPreparingEvent}
 */
onAdaptiveDetailRowPreparing?: ((e: AdaptiveDetailRowPreparingEvent) => void);
/**
 * @docid dxDataGridOptions.onContentReady
 * @type_function_param1 e:{ui/data_grid:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxDataGridOptions.onDataErrorOccurred
 * @type_function_param1 e:{ui/data_grid:DataErrorOccurredEvent}
 */
onDataErrorOccurred?: ((e: DataErrorOccurredEvent) => void);
/**
 * @docid dxDataGridOptions.onDisposing
 * @type_function_param1 e:{ui/data_grid:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxDataGridOptions.onEditCanceled
 * @type_function_param1 e:{ui/data_grid:EditCanceledEvent}
 */
onEditCanceled?: ((e: EditCanceledEvent) => void);
/**
 * @docid dxDataGridOptions.onEditCanceling
 * @type_function_param1 e:{ui/data_grid:EditCancelingEvent}
 */
onEditCanceling?: ((e: EditCancelingEvent) => void);
/**
 * @docid dxDataGridOptions.onInitialized
 * @type_function_param1 e:{ui/data_grid:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxDataGridOptions.onInitNewRow
 * @type_function_param1 e:{ui/data_grid:InitNewRowEvent}
 */
onInitNewRow?: ((e: InitNewRowEvent) => void);
/**
 * @docid dxDataGridOptions.onKeyDown
 * @type_function_param1 e:{ui/data_grid:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @docid dxDataGridOptions.onOptionChanged
 * @type_function_param1 e:{ui/data_grid:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxDataGridOptions.onRowCollapsed
 * @type_function_param1 e:{ui/data_grid:RowCollapsedEvent}
 */
onRowCollapsed?: ((e: RowCollapsedEvent) => void);
/**
 * @docid dxDataGridOptions.onRowCollapsing
 * @type_function_param1 e:{ui/data_grid:RowCollapsingEvent}
 */
onRowCollapsing?: ((e: RowCollapsingEvent) => void);
/**
 * @docid dxDataGridOptions.onRowExpanded
 * @type_function_param1 e:{ui/data_grid:RowExpandedEvent}
 */
onRowExpanded?: ((e: RowExpandedEvent) => void);
/**
 * @docid dxDataGridOptions.onRowExpanding
 * @type_function_param1 e:{ui/data_grid:RowExpandingEvent}
 */
onRowExpanding?: ((e: RowExpandingEvent) => void);
/**
 * @docid dxDataGridOptions.onRowInserted
 * @type_function_param1 e:{ui/data_grid:RowInsertedEvent}
 */
onRowInserted?: ((e: RowInsertedEvent) => void);
/**
 * @docid dxDataGridOptions.onRowInserting
 * @type_function_param1 e:{ui/data_grid:RowInsertingEvent}
 */
onRowInserting?: ((e: RowInsertingEvent) => void);
/**
 * @docid dxDataGridOptions.onRowRemoved
 * @type_function_param1 e:{ui/data_grid:RowRemovedEvent}
 */
onRowRemoved?: ((e: RowRemovedEvent) => void);
/**
 * @docid dxDataGridOptions.onRowRemoving
 * @type_function_param1 e:{ui/data_grid:RowRemovingEvent}
 */
onRowRemoving?: ((e: RowRemovingEvent) => void);
/**
 * @docid dxDataGridOptions.onRowUpdated
 * @type_function_param1 e:{ui/data_grid:RowUpdatedEvent}
 */
onRowUpdated?: ((e: RowUpdatedEvent) => void);
/**
 * @docid dxDataGridOptions.onRowUpdating
 * @type_function_param1 e:{ui/data_grid:RowUpdatingEvent}
 */
onRowUpdating?: ((e: RowUpdatingEvent) => void);
/**
 * @docid dxDataGridOptions.onRowValidating
 * @type_function_param1 e:{ui/data_grid:RowValidatingEvent}
 */
onRowValidating?: ((e: RowValidatingEvent) => void);
/**
 * @docid dxDataGridOptions.onSaved
 * @type_function_param1 e:{ui/data_grid:SavedEvent}
 */
onSaved?: ((e: SavedEvent) => void);
/**
 * @docid dxDataGridOptions.onSaving
 * @type_function_param1 e:{ui/data_grid:SavingEvent}
 */
onSaving?: ((e: SavingEvent) => void);
/**
 * @docid dxDataGridOptions.onSelectionChanged
 * @type_function_param1 e:{ui/data_grid:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @docid dxDataGridOptions.onToolbarPreparing
 * @type_function_param1 e:{ui/data_grid:ToolbarPreparingEvent}
 */
onToolbarPreparing?: ((e: ToolbarPreparingEvent) => void);
};
///#ENDDEBUG
