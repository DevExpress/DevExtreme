"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxGantt, {
    Properties
} from "devextreme/ui/gantt";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, ContextMenuPreparingEvent, CustomCommandEvent, DependencyDeletedEvent, DependencyDeletingEvent, DependencyInsertedEvent, DependencyInsertingEvent, DisposingEvent, InitializedEvent, ResourceAssignedEvent, ResourceAssigningEvent, ResourceDeletedEvent, ResourceDeletingEvent, ResourceInsertedEvent, ResourceInsertingEvent, ResourceManagerDialogShowingEvent, ResourceUnassignedEvent, ResourceUnassigningEvent, ScaleCellPreparedEvent, TaskClickEvent, TaskDblClickEvent, TaskDeletedEvent, TaskDeletingEvent, TaskEditDialogShowingEvent, TaskInsertedEvent, TaskInsertingEvent, TaskMovingEvent, TaskUpdatedEvent, TaskUpdatingEvent, dxGanttContextMenuItem, GanttPredefinedContextMenuItem, dxGanttFilterRowOperationDescriptions, dxGanttHeaderFilterTexts, GanttPredefinedToolbarItem, GanttScaleType, dxGanttToolbarItem } from "devextreme/ui/gantt";
import type { HorizontalAlignment, DataType, SearchMode, SortOrder, ToolbarItemLocation, ToolbarItemComponent, SingleMultipleOrNone } from "devextreme/common";
import type { dxTreeListColumn, dxTreeListRowObject } from "devextreme/ui/tree_list";
import type { template } from "devextreme/core/templates/template";
import type { FilterOperation, FilterType, HeaderFilterGroupInterval, ColumnHeaderFilterSearchConfig, SelectedFilterOperation, HeaderFilterSearchConfig } from "devextreme/common/grids";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";
import type { dxContextMenuItem } from "devextreme/ui/context_menu";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";

import type dxTreeList from "devextreme/ui/tree_list";
import type DataSource from "devextreme/data/data_source";

import type * as LocalizationTypes from "devextreme/localization";
import type * as LocalizationTypes from "devextreme/common";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IGanttOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
  onCustomCommand?: ((e: CustomCommandEvent) => void);
  onDependencyDeleted?: ((e: DependencyDeletedEvent) => void);
  onDependencyDeleting?: ((e: DependencyDeletingEvent) => void);
  onDependencyInserted?: ((e: DependencyInsertedEvent) => void);
  onDependencyInserting?: ((e: DependencyInsertingEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onResourceAssigned?: ((e: ResourceAssignedEvent) => void);
  onResourceAssigning?: ((e: ResourceAssigningEvent) => void);
  onResourceDeleted?: ((e: ResourceDeletedEvent) => void);
  onResourceDeleting?: ((e: ResourceDeletingEvent) => void);
  onResourceInserted?: ((e: ResourceInsertedEvent) => void);
  onResourceInserting?: ((e: ResourceInsertingEvent) => void);
  onResourceManagerDialogShowing?: ((e: ResourceManagerDialogShowingEvent) => void);
  onResourceUnassigned?: ((e: ResourceUnassignedEvent) => void);
  onResourceUnassigning?: ((e: ResourceUnassigningEvent) => void);
  onScaleCellPrepared?: ((e: ScaleCellPreparedEvent) => void);
  onTaskClick?: ((e: TaskClickEvent) => void);
  onTaskDblClick?: ((e: TaskDblClickEvent) => void);
  onTaskDeleted?: ((e: TaskDeletedEvent) => void);
  onTaskDeleting?: ((e: TaskDeletingEvent) => void);
  onTaskEditDialogShowing?: ((e: TaskEditDialogShowingEvent) => void);
  onTaskInserted?: ((e: TaskInsertedEvent) => void);
  onTaskInserting?: ((e: TaskInsertingEvent) => void);
  onTaskMoving?: ((e: TaskMovingEvent) => void);
  onTaskUpdated?: ((e: TaskUpdatedEvent) => void);
  onTaskUpdating?: ((e: TaskUpdatingEvent) => void);
}

type IGanttOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IGanttOptionsNarrowedEvents> & IHtmlOptions & {
  taskContentRender?: (...params: any) => React.ReactNode;
  taskContentComponent?: React.ComponentType<any>;
  taskProgressTooltipContentRender?: (...params: any) => React.ReactNode;
  taskProgressTooltipContentComponent?: React.ComponentType<any>;
  taskTimeTooltipContentRender?: (...params: any) => React.ReactNode;
  taskTimeTooltipContentComponent?: React.ComponentType<any>;
  taskTooltipContentRender?: (...params: any) => React.ReactNode;
  taskTooltipContentComponent?: React.ComponentType<any>;
}>

interface GanttRef {
  instance: () => dxGantt;
}

const Gantt = memo(
  forwardRef(
    (props: React.PropsWithChildren<IGanttOptions>, ref: ForwardedRef<GanttRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onContentReady","onContextMenuPreparing","onCustomCommand","onDependencyDeleted","onDependencyDeleting","onDependencyInserted","onDependencyInserting","onDisposing","onInitialized","onResourceAssigned","onResourceAssigning","onResourceDeleted","onResourceDeleting","onResourceInserted","onResourceInserting","onResourceManagerDialogShowing","onResourceUnassigned","onResourceUnassigning","onScaleCellPrepared","onTaskClick","onTaskDblClick","onTaskDeleted","onTaskDeleting","onTaskEditDialogShowing","onTaskInserted","onTaskInserting","onTaskMoving","onTaskUpdated","onTaskUpdating"]), []);

      const expectedChildren = useMemo(() => ({
        column: { optionName: "columns", isCollectionItem: true },
        contextMenu: { optionName: "contextMenu", isCollectionItem: false },
        dependencies: { optionName: "dependencies", isCollectionItem: false },
        editing: { optionName: "editing", isCollectionItem: false },
        filterRow: { optionName: "filterRow", isCollectionItem: false },
        ganttHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
        headerFilter: { optionName: "headerFilter", isCollectionItem: false },
        resourceAssignments: { optionName: "resourceAssignments", isCollectionItem: false },
        resources: { optionName: "resources", isCollectionItem: false },
        scaleTypeRange: { optionName: "scaleTypeRange", isCollectionItem: false },
        sorting: { optionName: "sorting", isCollectionItem: false },
        stripLine: { optionName: "stripLines", isCollectionItem: true },
        tasks: { optionName: "tasks", isCollectionItem: false },
        toolbar: { optionName: "toolbar", isCollectionItem: false },
        validation: { optionName: "validation", isCollectionItem: false }
      }), []);

      const templateProps = useMemo(() => ([
        {
          tmplOption: "taskContentTemplate",
          render: "taskContentRender",
          component: "taskContentComponent"
        },
        {
          tmplOption: "taskProgressTooltipContentTemplate",
          render: "taskProgressTooltipContentRender",
          component: "taskProgressTooltipContentComponent"
        },
        {
          tmplOption: "taskTimeTooltipContentTemplate",
          render: "taskTimeTooltipContentRender",
          component: "taskTimeTooltipContentComponent"
        },
        {
          tmplOption: "taskTooltipContentTemplate",
          render: "taskTooltipContentRender",
          component: "taskTooltipContentComponent"
        },
      ]), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IGanttOptions>>, {
          WidgetClass: dxGantt,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          templateProps,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IGanttOptions> & { ref?: Ref<GanttRef> }) => ReactElement | null;


// owners:
// Gantt
type IColumnProps = React.PropsWithChildren<{
  alignment?: HorizontalAlignment;
  allowFiltering?: boolean;
  allowHeaderFiltering?: boolean;
  allowSorting?: boolean;
  calculateCellValue?: ((rowData: any) => any);
  calculateDisplayValue?: ((rowData: any) => any) | string;
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | (() => any) | Array<any>);
  calculateSortValue?: ((rowData: any) => any) | string;
  caption?: string;
  cellTemplate?: ((cellElement: any, cellInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList, data: Record<string, any>, displayValue: any, oldValue: any, row: dxTreeListRowObject, rowIndex: number, rowType: string, text: string, value: any, watch: (() => void) }) => any) | template;
  cssClass?: string;
  customizeText?: ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string);
  dataField?: string;
  dataType?: DataType;
  encodeHtml?: boolean;
  falseText?: string;
  filterOperations?: Array<FilterOperation | string>;
  filterType?: FilterType;
  filterValue?: any;
  filterValues?: Array<any>;
  format?: LocalizationTypes.Format;
  headerCellTemplate?: ((columnHeader: any, headerInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList }) => any) | template;
  headerFilter?: Record<string, any> | {
    allowSearch?: boolean;
    allowSelectAll?: boolean;
    dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store;
    groupInterval?: HeaderFilterGroupInterval | number;
    height?: number | string;
    search?: ColumnHeaderFilterSearchConfig;
    searchMode?: SearchMode;
    width?: number | string;
  };
  minWidth?: number;
  selectedFilterOperation?: SelectedFilterOperation;
  sortIndex?: number;
  sortingMethod?: ((value1: any, value2: any) => number);
  sortOrder?: SortOrder;
  trueText?: string;
  visible?: boolean;
  visibleIndex?: number;
  width?: number | string;
  defaultFilterValue?: any;
  onFilterValueChange?: (value: any) => void;
  defaultFilterValues?: Array<any>;
  onFilterValuesChange?: (value: Array<any>) => void;
  defaultSelectedFilterOperation?: SelectedFilterOperation;
  onSelectedFilterOperationChange?: (value: SelectedFilterOperation) => void;
  defaultSortIndex?: number;
  onSortIndexChange?: (value: number) => void;
  defaultSortOrder?: SortOrder;
  onSortOrderChange?: (value: SortOrder) => void;
  defaultVisible?: boolean;
  onVisibleChange?: (value: boolean) => void;
  defaultVisibleIndex?: number;
  onVisibleIndexChange?: (value: number) => void;
  cellRender?: (...params: any) => React.ReactNode;
  cellComponent?: React.ComponentType<any>;
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
    defaultSelectedFilterOperation: "selectedFilterOperation",
    defaultSortIndex: "sortIndex",
    defaultSortOrder: "sortOrder",
    defaultVisible: "visible",
    defaultVisibleIndex: "visibleIndex"
  },
  ExpectedChildren: {
    columnHeaderFilter: { optionName: "headerFilter", isCollectionItem: false },
    format: { optionName: "format", isCollectionItem: false },
    headerFilter: { optionName: "headerFilter", isCollectionItem: false }
  },
  TemplateProps: [{
    tmplOption: "cellTemplate",
    render: "cellRender",
    component: "cellComponent"
  }, {
    tmplOption: "headerCellTemplate",
    render: "headerCellRender",
    component: "headerCellComponent"
  }],
})

// owners:
// Column
type IColumnHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store;
  groupInterval?: HeaderFilterGroupInterval | number;
  height?: number | string;
  search?: ColumnHeaderFilterSearchConfig;
  searchMode?: SearchMode;
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
  mode?: SearchMode;
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
// Gantt
type IContextMenuProps = React.PropsWithChildren<{
  enabled?: boolean;
  items?: Array<dxGanttContextMenuItem | GanttPredefinedContextMenuItem>;
}>
const _componentContextMenu = memo(
  (props: IContextMenuProps) => {
    return React.createElement(NestedOption<IContextMenuProps>, { ...props });
  }
);

const ContextMenu: typeof _componentContextMenu & IElementDescriptor = Object.assign(_componentContextMenu, {
  OptionName: "contextMenu",
  ExpectedChildren: {
    contextMenuItem: { optionName: "items", isCollectionItem: true },
    item: { optionName: "items", isCollectionItem: true }
  },
})

// owners:
// ContextMenu
type IContextMenuItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxContextMenuItem>;
  name?: GanttPredefinedContextMenuItem | string;
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentContextMenuItem = memo(
  (props: IContextMenuItemProps) => {
    return React.createElement(NestedOption<IContextMenuItemProps>, { ...props });
  }
);

const ContextMenuItem: typeof _componentContextMenuItem & IElementDescriptor = Object.assign(_componentContextMenuItem, {
  OptionName: "items",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// Gantt
type IDependenciesProps = React.PropsWithChildren<{
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  keyExpr?: (() => void) | string;
  predecessorIdExpr?: (() => void) | string;
  successorIdExpr?: (() => void) | string;
  typeExpr?: (() => void) | string;
}>
const _componentDependencies = memo(
  (props: IDependenciesProps) => {
    return React.createElement(NestedOption<IDependenciesProps>, { ...props });
  }
);

const Dependencies: typeof _componentDependencies & IElementDescriptor = Object.assign(_componentDependencies, {
  OptionName: "dependencies",
})

// owners:
// Gantt
type IEditingProps = React.PropsWithChildren<{
  allowDependencyAdding?: boolean;
  allowDependencyDeleting?: boolean;
  allowResourceAdding?: boolean;
  allowResourceDeleting?: boolean;
  allowResourceUpdating?: boolean;
  allowTaskAdding?: boolean;
  allowTaskDeleting?: boolean;
  allowTaskResourceUpdating?: boolean;
  allowTaskUpdating?: boolean;
  enabled?: boolean;
}>
const _componentEditing = memo(
  (props: IEditingProps) => {
    return React.createElement(NestedOption<IEditingProps>, { ...props });
  }
);

const Editing: typeof _componentEditing & IElementDescriptor = Object.assign(_componentEditing, {
  OptionName: "editing",
})

// owners:
// Gantt
type IFilterRowProps = React.PropsWithChildren<{
  betweenEndText?: string;
  betweenStartText?: string;
  operationDescriptions?: dxGanttFilterRowOperationDescriptions;
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
// Column
type IFormatProps = React.PropsWithChildren<{
  currency?: string;
  formatter?: ((value: number | Date) => string);
  parser?: ((value: string) => number | Date);
  precision?: number;
  type?: LocalizationTypes.Format | string;
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
// Gantt
type IGanttHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  height?: number;
  search?: HeaderFilterSearchConfig;
  searchTimeout?: number;
  texts?: dxGanttHeaderFilterTexts;
  visible?: boolean;
  width?: number;
}>
const _componentGanttHeaderFilter = memo(
  (props: IGanttHeaderFilterProps) => {
    return React.createElement(NestedOption<IGanttHeaderFilterProps>, { ...props });
  }
);

const GanttHeaderFilter: typeof _componentGanttHeaderFilter & IElementDescriptor = Object.assign(_componentGanttHeaderFilter, {
  OptionName: "headerFilter",
  ExpectedChildren: {
    ganttHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
    search: { optionName: "search", isCollectionItem: false },
    texts: { optionName: "texts", isCollectionItem: false }
  },
})

// owners:
// GanttHeaderFilter
type IGanttHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  timeout?: number;
}>
const _componentGanttHeaderFilterSearch = memo(
  (props: IGanttHeaderFilterSearchProps) => {
    return React.createElement(NestedOption<IGanttHeaderFilterSearchProps>, { ...props });
  }
);

const GanttHeaderFilterSearch: typeof _componentGanttHeaderFilterSearch & IElementDescriptor = Object.assign(_componentGanttHeaderFilterSearch, {
  OptionName: "search",
})

// owners:
// Column
// Gantt
type IHeaderFilterProps = React.PropsWithChildren<{
  allowSearch?: boolean;
  allowSelectAll?: boolean;
  dataSource?: Array<any> | DataSourceOptions | ((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void) | null | Store;
  groupInterval?: HeaderFilterGroupInterval | number;
  height?: number | string;
  search?: ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig;
  searchMode?: SearchMode;
  width?: number | string;
  searchTimeout?: number;
  texts?: dxGanttHeaderFilterTexts;
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
// ContextMenu
// Toolbar
type IItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxContextMenuItem>;
  name?: GanttPredefinedContextMenuItem | string | GanttPredefinedToolbarItem;
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  cssClass?: string;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: ShowTextMode;
  widget?: ToolbarItemComponent;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
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
    tmplOption: "template",
    render: "render",
    component: "component"
  }, {
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent"
  }],
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
// Gantt
type IResourceAssignmentsProps = React.PropsWithChildren<{
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  keyExpr?: (() => void) | string;
  resourceIdExpr?: (() => void) | string;
  taskIdExpr?: (() => void) | string;
}>
const _componentResourceAssignments = memo(
  (props: IResourceAssignmentsProps) => {
    return React.createElement(NestedOption<IResourceAssignmentsProps>, { ...props });
  }
);

const ResourceAssignments: typeof _componentResourceAssignments & IElementDescriptor = Object.assign(_componentResourceAssignments, {
  OptionName: "resourceAssignments",
})

// owners:
// Gantt
type IResourcesProps = React.PropsWithChildren<{
  colorExpr?: (() => void) | string;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  keyExpr?: (() => void) | string;
  textExpr?: (() => void) | string;
}>
const _componentResources = memo(
  (props: IResourcesProps) => {
    return React.createElement(NestedOption<IResourcesProps>, { ...props });
  }
);

const Resources: typeof _componentResources & IElementDescriptor = Object.assign(_componentResources, {
  OptionName: "resources",
})

// owners:
// Gantt
type IScaleTypeRangeProps = React.PropsWithChildren<{
  max?: GanttScaleType;
  min?: GanttScaleType;
}>
const _componentScaleTypeRange = memo(
  (props: IScaleTypeRangeProps) => {
    return React.createElement(NestedOption<IScaleTypeRangeProps>, { ...props });
  }
);

const ScaleTypeRange: typeof _componentScaleTypeRange & IElementDescriptor = Object.assign(_componentScaleTypeRange, {
  OptionName: "scaleTypeRange",
})

// owners:
// ColumnHeaderFilter
// GanttHeaderFilter
type ISearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
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
// Gantt
type ISortingProps = React.PropsWithChildren<{
  ascendingText?: string;
  clearText?: string;
  descendingText?: string;
  mode?: SingleMultipleOrNone | string;
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
// Gantt
type IStripLineProps = React.PropsWithChildren<{
  cssClass?: string;
  end?: Date | (() => Date | number | string) | number | string;
  start?: Date | (() => Date | number | string) | number | string;
  title?: string;
}>
const _componentStripLine = memo(
  (props: IStripLineProps) => {
    return React.createElement(NestedOption<IStripLineProps>, { ...props });
  }
);

const StripLine: typeof _componentStripLine & IElementDescriptor = Object.assign(_componentStripLine, {
  OptionName: "stripLines",
  IsCollectionItem: true,
})

// owners:
// Gantt
type ITasksProps = React.PropsWithChildren<{
  colorExpr?: (() => void) | string;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  endExpr?: (() => void) | string;
  keyExpr?: (() => void) | string;
  parentIdExpr?: (() => void) | string;
  progressExpr?: (() => void) | string;
  startExpr?: (() => void) | string;
  titleExpr?: (() => void) | string;
}>
const _componentTasks = memo(
  (props: ITasksProps) => {
    return React.createElement(NestedOption<ITasksProps>, { ...props });
  }
);

const Tasks: typeof _componentTasks & IElementDescriptor = Object.assign(_componentTasks, {
  OptionName: "tasks",
})

// owners:
// GanttHeaderFilter
type ITextsProps = React.PropsWithChildren<{
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
// Gantt
type IToolbarProps = React.PropsWithChildren<{
  items?: Array<dxGanttToolbarItem | GanttPredefinedToolbarItem>;
}>
const _componentToolbar = memo(
  (props: IToolbarProps) => {
    return React.createElement(NestedOption<IToolbarProps>, { ...props });
  }
);

const Toolbar: typeof _componentToolbar & IElementDescriptor = Object.assign(_componentToolbar, {
  OptionName: "toolbar",
  ExpectedChildren: {
    item: { optionName: "items", isCollectionItem: true },
    toolbarItem: { optionName: "items", isCollectionItem: true }
  },
})

// owners:
// Toolbar
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: GanttPredefinedToolbarItem | string;
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
const _componentToolbarItem = memo(
  (props: IToolbarItemProps) => {
    return React.createElement(NestedOption<IToolbarItemProps>, { ...props });
  }
);

const ToolbarItem: typeof _componentToolbarItem & IElementDescriptor = Object.assign(_componentToolbarItem, {
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
// Gantt
type IValidationProps = React.PropsWithChildren<{
  autoUpdateParentTasks?: boolean;
  enablePredecessorGap?: boolean;
  validateDependencies?: boolean;
}>
const _componentValidation = memo(
  (props: IValidationProps) => {
    return React.createElement(NestedOption<IValidationProps>, { ...props });
  }
);

const Validation: typeof _componentValidation & IElementDescriptor = Object.assign(_componentValidation, {
  OptionName: "validation",
})

export default Gantt;
export {
  Gantt,
  IGanttOptions,
  GanttRef,
  Column,
  IColumnProps,
  ColumnHeaderFilter,
  IColumnHeaderFilterProps,
  ColumnHeaderFilterSearch,
  IColumnHeaderFilterSearchProps,
  ContextMenu,
  IContextMenuProps,
  ContextMenuItem,
  IContextMenuItemProps,
  Dependencies,
  IDependenciesProps,
  Editing,
  IEditingProps,
  FilterRow,
  IFilterRowProps,
  Format,
  IFormatProps,
  GanttHeaderFilter,
  IGanttHeaderFilterProps,
  GanttHeaderFilterSearch,
  IGanttHeaderFilterSearchProps,
  HeaderFilter,
  IHeaderFilterProps,
  Item,
  IItemProps,
  OperationDescriptions,
  IOperationDescriptionsProps,
  ResourceAssignments,
  IResourceAssignmentsProps,
  Resources,
  IResourcesProps,
  ScaleTypeRange,
  IScaleTypeRangeProps,
  Search,
  ISearchProps,
  Sorting,
  ISortingProps,
  StripLine,
  IStripLineProps,
  Tasks,
  ITasksProps,
  Texts,
  ITextsProps,
  Toolbar,
  IToolbarProps,
  ToolbarItem,
  IToolbarItemProps,
  Validation,
  IValidationProps
};
import type * as GanttTypes from 'devextreme/ui/gantt_types';
export { GanttTypes };

