import {
    UserDefinedElement,
    DxElement,
    UserDefinedElementsArray,
} from '../core/element';

import {
    template,
    DataStructure,
    Mode,
    ScrollMode,
    SingleMultipleOrNone,
    ToolbarItemLocation,
} from '../common';

import {
    DxPromise,
} from '../core/utils/deferred';

import { DataSource } from '../common/data';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

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

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface CellInfo<TRowData = any, TKey = any> {
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
}

export {
    DisplayMode,
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

export type TreeListPredefinedColumnButton = 'add' | 'cancel' | 'delete' | 'edit' | 'save' | 'undelete';
export type TreeListPredefinedToolbarItem = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'revertButton' | 'saveButton' | 'searchPanel';
export type TreeListCommandColumnType = 'adaptive' | 'buttons' | 'drag';
export type TreeListFilterMode = 'fullBranch' | 'withAncestors' | 'matchOnly';

export type Scrollable = Omit<dxScrollable, '_templateManager' | '_cancelOptionChange' | '_getTemplate' | '_invalidate' | '_refresh' | '_notifyOptionChanged' | '_createElement'>;

/**
 * The type of the adaptiveDetailRowPreparing event handler&apos;s argument.
 */
export type AdaptiveDetailRowPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & AdaptiveDetailRowPreparingInfo;

/**
 * The type of the cellClick event handler&apos;s argument.
 */
export type CellClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & CellInfo<TRowData, TKey>;

/**
 * The type of the cellDblClick event handler&apos;s argument.
 */
export type CellDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & CellInfo<TRowData, TKey>;

/**
 * The type of the cellHoverChanged event handler&apos;s argument.
 */
export type CellHoverChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & CellInfo<TRowData, TKey> & {
    /**
     * 
     */
    readonly eventType: string;
};

/**
 * The type of the cellPrepared event handler&apos;s argument.
 */
export type CellPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & CellInfo<TRowData, TKey> & {
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
    readonly watch?: Function;
    /**
     * 
     */
    readonly oldValue?: any;
};

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>>;

/**
 * The type of the contextMenuPreparing event handler&apos;s argument.
 */
export type ContextMenuPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
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
export type DataErrorOccurredEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & DataErrorOccurredInfo;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>>;

/**
 * The type of the editCanceled event handler&apos;s argument.
 */
export type EditCanceledEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/**
 * The type of the editCanceling event handler&apos;s argument.
 */
export type EditCancelingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/**
 * The type of the editingStart event handler&apos;s argument.
 */
export type EditingStartEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & {
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
    readonly column: Column<TRowData, TKey>;
};

/**
 * The type of the editorPrepared event handler&apos;s argument.
 */
export type EditorPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
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
export type EditorPreparingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & {
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
    updateValueTimeout?: number;
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
 * The type of the focusedCellChanged event handler&apos;s argument.
 */
export type FocusedCellChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
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
    readonly row: Row<TRowData, TKey>;
    /**
     * 
     */
    readonly column: Column<TRowData, TKey>;
};

/**
 * The type of the focusedCellChanging event handler&apos;s argument.
 */
export type FocusedCellChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxTreeList<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
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
export type FocusedRowChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
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
    readonly row: Row<TRowData, TKey>;
};

/**
 * The type of the focusedRowChanging event handler&apos;s argument.
 */
export type FocusedRowChangingEvent<TRowData = any, TKey = any> = Cancelable & NativeEventInfo<dxTreeList<TRowData, TKey>, KeyboardEvent | PointerEvent | MouseEvent | TouchEvent> & {
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
export type InitializedEvent<TRowData = any, TKey = any> = InitializedEventInfo<dxTreeList<TRowData, TKey>>;

/**
 * The type of the initNewRow event handler&apos;s argument.
 */
export type InitNewRowEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & NewRowInfo<TRowData>;

/**
 * The type of the keyDown event handler&apos;s argument.
 */
export type KeyDownEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, KeyboardEvent> & KeyDownInfo;

/**
 * The type of the nodesInitialized event handler&apos;s argument.
 */
export type NodesInitializedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
    /**
     * 
     */
    readonly root: Node<TRowData, TKey>;
};

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & ChangedOptionInfo;

/**
 * The type of the rowClick event handler&apos;s argument.
 */
export type RowClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & {
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
    readonly rowElement: DxElement;
    /**
     * 
     */
    readonly handled: boolean;
    /**
     * 
     */
    readonly node: Node<TRowData, TKey>;
    /**
     * 
     */
    readonly level: number;
};

/**
 * The type of the rowCollapsed event handler&apos;s argument.
 */
export type RowCollapsedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * The type of the rowCollapsing event handler&apos;s argument.
 */
export type RowCollapsingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * The type of the rowDblClick event handler&apos;s argument.
 */
export type RowDblClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & {
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
    readonly rowElement: DxElement;
};

/**
 * The type of the rowExpanded event handler&apos;s argument.
 */
export type RowExpandedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * The type of the rowExpanding event handler&apos;s argument.
 */
export type RowExpandingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxTreeList<TRowData, TKey>> & RowKeyInfo<TKey>;

/**
 * The type of the rowInserted event handler&apos;s argument.
 */
export type RowInsertedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowInsertedInfo<TRowData, TKey>;

/**
 * The type of the rowInserting event handler&apos;s argument.
 */
export type RowInsertingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowInsertingInfo<TRowData>;

/**
 * The type of the rowPrepared event handler&apos;s argument.
 */
export type RowPreparedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & {
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
    readonly rowElement: DxElement;
    /**
     * 
     */
    readonly node: Node<TRowData, TKey>;
    /**
     * 
     */
    readonly level: number;
};

/**
 * The type of the rowRemoved event handler&apos;s argument.
 */
export type RowRemovedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowRemovedInfo<TRowData, TKey>;

/**
 * The type of the rowRemoving event handler&apos;s argument.
 */
export type RowRemovingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowRemovingInfo<TRowData, TKey>;

/**
 * The type of the rowUpdated event handler&apos;s argument.
 */
export type RowUpdatedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowUpdatedInfo<TRowData, TKey>;

/**
 * The type of the rowUpdating event handler&apos;s argument.
 */
export type RowUpdatingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowUpdatingInfo<TRowData, TKey>;

/**
 * The type of the rowValidating event handler&apos;s argument.
 */
export type RowValidatingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & RowValidatingInfo<TRowData, TKey>;

/**
 * The type of the saved event handler&apos;s argument.
 */
export type SavedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & DataChangeInfo<TRowData, TKey>;

/**
 * The type of the saving event handler&apos;s argument.
 */
export type SavingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & SavingInfo<TRowData, TKey>;

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & SelectionChangedInfo<TRowData, TKey>;

/**
 * The type of the toolbarPreparing event handler&apos;s argument.
 */
export type ToolbarPreparingEvent<TRowData = any, TKey = any> = EventInfo<dxTreeList<TRowData, TKey>> & ToolbarPreparingInfo;

export type RowDraggingAddEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

export type RowDraggingChangeEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

export type RowDraggingEndEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

export type RowDraggingMoveEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragDropInfo;

export type RowDraggingStartEvent<TRowData = any, TKey = any> = Cancelable & ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & DragStartEventInfo<TRowData>;

export type RowDraggingRemoveEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData>;

export type RowDraggingReorderEvent<TRowData = any, TKey = any> = ReducedNativeEventInfo<dxTreeList<TRowData, TKey>> & RowDraggingEventInfo<TRowData> & DragReorderInfo;

export type ColumnButtonClickEvent<TRowData = any, TKey = any> = NativeEventInfo<dxTreeList<TRowData, TKey>, PointerEvent | MouseEvent> & {
    row?: Row<TRowData, TKey>;
    column?: Column<TRowData, TKey>;
};

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

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type ColumnHeaderCellTemplateData<TRowData = any, TKey = any> = {
    readonly component: dxTreeList<TRowData, TKey>;
    readonly columnIndex: number;
    readonly column: Column<TRowData, TKey>;
};

type OverriddenKeys = 'autoExpandAll' | 'columns' | 'customizeColumns' | 'dataStructure' | 'editing' | 'expandedRowKeys' | 'expandNodesOnFiltering' | 'filterMode' | 'hasItemsExpr' | 'itemsExpr' | 'keyExpr' | 'onCellClick' | 'onCellDblClick' | 'onCellHoverChanged' | 'onCellPrepared' | 'onContextMenuPreparing' | 'onEditingStart' | 'onEditorPrepared' | 'onEditorPreparing' | 'onFocusedCellChanged' | 'onFocusedCellChanging' | 'onFocusedRowChanged' | 'onFocusedRowChanging' | 'onNodesInitialized' | 'onRowClick' | 'onRowDblClick' | 'onRowPrepared' | 'paging' | 'parentIdExpr' | 'remoteOperations' | 'rootValue' | 'scrolling' | 'selection' | 'toolbar';

/**
 * 
 * @deprecated 
 */
export type dxTreeListOptions<TRowData = any, TKey = any> = Omit<GridBaseOptions<dxTreeList<TRowData, TKey>, TRowData, TKey>, OverriddenKeys> & {
    /**
     * Specifies whether all rows are expanded initially.
     */
    autoExpandAll?: boolean;
    /**
     * Configures columns.
     */
    columns?: Array<Column<TRowData, TKey> | string> | undefined;
    /**
     * Customizes columns after they are created.
     */
    customizeColumns?: ((columns: Array<Column<TRowData, TKey>>) => void);
    /**
     * Notifies the UI component of the used data structure.
     */
    dataStructure?: DataStructure;
    /**
     * Configures editing.
     */
    editing?: Editing<TRowData, TKey>;
    /**
     * Specifies whether nodes appear expanded or collapsed after filtering is applied.
     */
    expandNodesOnFiltering?: boolean;
    /**
     * Specifies keys of the initially expanded rows.
     */
    expandedRowKeys?: Array<TKey>;
    /**
     * Specifies whether filter and search results should include matching rows only, matching rows with ancestors, or matching rows with ancestors and descendants (full branch).
     */
    filterMode?: TreeListFilterMode;
    /**
     * Specifies which data field defines whether the node has children.
     */
    hasItemsExpr?: string | Function;
    /**
     * Specifies which data field contains nested items. Set this property when your data has a hierarchical structure.
     */
    itemsExpr?: string | Function;
    /**
     * Specifies the key property (or properties) that provide(s) key values to access data items. Each key value must be unique.
     */
    keyExpr?: string | Function;
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
     * A function that is executed after the focused cell changes. Applies only to cells in data rows.
     */
    onFocusedCellChanged?: ((e: FocusedCellChangedEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed before the focused cell changes. Applies only to cells in data rows.
     */
    onFocusedCellChanging?: ((e: FocusedCellChangingEvent<TRowData, TKey>) => void);
    /**
     * A function that executed when the focused row changes. Applies only to data rows. focusedRowEnabled should be true.
     */
    onFocusedRowChanged?: ((e: FocusedRowChangedEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed before the focused row changes. Applies only to data rows. focusedRowEnabled should be true.
     */
    onFocusedRowChanging?: ((e: FocusedRowChangingEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed after the loaded nodes are initialized.
     */
    onNodesInitialized?: ((e: NodesInitializedEvent<TRowData, TKey>) => void);
    /**
     * A function that is executed when a grid row is clicked or tapped.
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
     * Configures paging.
     */
    paging?: Paging;
    /**
     * Specifies which data field provides parent keys.
     */
    parentIdExpr?: string | Function;
    /**
     * Notifies the TreeList of the server&apos;s data processing operations. Applies only if data has a plain structure.
     */
    remoteOperations?: {
        /**
         * Specifies whether filtering should be performed on the server.
         */
        filtering?: boolean;
        /**
         * Specifies whether grouping should be performed on the server.
         */
        grouping?: boolean;
        /**
         * Specifies whether sorting should be performed on the server.
         */
        sorting?: boolean;
    } | Mode;
    /**
     * Specifies the root node&apos;s identifier. Applies if dataStructure is &apos;plain&apos;.
     */
    rootValue?: TKey;
    /**
     * Configures scrolling.
     */
    scrolling?: Scrolling;
    /**
     * Configures runtime selection.
     */
    selection?: Selection;
    /**
     * Configures the toolbar.
     */
    toolbar?: Toolbar | undefined;
};

/**
 * @deprecated Use Editing instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTreeListEditing<TRowData = any, TKey = any> = Editing<TRowData, TKey>;

/**
 * Configures editing.
 */
export interface Editing<TRowData = any, TKey = any> extends EditingBase<TRowData, TKey> {
    /**
     * Specifies whether a user can add new rows. It is called for each data row when defined as a function.
     */
    allowAdding?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey> }) => boolean);
    /**
     * Specifies whether a user can delete rows. It is called for each data row when defined as a function.
     */
    allowDeleting?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey> }) => boolean);
    /**
     * Specifies whether a user can update rows. It is called for each data row when defined as a function
     */
    allowUpdating?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey> }) => boolean);
    /**
     * Contains properties that specify texts for editing-related UI elements.
     */
    texts?: EditingTexts;
}

/**
 * @deprecated Use EditingTexts instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTreeListEditingTexts = EditingTexts;

/**
 * Contains properties that specify texts for editing-related UI elements.
 */
export type EditingTexts = EditingTextsBase & {
    /**
     * Specifies text for the button that adds a new nested row. Applies if the editing.mode is &apos;batch&apos; or &apos;cell&apos;.
     */
    addRowToNode?: string;
};

/**
 * @deprecated Use Paging instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTreeListPaging = Paging;

/**
 * An object that configures paging.
 */
export type Paging = PagingBase & {
    /**
     * Specifies whether paging is enabled.
     */
    enabled?: boolean;
};

/**
 * @deprecated Use Scrolling instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTreeListScrolling = Scrolling;

/**
 * Configures scrolling.
 */
export interface Scrolling extends ScrollingBase {
    /**
     * Specifies the scrolling mode.
     */
    mode?: ScrollMode;
}

/**
 * @deprecated Use Selection instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTreeListSelection = Selection;

/**
 * Configures runtime selection.
 */
export interface Selection extends SelectionBase {
    /**
     * Specifies whether selection is recursive.
     */
    recursive?: boolean;
}
/**
 * The TreeList is a UI component that represents data from a local or remote source in the form of a multi-column tree view. This UI component offers such features as sorting, filtering, editing, selection, etc.
 */
export default class dxTreeList<TRowData = any, TKey = any> extends Widget<dxTreeListOptions<TRowData, TKey>> implements GridBase<TRowData, TKey> {
    /**
     * Adds a new column.
     */
    addColumn(columnOptions: Column<TRowData, TKey> | string): void;
    /**
     * Adds an empty data row to the highest hierarchical level and switches it to the editing state.
     */
    addRow(): DxPromise<void>;
    /**
     * Adds an empty data row to a specified parent row.
     */
    addRow(parentId: TKey): DxPromise<void>;
    /**
     * Collapses a row with a specific key.
     */
    collapseRow(key: TKey): DxPromise<void>;
    /**
     * Expands a row with a specific key.
     */
    expandRow(key: TKey): DxPromise<void>;
    /**
     * Performs a pre-order tree traversal, executing a function on each visited node. Starts traversing from the top level nodes.
     */
    forEachNode(callback: Function): void;
    /**
     * Performs a pre-order tree traversal, executing a function on each visited node. Starts traversing from the specified nodes.
     */
    forEachNode(nodes: Array<Node<TRowData, TKey>>, callback: Function): void;
    /**
     * Gets a node with a specific key.
     */
    getNodeByKey(key: TKey): Node<TRowData, TKey>;
    /**
     * Gets the root node.
     */
    getRootNode(): Node<TRowData, TKey>;
    /**
     * Gets the keys of the rows selected explicitly via the API or via a click or tap.
     */
    getSelectedRowKeys(): Array<TKey>;
    /**
     * Gets selected row keys.
     */
    getSelectedRowKeys(mode: string): Array<TKey>;
    /**
     * Gets the data objects of the rows selected explicitly via the API or via a click or tap.
     */
    getSelectedRowsData(): Array<TRowData>;
    /**
     * Gets selected row data objects.
     */
    getSelectedRowsData(mode: string): Array<TRowData>;
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
     * Checks whether a row is expanded or collapsed.
     */
    isRowExpanded(key: TKey): boolean;
    /**
     * Loads all root node descendants (all data items). Takes effect only if data has the plain structure and remoteOperations.filtering is true.
     */
    loadDescendants(): DxPromise<void>;
    /**
     * Loads a specific node&apos;s descendants. Takes effect only if data has the plain structure and remoteOperations.filtering is true.
     */
    loadDescendants(keys: Array<TKey>): DxPromise<void>;
    /**
     * Loads all or only direct descendants of specific nodes. Takes effect only if data has the plain structure and remoteOperations.filtering is true.
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
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTreeListToolbar = Toolbar;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTreeListToolbarItem = ToolbarItem;

/**
 * Configures toolbar items.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ToolbarItem extends dxToolbarItem {
    /**
     * A name used to identify the toolbar item.
     */
    name?: TreeListPredefinedToolbarItem | string;
    /**
     * Specifies a location for the item on the toolbar.
     */
    location?: ToolbarItemLocation;
}

/**
 * Configures the toolbar.
 */
export type Toolbar = {
    /**
     * Configures toolbar items.
     */
    items?: Array<TreeListPredefinedToolbarItem | ToolbarItem>;
    /**
     * Specifies whether the toolbar is visible.
     */
    visible?: boolean | undefined;
    /**
     * Specifies whether the toolbar responds to user interaction.
     */
    disabled?: boolean;
};

export type Column<TRowData = any, TKey = any> = dxTreeListColumn<TRowData, TKey>;

/**
 * @deprecated Use the Column type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTreeListColumn<TRowData = any, TKey = any> extends ColumnBase<TRowData> {
    /**
     * Allows you to customize buttons in the edit column or create a custom command column. Applies only if the column&apos;s type is &apos;buttons&apos;.
     */
    buttons?: Array<TreeListPredefinedColumnButton | ColumnButton<TRowData, TKey>>;
    /**
     * Specifies a custom template for data cells.
     */
    cellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnCellTemplateData<TRowData, TKey>) => any);
    /**
     * Configures columns.
     */
    columns?: Array<Column<TRowData, TKey> | string> | undefined;
    /**
     * Specifies a custom template for data cells in an editing state.
     */
    editCellTemplate?: template | ((cellElement: DxElement, cellInfo: ColumnEditCellTemplateData<TRowData, TKey>) => any);
    /**
     * Specifies a custom template for column headers.
     */
    headerCellTemplate?: template | ((columnHeader: DxElement, headerInfo: ColumnHeaderCellTemplateData<TRowData, TKey>) => any);
    /**
     * Specifies the command column that this object customizes.
     */
    type?: TreeListCommandColumnType;
}

export type ColumnButton<TRowData = any, TKey = any> = dxTreeListColumnButton<TRowData, TKey>;

/**
 * @deprecated Use the TreeList's ColumnButton type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTreeListColumnButton<TRowData = any, TKey = any> extends ColumnButtonBase {
    /**
     * The name used to identify a built-in button.
     */
    name?: TreeListPredefinedColumnButton | string;
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
    visible?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey>; readonly column: Column<TRowData, TKey> }) => boolean);
    /**
     * Specifies whether the button is disabled.
     */
    disabled?: boolean | ((options: { readonly component: dxTreeList<TRowData, TKey>; readonly row?: Row<TRowData, TKey>; readonly column: Column<TRowData, TKey> }) => boolean);
}

/**
 * @deprecated Use Node instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTreeListNode<TRowData = any, TKey = any> = Node<TRowData, TKey>;

/**
 * A TreeList node&apos;s structure.
 */
export type Node<TRowData = any, TKey = any> = {
    /**
     * Contains all child nodes.
     */
    children?: Array<Node<TRowData, TKey>>;
    /**
     * The node&apos;s data object.
     */
    data?: TRowData;
    /**
     * Indicates whether the node has child nodes.
     */
    hasChildren?: boolean;
    /**
     * The node&apos;s key.
     */
    key: TKey;
    /**
     * The node&apos;s hierarchical level.
     */
    level: number;
    /**
     * The parent node.
     */
    parent?: Node<TRowData, TKey>;
    /**
     * Indicates whether the node is visualized as a row.
     */
    visible?: boolean;
};

/**
 * @deprecated Use Row instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTreeListRowObject<TRowData = any, TKey = any> = Row<TRowData, TKey>;

/**
 * A grid row.
 */
export type Row<TRowData = any, TKey = any> = {
    /**
     * Indicates whether the row is in the editing state.
     */
    readonly isEditing?: boolean;
    /**
     * Indicates whether the row is expanded or collapsed. Available if rowType is &apos;data&apos;.
     */
    readonly isExpanded?: boolean;
    /**
     * Indicates that the row is added, but not yet saved. Available if rowType is &apos;data&apos;.
     */
    readonly isNewRow?: boolean;
    /**
     * Indicates whether the row is selected. Available if rowType is &apos;data&apos; or &apos;detail&apos;.
     */
    readonly isSelected?: boolean;
    /**
     * The row&apos;s key. Available if rowType is &apos;data&apos;, &apos;detail&apos; or &apos;detailAdaptive&apos;.
     */
    readonly key: TKey;
    /**
     * The row&apos;s hierarchical level. Available if rowType is &apos;data&apos; or &apos;detail&apos;.
     */
    readonly level: number;
    /**
     * The row&apos;s node. Available if rowType is &apos;data&apos; or &apos;detail&apos;.
     */
    readonly node: Node<TRowData, TKey>;
    /**
     * The row&apos;s visible index. This index is zero-based and available if rowType is &apos;data&apos;, &apos;detail&apos; or &apos;detailAdaptive&apos;.
     */
    readonly rowIndex: number;
    /**
     * The row&apos;s type.
     */
    readonly rowType: string;
    /**
     * Values displayed in the row&apos;s cells.
     */
    readonly values: Array<any>;
    /**
     * A data object that the row visualizes.
     */
    readonly data: TRowData;
};

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

export type Properties<TRowData = any, TKey = any> = dxTreeListOptions<TRowData, TKey>;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options<TRowData = any, TKey = any> = dxTreeListOptions<TRowData, TKey>;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onCellClick' | 'onCellDblClick' | 'onCellHoverChanged' | 'onCellPrepared' | 'onContextMenuPreparing' | 'onEditingStart' | 'onEditorPrepared' | 'onEditorPreparing' | 'onFocusedCellChanged' | 'onFocusedCellChanging' | 'onFocusedRowChanged' | 'onFocusedRowChanging' | 'onNodesInitialized' | 'onRowClick' | 'onRowDblClick' | 'onRowPrepared'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTreeListOptions.onAdaptiveDetailRowPreparing
 * @type_function_param1 e:{ui/tree_list:AdaptiveDetailRowPreparingEvent}
 */
onAdaptiveDetailRowPreparing?: ((e: AdaptiveDetailRowPreparingEvent) => void);
/**
 * @docid dxTreeListOptions.onContentReady
 * @type_function_param1 e:{ui/tree_list:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxTreeListOptions.onDataErrorOccurred
 * @type_function_param1 e:{ui/tree_list:DataErrorOccurredEvent}
 */
onDataErrorOccurred?: ((e: DataErrorOccurredEvent) => void);
/**
 * @docid dxTreeListOptions.onDisposing
 * @type_function_param1 e:{ui/tree_list:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTreeListOptions.onEditCanceled
 * @type_function_param1 e:{ui/tree_list:EditCanceledEvent}
 */
onEditCanceled?: ((e: EditCanceledEvent) => void);
/**
 * @docid dxTreeListOptions.onEditCanceling
 * @type_function_param1 e:{ui/tree_list:EditCancelingEvent}
 */
onEditCanceling?: ((e: EditCancelingEvent) => void);
/**
 * @docid dxTreeListOptions.onInitialized
 * @type_function_param1 e:{ui/tree_list:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTreeListOptions.onInitNewRow
 * @type_function_param1 e:{ui/tree_list:InitNewRowEvent}
 */
onInitNewRow?: ((e: InitNewRowEvent) => void);
/**
 * @docid dxTreeListOptions.onKeyDown
 * @type_function_param1 e:{ui/tree_list:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @docid dxTreeListOptions.onOptionChanged
 * @type_function_param1 e:{ui/tree_list:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxTreeListOptions.onRowCollapsed
 * @type_function_param1 e:{ui/tree_list:RowCollapsedEvent}
 */
onRowCollapsed?: ((e: RowCollapsedEvent) => void);
/**
 * @docid dxTreeListOptions.onRowCollapsing
 * @type_function_param1 e:{ui/tree_list:RowCollapsingEvent}
 */
onRowCollapsing?: ((e: RowCollapsingEvent) => void);
/**
 * @docid dxTreeListOptions.onRowExpanded
 * @type_function_param1 e:{ui/tree_list:RowExpandedEvent}
 */
onRowExpanded?: ((e: RowExpandedEvent) => void);
/**
 * @docid dxTreeListOptions.onRowExpanding
 * @type_function_param1 e:{ui/tree_list:RowExpandingEvent}
 */
onRowExpanding?: ((e: RowExpandingEvent) => void);
/**
 * @docid dxTreeListOptions.onRowInserted
 * @type_function_param1 e:{ui/tree_list:RowInsertedEvent}
 */
onRowInserted?: ((e: RowInsertedEvent) => void);
/**
 * @docid dxTreeListOptions.onRowInserting
 * @type_function_param1 e:{ui/tree_list:RowInsertingEvent}
 */
onRowInserting?: ((e: RowInsertingEvent) => void);
/**
 * @docid dxTreeListOptions.onRowRemoved
 * @type_function_param1 e:{ui/tree_list:RowRemovedEvent}
 */
onRowRemoved?: ((e: RowRemovedEvent) => void);
/**
 * @docid dxTreeListOptions.onRowRemoving
 * @type_function_param1 e:{ui/tree_list:RowRemovingEvent}
 */
onRowRemoving?: ((e: RowRemovingEvent) => void);
/**
 * @docid dxTreeListOptions.onRowUpdated
 * @type_function_param1 e:{ui/tree_list:RowUpdatedEvent}
 */
onRowUpdated?: ((e: RowUpdatedEvent) => void);
/**
 * @docid dxTreeListOptions.onRowUpdating
 * @type_function_param1 e:{ui/tree_list:RowUpdatingEvent}
 */
onRowUpdating?: ((e: RowUpdatingEvent) => void);
/**
 * @docid dxTreeListOptions.onRowValidating
 * @type_function_param1 e:{ui/tree_list:RowValidatingEvent}
 */
onRowValidating?: ((e: RowValidatingEvent) => void);
/**
 * @docid dxTreeListOptions.onSaved
 * @type_function_param1 e:{ui/tree_list:SavedEvent}
 */
onSaved?: ((e: SavedEvent) => void);
/**
 * @docid dxTreeListOptions.onSaving
 * @type_function_param1 e:{ui/tree_list:SavingEvent}
 */
onSaving?: ((e: SavingEvent) => void);
/**
 * @docid dxTreeListOptions.onSelectionChanged
 * @type_function_param1 e:{ui/tree_list:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @docid dxTreeListOptions.onToolbarPreparing
 * @type_function_param1 e:{ui/tree_list:ToolbarPreparingEvent}
 */
onToolbarPreparing?: ((e: ToolbarPreparingEvent) => void);
};
///#ENDDEBUG
