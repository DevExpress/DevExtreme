"use client"
export { ExplicitTypes } from "devextreme/ui/data_grid";
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxDataGrid, {
    Properties
} from "devextreme/ui/data_grid";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { dxDataGridColumn, AdaptiveDetailRowPreparingEvent, CellClickEvent, CellDblClickEvent, CellPreparedEvent, ContentReadyEvent, ContextMenuPreparingEvent, DataErrorOccurredEvent, DisposingEvent, EditCanceledEvent, EditCancelingEvent, EditingStartEvent, EditorPreparedEvent, EditorPreparingEvent, ExportingEvent, FocusedCellChangingEvent, FocusedRowChangingEvent, InitializedEvent, InitNewRowEvent, KeyDownEvent, RowClickEvent, RowCollapsedEvent, RowCollapsingEvent, RowDblClickEvent, RowExpandedEvent, RowExpandingEvent, RowInsertedEvent, RowInsertingEvent, RowPreparedEvent, RowRemovedEvent, RowRemovingEvent, RowUpdatedEvent, RowUpdatingEvent, RowValidatingEvent, SavedEvent, SavingEvent, ToolbarPreparingEvent, dxDataGridRowObject, DataGridPredefinedColumnButton, ColumnButtonClickEvent, dxDataGridColumnButton, DataGridCommandColumnType, SelectionSensitivity, DataGridExportFormat, DataGridPredefinedToolbarItem, DataGridScrollMode, dxDataGridToolbarItem } from "devextreme/ui/data_grid";
import type { DataChange, DataChangeType, FilterOperation, FilterType, FixedPosition, HeaderFilterGroupInterval, ColumnHeaderFilterSearchConfig, SelectedFilterOperation, ColumnChooserMode, ColumnChooserSearchConfig, ColumnChooserSelectionConfig, HeaderFilterSearchConfig, SelectionColumnDisplayMode, GridsEditMode, NewRowPosition, GridsEditRefreshMode, StartEditAction, GridBase, ApplyFilterMode, GroupExpandMode, SummaryType, EnterKeyAction, EnterKeyDirection, PagerPageSize, DataRenderMode, StateStoreType } from "devextreme/common/grids";
import type { Mode, ValidationRuleType, HorizontalAlignment, VerticalAlignment, template, DataType, Format as CommonFormat, SearchMode, SortOrder, ComparisonOperator, SingleMultipleOrNone, SelectAllMode, PositionAlignment, Direction, ToolbarItemLocation, ToolbarItemComponent, DisplayMode, DragDirection, DragHighlight, ScrollbarMode } from "devextreme/common";
import type { ContentReadyEvent as FilterBuilderContentReadyEvent, DisposingEvent as FilterBuilderDisposingEvent, EditorPreparedEvent as FilterBuilderEditorPreparedEvent, EditorPreparingEvent as FilterBuilderEditorPreparingEvent, InitializedEvent as FilterBuilderInitializedEvent, dxFilterBuilderField, FilterBuilderOperation, dxFilterBuilderCustomOperation, GroupOperation, OptionChangedEvent, ValueChangedEvent } from "devextreme/ui/filter_builder";
import type { ContentReadyEvent as FormContentReadyEvent, DisposingEvent as FormDisposingEvent, InitializedEvent as FormInitializedEvent, dxFormSimpleItem, dxFormOptions, OptionChangedEvent as FormOptionChangedEvent, dxFormGroupItem, dxFormTabbedItem, dxFormEmptyItem, dxFormButtonItem, LabelLocation, FormLabelMode, EditorEnterKeyEvent, FieldDataChangedEvent, FormItemComponent, FormItemType } from "devextreme/ui/form";
import type { AnimationConfig, CollisionResolution, PositionConfig, AnimationState, AnimationType, CollisionResolutionCombination } from "devextreme/common/core/animation";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";
import type { dxPopupOptions, dxPopupToolbarItem, ToolbarLocation } from "devextreme/ui/popup";
import type { event } from "devextreme/events/events.types";
import type { EventInfo } from "devextreme/common/core/events";
import type { Component } from "devextreme/core/component";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";

import type dxOverlay from "devextreme/ui/overlay";
import type DOMComponent from "devextreme/core/dom_component";
import type dxPopup from "devextreme/ui/popup";
import type dxForm from "devextreme/ui/form";
import type dxSortable from "devextreme/ui/sortable";
import type dxDraggable from "devextreme/ui/draggable";

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
  defaultFocusedRowKey?: any | undefined;
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
  onFocusedRowKeyChange?: (value: any | undefined) => void;
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
const _componentAnimation = (props: IAnimationProps) => {
  return React.createElement(NestedOption<IAnimationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "animation",
      ExpectedChildren: {
        hide: { optionName: "hide", isCollectionItem: false },
        show: { optionName: "show", isCollectionItem: false }
      },
    },
  });
};

const Animation = Object.assign<typeof _componentAnimation, NestedComponentMeta>(_componentAnimation, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type IAsyncRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => any);
}>
const _componentAsyncRule = (props: IAsyncRuleProps) => {
  return React.createElement(NestedOption<IAsyncRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "async"
      },
    },
  });
};

const AsyncRule = Object.assign<typeof _componentAsyncRule, NestedComponentMeta>(_componentAsyncRule, {
  componentType: "option",
});

// owners:
// Position
type IAtProps = React.PropsWithChildren<{
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
}>
const _componentAt = (props: IAtProps) => {
  return React.createElement(NestedOption<IAtProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "at",
    },
  });
};

const At = Object.assign<typeof _componentAt, NestedComponentMeta>(_componentAt, {
  componentType: "option",
});

// owners:
// Position
type IBoundaryOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentBoundaryOffset = (props: IBoundaryOffsetProps) => {
  return React.createElement(NestedOption<IBoundaryOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "boundaryOffset",
    },
  });
};

const BoundaryOffset = Object.assign<typeof _componentBoundaryOffset, NestedComponentMeta>(_componentBoundaryOffset, {
  componentType: "option",
});

// owners:
// Column
type IButtonProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  hint?: string;
  icon?: string;
  name?: DataGridPredefinedColumnButton | string;
  onClick?: ((e: ColumnButtonClickEvent) => void);
  template?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, key: any, row: dxDataGridRowObject, rowIndex: number, rowType: string }) => string | any) | template;
  text?: string;
  visible?: boolean | ((options: { column: dxDataGridColumn, component: dxDataGrid, row: dxDataGridRowObject }) => boolean);
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentButton = (props: IButtonProps) => {
  return React.createElement(NestedOption<IButtonProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "buttons",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Button = Object.assign<typeof _componentButton, NestedComponentMeta>(_componentButton, {
  componentType: "option",
});

// owners:
// Editing
type IChangeProps = React.PropsWithChildren<{
  data?: any;
  insertAfterKey?: any;
  insertBeforeKey?: any;
  key?: any;
  type?: DataChangeType;
}>
const _componentChange = (props: IChangeProps) => {
  return React.createElement(NestedOption<IChangeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "changes",
      IsCollectionItem: true,
    },
  });
};

const Change = Object.assign<typeof _componentChange, NestedComponentMeta>(_componentChange, {
  componentType: "option",
});

// owners:
// Form
type IColCountByScreenProps = React.PropsWithChildren<{
  lg?: number | undefined;
  md?: number | undefined;
  sm?: number | undefined;
  xs?: number | undefined;
}>
const _componentColCountByScreen = (props: IColCountByScreenProps) => {
  return React.createElement(NestedOption<IColCountByScreenProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "colCountByScreen",
    },
  });
};

const ColCountByScreen = Object.assign<typeof _componentColCountByScreen, NestedComponentMeta>(_componentColCountByScreen, {
  componentType: "option",
});

// owners:
// Position
type ICollisionProps = React.PropsWithChildren<{
  x?: CollisionResolution;
  y?: CollisionResolution;
}>
const _componentCollision = (props: ICollisionProps) => {
  return React.createElement(NestedOption<ICollisionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "collision",
    },
  });
};

const Collision = Object.assign<typeof _componentCollision, NestedComponentMeta>(_componentCollision, {
  componentType: "option",
});

// owners:
// DataGrid
type IColumnProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment | undefined;
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
  buttons?: Array<DataGridPredefinedColumnButton | dxDataGridColumnButton>;
  calculateCellValue?: ((rowData: any) => any);
  calculateDisplayValue?: ((rowData: any) => any) | string;
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | (() => any) | Array<any>);
  calculateGroupValue?: ((rowData: any) => any) | string;
  calculateSortValue?: ((rowData: any) => any) | string;
  caption?: string | undefined;
  cellTemplate?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, displayValue: any, oldValue: any, row: dxDataGridRowObject, rowIndex: number, rowType: string, text: string, value: any, watch: (() => void) }) => any) | template;
  columns?: Array<dxDataGridColumn | string>;
  cssClass?: string | undefined;
  customizeText?: ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string);
  dataField?: string | undefined;
  dataType?: DataType | undefined;
  editCellTemplate?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, displayValue: any, row: dxDataGridRowObject, rowIndex: number, rowType: string, setValue(newValue, newText): any, text: string, value: any, watch: (() => void) }) => any) | template;
  editorOptions?: any;
  encodeHtml?: boolean;
  falseText?: string;
  filterOperations?: Array<FilterOperation | string>;
  filterType?: FilterType;
  filterValue?: any | undefined;
  filterValues?: Array<any>;
  fixed?: boolean;
  fixedPosition?: FixedPosition | undefined;
  format?: LocalizationFormat;
  formItem?: dxFormSimpleItem;
  groupCellTemplate?: ((cellElement: any, cellInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid, data: Record<string, any>, displayValue: any, groupContinuedMessage: string, groupContinuesMessage: string, row: dxDataGridRowObject, rowIndex: number, summaryItems: Array<any>, text: string, value: any }) => any) | template;
  groupIndex?: number | undefined;
  headerCellTemplate?: ((columnHeader: any, headerInfo: { column: dxDataGridColumn, columnIndex: number, component: dxDataGrid }) => any) | template;
  headerFilter?: Record<string, any> | {
    allowSearch?: boolean;
    allowSelectAll?: boolean;
    dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store | undefined;
    groupInterval?: HeaderFilterGroupInterval | number | undefined;
    height?: number | string | undefined;
    search?: ColumnHeaderFilterSearchConfig;
    searchMode?: SearchMode;
    width?: number | string | undefined;
  };
  hidingPriority?: number | undefined;
  isBand?: boolean | undefined;
  lookup?: Record<string, any> | {
    allowClearing?: boolean;
    calculateCellValue?: ((rowData: any) => any);
    dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store | undefined;
    displayExpr?: ((data: any) => string) | string | undefined;
    valueExpr?: string | undefined;
  };
  minWidth?: number | undefined;
  name?: string | undefined;
  ownerBand?: number | undefined;
  renderAsync?: boolean;
  selectedFilterOperation?: SelectedFilterOperation | undefined;
  setCellValue?: ((newData: any, value: any, currentRowData: any) => any);
  showEditorAlways?: boolean;
  showInColumnChooser?: boolean;
  showWhenGrouped?: boolean;
  sortIndex?: number | undefined;
  sortingMethod?: ((value1: any, value2: any) => number) | undefined;
  sortOrder?: SortOrder | undefined;
  trueText?: string;
  type?: DataGridCommandColumnType;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number | undefined;
  width?: number | string | undefined;
  defaultFilterValue?: any | undefined;
  onFilterValueChange?: (value: any | undefined) => void;
  defaultFilterValues?: Array<any>;
  onFilterValuesChange?: (value: Array<any>) => void;
  defaultGroupIndex?: number | undefined;
  onGroupIndexChange?: (value: number | undefined) => void;
  defaultSelectedFilterOperation?: SelectedFilterOperation | undefined;
  onSelectedFilterOperationChange?: (value: SelectedFilterOperation | undefined) => void;
  defaultSortIndex?: number | undefined;
  onSortIndexChange?: (value: number | undefined) => void;
  defaultSortOrder?: SortOrder | undefined;
  onSortOrderChange?: (value: SortOrder | undefined) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultVisibleIndex?: number | undefined;
  onVisibleIndexChange?: (value: number | undefined) => void;
  cellRender?: (...params: any) => React.ReactNode;
  cellComponent?: React.ComponentType<any>;
  editCellRender?: (...params: any) => React.ReactNode;
  editCellComponent?: React.ComponentType<any>;
  groupCellRender?: (...params: any) => React.ReactNode;
  groupCellComponent?: React.ComponentType<any>;
  headerCellRender?: (...params: any) => React.ReactNode;
  headerCellComponent?: React.ComponentType<any>;
}>
const _componentColumn = (props: IColumnProps) => {
  return React.createElement(NestedOption<IColumnProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Column = Object.assign<typeof _componentColumn, NestedComponentMeta>(_componentColumn, {
  componentType: "option",
});

// owners:
// DataGrid
type IColumnChooserProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  container?: any | string | undefined;
  emptyPanelText?: string;
  enabled?: boolean;
  height?: number | string;
  mode?: ColumnChooserMode;
  position?: PositionConfig | undefined;
  search?: ColumnChooserSearchConfig;
  searchTimeout?: number;
  selection?: ColumnChooserSelectionConfig;
  sortOrder?: SortOrder | undefined;
  title?: string;
  width?: number | string;
}>
const _componentColumnChooser = (props: IColumnChooserProps) => {
  return React.createElement(NestedOption<IColumnChooserProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "columnChooser",
      ExpectedChildren: {
        columnChooserSearch: { optionName: "search", isCollectionItem: false },
        columnChooserSelection: { optionName: "selection", isCollectionItem: false },
        position: { optionName: "position", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false },
        selection: { optionName: "selection", isCollectionItem: false }
      },
    },
  });
};

const ColumnChooser = Object.assign<typeof _componentColumnChooser, NestedComponentMeta>(_componentColumnChooser, {
  componentType: "option",
});

// owners:
// ColumnChooser
type IColumnChooserSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  timeout?: number;
}>
const _componentColumnChooserSearch = (props: IColumnChooserSearchProps) => {
  return React.createElement(NestedOption<IColumnChooserSearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const ColumnChooserSearch = Object.assign<typeof _componentColumnChooserSearch, NestedComponentMeta>(_componentColumnChooserSearch, {
  componentType: "option",
});

// owners:
// ColumnChooser
type IColumnChooserSelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  recursive?: boolean;
  selectByClick?: boolean;
}>
const _componentColumnChooserSelection = (props: IColumnChooserSelectionProps) => {
  return React.createElement(NestedOption<IColumnChooserSelectionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selection",
    },
  });
};

const ColumnChooserSelection = Object.assign<typeof _componentColumnChooserSelection, NestedComponentMeta>(_componentColumnChooserSelection, {
  componentType: "option",
});

// owners:
// DataGrid
type IColumnFixingProps = React.PropsWithChildren<{
  enabled?: boolean;
  icons?: Record<string, any> | {
    fix?: string;
    leftPosition?: string;
    rightPosition?: string;
    stickyPosition?: string;
    unfix?: string;
  };
  texts?: Record<string, any> | {
    fix?: string;
    leftPosition?: string;
    rightPosition?: string;
    stickyPosition?: string;
    unfix?: string;
  };
}>
const _componentColumnFixing = (props: IColumnFixingProps) => {
  return React.createElement(NestedOption<IColumnFixingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "columnFixing",
      ExpectedChildren: {
        columnFixingTexts: { optionName: "texts", isCollectionItem: false },
        icons: { optionName: "icons", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const ColumnFixing = Object.assign<typeof _componentColumnFixing, NestedComponentMeta>(_componentColumnFixing, {
  componentType: "option",
});

// owners:
// ColumnFixing
type IColumnFixingTextsProps = React.PropsWithChildren<{
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  stickyPosition?: string;
  unfix?: string;
}>
const _componentColumnFixingTexts = (props: IColumnFixingTextsProps) => {
  return React.createElement(NestedOption<IColumnFixingTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const ColumnFixingTexts = Object.assign<typeof _componentColumnFixingTexts, NestedComponentMeta>(_componentColumnFixingTexts, {
  componentType: "option",
});

// owners:
// Column
type IColumnHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store | undefined;
  groupInterval?: HeaderFilterGroupInterval | number | undefined;
  height?: number | string | undefined;
  search?: ColumnHeaderFilterSearchConfig;
  searchMode?: SearchMode;
  width?: number | string | undefined;
}>
const _componentColumnHeaderFilter = (props: IColumnHeaderFilterProps) => {
  return React.createElement(NestedOption<IColumnHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        columnHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false }
      },
    },
  });
};

const ColumnHeaderFilter = Object.assign<typeof _componentColumnHeaderFilter, NestedComponentMeta>(_componentColumnHeaderFilter, {
  componentType: "option",
});

// owners:
// ColumnHeaderFilter
type IColumnHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  searchExpr?: Array<(() => any) | string> | (() => any) | string | undefined;
  timeout?: number;
}>
const _componentColumnHeaderFilterSearch = (props: IColumnHeaderFilterSearchProps) => {
  return React.createElement(NestedOption<IColumnHeaderFilterSearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const ColumnHeaderFilterSearch = Object.assign<typeof _componentColumnHeaderFilterSearch, NestedComponentMeta>(_componentColumnHeaderFilterSearch, {
  componentType: "option",
});

// owners:
// Column
type IColumnLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  calculateCellValue?: ((rowData: any) => any);
  dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store | undefined;
  displayExpr?: ((data: any) => string) | string | undefined;
  valueExpr?: string | undefined;
}>
const _componentColumnLookup = (props: IColumnLookupProps) => {
  return React.createElement(NestedOption<IColumnLookupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "lookup",
    },
  });
};

const ColumnLookup = Object.assign<typeof _componentColumnLookup, NestedComponentMeta>(_componentColumnLookup, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type ICompareRuleProps = React.PropsWithChildren<{
  comparisonTarget?: (() => any);
  comparisonType?: ComparisonOperator;
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentCompareRule = (props: ICompareRuleProps) => {
  return React.createElement(NestedOption<ICompareRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "compare"
      },
    },
  });
};

const CompareRule = Object.assign<typeof _componentCompareRule, NestedComponentMeta>(_componentCompareRule, {
  componentType: "option",
});

// owners:
// RowDragging
type ICursorOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentCursorOffset = (props: ICursorOffsetProps) => {
  return React.createElement(NestedOption<ICursorOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "cursorOffset",
    },
  });
};

const CursorOffset = Object.assign<typeof _componentCursorOffset, NestedComponentMeta>(_componentCursorOffset, {
  componentType: "option",
});

// owners:
// FilterBuilder
type ICustomOperationProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | (() => any) | Array<any>);
  caption?: string | undefined;
  customizeText?: ((fieldInfo: { field: dxFilterBuilderField, value: string | number | Date, valueText: string }) => string);
  dataTypes?: Array<DataType> | undefined;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template;
  hasValue?: boolean;
  icon?: string | undefined;
  name?: string | undefined;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
}>
const _componentCustomOperation = (props: ICustomOperationProps) => {
  return React.createElement(NestedOption<ICustomOperationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "customOperations",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "editorTemplate",
        render: "editorRender",
        component: "editorComponent"
      }],
    },
  });
};

const CustomOperation = Object.assign<typeof _componentCustomOperation, NestedComponentMeta>(_componentCustomOperation, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type ICustomRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
}>
const _componentCustomRule = (props: ICustomRuleProps) => {
  return React.createElement(NestedOption<ICustomRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "custom"
      },
    },
  });
};

const CustomRule = Object.assign<typeof _componentCustomRule, NestedComponentMeta>(_componentCustomRule, {
  componentType: "option",
});

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
const _componentDataGridHeaderFilter = (props: IDataGridHeaderFilterProps) => {
  return React.createElement(NestedOption<IDataGridHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        dataGridHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        dataGridHeaderFilterTexts: { optionName: "texts", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const DataGridHeaderFilter = Object.assign<typeof _componentDataGridHeaderFilter, NestedComponentMeta>(_componentDataGridHeaderFilter, {
  componentType: "option",
});

// owners:
// DataGridHeaderFilter
type IDataGridHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  timeout?: number;
}>
const _componentDataGridHeaderFilterSearch = (props: IDataGridHeaderFilterSearchProps) => {
  return React.createElement(NestedOption<IDataGridHeaderFilterSearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const DataGridHeaderFilterSearch = Object.assign<typeof _componentDataGridHeaderFilterSearch, NestedComponentMeta>(_componentDataGridHeaderFilterSearch, {
  componentType: "option",
});

// owners:
// DataGridHeaderFilter
type IDataGridHeaderFilterTextsProps = React.PropsWithChildren<{
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
const _componentDataGridHeaderFilterTexts = (props: IDataGridHeaderFilterTextsProps) => {
  return React.createElement(NestedOption<IDataGridHeaderFilterTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const DataGridHeaderFilterTexts = Object.assign<typeof _componentDataGridHeaderFilterTexts, NestedComponentMeta>(_componentDataGridHeaderFilterTexts, {
  componentType: "option",
});

// owners:
// DataGrid
type IDataGridSelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  deferred?: boolean;
  mode?: SingleMultipleOrNone;
  selectAllMode?: SelectAllMode;
  sensitivity?: SelectionSensitivity;
  showCheckBoxesMode?: SelectionColumnDisplayMode;
}>
const _componentDataGridSelection = (props: IDataGridSelectionProps) => {
  return React.createElement(NestedOption<IDataGridSelectionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selection",
    },
  });
};

const DataGridSelection = Object.assign<typeof _componentDataGridSelection, NestedComponentMeta>(_componentDataGridSelection, {
  componentType: "option",
});

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
  mode?: GridsEditMode;
  newRowPosition?: NewRowPosition;
  popup?: dxPopupOptions<any>;
  refreshMode?: GridsEditRefreshMode;
  selectTextOnEditStart?: boolean;
  startEditAction?: StartEditAction;
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
const _componentEditing = (props: IEditingProps) => {
  return React.createElement(NestedOption<IEditingProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Editing = Object.assign<typeof _componentEditing, NestedComponentMeta>(_componentEditing, {
  componentType: "option",
});

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
const _componentEditingTexts = (props: IEditingTextsProps) => {
  return React.createElement(NestedOption<IEditingTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const EditingTexts = Object.assign<typeof _componentEditingTexts, NestedComponentMeta>(_componentEditingTexts, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type IEmailRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentEmailRule = (props: IEmailRuleProps) => {
  return React.createElement(NestedOption<IEmailRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "email"
      },
    },
  });
};

const EmailRule = Object.assign<typeof _componentEmailRule, NestedComponentMeta>(_componentEmailRule, {
  componentType: "option",
});

// owners:
// DataGrid
type IExportProps = React.PropsWithChildren<{
  allowExportSelectedData?: boolean;
  enabled?: boolean;
  formats?: Array<DataGridExportFormat | string>;
  texts?: Record<string, any> | {
    exportAll?: string;
    exportSelectedRows?: string;
    exportTo?: string;
  };
}>
const _componentExport = (props: IExportProps) => {
  return React.createElement(NestedOption<IExportProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "export",
      ExpectedChildren: {
        exportTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const Export = Object.assign<typeof _componentExport, NestedComponentMeta>(_componentExport, {
  componentType: "option",
});

// owners:
// Export
type IExportTextsProps = React.PropsWithChildren<{
  exportAll?: string;
  exportSelectedRows?: string;
  exportTo?: string;
}>
const _componentExportTexts = (props: IExportTextsProps) => {
  return React.createElement(NestedOption<IExportTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const ExportTexts = Object.assign<typeof _componentExportTexts, NestedComponentMeta>(_componentExportTexts, {
  componentType: "option",
});

// owners:
// FilterBuilder
type IFieldProps = React.PropsWithChildren<{
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | (() => any) | Array<any>);
  caption?: string | undefined;
  customizeText?: ((fieldInfo: { value: string | number | Date, valueText: string }) => string);
  dataField?: string | undefined;
  dataType?: DataType;
  editorOptions?: any;
  editorTemplate?: ((conditionInfo: { field: dxFilterBuilderField, filterOperation: string, setValue: (() => void), value: string | number | Date }, container: any) => string | any) | template;
  falseText?: string;
  filterOperations?: Array<FilterBuilderOperation | string>;
  format?: LocalizationFormat;
  lookup?: Record<string, any> | {
    allowClearing?: boolean;
    dataSource?: Array<any> | DataSourceOptions | Store | undefined;
    displayExpr?: ((data: any) => string) | string | undefined;
    valueExpr?: ((data: any) => string | number | boolean) | string | undefined;
  };
  name?: string | undefined;
  trueText?: string;
  editorRender?: (...params: any) => React.ReactNode;
  editorComponent?: React.ComponentType<any>;
}>
const _componentField = (props: IFieldProps) => {
  return React.createElement(NestedOption<IFieldProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Field = Object.assign<typeof _componentField, NestedComponentMeta>(_componentField, {
  componentType: "option",
});

// owners:
// Field
type IFieldLookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  dataSource?: Array<any> | DataSourceOptions | Store | undefined;
  displayExpr?: ((data: any) => string) | string | undefined;
  valueExpr?: ((data: any) => string | number | boolean) | string | undefined;
}>
const _componentFieldLookup = (props: IFieldLookupProps) => {
  return React.createElement(NestedOption<IFieldLookupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "lookup",
    },
  });
};

const FieldLookup = Object.assign<typeof _componentFieldLookup, NestedComponentMeta>(_componentFieldLookup, {
  componentType: "option",
});

// owners:
// DataGrid
type IFilterBuilderProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
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
  groupOperations?: Array<GroupOperation>;
  height?: (() => number | string) | number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  maxGroupLevel?: number | undefined;
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
  width?: (() => number | string) | number | string | undefined;
  defaultValue?: Array<any> | (() => any) | string;
  onValueChange?: (value: Array<any> | (() => any) | string) => void;
}>
const _componentFilterBuilder = (props: IFilterBuilderProps) => {
  return React.createElement(NestedOption<IFilterBuilderProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const FilterBuilder = Object.assign<typeof _componentFilterBuilder, NestedComponentMeta>(_componentFilterBuilder, {
  componentType: "option",
});

// owners:
// DataGrid
type IFilterBuilderPopupProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string | undefined;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string | undefined;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: (() => number | string) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string | undefined;
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
  position?: (() => void) | PositionAlignment | PositionConfig;
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
  defaultPosition?: (() => void) | PositionAlignment | PositionConfig;
  onPositionChange?: (value: (() => void) | PositionAlignment | PositionConfig) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number | string) | number | string;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
}>
const _componentFilterBuilderPopup = (props: IFilterBuilderPopupProps) => {
  return React.createElement(NestedOption<IFilterBuilderPopupProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const FilterBuilderPopup = Object.assign<typeof _componentFilterBuilderPopup, NestedComponentMeta>(_componentFilterBuilderPopup, {
  componentType: "option",
});

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
const _componentFilterOperationDescriptions = (props: IFilterOperationDescriptionsProps) => {
  return React.createElement(NestedOption<IFilterOperationDescriptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "filterOperationDescriptions",
    },
  });
};

const FilterOperationDescriptions = Object.assign<typeof _componentFilterOperationDescriptions, NestedComponentMeta>(_componentFilterOperationDescriptions, {
  componentType: "option",
});

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
const _componentFilterPanel = (props: IFilterPanelProps) => {
  return React.createElement(NestedOption<IFilterPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "filterPanel",
      DefaultsProps: {
        defaultFilterEnabled: "filterEnabled"
      },
      ExpectedChildren: {
        filterPanelTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const FilterPanel = Object.assign<typeof _componentFilterPanel, NestedComponentMeta>(_componentFilterPanel, {
  componentType: "option",
});

// owners:
// FilterPanel
type IFilterPanelTextsProps = React.PropsWithChildren<{
  clearFilter?: string;
  createFilter?: string;
  filterEnabledHint?: string;
}>
const _componentFilterPanelTexts = (props: IFilterPanelTextsProps) => {
  return React.createElement(NestedOption<IFilterPanelTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const FilterPanelTexts = Object.assign<typeof _componentFilterPanelTexts, NestedComponentMeta>(_componentFilterPanelTexts, {
  componentType: "option",
});

// owners:
// DataGrid
type IFilterRowProps = React.PropsWithChildren<{
  applyFilter?: ApplyFilterMode;
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
const _componentFilterRow = (props: IFilterRowProps) => {
  return React.createElement(NestedOption<IFilterRowProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "filterRow",
      ExpectedChildren: {
        operationDescriptions: { optionName: "operationDescriptions", isCollectionItem: false }
      },
    },
  });
};

const FilterRow = Object.assign<typeof _componentFilterRow, NestedComponentMeta>(_componentFilterRow, {
  componentType: "option",
});

// owners:
// Editing
type IFormProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  alignItemLabels?: boolean;
  alignItemLabelsInAllGroups?: boolean;
  bindingOptions?: Record<string, any>;
  colCount?: Mode | number;
  colCountByScreen?: Record<string, any> | {
    lg?: number | undefined;
    md?: number | undefined;
    sm?: number | undefined;
    xs?: number | undefined;
  };
  customizeItem?: ((item: dxFormSimpleItem | dxFormGroupItem | dxFormTabbedItem | dxFormEmptyItem | dxFormButtonItem) => void);
  disabled?: boolean;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  formData?: any;
  height?: (() => number | string) | number | string | undefined;
  hint?: string | undefined;
  hoverStateEnabled?: boolean;
  isDirty?: boolean;
  items?: Array<dxFormButtonItem | dxFormEmptyItem | dxFormGroupItem | dxFormSimpleItem | dxFormTabbedItem>;
  labelLocation?: LabelLocation;
  labelMode?: FormLabelMode;
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
  validationGroup?: string | undefined;
  visible?: boolean;
  width?: (() => number | string) | number | string | undefined;
  defaultFormData?: any;
  onFormDataChange?: (value: any) => void;
}>
const _componentForm = (props: IFormProps) => {
  return React.createElement(NestedOption<IFormProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "form",
      DefaultsProps: {
        defaultFormData: "formData"
      },
      ExpectedChildren: {
        colCountByScreen: { optionName: "colCountByScreen", isCollectionItem: false }
      },
    },
  });
};

const Form = Object.assign<typeof _componentForm, NestedComponentMeta>(_componentForm, {
  componentType: "option",
});

// owners:
// Column
// Field
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: CommonFormat | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentFormat = (props: IFormatProps) => {
  return React.createElement(NestedOption<IFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "format",
    },
  });
};

const Format = Object.assign<typeof _componentFormat, NestedComponentMeta>(_componentFormat, {
  componentType: "option",
});

// owners:
// Column
type IFormItemProps = React.PropsWithChildren<{
  colSpan?: number | undefined;
  cssClass?: string | undefined;
  dataField?: string | undefined;
  editorOptions?: any | undefined;
  editorType?: FormItemComponent;
  helpText?: string | undefined;
  isRequired?: boolean | undefined;
  itemType?: FormItemType;
  label?: Record<string, any> | {
    alignment?: HorizontalAlignment;
    location?: LabelLocation;
    showColon?: boolean;
    template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
    text?: string | undefined;
    visible?: boolean;
  };
  name?: string | undefined;
  template?: ((data: { component: dxForm, dataField: string, editorOptions: Record<string, any>, editorType: string, name: string }, itemElement: any) => string | any) | template;
  validationRules?: Array<CommonTypes.ValidationRule>;
  visible?: boolean;
  visibleIndex?: number | undefined;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentFormItem = (props: IFormItemProps) => {
  return React.createElement(NestedOption<IFormItemProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const FormItem = Object.assign<typeof _componentFormItem, NestedComponentMeta>(_componentFormItem, {
  componentType: "option",
});

// owners:
// Hide
type IFromProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentFrom = (props: IFromProps) => {
  return React.createElement(NestedOption<IFromProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "from",
      ExpectedChildren: {
        position: { optionName: "position", isCollectionItem: false }
      },
    },
  });
};

const From = Object.assign<typeof _componentFrom, NestedComponentMeta>(_componentFrom, {
  componentType: "option",
});

// owners:
// DataGrid
type IGroupingProps = React.PropsWithChildren<{
  allowCollapsing?: boolean;
  autoExpandAll?: boolean;
  contextMenuEnabled?: boolean;
  expandMode?: GroupExpandMode;
  texts?: Record<string, any> | {
    groupByThisColumn?: string;
    groupContinuedMessage?: string;
    groupContinuesMessage?: string;
    ungroup?: string;
    ungroupAll?: string;
  };
}>
const _componentGrouping = (props: IGroupingProps) => {
  return React.createElement(NestedOption<IGroupingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "grouping",
      ExpectedChildren: {
        groupingTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const Grouping = Object.assign<typeof _componentGrouping, NestedComponentMeta>(_componentGrouping, {
  componentType: "option",
});

// owners:
// Grouping
type IGroupingTextsProps = React.PropsWithChildren<{
  groupByThisColumn?: string;
  groupContinuedMessage?: string;
  groupContinuesMessage?: string;
  ungroup?: string;
  ungroupAll?: string;
}>
const _componentGroupingTexts = (props: IGroupingTextsProps) => {
  return React.createElement(NestedOption<IGroupingTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const GroupingTexts = Object.assign<typeof _componentGroupingTexts, NestedComponentMeta>(_componentGroupingTexts, {
  componentType: "option",
});

// owners:
// Summary
type IGroupItemProps = React.PropsWithChildren<{
  alignByColumn?: boolean;
  column?: string | undefined;
  customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
  displayFormat?: string | undefined;
  name?: string | undefined;
  showInColumn?: string | undefined;
  showInGroupFooter?: boolean;
  skipEmptyValues?: boolean;
  summaryType?: string | SummaryType | undefined;
  valueFormat?: LocalizationFormat | undefined;
}>
const _componentGroupItem = (props: IGroupItemProps) => {
  return React.createElement(NestedOption<IGroupItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "groupItems",
      IsCollectionItem: true,
      ExpectedChildren: {
        valueFormat: { optionName: "valueFormat", isCollectionItem: false }
      },
    },
  });
};

const GroupItem = Object.assign<typeof _componentGroupItem, NestedComponentMeta>(_componentGroupItem, {
  componentType: "option",
});

// owners:
// FilterBuilder
type IGroupOperationDescriptionsProps = React.PropsWithChildren<{
  and?: string;
  notAnd?: string;
  notOr?: string;
  or?: string;
}>
const _componentGroupOperationDescriptions = (props: IGroupOperationDescriptionsProps) => {
  return React.createElement(NestedOption<IGroupOperationDescriptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "groupOperationDescriptions",
    },
  });
};

const GroupOperationDescriptions = Object.assign<typeof _componentGroupOperationDescriptions, NestedComponentMeta>(_componentGroupOperationDescriptions, {
  componentType: "option",
});

// owners:
// DataGrid
type IGroupPanelProps = React.PropsWithChildren<{
  allowColumnDragging?: boolean;
  emptyPanelText?: string;
  visible?: boolean | Mode;
  defaultVisible?: boolean | Mode;
  onVisibleChange?: (value: boolean | Mode) => void;
}>
const _componentGroupPanel = (props: IGroupPanelProps) => {
  return React.createElement(NestedOption<IGroupPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "groupPanel",
      DefaultsProps: {
        defaultVisible: "visible"
      },
    },
  });
};

const GroupPanel = Object.assign<typeof _componentGroupPanel, NestedComponentMeta>(_componentGroupPanel, {
  componentType: "option",
});

// owners:
// Column
// DataGrid
type IHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store | undefined;
  groupInterval?: HeaderFilterGroupInterval | number | undefined;
  height?: number | string | undefined;
  search?: ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig;
  searchMode?: SearchMode;
  width?: number | string | undefined;
  searchTimeout?: number;
  texts?: Record<string, any> | {
    cancel?: string;
    emptyValue?: string;
    ok?: string;
  };
  visible?: boolean;
}>
const _componentHeaderFilter = (props: IHeaderFilterProps) => {
  return React.createElement(NestedOption<IHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        columnHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        dataGridHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        dataGridHeaderFilterTexts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const HeaderFilter = Object.assign<typeof _componentHeaderFilter, NestedComponentMeta>(_componentHeaderFilter, {
  componentType: "option",
});

// owners:
// Animation
type IHideProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: Direction | undefined;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number | undefined;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
}>
const _componentHide = (props: IHideProps) => {
  return React.createElement(NestedOption<IHideProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "hide",
      ExpectedChildren: {
        from: { optionName: "from", isCollectionItem: false },
        to: { optionName: "to", isCollectionItem: false }
      },
    },
  });
};

const Hide = Object.assign<typeof _componentHide, NestedComponentMeta>(_componentHide, {
  componentType: "option",
});

// owners:
// ColumnFixing
type IIconsProps = React.PropsWithChildren<{
  fix?: string;
  leftPosition?: string;
  rightPosition?: string;
  stickyPosition?: string;
  unfix?: string;
}>
const _componentIcons = (props: IIconsProps) => {
  return React.createElement(NestedOption<IIconsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "icons",
    },
  });
};

const Icons = Object.assign<typeof _componentIcons, NestedComponentMeta>(_componentIcons, {
  componentType: "option",
});

// owners:
// Toolbar
type IItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: DataGridPredefinedToolbarItem | string;
  options?: any;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// DataGrid
type IKeyboardNavigationProps = React.PropsWithChildren<{
  editOnKeyPress?: boolean;
  enabled?: boolean;
  enterKeyAction?: EnterKeyAction;
  enterKeyDirection?: EnterKeyDirection;
}>
const _componentKeyboardNavigation = (props: IKeyboardNavigationProps) => {
  return React.createElement(NestedOption<IKeyboardNavigationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "keyboardNavigation",
    },
  });
};

const KeyboardNavigation = Object.assign<typeof _componentKeyboardNavigation, NestedComponentMeta>(_componentKeyboardNavigation, {
  componentType: "option",
});

// owners:
// FormItem
type ILabelProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  location?: LabelLocation;
  showColon?: boolean;
  template?: ((itemData: { component: dxForm, dataField: string, editorOptions: any, editorType: string, name: string, text: string }, itemElement: any) => string | any) | template;
  text?: string | undefined;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentLabel = (props: ILabelProps) => {
  return React.createElement(NestedOption<ILabelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "label",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const Label = Object.assign<typeof _componentLabel, NestedComponentMeta>(_componentLabel, {
  componentType: "option",
});

// owners:
// DataGrid
type ILoadPanelProps = React.PropsWithChildren<{
  enabled?: boolean | Mode;
  height?: number | string;
  indicatorSrc?: string;
  shading?: boolean;
  shadingColor?: string;
  showIndicator?: boolean;
  showPane?: boolean;
  text?: string;
  width?: number | string;
}>
const _componentLoadPanel = (props: ILoadPanelProps) => {
  return React.createElement(NestedOption<ILoadPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "loadPanel",
    },
  });
};

const LoadPanel = Object.assign<typeof _componentLoadPanel, NestedComponentMeta>(_componentLoadPanel, {
  componentType: "option",
});

// owners:
// Column
// Field
type ILookupProps = React.PropsWithChildren<{
  allowClearing?: boolean;
  calculateCellValue?: ((rowData: any) => any);
  dataSource?: Array<any> | DataSourceOptions | ((options: { data: Record<string, any>, key: any }) => Array<any> | Store | DataSourceOptions) | null | Store | undefined;
  displayExpr?: ((data: any) => string) | string | undefined;
  valueExpr?: string | undefined | ((data: any) => string | number | boolean);
}>
const _componentLookup = (props: ILookupProps) => {
  return React.createElement(NestedOption<ILookupProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "lookup",
    },
  });
};

const Lookup = Object.assign<typeof _componentLookup, NestedComponentMeta>(_componentLookup, {
  componentType: "option",
});

// owners:
// DataGrid
type IMasterDetailProps = React.PropsWithChildren<{
  autoExpandAll?: boolean;
  enabled?: boolean;
  template?: ((detailElement: any, detailInfo: { data: Record<string, any>, key: any, watch: (() => void) }) => any) | template;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentMasterDetail = (props: IMasterDetailProps) => {
  return React.createElement(NestedOption<IMasterDetailProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "masterDetail",
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const MasterDetail = Object.assign<typeof _componentMasterDetail, NestedComponentMeta>(_componentMasterDetail, {
  componentType: "option",
});

// owners:
// Position
type IMyProps = React.PropsWithChildren<{
  x?: HorizontalAlignment;
  y?: VerticalAlignment;
}>
const _componentMy = (props: IMyProps) => {
  return React.createElement(NestedOption<IMyProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "my",
    },
  });
};

const My = Object.assign<typeof _componentMy, NestedComponentMeta>(_componentMy, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type INumericRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  type?: ValidationRuleType;
}>
const _componentNumericRule = (props: INumericRuleProps) => {
  return React.createElement(NestedOption<INumericRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "numeric"
      },
    },
  });
};

const NumericRule = Object.assign<typeof _componentNumericRule, NestedComponentMeta>(_componentNumericRule, {
  componentType: "option",
});

// owners:
// Position
type IOffsetProps = React.PropsWithChildren<{
  x?: number;
  y?: number;
}>
const _componentOffset = (props: IOffsetProps) => {
  return React.createElement(NestedOption<IOffsetProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "offset",
    },
  });
};

const Offset = Object.assign<typeof _componentOffset, NestedComponentMeta>(_componentOffset, {
  componentType: "option",
});

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
const _componentOperationDescriptions = (props: IOperationDescriptionsProps) => {
  return React.createElement(NestedOption<IOperationDescriptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "operationDescriptions",
    },
  });
};

const OperationDescriptions = Object.assign<typeof _componentOperationDescriptions, NestedComponentMeta>(_componentOperationDescriptions, {
  componentType: "option",
});

// owners:
// DataGrid
type IPagerProps = React.PropsWithChildren<{
  allowedPageSizes?: Array<number | PagerPageSize> | Mode;
  displayMode?: DisplayMode;
  infoText?: string;
  label?: string;
  showInfo?: boolean;
  showNavigationButtons?: boolean;
  showPageSizeSelector?: boolean;
  visible?: boolean | Mode;
}>
const _componentPager = (props: IPagerProps) => {
  return React.createElement(NestedOption<IPagerProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "pager",
    },
  });
};

const Pager = Object.assign<typeof _componentPager, NestedComponentMeta>(_componentPager, {
  componentType: "option",
});

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
const _componentPaging = (props: IPagingProps) => {
  return React.createElement(NestedOption<IPagingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "paging",
      DefaultsProps: {
        defaultPageIndex: "pageIndex",
        defaultPageSize: "pageSize"
      },
    },
  });
};

const Paging = Object.assign<typeof _componentPaging, NestedComponentMeta>(_componentPaging, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type IPatternRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  message?: string;
  pattern?: RegExp | string;
  type?: ValidationRuleType;
}>
const _componentPatternRule = (props: IPatternRuleProps) => {
  return React.createElement(NestedOption<IPatternRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "pattern"
      },
    },
  });
};

const PatternRule = Object.assign<typeof _componentPatternRule, NestedComponentMeta>(_componentPatternRule, {
  componentType: "option",
});

// owners:
// Editing
type IPopupProps = React.PropsWithChildren<{
  accessKey?: string | undefined;
  animation?: Record<string, any> | {
    hide?: AnimationConfig;
    show?: AnimationConfig;
  };
  bindingOptions?: Record<string, any>;
  closeOnOutsideClick?: boolean | ((event: event) => boolean);
  container?: any | string | undefined;
  contentTemplate?: ((contentElement: any) => string | any) | template;
  deferRendering?: boolean;
  disabled?: boolean;
  dragAndResizeArea?: any | string | undefined;
  dragEnabled?: boolean;
  dragOutsideBoundary?: boolean;
  enableBodyScroll?: boolean;
  focusStateEnabled?: boolean;
  fullScreen?: boolean;
  height?: (() => number | string) | number | string;
  hideOnOutsideClick?: boolean | ((event: event) => boolean);
  hideOnParentScroll?: boolean;
  hint?: string | undefined;
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
  position?: (() => void) | PositionAlignment | PositionConfig;
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
  defaultPosition?: (() => void) | PositionAlignment | PositionConfig;
  onPositionChange?: (value: (() => void) | PositionAlignment | PositionConfig) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultWidth?: (() => number | string) | number | string;
  onWidthChange?: (value: (() => number | string) | number | string) => void;
  contentRender?: (...params: any) => React.ReactNode;
  contentComponent?: React.ComponentType<any>;
  titleRender?: (...params: any) => React.ReactNode;
  titleComponent?: React.ComponentType<any>;
}>
const _componentPopup = (props: IPopupProps) => {
  return React.createElement(NestedOption<IPopupProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Popup = Object.assign<typeof _componentPopup, NestedComponentMeta>(_componentPopup, {
  componentType: "option",
});

// owners:
// From
// Popup
// ColumnChooser
type IPositionProps = React.PropsWithChildren<{
  at?: Record<string, any> | PositionAlignment | {
    x?: HorizontalAlignment;
    y?: VerticalAlignment;
  };
  boundary?: any | string;
  boundaryOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  collision?: CollisionResolutionCombination | Record<string, any> | {
    x?: CollisionResolution;
    y?: CollisionResolution;
  };
  my?: Record<string, any> | PositionAlignment | {
    x?: HorizontalAlignment;
    y?: VerticalAlignment;
  };
  of?: any | string;
  offset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
}>
const _componentPosition = (props: IPositionProps) => {
  return React.createElement(NestedOption<IPositionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "position",
    },
  });
};

const Position = Object.assign<typeof _componentPosition, NestedComponentMeta>(_componentPosition, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type IRangeRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  message?: string;
  min?: Date | number | string;
  reevaluate?: boolean;
  type?: ValidationRuleType;
}>
const _componentRangeRule = (props: IRangeRuleProps) => {
  return React.createElement(NestedOption<IRangeRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "range"
      },
    },
  });
};

const RangeRule = Object.assign<typeof _componentRangeRule, NestedComponentMeta>(_componentRangeRule, {
  componentType: "option",
});

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
const _componentRemoteOperations = (props: IRemoteOperationsProps) => {
  return React.createElement(NestedOption<IRemoteOperationsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "remoteOperations",
    },
  });
};

const RemoteOperations = Object.assign<typeof _componentRemoteOperations, NestedComponentMeta>(_componentRemoteOperations, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type IRequiredRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: ValidationRuleType;
}>
const _componentRequiredRule = (props: IRequiredRuleProps) => {
  return React.createElement(NestedOption<IRequiredRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "required"
      },
    },
  });
};

const RequiredRule = Object.assign<typeof _componentRequiredRule, NestedComponentMeta>(_componentRequiredRule, {
  componentType: "option",
});

// owners:
// DataGrid
type IRowDraggingProps = React.PropsWithChildren<{
  allowDropInsideItem?: boolean;
  allowReordering?: boolean;
  autoScroll?: boolean;
  boundary?: any | string | undefined;
  container?: any | string | undefined;
  cursorOffset?: Record<string, any> | string | {
    x?: number;
    y?: number;
  };
  data?: any | undefined;
  dragDirection?: DragDirection;
  dragTemplate?: ((dragInfo: { itemData: any, itemElement: any }, containerElement: any) => string | any) | template | undefined;
  dropFeedbackMode?: DragHighlight;
  filter?: string;
  group?: string | undefined;
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
const _componentRowDragging = (props: IRowDraggingProps) => {
  return React.createElement(NestedOption<IRowDraggingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "rowDragging",
      ExpectedChildren: {
        cursorOffset: { optionName: "cursorOffset", isCollectionItem: false }
      },
      TemplateProps: [{
        tmplOption: "dragTemplate",
        render: "dragRender",
        component: "dragComponent"
      }],
    },
  });
};

const RowDragging = Object.assign<typeof _componentRowDragging, NestedComponentMeta>(_componentRowDragging, {
  componentType: "option",
});

// owners:
// DataGrid
type IScrollingProps = React.PropsWithChildren<{
  columnRenderingMode?: DataRenderMode;
  mode?: DataGridScrollMode;
  preloadEnabled?: boolean;
  renderAsync?: boolean | undefined;
  rowRenderingMode?: DataRenderMode;
  scrollByContent?: boolean;
  scrollByThumb?: boolean;
  showScrollbar?: ScrollbarMode;
  useNative?: boolean | Mode;
}>
const _componentScrolling = (props: IScrollingProps) => {
  return React.createElement(NestedOption<IScrollingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "scrolling",
    },
  });
};

const Scrolling = Object.assign<typeof _componentScrolling, NestedComponentMeta>(_componentScrolling, {
  componentType: "option",
});

// owners:
// ColumnHeaderFilter
// ColumnChooser
// DataGridHeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  searchExpr?: Array<(() => any) | string> | (() => any) | string | undefined;
  timeout?: number;
}>
const _componentSearch = (props: ISearchProps) => {
  return React.createElement(NestedOption<ISearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const Search = Object.assign<typeof _componentSearch, NestedComponentMeta>(_componentSearch, {
  componentType: "option",
});

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
const _componentSearchPanel = (props: ISearchPanelProps) => {
  return React.createElement(NestedOption<ISearchPanelProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "searchPanel",
      DefaultsProps: {
        defaultText: "text"
      },
    },
  });
};

const SearchPanel = Object.assign<typeof _componentSearchPanel, NestedComponentMeta>(_componentSearchPanel, {
  componentType: "option",
});

// owners:
// DataGrid
// ColumnChooser
type ISelectionProps = React.PropsWithChildren<{
  allowSelectAll?: boolean;
  deferred?: boolean;
  mode?: SingleMultipleOrNone;
  selectAllMode?: SelectAllMode;
  sensitivity?: SelectionSensitivity;
  showCheckBoxesMode?: SelectionColumnDisplayMode;
  recursive?: boolean;
  selectByClick?: boolean;
}>
const _componentSelection = (props: ISelectionProps) => {
  return React.createElement(NestedOption<ISelectionProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "selection",
    },
  });
};

const Selection = Object.assign<typeof _componentSelection, NestedComponentMeta>(_componentSelection, {
  componentType: "option",
});

// owners:
// Animation
type IShowProps = React.PropsWithChildren<{
  complete?: (($element: any, config: AnimationConfig) => void);
  delay?: number;
  direction?: Direction | undefined;
  duration?: number;
  easing?: string;
  from?: AnimationState;
  staggerDelay?: number | undefined;
  start?: (($element: any, config: AnimationConfig) => void);
  to?: AnimationState;
  type?: AnimationType;
}>
const _componentShow = (props: IShowProps) => {
  return React.createElement(NestedOption<IShowProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "show",
    },
  });
};

const Show = Object.assign<typeof _componentShow, NestedComponentMeta>(_componentShow, {
  componentType: "option",
});

// owners:
// DataGrid
type ISortByGroupSummaryInfoProps = React.PropsWithChildren<{
  groupColumn?: string | undefined;
  sortOrder?: SortOrder | undefined;
  summaryItem?: number | string | undefined;
}>
const _componentSortByGroupSummaryInfo = (props: ISortByGroupSummaryInfoProps) => {
  return React.createElement(NestedOption<ISortByGroupSummaryInfoProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "sortByGroupSummaryInfo",
      IsCollectionItem: true,
    },
  });
};

const SortByGroupSummaryInfo = Object.assign<typeof _componentSortByGroupSummaryInfo, NestedComponentMeta>(_componentSortByGroupSummaryInfo, {
  componentType: "option",
});

// owners:
// DataGrid
type ISortingProps = React.PropsWithChildren<{
  ascendingText?: string;
  clearText?: string;
  descendingText?: string;
  mode?: SingleMultipleOrNone;
  showSortIndexes?: boolean;
}>
const _componentSorting = (props: ISortingProps) => {
  return React.createElement(NestedOption<ISortingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "sorting",
    },
  });
};

const Sorting = Object.assign<typeof _componentSorting, NestedComponentMeta>(_componentSorting, {
  componentType: "option",
});

// owners:
// DataGrid
type IStateStoringProps = React.PropsWithChildren<{
  customLoad?: (() => any);
  customSave?: ((gridState: any) => void);
  enabled?: boolean;
  savingTimeout?: number;
  storageKey?: string;
  type?: StateStoreType;
}>
const _componentStateStoring = (props: IStateStoringProps) => {
  return React.createElement(NestedOption<IStateStoringProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "stateStoring",
    },
  });
};

const StateStoring = Object.assign<typeof _componentStateStoring, NestedComponentMeta>(_componentStateStoring, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type IStringLengthRuleProps = React.PropsWithChildren<{
  ignoreEmptyValue?: boolean;
  max?: number;
  message?: string;
  min?: number;
  trim?: boolean;
  type?: ValidationRuleType;
}>
const _componentStringLengthRule = (props: IStringLengthRuleProps) => {
  return React.createElement(NestedOption<IStringLengthRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "stringLength"
      },
    },
  });
};

const StringLengthRule = Object.assign<typeof _componentStringLengthRule, NestedComponentMeta>(_componentStringLengthRule, {
  componentType: "option",
});

// owners:
// DataGrid
type ISummaryProps = React.PropsWithChildren<{
  calculateCustomSummary?: ((options: { component: dxDataGrid, groupIndex: number, name: string, summaryProcess: string, totalValue: any, value: any }) => void);
  groupItems?: Array<Record<string, any>> | {
    alignByColumn?: boolean;
    column?: string | undefined;
    customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
    displayFormat?: string | undefined;
    name?: string | undefined;
    showInColumn?: string | undefined;
    showInGroupFooter?: boolean;
    skipEmptyValues?: boolean;
    summaryType?: string | SummaryType | undefined;
    valueFormat?: LocalizationFormat | undefined;
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
    alignment?: HorizontalAlignment | undefined;
    column?: string | undefined;
    cssClass?: string | undefined;
    customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
    displayFormat?: string | undefined;
    name?: string | undefined;
    showInColumn?: string | undefined;
    skipEmptyValues?: boolean;
    summaryType?: string | SummaryType | undefined;
    valueFormat?: LocalizationFormat | undefined;
  }[];
}>
const _componentSummary = (props: ISummaryProps) => {
  return React.createElement(NestedOption<ISummaryProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "summary",
      ExpectedChildren: {
        groupItem: { optionName: "groupItems", isCollectionItem: true },
        summaryTexts: { optionName: "texts", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false },
        totalItem: { optionName: "totalItems", isCollectionItem: true }
      },
    },
  });
};

const Summary = Object.assign<typeof _componentSummary, NestedComponentMeta>(_componentSummary, {
  componentType: "option",
});

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
const _componentSummaryTexts = (props: ISummaryTextsProps) => {
  return React.createElement(NestedOption<ISummaryTextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const SummaryTexts = Object.assign<typeof _componentSummaryTexts, NestedComponentMeta>(_componentSummaryTexts, {
  componentType: "option",
});

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
  stickyPosition?: string;
  unfix?: string;
  clearFilter?: string;
  createFilter?: string;
  filterEnabledHint?: string;
  cancel?: string;
  emptyValue?: string;
  ok?: string;
}>
const _componentTexts = (props: ITextsProps) => {
  return React.createElement(NestedOption<ITextsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "texts",
    },
  });
};

const Texts = Object.assign<typeof _componentTexts, NestedComponentMeta>(_componentTexts, {
  componentType: "option",
});

// owners:
// Hide
type IToProps = React.PropsWithChildren<{
  left?: number;
  opacity?: number;
  position?: PositionConfig;
  scale?: number;
  top?: number;
}>
const _componentTo = (props: IToProps) => {
  return React.createElement(NestedOption<IToProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "to",
    },
  });
};

const To = Object.assign<typeof _componentTo, NestedComponentMeta>(_componentTo, {
  componentType: "option",
});

// owners:
// DataGrid
type IToolbarProps = React.PropsWithChildren<{
  disabled?: boolean;
  items?: Array<DataGridPredefinedToolbarItem | dxDataGridToolbarItem>;
  visible?: boolean | undefined;
}>
const _componentToolbar = (props: IToolbarProps) => {
  return React.createElement(NestedOption<IToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbar",
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Toolbar = Object.assign<typeof _componentToolbar, NestedComponentMeta>(_componentToolbar, {
  componentType: "option",
});

// owners:
// Popup
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  toolbar?: ToolbarLocation;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentToolbarItem = (props: IToolbarItemProps) => {
  return React.createElement(NestedOption<IToolbarItemProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const ToolbarItem = Object.assign<typeof _componentToolbarItem, NestedComponentMeta>(_componentToolbarItem, {
  componentType: "option",
});

// owners:
// Summary
type ITotalItemProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment | undefined;
  column?: string | undefined;
  cssClass?: string | undefined;
  customizeText?: ((itemInfo: { value: string | number | Date, valueText: string }) => string);
  displayFormat?: string | undefined;
  name?: string | undefined;
  showInColumn?: string | undefined;
  skipEmptyValues?: boolean;
  summaryType?: string | SummaryType | undefined;
  valueFormat?: LocalizationFormat | undefined;
}>
const _componentTotalItem = (props: ITotalItemProps) => {
  return React.createElement(NestedOption<ITotalItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "totalItems",
      IsCollectionItem: true,
      ExpectedChildren: {
        valueFormat: { optionName: "valueFormat", isCollectionItem: false }
      },
    },
  });
};

const TotalItem = Object.assign<typeof _componentTotalItem, NestedComponentMeta>(_componentTotalItem, {
  componentType: "option",
});

// owners:
// FormItem
// Column
type IValidationRuleProps = React.PropsWithChildren<{
  message?: string;
  trim?: boolean;
  type?: ValidationRuleType;
  ignoreEmptyValue?: boolean;
  max?: Date | number | string;
  min?: Date | number | string;
  reevaluate?: boolean;
  validationCallback?: ((options: { column: Record<string, any>, data: Record<string, any>, formItem: Record<string, any>, rule: Record<string, any>, validator: Record<string, any>, value: string | number }) => boolean);
  comparisonTarget?: (() => any);
  comparisonType?: ComparisonOperator;
  pattern?: RegExp | string;
}>
const _componentValidationRule = (props: IValidationRuleProps) => {
  return React.createElement(NestedOption<IValidationRuleProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validationRules",
      IsCollectionItem: true,
      PredefinedProps: {
        type: "required"
      },
    },
  });
};

const ValidationRule = Object.assign<typeof _componentValidationRule, NestedComponentMeta>(_componentValidationRule, {
  componentType: "option",
});

// owners:
// GroupItem
// TotalItem
type IValueFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: CommonFormat | string;
  useCurrencyAccountingStyle?: boolean;
}>
const _componentValueFormat = (props: IValueFormatProps) => {
  return React.createElement(NestedOption<IValueFormatProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "valueFormat",
    },
  });
};

const ValueFormat = Object.assign<typeof _componentValueFormat, NestedComponentMeta>(_componentValueFormat, {
  componentType: "option",
});

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
  Icons,
  IIconsProps,
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

