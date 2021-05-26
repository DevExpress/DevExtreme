import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxEvent,
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    dxTreeListColumn
} from './tree_list';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

import {
    dxToolbarItem
} from './toolbar';

import {
    dxContextMenuItem
} from './context_menu';

import {
    template
} from '../core/templates/template';

import {
    DxPromise
} from '../core/utils/deferred';

/** @public */
export type ContentReadyEvent = EventInfo<dxGantt>;

/** @public */
export type ContextMenuPreparingEvent = Cancelable & {
    readonly component?: dxGantt;
    readonly element?: DxElement;
    readonly event?: DxEvent;
    readonly targetKey?: any;
    readonly targetType?: string;
    readonly data?: any;
    readonly items?: Array<any>
}

/** @public */
export type CustomCommandEvent = {
    readonly component?: dxGantt;
    readonly element?: DxElement;
    readonly name: string;
}

/** @public */
export type DependencyDeletedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type DependencyDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type DependencyInsertedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type DependencyInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
}

/** @public */
export type DisposingEvent = EventInfo<dxGantt>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxGantt>;

/** @public */
export type OptionChangedEvent = EventInfo<dxGantt> & ChangedOptionInfo;

/** @public */
export type ResourceAssignedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type ResourceAssigningEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
}

/** @public */
export type ResourceDeletedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type ResourceDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type ResourceInsertedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type ResourceInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
}

/** @public */
export type ResourceUnassignedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type ResourceUnassigningEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type SelectionChangedEvent = EventInfo<dxGantt> & {
    readonly selectedRowKey?: any;
}

/** @public */
export type TaskClickEvent = NativeEventInfo<dxGantt> & {
    readonly key?: any;
    readonly data?: any;
}

/** @public */
export type TaskDblClickEvent = Cancelable & NativeEventInfo<dxGantt> & {
    readonly key?: any;
    readonly data?: any;
}

/** @public */
export type TaskDeletedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type TaskDeletingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type TaskEditDialogShowingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
    readonly readOnlyFields?: Array<string>;
    readonly hiddenFields?: Array<string>;
}

/** @public */
export type ResourceManagerDialogShowingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: Array<any>;
    readonly key: any;
}

/** @public */
export type TaskInsertedEvent = EventInfo<dxGantt> & {
    readonly value?: any;
    readonly key: any;
}

/** @public */
export type TaskInsertingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly values: any;
}

/** @public */
export type TaskMovingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly newValues: any;
    readonly values: any;
    readonly key: any;
}

/** @public */
export type TaskUpdatedEvent = EventInfo<dxGantt> & {
    readonly values: any;
    readonly key: any;
}

/** @public */
export type TaskUpdatingEvent = Cancelable & EventInfo<dxGantt> & {
    readonly newValues: any;
    readonly values: any;
    readonly key: any
}

/** @public */
export type TaskContentTemplateData = {
    readonly cellSize: any;
    readonly isMilestone: boolean;
    readonly taskData: any;
    readonly taskHTML: any;
    readonly taskPosition: any;
    readonly taskResources:  Array<any>;
    readonly taskSize: any;
}

/** @public */
export type ProgressTooltipTemplateData = {
    readonly progress: number;
}

/** @public */
export type TimeTooltipTemplateData = {
    readonly start: Date;
    readonly end: Date;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
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
     * @default undefined
     * @public
     */
    columns?: Array<dxTreeListColumn | string>;
    /**
     * @docid
     * @default null
     * @public
     */
    dependencies?: {
      /**
       * @docid
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function,
      /**
       * @docid
       * @default "predecessorId"
       */
      predecessorIdExpr?: string | Function,
      /**
       * @docid
       * @default "successorId"
       */
      successorIdExpr?: string | Function,
      /**
       * @docid
       * @default "type"
       */
      typeExpr?: string | Function
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
      allowDependencyAdding?: boolean,
      /**
       * @docid
       * @default true
       */
      allowDependencyDeleting?: boolean,
      /**
       * @docid
       * @default true
       */
      allowResourceAdding?: boolean,
      /**
       * @docid
       * @default true
       */
      allowResourceDeleting?: boolean,
      /**
       * @docid
       * @default true
       */
      allowResourceUpdating?: boolean,
      /**
       * @docid
       * @default true
       */
      allowTaskAdding?: boolean,
      /**
       * @docid
       * @default true
       */
      allowTaskDeleting?: boolean,
      /**
       * @docid
       * @default true
       */
      allowTaskResourceUpdating?: boolean,
      /**
       * @docid
       * @default true
       */
      allowTaskUpdating?: boolean,
      /**
       * @docid
       * @default false
       */
      enabled?: boolean
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
      validateDependencies?: boolean,
      /**
       * @docid
       * @default false
       */
      autoUpdateParentTasks?: boolean
    };
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 selectedRowKey:any
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 name:String
     * @action
     * @public
     */
    onCustomCommand?: ((e: CustomCommandEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 cancel:boolean
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 targetKey:any
     * @type_function_param1_field6 targetType:string
     * @type_function_param1_field7 data:any
     * @type_function_param1_field8 items:Array<object>
     * @action
     * @public
     */
    onContextMenuPreparing?: ((e: ContextMenuPreparingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @public
     */
    onTaskInserting?: ((e: TaskInsertingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onTaskInserted?: ((e: TaskInsertedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @public
     */
    onTaskDeleting?: ((e: TaskDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onTaskDeleted?: ((e: TaskDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 newValues:any
     * @type_function_param1_field6 values:any
     * @type_function_param1_field7 key:any
     * @action
     * @public
     */
    onTaskUpdating?: ((e: TaskUpdatingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onTaskUpdated?: ((e: TaskUpdatedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 newValues:any
     * @type_function_param1_field6 values:any
     * @type_function_param1_field7 key:any
     * @action
     * @public
     */
    onTaskMoving?: ((e: TaskMovingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 readOnlyFields:Array<string>
     * @type_function_param1_field8 hiddenFields:Array<string>
     * @action
     * @public
     */
    onTaskEditDialogShowing?: ((e: TaskEditDialogShowingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 cancel:boolean
     * @type_function_param1_field4 values:Array<any>
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onResourceManagerDialogShowing?: ((e: ResourceManagerDialogShowingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @public
     */
    onDependencyInserting?: ((e: DependencyInsertingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onDependencyInserted?: ((e: DependencyInsertedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @public
     */
    onDependencyDeleting?: ((e: DependencyDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onDependencyDeleted?: ((e: DependencyDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @public
     */
    onResourceInserting?: ((e: ResourceInsertingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onResourceInserted?: ((e: ResourceInsertedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @public
     */
    onResourceDeleting?: ((e: ResourceDeletingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onResourceDeleted?: ((e: ResourceDeletedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @public
     */
    onResourceAssigning?: ((e: ResourceAssigningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onResourceAssigned?: ((e: ResourceAssignedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @public
     */
    onResourceUnassigning?: ((e: ResourceUnassigningEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @public
     */
    onResourceUnassigned?: ((e: ResourceUnassignedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 data:any
     * @action
     * @public
     */
    onTaskClick?: ((e: TaskClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxGantt
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 data:any
     * @action
     * @public
     */
    onTaskDblClick?: ((e: TaskDblClickEvent) => void);
    /**
     * @docid
     * @default null
     * @public
     */
    resourceAssignments?: {
      /**
       * @docid
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function,
      /**
       * @docid
       * @default "resourceId"
       */
      resourceIdExpr?: string | Function,
      /**
       * @docid
       * @default "taskId"
       */
      taskIdExpr?: string | Function
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
      colorExpr?: string | Function,
      /**
       * @docid
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function,
      /**
       * @docid
       * @default "text"
       */
      textExpr?: string | Function
    };
    /**
     * @docid
     * @type Enums.GanttScaleType
     * @default "auto"
     * @public
     */
    scaleType?: 'auto' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
    /**
     * @docid
     * @default undefined
     * @public
     */
    selectedRowKey?: any;
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
    showRowLines?: boolean;
    /**
     * @docid
     * @default 300
     * @public
     */
    taskListWidth?: number;
    /**
     * @docid
     * @type Enums.GanttTaskTitlePosition
     * @default "inside"
     * @public
     */
    taskTitlePosition?: 'inside' | 'outside' | 'none';
    /**
     * @docid
     * @type Enums.FirstDayOfWeek
     * @default undefined
     * @public
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
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
      colorExpr?: string | Function,
      /**
       * @docid
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @default "end"
       */
      endExpr?: string | Function,
      /**
       * @docid
       * @default "id"
       */
      keyExpr?: string | Function,
      /**
       * @docid
       * @default "parentId"
       */
      parentIdExpr?: string | Function,
      /**
       * @docid
       * @default "progress"
       */
      progressExpr?: string | Function,
      /**
       * @docid
       * @default "start"
       */
      startExpr?: string | Function,
      /**
       * @docid
       * @default "title"
       */
      titleExpr?: string | Function
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
     * @type_function_param1 container:DxElement
     * @type_function_param2 task:any
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskTooltipContentTemplate?: template | ((container: DxElement, task: any) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param1 container:DxElement
     * @type_function_param2 item:object
     * @type_function_param2_field1 start:Date
     * @type_function_param2_field2 end:Date
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskTimeTooltipContentTemplate?: template | ((container: DxElement, item: TimeTooltipTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param1 container:DxElement
     * @type_function_param2 item:object
     * @type_function_param2_field1 progress:number
     * @type_function_return string|Element|jQuery
     * @public
     */
    taskProgressTooltipContentTemplate?: template | ((container: DxElement, item: ProgressTooltipTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param1 container:DxElement
     * @type_function_param2 item:object
     * @type_function_param2_field1 cellSize:object
     * @type_function_param2_field2 isMilestone:boolean
     * @type_function_param2_field3 taskData:object
     * @type_function_param2_field4 taskHTML:object
     * @type_function_param2_field5 taskPosition:object
     * @type_function_param2_field6 taskResources:Array<object>
     * @type_function_param2_field7 taskSize:object
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
}
/**
 * @docid
 * @inherits Widget
 * @module ui/gantt
 * @export default
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
    insertResource(data: any,  taskKeys?: Array<any>): void;
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
     * @param1 date:Date|Number|string
     * @public
     */
    scrollToDate(date: Date | Number | string): void;
    /**
     * @docid 
     * @publicName exportToPdf(options)
     * @param1 options:object
     * @return Promise<any>
     * @public
     */
    exportToPdf(options: any): DxPromise<any>;
    /**
     * @docid
     * @publicName showResourceManagerDialog()
     * @public
     */
    showResourceManagerDialog(): void;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxGanttToolbar {
    /**
     * @docid
     * @type Array<dxGanttToolbarItem,Enums.GanttToolbarItem>
     * @public
     */
    items?: Array<dxGanttToolbarItem | 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'taskDetails' | 'fullScreen' | 'resourceManager'>;
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
    enabled?: boolean
    /**
     * @docid
     * @type Array<dxGanttContextMenuItem,Enums.GanttContextMenuItem>
     * @public
     */
    items?: Array<dxGanttContextMenuItem | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails'>;
}

/**
 * @docid
 * @inherits dxToolbarItem
 * @namespace DevExpress.ui
 */
export interface dxGanttToolbarItem extends dxToolbarItem {
    /**
     * @docid
     * @type Enums.GanttToolbarItem|string
     * @public
     */
    name?: 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'taskDetails' | 'fullScreen' | 'resourceManager' | string;
    /**
     * @docid
     * @default "before"
     * @type Enums.ToolbarItemLocation
     * @public
     */
    location?: 'after' | 'before' | 'center';
}

/**
 * @docid
 * @inherits dxContextMenuItem
 * @namespace DevExpress.ui
 */
export interface dxGanttContextMenuItem extends dxContextMenuItem {
    /**
     * @docid
     * @type Enums.GanttContextMenuItem|string
     * @public
     */
    name?: 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails' | string;
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
    cssClass?: string;
    /**
     * @docid
     * @type_function_return Date|number|string
     * @default undefined
     * @public
     */
    end?: Date | number | string | (() => Date | number | string);
    /**
     * @docid
     * @type_function_return Date|number|string
     * @default undefined
     * @public
     */
    start?: Date | number | string | (() => Date | number | string);
    /**
     * @docid
     * @default undefined
     * @public
     */
    title?: string;
}

/** @public */
export type Properties = dxGanttOptions;

/** @deprecated use Properties instead */
export type Options = dxGanttOptions;

/** @deprecated use Properties instead */
export type IOptions = dxGanttOptions;
