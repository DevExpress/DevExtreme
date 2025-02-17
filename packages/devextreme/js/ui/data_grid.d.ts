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

/**
 * @deprecated Use Column instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ColumnBase<TRowData = any> = ComponentColumnBase<TRowData>;
/**
 * @deprecated Use ColumnButton instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ColumnButtonBase = ComponentColumnButtonBase;
/**
 * @deprecated Use Editing instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type EditingBase<TRowData = any, TKey = any> = ComponentEditingBase<TRowData, TKey>;
/**
 * @deprecated Use EditingTexts instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type EditingTextsBase = ComponentEditingTextsBase;
/**
 * @deprecated Use Paging instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type PagingBase = ComponentPaging;
/**
 * @deprecated Use Scrolling instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ScrollingBase = ComponentScrollingBase;
/**
 * @deprecated Use Selection instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type SelectionBase = ComponentSelectionBase;

export type DataGridCommandColumnType = 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection' | 'drag';
export type DataGridExportFormat = 'pdf' | 'xlsx';
export type DataGridScrollMode = 'infinite' | 'standard' | 'virtual';
export type DataGridPredefinedColumnButton = 'cancel' | 'delete' | 'edit' | 'save' | 'undelete';
export type DataGridPredefinedToolbarItem = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'exportButton' | 'groupPanel' | 'revertButton' | 'saveButton' | 'searchPanel';

type GroupKey = any[];

/**
 * Specifies a group of elements in a template.
 */
export type GroupData<TRowData> = {
  key: any;
  items: Array<TRowData> | Array<GroupData<TRowData>> | null;
  /**
   * @deprecated Attention! This property is for internal purposes only.
   */
  collapsedItems?: Array<TRowData> | Array<GroupData<TRowData>>;
  /**
   * @deprecated Attention! This property is for internal purposes only.
   */
  aggregates?: Array<any>;
  /**
   * @deprecated Attention! This property is for internal purposes only.
   */
  summary?: Array<any>;
  /**
   * @deprecated Attention! This property is for internal purposes only.
   */
  isContinuation?: boolean;
  /**
   * @deprecated Attention! This property is for internal purposes only.
   */
  isContinuationOnNextPage?: boolean;
};

/**
 * @deprecated Use Editing instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GridBaseEditing<TRowData = any, TKey = any> = EditingBase<TRowData, TKey>;

/**
 * @deprecated Use EditingTexts instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GridBaseEditingTexts = EditingTextsBase;

/**
 * @deprecated Use Paging instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GridBasePaging = ComponentPaging;

/**
 * @deprecated Use Scrolling instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GridBaseScrolling = ScrollingBase;

/**
 * @deprecated Use Selection instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GridBaseSelection = SelectionBase;

/**
 * @deprecated Use Column instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GridBaseColumn<TRowData = any> = ColumnBase<TRowData>;

/**
 * @deprecated Use ColumnButton instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GridBaseColumnButton = ColumnButtonBase;

/**
 * The type of the adaptiveDetailRowPreparing event handler&apos;s argument.
 */
export type AdaptiveDetailRowPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & AdaptiveDetailRowPreparingInfo;

/**
 * The type of the cellClick event handler&apos;s argument.
 */
export type CellClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly value?: any;
  /**
   * 
   */
  readonly displayValue?: any;
  /**
   * 
   */
  readonly text: string;
  /**
   * 
   */
  readonly columnIndex: number;
  /**
   * 
   */
  readonly column: Column<TRowData, TKey>;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly rowType: string;
  /**
   * 
   */
  readonly cellElement: DxElement;
  /**
   * 
   */
  readonly row: Row<TRowData, TKey>;
};

/**
 * The type of the cellDblClick event handler&apos;s argument.
 */
export type CellDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly value?: any;
  /**
   * 
   */
  readonly displayValue?: any;
  /**
   * 
   */
  readonly text: string;
  /**
   * 
   */
  readonly columnIndex: number;
  /**
   * 
   */
  readonly column: Column<TRowData, TKey>;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly rowType: string;
  /**
   * 
   */
  readonly cellElement: DxElement;
  /**
   * 
   */
  readonly row: Row<TRowData, TKey>;
};

/**
 * The type of the cellHoverChanged event handler&apos;s argument.
 */
export type CellHoverChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  readonly eventType: string;
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly value?: any;
  /**
   * 
   */
  readonly text: string;
  /**
   * 
   */
  readonly displayValue?: any;
  /**
   * 
   */
  readonly columnIndex: number;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly column: Column<TRowData, TKey>;
  /**
   * 
   */
  readonly rowType: string;
  /**
   * 
   */
  readonly cellElement: DxElement;
  /**
   * 
   */
  readonly row: Row<TRowData, TKey>;
};

/**
 * The type of the cellPrepared event handler&apos;s argument.
 */
export type CellPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly value?: any;
  /**
   * 
   */
  readonly displayValue?: any;
  /**
   * 
   */
  readonly text: string;
  /**
   * 
   */
  readonly columnIndex: number;
  /**
   * 
   */
  readonly column: Column<TRowData, TKey>;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly rowType: string;
  /**
   * 
   */
  readonly row: Row<TRowData, TKey>;
  /**
   * 
   */
  readonly isSelected?: boolean;
  /**
   * 
   */
  readonly isExpanded?: boolean;
  /**
   * 
   */
  readonly isNewRow?: boolean;
  /**
   * 
   */
  readonly cellElement: DxElement;
  /**
   * 
   */
  readonly watch?: Function;
  /**
   * 
   */
  readonly oldValue?: any;
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>>;

/**
 * The type of the contextMenuPreparing event handler&apos;s argument.
 */
export type ContextMenuPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  items?: Array<any>;
  /**
   * 
   */
  readonly target: string;
  /**
   * 
   */
  readonly targetElement: DxElement;
  /**
   * 
   */
  readonly columnIndex: number;
  /**
   * 
   */
  readonly column?: Column<TRowData, TKey>;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly row?: Row<TRowData, TKey>;
};

/**
 * The type of the dataErrorOccurred event handler&apos;s argument.
 */
export type DataErrorOccurredEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & DataErrorOccurredInfo;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>>;

/**
 * The type of the editCanceled event handler&apos;s argument.
 */
export type EditCanceledEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/**
 * The type of the editCanceling event handler&apos;s argument.
 */
export type EditCancelingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/**
 * The type of the editingStart event handler&apos;s argument.
 */
export type EditingStartEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly column?: Column<TRowData, TKey>;
};

/**
 * The type of the editorPrepared event handler&apos;s argument.
 */
export type EditorPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  readonly parentType: string;
  /**
   * 
   */
  readonly value?: any;
  /**
   * 
   */
  readonly setValue?: any;
  /**
   * 
   */
  readonly updateValueTimeout?: number;
  /**
   * 
   */
  readonly width?: number;
  /**
   * 
   */
  readonly disabled: boolean;
  /**
   * 
   */
  readonly rtlEnabled: boolean;
  /**
   * 
   */
  readonly editorElement: DxElement;
  /**
   * 
   */
  readonly readOnly: boolean;
  /**
   * 
   */
  readonly dataField?: string;
  /**
   * 
   */
  readonly row?: Row<TRowData, TKey>;
};

/**
 * The type of the editorPreparing event handler&apos;s argument.
 */
export type EditorPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  readonly parentType: string;
  /**
   * 
   */
  readonly value?: any;
  /**
   * 
   */
  readonly setValue?: any;
  /**
   * 
   */
  readonly updateValueTimeout?: number;
  /**
   * 
   */
  readonly width?: number;
  /**
   * 
   */
  readonly disabled: boolean;
  /**
   * 
   */
  readonly rtlEnabled: boolean;
  /**
   * 
   */
  cancel: boolean;
  /**
   * 
   */
  readonly editorElement: DxElement;
  /**
   * 
   */
  readonly readOnly: boolean;
  /**
   * 
   */
  editorName: string;
  /**
   * 
   */
  editorOptions: any;
  /**
   * 
   */
  readonly dataField?: string;
  /**
   * 
   */
  readonly row?: Row<TRowData, TKey>;
};

/**
 * The type of the exporting event handler&apos;s argument.
 */
export type ExportingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  fileName?: string;
  /**
   * 
   */
  selectedRowsOnly: boolean;
  /**
   * 
   */
  format: DataGridExportFormat | string;
};

/**
 * The type of the focusedCellChanged event handler&apos;s argument.
 */
export type FocusedCellChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  readonly cellElement: DxElement;
  /**
   * 
   */
  readonly columnIndex: number;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly row?: Row<TRowData, TKey>;
  /**
   * 
   */
  readonly column?: Column<TRowData, TKey>;
};

/**
 * The type of the focusedCellChanging event handler&apos;s argument.
 */
export type FocusedCellChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxDataGrid<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
  /**
   * 
   */
  readonly cellElement: DxElement;
  /**
   * 
   */
  readonly prevColumnIndex: number;
  /**
   * 
   */
  readonly prevRowIndex: number;
  /**
   * 
   */
  newColumnIndex: number;
  /**
   * 
   */
  newRowIndex: number;
  /**
   * 
   */
  readonly rows: Array<Row<TRowData, TKey>>;
  /**
   * 
   */
  readonly columns: Array<Column<TRowData, TKey>>;
  /**
   * 
   */
  isHighlighted: boolean;
};

/**
 * The type of the focusedRowChanged event handler&apos;s argument.
 */
export type FocusedRowChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  readonly rowElement: DxElement;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly row?: Row<TRowData, TKey>;
};

/**
 * The type of the focusedRowChanging event handler&apos;s argument.
 */
export type FocusedRowChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxDataGrid<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
  /**
   * 
   */
  readonly rowElement: DxElement;
  /**
   * 
   */
  readonly prevRowIndex: number;
  /**
   * 
   */
  newRowIndex: number;
  /**
   * 
   */
  readonly rows: Array<Row<TRowData, TKey>>;
};

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent<TRowData = any, TKey = any> = InitializedEventInfo<dxDataGrid<TRowData, TKey>>;

/**
 * The type of the initNewRow event handler&apos;s argument.
 */
export type InitNewRowEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & NewRowInfo<TRowData>;

/**
 * The type of the keyDown event handler&apos;s argument.
 */
export type KeyDownEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, KeyboardEvent> & KeyDownInfo;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & ChangedOptionInfo;

/**
 * The type of the rowClick event handler&apos;s argument.
 */
export type RowClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly values: Array<any>;
  /**
   * 
   */
  readonly columns: Array<Column<TRowData, TKey>>;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly rowType: string;
  /**
   * 
   */
  readonly isSelected?: boolean;
  /**
   * 
   */
  readonly isExpanded?: boolean;
  /**
   * 
   */
  readonly isNewRow?: boolean;
  /**
   * 
   */
  readonly groupIndex?: number;
  /**
   * 
   */
  readonly rowElement: DxElement;
  /**
   * 
   */
  readonly handled: boolean;
};

/**
 * The type of the rowCollapsed event handler&apos;s argument.
 */
export type RowCollapsedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * The type of the rowCollapsing event handler&apos;s argument.
 */
export type RowCollapsingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * The type of the rowDblClick event handler&apos;s argument.
 */
export type RowDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly values: Array<any>;
  /**
   * 
   */
  readonly columns: Array<Column<TRowData, TKey>>;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly rowType: string;
  /**
   * 
   */
  readonly isSelected?: boolean;
  /**
   * 
   */
  readonly isExpanded?: boolean;
  /**
   * 
   */
  readonly isNewRow?: boolean;
  /**
   * 
   */
  readonly groupIndex?: number;
  /**
   * 
   */
  readonly rowElement: DxElement;
};

/**
 * The type of the rowExpanded event handler&apos;s argument.
 */
export type RowExpandedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * The type of the rowExpanding event handler&apos;s argument.
 */
export type RowExpandingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * The type of the rowInserted event handler&apos;s argument.
 */
export type RowInsertedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowInsertedInfo<TRowData, TKey>;

/**
 * The type of the rowInserting event handler&apos;s argument.
 */
export type RowInsertingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowInsertingInfo<TRowData>;

/**
 * The type of the rowPrepared event handler&apos;s argument.
 */
export type RowPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & {
  /**
   * 
   */
  readonly data: TRowData;
  /**
   * 
   */
  readonly key: TKey;
  /**
   * 
   */
  readonly values: Array<any>;
  /**
   * 
   */
  readonly columns: Array<Column<TRowData, TKey>>;
  /**
   * 
   */
  readonly rowIndex: number;
  /**
   * 
   */
  readonly rowType: string;
  /**
   * 
   */
  readonly groupIndex?: number;
  /**
   * 
   */
  readonly isSelected?: boolean;
  /**
   * 
   */
  readonly isExpanded?: boolean;
  /**
   * 
   */
  readonly isNewRow?: boolean;
  /**
   * 
   */
  readonly rowElement: DxElement;
};

/**
 * The type of the rowRemoved event handler&apos;s argument.
 */
export type RowRemovedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowRemovedInfo<TRowData, TKey>;

/**
 * The type of the rowRemoving event handler&apos;s argument.
 */
export type RowRemovingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowRemovingInfo<TRowData, TKey>;

/**
 * The type of the rowUpdated event handler&apos;s argument.
 */
export type RowUpdatedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowUpdatedInfo<TRowData, TKey>;

/**
 * The type of the rowUpdating event handler&apos;s argument.
 */
export type RowUpdatingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowUpdatingInfo<TRowData, TKey>;

/**
 * The type of the rowValidating event handler&apos;s argument.
 */
export type RowValidatingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & RowValidatingInfo<TRowData, TKey>;

/**
 * The type of the saved event handler&apos;s argument.
 */
export type SavedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/**
 * The type of the saving event handler&apos;s argument.
 */
export type SavingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & SavingInfo<TRowData, TKey>;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & SelectionChangedInfo<TRowData, TKey>;

/**
 * The type of the toolbarPreparing event handler&apos;s argument.
 */
export type ToolbarPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>> & ToolbarPreparingInfo;

export type RowDraggingAddEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

export type RowDraggingChangeEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

export type RowDraggingEndEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

export type RowDraggingMoveEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

export type RowDraggingStartEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & DragStartEventInfo<TRowData>;

export type RowDraggingRemoveEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData>;

export type RowDraggingReorderEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxDataGrid<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragReorderInfo;

/**
 * 
 */
export type ColumnButtonClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxDataGrid<TRowData, TKey>, PointerEvent | MouseEvent> & {
  /**
   * 
   */
  row?: Row<TRowData, TKey>;
  /**
   * 
   */
  column?: Column<TRowData, TKey>;
};

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

export type ColumnHeaderCellTemplateData<TRowData = any, TKey = any> = {
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly columnIndex: number;
  readonly column: Column<TRowData, TKey>;
};

export type MasterDetailTemplateData<TRowData = any, TKey = any> = {
  readonly key: TKey;
  readonly data: TRowData;
  readonly watch?: Function;
};

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
 * 
 * @deprecated 
 */
export type dxDataGridOptions<TRowData = any, TKey = any> = Omit<GridBaseOptions<dxDataGrid<TRowData, TKey>, TRowData, TKey>, OverriddenKeys> & {
    /**
     * An array of grid columns.
     */
    columns?: Array<Column<TRowData, TKey> | string> | undefined;
    /**
     * Customizes columns after they are created.
     */
    customizeColumns?: ((columns: Array<Column<TRowData, TKey>>) => void);
    /**
     * Configures editing.
     */
    editing?: Editing<TRowData, TKey>;
    /**
     * Configures client-side exporting.
     */
    export?: Export;
    /**
     * Configures the group panel.
     */
    groupPanel?: GroupPanel;
    /**
     * Configures grouping.
     */
    grouping?: Grouping;
    /**
     * Specifies the key property (or properties) that provide(s) key values to access data items. Each key value must be unique. This property applies only if data is a simple array.
     */
    keyExpr?: string | Array<string> | undefined;
    /**
     * Allows you to build a master-detail interface in the grid.
     */
    masterDetail?: MasterDetail<TRowData, TKey>;
    /**
     * A function that is executed when a cell is clicked or tapped. Executed before onRowClick.
     */
    onCellClick?: ((e: CellClickEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed when a cell is double-clicked or double-tapped. Executed before onRowDblClick.
     */
    onCellDblClick?: ((e: CellDblClickEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed after the pointer enters or leaves a cell.
     */
    onCellHoverChanged?: ((e: CellHoverChangedEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed after a grid cell is created.
     */
    onCellPrepared?: ((e: CellPreparedEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed before the context menu is rendered.
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed before a cell or row switches to the editing state.
     */
    onEditingStart?: ((e: EditingStartEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed after an editor is created. Not executed for cells with an editCellTemplate.
     */
    onEditorPrepared?: ((options: EditorPreparedEvent<TRowData, TKey>) => void);
    /**
     * A function used to customize a cell&apos;s editor. Not executed for cells with an editCellTemplate.
     */
    onEditorPreparing?: ((e: EditorPreparingEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed before data is exported.
     */
    onExporting?: ((e: ExportingEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed after the focused cell changes. Applies only to cells in data or group rows.
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed before the focused cell changes. Applies only to cells in data or group rows.
     */
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed after the focused row changes. Applies only to data or group rows. focusedRowEnabled should be true.
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed before the focused row changes. Applies only to data or group rows. focusedRowEnabled should be true.
     */
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed when a row is clicked or tapped.
     */
    onRowClick?: ((e: RowClickEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed when a row is double-clicked or double-tapped. Executed after onCellDblClick.
     */
    onRowDblClick?: ((e: RowDblClickEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed after a row is created.
     */
    onRowPrepared?: ((e: RowPreparedEvent<TRowData, TKey>) => void);
    /**
     * Notifies the DataGrid of the server&apos;s data processing operations.
     */
    remoteOperations?: boolean | {
      /**
       * Specifies whether or not filtering must be performed on the server side.
       */
      filtering?: boolean;
      /**
       * Specifies whether paging by groups should be performed on the server side.
       */
      groupPaging?: boolean;
      /**
       * Specifies whether or not grouping must be performed on the server side.
       */
      grouping?: boolean;
      /**
       * Specifies whether or not paging must be performed on the server side.
       */
      paging?: boolean;
      /**
       * Specifies whether or not sorting must be performed on the server side.
       */
      sorting?: boolean;
      /**
       * Specifies whether or not summaries summaries are calculated on the server-side.
       */
      summary?: boolean;
    } | Mode;
    /**
     * Specifies a custom template for rows.
     * @deprecated Use the dataRowTemplate option instead.
     */
    rowTemplate?: template | ((rowElement: DxElement, rowInfo: RowTemplateData<TRowData, TKey>) => any);
        /**
     * Specifies a custom template for data rows.
     */
    dataRowTemplate?: template | ((rowElement: DxElement, rowInfo: DataRowTemplateData<TRowData, TKey>) => any);
    /**
     * Configures scrolling.
     */
    scrolling?: Scrolling;
    /**
     * Configures runtime selection.
     */
    selection?: Selection;
    /**
     * Specifies filters for the rows that must be selected initially. Applies only if selection.deferred is true.
     */
    selectionFilter?: string | Array<any> | Function;
    /**
     * Allows you to sort groups according to the values of group summary items.
     */
    sortByGroupSummaryInfo?: Array<SortByGroupSummaryInfoItem> | undefined;
    /**
     * Specifies the properties of the grid summary.
     */
    summary?: Summary<TRowData, TKey>;
    /**
     * Configures the toolbar.
     */
    toolbar?: Toolbar | undefined;
};

/**
 * Configures client-side exporting.
 */
export type Export = {
  /**
   * Allows users to export selected rows only.
   */
  allowExportSelectedData?: boolean;
  /**
   * Adds the Export button to the DataGrid&apos;s toolbar.
   */
  enabled?: boolean;
  /**
   * Specifies the availability and captions of data export buttons.
   */
  formats?: ('xlsx' | 'pdf' | string)[];
  /**
   * Configures the texts of export commands, buttons, and hints.
   */
  texts?: ExportTexts;
};

/**
 * Configures the texts of export commands, buttons, and hints.
 */
export type ExportTexts = {
  /**
   * The text or hint of the command that exports all data.
   */
  exportAll?: string;
  /**
   * The text of the command that exports selected rows. Applies when the allowExportSelectedData property is true.
   */
  exportSelectedRows?: string;
  /**
   * The hint of the Export button when the allowExportSelectedData property is true.
   */
  exportTo?: string;
};

export type FilterPanel<TRowData = any, TKey = any> = ComponentFilterPanel<dxDataGrid, TRowData, TKey>;

export type FilterPanelCustomizeTextArg = ComponentFilterPanelCustomizeTextArg<dxDataGrid>;

/**
 * Configures the group panel.
 */
export type GroupPanel = {
  /**
   * Specifies whether columns can be dragged onto or from the group panel.
   */
  allowColumnDragging?: boolean;
  /**
   * Specifies text displayed by the group panel when it does not contain any columns.
   */
  emptyPanelText?: string;
  /**
   * Specifies whether the group panel is visible or not.
   */
  visible?: boolean | Mode;
};

/**
 * Configures grouping.
 */
export type Grouping = {
  /**
   * Specifies whether the user can collapse grouped records in a grid or not.
   */
  allowCollapsing?: boolean;
  /**
   * Specifies whether groups appear expanded or not.
   */
  autoExpandAll?: boolean;
  /**
   * Enables the user to group data using the context menu.
   */
  contextMenuEnabled?: boolean;
  /**
   * Specifies the event on which a group will be expanded/collapsed.
   */
  expandMode?: GroupExpandMode;
  /**
   * Defines the texts of grouping-related visual elements.
   */
  texts?: GroupingTexts;
};

/**
 * Defines the texts of grouping-related visual elements.
 */
export type GroupingTexts = {
  /**
   * Specifies the text of the context menu item that groups data by a specific column.
   */
  groupByThisColumn?: string;
  /**
   * Specifies the message displayed in a group row when the corresponding group is continued from the previous page.
   */
  groupContinuedMessage?: string;
  /**
   * Specifies the message displayed in a group row when the corresponding group continues on the next page.
   */
  groupContinuesMessage?: string;
  /**
   * Specifies the text of the context menu item that clears grouping settings of a specific column.
   */
  ungroup?: string;
  /**
   * Specifies the text of the context menu item that clears grouping settings of all columns.
   */
  ungroupAll?: string;
};

/**
 * Allows you to build a master-detail interface in the grid.
 */
export type MasterDetail<TRowData = any, TKey = any> = {
  /**
   * Specifies whether detail sections appear expanded or collapsed.
   */
  autoExpandAll?: boolean;
  /**
   * Enables an end-user to expand/collapse detail sections.
   */
  enabled?: boolean;
  /**
   * Specifies a custom template for detail sections.
   */
  template?: template | ((detailElement: DxElement, detailInfo: MasterDetailTemplateData<TRowData, TKey>) => any);
};

/**
 * Allows you to sort groups according to the values of group summary items.
 */
export type SortByGroupSummaryInfoItem = {
    /**
     * Specifies the identifier of the column that must be used in grouping so that sorting by group summary item values be applied.
     */
    groupColumn?: string | undefined;
    /**
     * Specifies the sort order of group summary item values.
     */
    sortOrder?: SortOrder | undefined;
    /**
     * Specifies the group summary item whose values must be used to sort groups.
     */
    summaryItem?: string | number | undefined;
};

export type CustomSummaryInfo<TRowData = any, TKey = any> = {
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly name?: string;
  readonly summaryProcess: string;
  readonly value?: any;
  totalValue?: any;
  readonly groupIndex?: number;
};

export type Paging = ComponentPaging;

export type RowDragging<TRowData = any, TKey = any> = ComponentRowDragging<dxDataGrid, TRowData, TKey>;

/**
 * Specifies the properties of the grid summary.
 */
export type Summary<TRowData = any, TKey = any> = {
  /**
   * Specifies a custom aggregate function. This function is called for summary items whose summaryType is &apos;custom&apos;.
   */
  calculateCustomSummary?: ((options: CustomSummaryInfo<TRowData, TKey>) => void);
  /**
   * Specifies items of the group summary.
   */
  groupItems?: Array<SummaryGroupItem> | undefined;
  /**
   * Specifies whether to recalculate summaries while a user edits data.
   */
  recalculateWhileEditing?: boolean;
  /**
   * Specifies whether to skip empty strings, null and undefined values when calculating a summary. Does not apply when you use a remote data source.
   */
  skipEmptyValues?: boolean;
  /**
   * Contains properties that specify text patterns for summary items.
   */
  texts?: SummaryTexts;
  /**
   * Specifies items of the total summary.
   */
  totalItems?: Array<SummaryTotalItem> | undefined;
};

export type SummaryItemTextInfo = {
  readonly value?: string | number | Date;
  readonly valueText: string;
};

/**
 * Specifies items of the group summary.
 */
export type SummaryGroupItem = {
    /**
     * Indicates whether to display group summary items in parentheses after the group row header or to align them by the corresponding columns within the group row.
     */
    alignByColumn?: boolean;
    /**
     * Specifies the column that provides data for a group summary item.
     */
    column?: string | undefined;
    /**
     * Customizes the text to be displayed in the summary item.
     */
    customizeText?: ((itemInfo: SummaryItemTextInfo) => string);
    /**
     * Specifies the summary item&apos;s text.
     */
    displayFormat?: string | undefined;
    /**
     * Specifies the group summary item&apos;s identifier.
     */
    name?: string | undefined;
    /**
     * Specifies the column that must hold the summary item when this item is displayed in the group footer or aligned by a column in the group row.
     */
    showInColumn?: string | undefined;
    /**
     * Specifies whether or not a summary item must be displayed in the group footer.
     */
    showInGroupFooter?: boolean;
    /**
     * Specifies whether to skip empty strings, null, and undefined values when calculating a summary. Does not apply when you use a remote data source.
     */
    skipEmptyValues?: boolean;
    /**
     * Specifies how to aggregate data for the group summary item.
     */
    summaryType?: SummaryType | string | undefined;
    /**
     * Specifies a summary item value&apos;s display format.
     */
    valueFormat?: Format | undefined;
};

/**
 * Specifies items of the total summary.
 */
export type SummaryTotalItem = {
  /**
   * Specifies the alignment of a summary item.
   */
  alignment?: HorizontalAlignment | undefined;
  /**
   * Specifies the column that provides data for a summary item.
   */
  column?: string | undefined;
  /**
   * Specifies a CSS class to be applied to a summary item.
   */
  cssClass?: string | undefined;
  /**
   * Customizes the text to be displayed in the summary item.
   */
  customizeText?: ((itemInfo: SummaryItemTextInfo) => string);
  /**
   * Specifies the summary item&apos;s text.
   */
  displayFormat?: string | undefined;
  /**
   * Specifies the total summary item&apos;s identifier.
   */
  name?: string | undefined;
  /**
   * Specifies the column that must hold the summary item.
   */
  showInColumn?: string | undefined;
  /**
   * 
   */
  skipEmptyValues?: boolean;
  /**
   * Specifies how to aggregate data for the total summary item.
   */
  summaryType?: SummaryType | string | undefined;
  /**
   * Specifies a summary item value&apos;s display format.
   */
  valueFormat?: Format | undefined;
};

/**
 * Contains properties that specify text patterns for summary items.
 */
export type SummaryTexts = {
    /**
     * Specifies a pattern for the &apos;avg&apos; summary items when they are displayed in the parent column.
     */
    avg?: string;
    /**
     * Specifies a pattern for the &apos;avg&apos; summary items displayed in a group row or in any other column rather than the parent one.
     */
    avgOtherColumn?: string;
    /**
     * Specifies a pattern for the &apos;count&apos; summary items.
     */
    count?: string;
    /**
     * Specifies a pattern for the &apos;max&apos; summary items when they are displayed in the parent column.
     */
    max?: string;
    /**
     * Specifies a pattern for the &apos;max&apos; summary items displayed in a group row or in any other column rather than the parent one.
     */
    maxOtherColumn?: string;
    /**
     * Specifies a pattern for the &apos;min&apos; summary items when they are displayed in the parent column.
     */
    min?: string;
    /**
     * Specifies a pattern for the &apos;min&apos; summary items displayed in a group row or in any other column rather than the parent one.
     */
    minOtherColumn?: string;
    /**
     * Specifies a pattern for the &apos;sum&apos; summary items when they are displayed in the parent column.
     */
    sum?: string;
    /**
     * Specifies a pattern for the &apos;sum&apos; summary items displayed in a group row or in any other column rather than the parent one.
     */
    sumOtherColumn?: string;
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxDataGridToolbar = Toolbar;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxDataGridToolbarItem = ToolbarItem;

/**
 * Configures toolbar items.
 */
export type ToolbarItem = dxToolbarItem & {
  /**
   * A name used to identify the toolbar item.
   */
  name?: DataGridPredefinedToolbarItem | string;
  /**
   * Specifies a location for the item on the toolbar.
   */
  location?: ToolbarItemLocation;
};

/**
 * Configures the toolbar.
 */
export type Toolbar = {
  /**
   * Configures toolbar items.
   */
  items?: Array<DataGridPredefinedToolbarItem | ToolbarItem>;
  /**
   * Specifies whether the toolbar is visible.
   */
  visible?: boolean | undefined;
  /**
   * Specifies whether the toolbar responds to user interaction.
   */
  disabled?: boolean;
};

/**
 * @deprecated Use Editing instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxDataGridEditing<TRowData, TKey = any> = Editing<TRowData, TKey>;

/**
 * Configures editing.
 */
export type Editing<TRowData = any, TKey = any> = EditingBase<TRowData, TKey> & {
    /**
     * Specifies whether a user can add new rows.
     */
    allowAdding?: boolean;
    /**
     * Specifies whether a user can delete rows. It is called for each data row when defined as a function.
     */
    allowDeleting?: boolean | ((options: { component?: dxDataGrid<TRowData, TKey>; row?: Row<TRowData, TKey> }) => boolean);
    /**
     * Specifies whether a user can update rows. It is called for each data row when defined as a function.
     */
    allowUpdating?: boolean | ((options: { component?: dxDataGrid<TRowData, TKey>; row?: Row<TRowData, TKey> }) => boolean);
    /**
     * Contains properties that specify texts for editing-related UI elements.
     */
    texts?: any;
    /**
     * Specifies a position for a new row.
     */
    newRowPosition?: NewRowPosition;
};

export type EditingTexts = ComponentEditingTextsBase;

/**
 * @deprecated Use Scrolling instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxDataGridScrolling = Scrolling;

/**
 * Configures scrolling.
 */
export type Scrolling = ScrollingBase & {
    /**
     * Specifies the scrolling mode.
     */
    mode?: DataGridScrollMode;
};

/**
 * @deprecated Use Selection instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxDataGridSelection = Selection;

export type SelectionSensitivity = 'base' | 'accent' | 'case' | 'variant';

export type Selection = SelectionBase & {
    /**
     * Makes selection deferred.
     */
    deferred?: boolean;
    /**
     * Specifies how to filter selected DataGrid rows based on sensitivity.
     */
    sensitivity?: SelectionSensitivity;
    /**
     * Specifies the mode in which all the records are selected. Applies only if selection.allowSelectAll is true.
     */
    selectAllMode?: SelectAllMode;
    /**
     * Specifies when to display the selection column and row selection checkboxes. Applies only if selection.mode is &apos;multiple&apos;.
     */
    showCheckBoxesMode?: SelectionColumnDisplayMode;
};
/**
 * The DataGrid is a UI component that represents data from a local or remote source in the form of a grid. This UI component offers such basic features as sorting, grouping, filtering, as well as more advanced capabilities, like state storing, client-side exporting, master-detail interface, and many others.
 */
export default class dxDataGrid<TRowData = any, TKey = any> extends Widget<dxDataGridOptions<TRowData, TKey>> implements GridBase<TRowData, TKey> {
    /**
     * Adds a new column.
     */
    addColumn(columnOptions: Column<TRowData, TKey> | string): void;
    /**
     * Adds an empty data row and switches it to the editing state.
     */
    addRow(): DxPromise<void>;
    /**
     * Ungroups grid records.
     */
    clearGrouping(): void;
    /**
     * Collapses master rows or groups of a specific level.
     */
    collapseAll(groupIndex?: number): void;
    /**
     * Collapses a group or a master row with a specific key.
     */
    collapseRow(key: TKey): DxPromise<void>;
    /**
     * Expands master rows or groups of a specific level. Does not apply if data is remote.
     */
    expandAll(groupIndex?: number): void;
    /**
     * Expands a group or a master row with a specific key.
     */
    expandRow(key: TKey): DxPromise<void>;
    /**
     * Gets the currently selected rows&apos; keys.
     */
    getSelectedRowKeys(): Array<TKey> & DxPromise<Array<TKey>>;
    /**
     * Gets the selected rows&apos; data objects.
     */
    getSelectedRowsData(): Array<TRowData> & DxPromise<Array<TRowData>>;
    /**
     * Gets the value of a total summary item.
     */
    getTotalSummaryValue(summaryItemName: string): any;
    /**
     * Gets all visible columns.
     */
    getVisibleColumns(): Array<Column<TRowData, TKey>>;
    /**
     * Gets all visible columns at a specific hierarchical level of column headers. Use it to access banded columns.
     */
    getVisibleColumns(headerLevel: number): Array<Column<TRowData, TKey>>;
    /**
     * Gets currently rendered rows.
     */
    getVisibleRows(): Array<Row<TRowData, TKey>>;
    /**
     * Checks whether a specific group or master row is expanded or collapsed.
     */
    isRowExpanded(key: TKey): boolean;
    /**
     * Checks whether a row found using its data object is selected. Takes effect only if selection.deferred is true.
     */
    isRowSelected(data: TRowData): boolean;
    isRowSelected(key: TKey): boolean;
    /**
     * Gets the total row count.
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

export type Column<TRowData = any, TKey = any> = dxDataGridColumn<TRowData, TKey>;

/**
 * @deprecated Use the Column type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDataGridColumn<TRowData = any, TKey = any> extends ColumnBase<TRowData> {
    /**
     * Specifies whether data from this column should be exported. Applies only if the column is visible.
     */
    allowExporting?: boolean;
    /**
     * Specifies whether the user can group data by values of this column. Applies only when grouping is enabled.
     */
    allowGrouping?: boolean;
    /**
     * Specifies whether groups appear expanded or not when records are grouped by a specific column. Setting this property makes sense only when grouping is allowed for this column.
     */
    autoExpandGroup?: boolean;
    /**
     * Allows you to customize buttons in the edit column or create a custom command column. Applies only if the column&apos;s type is &apos;buttons&apos;.
     */
    buttons?: Array<DataGridPredefinedColumnButton | ColumnButton<TRowData, TKey>>;
    /**
     * Sets custom column values used to group grid records.
     */
    calculateGroupValue?: string | ((this: ColumnBase, rowData: TRowData) => any);
    /**
     * Specifies a custom template for data cells.
     */
    cellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnCellTemplateData<TRowData, TKey>) => any);
    /**
     * An array of grid columns.
     */
    columns?: Array<Column<TRowData, TKey> | string> | undefined;
    /**
     * Specifies a custom template for data cells in an editing state.
     */
    editCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnEditCellTemplateData<TRowData, TKey>) => any);
    /**
     * Specifies a custom template for group cells (group rows).
     */
    groupCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnGroupCellTemplateData<TRowData, TKey>) => any);
    /**
     * Specifies the index of a column when grid records are grouped by the values of this column.
     */
    groupIndex?: number | undefined;
    /**
     * Specifies a custom template for column headers.
     */
    headerCellTemplate?: template | ((columnHeader: DxElement, headerInfo: ColumnHeaderCellTemplateData<TRowData, TKey>) => any);
    /**
     * Specifies whether or not to display the column when grid records are grouped by it.
     */
    showWhenGrouped?: boolean;
    /**
     * Specifies the command column that this object customizes.
     */
    type?: DataGridCommandColumnType;
}

export type ColumnButton<TRowData = any, TKey = any> = dxDataGridColumnButton<TRowData, TKey>;
/**
 * @deprecated Use the DataGrid's ColumnButton type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDataGridColumnButton<TRowData = any, TKey = any> extends ColumnButtonBase {
    /**
     * The name used to identify a built-in button.
     */
    name?: DataGridPredefinedColumnButton | string;
    /**
     * A function that is executed when the button is clicked or tapped.
     */
    onClick?: ((e: ColumnButtonClickEvent<TRowData, TKey>) => void);
    /**
     * Specifies a custom button template.
     */
    template?: template | ((cellElement: DxElement, cellInfo: ColumnButtonTemplateData<TRowData, TKey>) => string | UserDefinedElement);
    /**
     * Specifies the button&apos;s visibility.
     */
    visible?: boolean | ((options: { component?: dxDataGrid<TRowData, TKey>; row?: Row<TRowData, TKey>; column?: Column<TRowData, TKey> }) => boolean);
    /**
     * Specifies whether the button is disabled.
     */
    disabled?: boolean | ((options: { component?: dxDataGrid<TRowData, TKey>; row?: Row<TRowData, TKey>; column?: Column<TRowData, TKey> }) => boolean);
}

/**
 * @deprecated Use Row instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxDataGridRowObject<TRowData = any, TKey = any> = Row<TRowData, TKey>;

/**
 * A grid row.
 */
export type Row<TRowData = any, TKey = any> = {
    /**
     * The data object represented by the row.
     */
    readonly data: TRowData;
    /**
     * The group index of the row. Available when the rowType is &apos;group&apos;.
     */
    readonly groupIndex?: number;
    /**
     * Indicates whether the row is in the editing state.
     */
    readonly isEditing?: boolean;
    /**
     * Indicates whether the row is expanded or collapsed. Available if rowType is &apos;data&apos; or &apos;group&apos;.
     */
    readonly isExpanded?: boolean;
    /**
     * Indicates that the row is added, but not yet saved. Available if rowType is &apos;data&apos;.
     */
    readonly isNewRow?: boolean;
    /**
     * Indicates whether the row is selected. Available if rowType is &apos;data&apos;.
     */
    readonly isSelected?: boolean;
    /**
     * The key of the data object represented by the row.
     */
    readonly key: TKey;
    /**
     * The visible index of the row.
     */
    readonly rowIndex: number;
    /**
     * The row&apos;s type.
     */
    readonly rowType: string;
    /**
     * Values of the row as they exist in the data source.
     */
    readonly values: Array<any>;
};

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

/**
 * @deprecated RowDraggingTemplateData from 'devextreme/common/grids' instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type RowDraggingTemplateDataModel = RowDraggingTemplateData;

export type Properties<TRowData = any, TKey = any> = dxDataGridOptions<TRowData, TKey>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
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
