import {
    TElement
} from '../core/element';

import {
    TEvent
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
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 selectedRowKey:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxGantt, element?: TElement, model?: any, selectedRowKey?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field3 name:String
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCustomCommand?: ((e: { component?: dxGantt, element?: TElement, name?: string }) => void);
        /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
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
    onContextMenuPreparing?: ((e: { component?: dxGantt, element?: TElement, cancel?: boolean, event?: TEvent, targetKey?: any, targetType?: string, data?: any, items?: Array<any> }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskInserting?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, values?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskInserted?: ((e: { component?: dxGantt, element?: TElement, model?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskDeleting?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskDeleted?: ((e: { component?: dxGantt, element?: TElement, model?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 newValues:any
     * @type_function_param1_field6 values:any
     * @type_function_param1_field7 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskUpdating?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, newValues?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskUpdated?: ((e: { component?: dxGantt, element?: TElement, model?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 newValues:any
     * @type_function_param1_field6 values:any
     * @type_function_param1_field7 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskMoving?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, newValues?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 readOnlyFields:Array<string>
     * @type_function_param1_field8 hiddenFields:Array<string>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskEditDialogShowing?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, values?: any, key?: any, readOnlyFields?: Array<string>, hiddenFields?: Array<string> }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDependencyInserting?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, values?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDependencyInserted?: ((e: { component?: dxGantt, element?: TElement, model?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDependencyDeleting?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDependencyDeleted?: ((e: { component?: dxGantt, element?: TElement, model?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceInserting?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, values?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceInserted?: ((e: { component?: dxGantt, element?: TElement, model?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceDeleting?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, values?: any, key?: any }) => void);
     /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceDeleted?: ((e: { component?: dxGantt, element?: TElement, model?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceAssigning?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, values?: any }) => void);
     /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceAssigned?: ((e: { component?: dxGantt, element?: TElement, model?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceUnassigning?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, values?: any, key?: any }) => void);
     /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 values:any
     * @type_function_param1_field5 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceUnassigned?: ((e: { component?: dxGantt, element?: TElement, model?: any, values?: any, key?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 data:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskClick?: ((e: { component?: dxGantt, element?: TElement, model?: any, event?: TEvent, key?: any, data?: any }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 data:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskDblClick?: ((e: { component?: dxGantt, element?: TElement, model?: any, cancel?: boolean, event?: TEvent, key?: any, data?: any }) => void);
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
     * @type_function_param1 container:dxElement
     * @type_function_param2 task:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    taskTooltipContentTemplate?: template | ((container: TElement, task: any) => string | TElement);
    /**
     * @docid
     * @type_function_param1 container:dxElement
     * @type_function_param2 item:object
     * @type_function_param2_field1 cellSize:object
     * @type_function_param2_field2 isMilestone:boolean
     * @type_function_param2_field3 taskData:object
     * @type_function_param2_field4 taskHTML:object
     * @type_function_param2_field5 taskPosition:object
     * @type_function_param2_field6 taskResources:Array<object>
     * @type_function_param2_field7 taskSize:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    taskContentTemplate?: template | ((container: TElement, item: {cellSize: any, isMilestone: boolean, taskData: any, taskHTML: any, taskPosition: any, taskResources:  Array<any>, taskSize: any }) => string | TElement);
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
    constructor(element: TElement, options?: dxGanttOptions)
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
    items?: Array<dxGanttToolbarItem | 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut'>;
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
    items?: Array<dxGanttContextMenuItem | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails'>;
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
    name?: 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | string;
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
    name?: 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails' | string;
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

export type Options = dxGanttOptions;

/** @deprecated use Options instead */
export type IOptions = dxGanttOptions;
