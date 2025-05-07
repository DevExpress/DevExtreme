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

export type GanttPdfExportDateRange = 'all' | 'visible';
export type GanttPdfExportMode = 'all' | 'treeList' | 'chart';
/** @public */
export type GanttPredefinedContextMenuItem = 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails' | 'resourceManager';
/** @public */
export type GanttPredefinedToolbarItem = 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'taskDetails' | 'fullScreen' | 'resourceManager' | 'showResources' | 'showDependencies';
export type GanttRenderScaleType = 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years' | 'fiveYears';
export type GanttScaleType = 'auto' | 'minutes' | 'hours' | 'sixHours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
export type GanttTaskTitlePosition = 'inside' | 'outside' | 'none';

/**
 * @docid _ui_gantt_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxGantt>;

/**
 * @docid _ui_gantt_ContextMenuPreparingEvent
 * @public
 * @type object
 * @inherits Cancelable
 */
export type ContextMenuPreparingEvent = Cancelable & {
    /**
     * @docid _ui_gantt_ContextMenuPreparingEvent.component
     * @type this
     */
    readonly component?: dxGantt;
    /** @docid _ui_gantt_ContextMenuPreparingEvent.element */
    readonly element?: DxElement;
    /**
     * @docid _ui_gantt_ContextMenuPreparingEvent.event
     * @type event
     */
    readonly event?: DxEvent<PointerEvent | MouseEvent | TouchEvent>;
    /** @docid _ui_gantt_ContextMenuPreparingEvent.targetKey */
    readonly targetKey?: any;
    /** @docid _ui_gantt_ContextMenuPreparingEvent.targetType */
    readonly targetType?: string;
    /** @docid _ui_gantt_ContextMenuPreparingEvent.data */
    readonly data?: any;
    /**
     * @docid _ui_gantt_ContextMenuPreparingEvent.items
     * @type Array<object>
     */
    readonly items?: Array<any>;
};

/**
 * @docid _ui_gantt_CustomCommandEvent
 * @public
 * @type object
 */
export type CustomCommandEvent = {
    /**
     * @docid _ui_gantt_CustomCommandEvent.component
     * @type this
     */
    readonly component?: dxGantt;
    /** @docid _ui_gantt_CustomCommandEvent.element */
    readonly element?: DxElement;
    /** @docid _ui_gantt_CustomCommandEvent.name */
    readonly name: string;
};

/**
 * @docid _ui_gantt_DependencyDeletedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DependencyDeletedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_DependencyDeletedEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_DependencyDeletedEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_DependencyDeletingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type DependencyDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_DependencyDeletingEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_DependencyDeletingEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_DependencyInsertedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DependencyInsertedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_DependencyInsertedEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_DependencyInsertedEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_DependencyInsertingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type DependencyInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_DependencyInsertingEvent.values */
    readonly values: any;
};

/**
 * @docid _ui_gantt_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxGantt>;

/**
 * @docid _ui_gantt_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxGantt>;

/**
 * @docid _ui_gantt_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxGantt> & ChangedOptionInfo;

/**
 * @docid _ui_gantt_ResourceAssignedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ResourceAssignedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_ResourceAssignedEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_ResourceAssignedEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_ResourceAssigningEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ResourceAssigningEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_ResourceAssigningEvent.values */
    readonly values: any;
};

/**
 * @docid _ui_gantt_ResourceDeletedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ResourceDeletedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_ResourceDeletedEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_ResourceDeletedEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_ResourceDeletingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ResourceDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_ResourceDeletingEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_ResourceDeletingEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_ResourceInsertedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ResourceInsertedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_ResourceInsertedEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_ResourceInsertedEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_ResourceInsertingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ResourceInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_ResourceInsertingEvent.values */
    readonly values: any;
};

/**
 * @docid _ui_gantt_ResourceUnassignedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ResourceUnassignedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_ResourceUnassignedEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_ResourceUnassignedEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_ResourceUnassigningEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ResourceUnassigningEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_ResourceUnassigningEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_ResourceUnassigningEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectionChangedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_SelectionChangedEvent.selectedRowKey */
    readonly selectedRowKey?: any;
};

/**
 * @docid _ui_gantt_TaskClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type TaskClickEvent = NativeEventInfo<dxGantt, PointerEvent | MouseEvent> & {
    /** @docid _ui_gantt_TaskClickEvent.key */
    readonly key?: any;
    /** @docid _ui_gantt_TaskClickEvent.data */
    readonly data?: any;
};

/**
 * @docid _ui_gantt_TaskDblClickEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type TaskDblClickEvent = Cancelable & NativeEventInfo<dxGantt, PointerEvent | MouseEvent> & {
    /** @docid _ui_gantt_TaskDblClickEvent.key */
    readonly key?: any;
    /** @docid _ui_gantt_TaskDblClickEvent.data */
    readonly data?: any;
};

/**
 * @docid _ui_gantt_TaskDeletedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type TaskDeletedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_TaskDeletedEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_TaskDeletedEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_TaskDeletingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type TaskDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_TaskDeletingEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_TaskDeletingEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_TaskEditDialogShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type TaskEditDialogShowingEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_TaskEditDialogShowingEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_TaskEditDialogShowingEvent.key */
    readonly key: any;
    /**
     * @docid _ui_gantt_TaskEditDialogShowingEvent.readOnlyFields
     * @type Array<string>
     */
    readonly readOnlyFields?: Array<string>;
    /**
     * @docid _ui_gantt_TaskEditDialogShowingEvent.hiddenFields
     * @type Array<string>
     */
    readonly hiddenFields?: Array<string>;
};

/**
 * @docid _ui_gantt_ResourceManagerDialogShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ResourceManagerDialogShowingEvent = Cancelable & EventInfo<dxGantt> & {
    /**
     * @docid _ui_gantt_ResourceManagerDialogShowingEvent.values
     * @type Array<any>
     */
    readonly values: Array<any>;
};

/**
 * @docid _ui_gantt_TaskInsertedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type TaskInsertedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_TaskInsertedEvent.values */
    readonly values?: any;
    /** @docid _ui_gantt_TaskInsertedEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_TaskInsertingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type TaskInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_TaskInsertingEvent.values */
    readonly values: any;
};

/**
 * @docid _ui_gantt_TaskMovingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type TaskMovingEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_TaskMovingEvent.newValues */
    readonly newValues: any;
    /** @docid _ui_gantt_TaskMovingEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_TaskMovingEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_TaskUpdatedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type TaskUpdatedEvent = EventInfo<dxGantt> & {
    /** @docid _ui_gantt_TaskUpdatedEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_TaskUpdatedEvent.key */
    readonly key: any;
};

/**
 * @docid _ui_gantt_TaskUpdatingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type TaskUpdatingEvent = Cancelable & EventInfo<dxGantt> & {
    /** @docid _ui_gantt_TaskUpdatingEvent.newValues */
    readonly newValues: any;
    /** @docid _ui_gantt_TaskUpdatingEvent.values */
    readonly values: any;
    /** @docid _ui_gantt_TaskUpdatingEvent.key */
    readonly key: any;
};
/**
 * @docid _ui_gantt_ScaleCellPreparedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type ScaleCellPreparedEvent = InitializedEventInfo<dxGantt> & {
    /** @docid _ui_gantt_ScaleCellPreparedEvent.scaleIndex */
    readonly scaleIndex: number;
    /**
     * @docid _ui_gantt_ScaleCellPreparedEvent.scaleType
     * @type Enums.GanttRenderScaleType
     */
    readonly scaleType: GanttRenderScaleType;
    /** @docid _ui_gantt_ScaleCellPreparedEvent.scaleElement */
    readonly scaleElement: DxElement;
    /** @docid _ui_gantt_ScaleCellPreparedEvent.separatorElement */
    readonly separatorElement: DxElement;
    /** @docid _ui_gantt_ScaleCellPreparedEvent.startDate */
    readonly startDate: Date;
    /** @docid _ui_gantt_ScaleCellPreparedEvent.endDate */
    readonly endDate: Date;
};

/** @public */
export type TaskContentTemplateData = {
    readonly cellSize: any;
    readonly isMilestone: boolean;
    readonly taskData: any;
    readonly taskHTML: any;
    readonly taskPosition: any;
    readonly taskResources: Array<any>;
    readonly taskSize: any;
};

/** @public */
export type ProgressTooltipTemplateData = {
    readonly progress: number;
};

/** @public */
export type TimeTooltipTemplateData = {
    readonly start: Date;
    readonly end: Date;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxGanttOptions extends WidgetOptions<dxGantt> {
    /**
     * @docid
     * @default true
     * @public
     */
    allowSelection?: boolean;
    /**
     * @docid
     * @type Array<dxGanttColumn|string>
     * @default undefined
     * @public
     */
    columns?: Array<Column | string> | undefined;
    /**
     * @docid
     * @default null
     * @public
     */
    dependencies?: {
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function;
      /**
       * @docid
       * @default "predecessorId"
       */
      predecessorIdExpr?: string | Function;
      /**
       * @docid
       * @default "successorId"
       */
      successorIdExpr?: string | Function;
      /**
       * @docid
       * @default "type"
       */
      typeExpr?: string | Function;
    };
    /**
     * @docid
     * @public
     */
    editing?: {
      /**
       * @docid
       * @default true
       */
      allowDependencyAdding?: boolean;
      /**
       * @docid
       * @default true
       */
      allowDependencyDeleting?: boolean;
      /**
       * @docid
       * @default true
       */
      allowResourceAdding?: boolean;
      /**
       * @docid
       * @default true
       */
      allowResourceDeleting?: boolean;
      /**
       * @docid
       * @default true
       */
      allowResourceUpdating?: boolean;
      /**
       * @docid
       * @default true
       */
      allowTaskAdding?: boolean;
      /**
       * @docid
       * @default true
       */
      allowTaskDeleting?: boolean;
      /**
       * @docid
       * @default true
       */
      allowTaskResourceUpdating?: boolean;
      /**
       * @docid
       * @default true
       */
      allowTaskUpdating?: boolean;
      /**
       * @docid
       * @default false
       */
      enabled?: boolean;
    };
    /**
     * @docid
     * @public
     */
    validation?: {
      /**
       * @docid
       * @default false
       */
      validateDependencies?: boolean;
      /**
       * @docid
       * @default false
       */
      autoUpdateParentTasks?: boolean;
      /**
       * @docid
       * @default false
       */
       enablePredecessorGap?: boolean;
    };
    /**
     * @docid
     * @public
     */
     sorting?: dxGanttSorting;
    /**
     * @docid
     * @public
     */
    filterRow?: dxGanttFilterRow;
    /**
     * @docid
     * @public
     */
     headerFilter?: dxGanttHeaderFilter;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:SelectionChangedEvent}
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:CustomCommandEvent}
     * @action
     * @public
     */
    onCustomCommand?: ((e: CustomCommandEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ContextMenuPreparingEvent}
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskInsertingEvent}
     * @action
     * @public
     */
    onTaskInserting?: ((e: TaskInsertingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskInsertedEvent}
     * @action
     * @public
     */
    onTaskInserted?: ((e: TaskInsertedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskDeletingEvent}
     * @action
     * @public
     */
    onTaskDeleting?: ((e: TaskDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskDeletedEvent}
     * @action
     * @public
     */
    onTaskDeleted?: ((e: TaskDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskUpdatingEvent}
     * @action
     * @public
     */
    onTaskUpdating?: ((e: TaskUpdatingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskUpdatedEvent}
     * @action
     * @public
     */
    onTaskUpdated?: ((e: TaskUpdatedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskMovingEvent}
     * @action
     * @public
     */
    onTaskMoving?: ((e: TaskMovingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskEditDialogShowingEvent}
     * @action
     * @public
     */
    onTaskEditDialogShowing?: ((e: TaskEditDialogShowingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ResourceManagerDialogShowingEvent}
     * @action
     * @public
     */
    onResourceManagerDialogShowing?: ((e: ResourceManagerDialogShowingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:DependencyInsertingEvent}
     * @action
     * @public
     */
    onDependencyInserting?: ((e: DependencyInsertingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:DependencyInsertedEvent}
     * @action
     * @public
     */
    onDependencyInserted?: ((e: DependencyInsertedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:DependencyDeletingEvent}
     * @action
     * @public
     */
    onDependencyDeleting?: ((e: DependencyDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:DependencyDeletedEvent}
     * @action
     * @public
     */
    onDependencyDeleted?: ((e: DependencyDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ResourceInsertingEvent}
     * @action
     * @public
     */
    onResourceInserting?: ((e: ResourceInsertingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ResourceInsertedEvent}
     * @action
     * @public
     */
    onResourceInserted?: ((e: ResourceInsertedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ResourceDeletingEvent}
     * @action
     * @public
     */
    onResourceDeleting?: ((e: ResourceDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ResourceDeletedEvent}
     * @action
     * @public
     */
    onResourceDeleted?: ((e: ResourceDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ResourceAssigningEvent}
     * @action
     * @public
     */
    onResourceAssigning?: ((e: ResourceAssigningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ResourceAssignedEvent}
     * @action
     * @public
     */
    onResourceAssigned?: ((e: ResourceAssignedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ResourceUnassigningEvent}
     * @action
     * @public
     */
    onResourceUnassigning?: ((e: ResourceUnassigningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ResourceUnassignedEvent}
     * @action
     * @public
     */
    onResourceUnassigned?: ((e: ResourceUnassignedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskClickEvent}
     * @action
     * @public
     */
    onTaskClick?: ((e: TaskClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:TaskDblClickEvent}
     * @action
     * @public
     */
    onTaskDblClick?: ((e: TaskDblClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/gantt:ScaleCellPreparedEvent}
     * @action
     * @public
     */
    onScaleCellPrepared?: ((e: ScaleCellPreparedEvent) => void);

    /**
     * @docid
     * @default null
     * @public
     */
    resourceAssignments?: {
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function;
      /**
       * @docid
       * @default "resourceId"
       */
      resourceIdExpr?: string | Function;
      /**
       * @docid
       * @default "taskId"
       */
      taskIdExpr?: string | Function;
    };
    /**
     * @docid
     * @default null
     * @public
     */
    resources?: {
      /**
       * @docid
       * @default "color"
       */
      colorExpr?: string | Function;
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function;
      /**
       * @docid
       * @default "text"
       */
      textExpr?: string | Function;
    };
    /**
     * @docid
     * @default "auto"
     * @public
     */
    scaleType?: GanttScaleType;
    /**
     * @docid
     * @public
     */
    scaleTypeRange?: {
        /**
         * @docid
         * @default "minutes"
         */
        min?: GanttScaleType;
        /**
         * @docid
         * @default "years"
         */
        max?: GanttScaleType;
    };
    /**
     * @docid
     * @default undefined
     * @public
     */
    selectedRowKey?: any | undefined;
    /**
     * @docid
     * @default true
     * @public
     */
    showResources?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
     showDependencies?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    showRowLines?: boolean;
    /**
     * @docid
     * @default 300
     * @public
     */
    taskListWidth?: number;
    /**
     * @docid
     * @default "inside"
     * @public
     */
    taskTitlePosition?: GanttTaskTitlePosition;
    /**
     * @docid
     * @default undefined
     * @public
     */
    firstDayOfWeek?: FirstDayOfWeek | undefined;
    /**
     * @docid
     * @default null
     * @public
     */
    tasks?: {
      /**
       * @docid
       * @default "color"
       */
      colorExpr?: string | Function;
      /**
       * @docid
       * @default null
       * @type Store|DataSource|DataSourceOptions|string|Array<any>|null
       */
      dataSource?: DataSourceLike<any> | null;
      /**
       * @docid
       * @default "end"
       */
      endExpr?: string | Function;
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function;
      /**
       * @docid
       * @default "parentId"
       */
      parentIdExpr?: string | Function;
      /**
       * @docid
       * @default "progress"
       */
      progressExpr?: string | Function;
      /**
       * @docid
       * @default "start"
       */
      startExpr?: string | Function;
      /**
       * @docid
       * @default "title"
       */
      titleExpr?: string | Function;
    };
    /**
     * @docid
     * @default null
     * @public
     */
    toolbar?: dxGanttToolbar;
    /**
     * @docid
     * @public
     */
    contextMenu?: dxGanttContextMenu;
    /**
     * @docid
     * @default undefined
     * @public
     */
    stripLines?: Array<dxGanttStripLine>;
    /**
     * @docid
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskTooltipContentTemplate?: template | ((container: DxElement, task: any) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param2 item:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskTimeTooltipContentTemplate?: template | ((container: DxElement, item: TimeTooltipTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param2 item:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskProgressTooltipContentTemplate?: template | ((container: DxElement, item: ProgressTooltipTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param2 item:object
     * @type_function_param2_field cellSize:object
     * @type_function_param2_field taskData:object
     * @type_function_param2_field taskHTML:object
     * @type_function_param2_field taskPosition:object
     * @type_function_param2_field taskResources:Array<object>
     * @type_function_param2_field taskSize:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskContentTemplate?: template | ((container: DxElement, item: TaskContentTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @default 0
     * @public
     */
    rootValue?: any;
    /**
     * @docid
     * @default null
     * @public
     */
    startDateRange?: Date;
    /**
     * @docid
     * @default null
     * @public
     */
    endDateRange?: Date;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxGantt extends Widget<dxGanttOptions> {
    /**
     * @docid
     * @publicName getTaskData(key)
     * @param1 key:object
     * @return Object
     * @public
     */
    getTaskData(key: any): any;
    /**
     * @docid
     * @publicName getDependencyData(key)
     * @param1 key:object
     * @return Object
     * @public
     */
    getDependencyData(key: any): any;
    /**
     * @docid
     * @publicName getResourceData(key)
     * @param1 key:object
     * @return Object
     * @public
     */
    getResourceData(key: any): any;
    /**
     * @docid
     * @publicName getResourceAssignmentData(key)
     * @param1 key:object
     * @return Object
     * @public
     */
    getResourceAssignmentData(key: any): any;
    /**
     * @docid
     * @publicName insertTask(data)
     * @param1 data:object
     * @public
     */
    insertTask(data: any): void;
    /**
     * @docid
     * @publicName deleteTask(key)
     * @param1 key:object
     * @public
     */
    deleteTask(key: any): void;
    /**
     * @docid
     * @publicName updateTask(key, data)
     * @param1 key:object
     * @param2 data:object
     * @public
     */
    updateTask(key: any, data: any): void;
    /**
     * @docid
     * @publicName insertDependency(data)
     * @param1 data:object
     * @public
     */
    insertDependency(data: any): void;
    /**
     * @docid
     * @publicName deleteDependency(key)
     * @param1 key:object
     * @public
     */
    deleteDependency(key: any): void;
    /**
     * @docid
     * @publicName insertResource(data, taskKeys)
     * @param1 data:object
     * @param2 taskKeys?:Array<object>
     * @public
     */
    insertResource(data: any, taskKeys?: Array<any>): void;
    /**
     * @docid
     * @publicName deleteResource(key)
     * @param1 key:object
     * @public
     */
    deleteResource(key: any): void;
    /**
     * @docid
     * @publicName assignResourceToTask(resourceKey, taskKey)
     * @param1 resourceKey:object
     * @param2 taskKey:object
     * @public
     */
    assignResourceToTask(resourceKey: any, taskKey: any): void;
    /**
     * @docid
     * @publicName unassignResourceFromTask(resourceKey, taskKey)
     * @param1 resourceKey:object
     * @param2 taskKey:object
     * @public
     */
    unassignResourceFromTask(resourceKey: any, taskKey: any): void;
    /**
     * @docid
     * @publicName getTaskResources(key)
     * @param1 key:object
     * @return Array<object>
     * @public
     */
    getTaskResources(key: any): Array<any>;
    /**
     * @docid
     * @publicName getVisibleTaskKeys()
     * @return Array<object>
     * @public
     */
    getVisibleTaskKeys(): Array<any>;
    /**
     * @docid
     * @publicName getVisibleDependencyKeys()
     * @return Array<object>
     * @public
     */
    getVisibleDependencyKeys(): Array<any>;
    /**
     * @docid
     * @publicName getVisibleResourceKeys()
     * @return Array<object>
     * @public
     */
    getVisibleResourceKeys(): Array<any>;
    /**
     * @docid
     * @publicName getVisibleResourceAssignmentKeys()
     * @return Array<object>
     * @public
     */
    getVisibleResourceAssignmentKeys(): Array<any>;
    /**
     * @docid
     * @publicName updateDimensions()
     * @public
     */
    updateDimensions(): void;
    /**
     * @docid
     * @publicName scrollToDate(date)
     * @public
     */
    scrollToDate(date: Date | Number | string): void;
    /**
     * @docid
     * @publicName showResourceManagerDialog()
     * @public
     */
    showResourceManagerDialog(): void;
    /**
     * @docid
     * @publicName expandAll()
     * @public
     */
    expandAll(): void;
    /**
     * @docid
     * @publicName collapseAll()
     * @public
     */
    collapseAll(): void;
    /**
     * @docid
     * @publicName expandAllToLevel(level)
     * @public
     */
    expandAllToLevel(level: Number): void;
    /**
     * @docid
     * @publicName expandToTask(key)
     * @param1 key:object
     * @public
     */
    expandToTask(key: any): void;
    /**
     * @docid
     * @publicName collapseTask(key)
     * @param1 key:object
     * @public
     */
    collapseTask(key: any): void;
    /**
     * @docid
     * @publicName expandTask(key)
     * @param1 key:object
     * @public
     */
    expandTask(key: any): void;
    /**
     * @docid
     * @publicName refresh()
     * @return Promise<void>
     * @public
     */
    refresh(): DxPromise<void>;
    /**
     * @docid
     * @publicName showResources(value)
     * @public
     */
     showResources(value: boolean): void;
     /**
     * @docid
     * @publicName showDependencies(value)
     * @public
     */
      showDependencies(value: boolean): void;
     /**
     * @docid
     * @publicName zoomIn()
     * @public
     */
      zoomIn(): void;
      /**
     * @docid
     * @publicName zoomOut()
     * @public
     */
      zoomOut(): void;
     /**
     * @docid
     * @publicName unassignAllResourcesFromTask(taskKey)
     * @param1 taskKey:object
     * @public
     */
      unassignAllResourcesFromTask(taskKey: any): void;
     /**
     * @docid
     * @publicName showTaskDetailsDialog(taskKey)
     * @param1 taskKey:object
     * @public
     */
      showTaskDetailsDialog(taskKey: any): void;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttToolbar {
    /**
     * @docid
     * @type Array<dxGanttToolbarItem,Enums.GanttPredefinedToolbarItem>
     * @public
     */
    items?: Array<ToolbarItem | GanttPredefinedToolbarItem>;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttContextMenu {
    /**
     * @docid
     * @default true
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @type Array<dxGanttContextMenuItem,Enums.GanttPredefinedContextMenuItem>
     * @public
     */
    items?: Array<ContextMenuItem | GanttPredefinedContextMenuItem>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxGantt
 */
export type ToolbarItem = dxGanttToolbarItem;

/**
 * @deprecated Use ToolbarItem instead
 * @namespace DevExpress.ui
 */
export interface dxGanttToolbarItem extends dxToolbarItem {
    /**
     * @docid
     * @public
     */
    name?: GanttPredefinedToolbarItem | string;
    /**
     * @docid
     * @default "before"
     * @public
     */
    location?: ToolbarItemLocation;
}

/**
 * @public
 * @namespace DevExpress.ui.dxGantt
 */
export type ContextMenuItem = dxGanttContextMenuItem;

/**
 * @deprecated Use ContextMenuItem instead
 * @namespace DevExpress.ui
 */
export interface dxGanttContextMenuItem extends dxContextMenuItem {
    /**
     * @docid
     * @type Enums.GanttPredefinedContextMenuItem|string
     * @public
     */
    name?: GanttPredefinedContextMenuItem | string;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttStripLine {
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    end?: Date | number | string | (() => Date | number | string) | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    start?: Date | number | string | (() => Date | number | string) | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    title?: string | undefined;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttSorting {
    /**
     * @docid
     * @default "Sort Ascending"
     */
    ascendingText?: string;
    /**
     * @docid
     * @default "Clear Sorting"
     */
    clearText?: string;
    /**
     * @docid
     * @default "Sort Descending"
     */
    descendingText?: string;
    /**
     * @docid
     * @default "single"
     */
    mode?: SingleMultipleOrNone | string;
    /**
     * @docid
     * @default false
     */
    showSortIndexes?: boolean;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttFilterRow {
    /**
     * @docid
     * @default "End"
     */
    betweenEndText?: string;
    /**
     * @docid
     * @default "Start"
     */
    betweenStartText?: string;
    /**
     * @docid
     */
    operationDescriptions?: dxGanttFilterRowOperationDescriptions;
    /**
     * @docid
     * @default "Reset"
     */
    resetOperationText?: string;
    /**
     * @docid
     * @default "(All)"
     */
    showAllText?: string;
    /**
     * @docid
     * @default true
     */
    showOperationChooser?: boolean;
    /**
     * @docid
     * @default false
     */
    visible?: boolean;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttFilterRowOperationDescriptions {
    /**
     * @docid
     * @default "Between"
     */
    between?: string;
    /**
     * @docid
     * @default "Contains"
     */
    contains?: string;
    /**
     * @docid
     * @default "Ends with"
     */
    endsWith?: string;
    /**
     * @docid
     * @default "Equals"
     */
    equal?: string;
    /**
     * @docid
     * @default "Greater than"
     */
    greaterThan?: string;
    /**
     * @docid
     * @default "Greater than or equal to"
     */
    greaterThanOrEqual?: string;
    /**
     * @docid
     * @default "Less than"
     */
    lessThan?: string;
    /**
     * @docid
     * @default "Less than or equal to"
     */
    lessThanOrEqual?: string;
    /**
     * @docid
     * @default "Does not contain"
     */
    notContains?: string;
    /**
     * @docid
     * @default "Does not equal"
     */
    notEqual?: string;
    /**
     * @docid
     * @default "Starts with"
     */
    startsWith?: string;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttHeaderFilter {
    /**
     * @docid
     * @default false
     * @deprecated
     */
    allowSearch?: boolean;
    /**
     * @docid
     * @default true
     */
    allowSelectAll?: boolean;
    /**
     * @docid
     * @default 315 &for(Material)
     * @default 315 &for(Fluent)
     * @default 325
     */
    height?: number;
    /**
     * @docid
     */
    search?: HeaderFilterSearchConfig;
    /**
     * @docid
     * @default 500
     * @deprecated
     */
    searchTimeout?: number;
    /**
     * @docid
     */
    texts?: dxGanttHeaderFilterTexts;
    /**
     * @docid
     * @default false
     */
    visible?: boolean;
    /**
     * @docid
     * @default 252
     */
    width?: number;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttHeaderFilterTexts {
    /**
     * @docid
     * @default "Cancel"
     */
    cancel?: string;
    /**
     * @docid
     * @default "(Blanks)"
     */
    emptyValue?: string;
    /**
     * @docid
     * @default "Ok"
     */
    ok?: string;
}

/** @public */
export type Properties = dxGanttOptions;

/** @deprecated use Properties instead */
export type Options = dxGanttOptions;

/** @public */
export type Column<TRowData = any, TKey = any> = dxGanttColumn<TRowData, TKey>;

/**
 * @namespace DevExpress.ui
 * @deprecated Use the Column type instead
 */
export type dxGanttColumn<TRowData = any, TKey = any> = Omit<dxGanttColumnBlank<TRowData, TKey>, 'allowEditing' | 'allowFixing' | 'allowHiding' | 'allowReordering' | 'allowResizing' | 'allowSearch' | 'buttons' | 'columns' | 'editCellTemplate' | 'editorOptions' | 'fixed' | 'fixedPosition' | 'formItem' | 'hidingPriority' | 'isBand' | 'lookup' | 'name' | 'ownerBand' | 'renderAsync' | 'setCellValue' | 'showEditorAlways' | 'showInColumnChooser' | 'type' | 'validationRules' >;

/**
 * @docid dxGanttColumn
 * @export dxGanttColumn
 * @inherits dxTreeListColumn
 * @namespace DevExpress.ui
 */
 interface dxGanttColumnBlank<TRowData = any, TKey = any> extends TreeListColumn<TRowData, TKey> {
    /**
     * @hidden
     * @docid dxGanttColumn.allowEditing
     */
     allowEditing: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowFixing
     */
     allowFixing: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowHiding
     */
     allowHiding: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowReordering
     */
     allowReordering: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowResizing
     */
     allowResizing: any;
    /**
     * @hidden
     * @docid dxGanttColumn.allowSearch
     */
     allowSearch: any;
    /**
     * @hidden
     * @docid dxGanttColumn.buttons
     */
    buttons: any;
    /**
     * @hidden
     * @docid dxGanttColumn.columns
     */
    columns: any;
    /**
     * @hidden
     * @docid dxGanttColumn.editorOptions
     */
    editorOptions: any;
    /**
     * @hidden
     * @type template
     * @docid dxGanttColumn.editCellTemplate
     */
    editCellTemplate: any;
    /**
     * @hidden
     * @docid dxGanttColumn.fixed
     */
    fixed: any;
    /**
     * @hidden
     * @docid dxGanttColumn.fixedPosition
     */
    fixedPosition: any;
    /**
     * @hidden
     * @docid dxGanttColumn.formItem
     */
     formItem: any;
    /**
     * @hidden
     * @docid dxGanttColumn.hidingPriority
     */
     hidingPriority: any;
    /**
     * @hidden
     * @docid dxGanttColumn.isBand
     */
     isBand: any;
    /**
     * @hidden
     * @docid dxGanttColumn.lookup
     */
     lookup: any;
    /**
     * @hidden
     * @docid dxGanttColumn.name
     */
     name: any;
    /**
     * @hidden
     * @docid dxGanttColumn.ownerBand
     */
     ownerBand: any;
    /**
     * @hidden
     * @docid dxGanttColumn.renderAsync
     */
     renderAsync: any;
    /**
     * @hidden
     * @docid dxGanttColumn.setCellValue
     */
     setCellValue: any;
    /**
     * @hidden
     * @docid dxGanttColumn.showEditorAlways
     */
     showEditorAlways: any;
    /**
     * @hidden
     * @docid dxGanttColumn.showInColumnChooser
     */
     showInColumnChooser: any;
    /**
     * @hidden
     * @docid dxGanttColumn.validationRules
     */
     validationRules: any;
    /**
     * @hidden
     * @docid dxGanttColumn.type
     */
    type: any;
 }

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onContextMenuPreparing' | 'onCustomCommand' | 'onDependencyDeleted' | 'onDependencyDeleting' | 'onDependencyInserted' | 'onDependencyInserting' | 'onResourceAssigned' | 'onResourceAssigning' | 'onResourceDeleted' | 'onResourceDeleting' | 'onResourceInserted' | 'onResourceInserting' | 'onResourceManagerDialogShowing' | 'onResourceUnassigned' | 'onResourceUnassigning' | 'onScaleCellPrepared' | 'onSelectionChanged' | 'onTaskClick' | 'onTaskDblClick' | 'onTaskDeleted' | 'onTaskDeleting' | 'onTaskEditDialogShowing' | 'onTaskInserted' | 'onTaskInserting' | 'onTaskMoving' | 'onTaskUpdated' | 'onTaskUpdating'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxGanttOptions.onContentReady
 * @type_function_param1 e:{ui/gantt:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxGanttOptions.onDisposing
 * @type_function_param1 e:{ui/gantt:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxGanttOptions.onInitialized
 * @type_function_param1 e:{ui/gantt:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxGanttOptions.onOptionChanged
 * @type_function_param1 e:{ui/gantt:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
