import {
    dxElement
} from '../core/element';

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

export interface dxGanttOptions extends WidgetOptions<dxGantt> {
    /**
     * @docid dxGanttOptions.allowSelection
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowSelection?: boolean;
    /**
     * @docid dxGanttOptions.columns
     * @type Array<dxTreeListColumn,string>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    columns?: Array<dxTreeListColumn | string>;
    /**
     * @docid dxGanttOptions.dependencies
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dependencies?: { dataSource?: Array<any> | DataSource | DataSourceOptions, keyExpr?: string | Function, predecessorIdExpr?: string | Function, successorIdExpr?: string | Function, typeExpr?: string | Function };
    /**
     * @docid dxGanttOptions.editing
     * @type Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editing?: { allowDependencyAdding?: boolean, allowDependencyDeleting?: boolean, allowResourceAdding?: boolean, allowResourceDeleting?: boolean, allowResourceUpdating?: boolean, allowTaskAdding?: boolean, allowTaskDeleting?: boolean, allowTaskUpdating?: boolean, enabled?: boolean };
    /**
     * @docid dxGanttOptions.validation
     * @type Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validation?: { validateDependencies?: boolean, autoUpdateParentTasks?: boolean };
    /**
     * @docid dxGanttOptions.onSelectionChanged
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
     * @docid dxGanttOptions.onCustomCommand
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
     * @docid dxGanttOptions.onTaskInserting
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
     * @docid dxGanttOptions.onTaskDeleting
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
     * @docid dxGanttOptions.onTaskUpdating
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
     * @docid dxGanttOptions.onTaskMoving
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
     * @docid dxGanttOptions.onTaskEditDialogShowing
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 cancel:boolean
     * @type_function_param1_field5 values:any
     * @type_function_param1_field6 key:any
     * @type_function_param1_field7 readOnlyFields:Array<string>
     * @type_function_param1_field8 hiddenFields:Array<string>
     * 
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onTaskEditDialogShowing?: ((e: { component?: dxGantt, element?: dxElement, model?: any, cancel?: boolean, values?: any, key?: any, readOnlyFields?: Array<string>, hiddenFields?: Array<string> }) => any);
    /**
     * @docid dxGanttOptions.onDependencyInserting
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
     * @docid dxGanttOptions.onDependencyDeleting
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
     * @docid dxGanttOptions.onResourceInserting
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
     * @docid dxGanttOptions.onResourceDeleting
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
     * @docid dxGanttOptions.onResourceAssigning
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
     * @docid dxGanttOptions.onResourceUnassigning
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
     * @docid dxGanttOptions.resourceAssignments
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resourceAssignments?: { dataSource?: Array<any> | DataSource | DataSourceOptions, keyExpr?: string | Function, resourceIdExpr?: string | Function, taskIdExpr?: string | Function };
    /**
     * @docid dxGanttOptions.resources
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    resources?: { dataSource?: Array<any> | DataSource | DataSourceOptions, keyExpr?: string | Function, textExpr?: string | Function };
    /**
     * @docid dxGanttOptions.scaleType
     * @type Enums.GanttScaleType
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    scaleType?: 'auto' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
    /**
     * @docid dxGanttOptions.selectedRowKey
     * @type any
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedRowKey?: any;
    /**
     * @docid dxGanttOptions.showResources
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showResources?: boolean;
    /**
     * @docid dxGanttOptions.showRowLines
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showRowLines?: boolean;
    /**
     * @docid dxGanttOptions.taskListWidth
     * @type number
     * @default 300
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    taskListWidth?: number;
    /**
     * @docid dxGanttOptions.taskTitlePosition
     * @type Enums.GanttTaskTitlePosition
     * @default "inside"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    taskTitlePosition?: 'inside' | 'outside' | 'none';
    /**
     * @docid dxGanttOptions.firstDayOfWeek
     * @extends FirstDayOfWeek
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * @docid dxGanttOptions.tasks
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tasks?: { dataSource?: Array<any> | DataSource | DataSourceOptions, endExpr?: string | Function, keyExpr?: string | Function, parentIdExpr?: string | Function, progressExpr?: string | Function, startExpr?: string | Function, titleExpr?: string | Function };
    /**
     * @docid dxGanttOptions.toolbar
     * @type dxGanttToolbar
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbar?: dxGanttToolbar;
    /**
     * @docid dxGanttOptions.contextMenu
     * @type Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextMenu?: { enabled?: boolean, items?: Array<dxContextMenuItem| 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | 'deleteDependency' | 'taskDetails'> };
    /**
     * @docid dxGanttOptions.stripLines
     * @type Array<dxGanttStripLine>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stripLines?: Array<dxGanttStripLine>;
}
/**
 * @docid dxGantt
 * @inherits Widget
 * @module ui/gantt
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxGantt extends Widget {
    constructor(element: Element, options?: dxGanttOptions)
    constructor(element: JQuery, options?: dxGanttOptions)
}

export interface dxGanttToolbar {
    /**
     * @docid dxGanttToolbar.items
     * @type Array<dxGanttToolbarItem,Enums.GanttToolbarItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxGanttToolbarItem | 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut'>;
}

export interface dxGanttToolbarItem extends dxToolbarItem {
    /**
     * @docid dxGanttToolbarItem.name
     * @type Enums.GanttToolbarItem|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'separator' | 'undo' | 'redo' | 'expandAll' | 'collapseAll' | 'addTask' | 'deleteTask' | 'zoomIn' | 'zoomOut' | string;
    /**
     * @docid dxGanttToolbarItem.location
     * @default "before"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before' | 'center';
}

export interface dxGanttStripLine {
    /**
     * @docid dxGanttStripLine.cssClass
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid dxGanttStripLine.end
     * @type Date|number|string|function
     * @type_function_return Date|number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    end?: Date | number | string | (() => Date | number | string);
    /**
     * @docid dxGanttStripLine.start
     * @type Date|number|string|function
     * @type_function_return Date|number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    start?: Date | number | string | (() => Date | number | string);
    /**
     /**
     * @docid dxGanttStripLine.title
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
