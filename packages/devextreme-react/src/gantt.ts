"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxGantt, {
    Properties
} from "devextreme/ui/gantt";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, ContextMenuPreparingEvent, CustomCommandEvent, DependencyDeletedEvent, DependencyDeletingEvent, DependencyInsertedEvent, DependencyInsertingEvent, DisposingEvent, InitializedEvent, ResourceAssignedEvent, ResourceAssigningEvent, ResourceDeletedEvent, ResourceDeletingEvent, ResourceInsertedEvent, ResourceInsertingEvent, ResourceManagerDialogShowingEvent, ResourceUnassignedEvent, ResourceUnassigningEvent, ScaleCellPreparedEvent, TaskClickEvent, TaskDblClickEvent, TaskDeletedEvent, TaskDeletingEvent, TaskEditDialogShowingEvent, TaskInsertedEvent, TaskInsertingEvent, TaskMovingEvent, TaskUpdatedEvent, TaskUpdatingEvent, dxGanttContextMenuItem, GanttPredefinedContextMenuItem, dxGanttFilterRowOperationDescriptions, dxGanttHeaderFilterTexts, GanttPredefinedToolbarItem, GanttScaleType, dxGanttToolbarItem } from "devextreme/ui/gantt";
import type { HorizontalAlignment, template, DataType, Format as CommonFormat, SearchMode, SortOrder, ToolbarItemLocation, ToolbarItemComponent, SingleMultipleOrNone } from "devextreme/common";
import type { dxTreeListColumn, dxTreeListRowObject } from "devextreme/ui/tree_list";
import type { FilterOperation, FilterType, HeaderFilterGroupInterval, ColumnHeaderFilterSearchConfig, SelectedFilterOperation, HeaderFilterSearchConfig } from "devextreme/common/grids";
import type { Format as LocalizationFormat } from "devextreme/common/core/localization";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";
import type { dxContextMenuItem } from "devextreme/ui/context_menu";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";

import type dxTreeList from "devextreme/ui/tree_list";
import type DataSource from "devextreme/data/data_source";

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
  alignment?: HorizontalAlignment | undefined;
  allowFiltering?: boolean;
  allowHeaderFiltering?: boolean;
  allowSorting?: boolean;
  calculateCellValue?: ((rowData: any) => any);
  calculateDisplayValue?: ((rowData: any) => any) | string;
  calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string | null, target: string) => string | (() => any) | Array<any>);
  calculateSortValue?: ((rowData: any) => any) | string;
  caption?: string | undefined;
  cellTemplate?: ((cellElement: any, cellInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList, data: Record<string, any>, displayValue: any, oldValue: any, row: dxTreeListRowObject, rowIndex: number, rowType: string, text: string, value: any, watch: (() => void) }) => any) | template;
  cssClass?: string | undefined;
  customizeText?: ((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string);
  dataField?: string | undefined;
  dataType?: DataType | undefined;
  encodeHtml?: boolean;
  falseText?: string;
  filterOperations?: Array<FilterOperation | string>;
  filterType?: FilterType;
  filterValue?: any | undefined;
  filterValues?: Array<any>;
  format?: LocalizationFormat;
  headerCellTemplate?: ((columnHeader: any, headerInfo: { column: dxTreeListColumn, columnIndex: number, component: dxTreeList }) => any) | template;
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
  minWidth?: number | undefined;
  selectedFilterOperation?: SelectedFilterOperation | undefined;
  sortIndex?: number | undefined;
  sortingMethod?: ((value1: any, value2: any) => number) | undefined;
  sortOrder?: SortOrder | undefined;
  trueText?: string;
  visible?: boolean;
  visibleIndex?: number | undefined;
  width?: number | string | undefined;
  defaultFilterValue?: any | undefined;
  onFilterValueChange?: (value: any | undefined) => void;
  defaultFilterValues?: Array<any>;
  onFilterValuesChange?: (value: Array<any>) => void;
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
    },
  });
};

const Column = Object.assign<typeof _componentColumn, NestedComponentMeta>(_componentColumn, {
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
// Gantt
type IContextMenuProps = React.PropsWithChildren<{
  enabled?: boolean;
  items?: Array<dxGanttContextMenuItem | GanttPredefinedContextMenuItem>;
}>
const _componentContextMenu = (props: IContextMenuProps) => {
  return React.createElement(NestedOption<IContextMenuProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "contextMenu",
      ExpectedChildren: {
        contextMenuItem: { optionName: "items", isCollectionItem: true },
        item: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const ContextMenu = Object.assign<typeof _componentContextMenu, NestedComponentMeta>(_componentContextMenu, {
  componentType: "option",
});

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
const _componentContextMenuItem = (props: IContextMenuItemProps) => {
  return React.createElement(NestedOption<IContextMenuItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const ContextMenuItem = Object.assign<typeof _componentContextMenuItem, NestedComponentMeta>(_componentContextMenuItem, {
  componentType: "option",
});

// owners:
// Gantt
type IDependenciesProps = React.PropsWithChildren<{
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  keyExpr?: (() => void) | string;
  predecessorIdExpr?: (() => void) | string;
  successorIdExpr?: (() => void) | string;
  typeExpr?: (() => void) | string;
}>
const _componentDependencies = (props: IDependenciesProps) => {
  return React.createElement(NestedOption<IDependenciesProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "dependencies",
    },
  });
};

const Dependencies = Object.assign<typeof _componentDependencies, NestedComponentMeta>(_componentDependencies, {
  componentType: "option",
});

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
const _componentEditing = (props: IEditingProps) => {
  return React.createElement(NestedOption<IEditingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "editing",
    },
  });
};

const Editing = Object.assign<typeof _componentEditing, NestedComponentMeta>(_componentEditing, {
  componentType: "option",
});

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
// Column
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
const _componentGanttHeaderFilter = (props: IGanttHeaderFilterProps) => {
  return React.createElement(NestedOption<IGanttHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        ganttHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        search: { optionName: "search", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const GanttHeaderFilter = Object.assign<typeof _componentGanttHeaderFilter, NestedComponentMeta>(_componentGanttHeaderFilter, {
  componentType: "option",
});

// owners:
// GanttHeaderFilter
type IGanttHeaderFilterSearchProps = React.PropsWithChildren<{
  editorOptions?: any;
  enabled?: boolean;
  mode?: SearchMode;
  timeout?: number;
}>
const _componentGanttHeaderFilterSearch = (props: IGanttHeaderFilterSearchProps) => {
  return React.createElement(NestedOption<IGanttHeaderFilterSearchProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "search",
    },
  });
};

const GanttHeaderFilterSearch = Object.assign<typeof _componentGanttHeaderFilterSearch, NestedComponentMeta>(_componentGanttHeaderFilterSearch, {
  componentType: "option",
});

// owners:
// Column
// Gantt
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
  texts?: dxGanttHeaderFilterTexts;
  visible?: boolean;
}>
const _componentHeaderFilter = (props: IHeaderFilterProps) => {
  return React.createElement(NestedOption<IHeaderFilterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "headerFilter",
      ExpectedChildren: {
        columnHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        ganttHeaderFilterSearch: { optionName: "search", isCollectionItem: false },
        texts: { optionName: "texts", isCollectionItem: false }
      },
    },
  });
};

const HeaderFilter = Object.assign<typeof _componentHeaderFilter, NestedComponentMeta>(_componentHeaderFilter, {
  componentType: "option",
});

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
  cssClass?: string | undefined;
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
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
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
// Gantt
type IResourceAssignmentsProps = React.PropsWithChildren<{
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  keyExpr?: (() => void) | string;
  resourceIdExpr?: (() => void) | string;
  taskIdExpr?: (() => void) | string;
}>
const _componentResourceAssignments = (props: IResourceAssignmentsProps) => {
  return React.createElement(NestedOption<IResourceAssignmentsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "resourceAssignments",
    },
  });
};

const ResourceAssignments = Object.assign<typeof _componentResourceAssignments, NestedComponentMeta>(_componentResourceAssignments, {
  componentType: "option",
});

// owners:
// Gantt
type IResourcesProps = React.PropsWithChildren<{
  colorExpr?: (() => void) | string;
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  keyExpr?: (() => void) | string;
  textExpr?: (() => void) | string;
}>
const _componentResources = (props: IResourcesProps) => {
  return React.createElement(NestedOption<IResourcesProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "resources",
    },
  });
};

const Resources = Object.assign<typeof _componentResources, NestedComponentMeta>(_componentResources, {
  componentType: "option",
});

// owners:
// Gantt
type IScaleTypeRangeProps = React.PropsWithChildren<{
  max?: GanttScaleType;
  min?: GanttScaleType;
}>
const _componentScaleTypeRange = (props: IScaleTypeRangeProps) => {
  return React.createElement(NestedOption<IScaleTypeRangeProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "scaleTypeRange",
    },
  });
};

const ScaleTypeRange = Object.assign<typeof _componentScaleTypeRange, NestedComponentMeta>(_componentScaleTypeRange, {
  componentType: "option",
});

// owners:
// ColumnHeaderFilter
// GanttHeaderFilter
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
// Gantt
type ISortingProps = React.PropsWithChildren<{
  ascendingText?: string;
  clearText?: string;
  descendingText?: string;
  mode?: SingleMultipleOrNone | string;
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
// Gantt
type IStripLineProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  end?: Date | (() => Date | number | string) | number | string | undefined;
  start?: Date | (() => Date | number | string) | number | string | undefined;
  title?: string | undefined;
}>
const _componentStripLine = (props: IStripLineProps) => {
  return React.createElement(NestedOption<IStripLineProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "stripLines",
      IsCollectionItem: true,
    },
  });
};

const StripLine = Object.assign<typeof _componentStripLine, NestedComponentMeta>(_componentStripLine, {
  componentType: "option",
});

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
const _componentTasks = (props: ITasksProps) => {
  return React.createElement(NestedOption<ITasksProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tasks",
    },
  });
};

const Tasks = Object.assign<typeof _componentTasks, NestedComponentMeta>(_componentTasks, {
  componentType: "option",
});

// owners:
// GanttHeaderFilter
type ITextsProps = React.PropsWithChildren<{
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
// Gantt
type IToolbarProps = React.PropsWithChildren<{
  items?: Array<dxGanttToolbarItem | GanttPredefinedToolbarItem>;
}>
const _componentToolbar = (props: IToolbarProps) => {
  return React.createElement(NestedOption<IToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbar",
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true },
        toolbarItem: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Toolbar = Object.assign<typeof _componentToolbar, NestedComponentMeta>(_componentToolbar, {
  componentType: "option",
});

// owners:
// Toolbar
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
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
const _componentToolbarItem = (props: IToolbarItemProps) => {
  return React.createElement(NestedOption<IToolbarItemProps>, {
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

const ToolbarItem = Object.assign<typeof _componentToolbarItem, NestedComponentMeta>(_componentToolbarItem, {
  componentType: "option",
});

// owners:
// Gantt
type IValidationProps = React.PropsWithChildren<{
  autoUpdateParentTasks?: boolean;
  enablePredecessorGap?: boolean;
  validateDependencies?: boolean;
}>
const _componentValidation = (props: IValidationProps) => {
  return React.createElement(NestedOption<IValidationProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "validation",
    },
  });
};

const Validation = Object.assign<typeof _componentValidation, NestedComponentMeta>(_componentValidation, {
  componentType: "option",
});

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

