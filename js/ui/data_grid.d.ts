import DataSource, { DataSourceLike, Options as DataSourceOptions } from '../data/data_source';
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
    DeepPartial,
    Skip,
} from '../core/index';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    DataGridCell as ExcelCell,
} from '../excel_exporter';

import {
    ExcelFont,
} from '../exporter/excel/excel.doc_comments';

import dxDraggable from './draggable';

import {
    dxFilterBuilderOptions,
    FilterLookupDataSource,
} from './filter_builder';

import {
    dxFormOptions,
    dxFormSimpleItem,
} from './form';

import {
    Properties as PopupProperties,
} from './popup';

import dxScrollable from './scroll_view/ui.scrollable';

import dxSortable from './sortable';

import {
    dxToolbarOptions, dxToolbarItem,
} from './toolbar';

import {
    AsyncRule,
    CompareRule,
    CustomRule,
    EmailRule,
    NumericRule,
    PatternRule,
    RangeRule,
    RequiredRule,
    StringLengthRule,
} from './validation_rules';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
  Format,
} from '../localization';

import {
    SearchMode,
    DataType,
    DragDirection,
    DragHighlight,
    HorizontalAlignment,
    HorizontalEdge,
    Mode,
    ScrollbarMode,
    SelectAllMode,
    SingleMultipleOrNone,
    SortOrder,
    ToolbarItemLocation,
} from '../common';

import {
    ApplyFilterMode,
    ColumnChooserMode,
    DataChangeType,
    DataRenderMode,
    EnterKeyAction,
    EnterKeyDirection,
    FilterOperation,
    FilterType,
    GridsEditMode,
    GridsEditRefreshMode,
    GroupExpandMode,
    NewRowPosition,
    PagerDisplayMode,
    PagerPageSize,
    SelectedFilterOperation,
    SelectionColumnDisplayMode,
    StartEditAction,
    StateStoreType,
    SummaryType,
} from '../common/grids';

export {
    ExcelUnderlineType,
} from '../exporter/excel/excel.doc_comments';

export {
    ApplyFilterMode,
    SearchMode,
    ColumnChooserMode,
    DataChangeType,
    DataRenderMode,
    DataType,
    DragDirection,
    DragHighlight,
    EnterKeyAction,
    EnterKeyDirection,
    FilterOperation,
    FilterType,
    GridsEditMode,
    GridsEditRefreshMode,
    GroupExpandMode,
    HorizontalAlignment,
    HorizontalEdge,
    Mode,
    NewRowPosition,
    PagerDisplayMode,
    PagerPageSize,
    ScrollbarMode,
    SelectAllMode,
    SelectedFilterOperation,
    SelectionColumnDisplayMode,
    SortOrder,
    StartEditAction,
    StateStoreType,
    SummaryType,
    ToolbarItemLocation,
};

/** @public */
export type ColumnResizeMode = 'nextColumn' | 'widget';
/** @public */
export type DataGridCommandColumnType = 'adaptive' | 'buttons' | 'detailExpand' | 'groupExpand' | 'selection' | 'drag';
/** @public */
export type DataGridExportFormat = 'pdf' | 'xlsx';
/** @public */
export type DataGridScrollMode = 'infinite' | 'standard' | 'virtual';
/** @public */
export type ExcelCellHorizontalAlignment = 'center' | 'centerContinuous' | 'distributed' | 'fill' | 'general' | 'justify' | 'left' | 'right';
/** @public */
export type ExcelCellPatternType = 'darkDown' | 'darkGray' | 'darkGrid' | 'darkHorizontal' | 'darkTrellis' | 'darkUp' | 'darkVertical' | 'gray0625' | 'gray125' | 'lightDown' | 'lightGray' | 'lightGrid' | 'lightHorizontal' | 'lightTrellis' | 'lightUp' | 'lightVertical' | 'mediumGray' | 'none' | 'solid';
/** @public */
export type ExcelCellVerticalAlignment = 'bottom' | 'center' | 'distributed' | 'justify' | 'top';
/** @public */
export type HeaderFilterGroupInterval = 'day' | 'hour' | 'minute' | 'month' | 'quarter' | 'second' | 'year';
/** @public */
export type DataGridPredefinedColumnButton = 'cancel' | 'delete' | 'edit' | 'save' | 'undelete';
/** @public */
export type DataGridPredefinedToolbarItem = 'addRowButton' | 'applyFilterButton' | 'columnChooserButton' | 'exportButton' | 'groupPanel' | 'revertButton' | 'saveButton' | 'searchPanel';

export interface AdaptiveDetailRowPreparingInfo {
  readonly formOptions: any;
}

export interface DataErrorOccurredInfo {
  readonly error?: Error;
}

export interface DataChangeInfo<TRowData = any, TKey = any> {
  readonly changes: Array<DataChange<TRowData, TKey>>;
}

export interface NewRowInfo<TRowData = any> {
  data: TRowData;
  promise?: PromiseLike<void>;
}

export interface KeyDownInfo {
  handled: boolean;
}

type GroupKey = any[];

/** @public */
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

export interface RowKeyInfo<TKey = any> {
  readonly key: TKey;
}

export interface RowInsertedInfo<TRowData = any, TKey = any> {
  readonly data: TRowData;
  readonly key: TKey;
  readonly error: Error;
}

export interface RowInsertingInfo<TRowData = any> {
  data: TRowData;
  cancel: boolean | PromiseLike<void>;
}

export interface RowRemovedInfo<TRowData = any, TKey = any> {
  readonly data: TRowData;
  readonly key: TKey;
  readonly error: Error;
}

export interface RowRemovingInfo<TRowData = any, TKey = any> {
  readonly data: TRowData;
  readonly key: TKey;
  cancel: boolean | PromiseLike<void>;
}

export interface RowUpdatedInfo<TRowData = any, TKey = any> {
  readonly data: TRowData;
  readonly key: TKey;
  readonly error: Error;
}

export interface RowUpdatingInfo<TRowData = any, TKey = any> {
  readonly oldData: TRowData;
  newData: DeepPartial<TRowData>;
  readonly key: TKey;
  cancel: boolean | PromiseLike<void>;
}

export interface RowValidatingInfo<TRowData = any, TKey = any> {
  readonly brokenRules: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
  isValid: boolean;
  readonly key: TKey;
  readonly newData: DeepPartial<TRowData>;
  readonly oldData: TRowData;
  errorText: string;
  promise?: PromiseLike<void>;
}

export interface SavingInfo<TRowData = any, TKey = any> {
  changes: Array<DataChange<TRowData, TKey>>;
  promise?: PromiseLike<void>;
  cancel: boolean;
}

export interface SelectionChangedInfo<TRowData = any, TKey = any> {
  readonly currentSelectedRowKeys: Array<TKey>;
  readonly currentDeselectedRowKeys: Array<TKey>;
  readonly selectedRowKeys: Array<TKey>;
  readonly selectedRowsData: Array<TRowData>;
}

export interface ToolbarPreparingInfo {
  toolbarOptions: dxToolbarOptions;
}

export interface RowDraggingEventInfo<T extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> {
  readonly component: T;
  readonly event: DxEvent<PointerEvent | MouseEvent | TouchEvent>;
  readonly itemData?: TRowData;
  readonly itemElement: DxElement;
  readonly fromIndex: number;
  readonly toIndex: number;
  readonly fromComponent: dxSortable | dxDraggable;
  readonly toComponent: dxSortable | dxDraggable;
  readonly fromData?: any;
  readonly toData?: any;
}

export interface DragStartEventInfo<T extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> {
  readonly component: T;
  readonly event: DxEvent<PointerEvent | MouseEvent | TouchEvent>;
  itemData?: TRowData;
  readonly itemElement: DxElement;
  readonly fromIndex: number;
  readonly fromData?: any;
}

export interface DragDropInfo {
  readonly dropInsideItem: boolean;
}

export interface DragReorderInfo {
  readonly dropInsideItem: boolean;
  promise?: PromiseLike<void>;
}

export interface RowDraggingTemplateDataModel<TRowData = any> {
  readonly itemData: TRowData;
  readonly itemElement: DxElement;
}

export interface FilterPanelCustomizeTextArg<T> {
  readonly component: T;
  readonly filterValue: any;
  readonly text: string;
}

export interface FilterPanel<T extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> {
  /**
   * @docid GridBaseOptions.filterPanel.customizeText
   * @type_function_param1 e:object
   * @type_function_param1_field component:this
   * @type_function_param1_field filterValue:object
   */
  customizeText?: ((e: FilterPanelCustomizeTextArg<T>) => string);
  /**
   * @docid GridBaseOptions.filterPanel.filterEnabled
   * @default true
   * @fires GridBaseOptions.onOptionChanged
   */
  filterEnabled?: boolean;
  /**
   * @docid GridBaseOptions.filterPanel.texts
   * @type object
   * @default {}
   */
  texts?: FilterPanelTexts;
  /**
   * @docid GridBaseOptions.filterPanel.visible
   * @default false
   */
  visible?: boolean;
}

export interface RowDragging<T extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> {
    /**
     * @docid GridBaseOptions.rowDragging.allowDropInsideItem
     * @default false
     */
    allowDropInsideItem?: boolean;
    /**
     * @docid GridBaseOptions.rowDragging.allowReordering
     * @default false
     */
    allowReordering?: boolean;
    /**
     * @docid GridBaseOptions.rowDragging.autoScroll
     * @default true
     */
    autoScroll?: boolean;
    /**
     * @docid GridBaseOptions.rowDragging.boundary
     * @default undefined
     */
    boundary?: string | UserDefinedElement;
    /**
     * @docid GridBaseOptions.rowDragging.container
     * @default undefined
     */
    container?: string | UserDefinedElement;
    /**
     * @docid GridBaseOptions.rowDragging.cursorOffset
     */
    cursorOffset?: string | {
      /**
       * @docid GridBaseOptions.rowDragging.cursorOffset.x
       * @default 0
       */
      x?: number;
      /**
       * @docid GridBaseOptions.rowDragging.cursorOffset.y
       * @default 0
       */
      y?: number;
    };
    /**
     * @docid GridBaseOptions.rowDragging.data
     * @default undefined
     */
    data?: any;
    /**
     * @docid GridBaseOptions.rowDragging.dragDirection
     * @default "both"
     */
    dragDirection?: DragDirection;
    /**
     * @docid GridBaseOptions.rowDragging.dragTemplate
     * @type_function_param1 dragInfo:object
     * @type_function_param1_field itemData:any
     * @type_function_return string|Element|jQuery
     * @default undefined
     */
    dragTemplate?: template | ((dragInfo: RowDraggingTemplateData<TRowData>, containerElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid GridBaseOptions.rowDragging.dropFeedbackMode
     * @default "indicate"
     */
    dropFeedbackMode?: DragHighlight;
    /**
     * @docid GridBaseOptions.rowDragging.filter
     * @default "> *"
     */
    filter?: string;
    /**
     * @docid GridBaseOptions.rowDragging.group
     * @default undefined
     */
    group?: string;
    /**
     * @docid GridBaseOptions.rowDragging.handle
     * @default ""
     */
    handle?: string;
    /**
     * @docid GridBaseOptions.rowDragging.onAdd
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:any
     */
    onAdd?: ((e: RowDraggingEventInfo<T, TRowData, TKey> & DragDropInfo) => void);
    /**
     * @docid GridBaseOptions.rowDragging.onDragChange
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:any
     */
    onDragChange?: ((e: Cancelable & RowDraggingEventInfo<T, TRowData, TKey> & DragDropInfo) => void);
    /**
     * @docid GridBaseOptions.rowDragging.onDragEnd
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:any
     */
    onDragEnd?: ((e: Cancelable & RowDraggingEventInfo<T, TRowData, TKey> & DragDropInfo) => void);
    /**
     * @docid GridBaseOptions.rowDragging.onDragMove
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:any
     */
    onDragMove?: ((e: Cancelable & RowDraggingEventInfo<T, TRowData, TKey> & DragDropInfo) => void);
    /**
     * @docid GridBaseOptions.rowDragging.onDragStart
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:any
     */
    onDragStart?: ((e: Cancelable & DragStartEventInfo<T, TRowData, TKey>) => void);
    /**
     * @docid GridBaseOptions.rowDragging.onRemove
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:any
     */
    onRemove?: ((e: RowDraggingEventInfo<T, TRowData, TKey>) => void);
    /**
     * @docid GridBaseOptions.rowDragging.onReorder
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @type_function_param1_field itemData:any
     * @type_function_param1_field promise:Promise<void>
     */
    onReorder?: ((e: RowDraggingEventInfo<dxDataGrid<TRowData, TKey>, TRowData, TKey> & DragReorderInfo) => void);
    /**
     * @docid GridBaseOptions.rowDragging.scrollSensitivity
     * @default 60
     */
    scrollSensitivity?: number;
    /**
     * @docid GridBaseOptions.rowDragging.scrollSpeed
     * @default 30
     */
    scrollSpeed?: number;
    /**
     * @docid GridBaseOptions.rowDragging.showDragIcons
     * @default true
     */
    showDragIcons?: boolean;
}

/**
 * @namespace DevExpress.ui
 */
export interface GridBaseOptions<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> extends WidgetOptions<TComponent> {
    /**
     * @docid
     * @default false
     * @public
     */
    allowColumnReordering?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    allowColumnResizing?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    autoNavigateToFocusedRow?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    cacheEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    cellHintEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    columnAutoWidth?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    columnChooser?: ColumnChooser;
    /**
     * @docid
     * @type object
     * @public
     */
    columnFixing?: ColumnFixing;
    /**
     * @docid
     * @default false
     * @public
     */
    columnHidingEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    columnMinWidth?: number;
    /**
     * @docid
     * @default "nextColumn"
     * @public
     */
    columnResizingMode?: ColumnResizeMode;
    /**
     * @docid
     * @default undefined
     * @public
     */
    columnWidth?: number | Mode;
    /**
     * @docid
     * @type Array<GridBaseColumn|string>
     * @fires GridBaseOptions.onOptionChanged
     * @default undefined
     * @public
     */
    columns?: Array<ColumnBase<TRowData> | string>;
    /**
     * @docid
     * @default null
     * @public
     * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
     */
    dataSource?: DataSourceLike<TRowData, TKey> | null;
    /**
     * @docid
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid
     * @public
     * @type object
     */
    editing?: EditingBase<TRowData, TKey>;
    /**
     * @docid
     * @default true
     * @public
     */
    errorRowEnabled?: boolean;
    /**
     * @docid
     * @default {}
     * @public
     */
    filterBuilder?: dxFilterBuilderOptions;
    /**
     * @docid
     * @default {}
     * @public
     * @type dxPopupOptions
     */
    filterBuilderPopup?: PopupProperties;
    /**
     * @docid
     * @type object
     * @default {}
     * @public
     */
    filterPanel?: FilterPanel<TComponent, TRowData, TKey>;
    /**
     * @docid
     * @type object
     * @public
     */
    filterRow?: FilterRow;
    /**
     * @docid
     * @default "auto"
     * @public
     */
    filterSyncEnabled?: boolean | Mode;
    /**
     * @docid
     * @type Filter expression
     * @default null
     * @fires GridBase.onOptionChanged
     * @public
     */
    filterValue?: string | Array<any> | Function;
    /**
     * @docid
     * @default -1
     * @fires GridBaseOptions.onFocusedCellChanged
     * @public
     */
    focusedColumnIndex?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    focusedRowEnabled?: boolean;
    /**
     * @docid
     * @default -1
     * @fires GridBaseOptions.onFocusedRowChanged
     * @public
     */
    focusedRowIndex?: number;
    /**
     * @docid
     * @default undefined
     * @fires GridBaseOptions.onFocusedRowChanged
     * @public
     */
    focusedRowKey?: TKey;
    /**
     * @docid
     * @hidden
     */
    focusStateEnabled?: any;
    /**
     * @docid
     * @type object
     * @public
     */
    headerFilter?: HeaderFilter;
    /**
     * @docid
     * @default false
     * @public
     */
    highlightChanges?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    keyboardNavigation?: KeyboardNavigation;
    /**
     * @docid
     * @type object
     * @public
     */
    loadPanel?: LoadPanel;
    /**
     * @docid
     * @default "No data"
     * @public
     */
    noDataText?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field formOptions:object
     * @action
     * @public
     */
    onAdaptiveDetailRowPreparing?: ((e: EventInfo<TComponent> & AdaptiveDetailRowPreparingInfo) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @action
     * @public
     */
    onDataErrorOccurred?: ((e: EventInfo<TComponent> & DataErrorOccurredInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field changes:Array<DataChange>
     * @default null
     * @action
     * @public
     */
    onEditCanceled?: ((e: EventInfo<TComponent> & DataChangeInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field changes:Array<DataChange>
     * @default null
     * @action
     * @public
     */
    onEditCanceling?: ((e: Cancelable & EventInfo<TComponent> & DataChangeInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field data:object
     * @type_function_param1_field promise:Promise<void>
     * @default null
     * @action
     * @public
     */
    onInitNewRow?: ((e: EventInfo<TComponent> & NewRowInfo<TRowData>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field event:event
     * @default null
     * @action
     * @public
     */
    onKeyDown?: ((e: NativeEventInfo<TComponent, KeyboardEvent> & KeyDownInfo) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field key:any
     * @default null
     * @action
     * @public
     */
    onRowCollapsed?: ((e: EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field key:any
     * @default null
     * @action
     * @public
     */
    onRowCollapsing?: ((e: Cancelable & EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field key:any
     * @default null
     * @action
     * @public
     */
    onRowExpanded?: ((e: EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field key:any
     * @default null
     * @action
     * @public
     */
    onRowExpanding?: ((e: Cancelable & EventInfo<TComponent> & RowKeyInfo<TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @default null
     * @action
     * @public
     */
    onRowInserted?: ((e: EventInfo<TComponent> & RowInsertedInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field data:object
     * @type_function_param1_field cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onRowInserting?: ((e: EventInfo<TComponent> & RowInsertingInfo<TRowData>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @default null
     * @action
     * @public
     */
    onRowRemoved?: ((e: EventInfo<TComponent> & RowRemovedInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @type_function_param1_field cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onRowRemoving?: ((e: EventInfo<TComponent> & RowRemovingInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field data:object
     * @type_function_param1_field key:any
     * @default null
     * @action
     * @public
     */
    onRowUpdated?: ((e: EventInfo<TComponent> & RowUpdatedInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field oldData:object
     * @type_function_param1_field newData:object
     * @type_function_param1_field key:any
     * @type_function_param1_field cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onRowUpdating?: ((e: EventInfo<TComponent> & RowUpdatingInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field key:any
     * @type_function_param1_field newData:object
     * @type_function_param1_field oldData:object
     * @type_function_param1_field promise:Promise<void>
     * @default null
     * @action
     * @public
     */
    onRowValidating?: ((e: EventInfo<TComponent> & RowValidatingInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field changes:Array<DataChange>
     * @default null
     * @action
     * @public
     */
    onSaved?: ((e: EventInfo<TComponent> & DataChangeInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field changes:Array<DataChange>
     * @type_function_param1_field promise:Promise<void>
     * @default null
     * @action
     * @public
     */
    onSaving?: ((e: EventInfo<TComponent> & SavingInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field currentSelectedRowKeys:Array<any>
     * @type_function_param1_field currentDeselectedRowKeys:Array<any>
     * @type_function_param1_field selectedRowKeys:Array<any>
     * @type_function_param1_field selectedRowsData:Array<Object>
     * @default null
     * @action
     * @public
     */
    onSelectionChanged?: ((e: EventInfo<TComponent> & SelectionChangedInfo<TRowData, TKey>) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @default null
     * @action
     * @public
     */
    onToolbarPreparing?: ((e: EventInfo<TComponent> & ToolbarPreparingInfo) => void);
    /**
     * @docid
     * @type object
     * @public
     */
    pager?: Pager;
    /**
     * @docid
     * @public
     * @type object
     */
    paging?: PagingBase;
    /**
     * @docid
     * @default undefined
     * @public
     */
    renderAsync?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    repaintChangesOnly?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    rowAlternationEnabled?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    rowDragging?: RowDragging<TComponent, TRowData, TKey>;
    /**
     * @docid
     * @public
     * @type object
     */
    scrolling?: ScrollingBase;
    /**
     * @docid
     * @type object
     * @public
     */
    searchPanel?: SearchPanel;
    /**
     * @docid
     * @fires GridBaseOptions.onSelectionChanged
     * @public
     */
    selectedRowKeys?: Array<TKey>;
    /**
     * @docid
     * @public
     * @type object
     */
    selection?: SelectionBase;
    /**
     * @docid
     * @default false
     * @public
     */
    showBorders?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showColumnHeaders?: boolean;
    /**
     * @docid
     * @default false &for(Material)
     * @default true
     * @public
     */
    showColumnLines?: boolean;
    /**
     * @docid
     * @default true &for(iOS)
     * @default true &for(Material)
     * @default false
     * @public
     */
    showRowLines?: boolean;
    /**
     * @docid
     * @type object
     * @public
     */
    sorting?: Sorting;
    /**
     * @docid
     * @type object
     * @public
     */
    stateStoring?: StateStoring;
    /**
     * @docid
     * @default true
     * @public
     */
    twoWayBindingEnabled?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    wordWrapEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    syncLookupFilterValues?: boolean;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface ColumnChooser {
    /**
     * @docid GridBaseOptions.columnChooser.allowSearch
     * @default false
     */
    allowSearch?: boolean;
    /**
     * @docid GridBaseOptions.columnChooser.emptyPanelText
     * @default "Drag a column here to hide it"
     */
    emptyPanelText?: string;
    /**
     * @docid GridBaseOptions.columnChooser.enabled
     * @default false
     */
    enabled?: boolean;
    /**
     * @docid GridBaseOptions.columnChooser.height
     * @default 260
     */
    height?: number;
    /**
     * @docid GridBaseOptions.columnChooser.mode
     * @default "dragAndDrop"
     */
    mode?: ColumnChooserMode;
    /**
     * @docid GridBaseOptions.columnChooser.searchTimeout
     * @default 500
     */
    searchTimeout?: number;
    /**
     * @docid GridBaseOptions.columnChooser.title
     * @default "Column Chooser"
     */
    title?: string;
    /**
     * @docid GridBaseOptions.columnChooser.width
     * @default 250
     */
    width?: number;
    /**
     * @docid GridBaseOptions.columnChooser.sortOrder
     * @default undefined
     */
    sortOrder?: SortOrder;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface ColumnFixing {
    /**
     * @docid GridBaseOptions.columnFixing.enabled
     * @default false
     */
    enabled?: boolean;
    /**
     * @docid GridBaseOptions.columnFixing.texts
     * @type object
     */
    texts?: ColumnFixingTexts;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface ColumnFixingTexts {
    /**
     * @docid GridBaseOptions.columnFixing.texts.fix
     * @default "Fix"
     */
    fix?: string;
    /**
     * @docid GridBaseOptions.columnFixing.texts.leftPosition
     * @default "To the left"
     */
    leftPosition?: string;
    /**
     * @docid GridBaseOptions.columnFixing.texts.rightPosition
     * @default "To the right"
     */
    rightPosition?: string;
    /**
     * @docid GridBaseOptions.columnFixing.texts.unfix
     * @default "Unfix"
     */
    unfix?: string;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface FilterPanelTexts {
    /**
     * @docid GridBaseOptions.filterPanel.texts.clearFilter
     * @default "Clear"
     */
    clearFilter?: string;
    /**
     * @docid GridBaseOptions.filterPanel.texts.createFilter
     * @default "Create Filter"
     */
    createFilter?: string;
    /**
     * @docid GridBaseOptions.filterPanel.texts.filterEnabledHint
     * @default "Enable the filter"
     */
    filterEnabledHint?: string;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface FilterRow {
    /**
     * @docid GridBaseOptions.filterRow.applyFilter
     * @default "auto"
     */
    applyFilter?: ApplyFilterMode;
    /**
     * @docid GridBaseOptions.filterRow.applyFilterText
     * @default "Apply filter"
     */
    applyFilterText?: string;
    /**
     * @docid GridBaseOptions.filterRow.betweenEndText
     * @default "End"
     */
    betweenEndText?: string;
    /**
     * @docid GridBaseOptions.filterRow.betweenStartText
     * @default "Start"
     */
    betweenStartText?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions
     * @type object
     */
    operationDescriptions?: FilterRowOperationDescriptions;
    /**
     * @docid GridBaseOptions.filterRow.resetOperationText
     * @default "Reset"
     */
    resetOperationText?: string;
    /**
     * @docid GridBaseOptions.filterRow.showAllText
     * @default "(All)"
     */
    showAllText?: string;
    /**
     * @docid GridBaseOptions.filterRow.showOperationChooser
     * @default true
     */
    showOperationChooser?: boolean;
    /**
     * @docid GridBaseOptions.filterRow.visible
     * @default false
     */
    visible?: boolean;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface FilterRowOperationDescriptions {
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.between
     * @default "Between"
     */
    between?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.contains
     * @default "Contains"
     */
    contains?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.endsWith
     * @default "Ends with"
     */
    endsWith?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.equal
     * @default "Equals"
     */
    equal?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.greaterThan
     * @default "Greater than"
     */
    greaterThan?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.greaterThanOrEqual
     * @default "Greater than or equal to"
     */
    greaterThanOrEqual?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.lessThan
     * @default "Less than"
     */
    lessThan?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.lessThanOrEqual
     * @default "Less than or equal to"
     */
    lessThanOrEqual?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.notContains
     * @default "Does not contain"
     */
    notContains?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.notEqual
     * @default "Does not equal"
     */
    notEqual?: string;
    /**
     * @docid GridBaseOptions.filterRow.operationDescriptions.startsWith
     * @default "Starts with"
     */
    startsWith?: string;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface HeaderFilter {
    /**
     * @docid GridBaseOptions.headerFilter.allowSearch
     * @default false
     */
    allowSearch?: boolean;
    /**
     * @docid GridBaseOptions.headerFilter.height
     * @default 315 &for(Material)
     * @default 325
     */
    height?: number;
    /**
     * @docid GridBaseOptions.headerFilter.searchTimeout
     * @default 500
     */
    searchTimeout?: number;
    /**
     * @docid GridBaseOptions.headerFilter.texts
     * @type object
     */
    texts?: HeaderFilterTexts;
    /**
     * @docid GridBaseOptions.headerFilter.visible
     * @default false
     */
    visible?: boolean;
    /**
     * @docid GridBaseOptions.headerFilter.width
     * @default 252
     */
    width?: number;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface HeaderFilterTexts {
    /**
     * @docid GridBaseOptions.headerFilter.texts.cancel
     * @default "Cancel"
     */
    cancel?: string;
    /**
     * @docid GridBaseOptions.headerFilter.texts.emptyValue
     * @default "(Blanks)"
     */
    emptyValue?: string;
    /**
     * @docid GridBaseOptions.headerFilter.texts.ok
     * @default "Ok"
     */
    ok?: string;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface KeyboardNavigation {
    /**
     * @docid GridBaseOptions.keyboardNavigation.editOnKeyPress
     * @default false
     */
    editOnKeyPress?: boolean;
    /**
     * @docid GridBaseOptions.keyboardNavigation.enabled
     * @default true
     */
    enabled?: boolean;
    /**
     * @docid GridBaseOptions.keyboardNavigation.enterKeyAction
     * @default "startEdit"
     */
    enterKeyAction?: EnterKeyAction;
    /**
     * @docid GridBaseOptions.keyboardNavigation.enterKeyDirection
     * @default "none"
     */
    enterKeyDirection?: EnterKeyDirection;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface LoadPanel {
    /**
     * @docid GridBaseOptions.loadPanel.enabled
     * @default "auto"
     */
    enabled?: boolean | Mode;
    /**
     * @docid GridBaseOptions.loadPanel.height
     * @default 90
     */
    height?: number;
    /**
     * @docid GridBaseOptions.loadPanel.indicatorSrc
     * @default ""
     */
    indicatorSrc?: string;
    /**
     * @docid GridBaseOptions.loadPanel.shading
     * @default false
     */
    shading?: boolean;
    /**
     * @docid GridBaseOptions.loadPanel.shadingColor
     * @default ''
     */
    shadingColor?: string;
    /**
     * @docid GridBaseOptions.loadPanel.showIndicator
     * @default true
     */
    showIndicator?: boolean;
    /**
     * @docid GridBaseOptions.loadPanel.showPane
     * @default true
     */
    showPane?: boolean;
    /**
     * @docid GridBaseOptions.loadPanel.text
     * @default "Loading..."
     */
    text?: string;
    /**
     * @docid GridBaseOptions.loadPanel.width
     * @default 200
     */
    width?: number;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface Pager {
    /**
     * @docid GridBaseOptions.pager.allowedPageSizes
     * @default "auto"
     */
    allowedPageSizes?: Array<(number | PagerPageSize)> | Mode;
    /**
     * @docid GridBaseOptions.pager.displayMode
     * @default "adaptive"
     */
    displayMode?: PagerDisplayMode;
    /**
     * @docid GridBaseOptions.pager.infoText
     * @default "Page {0} of {1} ({2} items)"
     */
    infoText?: string;
    /**
     * @docid GridBaseOptions.pager.showInfo
     * @default false
     */
    showInfo?: boolean;
    /**
     * @docid GridBaseOptions.pager.showNavigationButtons
     * @default false
     */
    showNavigationButtons?: boolean;
    /**
     * @docid GridBaseOptions.pager.showPageSizeSelector
     * @default false
     */
    showPageSizeSelector?: boolean;
    /**
     * @docid GridBaseOptions.pager.visible
     * @default "auto"
     */
    visible?: boolean | Mode;
    /**
     * @docid GridBaseOptions.pager.label
     * @default "Page Navigation"
     */
    label?: string;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface SearchPanel {
    /**
     * @docid GridBaseOptions.searchPanel.highlightCaseSensitive
     * @default false
     */
    highlightCaseSensitive?: boolean;
    /**
     * @docid GridBaseOptions.searchPanel.highlightSearchText
     * @default true
     */
    highlightSearchText?: boolean;
    /**
     * @docid GridBaseOptions.searchPanel.placeholder
     * @default "Search..."
     */
    placeholder?: string;
    /**
     * @docid GridBaseOptions.searchPanel.searchVisibleColumnsOnly
     * @default false
     */
    searchVisibleColumnsOnly?: boolean;
    /**
     * @docid GridBaseOptions.searchPanel.text
     * @default ""
     * @fires GridBaseOptions.onOptionChanged
     */
    text?: string;
    /**
     * @docid GridBaseOptions.searchPanel.visible
     * @default false
     */
    visible?: boolean;
    /**
     * @docid GridBaseOptions.searchPanel.width
     * @default 160
     */
    width?: number;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface Sorting {
    /**
     * @docid GridBaseOptions.sorting.ascendingText
     * @default "Sort Ascending"
     */
    ascendingText?: string;
    /**
     * @docid GridBaseOptions.sorting.clearText
     * @default "Clear Sorting"
     */
    clearText?: string;
    /**
     * @docid GridBaseOptions.sorting.descendingText
     * @default "Sort Descending"
     */
    descendingText?: string;
    /**
     * @docid GridBaseOptions.sorting.mode
     * @default "single"
     */
    mode?: SingleMultipleOrNone;
    /**
     * @docid GridBaseOptions.sorting.showSortIndexes
     * @default true
     */
    showSortIndexes?: boolean;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface StateStoring {
    /**
     * @docid GridBaseOptions.stateStoring.customLoad
     * @type Function
     * @type_function_return Promise<Object>
     */
    customLoad?: (() => PromiseLike<any>);
    /**
     * @docid GridBaseOptions.stateStoring.customSave
     * @type_function_param1 gridState:object
     * @type_function_return void
     */
    customSave?: ((gridState: any) => any);
    /**
     * @docid GridBaseOptions.stateStoring.enabled
     * @default false
     */
    enabled?: boolean;
    /**
     * @docid GridBaseOptions.stateStoring.savingTimeout
     * @default 2000
     */
    savingTimeout?: number;
    /**
     * @docid GridBaseOptions.stateStoring.storageKey
     * @default null
     */
    storageKey?: string;
    /**
     * @docid GridBaseOptions.stateStoring.type
     * @default "localStorage"
     */
    type?: StateStoreType;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseEditing<TRowData = any, TKey = any> = EditingBase<TRowData, TKey>;
export interface EditingBase<TRowData = any, TKey = any> {
    /**
     * @docid GridBaseOptions.editing.confirmDelete
     * @default true
     * @public
     */
    confirmDelete?: boolean;
    /**
     * @docid GridBaseOptions.editing.changes
     * @default []
     * @fires GridBaseOptions.onOptionChanged
     * @public
     * @type Array<DataChange>
     */
    changes?: Array<DataChange<TRowData, TKey>>;
    /**
     * @docid GridBaseOptions.editing.editColumnName
     * @default null
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    editColumnName?: string;
    /**
     * @docid GridBaseOptions.editing.editRowKey
     * @default null
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    editRowKey?: TKey;
    /**
     * @docid GridBaseOptions.editing.form
     * @public
     */
    form?: dxFormOptions;
    /**
     * @docid GridBaseOptions.editing.mode
     * @default "row"
     * @public
     */
    mode?: GridsEditMode;
    /**
     * @docid GridBaseOptions.editing.popup
     * @public
     * @type dxPopupOptions
     */
    popup?: PopupProperties;
    /**
     * @docid GridBaseOptions.editing.refreshMode
     * @default "full"
     * @public
     */
    refreshMode?: GridsEditRefreshMode;
    /**
     * @docid GridBaseOptions.editing.selectTextOnEditStart
     * @default false
     * @public
     */
    selectTextOnEditStart?: boolean;
    /**
     * @docid GridBaseOptions.editing.startEditAction
     * @default "click"
     * @public
     */
    startEditAction?: StartEditAction;
    /**
     * @docid GridBaseOptions.editing.texts
     * @type object
     * @public
     */
    texts?: EditingTextsBase;
    /**
     * @docid GridBaseOptions.editing.useIcons
     * @default true &for(Material)
     * @default false
     * @public
     */
    useIcons?: boolean;
}

/**
 * @docid
 * @public
 * @namespace DevExpress.common.grids
 */
export interface DataChange<TRowData = any, TKey = any> {
    /**
     * @docid
     */
    key: TKey;
    /**
     * @docid
     */
    type: DataChangeType;
    /**
     * @docid
     * @type any
     */
    data: DeepPartial<TRowData>;
    /**
     * @docid
     */
    insertAfterKey?: TKey;
    /**
     * @docid
     */
    insertBeforeKey?: TKey;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseEditingTexts = EditingTextsBase;
export interface EditingTextsBase {
    /**
     * @docid GridBaseOptions.editing.texts.addRow
     * @default "Add a row"
     * @public
     */
    addRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.cancelAllChanges
     * @default "Discard changes"
     * @public
     */
    cancelAllChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.cancelRowChanges
     * @default "Cancel"
     * @public
     */
    cancelRowChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.confirmDeleteMessage
     * @default "Are you sure you want to delete this record?"
     * @public
     */
    confirmDeleteMessage?: string;
    /**
     * @docid GridBaseOptions.editing.texts.confirmDeleteTitle
     * @default ""
     * @public
     */
    confirmDeleteTitle?: string;
    /**
     * @docid GridBaseOptions.editing.texts.deleteRow
     * @default "Delete"
     * @public
     */
    deleteRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.editRow
     * @default "Edit"
     * @public
     */
    editRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.saveAllChanges
     * @default "Save changes"
     * @public
     */
    saveAllChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.saveRowChanges
     * @default "Save"
     * @public
     */
    saveRowChanges?: string;
    /**
     * @docid GridBaseOptions.editing.texts.undeleteRow
     * @default "Undelete"
     * @public
     */
    undeleteRow?: string;
    /**
     * @docid GridBaseOptions.editing.texts.validationCancelChanges
     * @default "Cancel changes"
     * @public
     */
    validationCancelChanges?: string;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBasePaging = PagingBase;
export interface PagingBase {
    /**
     * @docid GridBaseOptions.paging.enabled
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid GridBaseOptions.paging.pageIndex
     * @default 0
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    pageIndex?: number;
    /**
     * @docid GridBaseOptions.paging.pageSize
     * @default 20
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    pageSize?: number;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseScrolling = ScrollingBase;
export interface ScrollingBase {
    /**
     * @docid GridBaseOptions.scrolling.columnRenderingMode
     * @default "standard"
     * @public
     */
    columnRenderingMode?: DataRenderMode;
    /**
     * @docid GridBaseOptions.scrolling.preloadEnabled
     * @default false
     * @public
     */
    preloadEnabled?: boolean;
    /**
     * @docid GridBaseOptions.scrolling.rowRenderingMode
     * @default "standard"
     * @public
     */
    rowRenderingMode?: DataRenderMode;
    /**
     * @docid GridBaseOptions.scrolling.scrollByContent
     * @default true
     * @default false &for(non-touch_devices)
     * @public
     */
    scrollByContent?: boolean;
    /**
     * @docid GridBaseOptions.scrolling.scrollByThumb
     * @default false
     * @public
     */
    scrollByThumb?: boolean;
    /**
     * @docid GridBaseOptions.scrolling.showScrollbar
     * @default 'onHover' &for(desktop)
     * @default 'onScroll'
     * @public
     */
    showScrollbar?: ScrollbarMode;
    /**
     * @docid GridBaseOptions.scrolling.useNative
     * @default "auto"
     * @public
     */
    useNative?: boolean | Mode;
    /**
     * @docid GridBaseOptions.scrolling.renderAsync
     * @default undefined
     * @public
     */
    renderAsync?: boolean;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseSelection = SelectionBase;
export interface SelectionBase {
    /**
     * @docid GridBaseOptions.selection.allowSelectAll
     * @default true
     * @public
     */
    allowSelectAll?: boolean;
    /**
     * @docid GridBaseOptions.selection.mode
     * @default "none"
     * @public
     */
    mode?: SingleMultipleOrNone;
}

/**
 * @docid
 * @inherits Widget, DataHelperMixin
 * @hidden
 * @namespace DevExpress.ui
 */
export interface GridBase<TRowData = any, TKey = any> {
    /**
     * @docid
     * @publicName beginCustomLoading(messageText)
     * @public
     */
    beginCustomLoading(messageText: string): void;
    /**
     * @docid
     * @publicName byKey(key)
     * @param1 key:object|string|number
     * @return Promise<Object>
     * @public
     */
    byKey(key: TKey): DxPromise<TRowData>;
    /**
     * @docid
     * @publicName cancelEditData()
     * @public
     */
    cancelEditData(): void;
    /**
     * @docid
     * @publicName cellValue(rowIndex, dataField)
     * @public
     */
    cellValue(rowIndex: number, dataField: string): any;
    /**
     * @docid
     * @publicName cellValue(rowIndex, dataField, value)
     * @public
     */
    cellValue(rowIndex: number, dataField: string, value: any): void;
    /**
     * @docid
     * @publicName cellValue(rowIndex, visibleColumnIndex)
     * @public
     */
    cellValue(rowIndex: number, visibleColumnIndex: number): any;
    /**
     * @docid
     * @publicName cellValue(rowIndex, visibleColumnIndex, value)
     * @public
     */
    cellValue(rowIndex: number, visibleColumnIndex: number, value: any): void;
    /**
     * @docid
     * @publicName clearFilter()
     * @public
     */
    clearFilter(): void;
    /**
     * @docid
     * @publicName clearFilter(filterName)
     * @public
     */
    clearFilter(filterName: string): void;
    /**
     * @docid
     * @publicName clearSelection()
     * @public
     */
    clearSelection(): void;
    /**
     * @docid
     * @publicName clearSorting()
     * @public
     */
    clearSorting(): void;
    /**
     * @docid
     * @publicName closeEditCell()
     * @public
     */
    closeEditCell(): void;
    /**
     * @docid
     * @publicName collapseAdaptiveDetailRow()
     * @public
     */
    collapseAdaptiveDetailRow(): void;
    /**
     * @docid
     * @publicName columnCount()
     * @public
     */
    columnCount(): number;
    /**
     * @docid
     * @publicName columnOption(id)
     * @return object
     * @public
     */
    columnOption(id: number | string): any;
    /**
     * @docid
     * @publicName columnOption(id, optionName)
     * @public
     */
    columnOption(id: number | string, optionName: string): any;
    /**
     * @docid
     * @publicName columnOption(id, optionName, optionValue)
     * @public
     */
    columnOption(id: number | string, optionName: string, optionValue: any): void;
    /**
     * @docid
     * @publicName columnOption(id, options)
     * @param2 options:object
     * @public
     */
    columnOption(id: number | string, options: any): void;
    /**
     * @docid
     * @publicName deleteColumn(id)
     * @public
     */
    deleteColumn(id: number | string): void;
    /**
     * @docid
     * @publicName deleteRow(rowIndex)
     * @public
     */
    deleteRow(rowIndex: number): void;
    /**
     * @docid
     * @publicName deselectAll()
     * @return Promise<void>
     * @public
     */
    deselectAll(): DxPromise<void>;
    /**
     * @docid
     * @publicName deselectRows(keys)
     * @return Promise<any>
     * @public
     */
    deselectRows(keys: Array<any>): DxPromise<any>;
    /**
     * @docid
     * @publicName editCell(rowIndex, dataField)
     * @public
     */
    editCell(rowIndex: number, dataField: string): void;
    /**
     * @docid
     * @publicName editCell(rowIndex, visibleColumnIndex)
     * @public
     */
    editCell(rowIndex: number, visibleColumnIndex: number): void;
    /**
     * @docid
     * @publicName editRow(rowIndex)
     * @public
     */
    editRow(rowIndex: number): void;
    /**
     * @docid
     * @publicName endCustomLoading()
     * @public
     */
    endCustomLoading(): void;
    /**
     * @docid
     * @publicName expandAdaptiveDetailRow(key)
     * @public
     */
    expandAdaptiveDetailRow(key: TKey): void;
    /**
     * @docid
     * @publicName filter()
     * @public
     */
    filter(): any;
    /**
     * @docid
     * @publicName filter(filterExpr)
     * @public
     */
    filter(filterExpr: any): void;
    focus(): void;
    /**
     * @docid
     * @publicName focus(element)
     * @param1 element:Element|jQuery
     * @public
     */
    focus(element: UserDefinedElement): void;
    /**
     * @docid
     * @publicName getCellElement(rowIndex, dataField)
     * @public
     */
    getCellElement(rowIndex: number, dataField: string): DxElement | undefined;
    /**
     * @docid
     * @publicName getCellElement(rowIndex, visibleColumnIndex)
     * @public
     */
    getCellElement(rowIndex: number, visibleColumnIndex: number): DxElement | undefined;
    /**
     * @docid
     * @publicName getCombinedFilter()
     * @public
     */
    getCombinedFilter(): any;
    /**
     * @docid
     * @publicName getCombinedFilter(returnDataField)
     * @public
     */
    getCombinedFilter(returnDataField: boolean): any;
    getDataSource(): DataSource<TRowData, TKey>;
    /**
     * @docid
     * @publicName getKeyByRowIndex(rowIndex)
     * @param1 rowIndex:numeric
     * @return any
     * @public
     */
    getKeyByRowIndex(rowIndex: number): TKey | undefined;
    /**
     * @docid
     * @publicName getRowElement(rowIndex)
     * @return Array<Element>|jQuery|undefined
     * @public
     */
    getRowElement(rowIndex: number): UserDefinedElementsArray | undefined;
    /**
     * @docid
     * @publicName getRowIndexByKey(key)
     * @param1 key:object|string|number
     * @return numeric
     * @public
     */
    getRowIndexByKey(key: TKey): number;
    /**
     * @docid
     * @publicName getScrollable()
     * @public
     * @return dxScrollable
     */
    getScrollable(): Scrollable;
    /**
     * @docid
     * @publicName getVisibleColumnIndex(id)
     * @public
     */
    getVisibleColumnIndex(id: number | string): number;
    /**
     * @docid
     * @publicName hasEditData()
     * @public
     */
    hasEditData(): boolean;
    /**
     * @docid
     * @publicName hideColumnChooser()
     * @public
     */
    hideColumnChooser(): void;
    /**
     * @docid
     * @publicName isAdaptiveDetailRowExpanded(key)
     * @public
     */
    isAdaptiveDetailRowExpanded(key: TKey): boolean;
    /**
     * @docid
     * @publicName isRowFocused(key)
     * @public
     */
    isRowFocused(key: TKey): boolean;
    /**
     * @docid
     * @publicName isRowSelected(key)
     * @public
     */
    isRowSelected(key: TKey): boolean;
    /**
     * @docid
     * @publicName keyOf(obj)
     * @param1 obj:object
     * @public
     */
    keyOf(obj: TRowData): TKey;
    /**
     * @docid
     * @publicName navigateToRow(key)
     * @public
     * @return Promise<void>
     */
    navigateToRow(key: TKey): DxPromise<void>;
    /**
     * @docid
     * @publicName pageCount()
     * @return numeric
     * @public
     */
    pageCount(): number;
    /**
     * @docid
     * @publicName pageIndex()
     * @return numeric
     * @public
     */
    pageIndex(): number;
    /**
     * @docid
     * @publicName pageIndex(newIndex)
     * @param1 newIndex:numeric
     * @return Promise<void>
     * @public
     */
    pageIndex(newIndex: number): DxPromise<void>;
    /**
     * @docid
     * @publicName pageSize()
     * @return numeric
     * @public
     */
    pageSize(): number;
    /**
     * @docid
     * @publicName pageSize(value)
     * @param1 value:numeric
     * @public
     */
    pageSize(value: number): void;
    /**
     * @docid
     * @publicName refresh()
     * @return Promise<void>
     * @public
     */
    refresh(): DxPromise<void>;
    /**
     * @docid
     * @publicName refresh(changesOnly)
     * @return Promise<void>
     * @public
     */
    refresh(changesOnly: boolean): DxPromise<void>;
    /**
     * @docid
     * @publicName repaintRows(rowIndexes)
     * @public
     */
    repaintRows(rowIndexes: Array<number>): void;
    /**
     * @docid
     * @publicName saveEditData()
     * @return Promise<void>
     * @public
     */
    saveEditData(): DxPromise<void>;
    /**
     * @docid
     * @publicName searchByText(text)
     * @public
     */
    searchByText(text: string): void;
    /**
     * @docid
     * @publicName selectAll()
     * @return Promise<void>
     * @public
     */
    selectAll(): DxPromise<void>;
    /**
     * @docid
     * @publicName selectRows(keys, preserve)
     * @return Promise<any>
     * @public
     */
    selectRows(keys: Array<TKey>, preserve: boolean): DxPromise<Array<TRowData>>;
    /**
     * @docid
     * @publicName selectRowsByIndexes(indexes)
     * @return Promise<any>
     * @public
     */
    selectRowsByIndexes(indexes: Array<number>): DxPromise<Array<TRowData>>;
    /**
     * @docid
     * @publicName showColumnChooser()
     * @public
     */
    showColumnChooser(): void;
    /**
     * @docid
     * @publicName state()
     * @return object
     * @public
     */
    state(): any;
    /**
     * @docid
     * @publicName state(state)
     * @param1 state:object
     * @public
     */
    state(state: any): void;
    /**
     * @docid
     * @publicName undeleteRow(rowIndex)
     * @public
     */
    undeleteRow(rowIndex: number): void;
    /**
     * @docid
     * @publicName updateDimensions()
     * @public
     */
    updateDimensions(): void;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface ColumnCustomizeTextArg {
  value?: any;
  valueText?: string;
  target?: string;
  groupInterval?: string | number;
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseColumn<TRowData = any> = ColumnBase<TRowData>;
/**
 * @docid GridBaseColumn
 * @type object
 */
export interface ColumnBase<TRowData = any> {
    /**
     * @docid GridBaseColumn.alignment
     * @default undefined
     * @acceptValues undefined
     * @public
     */
    alignment?: HorizontalAlignment;
    /**
     * @docid GridBaseColumn.allowEditing
     * @default true
     * @public
     */
    allowEditing?: boolean;
    /**
     * @docid GridBaseColumn.allowFiltering
     * @default true
     * @public
     */
    allowFiltering?: boolean;
    /**
     * @docid GridBaseColumn.allowFixing
     * @default true
     * @public
     */
    allowFixing?: boolean;
    /**
     * @docid GridBaseColumn.allowHeaderFiltering
     * @default true
     * @public
     */
    allowHeaderFiltering?: boolean;
    /**
     * @docid GridBaseColumn.allowHiding
     * @default false &for(command column)
     * @default true
     * @public
     */
    allowHiding?: boolean;
    /**
     * @docid GridBaseColumn.allowReordering
     * @default true
     * @public
     */
    allowReordering?: boolean;
    /**
     * @docid GridBaseColumn.allowResizing
     * @default true
     * @public
     */
    allowResizing?: boolean;
    /**
     * @docid GridBaseColumn.allowSearch
     * @default true
     * @public
     */
    allowSearch?: boolean;
    /**
     * @docid GridBaseColumn.allowSorting
     * @default true
     * @public
     */
    allowSorting?: boolean;
    /**
     * @docid GridBaseColumn.calculateCellValue
     * @type_function_context GridBaseColumn
     * @type_function_param1 rowData:object
     * @public
     */
    calculateCellValue?: ((this: ColumnBase, rowData: TRowData) => any);
    /**
     * @public
     */
    defaultCalculateCellValue?: this['calculateCellValue'];
    /**
     * @docid GridBaseColumn.calculateDisplayValue
     * @type_function_context GridBaseColumn
     * @type_function_param1 rowData:object
     * @public
     */
    calculateDisplayValue?: string | ((this: ColumnBase, rowData: TRowData) => any);
    /**
     * @docid GridBaseColumn.calculateFilterExpression
     * @type_function_context GridBaseColumn
     * @type_function_return Filter expression
     * @public
     */
    calculateFilterExpression?: ((this: ColumnBase, filterValue: any, selectedFilterOperation: string | null, target: string) => string | Array<any> | Function);
    /**
     * @public
     */
    defaultCalculateFilterExpression?: this['calculateFilterExpression'];
    /**
     * @docid GridBaseColumn.calculateSortValue
     * @type_function_context GridBaseColumn
     * @type_function_param1 rowData:object
     * @public
     */
    calculateSortValue?: string | ((this: ColumnBase, rowData: TRowData) => any);
    /**
     * @docid GridBaseColumn.caption
     * @default undefined
     * @public
     */
    caption?: string;
    /**
     * @docid GridBaseColumn.cssClass
     * @default undefined
     * @public
     */
    cssClass?: string;
    /**
     * @docid GridBaseColumn.customizeText
     * @type_function_context GridBaseColumn
     * @type_function_param1 cellInfo:object
     * @public
     */
    customizeText?: ((this: ColumnBase, cellInfo: ColumnCustomizeTextArg) => string);
    /**
     * @docid GridBaseColumn.dataField
     * @default undefined
     * @public
     */
    dataField?: string;
    /**
     * @docid GridBaseColumn.dataType
     * @default undefined
     * @public
     */
    dataType?: DataType;
    /**
     * @docid GridBaseColumn.editorOptions
     * @public
     */
    editorOptions?: any;
    /**
     * @docid GridBaseColumn.encodeHtml
     * @default true
     * @public
     */
    encodeHtml?: boolean;
    /**
     * @docid GridBaseColumn.falseText
     * @default "false"
     * @public
     */
    falseText?: string;
    /**
     * @docid GridBaseColumn.filterOperations
     * @default undefined
     * @public
     */
    filterOperations?: Array<FilterOperation | string>;
    /**
     * @docid GridBaseColumn.filterType
     * @default "include"
     * @public
     */
    filterType?: FilterType;
    /**
     * @docid GridBaseColumn.filterValue
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    filterValue?: any;
    /**
     * @docid GridBaseColumn.filterValues
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    filterValues?: Array<any>;
    /**
     * @docid GridBaseColumn.fixed
     * @default false
     * @public
     */
    fixed?: boolean;
    /**
     * @docid GridBaseColumn.fixedPosition
     * @default undefined
     * @public
     */
    fixedPosition?: HorizontalEdge;
    /**
     * @docid GridBaseColumn.formItem
     * @public
     */
    formItem?: dxFormSimpleItem;
    /**
     * @docid GridBaseColumn.format
     * @default ""
     * @public
     */
    format?: Format;
    /**
     * @docid GridBaseColumn.headerFilter
     * @type object
     * @default undefined
     * @public
     */
    headerFilter?: ColumnHeaderFilter;
    /**
     * @docid GridBaseColumn.hidingPriority
     * @default undefined
     * @public
     */
    hidingPriority?: number;
    /**
     * @docid GridBaseColumn.isBand
     * @default undefined
     * @public
     */
    isBand?: boolean;
    /**
     * @docid GridBaseColumn.lookup
     * @type object
     * @default undefined
     * @public
     */
    lookup?: ColumnLookup;
    /**
     * @docid GridBaseColumn.minWidth
     * @default undefined
     * @public
     */
    minWidth?: number;
    /**
     * @docid GridBaseColumn.name
     * @default undefined
     * @public
     */
    name?: string;
    /**
     * @docid GridBaseColumn.ownerBand
     * @default undefined
     * @public
     */
    ownerBand?: number;
    /**
     * @docid GridBaseColumn.renderAsync
     * @default false
     * @public
     */
    renderAsync?: boolean;
    /**
     * @docid GridBaseColumn.selectedFilterOperation
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    selectedFilterOperation?: SelectedFilterOperation;
    /**
     * @docid GridBaseColumn.setCellValue
     * @type_function_context GridBaseColumn
     * @type_function_param1 newData:object
     * @type_function_param3 currentRowData:object
     * @type_function_return void|Promise<void>
     * @public
     */
    setCellValue?: ((this: ColumnBase, newData: DeepPartial<TRowData>, value: any, currentRowData: TRowData) => void | PromiseLike<void>);
    /**
     * @public
     */
    defaultSetCellValue?: this['setCellValue'];
    /**
     * @docid GridBaseColumn.showEditorAlways
     * @default false
     * @public
     */
    showEditorAlways?: boolean;
    /**
     * @docid GridBaseColumn.showInColumnChooser
     * @default true
     * @public
     */
    showInColumnChooser?: boolean;
    /**
     * @docid GridBaseColumn.sortIndex
     * @default undefined
     * @public
     */
    sortIndex?: number;
    /**
     * @docid GridBaseColumn.sortOrder
     * @default undefined
     * @acceptValues undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    sortOrder?: SortOrder;
    /**
     * @docid GridBaseColumn.sortingMethod
     * @default undefined
     * @type_function_context GridBaseColumn
     * @public
     */
    sortingMethod?: ((this: ColumnBase, value1: any, value2: any) => number);
    /**
     * @docid GridBaseColumn.trueText
     * @default "true"
     * @public
     */
    trueText?: string;
    /**
     * @docid GridBaseColumn.validationRules
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid GridBaseColumn.visible
     * @default true
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    visible?: boolean;
    /**
     * @docid GridBaseColumn.visibleIndex
     * @default undefined
     * @fires GridBaseOptions.onOptionChanged
     * @public
     */
    visibleIndex?: number;
    /**
     * @docid GridBaseColumn.width
     * @default undefined
     * @public
     */
    width?: number | string;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface ColumnHeaderFilter {
  /**
   * @docid GridBaseColumn.headerFilter.allowSearch
   * @default false
   */
  allowSearch?: boolean;
  /**
   * @docid GridBaseColumn.headerFilter.dataSource
   * @type_function_param1_field component:object
   * @default undefined
   * @type Array<any>|Store|DataSourceOptions|Function|null
   */
  dataSource?: FilterLookupDataSource<any> | ((options: { component?: any; dataSource?: DataSourceOptions | null }) => void);
  /**
   * @docid GridBaseColumn.headerFilter.groupInterval
   * @default undefined
   */
  groupInterval?: HeaderFilterGroupInterval | number;
  /**
   * @docid GridBaseColumn.headerFilter.height
   * @default undefined
   */
  height?: number;
  /**
   * @docid GridBaseColumn.headerFilter.searchMode
   * @default 'contains'
   */
  searchMode?: SearchMode;
  /**
   * @docid GridBaseColumn.headerFilter.width
   * @default undefined
   */
  width?: number;
}

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export interface ColumnLookup {
  /**
   * @docid GridBaseColumn.lookup.allowClearing
   * @default false
   */
  allowClearing?: boolean;
  /**
   * @docid GridBaseColumn.lookup.dataSource
   * @type_function_param1_field data:object
   * @default undefined
   * @type_function_return Array<any>|Store|DataSourceOptions
   * @type Array<any>|Store|DataSourceOptions|Function|null
   */
  dataSource?: FilterLookupDataSource<any> | ((options: { data?: any; key?: any }) => FilterLookupDataSource<any>) | null;
  /**
   * @docid GridBaseColumn.lookup.displayExpr
   * @default undefined
   * @type_function_param1 data:object
   */
  displayExpr?: string | ((data: any) => string);
  /**
   * @docid GridBaseColumn.lookup.valueExpr
   * @default undefined
   */
  valueExpr?: string;
  /**
   * @docid GridBaseColumn.lookup.calculateCellValue
   * @type_function_param1 rowData:object
   * @public
   */
  calculateCellValue?: ((rowData: any) => any);
}

/**
 * @public
 * @namespace DevExpress.ui
 * @deprecated
 */
export type GridBaseColumnButton = ColumnButtonBase;
/**
 * @docid GridBaseColumnButton
 * @type object
 */
export interface ColumnButtonBase {
    /**
     * @docid GridBaseColumnButton.cssClass
     * @public
     */
    cssClass?: string;
    /**
     * @docid GridBaseColumnButton.hint
     * @public
     */
    hint?: string;
    /**
     * @docid GridBaseColumnButton.icon
     * @public
     */
    icon?: string;
    /**
     * @docid GridBaseColumnButton.text
     * @public
     */
    text?: string;
}

/** @public */
export type Scrollable = Skip<dxScrollable, '_templateManager' | '_cancelOptionChange' | '_getTemplate' | '_invalidate' | '_refresh' | '_notifyOptionChanged' | '_createElement'>;

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
export type ExportedEvent<TRowData = any, TKey = any> = EventInfo<dxDataGrid<TRowData, TKey>>;

/** @public */
export type ExportingEvent<TRowData = any, TKey = any> = Cancelable & EventInfo<dxDataGrid<TRowData, TKey>> & {
  fileName?: string;
  selectedRowsOnly: boolean;
  format: DataGridExportFormat | string;
};

/** @public */
export type FileSavingEvent<TRowData = any, TKey = any> = Cancelable & {
  readonly component: dxDataGrid<TRowData, TKey>;
  readonly element: DxElement;
  fileName?: string;
  format?: string;
  readonly data: Blob;
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
export type RowDraggingAddEvent<TRowData = any, TKey = any> = RowDraggingEventInfo<dxDataGrid<TRowData, TKey>, TRowData, TKey> & DragDropInfo;

/** @public */
export type RowDraggingChangeEvent<TRowData = any, TKey = any> = Cancelable & RowDraggingEventInfo<dxDataGrid<TRowData, TKey>, TRowData, TKey> & DragDropInfo;

/** @public */
export type RowDraggingEndEvent<TRowData = any, TKey = any> = Cancelable & RowDraggingEventInfo<dxDataGrid<TRowData, TKey>, TRowData, TKey> & DragDropInfo;

/** @public */
export type RowDraggingMoveEvent<TRowData = any, TKey = any> = Cancelable & RowDraggingEventInfo<dxDataGrid<TRowData, TKey>, TRowData, TKey> & DragDropInfo;

/** @public */
export type RowDraggingStartEvent<TRowData = any, TKey = any> = Cancelable & DragStartEventInfo<dxDataGrid<TRowData, TKey>, TRowData, TKey>;

/** @public */
export type RowDraggingRemoveEvent<TRowData = any, TKey = any> = RowDraggingEventInfo<dxDataGrid<TRowData, TKey>, TRowData, TKey>;

/** @public */
export type RowDraggingReorderEvent<TRowData = any, TKey = any> = RowDraggingEventInfo<dxDataGrid<TRowData, TKey>, TRowData, TKey> & DragReorderInfo;

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
export type RowDraggingTemplateData<TRowData = any> = RowDraggingTemplateDataModel<TRowData>;

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

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 */
export interface dxDataGridOptions<TRowData = any, TKey = any> extends GridBaseOptions<dxDataGrid<TRowData, TKey>, TRowData, TKey> {
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
     * @deprecated
     * @type_function_param1 columns:Array<dxDataGridColumn>
     * @type_function_param2 rows:Array<dxDataGridRowObject>
     * @public
     */
    customizeExportData?: ((columns: Array<Column<TRowData, TKey>>, rows: Array<Row<TRowData, TKey>>) => void);
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
    export?: Export<TRowData, TKey>;
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
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxDataGrid
     * @action
     * @public
     * @deprecated
     */
    onExported?: ((e: ExportedEvent<TRowData, TKey>) => void);
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
     * @default null
     * @action
     * @public
     * @deprecated
     */
    onFileSaving?: ((e: FileSavingEvent<TRowData, TKey>) => void);
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
}

/** @public */
export type ExcelCellInfo<TRowData = any, TKey = any> = {
  readonly component: dxDataGrid<TRowData, TKey>;
  horizontalAlignment?: ExcelCellHorizontalAlignment;
  verticalAlignment?: ExcelCellVerticalAlignment;
  wrapTextEnabled?: boolean;
  backgroundColor?: string;
  fillPatternType?: ExcelCellPatternType;
  fillPatternColor?: string;
  font?: ExcelFont;
  readonly value?: string | number | Date;
  numberFormat?: string;
  gridCell?: ExcelCell;
};

/** @public */
export type Export<TRowData = any, TKey = any> = {
  /**
   * @docid dxDataGridOptions.export.allowExportSelectedData
   * @default false
   */
  allowExportSelectedData?: boolean;
  /**
   * @docid dxDataGridOptions.export.customizeExcelCell
   * @deprecated
   * @type_function_param1 options:object
   * @type_function_param1_field horizontalAlignment:Enums.ExcelCellHorizontalAlignment
   * @type_function_param1_field verticalAlignment:Enums.ExcelCellVerticalAlignment
   * @type_function_param1_field fillPatternType:Enums.ExcelCellPatternType
   * @type_function_param1_field gridCell:ExcelDataGridCell
   */
  customizeExcelCell?: ((options: ExcelCellInfo<TRowData, TKey>) => void);
  /**
   * @docid dxDataGridOptions.export.enabled
   * @default false
   */
  enabled?: boolean;
  /**
   * @docid dxDataGridOptions.export.excelFilterEnabled
   * @default false
   * @deprecated
   */
  excelFilterEnabled?: boolean;
  /**
   * @docid dxDataGridOptions.export.excelWrapTextEnabled
   * @default undefined
   * @deprecated
   */
  excelWrapTextEnabled?: boolean;
  /**
   * @docid dxDataGridOptions.export.formats
   * @type Array<Enums.DataGridExportFormat,string>
   * @default "DataGrid"
   */
  formats?: ('xlsx' | 'pdf' | string)[];
  /**
   * @docid dxDataGridOptions.export.fileName
   * @default "DataGrid"
   * @deprecated
   */
  fileName?: string;
  /**
   * @docid dxDataGridOptions.export.ignoreExcelErrors
   * @default true
   * @deprecated
   */
  ignoreExcelErrors?: boolean;
  /**
   * @docid dxDataGridOptions.export.proxyUrl
   * @default undefined
   * @deprecated
   */
  proxyUrl?: string;
  /**
   * @docid dxDataGridOptions.export.texts
   * @type object
   */
  texts?: ExportTexts;
};

/** @public */
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

/** @public */
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

/** @public */
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

/** @public */
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

/** @public */
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

/** @public */
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

/** @public */
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

/** @public */
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

/** @public */
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
 */
declare class dxDataGrid<TRowData = any, TKey = any> extends Widget<dxDataGridOptions<TRowData, TKey>> implements GridBase<TRowData, TKey> {
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
     * @publicName exportToExcel(selectionOnly)
     * @deprecated excelExporter.exportDataGrid
     * @public
     */
    exportToExcel(selectionOnly: boolean): void;
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
  ExcelCellInfo: ExcelCellInfo<TRowData, TKey>;
  Export: Export<TRowData, TKey>;
  ExportedEvent: ExportedEvent<TRowData, TKey>;
  ExportingEvent: ExportingEvent<TRowData, TKey>;
  ExportTexts: ExportTexts;
  FileSavingEvent: FileSavingEvent<TRowData, TKey>;
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

/** @public */
export type Properties<TRowData = any, TKey = any> = dxDataGridOptions<TRowData, TKey>;

/** @deprecated use Properties instead */
export type Options<TRowData = any, TKey = any> = dxDataGridOptions<TRowData, TKey>;

export default dxDataGrid;
