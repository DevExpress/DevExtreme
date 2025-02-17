import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import { DxEvent } from '../events';

import {
    Column as TreeListColumn,
} from './tree_list';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    Item as dxToolbarItem,
} from './toolbar';

import {
    Item as dxContextMenuItem,
} from './context_menu';

import {
    template,
    FirstDayOfWeek,
    SingleMultipleOrNone,
    ToolbarItemLocation,
} from '../common';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    HeaderFilterSearchConfig,
} from '../common/grids';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GanttPdfExportDateRange = 'all' | 'visible';
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GanttPdfExportMode = 'all' | 'treeList' | 'chart';
export type GanttPredefinedContextMenuItem = 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails' | 'resourceManager';
export type GanttPredefinedToolbarItem = 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'taskDetails' | 'fullScreen' | 'resourceManager' | 'showResources' | 'showDependencies';
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GanttRenderScaleType = 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years' | 'fiveYears';
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GanttScaleType = 'auto' | 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type GanttTaskTitlePosition = 'inside' | 'outside' | 'none';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxGantt>;

/**
 * The type of the contextMenuPreparing event handler&apos;s argument.
 */
export type ContextMenuPreparingEvent = Cancelable & {
    /**
     * 
     */
    readonly component?: dxGantt;
    /**
     * 
     */
    readonly element?: DxElement;
    /**
     * 
     */
    readonly event?: DxEvent<PointerEvent | MouseEvent | TouchEvent>;
    /**
     * 
     */
    readonly targetKey?: any;
    /**
     * 
     */
    readonly targetType?: string;
    /**
     * 
     */
    readonly data?: any;
    /**
     * 
     */
    readonly items?: Array<any>;
};

/**
 * The type of the customCommand event handler&apos;s argument.
 */
export type CustomCommandEvent = {
    /**
     * 
     */
    readonly component?: dxGantt;
    /**
     * 
     */
    readonly element?: DxElement;
    /**
     * 
     */
    readonly name: string;
};

/**
 * The type of the dependencyDeleted event handler&apos;s argument.
 */
export type DependencyDeletedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the dependencyDeleting event handler&apos;s argument.
 */
export type DependencyDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the dependencyInserted event handler&apos;s argument.
 */
export type DependencyInsertedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the dependencyInserting event handler&apos;s argument.
 */
export type DependencyInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxGantt>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxGantt>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxGantt> & ChangedOptionInfo;

/**
 * The type of the resourceAssigned event handler&apos;s argument.
 */
export type ResourceAssignedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the resourceAssigning event handler&apos;s argument.
 */
export type ResourceAssigningEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
};

/**
 * The type of the resourceDeleted event handler&apos;s argument.
 */
export type ResourceDeletedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the resourceDeleting event handler&apos;s argument.
 */
export type ResourceDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the resourceInserted event handler&apos;s argument.
 */
export type ResourceInsertedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the resourceInserting event handler&apos;s argument.
 */
export type ResourceInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
};

/**
 * The type of the resourceUnassigned event handler&apos;s argument.
 */
export type ResourceUnassignedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the resourceUnassigning event handler&apos;s argument.
 */
export type ResourceUnassigningEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly selectedRowKey?: any;
};

/**
 * The type of the taskClick event handler&apos;s argument.
 */
export type TaskClickEvent = NativeEventInfo<dxGantt, PointerEvent | MouseEvent> & {
    /**
     * 
     */
    readonly key?: any;
    /**
     * 
     */
    readonly data?: any;
};

/**
 * The type of the taskDblClick event handler&apos;s argument.
 */
export type TaskDblClickEvent = Cancelable & NativeEventInfo<dxGantt, PointerEvent | MouseEvent> & {
    /**
     * 
     */
    readonly key?: any;
    /**
     * 
     */
    readonly data?: any;
};

/**
 * The type of the taskDeleted event handler&apos;s argument.
 */
export type TaskDeletedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the taskDeleting event handler&apos;s argument.
 */
export type TaskDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the taskEditDialogShowing event handler&apos;s argument.
 */
export type TaskEditDialogShowingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
    /**
     * 
     */
    readonly readOnlyFields?: Array<string>;
    /**
     * 
     */
    readonly hiddenFields?: Array<string>;
};

/**
 * The type of the resourceManagerDialogShowing event handler&apos;s argument.
 */
export type ResourceManagerDialogShowingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: Array<any>;
};

/**
 * The type of the taskInserted event handler&apos;s argument.
 */
export type TaskInsertedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values?: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the taskInserting event handler&apos;s argument.
 */
export type TaskInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
};

/**
 * The type of the taskMoving event handler&apos;s argument.
 */
export type TaskMovingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly newValues: any;
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the taskUpdated event handler&apos;s argument.
 */
export type TaskUpdatedEvent = EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};

/**
 * The type of the taskUpdating event handler&apos;s argument.
 */
export type TaskUpdatingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * 
     */
    readonly newValues: any;
    /**
     * 
     */
    readonly values: any;
    /**
     * 
     */
    readonly key: any;
};
/**
 * The type of the scaleCellPrepared event handler&apos;s argument.
 */
export type ScaleCellPreparedEvent = InitializedEventInfo<dxGantt> & {
    /**
     * 
     */
    readonly scaleIndex: number;
    /**
     * 
     */
    readonly scaleType: GanttRenderScaleType;
    /**
     * 
     */
    readonly scaleElement: DxElement;
    /**
     * 
     */
    readonly separatorElement: DxElement;
    /**
     * 
     */
    readonly startDate: Date;
    /**
     * 
     */
    readonly endDate: Date;
};

export type TaskContentTemplateData = {
    readonly cellSize: any;
    readonly isMilestone: boolean;
    readonly taskData: any;
    readonly taskHTML: any;
    readonly taskPosition: any;
    readonly taskResources: Array<any>;
    readonly taskSize: any;
};

export type ProgressTooltipTemplateData = {
    readonly progress: number;
};

export type TimeTooltipTemplateData = {
    readonly start: Date;
    readonly end: Date;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttOptions extends WidgetOptions<dxGantt> {
    /**
     * Specifies whether users can select tasks in the Gantt.
     */
    allowSelection?: boolean;
    /**
     * An array of columns in the Gantt.
     */
    columns?: Array<Column | string> | undefined;
    /**
     * Configures dependencies.
     */
    dependencies?: {
      /**
       * Binds the UI component to the data source which contains dependencies.
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * Specifies the data field that provides keys for dependencies.
       */
      keyExpr?: string | Function;
      /**
       * Specifies the data field that provides predecessor IDs.
       */
      predecessorIdExpr?: string | Function;
      /**
       * Specifies the data field that provides successor IDs.
       */
      successorIdExpr?: string | Function;
      /**
       * Specifies the data field that provides dependency types.
       */
      typeExpr?: string | Function;
    };
    /**
     * Configures edit properties.
     */
    editing?: {
      /**
       * Specifies whether a user can add dependencies.
       */
      allowDependencyAdding?: boolean;
      /**
       * Specifies whether a user can delete dependencies.
       */
      allowDependencyDeleting?: boolean;
      /**
       * Specifies whether a user can add resources. tasks.
       */
      allowResourceAdding?: boolean;
      /**
       * Specifies whether a user can delete resources.
       */
      allowResourceDeleting?: boolean;
      /**
       * For internal use only.
       */
      allowResourceUpdating?: boolean;
      /**
       * Specifies whether a user can add tasks.
       */
      allowTaskAdding?: boolean;
      /**
       * Specifies whether a user can delete tasks.
       */
      allowTaskDeleting?: boolean;
      /**
       * Specifies whether users can update a task&apos;s resources.
       */
      allowTaskResourceUpdating?: boolean;
      /**
       * Specifies whether a user can update tasks.
       */
      allowTaskUpdating?: boolean;
      /**
       * Specifies whether a user can edit tasks, resources and dependencies.
       */
      enabled?: boolean;
    };
    /**
     * Configures validation properties.
     */
    validation?: {
      /**
       * Enables task dependencies validation.
       */
      validateDependencies?: boolean;
      /**
       * Specifies whether to recalculate the parent task&apos;s duration and progress when its child tasks are modified.
       */
      autoUpdateParentTasks?: boolean;
      /**
        * Specifies whether users can move or resize a predecessor to change a gap before a successor according to the dependency rules.
        */
       enablePredecessorGap?: boolean;
    };
    /**
      * Configures sort settings.
      */
     sorting?: dxGanttSorting;
    /**
     * Configures filter row settings.
     */
    filterRow?: dxGanttFilterRow;
    /**
      * Configures the header filter settings.
      */
     headerFilter?: dxGanttHeaderFilter;
    /**
     * A function that is executed after users select a task or clear its selection.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * A function that is executed after a custom command item was clicked. Allows you to implement a custom command&apos;s functionality.
     */
    onCustomCommand?: ((e: CustomCommandEvent) => void);
    /**
     * A function that is executed before the context menu is rendered.
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * A function that is executed before a task is inserted.
     */
    onTaskInserting?: ((e: TaskInsertingEvent) => void);
    /**
     * A function that is executed when a task is inserted.
     */
    onTaskInserted?: ((e: TaskInsertedEvent) => void);
    /**
     * A function that is executed before a task is deleted.
     */
    onTaskDeleting?: ((e: TaskDeletingEvent) => void);
    /**
     * A function that is executed when a task is deleted.
     */
    onTaskDeleted?: ((e: TaskDeletedEvent) => void);
    /**
     * A function that is executed before a task is updated.
     */
    onTaskUpdating?: ((e: TaskUpdatingEvent) => void);
    /**
     * A function that is executed when a task is updated.
     */
    onTaskUpdated?: ((e: TaskUpdatedEvent) => void);
    /**
     * A function that is executed before a task is moved.
     */
    onTaskMoving?: ((e: TaskMovingEvent) => void);
    /**
     * A function that is executed before the edit dialog is shown.
     */
    onTaskEditDialogShowing?: ((e: TaskEditDialogShowingEvent) => void);
    /**
     * A function that is executed before the Resource Manager dialog is shown.
     */
    onResourceManagerDialogShowing?: ((e: ResourceManagerDialogShowingEvent) => void);
    /**
     * A function that is executed before a dependency is inserted.
     */
    onDependencyInserting?: ((e: DependencyInsertingEvent) => void);
    /**
     * A function that is executed when a dependency is inserted.
     */
    onDependencyInserted?: ((e: DependencyInsertedEvent) => void);
    /**
     * A function that is executed before a dependency is deleted.
     */
    onDependencyDeleting?: ((e: DependencyDeletingEvent) => void);
    /**
     * A function that is executed when a dependency is deleted.
     */
    onDependencyDeleted?: ((e: DependencyDeletedEvent) => void);
    /**
     * A function that is executed before a resource is inserted.
     */
    onResourceInserting?: ((e: ResourceInsertingEvent) => void);
    /**
     * A function that is executed when a resource is inserted.
     */
    onResourceInserted?: ((e: ResourceInsertedEvent) => void);
    /**
     * A function that is executed before a resource is deleted.
     */
    onResourceDeleting?: ((e: ResourceDeletingEvent) => void);
    /**
     * A function that is executed when a resource is deleted.
     */
    onResourceDeleted?: ((e: ResourceDeletedEvent) => void);
    /**
     * A function that is executed before a resource is assigned to a task.
     */
    onResourceAssigning?: ((e: ResourceAssigningEvent) => void);
    /**
     * A function that is executed when a resource is assigned to a task.
     */
    onResourceAssigned?: ((e: ResourceAssignedEvent) => void);
    /**
     * A function that is executed before a resource is unassigned from a task.
     */
    onResourceUnassigning?: ((e: ResourceUnassigningEvent) => void);
    /**
     * A function that is executed when a resource is unassigned from a task.
     */
    onResourceUnassigned?: ((e: ResourceUnassignedEvent) => void);
    /**
     * A function that is executed when a user clicks a task.
     */
    onTaskClick?: ((e: TaskClickEvent) => void);
    /**
     * A function that is executed when a user double-clicks a task.
     */
    onTaskDblClick?: ((e: TaskDblClickEvent) => void);
    /**
     * A function that is executed before a scale cell is prepared.
     */
    onScaleCellPrepared?: ((e: ScaleCellPreparedEvent) => void);

    /**
     * Configures resource assignments.
     */
    resourceAssignments?: {
      /**
       * Binds the UI component to the data source, which contains resource assignments.
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * Specifies the data field that provides keys for resource assignments.
       */
      keyExpr?: string | Function;
      /**
       * Specifies the data field that provides resource IDs.
       */
      resourceIdExpr?: string | Function;
      /**
       * Specifies the data field that provides task IDs.
       */
      taskIdExpr?: string | Function;
    };
    /**
     * Configures task resources.
     */
    resources?: {
      /**
       * Specifies the data field that provides resources&apos; color.
       */
      colorExpr?: string | Function;
      /**
       * Binds the UI component to the data source, which contains resources.
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * Specifies the data field that provides keys for resources.
       */
      keyExpr?: string | Function;
      /**
       * Specifies the data field that provides resource texts.
       */
      textExpr?: string | Function;
    };
    /**
     * Specifies the zoom level of tasks in the Gantt chart.
     */
    scaleType?: GanttScaleType;
    /**
     * Configures zoom range settings.
     */
    scaleTypeRange?: {
        /**
         * Specifies the minimum zoom level of tasks in the Gantt chart.
         */
        min?: GanttScaleType;
        /**
         * Specifies the maximum zoom level of tasks in the Gantt chart.
         */
        max?: GanttScaleType;
    };
    /**
     * Allows you to select a row or determine which row is selected.
     */
    selectedRowKey?: any | undefined;
    /**
     * Specifies whether to display task resources.
     */
    showResources?: boolean;
    /**
      * Specifies whether to display dependencies between tasks.
      */
     showDependencies?: boolean;
    /**
     * Specifies whether to show/hide horizontal faint lines that separate tasks.
     */
    showRowLines?: boolean;
    /**
     * Specifies the width of the task list in pixels.
     */
    taskListWidth?: number;
    /**
     * Specifies a task&apos;s title position.
     */
    taskTitlePosition?: GanttTaskTitlePosition;
    /**
     * Specifies the first day of a week.
     */
    firstDayOfWeek?: FirstDayOfWeek | undefined;
    /**
     * Configures tasks.
     */
    tasks?: {
      /**
       * Specifies the data field that provides tasks&apos; color.
       */
      colorExpr?: string | Function;
      /**
       * Binds the UI component to the data source which contains tasks.
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * Specifies the data field that provides tasks&apos; end dates.
       */
      endExpr?: string | Function;
      /**
       * Specifies the data field that provides keys for tasks.
       */
      keyExpr?: string | Function;
      /**
       * Specifies the data field that provides tasks&apos; parent IDs.
       */
      parentIdExpr?: string | Function;
      /**
       * Specifies the data field that provides tasks&apos; progress.
       */
      progressExpr?: string | Function;
      /**
       * Specifies the data field that provides tasks&apos; start dates.
       */
      startExpr?: string | Function;
      /**
       * Specifies the data field that provides task titles.
       */
      titleExpr?: string | Function;
    };
    /**
     * Configures toolbar settings.
     */
    toolbar?: dxGanttToolbar;
    /**
     * Configures the context menu settings.
     */
    contextMenu?: dxGanttContextMenu;
    /**
     * Configures strip lines.
     */
    stripLines?: Array<dxGanttStripLine>;
    /**
     * Specifies custom content for the task tooltip.
     */
    taskTooltipContentTemplate?: template | ((container: DxElement, task: any) => string | UserDefinedElement);
    /**
     * Specifies custom content for the tooltip that displays the task&apos;s start and end time while the task is resized in the UI.
     */
    taskTimeTooltipContentTemplate?: template | ((container: DxElement, item: TimeTooltipTemplateData) => string | UserDefinedElement);
    /**
     * Specifies custom content for the tooltip that displays the task&apos;s progress while the progress handler is resized in the UI.
     */
    taskProgressTooltipContentTemplate?: template | ((container: DxElement, item: ProgressTooltipTemplateData) => string | UserDefinedElement);
    /**
     * Specifies custom content for the task.
     */
    taskContentTemplate?: template | ((container: DxElement, item: TaskContentTemplateData) => string | UserDefinedElement);
    /**
     * Specifies the root task&apos;s identifier.
     */
    rootValue?: any;
    /**
     * Specifies the start date of the date interval in the Gantt chart.
     */
    startDateRange?: Date;
    /**
     * Specifies the end date of the date interval in the Gantt chart.
     */
    endDateRange?: Date;
}
/**
 * The Gantt is a UI component that displays the task flow and dependencies between tasks.
 */
export default class dxGantt extends Widget<dxGanttOptions> {
    /**
     * Gets the task data.
     */
    getTaskData(key: any): any;
    /**
     * Gets the dependency data.
     */
    getDependencyData(key: any): any;
    /**
     * Gets the resource data.
     */
    getResourceData(key: any): any;
    /**
     * Gets the resource assignment data.
     */
    getResourceAssignmentData(key: any): any;
    /**
     * Inserts a new task.
     */
    insertTask(data: any): void;
    /**
     * Deletes a task.
     */
    deleteTask(key: any): void;
    /**
     * Updates the task data.
     */
    updateTask(key: any, data: any): void;
    /**
     * Inserts a new dependency.
     */
    insertDependency(data: any): void;
    /**
     * Deletes a dependency.
     */
    deleteDependency(key: any): void;
    /**
     * Inserts a new resource.
     */
    insertResource(data: any, taskKeys?: Array<any>): void;
    /**
     * Deletes a resource.
     */
    deleteResource(key: any): void;
    /**
     * Assigns a resource to a task.
     */
    assignResourceToTask(resourceKey: any, taskKey: any): void;
    /**
     * Removes a resource from the task.
     */
    unassignResourceFromTask(resourceKey: any, taskKey: any): void;
    /**
     * Gets resources assigned to a task.
     */
    getTaskResources(key: any): Array<any>;
    /**
     * Gets the keys of the visible tasks.
     */
    getVisibleTaskKeys(): Array<any>;
    /**
     * Gets the keys of the visible dependencies.
     */
    getVisibleDependencyKeys(): Array<any>;
    /**
     * Gets the keys of the visible resources.
     */
    getVisibleResourceKeys(): Array<any>;
    /**
     * Gets the keys of the visible resource assignments.
     */
    getVisibleResourceAssignmentKeys(): Array<any>;
    /**
     * Updates the dimensions of the UI component contents.
     */
    updateDimensions(): void;
    /**
     * Scrolls the Gantt chart to the specified date.
     */
    scrollToDate(date: Date | Number | string): void;
    /**
     * Invokes the &apos;Resource Manager&apos; dialog.
     */
    showResourceManagerDialog(): void;
    /**
     * Expands all tasks.
     */
    expandAll(): void;
    /**
     * Collapses all tasks.
     */
    collapseAll(): void;
    /**
     * Expands all tasks down to the specified hierarchical level.
     */
    expandAllToLevel(level: Number): void;
    /**
     * Expands a task&apos;s parent tasks.
     */
    expandToTask(key: any): void;
    /**
     * Collapses a task.
     */
    collapseTask(key: any): void;
    /**
     * Expands a task.
     */
    expandTask(key: any): void;
    /**
     * Reloads data and repaints the Gantt component.
     */
    refresh(): DxPromise<void>;
    /**
      * Shows or hides task resources.
      */
     showResources(value: boolean): void;
     /**
       * Shows or hides dependencies between tasks.
       */
      showDependencies(value: boolean): void;
     /**
       * Zooms in the Gantt chart.
       */
      zoomIn(): void;
      /**
       * Zooms out the Gantt chart.
       */
      zoomOut(): void;
     /**
       * Removes all resources from the task.
       */
      unassignAllResourcesFromTask(taskKey: any): void;
     /**
       * Invokes the &apos;Task Details&apos; dialog.
       */
      showTaskDetailsDialog(taskKey: any): void;
}

/**
 * Configures the toolbar.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttToolbar {
    /**
     * Configures toolbar items&apos; settings.
     */
    items?: Array<ToolbarItem | GanttPredefinedToolbarItem>;
}

/**
 * Configures the context menu.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttContextMenu {
    /**
     * Specifies whether the context menu is enabled in the UI component.
     */
    enabled?: boolean;
    /**
     * Configures context menu item settings.
     */
    items?: Array<ContextMenuItem | GanttPredefinedContextMenuItem>;
}

export type ToolbarItem = dxGanttToolbarItem;

/**
 * @deprecated Use ToolbarItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttToolbarItem extends dxToolbarItem {
    /**
     * Specifies the toolbar item&apos;s name.
     */
    name?: GanttPredefinedToolbarItem | string;
    /**
     * Specifies the toolbar item&apos;s location.
     */
    location?: ToolbarItemLocation;
}

export type ContextMenuItem = dxGanttContextMenuItem;

/**
 * @deprecated Use ContextMenuItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttContextMenuItem extends dxContextMenuItem {
    /**
     * Specifies the context menu item name.
     */
    name?: GanttPredefinedContextMenuItem | string;
}

/**
 * Configures a strip line.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttStripLine {
    /**
     * Specifies the name of the cascading style sheet (CSS) class associated with the strip line.
     */
    cssClass?: string | undefined;
    /**
     * Specifies the end point of the strip line.
     */
    end?: Date | number | string | (() => Date | number | string) | undefined;
    /**
     * Specifies the start point of the strip line.
     */
    start?: Date | number | string | (() => Date | number | string) | undefined;
    /**
     * Specifies the strip line&apos;s title.
     */
    title?: string | undefined;
}

/**
 * Configures sorting.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttSorting {
    /**
     * Specifies text for the context menu item that sets an ascending sort order in a column.
     */
    ascendingText?: string;
    /**
     * Specifies text for the context menu item that clears sorting settings for a column.
     */
    clearText?: string;
    /**
     * Specifies text for the context menu item that sets a descending sort order in a column.
     */
    descendingText?: string;
    /**
     * Specifies sort mode.
     */
    mode?: SingleMultipleOrNone | string;
    /**
     * Specifies whether to display sort indexes in column headers. Applies only when sorting.mode is &apos;multiple&apos; and data is sorted by two or more columns.
     */
    showSortIndexes?: boolean;
}

/**
 * Configures the filter row.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttFilterRow {
    /**
     * Specifies the null text for the editor that sets the end of a range for the &apos;between&apos; filter operation.
     */
    betweenEndText?: string;
    /**
     * Specifies the null text for the editor that sets the start of a range for the &apos;between&apos; filter operation.
     */
    betweenStartText?: string;
    /**
     * Specifies descriptions for filter operations in the filter list.
     */
    operationDescriptions?: dxGanttFilterRowOperationDescriptions;
    /**
     * Specifies text for the &apos;reset&apos; operation.
     */
    resetOperationText?: string;
    /**
     * Specifies text for the &apos;All&apos; filter operation.
     */
    showAllText?: string;
    /**
     * Specifies whether to display filter icons.
     */
    showOperationChooser?: boolean;
    /**
     * Specifies whether the filter row is visible.
     */
    visible?: boolean;
}

/**
 * Contains descriptions for filter operations in the filter list.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttFilterRowOperationDescriptions {
    /**
     * Text for the &apos;Between&apos; operation.
     */
    between?: string;
    /**
     * Text for the &apos;Contains&apos; operation.
     */
    contains?: string;
    /**
     * Text for the &apos;Ends with&apos; operation.
     */
    endsWith?: string;
    /**
     * Text for the &apos;Equals&apos; operation.
     */
    equal?: string;
    /**
     * Text for the &apos;Greater than&apos; operation.
     */
    greaterThan?: string;
    /**
     * Text for the &apos;Greater than or equal to&apos; operation.
     */
    greaterThanOrEqual?: string;
    /**
     * Text for the &apos;Less than&apos; operation.
     */
    lessThan?: string;
    /**
     * Text for the &apos;Less than or equal to&apos; operation.
     */
    lessThanOrEqual?: string;
    /**
     * Text for the &apos;Does not contain&apos; operation.
     */
    notContains?: string;
    /**
     * Text for the &apos;Does not equal&apos; operation.
     */
    notEqual?: string;
    /**
     * Text for the &apos;Starts with&apos; operation.
     */
    startsWith?: string;
}

/**
 * Configures the header filter.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttHeaderFilter {
    /**
     * Specifies whether to enable searching in the header filter.
     * @deprecated Use search.enabled instead.
     */
    allowSearch?: boolean;
    /**
     * Specifies whether a &apos;Select All&apos; option is available to users.
     */
    allowSelectAll?: boolean;
    /**
     * Specifies the height of the popup window that contains values for filtering.
     */
    height?: number;
    /**
     * Configures the header filter&apos;s search functionality.
     */
    search?: HeaderFilterSearchConfig;
    /**
     * Specifies a delay in milliseconds between typing a search string and the search execution.
     * @deprecated Use search.timeout instead.
     */
    searchTimeout?: number;
    /**
     * Contains properties that specify text for various elements of the popup window.
     */
    texts?: dxGanttHeaderFilterTexts;
    /**
     * Specifies whether to show header filter icons.
     */
    visible?: boolean;
    /**
     * Specifies the width of the popup window that contains values for filtering.
     */
    width?: number;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxGanttHeaderFilterTexts {
    /**
     * Specifies text for the &apos;Cancel&apos; button in the popup window.
     */
    cancel?: string;
    /**
     * Specifies text for the &apos;(Blank)&apos; item in the popup window.
     */
    emptyValue?: string;
    /**
     * Specifies text for the &apos;OK&apos; button in the popup window.
     */
    ok?: string;
}

export type Properties = dxGanttOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxGanttOptions;

export type Column<TRowData = any, TKey = any> = dxGanttColumn<TRowData, TKey>;

/**
 * @deprecated Use the Column type instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxGanttColumn<TRowData = any, TKey = any> = Omit<dxGanttColumnBlank<TRowData, TKey>, 'allowEditing' | 'allowFixing' | 'allowHiding' | 'allowReordering' | 'allowResizing' | 'allowSearch' | 'buttons' | 'columns' | 'editCellTemplate' | 'editorOptions' | 'fixed' | 'fixedPosition' | 'formItem' | 'hidingPriority' | 'isBand' | 'lookup' | 'name' | 'ownerBand' | 'renderAsync' | 'setCellValue' | 'showEditorAlways' | 'showInColumnChooser' | 'type' | 'validationRules' >;

/**
  * Configures the column.
  * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
  */
 interface dxGanttColumnBlank<TRowData = any, TKey = any> extends TreeListColumn<TRowData, TKey> {
    /**
      * 
      */
     allowEditing: any;
    /**
      * 
      */
     allowFixing: any;
    /**
      * 
      */
     allowHiding: any;
    /**
      * 
      */
     allowReordering: any;
    /**
      * 
      */
     allowResizing: any;
    /**
      * 
      */
     allowSearch: any;
    /**
     * 
     */
    buttons: any;
    /**
     * 
     */
    columns: any;
    /**
     * 
     */
    editorOptions: any;
    /**
     * 
     */
    editCellTemplate: any;
    /**
     * 
     */
    fixed: any;
    /**
     * 
     */
    fixedPosition: any;
    /**
      * 
      */
     formItem: any;
    /**
      * 
      */
     hidingPriority: any;
    /**
      * 
      */
     isBand: any;
    /**
      * 
      */
     lookup: any;
    /**
      * 
      */
     name: any;
    /**
      * 
      */
     ownerBand: any;
    /**
      * 
      */
     renderAsync: any;
    /**
      * 
      */
     setCellValue: any;
    /**
      * 
      */
     showEditorAlways: any;
    /**
      * 
      */
     showInColumnChooser: any;
    /**
      * 
      */
     validationRules: any;
    /**
     * 
     */
    type: any;
 }

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onContextMenuPreparing' | 'onCustomCommand' | 'onDependencyDeleted' | 'onDependencyDeleting' | 'onDependencyInserted' | 'onDependencyInserting' | 'onResourceAssigned' | 'onResourceAssigning' | 'onResourceDeleted' | 'onResourceDeleting' | 'onResourceInserted' | 'onResourceInserting' | 'onResourceManagerDialogShowing' | 'onResourceUnassigned' | 'onResourceUnassigning' | 'onScaleCellPrepared' | 'onSelectionChanged' | 'onTaskClick' | 'onTaskDblClick' | 'onTaskDeleted' | 'onTaskDeleting' | 'onTaskEditDialogShowing' | 'onTaskInserted' | 'onTaskInserting' | 'onTaskMoving' | 'onTaskUpdated' | 'onTaskUpdating'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed when the UI component is rendered and each time the component is repainted.
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
