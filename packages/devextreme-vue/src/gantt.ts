import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import Gantt, { Properties } from "devextreme/ui/gantt";
import  DataSource from "devextreme/data/data_source";
import {
 dxGanttColumn,
 dxGanttContextMenu,
 dxGanttFilterRow,
 dxGanttHeaderFilter,
 ContentReadyEvent,
 ContextMenuPreparingEvent,
 CustomCommandEvent,
 DependencyDeletedEvent,
 DependencyDeletingEvent,
 DependencyInsertedEvent,
 DependencyInsertingEvent,
 DisposingEvent,
 InitializedEvent,
 OptionChangedEvent,
 ResourceAssignedEvent,
 ResourceAssigningEvent,
 ResourceDeletedEvent,
 ResourceDeletingEvent,
 ResourceInsertedEvent,
 ResourceInsertingEvent,
 ResourceManagerDialogShowingEvent,
 ResourceUnassignedEvent,
 ResourceUnassigningEvent,
 ScaleCellPreparedEvent,
 SelectionChangedEvent,
 TaskClickEvent,
 TaskDblClickEvent,
 TaskDeletedEvent,
 TaskDeletingEvent,
 TaskEditDialogShowingEvent,
 TaskInsertedEvent,
 TaskInsertingEvent,
 TaskMovingEvent,
 TaskUpdatedEvent,
 TaskUpdatingEvent,
 GanttScaleType,
 dxGanttSorting,
 dxGanttStripLine,
 GanttTaskTitlePosition,
 dxGanttToolbar,
 dxGanttContextMenuItem,
 GanttPredefinedContextMenuItem,
 dxGanttFilterRowOperationDescriptions,
 dxGanttHeaderFilterTexts,
 GanttPredefinedToolbarItem,
 dxGanttToolbarItem,
} from "devextreme/ui/gantt";
import {
 FirstDayOfWeek,
 HorizontalAlignment,
 DataType,
 Format as CommonFormat,
 SortOrder,
 SearchMode,
 ToolbarItemLocation,
 ToolbarItemComponent,
 SingleMultipleOrNone,
} from "devextreme/common";
import {
 FilterOperation,
 FilterType,
 SelectedFilterOperation,
 HeaderFilterGroupInterval,
 ColumnHeaderFilterSearchConfig,
 HeaderFilterSearchConfig,
} from "devextreme/common/grids";
import {
 Format,
} from "devextreme/common/core/localization";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import {
 dxContextMenuItem,
} from "devextreme/ui/context_menu";
import {
 LocateInMenuMode,
 ShowTextMode,
} from "devextreme/ui/toolbar";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowSelection" |
  "columns" |
  "contextMenu" |
  "dependencies" |
  "disabled" |
  "editing" |
  "elementAttr" |
  "endDateRange" |
  "filterRow" |
  "firstDayOfWeek" |
  "focusStateEnabled" |
  "headerFilter" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "onContentReady" |
  "onContextMenuPreparing" |
  "onCustomCommand" |
  "onDependencyDeleted" |
  "onDependencyDeleting" |
  "onDependencyInserted" |
  "onDependencyInserting" |
  "onDisposing" |
  "onInitialized" |
  "onOptionChanged" |
  "onResourceAssigned" |
  "onResourceAssigning" |
  "onResourceDeleted" |
  "onResourceDeleting" |
  "onResourceInserted" |
  "onResourceInserting" |
  "onResourceManagerDialogShowing" |
  "onResourceUnassigned" |
  "onResourceUnassigning" |
  "onScaleCellPrepared" |
  "onSelectionChanged" |
  "onTaskClick" |
  "onTaskDblClick" |
  "onTaskDeleted" |
  "onTaskDeleting" |
  "onTaskEditDialogShowing" |
  "onTaskInserted" |
  "onTaskInserting" |
  "onTaskMoving" |
  "onTaskUpdated" |
  "onTaskUpdating" |
  "resourceAssignments" |
  "resources" |
  "rootValue" |
  "scaleType" |
  "scaleTypeRange" |
  "selectedRowKey" |
  "showDependencies" |
  "showResources" |
  "showRowLines" |
  "sorting" |
  "startDateRange" |
  "stripLines" |
  "tabIndex" |
  "taskContentTemplate" |
  "taskListWidth" |
  "taskProgressTooltipContentTemplate" |
  "tasks" |
  "taskTimeTooltipContentTemplate" |
  "taskTitlePosition" |
  "taskTooltipContentTemplate" |
  "toolbar" |
  "validation" |
  "visible" |
  "width"
>;

interface DxGantt extends AccessibleOptions {
  readonly instance?: Gantt;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowSelection: Boolean,
    columns: Array as PropType<Array<dxGanttColumn | string>>,
    contextMenu: Object as PropType<dxGanttContextMenu | Record<string, any>>,
    dependencies: Object as PropType<Record<string, any>>,
    disabled: Boolean,
    editing: Object as PropType<Record<string, any>>,
    elementAttr: Object as PropType<Record<string, any>>,
    endDateRange: Date,
    filterRow: Object as PropType<dxGanttFilterRow | Record<string, any>>,
    firstDayOfWeek: Number as PropType<FirstDayOfWeek>,
    focusStateEnabled: Boolean,
    headerFilter: Object as PropType<dxGanttHeaderFilter | Record<string, any>>,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onContextMenuPreparing: Function as PropType<((e: ContextMenuPreparingEvent) => void)>,
    onCustomCommand: Function as PropType<((e: CustomCommandEvent) => void)>,
    onDependencyDeleted: Function as PropType<((e: DependencyDeletedEvent) => void)>,
    onDependencyDeleting: Function as PropType<((e: DependencyDeletingEvent) => void)>,
    onDependencyInserted: Function as PropType<((e: DependencyInsertedEvent) => void)>,
    onDependencyInserting: Function as PropType<((e: DependencyInsertingEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onResourceAssigned: Function as PropType<((e: ResourceAssignedEvent) => void)>,
    onResourceAssigning: Function as PropType<((e: ResourceAssigningEvent) => void)>,
    onResourceDeleted: Function as PropType<((e: ResourceDeletedEvent) => void)>,
    onResourceDeleting: Function as PropType<((e: ResourceDeletingEvent) => void)>,
    onResourceInserted: Function as PropType<((e: ResourceInsertedEvent) => void)>,
    onResourceInserting: Function as PropType<((e: ResourceInsertingEvent) => void)>,
    onResourceManagerDialogShowing: Function as PropType<((e: ResourceManagerDialogShowingEvent) => void)>,
    onResourceUnassigned: Function as PropType<((e: ResourceUnassignedEvent) => void)>,
    onResourceUnassigning: Function as PropType<((e: ResourceUnassigningEvent) => void)>,
    onScaleCellPrepared: Function as PropType<((e: ScaleCellPreparedEvent) => void)>,
    onSelectionChanged: Function as PropType<((e: SelectionChangedEvent) => void)>,
    onTaskClick: Function as PropType<((e: TaskClickEvent) => void)>,
    onTaskDblClick: Function as PropType<((e: TaskDblClickEvent) => void)>,
    onTaskDeleted: Function as PropType<((e: TaskDeletedEvent) => void)>,
    onTaskDeleting: Function as PropType<((e: TaskDeletingEvent) => void)>,
    onTaskEditDialogShowing: Function as PropType<((e: TaskEditDialogShowingEvent) => void)>,
    onTaskInserted: Function as PropType<((e: TaskInsertedEvent) => void)>,
    onTaskInserting: Function as PropType<((e: TaskInsertingEvent) => void)>,
    onTaskMoving: Function as PropType<((e: TaskMovingEvent) => void)>,
    onTaskUpdated: Function as PropType<((e: TaskUpdatedEvent) => void)>,
    onTaskUpdating: Function as PropType<((e: TaskUpdatingEvent) => void)>,
    resourceAssignments: Object as PropType<Record<string, any>>,
    resources: Object as PropType<Record<string, any>>,
    rootValue: {},
    scaleType: String as PropType<GanttScaleType>,
    scaleTypeRange: Object as PropType<Record<string, any>>,
    selectedRowKey: {},
    showDependencies: Boolean,
    showResources: Boolean,
    showRowLines: Boolean,
    sorting: Object as PropType<dxGanttSorting | Record<string, any>>,
    startDateRange: Date,
    stripLines: Array as PropType<Array<dxGanttStripLine>>,
    tabIndex: Number,
    taskContentTemplate: {},
    taskListWidth: Number,
    taskProgressTooltipContentTemplate: {},
    tasks: Object as PropType<Record<string, any>>,
    taskTimeTooltipContentTemplate: {},
    taskTitlePosition: String as PropType<GanttTaskTitlePosition>,
    taskTooltipContentTemplate: {},
    toolbar: Object as PropType<dxGanttToolbar | Record<string, any>>,
    validation: Object as PropType<Record<string, any>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowSelection": null,
    "update:columns": null,
    "update:contextMenu": null,
    "update:dependencies": null,
    "update:disabled": null,
    "update:editing": null,
    "update:elementAttr": null,
    "update:endDateRange": null,
    "update:filterRow": null,
    "update:firstDayOfWeek": null,
    "update:focusStateEnabled": null,
    "update:headerFilter": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:onContentReady": null,
    "update:onContextMenuPreparing": null,
    "update:onCustomCommand": null,
    "update:onDependencyDeleted": null,
    "update:onDependencyDeleting": null,
    "update:onDependencyInserted": null,
    "update:onDependencyInserting": null,
    "update:onDisposing": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onResourceAssigned": null,
    "update:onResourceAssigning": null,
    "update:onResourceDeleted": null,
    "update:onResourceDeleting": null,
    "update:onResourceInserted": null,
    "update:onResourceInserting": null,
    "update:onResourceManagerDialogShowing": null,
    "update:onResourceUnassigned": null,
    "update:onResourceUnassigning": null,
    "update:onScaleCellPrepared": null,
    "update:onSelectionChanged": null,
    "update:onTaskClick": null,
    "update:onTaskDblClick": null,
    "update:onTaskDeleted": null,
    "update:onTaskDeleting": null,
    "update:onTaskEditDialogShowing": null,
    "update:onTaskInserted": null,
    "update:onTaskInserting": null,
    "update:onTaskMoving": null,
    "update:onTaskUpdated": null,
    "update:onTaskUpdating": null,
    "update:resourceAssignments": null,
    "update:resources": null,
    "update:rootValue": null,
    "update:scaleType": null,
    "update:scaleTypeRange": null,
    "update:selectedRowKey": null,
    "update:showDependencies": null,
    "update:showResources": null,
    "update:showRowLines": null,
    "update:sorting": null,
    "update:startDateRange": null,
    "update:stripLines": null,
    "update:tabIndex": null,
    "update:taskContentTemplate": null,
    "update:taskListWidth": null,
    "update:taskProgressTooltipContentTemplate": null,
    "update:tasks": null,
    "update:taskTimeTooltipContentTemplate": null,
    "update:taskTitlePosition": null,
    "update:taskTooltipContentTemplate": null,
    "update:toolbar": null,
    "update:validation": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): Gantt {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = Gantt;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      column: { isCollectionItem: true, optionName: "columns" },
      contextMenu: { isCollectionItem: false, optionName: "contextMenu" },
      dependencies: { isCollectionItem: false, optionName: "dependencies" },
      editing: { isCollectionItem: false, optionName: "editing" },
      filterRow: { isCollectionItem: false, optionName: "filterRow" },
      ganttHeaderFilter: { isCollectionItem: false, optionName: "headerFilter" },
      headerFilter: { isCollectionItem: false, optionName: "headerFilter" },
      resourceAssignments: { isCollectionItem: false, optionName: "resourceAssignments" },
      resources: { isCollectionItem: false, optionName: "resources" },
      scaleTypeRange: { isCollectionItem: false, optionName: "scaleTypeRange" },
      sorting: { isCollectionItem: false, optionName: "sorting" },
      stripLine: { isCollectionItem: true, optionName: "stripLines" },
      tasks: { isCollectionItem: false, optionName: "tasks" },
      toolbar: { isCollectionItem: false, optionName: "toolbar" },
      validation: { isCollectionItem: false, optionName: "validation" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxGantt = defineComponent(componentConfig);


const DxColumnConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:allowFiltering": null,
    "update:allowHeaderFiltering": null,
    "update:allowSorting": null,
    "update:calculateCellValue": null,
    "update:calculateDisplayValue": null,
    "update:calculateFilterExpression": null,
    "update:calculateSortValue": null,
    "update:caption": null,
    "update:cellTemplate": null,
    "update:cssClass": null,
    "update:customizeText": null,
    "update:dataField": null,
    "update:dataType": null,
    "update:encodeHtml": null,
    "update:falseText": null,
    "update:filterOperations": null,
    "update:filterType": null,
    "update:filterValue": null,
    "update:filterValues": null,
    "update:format": null,
    "update:headerCellTemplate": null,
    "update:headerFilter": null,
    "update:minWidth": null,
    "update:selectedFilterOperation": null,
    "update:sortIndex": null,
    "update:sortingMethod": null,
    "update:sortOrder": null,
    "update:trueText": null,
    "update:visible": null,
    "update:visibleIndex": null,
    "update:width": null,
  },
  props: {
    alignment: String as PropType<HorizontalAlignment>,
    allowFiltering: Boolean,
    allowHeaderFiltering: Boolean,
    allowSorting: Boolean,
    calculateCellValue: Function as PropType<((rowData: any) => any)>,
    calculateDisplayValue: [Function, String] as PropType<(((rowData: any) => any)) | string>,
    calculateFilterExpression: Function as PropType<((filterValue: any, selectedFilterOperation: string | null, target: string) => string | (() => any) | Array<any>)>,
    calculateSortValue: [Function, String] as PropType<(((rowData: any) => any)) | string>,
    caption: String,
    cellTemplate: {},
    cssClass: String,
    customizeText: Function as PropType<((cellInfo: { groupInterval: string | number, target: string, value: any, valueText: string }) => string)>,
    dataField: String,
    dataType: String as PropType<DataType>,
    encodeHtml: Boolean,
    falseText: String,
    filterOperations: Array as PropType<Array<FilterOperation | string>>,
    filterType: String as PropType<FilterType>,
    filterValue: {},
    filterValues: Array as PropType<Array<any>>,
    format: [Object, String, Function] as PropType<Format | CommonFormat | (((value: number | Date) => string)) | Record<string, any> | string>,
    headerCellTemplate: {},
    headerFilter: Object as PropType<Record<string, any>>,
    minWidth: Number,
    selectedFilterOperation: String as PropType<SelectedFilterOperation>,
    sortIndex: Number,
    sortingMethod: Function as PropType<((value1: any, value2: any) => number)>,
    sortOrder: String as PropType<SortOrder>,
    trueText: String,
    visible: Boolean,
    visibleIndex: Number,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxColumnConfig);

const DxColumn = defineComponent(DxColumnConfig);

(DxColumn as any).$_optionName = "columns";
(DxColumn as any).$_isCollectionItem = true;
(DxColumn as any).$_expectedChildren = {
  columnHeaderFilter: { isCollectionItem: false, optionName: "headerFilter" },
  format: { isCollectionItem: false, optionName: "format" },
  headerFilter: { isCollectionItem: false, optionName: "headerFilter" }
};

const DxColumnHeaderFilterConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:dataSource": null,
    "update:groupInterval": null,
    "update:height": null,
    "update:search": null,
    "update:searchMode": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    dataSource: [Array, Object, Function] as PropType<Array<any> | DataSourceOptions | (((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void)) | null | Store | Record<string, any>>,
    groupInterval: [String, Number] as PropType<HeaderFilterGroupInterval | number>,
    height: [Number, String],
    search: Object as PropType<ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig | Record<string, any>>,
    searchMode: String as PropType<SearchMode>,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxColumnHeaderFilterConfig);

const DxColumnHeaderFilter = defineComponent(DxColumnHeaderFilterConfig);

(DxColumnHeaderFilter as any).$_optionName = "headerFilter";
(DxColumnHeaderFilter as any).$_expectedChildren = {
  columnHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  search: { isCollectionItem: false, optionName: "search" }
};

const DxColumnHeaderFilterSearchConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:mode": null,
    "update:searchExpr": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    mode: String as PropType<SearchMode>,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxColumnHeaderFilterSearchConfig);

const DxColumnHeaderFilterSearch = defineComponent(DxColumnHeaderFilterSearchConfig);

(DxColumnHeaderFilterSearch as any).$_optionName = "search";

const DxContextMenuConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:items": null,
  },
  props: {
    enabled: Boolean,
    items: Array as PropType<Array<dxGanttContextMenuItem | GanttPredefinedContextMenuItem>>
  }
};

prepareConfigurationComponentConfig(DxContextMenuConfig);

const DxContextMenu = defineComponent(DxContextMenuConfig);

(DxContextMenu as any).$_optionName = "contextMenu";
(DxContextMenu as any).$_expectedChildren = {
  contextMenuItem: { isCollectionItem: true, optionName: "items" },
  item: { isCollectionItem: true, optionName: "items" }
};

const DxContextMenuItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:beginGroup": null,
    "update:closeMenuOnClick": null,
    "update:disabled": null,
    "update:icon": null,
    "update:items": null,
    "update:name": null,
    "update:selectable": null,
    "update:selected": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    beginGroup: Boolean,
    closeMenuOnClick: Boolean,
    disabled: Boolean,
    icon: String,
    items: Array as PropType<Array<dxContextMenuItem>>,
    name: String as PropType<GanttPredefinedContextMenuItem | string>,
    selectable: Boolean,
    selected: Boolean,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxContextMenuItemConfig);

const DxContextMenuItem = defineComponent(DxContextMenuItemConfig);

(DxContextMenuItem as any).$_optionName = "items";
(DxContextMenuItem as any).$_isCollectionItem = true;

const DxDependenciesConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:dataSource": null,
    "update:keyExpr": null,
    "update:predecessorIdExpr": null,
    "update:successorIdExpr": null,
    "update:typeExpr": null,
  },
  props: {
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    keyExpr: [Function, String] as PropType<((() => void)) | string>,
    predecessorIdExpr: [Function, String] as PropType<((() => void)) | string>,
    successorIdExpr: [Function, String] as PropType<((() => void)) | string>,
    typeExpr: [Function, String] as PropType<((() => void)) | string>
  }
};

prepareConfigurationComponentConfig(DxDependenciesConfig);

const DxDependencies = defineComponent(DxDependenciesConfig);

(DxDependencies as any).$_optionName = "dependencies";

const DxEditingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowDependencyAdding": null,
    "update:allowDependencyDeleting": null,
    "update:allowResourceAdding": null,
    "update:allowResourceDeleting": null,
    "update:allowResourceUpdating": null,
    "update:allowTaskAdding": null,
    "update:allowTaskDeleting": null,
    "update:allowTaskResourceUpdating": null,
    "update:allowTaskUpdating": null,
    "update:enabled": null,
  },
  props: {
    allowDependencyAdding: Boolean,
    allowDependencyDeleting: Boolean,
    allowResourceAdding: Boolean,
    allowResourceDeleting: Boolean,
    allowResourceUpdating: Boolean,
    allowTaskAdding: Boolean,
    allowTaskDeleting: Boolean,
    allowTaskResourceUpdating: Boolean,
    allowTaskUpdating: Boolean,
    enabled: Boolean
  }
};

prepareConfigurationComponentConfig(DxEditingConfig);

const DxEditing = defineComponent(DxEditingConfig);

(DxEditing as any).$_optionName = "editing";

const DxFilterRowConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:betweenEndText": null,
    "update:betweenStartText": null,
    "update:operationDescriptions": null,
    "update:resetOperationText": null,
    "update:showAllText": null,
    "update:showOperationChooser": null,
    "update:visible": null,
  },
  props: {
    betweenEndText: String,
    betweenStartText: String,
    operationDescriptions: Object as PropType<dxGanttFilterRowOperationDescriptions | Record<string, any>>,
    resetOperationText: String,
    showAllText: String,
    showOperationChooser: Boolean,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxFilterRowConfig);

const DxFilterRow = defineComponent(DxFilterRowConfig);

(DxFilterRow as any).$_optionName = "filterRow";
(DxFilterRow as any).$_expectedChildren = {
  operationDescriptions: { isCollectionItem: false, optionName: "operationDescriptions" }
};

const DxFormatConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:currency": null,
    "update:formatter": null,
    "update:parser": null,
    "update:precision": null,
    "update:type": null,
    "update:useCurrencyAccountingStyle": null,
  },
  props: {
    currency: String,
    formatter: Function as PropType<((value: number | Date) => string)>,
    parser: Function as PropType<((value: string) => number | Date)>,
    precision: Number,
    type: String as PropType<CommonFormat | string>,
    useCurrencyAccountingStyle: Boolean
  }
};

prepareConfigurationComponentConfig(DxFormatConfig);

const DxFormat = defineComponent(DxFormatConfig);

(DxFormat as any).$_optionName = "format";

const DxGanttHeaderFilterConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:height": null,
    "update:search": null,
    "update:searchTimeout": null,
    "update:texts": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    height: Number,
    search: Object as PropType<HeaderFilterSearchConfig | Record<string, any>>,
    searchTimeout: Number,
    texts: Object as PropType<dxGanttHeaderFilterTexts | Record<string, any>>,
    visible: Boolean,
    width: Number
  }
};

prepareConfigurationComponentConfig(DxGanttHeaderFilterConfig);

const DxGanttHeaderFilter = defineComponent(DxGanttHeaderFilterConfig);

(DxGanttHeaderFilter as any).$_optionName = "headerFilter";
(DxGanttHeaderFilter as any).$_expectedChildren = {
  ganttHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  search: { isCollectionItem: false, optionName: "search" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxGanttHeaderFilterSearchConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:mode": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    mode: String as PropType<SearchMode>,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxGanttHeaderFilterSearchConfig);

const DxGanttHeaderFilterSearch = defineComponent(DxGanttHeaderFilterSearchConfig);

(DxGanttHeaderFilterSearch as any).$_optionName = "search";

const DxHeaderFilterConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowSearch": null,
    "update:allowSelectAll": null,
    "update:dataSource": null,
    "update:groupInterval": null,
    "update:height": null,
    "update:search": null,
    "update:searchMode": null,
    "update:searchTimeout": null,
    "update:texts": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    allowSearch: Boolean,
    allowSelectAll: Boolean,
    dataSource: [Array, Object, Function] as PropType<Array<any> | DataSourceOptions | (((options: { component: Record<string, any>, dataSource: DataSourceOptions | null }) => void)) | null | Store | Record<string, any>>,
    groupInterval: [String, Number] as PropType<HeaderFilterGroupInterval | number>,
    height: [Number, String],
    search: Object as PropType<ColumnHeaderFilterSearchConfig | HeaderFilterSearchConfig | Record<string, any>>,
    searchMode: String as PropType<SearchMode>,
    searchTimeout: Number,
    texts: Object as PropType<dxGanttHeaderFilterTexts | Record<string, any>>,
    visible: Boolean,
    width: [Number, String]
  }
};

prepareConfigurationComponentConfig(DxHeaderFilterConfig);

const DxHeaderFilter = defineComponent(DxHeaderFilterConfig);

(DxHeaderFilter as any).$_optionName = "headerFilter";
(DxHeaderFilter as any).$_expectedChildren = {
  columnHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  ganttHeaderFilterSearch: { isCollectionItem: false, optionName: "search" },
  texts: { isCollectionItem: false, optionName: "texts" }
};

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:beginGroup": null,
    "update:closeMenuOnClick": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:html": null,
    "update:icon": null,
    "update:items": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:selectable": null,
    "update:selected": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    beginGroup: Boolean,
    closeMenuOnClick: Boolean,
    cssClass: String,
    disabled: Boolean,
    html: String,
    icon: String,
    items: Array as PropType<Array<dxContextMenuItem>>,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<GanttPredefinedContextMenuItem | string | GanttPredefinedToolbarItem>,
    options: {},
    selectable: Boolean,
    selected: Boolean,
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

const DxOperationDescriptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:between": null,
    "update:contains": null,
    "update:endsWith": null,
    "update:equal": null,
    "update:greaterThan": null,
    "update:greaterThanOrEqual": null,
    "update:lessThan": null,
    "update:lessThanOrEqual": null,
    "update:notContains": null,
    "update:notEqual": null,
    "update:startsWith": null,
  },
  props: {
    between: String,
    contains: String,
    endsWith: String,
    equal: String,
    greaterThan: String,
    greaterThanOrEqual: String,
    lessThan: String,
    lessThanOrEqual: String,
    notContains: String,
    notEqual: String,
    startsWith: String
  }
};

prepareConfigurationComponentConfig(DxOperationDescriptionsConfig);

const DxOperationDescriptions = defineComponent(DxOperationDescriptionsConfig);

(DxOperationDescriptions as any).$_optionName = "operationDescriptions";

const DxResourceAssignmentsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:dataSource": null,
    "update:keyExpr": null,
    "update:resourceIdExpr": null,
    "update:taskIdExpr": null,
  },
  props: {
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    keyExpr: [Function, String] as PropType<((() => void)) | string>,
    resourceIdExpr: [Function, String] as PropType<((() => void)) | string>,
    taskIdExpr: [Function, String] as PropType<((() => void)) | string>
  }
};

prepareConfigurationComponentConfig(DxResourceAssignmentsConfig);

const DxResourceAssignments = defineComponent(DxResourceAssignmentsConfig);

(DxResourceAssignments as any).$_optionName = "resourceAssignments";

const DxResourcesConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colorExpr": null,
    "update:dataSource": null,
    "update:keyExpr": null,
    "update:textExpr": null,
  },
  props: {
    colorExpr: [Function, String] as PropType<((() => void)) | string>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    keyExpr: [Function, String] as PropType<((() => void)) | string>,
    textExpr: [Function, String] as PropType<((() => void)) | string>
  }
};

prepareConfigurationComponentConfig(DxResourcesConfig);

const DxResources = defineComponent(DxResourcesConfig);

(DxResources as any).$_optionName = "resources";

const DxScaleTypeRangeConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:max": null,
    "update:min": null,
  },
  props: {
    max: String as PropType<GanttScaleType>,
    min: String as PropType<GanttScaleType>
  }
};

prepareConfigurationComponentConfig(DxScaleTypeRangeConfig);

const DxScaleTypeRange = defineComponent(DxScaleTypeRangeConfig);

(DxScaleTypeRange as any).$_optionName = "scaleTypeRange";

const DxSearchConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:editorOptions": null,
    "update:enabled": null,
    "update:mode": null,
    "update:searchExpr": null,
    "update:timeout": null,
  },
  props: {
    editorOptions: {},
    enabled: Boolean,
    mode: String as PropType<SearchMode>,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    timeout: Number
  }
};

prepareConfigurationComponentConfig(DxSearchConfig);

const DxSearch = defineComponent(DxSearchConfig);

(DxSearch as any).$_optionName = "search";

const DxSortingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:ascendingText": null,
    "update:clearText": null,
    "update:descendingText": null,
    "update:mode": null,
    "update:showSortIndexes": null,
  },
  props: {
    ascendingText: String,
    clearText: String,
    descendingText: String,
    mode: String as PropType<SingleMultipleOrNone | string>,
    showSortIndexes: Boolean
  }
};

prepareConfigurationComponentConfig(DxSortingConfig);

const DxSorting = defineComponent(DxSortingConfig);

(DxSorting as any).$_optionName = "sorting";

const DxStripLineConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:end": null,
    "update:start": null,
    "update:title": null,
  },
  props: {
    cssClass: String,
    end: [Date, Function, Number, String] as PropType<Date | ((() => Date | number | string)) | number | string>,
    start: [Date, Function, Number, String] as PropType<Date | ((() => Date | number | string)) | number | string>,
    title: String
  }
};

prepareConfigurationComponentConfig(DxStripLineConfig);

const DxStripLine = defineComponent(DxStripLineConfig);

(DxStripLine as any).$_optionName = "stripLines";
(DxStripLine as any).$_isCollectionItem = true;

const DxTasksConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:colorExpr": null,
    "update:dataSource": null,
    "update:endExpr": null,
    "update:keyExpr": null,
    "update:parentIdExpr": null,
    "update:progressExpr": null,
    "update:startExpr": null,
    "update:titleExpr": null,
  },
  props: {
    colorExpr: [Function, String] as PropType<((() => void)) | string>,
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    endExpr: [Function, String] as PropType<((() => void)) | string>,
    keyExpr: [Function, String] as PropType<((() => void)) | string>,
    parentIdExpr: [Function, String] as PropType<((() => void)) | string>,
    progressExpr: [Function, String] as PropType<((() => void)) | string>,
    startExpr: [Function, String] as PropType<((() => void)) | string>,
    titleExpr: [Function, String] as PropType<((() => void)) | string>
  }
};

prepareConfigurationComponentConfig(DxTasksConfig);

const DxTasks = defineComponent(DxTasksConfig);

(DxTasks as any).$_optionName = "tasks";

const DxTextsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cancel": null,
    "update:emptyValue": null,
    "update:ok": null,
  },
  props: {
    cancel: String,
    emptyValue: String,
    ok: String
  }
};

prepareConfigurationComponentConfig(DxTextsConfig);

const DxTexts = defineComponent(DxTextsConfig);

(DxTexts as any).$_optionName = "texts";

const DxToolbarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:items": null,
  },
  props: {
    items: Array as PropType<Array<dxGanttToolbarItem | GanttPredefinedToolbarItem>>
  }
};

prepareConfigurationComponentConfig(DxToolbarConfig);

const DxToolbar = defineComponent(DxToolbarConfig);

(DxToolbar as any).$_optionName = "toolbar";
(DxToolbar as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  toolbarItem: { isCollectionItem: true, optionName: "items" }
};

const DxToolbarItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:html": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    html: String,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<GanttPredefinedToolbarItem | string>,
    options: {},
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxToolbarItemConfig);

const DxToolbarItem = defineComponent(DxToolbarItemConfig);

(DxToolbarItem as any).$_optionName = "items";
(DxToolbarItem as any).$_isCollectionItem = true;

const DxValidationConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:autoUpdateParentTasks": null,
    "update:enablePredecessorGap": null,
    "update:validateDependencies": null,
  },
  props: {
    autoUpdateParentTasks: Boolean,
    enablePredecessorGap: Boolean,
    validateDependencies: Boolean
  }
};

prepareConfigurationComponentConfig(DxValidationConfig);

const DxValidation = defineComponent(DxValidationConfig);

(DxValidation as any).$_optionName = "validation";

export default DxGantt;
export {
  DxGantt,
  DxColumn,
  DxColumnHeaderFilter,
  DxColumnHeaderFilterSearch,
  DxContextMenu,
  DxContextMenuItem,
  DxDependencies,
  DxEditing,
  DxFilterRow,
  DxFormat,
  DxGanttHeaderFilter,
  DxGanttHeaderFilterSearch,
  DxHeaderFilter,
  DxItem,
  DxOperationDescriptions,
  DxResourceAssignments,
  DxResources,
  DxScaleTypeRange,
  DxSearch,
  DxSorting,
  DxStripLine,
  DxTasks,
  DxTexts,
  DxToolbar,
  DxToolbarItem,
  DxValidation
};
import type * as DxGanttTypes from "devextreme/ui/gantt_types";
export { DxGanttTypes };
