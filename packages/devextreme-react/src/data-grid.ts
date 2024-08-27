"use client"
export { ExplicitTypes } from "devextreme/ui/data_grid";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxDataGrid, {
    Properties
} from "devextreme/ui/data_grid";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
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
  rowRender?: (...params: any) => React.ReactNode;
  rowComponent?: React.ComponentType<any>;
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

interface DataGridRef<TRowData = any, TKey = any> {
  instance: () => dxDataGrid<TRowData, TKey>;
}

const DataGrid = memo(
  forwardRef(
    <TRowData = any, TKey = any>(props: React.PropsWithChildren<IDataGridOptions<TRowData, TKey>>, ref: ForwardedRef<DataGridRef<TRowData, TKey>>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["columns","editing","editing.changes","editing.editColumnName","editing.editRowKey","filterPanel","filterPanel.filterEnabled","filterValue","focusedColumnIndex","focusedRowIndex","focusedRowKey","groupPanel","groupPanel.visible","paging","paging.pageIndex","paging.pageSize","searchPanel","searchPanel.text","selectedRowKeys","selectionFilter"]), []);
      const independentEvents = useMemo(() => (["onAdaptiveDetailRowPreparing","onCellClick","onCellDblClick","onCellPrepared","onContentReady","onContextMenuPreparing","onDataErrorOccurred","onDisposing","onEditCanceled","onEditCanceling","onEditingStart","onEditorPrepared","onEditorPreparing","onExporting","onFocusedCellChanging","onFocusedRowChanging","onInitialized","onInitNewRow","onKeyDown","onRowClick","onRowCollapsed","onRowCollapsing","onRowDblClick","onRowExpanded","onRowExpanding","onRowInserted","onRowInserting","onRowPrepared","onRowRemoved","onRowRemoving","onRowUpdated","onRowUpdating","onRowValidating","onSaved","onSaving","onToolbarPreparing"]), []);

      const defaults = useMemo(() => ({
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
        defaultSelectionFilter: "selectionFilter",
      }), []);

      const expectedChildren = useMemo(() => ({
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
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "dataRowTemplate",
          render: "dataRowRender",
          component: "dataRowComponent"
        },
        {
          tmplOption: "rowTemplate",
          render: "rowRender",
          component: "rowComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IDataGridOptions<TRowData, TKey>>>, {
          WidgetClass: dxDataGrid,
          ref: baseRef,
          useRequestAnimationFrameFlag: true,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as <TRowData = any, TKey = any>(props: React.PropsWithChildren<IDataGridOptions<TRowData, TKey>> & { ref?: Ref<DataGridRef<TRowData, TKey>> }) => ReactElement | null;


// owners:
// Popup
type IAnimationProps = React.PropsWithChildren<{
  hide?: AnimationConfig;
  show?: AnimationConfig;
}>
const _componentAnimation = memo(
  (props: IAnimationProps) => {
    return React.createElement(NestedOption<IAnimationProps>, { ...props });
  }
);

const Animation: typeof _componentAnimation & IElementDescriptor = Object.assign(_componentAnimation, {
  OptionName: "animation",
  ExpectedChildren: {
    hide: { optionName: "hide", isCollectionItem: false },
    show: { optionName: "show", isCollectionItem: false }
  },
})

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
const _componentAsyncRule = memo(
  (props: IAsyncRuleProps) => {
    return React.createElement(NestedOption<IAsyncRuleProps>, { ...props });
  }
);

const AsyncRule: typeof _componentAsyncRule & IElementDescriptor = Object.assign(_componentAsyncRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "async"
  },
})

// owners:
// Position
type IAtProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
const _componentAt = memo(
  (props: IAtProps) => {
    return React.createElement(NestedOption<IAtProps>, { ...props });
  }
);

const At: typeof _componentAt & IElementDescriptor = Object.assign(_componentAt, {
  OptionName: "at",
})

// owners:
// Position
type IBoundaryOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentBoundaryOffset = memo(
  (props: IBoundaryOffsetProps) => {
    return React.createElement(NestedOption<IBoundaryOffsetProps>, { ...props });
  }
);

const BoundaryOffset: typeof _componentBoundaryOffset & IElementDescriptor = Object.assign(_componentBoundaryOffset, {
  OptionName: "boundaryOffset",
})

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
}>
const _componentButton = memo(
  (props: IButtonProps) => {
    return React.createElement(NestedOption<IButtonProps>, { ...props });
  }
);

const Button: typeof _componentButton & IElementDescriptor = Object.assign(_componentButton, {
  OptionName: "buttons",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// Editing
type IChangeProps = React.PropsWithChildren<{
  data?: any;
  insertAfterKey?: any;
  insertBeforeKey?: any;
  key?: any;
  type?: "insert" | "update" | "remove";
}>
const _componentChange = memo(
  (props: IChangeProps) => {
    return React.createElement(NestedOption<IChangeProps>, { ...props });
  }
);

const Change: typeof _componentChange & IElementDescriptor = Object.assign(_componentChange, {
  OptionName: "changes",
  IsCollectionItem: true,
})

// owners:
// Form
type IColCountByScreenProps = React.PropsWithChildren<{
  lg?: number;
  md?: number;
  sm?: number;
  xs?: number;
}>
const _componentColCountByScreen = memo(
  (props: IColCountByScreenProps) => {
    return React.createElement(NestedOption<IColCountByScreenProps>, { ...props });
  }
);

const ColCountByScreen: typeof _componentColCountByScreen & IElementDescriptor = Object.assign(_componentColCountByScreen, {
  OptionName: "colCountByScreen",
})

// owners:
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: "fit" | "flip" | "flipfit" | "none";
  y?: "fit" | "flip" | "flipfit" | "none";
}>
const _componentCollision = memo(
  (props: ICollisionProps) => {
    return React.createElement(NestedOption<ICollisionProps>, { ...props });
  }
);

const Collision: typeof _componentCollision & IElementDescriptor = Object.assign(_componentCollision, {
  OptionName: "collision",
})

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
  editCellRender?: (...params: any) => React.ReactNode;
  editCellComponent?: React.ComponentType<any>;
  groupCellRender?: (...params: any) => React.ReactNode;
  groupCellComponent?: React.ComponentType<any>;
  headerCellRender?: (...params: any) => React.ReactNode;
  headerCellComponent?: React.ComponentType<any>;
}>
const _componentColumn = memo(
  (props: IColumnProps) => {
    return React.createElement(NestedOption<IColumnProps>, { ...props });
  }
);

const Column: typeof _componentColumn & IElementDescriptor = Object.assign(_componentColumn, {
  OptionName: "columns",
  IsCollectionItem: true,
  DefaultsProps: {
    defaultFilterValue: "filterValue",
    defaultFilterValues: "filterValues",
    defaultGroupIndex: "groupIndex",
    defaultSelectedFilterOperation: "selectedFilterOperation",
    defaultSortIndex: "sortIndex",
    defaultSortOrder: "sortOrder",
    defaultVisible: "visible",
    defaultVisibleIndex: "visibleIndex"
  },
  ExpectedChildren: {
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
  },
  TemplateProps: [{
    tmplOption: "cellTemplate",
    render: "cellRender",
    component: "cellComponent"
  }, {
    tmplOption: "editCellTemplate",
    render: "editCellRender",
    component: "editCellComponent"
  }, {
    tmplOption: "groupCellTemplate",
    render: "groupCellRender",
    component: "groupCellComponent"
  }, {
    tmplOption: "headerCellTemplate",
    render: "headerCellRender",
    component: "headerCellComponent"
  }],
})

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
const _componentColumnChooser = memo(
  (props: IColumnChooserProps) => {
    return React.createElement(NestedOption<IColumnChooserProps>, { ...props });
  }
);

const ColumnChooser: typeof _componentColumnChooser & IElementDescriptor = Object.assign(_componentColumnChooser, {
  OptionName: "columnChooser",
  ExpectedChildren: {
    columnChooserSearch: { optionName: "search", isCollectionItem: false },
    columnChooserSelection: { optionName: "selection", isCollectionItem: false },
    position: { optionName: "position", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false },
    selection: { optionName: "selection", isCollectionItem: false }
  },
})

// owners:
// ColumnChooser
type IColumnChooserSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  timeout?: number;
}>
const _componentColumnChooserSearch = memo(
  (props: IColumnChooserSearchProps) => {
    return React.createElement(NestedOption<IColumnChooserSearchProps>, { ...props });
  }
);

const ColumnChooserSearch: typeof _componentColumnChooserSearch & IElementDescriptor = Object.assign(_componentColumnChooserSearch, {
  OptionName: "search",
})

// owners:
// ColumnChooser
type IColumnChooserSelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  recursive?: boolean;
  selectByClick?: boolean;
}>
const _componentColumnChooserSelection = memo(
  (props: IColumnChooserSelectionProps) => {
    return React.createElement(NestedOption<IColumnChooserSelectionProps>, { ...props });
  }
);

const ColumnChooserSelection: typeof _componentColumnChooserSelection & IElementDescriptor = Object.assign(_componentColumnChooserSelection, {
  OptionName: "selection",
})

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
const _componentColumnFixing = memo(
  (props: IColumnFixingProps) => {
    return React.createElement(NestedOption<IColumnFixingProps>, { ...props });
  }
);

const ColumnFixing: typeof _componentColumnFixing & IElementDescriptor = Object.assign(_componentColumnFixing, {
  OptionName: "columnFixing",
  ExpectedChildren: {
    columnFixingTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// ColumnFixing
type IColumnFixingTextsProps = React.PropsWithChildren<{
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  unfix?: string;
}>
const _componentColumnFixingTexts = memo(
  (props: IColumnFixingTextsProps) => {
    return React.createElement(NestedOption<IColumnFixingTextsProps>, { ...props });
  }
);

const ColumnFixingTexts: typeof _componentColumnFixingTexts & IElementDescriptor = Object.assign(_componentColumnFixingTexts, {
  OptionName: "texts",
})

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
const _componentColumnHeaderFilter = memo(
  (props: IColumnHeaderFilterProps) => {
    return React.createElement(NestedOption<IColumnHeaderFilterProps>, { ...props });
  }
);

const ColumnHeaderFilter: typeof _componentColumnHeaderFilter & IElementDescriptor = Object.assign(_componentColumnHeaderFilter, {
  OptionName: "headerFilter",
  ExpectedChildren: {
    columnHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false }
  },
})

// owners:
// ColumnHeaderFilter
type IColumnHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: "contains" | "startswith" | "equals";
  searchExpr?: Array<(() => any) | string> | (() => any) | string;
  timeout?: number;
}>
const _componentColumnHeaderFilterSearch = memo(
  (props: IColumnHeaderFilterSearchProps) => {
    return React.createElement(NestedOption<IColumnHeaderFilterSearchProps>, { ...props });
  }
);

const ColumnHeaderFilterSearch: typeof _componentColumnHeaderFilterSearch & IElementDescriptor = Object.assign(_componentColumnHeaderFilterSearch, {
  OptionName: "search",
})

// owners:
// Column
type IColumnLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  calculateCellValue?: ((rowData: any) => any);
  dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store;
  displayExpr?: ((data: any) => string) | string;
  valueExpr?: string;
}>
const _componentColumnLookup = memo(
  (props: IColumnLookupProps) => {
    return React.createElement(NestedOption<IColumnLookupProps>, { ...props });
  }
);

const ColumnLookup: typeof _componentColumnLookup & IElementDescriptor = Object.assign(_componentColumnLookup, {
  OptionName: "lookup",
})

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
const _componentCompareRule = memo(
  (props: ICompareRuleProps) => {
    return React.createElement(NestedOption<ICompareRuleProps>, { ...props });
  }
);

const CompareRule: typeof _componentCompareRule & IElementDescriptor = Object.assign(_componentCompareRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "compare"
  },
})

// owners:
// RowDragging
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentCursorOffset = memo(
  (props: ICursorOffsetProps) => {
    return React.createElement(NestedOption<ICursorOffsetProps>, { ...props });
  }
);

const CursorOffset: typeof _componentCursorOffset & IElementDescriptor = Object.assign(_componentCursorOffset, {
  OptionName: "cursorOffset",
})

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
}>
const _componentCustomOperation = memo(
  (props: ICustomOperationProps) => {
    return React.createElement(NestedOption<ICustomOperationProps>, { ...props });
  }
);

const CustomOperation: typeof _componentCustomOperation & IElementDescriptor = Object.assign(_componentCustomOperation, {
  OptionName: "customOperations",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent"
  }],
})

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
const _componentCustomRule = memo(
  (props: ICustomRuleProps) => {
    return React.createElement(NestedOption<ICustomRuleProps>, { ...props });
  }
);

const CustomRule: typeof _componentCustomRule & IElementDescriptor = Object.assign(_componentCustomRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "custom"
  },
})

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
const _componentDataGridHeaderFilter = memo(
  (props: IDataGridHeaderFilterProps) => {
    return React.createElement(NestedOption<IDataGridHeaderFilterProps>, { ...props });
  }
);

const DataGridHeaderFilter: typeof _componentDataGridHeaderFilter & IElementDescriptor = Object.assign(_componentDataGridHeaderFilter, {
  OptionName: "headerFilter",
  ExpectedChildren: {
    dataGridHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
    dataGridHeaderFilterTexts: { optionName: "texts", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// DataGridHeaderFilter
type IDataGridHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: "contains" | "startswith" | "equals";
  timeout?: number;
}>
const _componentDataGridHeaderFilterSearch = memo(
  (props: IDataGridHeaderFilterSearchProps) => {
    return React.createElement(NestedOption<IDataGridHeaderFilterSearchProps>, { ...props });
  }
);

const DataGridHeaderFilterSearch: typeof _componentDataGridHeaderFilterSearch & IElementDescriptor = Object.assign(_componentDataGridHeaderFilterSearch, {
  OptionName: "search",
})

// owners:
// DataGridHeaderFilter
type IDataGridHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
const _componentDataGridHeaderFilterTexts = memo(
  (props: IDataGridHeaderFilterTextsProps) => {
    return React.createElement(NestedOption<IDataGridHeaderFilterTextsProps>, { ...props });
  }
);

const DataGridHeaderFilterTexts: typeof _componentDataGridHeaderFilterTexts & IElementDescriptor = Object.assign(_componentDataGridHeaderFilterTexts, {
  OptionName: "texts",
})

// owners:
// DataGrid
type IDataGridSelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  caseSensitivity?: "base" | "accent" | "case" | "variant";
  deferred?: boolean;
  mode?: "single" | "multiple" | "none";
  selectAllMode?: "allPages" | "page";
  showCheckBoxesMode?: "always" | "none" | "onClick" | "onLongTap";
}>
const _componentDataGridSelection = memo(
  (props: IDataGridSelectionProps) => {
    return React.createElement(NestedOption<IDataGridSelectionProps>, { ...props });
  }
);

const DataGridSelection: typeof _componentDataGridSelection & IElementDescriptor = Object.assign(_componentDataGridSelection, {
  OptionName: "selection",
})

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
const _componentEditing = memo(
  (props: IEditingProps) => {
    return React.createElement(NestedOption<IEditingProps>, { ...props });
  }
);

const Editing: typeof _componentEditing & IElementDescriptor = Object.assign(_componentEditing, {
  OptionName: "editing",
  DefaultsProps: {
    defaultChanges: "changes",
    defaultEditColumnName: "editColumnName",
    defaultEditRowKey: "editRowKey"
  },
  ExpectedChildren: {
    change: { optionName: "changes", isCollectionItem: true },
    editingTexts: { optionName: "texts", isCollectionItem: false },
    form: { optionName: "form", isCollectionItem: false },
    popup: { optionName: "popup", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

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
const _componentEditingTexts = memo(
  (props: IEditingTextsProps) => {
    return React.createElement(NestedOption<IEditingTextsProps>, { ...props });
  }
);

const EditingTexts: typeof _componentEditingTexts & IElementDescriptor = Object.assign(_componentEditingTexts, {
  OptionName: "texts",
})

// owners:
// FormItem
// Column
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentEmailRule = memo(
  (props: IEmailRuleProps) => {
    return React.createElement(NestedOption<IEmailRuleProps>, { ...props });
  }
);

const EmailRule: typeof _componentEmailRule & IElementDescriptor = Object.assign(_componentEmailRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "email"
  },
})

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
const _componentExport = memo(
  (props: IExportProps) => {
    return React.createElement(NestedOption<IExportProps>, { ...props });
  }
);

const Export: typeof _componentExport & IElementDescriptor = Object.assign(_componentExport, {
  OptionName: "export",
  ExpectedChildren: {
    exportTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// Export
type IExportTextsProps = React.PropsWithChildren<{
  exportAll?: string;
  exportSelectedRows?: string;
  exportTo?: string;
}>
const _componentExportTexts = memo(
  (props: IExportTextsProps) => {
    return React.createElement(NestedOption<IExportTextsProps>, { ...props });
  }
);

const ExportTexts: typeof _componentExportTexts & IElementDescriptor = Object.assign(_componentExportTexts, {
  OptionName: "texts",
})

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
}>
const _componentField = memo(
  (props: IFieldProps) => {
    return React.createElement(NestedOption<IFieldProps>, { ...props });
  }
);

const Field: typeof _componentField & IElementDescriptor = Object.assign(_componentField, {
  OptionName: "fields",
  IsCollectionItem: true,
  ExpectedChildren: {
    fieldLookup: { optionName: "lookup", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    lookup: { optionName: "lookup", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "editorTemplate",
    render: "editorRender",
    component: "editorComponent"
  }],
})

// owners:
// Field
type IFieldLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  dataSource?: Array<any> | DataSourceOptions | Store;
  displayExpr?: ((data: any) => string) | string;
  valueExpr?: ((data: any) => string | number | boolean) | string;
}>
const _componentFieldLookup = memo(
  (props: IFieldLookupProps) => {
    return React.createElement(NestedOption<IFieldLookupProps>, { ...props });
  }
);

const FieldLookup: typeof _componentFieldLookup & IElementDescriptor = Object.assign(_componentFieldLookup, {
  OptionName: "lookup",
})

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
const _componentFilterBuilder = memo(
  (props: IFilterBuilderProps) => {
    return React.createElement(NestedOption<IFilterBuilderProps>, { ...props });
  }
);

const FilterBuilder: typeof _componentFilterBuilder & IElementDescriptor = Object.assign(_componentFilterBuilder, {
  OptionName: "filterBuilder",
  DefaultsProps: {
    defaultValue: "value"
  },
  ExpectedChildren: {
    customOperation: { optionName: "customOperations", isCollectionItem: true },
    field: { optionName: "fields", isCollectionItem: true },
    filterOperationDescriptions: { optionName: "filterOperationDescriptions", isCollectionItem: false },
    groupOperationDescriptions: { optionName: "groupOperationDescriptions", isCollectionItem: false }
  },
})

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
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
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
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
}>
const _componentFilterBuilderPopup = memo(
  (props: IFilterBuilderPopupProps) => {
    return React.createElement(NestedOption<IFilterBuilderPopupProps>, { ...props });
  }
);

const FilterBuilderPopup: typeof _componentFilterBuilderPopup & IElementDescriptor = Object.assign(_componentFilterBuilderPopup, {
  OptionName: "filterBuilderPopup",
  DefaultsProps: {
    defaultHeight: "height",
    defaultPosition: "position",
    defaultVisible: "visible",
    defaultWidth: "width"
  },
  TemplateProps: [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent"
  }, {
    tmplOption: "titleTemplate",
    render: "titleRender",
    component: "titleComponent"
  }],
})

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
const _componentFilterOperationDescriptions = memo(
  (props: IFilterOperationDescriptionsProps) => {
    return React.createElement(NestedOption<IFilterOperationDescriptionsProps>, { ...props });
  }
);

const FilterOperationDescriptions: typeof _componentFilterOperationDescriptions & IElementDescriptor = Object.assign(_componentFilterOperationDescriptions, {
  OptionName: "filterOperationDescriptions",
})

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
const _componentFilterPanel = memo(
  (props: IFilterPanelProps) => {
    return React.createElement(NestedOption<IFilterPanelProps>, { ...props });
  }
);

const FilterPanel: typeof _componentFilterPanel & IElementDescriptor = Object.assign(_componentFilterPanel, {
  OptionName: "filterPanel",
  DefaultsProps: {
    defaultFilterEnabled: "filterEnabled"
  },
  ExpectedChildren: {
    filterPanelTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// FilterPanel
type IFilterPanelTextsProps = React.PropsWithChildren<{
  clearFilter?: string;
  createFilter?: string;
  filterEnabledHint?: string;
}>
const _componentFilterPanelTexts = memo(
  (props: IFilterPanelTextsProps) => {
    return React.createElement(NestedOption<IFilterPanelTextsProps>, { ...props });
  }
);

const FilterPanelTexts: typeof _componentFilterPanelTexts & IElementDescriptor = Object.assign(_componentFilterPanelTexts, {
  OptionName: "texts",
})

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
const _componentFilterRow = memo(
  (props: IFilterRowProps) => {
    return React.createElement(NestedOption<IFilterRowProps>, { ...props });
  }
);

const FilterRow: typeof _componentFilterRow & IElementDescriptor = Object.assign(_componentFilterRow, {
  OptionName: "filterRow",
  ExpectedChildren: {
    operationDescriptions: { optionName: "operationDescriptions", isCollectionItem: false }
  },
})

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
const _componentForm = memo(
  (props: IFormProps) => {
    return React.createElement(NestedOption<IFormProps>, { ...props });
  }
);

const Form: typeof _componentForm & IElementDescriptor = Object.assign(_componentForm, {
  OptionName: "form",
  DefaultsProps: {
    defaultFormData: "formData"
  },
  ExpectedChildren: {
    colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
  },
})

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
const _componentFormat = memo(
  (props: IFormatProps) => {
    return React.createElement(NestedOption<IFormatProps>, { ...props });
  }
);

const Format: typeof _componentFormat & IElementDescriptor = Object.assign(_componentFormat, {
  OptionName: "format",
})

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
}>
const _componentFormItem = memo(
  (props: IFormItemProps) => {
    return React.createElement(NestedOption<IFormItemProps>, { ...props });
  }
);

const FormItem: typeof _componentFormItem & IElementDescriptor = Object.assign(_componentFormItem, {
  OptionName: "formItem",
  ExpectedChildren: {
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
  },
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// Hide
type IFromProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentFrom = memo(
  (props: IFromProps) => {
    return React.createElement(NestedOption<IFromProps>, { ...props });
  }
);

const From: typeof _componentFrom & IElementDescriptor = Object.assign(_componentFrom, {
  OptionName: "from",
  ExpectedChildren: {
    position: { optionName: "position", isCollectionItem: false }
  },
})

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
const _componentGrouping = memo(
  (props: IGroupingProps) => {
    return React.createElement(NestedOption<IGroupingProps>, { ...props });
  }
);

const Grouping: typeof _componentGrouping & IElementDescriptor = Object.assign(_componentGrouping, {
  OptionName: "grouping",
  ExpectedChildren: {
    groupingTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// Grouping
type IGroupingTextsProps = React.PropsWithChildren<{
  groupByThisColumn?: string;
  groupContinuedMessage?: string;
  groupContinuesMessage?: string;
  ungroup?: string;
  ungroupAll?: string;
}>
const _componentGroupingTexts = memo(
  (props: IGroupingTextsProps) => {
    return React.createElement(NestedOption<IGroupingTextsProps>, { ...props });
  }
);

const GroupingTexts: typeof _componentGroupingTexts & IElementDescriptor = Object.assign(_componentGroupingTexts, {
  OptionName: "texts",
})

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
const _componentGroupItem = memo(
  (props: IGroupItemProps) => {
    return React.createElement(NestedOption<IGroupItemProps>, { ...props });
  }
);

const GroupItem: typeof _componentGroupItem & IElementDescriptor = Object.assign(_componentGroupItem, {
  OptionName: "groupItems",
  IsCollectionItem: true,
  ExpectedChildren: {
    valueFormat: { optionName: "valueFormat", isCollectionItem: false }
  },
})

// owners:
// FilterBuilder
type IGroupOperationDescriptionsProps = React.PropsWithChildren<{
  and?: string;
  notAnd?: string;
  notOr?: string;
  or?: string;
}>
const _componentGroupOperationDescriptions = memo(
  (props: IGroupOperationDescriptionsProps) => {
    return React.createElement(NestedOption<IGroupOperationDescriptionsProps>, { ...props });
  }
);

const GroupOperationDescriptions: typeof _componentGroupOperationDescriptions & IElementDescriptor = Object.assign(_componentGroupOperationDescriptions, {
  OptionName: "groupOperationDescriptions",
})

// owners:
// DataGrid
type IGroupPanelProps = React.PropsWithChildren<{
  allowColumnDragging?: boolean;
  emptyPanelText?: string;
  visible?: boolean | "auto";
  defaultVisible?: boolean | "auto";
  onVisibleChange?: (value: boolean | "auto") => void;
}>
const _componentGroupPanel = memo(
  (props: IGroupPanelProps) => {
    return React.createElement(NestedOption<IGroupPanelProps>, { ...props });
  }
);

const GroupPanel: typeof _componentGroupPanel & IElementDescriptor = Object.assign(_componentGroupPanel, {
  OptionName: "groupPanel",
  DefaultsProps: {
    defaultVisible: "visible"
  },
})

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
const _componentHeaderFilter = memo(
  (props: IHeaderFilterProps) => {
    return React.createElement(NestedOption<IHeaderFilterProps>, { ...props });
  }
);

const HeaderFilter: typeof _componentHeaderFilter & IElementDescriptor = Object.assign(_componentHeaderFilter, {
  OptionName: "headerFilter",
})

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
const _componentHide = memo(
  (props: IHideProps) => {
    return React.createElement(NestedOption<IHideProps>, { ...props });
  }
);

const Hide: typeof _componentHide & IElementDescriptor = Object.assign(_componentHide, {
  OptionName: "hide",
  ExpectedChildren: {
    from: { optionName: "from", isCollectionItem: false },
    to: { optionName: "to", isCollectionItem: false }
  },
})

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
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentItem = memo(
  (props: IItemProps) => {
    return React.createElement(NestedOption<IItemProps>, { ...props });
  }
);

const Item: typeof _componentItem & IElementDescriptor = Object.assign(_componentItem, {
  OptionName: "items",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// DataGrid
type IKeyboardNavigationProps = React.PropsWithChildren<{
  editOnKeyPress?: boolean;
  enabled?: boolean;
  enterKeyAction?: "startEdit" | "moveFocus";
  enterKeyDirection?: "none" | "column" | "row";
}>
const _componentKeyboardNavigation = memo(
  (props: IKeyboardNavigationProps) => {
    return React.createElement(NestedOption<IKeyboardNavigationProps>, { ...props });
  }
);

const KeyboardNavigation: typeof _componentKeyboardNavigation & IElementDescriptor = Object.assign(_componentKeyboardNavigation, {
  OptionName: "keyboardNavigation",
})

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
}>
const _componentLabel = memo(
  (props: ILabelProps) => {
    return React.createElement(NestedOption<ILabelProps>, { ...props });
  }
);

const Label: typeof _componentLabel & IElementDescriptor = Object.assign(_componentLabel, {
  OptionName: "label",
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

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
const _componentLoadPanel = memo(
  (props: ILoadPanelProps) => {
    return React.createElement(NestedOption<ILoadPanelProps>, { ...props });
  }
);

const LoadPanel: typeof _componentLoadPanel & IElementDescriptor = Object.assign(_componentLoadPanel, {
  OptionName: "loadPanel",
})

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
const _componentLookup = memo(
  (props: ILookupProps) => {
    return React.createElement(NestedOption<ILookupProps>, { ...props });
  }
);

const Lookup: typeof _componentLookup & IElementDescriptor = Object.assign(_componentLookup, {
  OptionName: "lookup",
})

// owners:
// DataGrid
type IMasterDetailProps = React.PropsWithChildren<{
  autoExpandAll?: boolean;
  enabled?: boolean;
  template?: ((detailElement: any, detailInfo: { data: Record<string, any>, key: any, watch: (() => void) }) => any) | template;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentMasterDetail = memo(
  (props: IMasterDetailProps) => {
    return React.createElement(NestedOption<IMasterDetailProps>, { ...props });
  }
);

const MasterDetail: typeof _componentMasterDetail & IElementDescriptor = Object.assign(_componentMasterDetail, {
  OptionName: "masterDetail",
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: "center" | "left" | "right";
  y?: "bottom" | "center" | "top";
}>
const _componentMy = memo(
  (props: IMyProps) => {
    return React.createElement(NestedOption<IMyProps>, { ...props });
  }
);

const My: typeof _componentMy & IElementDescriptor = Object.assign(_componentMy, {
  OptionName: "my",
})

// owners:
// FormItem
// Column
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentNumericRule = memo(
  (props: INumericRuleProps) => {
    return React.createElement(NestedOption<INumericRuleProps>, { ...props });
  }
);

const NumericRule: typeof _componentNumericRule & IElementDescriptor = Object.assign(_componentNumericRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "numeric"
  },
})

// owners:
// Position
type IOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentOffset = memo(
  (props: IOffsetProps) => {
    return React.createElement(NestedOption<IOffsetProps>, { ...props });
  }
);

const Offset: typeof _componentOffset & IElementDescriptor = Object.assign(_componentOffset, {
  OptionName: "offset",
})

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
const _componentOperationDescriptions = memo(
  (props: IOperationDescriptionsProps) => {
    return React.createElement(NestedOption<IOperationDescriptionsProps>, { ...props });
  }
);

const OperationDescriptions: typeof _componentOperationDescriptions & IElementDescriptor = Object.assign(_componentOperationDescriptions, {
  OptionName: "operationDescriptions",
})

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
const _componentPager = memo(
  (props: IPagerProps) => {
    return React.createElement(NestedOption<IPagerProps>, { ...props });
  }
);

const Pager: typeof _componentPager & IElementDescriptor = Object.assign(_componentPager, {
  OptionName: "pager",
})

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
const _componentPaging = memo(
  (props: IPagingProps) => {
    return React.createElement(NestedOption<IPagingProps>, { ...props });
  }
);

const Paging: typeof _componentPaging & IElementDescriptor = Object.assign(_componentPaging, {
  OptionName: "paging",
  DefaultsProps: {
    defaultPageIndex: "pageIndex",
    defaultPageSize: "pageSize"
  },
})

// owners:
// FormItem
// Column
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: RegExp | string;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentPatternRule = memo(
  (props: IPatternRuleProps) => {
    return React.createElement(NestedOption<IPatternRuleProps>, { ...props });
  }
);

const PatternRule: typeof _componentPatternRule & IElementDescriptor = Object.assign(_componentPatternRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "pattern"
  },
})

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
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
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
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
}>
const _componentPopup = memo(
  (props: IPopupProps) => {
    return React.createElement(NestedOption<IPopupProps>, { ...props });
  }
);

const Popup: typeof _componentPopup & IElementDescriptor = Object.assign(_componentPopup, {
  OptionName: "popup",
  DefaultsProps: {
    defaultHeight: "height",
    defaultPosition: "position",
    defaultVisible: "visible",
    defaultWidth: "width"
  },
  ExpectedChildren: {
    animation: { optionName: "animation", isCollectionItem: false },
    position: { optionName: "position", isCollectionItem: false },
    toolbarItem: { optionName: "toolbarItems", isCollectionItem: true }
  },
  TemplateProps: [{
    tmplOption: "contentTemplate",
    render: "contentRender",
    component: "contentComponent"
  }, {
    tmplOption: "titleTemplate",
    render: "titleRender",
    component: "titleComponent"
  }],
})

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
const _componentPosition = memo(
  (props: IPositionProps) => {
    return React.createElement(NestedOption<IPositionProps>, { ...props });
  }
);

const Position: typeof _componentPosition & IElementDescriptor = Object.assign(_componentPosition, {
  OptionName: "position",
})

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
const _componentRangeRule = memo(
  (props: IRangeRuleProps) => {
    return React.createElement(NestedOption<IRangeRuleProps>, { ...props });
  }
);

const RangeRule: typeof _componentRangeRule & IElementDescriptor = Object.assign(_componentRangeRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "range"
  },
})

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
const _componentRemoteOperations = memo(
  (props: IRemoteOperationsProps) => {
    return React.createElement(NestedOption<IRemoteOperationsProps>, { ...props });
  }
);

const RemoteOperations: typeof _componentRemoteOperations & IElementDescriptor = Object.assign(_componentRemoteOperations, {
  OptionName: "remoteOperations",
})

// owners:
// FormItem
// Column
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: "required" | "numeric" | "range" | "stringLength" | "custom" | "compare" | "pattern" | "email" | "async";
}>
const _componentRequiredRule = memo(
  (props: IRequiredRuleProps) => {
    return React.createElement(NestedOption<IRequiredRuleProps>, { ...props });
  }
);

const RequiredRule: typeof _componentRequiredRule & IElementDescriptor = Object.assign(_componentRequiredRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "required"
  },
})

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
}>
const _componentRowDragging = memo(
  (props: IRowDraggingProps) => {
    return React.createElement(NestedOption<IRowDraggingProps>, { ...props });
  }
);

const RowDragging: typeof _componentRowDragging & IElementDescriptor = Object.assign(_componentRowDragging, {
  OptionName: "rowDragging",
  ExpectedChildren: {
    cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "dragTemplate",
    render: "dragRender",
    component: "dragComponent"
  }],
})

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
const _componentScrolling = memo(
  (props: IScrollingProps) => {
    return React.createElement(NestedOption<IScrollingProps>, { ...props });
  }
);

const Scrolling: typeof _componentScrolling & IElementDescriptor = Object.assign(_componentScrolling, {
  OptionName: "scrolling",
})

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
const _componentSearch = memo(
  (props: ISearchProps) => {
    return React.createElement(NestedOption<ISearchProps>, { ...props });
  }
);

const Search: typeof _componentSearch & IElementDescriptor = Object.assign(_componentSearch, {
  OptionName: "search",
})

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
const _componentSearchPanel = memo(
  (props: ISearchPanelProps) => {
    return React.createElement(NestedOption<ISearchPanelProps>, { ...props });
  }
);

const SearchPanel: typeof _componentSearchPanel & IElementDescriptor = Object.assign(_componentSearchPanel, {
  OptionName: "searchPanel",
  DefaultsProps: {
    defaultText: "text"
  },
})

// owners:
// DataGrid
// ColumnChooser
type ISelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  caseSensitivity?: "base" | "accent" | "case" | "variant";
  deferred?: boolean;
  mode?: "single" | "multiple" | "none";
  selectAllMode?: "allPages" | "page";
  showCheckBoxesMode?: "always" | "none" | "onClick" | "onLongTap";
  recursive?: boolean;
  selectByClick?: boolean;
}>
const _componentSelection = memo(
  (props: ISelectionProps) => {
    return React.createElement(NestedOption<ISelectionProps>, { ...props });
  }
);

const Selection: typeof _componentSelection & IElementDescriptor = Object.assign(_componentSelection, {
  OptionName: "selection",
})

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
const _componentShow = memo(
  (props: IShowProps) => {
    return React.createElement(NestedOption<IShowProps>, { ...props });
  }
);

const Show: typeof _componentShow & IElementDescriptor = Object.assign(_componentShow, {
  OptionName: "show",
})

// owners:
// DataGrid
type ISortByGroupSummaryInfoProps = React.PropsWithChildren<{
  groupColumn?: string;
  sortOrder?: "asc" | "desc";
  summaryItem?: number | string;
}>
const _componentSortByGroupSummaryInfo = memo(
  (props: ISortByGroupSummaryInfoProps) => {
    return React.createElement(NestedOption<ISortByGroupSummaryInfoProps>, { ...props });
  }
);

const SortByGroupSummaryInfo: typeof _componentSortByGroupSummaryInfo & IElementDescriptor = Object.assign(_componentSortByGroupSummaryInfo, {
  OptionName: "sortByGroupSummaryInfo",
  IsCollectionItem: true,
})

// owners:
// DataGrid
type ISortingProps = React.PropsWithChildren<{
  ascendingText?: string;
  clearText?: string;
  descendingText?: string;
  mode?: "single" | "multiple" | "none";
  showSortIndexes?: boolean;
}>
const _componentSorting = memo(
  (props: ISortingProps) => {
    return React.createElement(NestedOption<ISortingProps>, { ...props });
  }
);

const Sorting: typeof _componentSorting & IElementDescriptor = Object.assign(_componentSorting, {
  OptionName: "sorting",
})

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
const _componentStateStoring = memo(
  (props: IStateStoringProps) => {
    return React.createElement(NestedOption<IStateStoringProps>, { ...props });
  }
);

const StateStoring: typeof _componentStateStoring & IElementDescriptor = Object.assign(_componentStateStoring, {
  OptionName: "stateStoring",
})

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
const _componentStringLengthRule = memo(
  (props: IStringLengthRuleProps) => {
    return React.createElement(NestedOption<IStringLengthRuleProps>, { ...props });
  }
);

const StringLengthRule: typeof _componentStringLengthRule & IElementDescriptor = Object.assign(_componentStringLengthRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "stringLength"
  },
})

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
const _componentSummary = memo(
  (props: ISummaryProps) => {
    return React.createElement(NestedOption<ISummaryProps>, { ...props });
  }
);

const Summary: typeof _componentSummary & IElementDescriptor = Object.assign(_componentSummary, {
  OptionName: "summary",
  ExpectedChildren: {
    groupItem: { optionName: "groupItems", isCollectionItem: true },
    summaryTexts: { optionName: "texts", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false },
    totalItem: { optionName: "totalItems", isCollectionItem: true }
  },
})

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
const _componentSummaryTexts = memo(
  (props: ISummaryTextsProps) => {
    return React.createElement(NestedOption<ISummaryTextsProps>, { ...props });
  }
);

const SummaryTexts: typeof _componentSummaryTexts & IElementDescriptor = Object.assign(_componentSummaryTexts, {
  OptionName: "texts",
})

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
const _componentTexts = memo(
  (props: ITextsProps) => {
    return React.createElement(NestedOption<ITextsProps>, { ...props });
  }
);

const Texts: typeof _componentTexts & IElementDescriptor = Object.assign(_componentTexts, {
  OptionName: "texts",
})

// owners:
// Hide
type IToProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentTo = memo(
  (props: IToProps) => {
    return React.createElement(NestedOption<IToProps>, { ...props });
  }
);

const To: typeof _componentTo & IElementDescriptor = Object.assign(_componentTo, {
  OptionName: "to",
})

// owners:
// DataGrid
type IToolbarProps = React.PropsWithChildren<{
  disabled?: boolean;
  items?: Array<dxDataGridToolbarItem | "addRowButton" | "applyFilterButton" | "columnChooserButton" | "exportButton" | "groupPanel" | "revertButton" | "saveButton" | "searchPanel">;
  visible?: boolean;
}>
const _componentToolbar = memo(
  (props: IToolbarProps) => {
    return React.createElement(NestedOption<IToolbarProps>, { ...props });
  }
);

const Toolbar: typeof _componentToolbar & IElementDescriptor = Object.assign(_componentToolbar, {
  OptionName: "toolbar",
  ExpectedChildren: {
    item: { optionName: "items", isCollectionItem: true }
  },
})

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
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentToolbarItem = memo(
  (props: IToolbarItemProps) => {
    return React.createElement(NestedOption<IToolbarItemProps>, { ...props });
  }
);

const ToolbarItem: typeof _componentToolbarItem & IElementDescriptor = Object.assign(_componentToolbarItem, {
  OptionName: "toolbarItems",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

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
const _componentTotalItem = memo(
  (props: ITotalItemProps) => {
    return React.createElement(NestedOption<ITotalItemProps>, { ...props });
  }
);

const TotalItem: typeof _componentTotalItem & IElementDescriptor = Object.assign(_componentTotalItem, {
  OptionName: "totalItems",
  IsCollectionItem: true,
  ExpectedChildren: {
    valueFormat: { optionName: "valueFormat", isCollectionItem: false }
  },
})

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
const _componentValidationRule = memo(
  (props: IValidationRuleProps) => {
    return React.createElement(NestedOption<IValidationRuleProps>, { ...props });
  }
);

const ValidationRule: typeof _componentValidationRule & IElementDescriptor = Object.assign(_componentValidationRule, {
  OptionName: "validationRules",
  IsCollectionItem: true,
  PredefinedProps: {
    type: "required"
  },
})

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
const _componentValueFormat = memo(
  (props: IValueFormatProps) => {
    return React.createElement(NestedOption<IValueFormatProps>, { ...props });
  }
);

const ValueFormat: typeof _componentValueFormat & IElementDescriptor = Object.assign(_componentValueFormat, {
  OptionName: "valueFormat",
})

export default DataGrid;
export {
  DataGrid,
  IDataGridOptions,
  DataGridRef,
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

