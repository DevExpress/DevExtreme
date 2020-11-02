import {
    dxElement
} from '../core/element';

import {
    event
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
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSelection?: boolean;
    /**
     * @docid
     * @type Array<dxTreeListColumn,string>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<dxTreeListColumn | string>;
    /**
     * @docid
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dependencies?: {
      /**
      * @docid
      * @type Array<Object>|DataSource|DataSourceOptions
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
     * @type Object
     * @prevFileNamespace DevExpress.ui
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
     * @type Object
     * @prevFileNamespace DevExpress.ui
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
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 selectedRowKey:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxGantt, element?: dxElement, model?: any, selectedRowKey?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field3 name:String
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCustomCommand?: ((e: { component?: dxGantt, element?: dxElement, name?: string }) => any);
        /**
     * @docid
     * @extends Action
     * @type function(e)
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
    onContextMenuPreparing?: ((e: { component?: dxGantt, element?: dxElement, cancel?: boolean, event?: event, targetKey?: any, targetType?: string, data?: any, items?: Array<any> }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskInserting?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskDeleting?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 newValues:any
     * @type_function_param1_field6 values:any
     * @type_function_param1_field7 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskUpdating?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, newValues?: any, values?: any, key?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 newValues:any
     * @type_function_param1_field6 values:any
     * @type_function_param1_field7 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskMoving?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, newValues?: any, values?: any, key?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
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
    onTaskEditDialogShowing?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any, key?: any, readOnlyFields?: Array<string>, hiddenFields?: Array<string> }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDependencyInserting?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDependencyDeleting?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceInserting?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceDeleting?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceAssigning?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onResourceUnassigning?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any, key?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field5 key:any
     * @type_function_param1_field6 data:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskClick?: ((e: { component?: dxGantt, element?: dxElement, model?: any, event?: event, key?: any, data?: any }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 data:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskDblClick?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, event?: event, key?: any, data?: any }) => any);
    /**
     * @docid
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resourceAssignments?: {
      /**
      * @docid
      * @type Array<Object>|DataSource|DataSourceOptions
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
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
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
      * @type Array<Object>|DataSource|DataSourceOptions
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scaleType?: 'auto' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
    /**
     * @docid
     * @type any
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedRowKey?: any;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showResources?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRowLines?: boolean;
    /**
     * @docid
     * @type number
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
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
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
      * @type Array<Object>|DataSource|DataSourceOptions
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
     * @type dxGanttToolbar
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbar?: dxGanttToolbar;
    /**
     * @docid
     * @type dxGanttContextMenu
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextMenu?: dxGanttContextMenu;
    /**
     * @docid
     * @type Array<dxGanttStripLine>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stripLines?: Array<dxGanttStripLine>;
    /**
     * @docid
     * @type template|function
     * @type_function_param1 container:dxElement
     * @type_function_param2 task:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    taskTooltipContentTemplate?: template | ((container: dxElement, task: any) => string | Element | JQuery);
    /**
     * @docid
     * @type any
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
    constructor(element: Element, options?: dxGanttOptions)
    constructor(element: JQuery, options?: dxGanttOptions)
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
     * @type boolean
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
     * @type Enums.ToolbarItemLocation
     * @default "before"
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
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @type Date|number|string|function
     * @type_function_return Date|number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    end?: Date | number | string | (() => Date | number | string);
    /**
     * @docid
     * @type Date|number|string|function
     * @type_function_return Date|number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    start?: Date | number | string | (() => Date | number | string);
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    title?: string;
}

declare global {
interface JQuery {
    dxGantt(): JQuery;
    dxGantt(options: 'instance'): dxGantt;
    dxGantt(options: string): any;
    dxGantt(options: string, ...params: any[]): any;
    dxGantt(options: dxGanttOptions): JQuery;
}
}
export type Options = dxGanttOptions;

/** @deprecated use Options instead */
export type IOptions = dxGanttOptions;
