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

export interface dxGanttOptions extends WidgetOptions<dxGantt> {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSelection?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<dxTreeListColumn | string>;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dependencies?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "id"
       */
      keyExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "predecessorId"
       */
      predecessorIdExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "successorId"
       */
      successorIdExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "type"
       */
      typeExpr?: string | Function
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editing?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowDependencyAdding?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowDependencyDeleting?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowResourceAdding?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowResourceDeleting?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowResourceUpdating?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowTaskAdding?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowTaskDeleting?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowTaskResourceUpdating?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      allowTaskUpdating?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      enabled?: boolean
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validation?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      validateDependencies?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @action
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskDblClick?: ((e: TaskDblClickEvent) => void);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resourceAssignments?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "id"
       */
      keyExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "resourceId"
       */
      resourceIdExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "taskId"
       */
      taskIdExpr?: string | Function
    };
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resources?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "color"
       */
      colorExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "id"
       */
      keyExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "text"
       */
      textExpr?: string | Function
    };
    /**
     * @docid
     * @type Enums.GanttScaleType
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scaleType?: 'auto' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedRowKey?: any;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showResources?: boolean;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRowLines?: boolean;
    /**
     * @docid
     * @default 300
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    taskListWidth?: number;
    /**
     * @docid
     * @type Enums.GanttTaskTitlePosition
     * @default "inside"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    taskTitlePosition?: 'inside' | 'outside' | 'none';
    /**
     * @docid
     * @type Enums.FirstDayOfWeek
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tasks?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "color"
       */
      colorExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default null
       */
      dataSource?: Array<any> | DataSource | DataSourceOptions,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "end"
       */
      endExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "id"
       */
      keyExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "parentId"
       */
      parentIdExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "progress"
       */
      progressExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "start"
       */
      startExpr?: string | Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "title"
       */
      titleExpr?: string | Function
    };
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbar?: dxGanttToolbar;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextMenu?: dxGanttContextMenu;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stripLines?: Array<dxGanttStripLine>;
    /**
     * @docid
     * @type_function_param1 container:DxElement
     * @type_function_param2 task:any
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    taskTimeTooltipContentTemplate?: template | ((container: DxElement, item: TimeTooltipTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @type_function_param1 container:DxElement
     * @type_function_param2 item:object
     * @type_function_param2_field1 progress:number
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
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
     * @return void
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    taskContentTemplate?: template | ((container: DxElement, item: TaskContentTemplateData) => string | UserDefinedElement);
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rootValue?: any;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/gantt
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxGantt extends Widget {
    constructor(element: UserDefinedElement, options?: dxGanttOptions)
    /**
     * @docid
     * @publicName getTaskData(key)
     * @param1 key:object
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getTaskData(key: any): any;
    /**
     * @docid
     * @publicName getDependencyData(key)
     * @param1 key:object
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getDependencyData(key: any): any;
    /**
     * @docid
     * @publicName getResourceData(key)
     * @param1 key:object
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getResourceData(key: any): any;
    /**
     * @docid
     * @publicName getResourceAssignmentData(key)
     * @param1 key:object
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getResourceAssignmentData(key: any): any;
    /**
     * @docid
     * @publicName insertTask(data)
     * @param1 data:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    insertTask(data: any): void;
    /**
     * @docid
     * @publicName deleteTask(key)
     * @param1 key:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteTask(key: any): void;
    /**
     * @docid
     * @publicName updateTask(key, data)
     * @param1 key:object
     * @param2 data:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateTask(key: any, data: any): void;
    /**
     * @docid
     * @publicName insertDependency(data)
     * @param1 data:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    insertDependency(data: any): void;
    /**
     * @docid
     * @publicName deleteDependency(key)
     * @param1 key:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteDependency(key: any): void;
    /**
     * @docid
     * @publicName insertResource(data, taskKeys)
     * @param1 data:object
     * @param2 taskKeys?:Array<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    insertResource(data: any,  taskKeys?: Array<any>): void;
    /**
     * @docid
     * @publicName deleteResource(key)
     * @param1 key:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    deleteResource(key: any): void;
    /**
     * @docid
     * @publicName assignResourceToTask(resourceKey, taskKey)
     * @param1 resourceKey:object
     * @param2 taskKey:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    assignResourceToTask(resourceKey: any, taskKey: any): void;
    /**
     * @docid
     * @publicName unassignResourceFromTask(resourceKey, taskKey)
     * @param1 resourceKey:object
     * @param2 taskKey:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    unassignResourceFromTask(resourceKey: any, taskKey: any): void;
    /**
     * @docid
     * @publicName getTaskResources(key)
     * @param1 key:object
     * @return Array<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getTaskResources(key: any): Array<any>;
    /**
     * @docid
     * @publicName getVisibleTaskKeys()
     * @return Array<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleTaskKeys(): Array<any>;
    /**
     * @docid
     * @publicName getVisibleDependencyKeys()
     * @return Array<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleDependencyKeys(): Array<any>;
    /**
     * @docid
     * @publicName getVisibleResourceKeys()
     * @return Array<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleResourceKeys(): Array<any>;
    /**
     * @docid
     * @publicName getVisibleResourceAssignmentKeys()
     * @return Array<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getVisibleResourceAssignmentKeys(): Array<any>;
    /**
     * @docid
     * @publicName updateDimensions()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    updateDimensions(): void;
    /**
     * @docid
     * @publicName scrollToDate(date)
     * @param1 date:Date|Number|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scrollToDate(date: Date | Number | string): void;
    /**
     * @docid 
     * @publicName exportToPdf(options)
     * @param1 options:object
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    exportToPdf(options: any): DxPromise<any>;
    /**
     * @docid
     * @publicName showResourceManagerDialog()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showResourceManagerDialog(): void;
}

/**
 * @docid
 * @type object
 */
export interface dxGanttToolbar {
    /**
     * @docid
     * @type Array<dxGanttToolbarItem,Enums.GanttToolbarItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxGanttToolbarItem | 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'taskDetails' | 'fullScreen' | 'resourceManager'>;
}

/**
 * @docid
 * @type object
 */
export interface dxGanttContextMenu {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    enabled?: boolean
    /**
     * @docid
     * @type Array<dxGanttContextMenuItem,Enums.GanttContextMenuItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxGanttContextMenuItem | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails' | 'resourceManager'>;
}

/**
 * @docid
 * @inherits dxToolbarItem
 */
export interface dxGanttToolbarItem extends dxToolbarItem {
    /**
     * @docid
     * @type Enums.GanttToolbarItem|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'taskDetails' | 'fullScreen' | 'resourceManager' | string;
    /**
     * @docid
     * @default "before"
     * @type Enums.ToolbarItemLocation
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before' | 'center';
}

/**
 * @docid
 * @inherits dxContextMenuItem
 */
export interface dxGanttContextMenuItem extends dxContextMenuItem {
    /**
     * @docid
     * @type Enums.GanttContextMenuItem|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails' | 'resourceManager' | string;
}

/**
 * @docid
 * @type object
 */
export interface dxGanttStripLine {
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @type_function_return Date|number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    end?: Date | number | string | (() => Date | number | string);
    /**
     * @docid
     * @type_function_return Date|number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    start?: Date | number | string | (() => Date | number | string);
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
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
