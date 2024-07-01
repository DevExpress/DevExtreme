"use client"
export { ExplicitTypes } from "devextreme/ui/data_grid";
import dxDataGrid, {
    Properties
} from "devextreme/ui/data_grid";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxDataGridColumn, AdaptiveDetailRowPreparingEvent, CellClickEvent, CellDblClickEvent, CellPreparedEvent, ContentReadyEvent, ContextMenuPreparingEvent, DataErrorOccurredEvent, DisposingEvent, EditCanceledEvent, EditCancelingEvent, EditingStartEvent, EditorPreparedEvent, EditorPreparingEvent, ExportingEvent, FocusedCellChangingEvent, FocusedRowChangingEvent, InitializedEvent, InitNewRowEvent, KeyDownEvent, RowClickEvent, RowCollapsedEvent, RowCollapsingEvent, RowDblClickEvent, RowExpandedEvent, RowExpandingEvent, RowInsertedEvent, RowInsertingEvent, RowPreparedEvent, RowRemovedEvent, RowRemovingEvent, RowUpdatedEvent, RowUpdatingEvent, RowValidatingEvent, SavedEvent, SavingEvent, ToolbarPreparingEvent, dxDataGridRowObject, ColumnButtonClickEvent, dxDataGridColumnButton, dxDataGridToolbarItem } from "devextreme/ui/data_grid";
import type { DataChange, ColumnHeaderFilterSearchConfig, ColumnChooserSearchConfig, ColumnChooserSelectionConfig, HeaderFilterSearchConfig, GridBase } from "devextreme/common/grids";
import type { ContentReadyEvent as FilterBuilderContentReadyEvent, DisposingEvent as FilterBuilderDisposingEvent, EditorPreparedEvent as FilterBuilderEditorPreparedEvent, EditorPreparingEvent as FilterBuilderEditorPreparingEvent, InitializedEvent as FilterBuilderInitializedEvent, dxFilterBuilderField, dxFilterBuilderCustomOperation, OptionChangedEvent, ValueChangedEvent } from "devextreme/ui/filter_builder";
import type { ContentReadyEvent as FormContentReadyEvent, DisposingEvent as FormDisposingEvent, InitializedEvent as FormInitializedEvent, dxFormSimpleItem, dxFormOptions, OptionChangedEvent as FormOptionChangedEvent, dxFormGroupItem, dxFormTabbedItem, dxFormEmptyItem, dxFormButtonItem, EditorEnterKeyEvent, FieldDataChangedEvent } from "devextreme/ui/form";
import type { AnimationConfig, AnimationState } from "devextreme/animation/fx";
import type { template } from "devextreme/core/templates/template";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";
import type { PositionConfig } from "devextreme/animation/position";
import type { dxPopupOptions, dxPopupToolbarItem } from "devextreme/ui/popup";
import type { event, EventInfo } from "devextreme/events/index";
import type { Component } from "devextreme/core/component";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

import type dxOverlay from "devextreme/ui/overlay";
import type DOMComponent from "devextreme/core/dom_component";
import type dxPopup from "devextreme/ui/popup";
import type dxForm from "devextreme/ui/form";
import type dxSortable from "devextreme/ui/sortable";
import type dxDraggable from "devextreme/ui/draggable";

import type * as LocalizationTypes from "devextreme/localization";
import type * as CommonTypes from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IDataGridOptionsNarrowedEvents<TRowData = any, TKey = any> = {
  onAdaptiveDetailRowPreparing?: ((e: AdaptiveDetailRowPreparingEvent<TRowData, TKey>) => void);
  onCellClick?: ((e: CellClickEvent<TRowData, TKey>) => void);
  onCellDblClick?: ((e: CellDblClickEvent<TRowData, TKey>) => void);
  onCellPrepared?: ((e: CellPreparedEvent<TRowData, TKey>) => void);
  onContentReady?: ((e: ContentReadyEvent<TRowData, TKey>) => void);
  onContextMenuPreparing?: ((e: ContextMenuPreparingEvent<TRowData, TKey>) => void);
  onDataErrorOccurred?: ((e: DataErrorOccurredEvent<TRowData, TKey>) => void);
  onDisposing?: ((e: DisposingEvent<TRowData, TKey>) => void);
  onEditCanceled?: ((e: EditCanceledEvent<TRowData, TKey>) => void);
  onEditCanceling?: ((e: EditCancelingEvent<TRowData, TKey>) => void);
  onEditingStart?: ((e: EditingStartEvent<TRowData, TKey>) => void);
  onEditorPrepared?: ((e: EditorPreparedEvent<TRowData, TKey>) => void);
  onEditorPreparing?: ((e: EditorPreparingEvent<TRowData, TKey>) => void);
  onExporting?: ((e: ExportingEvent<TRowData, TKey>) => void);
  onFocusedCellChanging?: ((e: FocusedCellChangingEvent<TRowData, TKey>) => void);
  onFocusedRowChanging?: ((e: FocusedRowChangingEvent<TRowData, TKey>) => void);
  onInitialized?: ((e: InitializedEvent<TRowData, TKey>) => void);
  onInitNewRow?: ((e: InitNewRowEvent<TRowData, TKey>) => void);
  onKeyDown?: ((e: KeyDownEvent<TRowData, TKey>) => void);
  onRowClick?: ((e: RowClickEvent<TRowData, TKey>) => void);
  onRowCollapsed?: ((e: RowCollapsedEvent<TRowData, TKey>) => void);
  onRowCollapsing?: ((e: RowCollapsingEvent<TRowData, TKey>) => void);
  onRowDblClick?: ((e: RowDblClickEvent<TRowData, TKey>) => void);
  onRowExpanded?: ((e: RowExpandedEvent<TRowData, TKey>) => void);
  onRowExpanding?: ((e: RowExpandingEvent<TRowData, TKey>) => void);
  onRowInserted?: ((e: RowInsertedEvent<TRowData, TKey>) => void);
  onRowInserting?: ((e: RowInsertingEvent<TRowData, TKey>) => void);
  onRowPrepared?: ((e: RowPreparedEvent<TRowData, TKey>) => void);
  onRowRemoved?: ((e: RowRemovedEvent<TRowData, TKey>) => void);
  onRowRemoving?: ((e: RowRemovingEvent<TRowData, TKey>) => void);
  onRowUpdated?: ((e: RowUpdatedEvent<TRowData, TKey>) => void);
  onRowUpdating?: ((e: RowUpdatingEvent<TRowData, TKey>) => void);
  onRowValidating?: ((e: RowValidatingEvent<TRowData, TKey>) => void);
  onSaved?: ((e: SavedEvent<TRowData, TKey>) => void);
  onSaving?: ((e: SavingEvent<TRowData, TKey>) => void);
  onToolbarPreparing?: ((e: ToolbarPreparingEvent<TRowData, TKey>) => void);
}

type IDataGridOptions<TRowData = any, TKey = any> = React.PropsWithChildren<ReplaceFieldTypes<Properties<TRowData, TKey>, IDataGridOptionsNarrowedEvents<TRowData, TKey>> & IHtmlOptions & {
  dataSource?: Properties<TRowData, TKey>["dataSource"];
  dataRowRender?: (...params: any) => React.ReactNode;
  dataRowComponent?: React.ComponentType<any>;
  dataRowKeyFn?: (data: any) => string;
  rowRender?: (...params: any) => React.ReactNode;
  rowComponent?: React.ComponentType<any>;
  rowKeyFn?: (data: any) => string;
  defaultColumns?: Array<dxDataGridColumn | string>;
  defaultEditing?: Record<string, any>;
  defaultFilterPanel?: Record<string, any>;
  defaultFilterValue?: Array<any> | (() => any) | string;
  defaultFocusedColumnIndex?: number;
  defaultFocusedRowIndex?: number;
  defaultFocusedRowKey?: any;
  defaultGroupPanel?: Record<string, any>;
  defaultPaging?: Record<string, any>;
  defaultSearchPanel?: Record<string, any>;
  defaultSelectedRowKeys?: Array<any>;
  defaultSelectionFilter?: Array<any> | (() => any) | string;
  onColumnsChange?: (value: Array<dxDataGridColumn | string>) => void;
  onEditingChange?: (value: Record<string, any>) => void;
  onFilterPanelChange?: (value: Record<string, any>) => void;
  onFilterValueChange?: (value: Array<any> | (() => any) | string) => void;
  onFocusedColumnIndexChange?: (value: number) => void;
  onFocusedRowIndexChange?: (value: number) => void;
  onFocusedRowKeyChange?: (value: any) => void;
  onGroupPanelChange?: (value: Record<string, any>) => void;
  onPagingChange?: (value: Record<string, any>) => void;
  onSearchPanelChange?: (value: Record<string, any>) => void;
  onSelectedRowKeysChange?: (value: Array<any>) => void;
  onSelectionFilterChange?: (value: Array<any> | (() => any) | string) => void;
}>

class DataGrid<TRowData = any, TKey = any> extends BaseComponent<React.PropsWithChildren<IDataGridOptions<TRowData, TKey>>> {

  public get instance(): dxDataGrid<TRowData, TKey> {
    return this._instance;
  }

  protected _WidgetClass = dxDataGrid;

  protected useRequestAnimationFrameFlag = true;

  protected subscribableOptions = ["columns","editing","editing.changes","editing.editColumnName","editing.editRowKey","filterPanel","filterPanel.filterEnabled","filterValue","focusedColumnIndex","focusedRowIndex","focusedRowKey","groupPanel","groupPanel.visible","paging","paging.pageIndex","paging.pageSize","searchPanel","searchPanel.text","selectedRowKeys","selectionFilter"];

  protected independentEvents = ["onAdaptiveDetailRowPreparing","onCellClick","onCellDblClick","onCellPrepared","onContentReady","onContextMenuPreparing","onDataErrorOccurred","onDisposing","onEditCanceled","onEditCanceling","onEditingStart","onEditorPrepared","onEditorPreparing","onExporting","onFocusedCellChanging","onFocusedRowChanging","onInitialized","onInitNewRow","onKeyDown","onRowClick","onRowCollapsed","onRowCollapsing","onRowDblClick","onRowExpanded","onRowExpanding","onRowInserted","onRowInserting","onRowPrepared","onRowRemoved","onRowRemoving","onRowUpdated","onRowUpdating","onRowValidating","onSaved","onSaving","onToolbarPreparing"];

  protected _defaults = {
    defaultColumns: "columns",
    defaultEditing: "editing",
    defaultFilterPanel: "filterPanel",
    defaultFilterValue: "filterValue",
    defaultFocusedColumnIndex: "focusedColumnIndex",
    defaultFocusedRowIndex: "focusedRowIndex",
    defaultFocusedRowKey: "focusedRowKey",
    defaultGroupPanel: "groupPanel",
    defaultPaging: "paging",
    defaultSearchPanel: "searchPanel",
    defaultSelectedRowKeys: "selectedRowKeys",
    defaultSelectionFilter: "selectionFilter"
  };

  protected _expectedChildren = {
    column: { optionName: "columns", isCollectionItem: true },
    columnChooser: { optionName: "columnChooser", isCollectionItem: false },
    columnFixing: { optionName: "columnFixing", isCollectionItem: false },
    dataGridHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
    dataGridSelection: { optionName: "selection", isCollectionItem: false },
    editing: { optionName: "editing", isCollectionItem: false },
    export: { optionName: "export", isCollectionItem: false },
    filterBuilder: { optionName: "filterBuilder", isCollectionItem: false },
    filterBuilderPopup: { optionName: "filterBuilderPopup", isCollectionItem: false },
    filterPanel: { optionName: "filterPanel", isCollectionItem: false },
    filterRow: { optionName: "filterRow", isCollectionItem: false },
    grouping: { optionName: "grouping", isCollectionItem: false },
    groupPanel: { optionName: "groupPanel", isCollectionItem: false },
    headerFilter: { optionName: "headerFilter", isCollectionItem: false },
    keyboardNavigation: { optionName: "keyboardNavigation", isCollectionItem: false },
    loadPanel: { optionName: "loadPanel", isCollectionItem: false },
    masterDetail: { optionName: "masterDetail", isCollectionItem: false },
    pager: { optionName: "pager", isCollectionItem: false },
    paging: { optionName: "paging", isCollectionItem: false },
    remoteOperations: { optionName: "remoteOperations", isCollectionItem: false },
    rowDragging: { optionName: "rowDragging", isCollectionItem: false },
    scrolling: { optionName: "scrolling", isCollectionItem: false },
    searchPanel: { optionName: "searchPanel", isCollectionItem: false },
    selection: { optionName: "selection", isCollectionItem: false },
    sortByGroupSummaryInfo: { optionName: "sortByGroupSummaryInfo", isCollectionItem: true },
    sorting: { optionName: "sorting", isCollectionItem: false },
    stateStoring: { optionName: "stateStoring", isCollectionItem: false },
    summary: { optionName: "summary", isCollectionItem: false },
    toolbar: { optionName: "toolbar", isCollectionItem: false }
  };

  protected _templateProps = [{
    tmplOption: "dataRowTemplate",
    render: "dataRowRender",
    component: "dataRowComponent",
    keyFn: "dataRowKeyFn"
  }, {
    tmplOption: "rowTemplate",
    render: "rowRender",
    component: "rowComponent",
    keyFn: "rowKeyFn"
  }];
}
(DataGrid as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowColumnReordering: PropTypes.bool,
  allowColumnResizing: PropTypes.bool,
  autoNavigateToFocusedRow: PropTypes.bool,
  cacheEnabled: PropTypes.bool,
  cellHintEnabled: PropTypes.bool,
  columnAutoWidth: PropTypes.bool,
  columnChooser: PropTypes.object,
  columnFixing: PropTypes.object,
  columnHidingEnabled: PropTypes.bool,
  columnMinWidth: PropTypes.number,
  columnResizingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "nextColumn",
      "widget"])
  ]),
  columns: PropTypes.array,
  columnWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto"])
  ])
  ]),
  customizeColumns: PropTypes.func,
  dateSerializationFormat: PropTypes.string,
  disabled: PropTypes.bool,
  editing: PropTypes.object,
  elementAttr: PropTypes.object,
  errorRowEnabled: PropTypes.bool,
  export: PropTypes.object,
  filterBuilder: PropTypes.object,
  filterBuilderPopup: PropTypes.object,
  filterPanel: PropTypes.object,
  filterRow: PropTypes.object,
  filterSyncEnabled: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto"])
  ])
  ]),
  filterValue: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.string
  ]),
  focusedColumnIndex: PropTypes.number,
  focusedRowEnabled: PropTypes.bool,
  focusedRowIndex: PropTypes.number,
  grouping: PropTypes.object,
  groupPanel: PropTypes.object,
  headerFilter: PropTypes.object,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  highlightChanges: PropTypes.bool,
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  keyboardNavigation: PropTypes.object,
  keyExpr: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string
  ]),
  loadPanel: PropTypes.object,
  masterDetail: PropTypes.object,
  noDataText: PropTypes.string,
  onAdaptiveDetailRowPreparing: PropTypes.func,
  onCellClick: PropTypes.func,
  onCellDblClick: PropTypes.func,
  onCellHoverChanged: PropTypes.func,
  onCellPrepared: PropTypes.func,
  onContentReady: PropTypes.func,
  onContextMenuPreparing: PropTypes.func,
  onDataErrorOccurred: PropTypes.func,
  onDisposing: PropTypes.func,
  onEditCanceled: PropTypes.func,
  onEditCanceling: PropTypes.func,
  onEditingStart: PropTypes.func,
  onEditorPrepared: PropTypes.func,
  onEditorPreparing: PropTypes.func,
  onExporting: PropTypes.func,
  onFocusedCellChanged: PropTypes.func,
  onFocusedCellChanging: PropTypes.func,
  onFocusedRowChanged: PropTypes.func,
  onFocusedRowChanging: PropTypes.func,
  onInitialized: PropTypes.func,
  onInitNewRow: PropTypes.func,
  onKeyDown: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onRowClick: PropTypes.func,
  onRowCollapsed: PropTypes.func,
  onRowCollapsing: PropTypes.func,
  onRowDblClick: PropTypes.func,
  onRowExpanded: PropTypes.func,
  onRowExpanding: PropTypes.func,
  onRowInserted: PropTypes.func,
  onRowInserting: PropTypes.func,
  onRowPrepared: PropTypes.func,
  onRowRemoved: PropTypes.func,
  onRowRemoving: PropTypes.func,
  onRowUpdated: PropTypes.func,
  onRowUpdating: PropTypes.func,
  onRowValidating: PropTypes.func,
  onSaved: PropTypes.func,
  onSaving: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  onToolbarPreparing: PropTypes.func,
  pager: PropTypes.object,
  paging: PropTypes.object,
  remoteOperations: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "auto"])
  ])
  ]),
  renderAsync: PropTypes.bool,
  repaintChangesOnly: PropTypes.bool,
  rowAlternationEnabled: PropTypes.bool,
  rowDragging: PropTypes.object,
  rtlEnabled: PropTypes.bool,
  scrolling: PropTypes.object,
  searchPanel: PropTypes.object,
  selectedRowKeys: PropTypes.array,
  selection: PropTypes.object,
  selectionFilter: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.func,
    PropTypes.string
  ]),
  showBorders: PropTypes.bool,
  showColumnHeaders: PropTypes.bool,
  showColumnLines: PropTypes.bool,
  showRowLines: PropTypes.bool,
  sortByGroupSummaryInfo: PropTypes.array,
  sorting: PropTypes.object,
  stateStoring: PropTypes.object,
  summary: PropTypes.object,
  syncLookupFilterValues: PropTypes.bool,
  tabIndex: PropTypes.number,
  toolbar: PropTypes.object,
  twoWayBindingEnabled: PropTypes.bool,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  wordWrapEnabled: PropTypes.bool
};


// owners:
// Popup
type IAnimationProps = React.PropsWithChildren<{
  hide?: AnimationConfig;
  show?: AnimationConfig;
}>
class Animation extends NestedOption<IAnimationProps> {
  public static OptionName = "animation";
  public static ExpectedChildren = {
    hide: { optionName: "hide", isCollectionItem: false },
    show: { optionName: "show", isCollectionItem: false }
  };
}

// owners:
// FormItem
// Column
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any);
}>
class AsyncRule extends NestedOption<IAsyncRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "async"
  };
}

// owners:
// Position
type IAtProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
class At extends NestedOption<IAtProps> {
  public static OptionName = "at";
}

// owners:
// Position
type IBoundaryOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class BoundaryOffset extends NestedOption<IBoundaryOffsetProps> {
  public static OptionName = "boundaryOffset";
}

// owners:
// Column
type IButtonProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  hint?: string;
  icon?: string;
  name?: "cancel" | "delete" | "edit" | "save" | "undelete";
  onClick?: ((e: ColumnButtonClickEvent) => void);
  template?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, key: any, row: dxDataGridRowObject, rowIndex: number, rowType: string }) => string | any) | template;
  text?: string;
  visible?: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Button extends NestedOption<IButtonProps> {
  public static OptionName = "buttons";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// Editing
type IChangeProps = React.PropsWithChildren<{
  data?: any;
  insertAfterKey?: any;
  insertBeforeKey?: any;
  key?: any;
  type?: "insert" | "update" | "remove";
}>
class Change extends NestedOption<IChangeProps> {
  public static OptionName = "changes";
  public static IsCollectionItem = true;
}

// owners:
// Form
type IColCountByScreenProps = React.PropsWithChildren<{
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
}>
class ColCountByScreen extends NestedOption<IColCountByScreenProps> {
  public static OptionName = "colCountByScreen";
}

// owners:
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: "fit" | "flip" | "flipfit" | "none";
  y?: "fit" | "flip" | "flipfit" | "none";
}>
class Collision extends NestedOption<ICollisionProps> {
  public static OptionName = "collision";
}

// owners:
// DataGrid
type IColumnProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  allowEditing?: boolean;
  allowExporting?: boolean;
  allowFiltering?: boolean;
  allowFixing?: boolean;
  allowGrouping?: boolean;
  allowHeaderFiltering?: boolean;
  allowHiding?: boolean;
  allowReordering?: boolean;
  allowResizing?: boolean;
  allowSearch?: boolean;
  allowSorting?: boolean;
  autoExpandGroup?: boolean;
  buttons?: Array<dxDataGridColumnButton | "cancel" | "delete" | "edit" | "save" | "undelete">;
  calculateCellValue?: ((rowData: any) => any);
  calculateDisplayValue?: ((rowData: any) => any) | string;
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | (() => any) | Array<any>);
  calculateGroupValue?: ((rowData: any) => any) | string;
  calculateSortValue?: ((rowData: any) => any) | string;
  caption?: string;
  cellTemplate?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, displayValue: any, oldValue: any, row: dxDataGridRowObject, rowIndex: number, rowType: string, text: string, value: any, watch: (() => void) }) => any) | template;
  columns?: Array<dxDataGridColumn | string>;
  cssClass?: string;
  customizeText?: ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string);
  dataField?: string;
  dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
  editCellTemplate?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, displayValue: any, row: dxDataGridRowObject, rowIndex: number, rowType: string, setValue(newValue, newText): any, text: string, value: any, watch: (() => void) }) => any) | template;
  editorOptions?: any;
  encodeHtml?: boolean;
  falseText?: string;
  filterOperations?: Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | "anyof" | "noneof" | string>;
  filterType?: "exclude" | "include";
  filterValue?: any;
  filterValues?: Array<any>;
  fixed?: boolean;
  fixedPosition?: "left" | "right";
  format?: LocalizationTypes.Format;
  formItem?: dxFormSimpleItem;
  groupCellTemplate?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, displayValue: any, groupContinuedMessage: string, groupContinuesMessage: string, row: dxDataGridRowObject, rowIndex: number, summaryItems: Array<any>, text: string, value: any }) => any) | template;
  groupIndex?: number;
  headerCellTemplate?: ((columnHeader: any, headerInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid }) => any) | template;
  headerFilter?: Record<string, any> | {
    allowSearch?: boolean;
    allowSelectAll?: boolean;
    dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store;
    groupInterval?: number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year";
    height?: number | string;
    search?: ColumnHeaderFilterSearchConfig;
    searchMode?: "contains" | "startswith" | "equals";
    width?: number | string;
  };
  hidingPriority?: number;
  isBand?: boolean;
  lookup?: Record<string, any> | {
    allowClearing?: boolean;
    calculateCellValue?: ((rowData: any) => any);
    dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store;
    displayExpr?: ((data: any) => string) | string;
    valueExpr?: string;
  };
  minWidth?: number;
  name?: string;
  ownerBand?: number;
  renderAsync?: boolean;
  selectedFilterOperation?: "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith";
  setCellValue?: ((newData: any, value: any, currentRowData: any) => any);
  showEditorAlways?: boolean;
  showInColumnChooser?: boolean;
  showWhenGrouped?: boolean;
  sortIndex?: number;
  sortingMethod?: ((value1: any, value2: any) => number);
  sortOrder?: "asc" | "desc";
  trueText?: string;
  type?: "adaptive" | "buttons" | "detailExpand" | "groupExpand" | "selection" | "drag";
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number;
  width?: number | string;
  defaultFilterValue?: any;
  onFilterValueChange?: (value: any) => void;
  defaultFilterValues?: Array<any>;
  onFilterValuesChange?: (value: Array<any>) => void;
  defaultGroupIndex?: number;
  onGroupIndexChange?: (value: number) => void;
  defaultSelectedFilterOperation?: "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith";
  onSelectedFilterOperationChange?: (value: "<" | "<=" | "<>" | "=" | ">" | ">=" | "between" | "contains" | "endswith" | "notcontains" | "startswith") => void;
  defaultSortIndex?: number;
  onSortIndexChange?: (value: number) => void;
  defaultSortOrder?: "asc" | "desc";
  onSortOrderChange?: (value: "asc" | "desc") => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultVisibleIndex?: number;
  onVisibleIndexChange?: (value: number) => void;
  cellRender?: (...params: any) => React.ReactNode;
  cellComponent?: React.ComponentType<any>;
  cellKeyFn?: (data: any) => string;
  editCellRender?: (...params: any) => React.ReactNode;
  editCellComponent?: React.ComponentType<any>;
  editCellKeyFn?: (data: any) => string;
  groupCellRender?: (...params: any) => React.ReactNode;
  groupCellComponent?: React.ComponentType<any>;
  groupCellKeyFn?: (data: any) => string;
  headerCellRender?: (...params: any) => React.ReactNode;
  headerCellComponent?: React.ComponentType<any>;
  headerCellKeyFn?: (data: any) => string;
}>
class Column extends NestedOption<IColumnProps> {
  public static OptionName = "columns";
  public static IsCollectionItem = true;
  public static DefaultsProps = {
    defaultFilterValue: "filterValue",
    defaultFilterValues: "filterValues",
    defaultGroupIndex: "groupIndex",
    defaultSelectedFilterOperation: "selectedFilterOperation",
    defaultSortIndex: "sortIndex",
    defaultSortOrder: "sortOrder",
    defaultVisible: "visible",
    defaultVisibleIndex: "visibleIndex"
  };
  public static ExpectedChildren = {
    AsyncRule: { optionName: "validationRules", isCollectionItem: true },
    button: { optionName: "buttons", isCollectionItem: true },
    columnHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
    columnLookup: { optionName: "lookup", isCollectionItem: false },
    CompareRule: { optionName: "validationRules", isCollectionItem: true },
    CustomRule: { optionName: "validationRules", isCollectionItem: true },
    EmailRule: { optionName: "validationRules", isCollectionItem: true },
    format: { optionName: "format", isCollectionItem: false },
    formItem: { optionName: "formItem", isCollectionItem: false },
    headerFilter: { optionName: "headerFilter", isCollectionItem: false },
    lookup: { optionName: "lookup", isCollectionItem: false },
    NumericRule: { optionName: "validationRules", isCollectionItem: true },
    PatternRule: { optionName: "validationRules", isCollectionItem: true },
    RangeRule: { optionName: "validationRules", isCollectionItem: true },
    RequiredRule: { optionName: "validationRules", isCollectionItem: true },
    StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
    validationRule: { optionName: "validationRules", isCollectionItem: true }
  };
  public static TemplateProps = [{
    tmplOption: "cellTemplate",
    render: "cellRender",
    component: "cellComponent",
    keyFn: "cellKeyFn"
  }, {
    tmplOption: "editCellTemplate",
    render: "editCellRender",
    component: "editCellComponent",
    keyFn: "editCellKeyFn"
  }, {
    tmplOption: "groupCellTemplate",
    render: "groupCellRender",
    component: "groupCellComponent",
    keyFn: "groupCellKeyFn"
  }, {
    tmplOption: "headerCellTemplate",
    render: "headerCellRender",
    component: "headerCellComponent",
    keyFn: "headerCellKeyFn"
  }];
}

// owners:
// DataGrid
type IColumnChooserProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  container?: any | string;
  emptyPanelText?: string;
  enabled?: boolean;
  height?: number | string;
  mode?: "dragAndDrop" | "select";
  position?: PositionConfig;
  search?: ColumnChooserSearchConfig;
  searchTimeout?: number;
  selection?: ColumnChooserSelectionConfig;
  sortOrder?: "asc" | "desc";
  title?: string;
  width?: number | string;
}>
class ColumnChooser extends NestedOption<IColumnChooserProps> {
  public static OptionName = "columnChooser";
  public static ExpectedChildren = {
    columnChooserSearch: { optionName: "search", isCollectionItem: false },
    columnChooserSelection: { optionName: "selection", isCollectionItem: false },
    position: { optionName: "position", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false },
    selection: { optionName: "selection", isCollectionItem: false }
  };
}

// owners:
// ColumnChooser
type IColumnChooserSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  timeout?: number;
}>
class ColumnChooserSearch extends NestedOption<IColumnChooserSearchProps> {
  public static OptionName = "search";
}

// owners:
// ColumnChooser
type IColumnChooserSelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  recursive?: boolean;
  selectByClick?: boolean;
}>
class ColumnChooserSelection extends NestedOption<IColumnChooserSelectionProps> {
  public static OptionName = "selection";
}

// owners:
// DataGrid
type IColumnFixingProps = React.PropsWithChildren<{
  enabled?: boolean;
  texts?: Record<string, any> | {
    fix?: string;
    leftPosition?: string;
    rightPosition?: string;
    unfix?: string;
  };
}>
class ColumnFixing extends NestedOption<IColumnFixingProps> {
  public static OptionName = "columnFixing";
  public static ExpectedChildren = {
    columnFixingTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// ColumnFixing
type IColumnFixingTextsProps = React.PropsWithChildren<{
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  unfix?: string;
}>
class ColumnFixingTexts extends NestedOption<IColumnFixingTextsProps> {
  public static OptionName = "texts";
}

// owners:
// Column
type IColumnHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store;
  groupInterval?: number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year";
  height?: number | string;
  search?: ColumnHeaderFilterSearchConfig;
  searchMode?: "contains" | "startswith" | "equals";
  width?: number | string;
}>
class ColumnHeaderFilter extends NestedOption<IColumnHeaderFilterProps> {
  public static OptionName = "headerFilter";
  public static ExpectedChildren = {
    columnHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false }
  };
}

// owners:
// ColumnHeaderFilter
type IColumnHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: "contains" | "startswith" | "equals";
  searchExpr?: Array<(() => any) | string> | (() => any) | string;
  timeout?: number;
}>
class ColumnHeaderFilterSearch extends NestedOption<IColumnHeaderFilterSearchProps> {
  public static OptionName = "search";
}

// owners:
// Column
type IColumnLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  calculateCellValue?: ((rowData: any) => any);
  dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store;
  displayExpr?: ((data: any) => string) | string;
  valueExpr?: string;
}>
class ColumnLookup extends NestedOption<IColumnLookupProps> {
  public static OptionName = "lookup";
}

// owners:
// FormItem
// Column
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => any);
  comparisonType?: "!=" | "!==" | "<" | "<=" | "==" | "===" | ">" | ">=";
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class CompareRule extends NestedOption<ICompareRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "compare"
  };
}

// owners:
// RowDragging
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class CursorOffset extends NestedOption<ICursorOffsetProps> {
  public static OptionName = "cursorOffset";
}

// owners:
// FilterBuilder
type ICustomOperationProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | (() => any) | Array<any>);
  caption?: string;
  customizeText?: ((fieldInfo: { field: dxFilterBuilderField, value: string | number | Date, valueText: string }) => string);
  dataTypes?: Array<"string" | "number" | "date" | "boolean" | "object" | "datetime">;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template;
  hasValue?: boolean;
  icon?: string;
  name?: string;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
  editorKeyFn?: (data: any) => string;
}>
class CustomOperation extends NestedOption<ICustomOperationProps> {
  public static OptionName = "customOperations";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent",
    keyFn: "editorKeyFn"
  }];
}

// owners:
// FormItem
// Column
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
}>
class CustomRule extends NestedOption<ICustomRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "custom"
  };
}

// owners:
// DataGrid
type IDataGridHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  height?: number | string;
  search?: HeaderFilterSearchConfig;
  searchTimeout?: number;
  texts?: Record<string, any> | {
    cancel?: string;
    emptyValue?: string;
    ok?: string;
  };
  visible?: boolean;
  width?: number | string;
}>
class DataGridHeaderFilter extends NestedOption<IDataGridHeaderFilterProps> {
  public static OptionName = "headerFilter";
  public static ExpectedChildren = {
    dataGridHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
    dataGridHeaderFilterTexts: { optionName: "texts", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// DataGridHeaderFilter
type IDataGridHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: "contains" | "startswith" | "equals";
  timeout?: number;
}>
class DataGridHeaderFilterSearch extends NestedOption<IDataGridHeaderFilterSearchProps> {
  public static OptionName = "search";
}

// owners:
// DataGridHeaderFilter
type IDataGridHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
class DataGridHeaderFilterTexts extends NestedOption<IDataGridHeaderFilterTextsProps> {
  public static OptionName = "texts";
}

// owners:
// DataGrid
type IDataGridSelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  deferred?: boolean;
  mode?: "single" | "multiple" | "none";
  selectAllMode?: "allPages" | "page";
  showCheckBoxesMode?: "always" | "none" | "onClick" | "onLongTap";
}>
class DataGridSelection extends NestedOption<IDataGridSelectionProps> {
  public static OptionName = "selection";
}

// owners:
// DataGrid
type IEditingProps = React.PropsWithChildren<{
  allowAdding?: boolean;
  allowDeleting?: boolean | ((options: { component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  allowUpdating?: boolean | ((options: { component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  changes?: Array<DataChange>;
  confirmDelete?: boolean;
  editColumnName?: string;
  editRowKey?: any;
  form?: dxFormOptions;
  mode?: "batch" | "cell" | "row" | "form" | "popup";
  newRowPosition?: "first" | "last" | "pageBottom" | "pageTop" | "viewportBottom" | "viewportTop";
  popup?: dxPopupOptions<any>;
  refreshMode?: "full" | "reshape" | "repaint";
  selectTextOnEditStart?: boolean;
  startEditAction?: "click" | "dblClick";
  texts?: any | {
    addRow?: string;
    cancelAllChanges?: string;
    cancelRowChanges?: string;
    confirmDeleteMessage?: string;
    confirmDeleteTitle?: string;
    deleteRow?: string;
    editRow?: string;
    saveAllChanges?: string;
    saveRowChanges?: string;
    undeleteRow?: string;
    validationCancelChanges?: string;
  };
  useIcons?: boolean;
  defaultChanges?: Array<DataChange>;
  onChangesChange?: (value: Array<DataChange>) => void;
  defaultEditColumnName?: string;
  onEditColumnNameChange?: (value: string) => void;
  defaultEditRowKey?: any;
  onEditRowKeyChange?: (value: any) => void;
}>
class Editing extends NestedOption<IEditingProps> {
  public static OptionName = "editing";
  public static DefaultsProps = {
    defaultChanges: "changes",
    defaultEditColumnName: "editColumnName",
    defaultEditRowKey: "editRowKey"
  };
  public static ExpectedChildren = {
    change: { optionName: "changes", isCollectionItem: true },
    editingTexts: { optionName: "texts", isCollectionItem: false },
    form: { optionName: "form", isCollectionItem: false },
    popup: { optionName: "popup", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// Editing
type IEditingTextsProps = React.PropsWithChildren<{
  addRow?: string;
  cancelAllChanges?: string;
  cancelRowChanges?: string;
  confirmDeleteMessage?: string;
  confirmDeleteTitle?: string;
  deleteRow?: string;
  editRow?: string;
  saveAllChanges?: string;
  saveRowChanges?: string;
  undeleteRow?: string;
  validationCancelChanges?: string;
}>
class EditingTexts extends NestedOption<IEditingTextsProps> {
  public static OptionName = "texts";
}

// owners:
// FormItem
// Column
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class EmailRule extends NestedOption<IEmailRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "email"
  };
}

// owners:
// DataGrid
type IExportProps = React.PropsWithChildren<{
  allowExportSelectedData?: boolean;
  enabled?: boolean;
  formats?: Array<"pdf" | "xlsx" | string>;
  texts?: Record<string, any> | {
    exportAll?: string;
    exportSelectedRows?: string;
    exportTo?: string;
  };
}>
class Export extends NestedOption<IExportProps> {
  public static OptionName = "export";
  public static ExpectedChildren = {
    exportTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// Export
type IExportTextsProps = React.PropsWithChildren<{
  exportAll?: string;
  exportSelectedRows?: string;
  exportTo?: string;
}>
class ExportTexts extends NestedOption<IExportTextsProps> {
  public static OptionName = "texts";
}

// owners:
// FilterBuilder
type IFieldProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | (() => any) | Array<any>);
  caption?: string;
  customizeText?: ((fieldInfo: { value: string | number | Date, valueText: string }) => string);
  dataField?: string;
  dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
  editorOptions?: any;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, filterOperation: string, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template;
  falseText?: string;
  filterOperations?: Array<"=" | "<>" | "<" | "<=" | ">" | ">=" | "contains" | "endswith" | "isblank" | "isnotblank" | "notcontains" | "startswith" | "between" | string>;
  format?: LocalizationTypes.Format;
  lookup?: Record<string, any> | {
    allowClearing?: boolean;
    dataSource?: Array<any> | DataSourceOptions | Store;
    displayExpr?: ((data: any) => string) | string;
    valueExpr?: ((data: any) => string | number | boolean) | string;
  };
  name?: string;
  trueText?: string;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
  editorKeyFn?: (data: any) => string;
}>
class Field extends NestedOption<IFieldProps> {
  public static OptionName = "fields";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    fieldLookup: { optionName: "lookup", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    lookup: { optionName: "lookup", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent",
    keyFn: "editorKeyFn"
  }];
}

// owners:
// Field
type IFieldLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  dataSource?: Array<any> | DataSourceOptions | Store;
  displayExpr?: ((data: any) => string) | string;
  valueExpr?: ((data: any) => string | number | boolean) | string;
}>
class FieldLookup extends NestedOption<IFieldLookupProps> {
  public static OptionName = "lookup";
}

// owners:
// DataGrid
type IFilterBuilderProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  allowHierarchicalFields?: boolean;
  bindingOptions?: Record<string, any>;
  customOperations?: Array<dxFilterBuilderCustomOperation>;
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  fields?: Array<dxFilterBuilderField>;
  filterOperationDescriptions?: Record<string, any> | {
    between?: string;
    contains?: string;
    endsWith?: string;
    equal?: string;
    greaterThan?: string;
    greaterThanOrEqual?: string;
    isBlank?: string;
    isNotBlank?: string;
    lessThan?: string;
    lessThanOrEqual?: string;
    notContains?: string;
    notEqual?: string;
    startsWith?: string;
  };
  focusStateEnabled?: boolean;
  groupOperationDescriptions?: Record<string, any> | {
    and?: string;
    notAnd?: string;
    notOr?: string;
    or?: string;
  };
  groupOperations?: Array<"and" | "or" | "notAnd" | "notOr">;
  height?: (() => number | string) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  maxGroupLevel?: number;
  onContentReady?: ((e: FilterBuilderContentReadyEvent) => void);
  onDisposing?: ((e: FilterBuilderDisposingEvent) => void);
  onEditorPrepared?: ((e: FilterBuilderEditorPreparedEvent) => void);
  onEditorPreparing?: ((e: FilterBuilderEditorPreparingEvent) => void);
  onInitialized?: ((e: FilterBuilderInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
  rtlEnabled?: boolean;
  tabIndex?: number;
  value?: Array<any> | (() => any) | string;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  defaultValue?: Array<any> | (() => any) | string;
  onValueChange?: (value: Array<any> | (() => any) | string) => void;
}>
class FilterBuilder extends NestedOption<IFilterBuilderProps> {
  public static OptionName = "filterBuilder";
  public static DefaultsProps = {
    defaultValue: "value"
  };
  public static ExpectedChildren = {
    customOperation: { optionName: "customOperations", isCollectionItem: true },
    field: { optionName: "fields", isCollectionItem: true },
    filterOperationDescriptions: { optionName: "filterOperationDescriptions", isCollectionItem: false },
    groupOperationDescriptions: { optionName: "groupOperationDescriptions", isCollectionItem: false }
  };
}

// owners:
// DataGrid
type IFilterBuilderPopupProps = React.PropsWithChildren<{
  accessKey?: string;
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  copyRootClassesToWrapper?: boolean;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  elementAttr?: any;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: (() => number | string) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string;
  hoverStateEnabled?: boolean;
  maxHeight?: (() => number | string) | number | string;
  maxWidth?: (() => number | string) | number | string;
  minHeight?: (() => number | string) | number | string;
  minWidth?: (() => number | string) | number | string;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onHidden?: ((e: EventInfo<any>) => void);
  onHiding?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onResize?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeEnd?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeStart?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onShowing?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onShown?: ((e: EventInfo<any>) => void);
  onTitleRendered?: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void);
  position?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  resizeEnabled?: boolean;
  restorePosition?: boolean;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  tabIndex?: number;
  title?: string;
  titleTemplate?: ((titleElement: any) => string | any) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  wrapperAttr?: any;
  defaultHeight?: (() => number | string) | number | string;
  onHeightChange?: (value: (() => number | string) | number | string) => void;
  defaultPosition?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  onPositionChange?: (value: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top") => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number | string) | number | string;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  contentKeyFn?: (data: any) => string;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
  titleKeyFn?: (data: any) => string;
}>
class FilterBuilderPopup extends NestedOption<IFilterBuilderPopupProps> {
  public static OptionName = "filterBuilderPopup";
  public static DefaultsProps = {
    defaultHeight: "height",
    defaultPosition: "position",
    defaultVisible: "visible",
    defaultWidth: "width"
  };
  public static TemplateProps = [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent",
    keyFn: "contentKeyFn"
  }, {
    tmplOption: "titleTemplate",
    render: "titleRender",
    component: "titleComponent",
    keyFn: "titleKeyFn"
  }];
}

// owners:
// FilterBuilder
type IFilterOperationDescriptionsProps = React.PropsWithChildren<{
  between?: string;
  contains?: string;
  endsWith?: string;
  equal?: string;
  greaterThan?: string;
  greaterThanOrEqual?: string;
  isBlank?: string;
  isNotBlank?: string;
  lessThan?: string;
  lessThanOrEqual?: string;
  notContains?: string;
  notEqual?: string;
  startsWith?: string;
}>
class FilterOperationDescriptions extends NestedOption<IFilterOperationDescriptionsProps> {
  public static OptionName = "filterOperationDescriptions";
}

// owners:
// DataGrid
type IFilterPanelProps = React.PropsWithChildren<{
  customizeText?: ((e: { component: GridBase, filterValue: Record<string, any>, text: string }) => string);
  filterEnabled?: boolean;
  texts?: Record<string, any> | {
    clearFilter?: string;
    createFilter?: string;
    filterEnabledHint?: string;
  };
  visible?: boolean;
  defaultFilterEnabled?: boolean;
  onFilterEnabledChange?: (value: boolean) => void;
}>
class FilterPanel extends NestedOption<IFilterPanelProps> {
  public static OptionName = "filterPanel";
  public static DefaultsProps = {
    defaultFilterEnabled: "filterEnabled"
  };
  public static ExpectedChildren = {
    filterPanelTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// FilterPanel
type IFilterPanelTextsProps = React.PropsWithChildren<{
  clearFilter?: string;
  createFilter?: string;
  filterEnabledHint?: string;
}>
class FilterPanelTexts extends NestedOption<IFilterPanelTextsProps> {
  public static OptionName = "texts";
}

// owners:
// DataGrid
type IFilterRowProps = React.PropsWithChildren<{
  applyFilter?: "auto" | "onClick";
  applyFilterText?: string;
  betweenEndText?: string;
  betweenStartText?: string;
  operationDescriptions?: Record<string, any> | {
    between?: string;
    contains?: string;
    endsWith?: string;
    equal?: string;
    greaterThan?: string;
    greaterThanOrEqual?: string;
    lessThan?: string;
    lessThanOrEqual?: string;
    notContains?: string;
    notEqual?: string;
    startsWith?: string;
  };
  resetOperationText?: string;
  showAllText?: string;
  showOperationChooser?: boolean;
  visible?: boolean;
}>
class FilterRow extends NestedOption<IFilterRowProps> {
  public static OptionName = "filterRow";
  public static ExpectedChildren = {
    operationDescriptions: { optionName: "operationDescriptions", isCollectionItem: false }
  };
}

// owners:
// Editing
type IFormProps = React.PropsWithChildren<{
  accessKey?: string;
  activeStateEnabled?: boolean;
  alignItemLabels?: boolean;
  alignItemLabelsInAllGroups?: boolean;
  bindingOptions?: Record<string, any>;
  colCount?: number | "auto";
  colCountByScreen?: Record<string, any> | {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
  };
  customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => void);
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  formData?: any;
  height?: (() => number | string) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  isDirty?: boolean;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  labelLocation?: "left" | "right" | "top";
  labelMode?: "static" | "floating" | "hidden" | "outside";
  minColWidth?: number;
  onContentReady?: ((e: FormContentReadyEvent) => void);
  onDisposing?: ((e: FormDisposingEvent) => void);
  onEditorEnterKey?: ((e: EditorEnterKeyEvent) => void);
  onFieldDataChanged?: ((e: FieldDataChangedEvent) => void);
  onInitialized?: ((e: FormInitializedEvent) => void);
  onOptionChanged?: ((e: FormOptionChangedEvent) => void);
  optionalMark?: string;
  readOnly?: boolean;
  requiredMark?: string;
  requiredMessage?: string;
  rtlEnabled?: boolean;
  screenByWidth?: (() => void);
  scrollingEnabled?: boolean;
  showColonAfterLabel?: boolean;
  showOptionalMark?: boolean;
  showRequiredMark?: boolean;
  showValidationSummary?: boolean;
  tabIndex?: number;
  validationGroup?: string;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  defaultFormData?: any;
  onFormDataChange?: (value: any) => void;
}>
class Form extends NestedOption<IFormProps> {
  public static OptionName = "form";
  public static DefaultsProps = {
    defaultFormData: "formData"
  };
  public static ExpectedChildren = {
    colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
  };
}

// owners:
// Column
// Field
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
class Format extends NestedOption<IFormatProps> {
  public static OptionName = "format";
}

// owners:
// Column
type IFormItemProps = React.PropsWithChildren<{
  colSpan?: number;
  cssClass?: string;
  dataField?: string;
  editorOptions?: any;
  editorType?: "dxAutocomplete" | "dxCalendar" | "dxCheckBox" | "dxColorBox" | "dxDateBox" | "dxDateRangeBox" | "dxDropDownBox" | "dxHtmlEditor" | "dxLookup" | "dxNumberBox" | "dxRadioGroup" | "dxRangeSlider" | "dxSelectBox" | "dxSlider" | "dxSwitch" | "dxTagBox" | "dxTextArea" | "dxTextBox";
  helpText?: string;
  isRequired?: boolean;
  itemType?: "empty" | "group" | "simple" | "tabbed" | "button";
  label?: Record<string, any> | {
    alignment?: "center" | "left" | "right";
    location?: "left" | "right" | "top";
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
    text?: string;
    visible?: boolean;
  };
  name?: string;
  template?: ((data: { component: dxForm, dataField: string, editorOptions: Record<string, any>, editorType: string, name: string }, itemElement: any) => string | any) | template;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class FormItem extends NestedOption<IFormItemProps> {
  public static OptionName = "formItem";
  public static ExpectedChildren = {
    AsyncRule: { optionName: "validationRules", isCollectionItem: true },
    CompareRule: { optionName: "validationRules", isCollectionItem: true },
    CustomRule: { optionName: "validationRules", isCollectionItem: true },
    EmailRule: { optionName: "validationRules", isCollectionItem: true },
    label: { optionName: "label", isCollectionItem: false },
    NumericRule: { optionName: "validationRules", isCollectionItem: true },
    PatternRule: { optionName: "validationRules", isCollectionItem: true },
    RangeRule: { optionName: "validationRules", isCollectionItem: true },
    RequiredRule: { optionName: "validationRules", isCollectionItem: true },
    StringLengthRule: { optionName: "validationRules", isCollectionItem: true },
    validationRule: { optionName: "validationRules", isCollectionItem: true }
  };
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// Hide
type IFromProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
class From extends NestedOption<IFromProps> {
  public static OptionName = "from";
  public static ExpectedChildren = {
    position: { optionName: "position", isCollectionItem: false }
  };
}

// owners:
// DataGrid
type IGroupingProps = React.PropsWithChildren<{
  allowCollapsing?: boolean;
  autoExpandAll?: boolean;
  contextMenuEnabled?: boolean;
  expandMode?: "buttonClick" | "rowClick";
  texts?: Record<string, any> | {
    groupByThisColumn?: string;
    groupContinuedMessage?: string;
    groupContinuesMessage?: string;
    ungroup?: string;
    ungroupAll?: string;
  };
}>
class Grouping extends NestedOption<IGroupingProps> {
  public static OptionName = "grouping";
  public static ExpectedChildren = {
    groupingTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  };
}

// owners:
// Grouping
type IGroupingTextsProps = React.PropsWithChildren<{
  groupByThisColumn?: string;
  groupContinuedMessage?: string;
  groupContinuesMessage?: string;
  ungroup?: string;
  ungroupAll?: string;
}>
class GroupingTexts extends NestedOption<IGroupingTextsProps> {
  public static OptionName = "texts";
}

// owners:
// Summary
type IGroupItemProps = React.PropsWithChildren<{
  alignByColumn?: boolean;
  column?: string;
  customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
  displayFormat?: string;
  name?: string;
  showInColumn?: string;
  showInGroupFooter?: boolean;
  skipEmptyValues?: boolean;
  summaryType?: "avg" | "count" | "custom" | "max" | "min" | "sum";
  valueFormat?: LocalizationTypes.Format;
}>
class GroupItem extends NestedOption<IGroupItemProps> {
  public static OptionName = "groupItems";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    valueFormat: { optionName: "valueFormat", isCollectionItem: false }
  };
}

// owners:
// FilterBuilder
type IGroupOperationDescriptionsProps = React.PropsWithChildren<{
  and?: string;
  notAnd?: string;
  notOr?: string;
  or?: string;
}>
class GroupOperationDescriptions extends NestedOption<IGroupOperationDescriptionsProps> {
  public static OptionName = "groupOperationDescriptions";
}

// owners:
// DataGrid
type IGroupPanelProps = React.PropsWithChildren<{
  allowColumnDragging?: boolean;
  emptyPanelText?: string;
  visible?: boolean | "auto";
  defaultVisible?: boolean | "auto";
  onVisibleChange?: (value: boolean | "auto") => void;
}>
class GroupPanel extends NestedOption<IGroupPanelProps> {
  public static OptionName = "groupPanel";
  public static DefaultsProps = {
    defaultVisible: "visible"
  };
}

// owners:
// Column
// DataGrid
type IHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store;
  groupInterval?: number | "day" | "hour" | "minute" | "month" | "quarter" | "second" | "year";
  height?: number | string;
  search?: ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig;
  searchMode?: "contains" | "startswith" | "equals";
  width?: number | string;
  searchTimeout?: number;
  texts?: Record<string, any> | {
    cancel?: string;
    emptyValue?: string;
    ok?: string;
  };
  visible?: boolean;
}>
class HeaderFilter extends NestedOption<IHeaderFilterProps> {
  public static OptionName = "headerFilter";
}

// owners:
// Animation
type IHideProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: "bottom" | "left" | "right" | "top";
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: "css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut";
}>
class Hide extends NestedOption<IHideProps> {
  public static OptionName = "hide";
  public static ExpectedChildren = {
    from: { optionName: "from", isCollectionItem: false },
    to: { optionName: "to", isCollectionItem: false }
  };
}

// owners:
// Toolbar
type IItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  html?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => string | any) | template;
  name?: "addRowButton" | "applyFilterButton" | "columnChooserButton" | "exportButton" | "groupPanel" | "revertButton" | "saveButton" | "searchPanel";
  options?: any;
  showText?: "always" | "inMenu";
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox";
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent",
    keyFn: "menuItemKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// DataGrid
type IKeyboardNavigationProps = React.PropsWithChildren<{
  editOnKeyPress?: boolean;
  enabled?: boolean;
  enterKeyAction?: "startEdit" | "moveFocus";
  enterKeyDirection?: "none" | "column" | "row";
}>
class KeyboardNavigation extends NestedOption<IKeyboardNavigationProps> {
  public static OptionName = "keyboardNavigation";
}

// owners:
// FormItem
type ILabelProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  location?: "left" | "right" | "top";
  showColon?: boolean;
  template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Label extends NestedOption<ILabelProps> {
  public static OptionName = "label";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// DataGrid
type ILoadPanelProps = React.PropsWithChildren<{
  enabled?: boolean | "auto";
  height?: number | string;
  indicatorSrc?: string;
  shading?: boolean;
  shadingColor?: string;
  showIndicator?: boolean;
  showPane?: boolean;
  text?: string;
  width?: number | string;
}>
class LoadPanel extends NestedOption<ILoadPanelProps> {
  public static OptionName = "loadPanel";
}

// owners:
// Column
// Field
type ILookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  calculateCellValue?: ((rowData: any) => any);
  dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store;
  displayExpr?: ((data: any) => string) | string;
  valueExpr?: string | ((data: any) => string | number | boolean);
}>
class Lookup extends NestedOption<ILookupProps> {
  public static OptionName = "lookup";
}

// owners:
// DataGrid
type IMasterDetailProps = React.PropsWithChildren<{
  autoExpandAll?: boolean;
  enabled?: boolean;
  template?: ((detailElement: any, detailInfo: { data: Record<string, any>, key: any, watch: (() => void) }) => any) | template;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class MasterDetail extends NestedOption<IMasterDetailProps> {
  public static OptionName = "masterDetail";
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
class My extends NestedOption<IMyProps> {
  public static OptionName = "my";
}

// owners:
// FormItem
// Column
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class NumericRule extends NestedOption<INumericRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "numeric"
  };
}

// owners:
// Position
type IOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
class Offset extends NestedOption<IOffsetProps> {
  public static OptionName = "offset";
}

// owners:
// FilterRow
type IOperationDescriptionsProps = React.PropsWithChildren<{
  between?: string;
  contains?: string;
  endsWith?: string;
  equal?: string;
  greaterThan?: string;
  greaterThanOrEqual?: string;
  lessThan?: string;
  lessThanOrEqual?: string;
  notContains?: string;
  notEqual?: string;
  startsWith?: string;
}>
class OperationDescriptions extends NestedOption<IOperationDescriptionsProps> {
  public static OptionName = "operationDescriptions";
}

// owners:
// DataGrid
type IPagerProps = React.PropsWithChildren<{
  allowedPageSizes?: Array<number | "all" | "auto"> | "auto";
  displayMode?: "adaptive" | "compact" | "full";
  infoText?: string;
  label?: string;
  showInfo?: boolean;
  showNavigationButtons?: boolean;
  showPageSizeSelector?: boolean;
  visible?: boolean | "auto";
}>
class Pager extends NestedOption<IPagerProps> {
  public static OptionName = "pager";
}

// owners:
// DataGrid
type IPagingProps = React.PropsWithChildren<{
  enabled?: boolean;
  pageIndex?: number;
  pageSize?: number;
  defaultPageIndex?: number;
  onPageIndexChange?: (value: number) => void;
  defaultPageSize?: number;
  onPageSizeChange?: (value: number) => void;
}>
class Paging extends NestedOption<IPagingProps> {
  public static OptionName = "paging";
  public static DefaultsProps = {
    defaultPageIndex: "pageIndex",
    defaultPageSize: "pageSize"
  };
}

// owners:
// FormItem
// Column
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: RegExp | string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class PatternRule extends NestedOption<IPatternRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "pattern"
  };
}

// owners:
// Editing
type IPopupProps = React.PropsWithChildren<{
  accessKey?: string;
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  copyRootClassesToWrapper?: boolean;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  elementAttr?: any;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: (() => number | string) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string;
  hoverStateEnabled?: boolean;
  maxHeight?: (() => number | string) | number | string;
  maxWidth?: (() => number | string) | number | string;
  minHeight?: (() => number | string) | number | string;
  minWidth?: (() => number | string) | number | string;
  onContentReady?: ((e: EventInfo<any>) => void);
  onDisposing?: ((e: EventInfo<any>) => void);
  onHidden?: ((e: EventInfo<any>) => void);
  onHiding?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onInitialized?: ((e: { component: Component<any>, element: any }) => void);
  onOptionChanged?: ((e: { component: DOMComponent, element: any, fullName: string, model: any, name: string, previousValue: any, value: any }) => void);
  onResize?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeEnd?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onResizeStart?: ((e: { component: dxPopup, element: any, event: event, height: number, model: any, width: number }) => void);
  onShowing?: ((e: { cancel: boolean | any, component: dxOverlay<any>, element: any, model: any }) => void);
  onShown?: ((e: EventInfo<any>) => void);
  onTitleRendered?: ((e: { component: dxPopup, element: any, model: any, titleElement: any }) => void);
  position?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  resizeEnabled?: boolean;
  restorePosition?: boolean;
  rtlEnabled?: boolean;
  shading?: boolean;
  shadingColor?: string;
  showCloseButton?: boolean;
  showTitle?: boolean;
  tabIndex?: number;
  title?: string;
  titleTemplate?: ((titleElement: any) => string | any) | template;
  toolbarItems?: Array<dxPopupToolbarItem>;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  wrapperAttr?: any;
  defaultHeight?: (() => number | string) | number | string;
  onHeightChange?: (value: (() => number | string) | number | string) => void;
  defaultPosition?: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top";
  onPositionChange?: (value: (() => void) | PositionConfig | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top") => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number | string) | number | string;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  contentKeyFn?: (data: any) => string;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
  titleKeyFn?: (data: any) => string;
}>
class Popup extends NestedOption<IPopupProps> {
  public static OptionName = "popup";
  public static DefaultsProps = {
    defaultHeight: "height",
    defaultPosition: "position",
    defaultVisible: "visible",
    defaultWidth: "width"
  };
  public static ExpectedChildren = {
    animation: { optionName: "animation", isCollectionItem: false },
    position: { optionName: "position", isCollectionItem: false },
    toolbarItem: { optionName: "toolbarItems", isCollectionItem: true }
  };
  public static TemplateProps = [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent",
    keyFn: "contentKeyFn"
  }, {
    tmplOption: "titleTemplate",
    render: "titleRender",
    component: "titleComponent",
    keyFn: "titleKeyFn"
  }];
}

// owners:
// From
// Popup
// ColumnChooser
type IPositionProps = React.PropsWithChildren<{
  at?: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
  };
  boundary?: any | string;
  boundaryOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  collision?: Record<string, any> | "fit" | "fit flip" | "fit flipfit" | "fit none" | "flip" | "flip fit" | "flip none" | "flipfit" | "flipfit fit" | "flipfit none" | "none" | "none fit" | "none flip" | "none flipfit" | {
    x?: "fit" | "flip" | "flipfit" | "none";
    y?: "fit" | "flip" | "flipfit" | "none";
  };
  my?: Record<string, any> | "bottom" | "center" | "left" | "left bottom" | "left top" | "right" | "right bottom" | "right top" | "top" | {
    x?: "center" | "left" | "right";
    y?: "bottom" | "center" | "top";
  };
  of?: any | string;
  offset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
}>
class Position extends NestedOption<IPositionProps> {
  public static OptionName = "position";
}

// owners:
// FormItem
// Column
type IRangeRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  message?: string;
  min?: Date | number | string;
  reevaluate?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class RangeRule extends NestedOption<IRangeRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "range"
  };
}

// owners:
// DataGrid
type IRemoteOperationsProps = React.PropsWithChildren<{
  filtering?: boolean;
  grouping?: boolean;
  groupPaging?: boolean;
  paging?: boolean;
  sorting?: boolean;
  summary?: boolean;
}>
class RemoteOperations extends NestedOption<IRemoteOperationsProps> {
  public static OptionName = "remoteOperations";
}

// owners:
// FormItem
// Column
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class RequiredRule extends NestedOption<IRequiredRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "required"
  };
}

// owners:
// DataGrid
type IRowDraggingProps = React.PropsWithChildren<{
  allowDropInsideItem?: boolean;
  allowReordering?: boolean;
  autoScroll?: boolean;
  boundary?: any | string;
  container?: any | string;
  cursorOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  data?: any;
  dragDirection?: "both" | "horizontal" | "vertical";
  dragTemplate?: ((dragInfo: { itemData: any, itemElement: any }, containerElement: any) => string | any) | template;
  dropFeedbackMode?: "push" | "indicate";
  filter?: string;
  group?: string;
  handle?: string;
  onAdd?: ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragChange?: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragEnd?: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragMove?: ((e: { cancel: boolean, component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onDragStart?: ((e: { cancel: boolean, component: GridBase, event: event, fromData: any, fromIndex: number, itemData: any, itemElement: any }) => void);
  onRemove?: ((e: { component: GridBase, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  onReorder?: ((e: { component: GridBase, dropInsideItem: boolean, event: event, fromComponent: dxSortable | dxDraggable, fromData: any, fromIndex: number, itemData: any, itemElement: any, promise: any, toComponent: dxSortable | dxDraggable, toData: any, toIndex: number }) => void);
  scrollSensitivity?: number;
  scrollSpeed?: number;
  showDragIcons?: boolean;
  dragRender?: (...params: any) => React.ReactNode;
  dragComponent?: React.ComponentType<any>;
  dragKeyFn?: (data: any) => string;
}>
class RowDragging extends NestedOption<IRowDraggingProps> {
  public static OptionName = "rowDragging";
  public static ExpectedChildren = {
    cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
  };
  public static TemplateProps = [{
    tmplOption: "dragTemplate",
    render: "dragRender",
    component: "dragComponent",
    keyFn: "dragKeyFn"
  }];
}

// owners:
// DataGrid
type IScrollingProps = React.PropsWithChildren<{
  columnRenderingMode?: "standard" | "virtual";
  mode?: "infinite" | "standard" | "virtual";
  preloadEnabled?: boolean;
  renderAsync?: boolean;
  rowRenderingMode?: "standard" | "virtual";
  scrollByContent?: boolean;
  scrollByThumb?: boolean;
  showScrollbar?: "always" | "never" | "onHover" | "onScroll";
  useNative?: boolean | "auto";
}>
class Scrolling extends NestedOption<IScrollingProps> {
  public static OptionName = "scrolling";
}

// owners:
// ColumnHeaderFilter
// ColumnChooser
// DataGridHeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: "contains" | "startswith" | "equals";
  searchExpr?: Array<(() => any) | string> | (() => any) | string;
  timeout?: number;
}>
class Search extends NestedOption<ISearchProps> {
  public static OptionName = "search";
}

// owners:
// DataGrid
type ISearchPanelProps = React.PropsWithChildren<{
  highlightCaseSensitive?: boolean;
  highlightSearchText?: boolean;
  placeholder?: string;
  searchVisibleColumnsOnly?: boolean;
  text?: string;
  visible?: boolean;
  width?: number | string;
  defaultText?: string;
  onTextChange?: (value: string) => void;
}>
class SearchPanel extends NestedOption<ISearchPanelProps> {
  public static OptionName = "searchPanel";
  public static DefaultsProps = {
    defaultText: "text"
  };
}

// owners:
// DataGrid
// ColumnChooser
type ISelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  deferred?: boolean;
  mode?: "single" | "multiple" | "none";
  selectAllMode?: "allPages" | "page";
  showCheckBoxesMode?: "always" | "none" | "onClick" | "onLongTap";
  recursive?: boolean;
  selectByClick?: boolean;
}>
class Selection extends NestedOption<ISelectionProps> {
  public static OptionName = "selection";
}

// owners:
// Animation
type IShowProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: "bottom" | "left" | "right" | "top";
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: "css" | "fade" | "fadeIn" | "fadeOut" | "pop" | "slide" | "slideIn" | "slideOut";
}>
class Show extends NestedOption<IShowProps> {
  public static OptionName = "show";
}

// owners:
// DataGrid
type ISortByGroupSummaryInfoProps = React.PropsWithChildren<{
  groupColumn?: string;
  sortOrder?: "asc" | "desc";
  summaryItem?: number | string;
}>
class SortByGroupSummaryInfo extends NestedOption<ISortByGroupSummaryInfoProps> {
  public static OptionName = "sortByGroupSummaryInfo";
  public static IsCollectionItem = true;
}

// owners:
// DataGrid
type ISortingProps = React.PropsWithChildren<{
  ascendingText?: string;
  clearText?: string;
  descendingText?: string;
  mode?: "single" | "multiple" | "none";
  showSortIndexes?: boolean;
}>
class Sorting extends NestedOption<ISortingProps> {
  public static OptionName = "sorting";
}

// owners:
// DataGrid
type IStateStoringProps = React.PropsWithChildren<{
  customLoad?: (() => any);
  customSave?: ((gridState: any) => void);
  enabled?: boolean;
  savingTimeout?: number;
  storageKey?: string;
  type?: "custom" | "localStorage" | "sessionStorage";
}>
class StateStoring extends NestedOption<IStateStoringProps> {
  public static OptionName = "stateStoring";
}

// owners:
// FormItem
// Column
type IStringLengthRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: number;
  message?: string;
  min?: number;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
class StringLengthRule extends NestedOption<IStringLengthRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "stringLength"
  };
}

// owners:
// DataGrid
type ISummaryProps = React.PropsWithChildren<{
  calculateCustomSummary?: ((options: { component: dxDataGrid, groupIndex: number, name: string, summaryProcess: string, totalValue: any, value: any }) => void);
  groupItems?: Array<Record<string, any>> | {
    alignByColumn?: boolean;
    column?: string;
    customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
    displayFormat?: string;
    name?: string;
    showInColumn?: string;
    showInGroupFooter?: boolean;
    skipEmptyValues?: boolean;
    summaryType?: "avg" | "count" | "custom" | "max" | "min" | "sum";
    valueFormat?: LocalizationTypes.Format;
  }[];
  recalculateWhileEditing?: boolean;
  skipEmptyValues?: boolean;
  texts?: Record<string, any> | {
    avg?: string;
    avgOtherColumn?: string;
    count?: string;
    max?: string;
    maxOtherColumn?: string;
    min?: string;
    minOtherColumn?: string;
    sum?: string;
    sumOtherColumn?: string;
  };
  totalItems?: Array<Record<string, any>> | {
    alignment?: "center" | "left" | "right";
    column?: string;
    cssClass?: string;
    customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
    displayFormat?: string;
    name?: string;
    showInColumn?: string;
    skipEmptyValues?: boolean;
    summaryType?: "avg" | "count" | "custom" | "max" | "min" | "sum";
    valueFormat?: LocalizationTypes.Format;
  }[];
}>
class Summary extends NestedOption<ISummaryProps> {
  public static OptionName = "summary";
  public static ExpectedChildren = {
    groupItem: { optionName: "groupItems", isCollectionItem: true },
    summaryTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false },
    totalItem: { optionName: "totalItems", isCollectionItem: true }
  };
}

// owners:
// Summary
type ISummaryTextsProps = React.PropsWithChildren<{
  avg?: string;
  avgOtherColumn?: string;
  count?: string;
  max?: string;
  maxOtherColumn?: string;
  min?: string;
  minOtherColumn?: string;
  sum?: string;
  sumOtherColumn?: string;
}>
class SummaryTexts extends NestedOption<ISummaryTextsProps> {
  public static OptionName = "texts";
}

// owners:
// Editing
// Export
// Grouping
// Summary
// ColumnFixing
// FilterPanel
// DataGridHeaderFilter
type ITextsProps = React.PropsWithChildren<{
  addRow?: string;
  cancelAllChanges?: string;
  cancelRowChanges?: string;
  confirmDeleteMessage?: string;
  confirmDeleteTitle?: string;
  deleteRow?: string;
  editRow?: string;
  saveAllChanges?: string;
  saveRowChanges?: string;
  undeleteRow?: string;
  validationCancelChanges?: string;
  exportAll?: string;
  exportSelectedRows?: string;
  exportTo?: string;
  groupByThisColumn?: string;
  groupContinuedMessage?: string;
  groupContinuesMessage?: string;
  ungroup?: string;
  ungroupAll?: string;
  avg?: string;
  avgOtherColumn?: string;
  count?: string;
  max?: string;
  maxOtherColumn?: string;
  min?: string;
  minOtherColumn?: string;
  sum?: string;
  sumOtherColumn?: string;
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  unfix?: string;
  clearFilter?: string;
  createFilter?: string;
  filterEnabledHint?: string;
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
class Texts extends NestedOption<ITextsProps> {
  public static OptionName = "texts";
}

// owners:
// Hide
type IToProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
class To extends NestedOption<IToProps> {
  public static OptionName = "to";
}

// owners:
// DataGrid
type IToolbarProps = React.PropsWithChildren<{
  disabled?: boolean;
  items?: Array<dxDataGridToolbarItem | "addRowButton" | "applyFilterButton" | "columnChooserButton" | "exportButton" | "groupPanel" | "revertButton" | "saveButton" | "searchPanel">;
  visible?: boolean;
}>
class Toolbar extends NestedOption<IToolbarProps> {
  public static OptionName = "toolbar";
  public static ExpectedChildren = {
    item: { optionName: "items", isCollectionItem: true }
  };
}

// owners:
// Popup
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  html?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: "always" | "inMenu";
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  toolbar?: "bottom" | "top";
  visible?: boolean;
  widget?: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox";
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class ToolbarItem extends NestedOption<IToolbarItemProps> {
  public static OptionName = "toolbarItems";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent",
    keyFn: "menuItemKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// Summary
type ITotalItemProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  column?: string;
  cssClass?: string;
  customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
  displayFormat?: string;
  name?: string;
  showInColumn?: string;
  skipEmptyValues?: boolean;
  summaryType?: "avg" | "count" | "custom" | "max" | "min" | "sum";
  valueFormat?: LocalizationTypes.Format;
}>
class TotalItem extends NestedOption<ITotalItemProps> {
  public static OptionName = "totalItems";
  public static IsCollectionItem = true;
  public static ExpectedChildren = {
    valueFormat: { optionName: "valueFormat", isCollectionItem: false }
  };
}

// owners:
// FormItem
// Column
type IValidationRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  min?: Date | number | string;
  reevaluate?: boolean;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
  comparisonTarget?: (() => any);
  comparisonType?: "!=" | "!==" | "<" | "<=" | "==" | "===" | ">" | ">=";
  pattern?: RegExp | string;
}>
class ValidationRule extends NestedOption<IValidationRuleProps> {
  public static OptionName = "validationRules";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    type: "required"
  };
}

// owners:
// GroupItem
// TotalItem
type IValueFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: "billions" | "currency" | "day" | "decimal" | "exponential" | "fixedPoint" | "largeNumber" | "longDate" | "longTime" | "millions" | "millisecond" | "month" | "monthAndDay" | "monthAndYear" | "percent" | "quarter" | "quarterAndYear" | "shortDate" | "shortTime" | "thousands" | "trillions" | "year" | "dayOfWeek" | "hour" | "longDateLongTime" | "minute" | "second" | "shortDateShortTime";
  useCurrencyAccountingStyle?: boolean;
}>
class ValueFormat extends NestedOption<IValueFormatProps> {
  public static OptionName = "valueFormat";
}

export default DataGrid;
export {
  DataGrid,
  IDataGridOptions,
  Animation,
  IAnimationProps,
  AsyncRule,
  IAsyncRuleProps,
  At,
  IAtProps,
  BoundaryOffset,
  IBoundaryOffsetProps,
  Button,
  IButtonProps,
  Change,
  IChangeProps,
  ColCountByScreen,
  IColCountByScreenProps,
  Collision,
  ICollisionProps,
  Column,
  IColumnProps,
  ColumnChooser,
  IColumnChooserProps,
  ColumnChooserSearch,
  IColumnChooserSearchProps,
  ColumnChooserSelection,
  IColumnChooserSelectionProps,
  ColumnFixing,
  IColumnFixingProps,
  ColumnFixingTexts,
  IColumnFixingTextsProps,
  ColumnHeaderFilter,
  IColumnHeaderFilterProps,
  ColumnHeaderFilterSearch,
  IColumnHeaderFilterSearchProps,
  ColumnLookup,
  IColumnLookupProps,
  CompareRule,
  ICompareRuleProps,
  CursorOffset,
  ICursorOffsetProps,
  CustomOperation,
  ICustomOperationProps,
  CustomRule,
  ICustomRuleProps,
  DataGridHeaderFilter,
  IDataGridHeaderFilterProps,
  DataGridHeaderFilterSearch,
  IDataGridHeaderFilterSearchProps,
  DataGridHeaderFilterTexts,
  IDataGridHeaderFilterTextsProps,
  DataGridSelection,
  IDataGridSelectionProps,
  Editing,
  IEditingProps,
  EditingTexts,
  IEditingTextsProps,
  EmailRule,
  IEmailRuleProps,
  Export,
  IExportProps,
  ExportTexts,
  IExportTextsProps,
  Field,
  IFieldProps,
  FieldLookup,
  IFieldLookupProps,
  FilterBuilder,
  IFilterBuilderProps,
  FilterBuilderPopup,
  IFilterBuilderPopupProps,
  FilterOperationDescriptions,
  IFilterOperationDescriptionsProps,
  FilterPanel,
  IFilterPanelProps,
  FilterPanelTexts,
  IFilterPanelTextsProps,
  FilterRow,
  IFilterRowProps,
  Form,
  IFormProps,
  Format,
  IFormatProps,
  FormItem,
  IFormItemProps,
  From,
  IFromProps,
  Grouping,
  IGroupingProps,
  GroupingTexts,
  IGroupingTextsProps,
  GroupItem,
  IGroupItemProps,
  GroupOperationDescriptions,
  IGroupOperationDescriptionsProps,
  GroupPanel,
  IGroupPanelProps,
  HeaderFilter,
  IHeaderFilterProps,
  Hide,
  IHideProps,
  Item,
  IItemProps,
  KeyboardNavigation,
  IKeyboardNavigationProps,
  Label,
  ILabelProps,
  LoadPanel,
  ILoadPanelProps,
  Lookup,
  ILookupProps,
  MasterDetail,
  IMasterDetailProps,
  My,
  IMyProps,
  NumericRule,
  INumericRuleProps,
  Offset,
  IOffsetProps,
  OperationDescriptions,
  IOperationDescriptionsProps,
  Pager,
  IPagerProps,
  Paging,
  IPagingProps,
  PatternRule,
  IPatternRuleProps,
  Popup,
  IPopupProps,
  Position,
  IPositionProps,
  RangeRule,
  IRangeRuleProps,
  RemoteOperations,
  IRemoteOperationsProps,
  RequiredRule,
  IRequiredRuleProps,
  RowDragging,
  IRowDraggingProps,
  Scrolling,
  IScrollingProps,
  Search,
  ISearchProps,
  SearchPanel,
  ISearchPanelProps,
  Selection,
  ISelectionProps,
  Show,
  IShowProps,
  SortByGroupSummaryInfo,
  ISortByGroupSummaryInfoProps,
  Sorting,
  ISortingProps,
  StateStoring,
  IStateStoringProps,
  StringLengthRule,
  IStringLengthRuleProps,
  Summary,
  ISummaryProps,
  SummaryTexts,
  ISummaryTextsProps,
  Texts,
  ITextsProps,
  To,
  IToProps,
  Toolbar,
  IToolbarProps,
  ToolbarItem,
  IToolbarItemProps,
  TotalItem,
  ITotalItemProps,
  ValidationRule,
  IValidationRuleProps,
  ValueFormat,
  IValueFormatProps
};
import type * as DataGridTypes from 'devextreme/ui/data_grid_types';
export { DataGridTypes };

