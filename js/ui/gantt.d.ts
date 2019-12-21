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
    editing?: { allowDependencyAdding?: boolean, allowDependencyDeleting?: boolean, allowDependencyUpdating?: boolean, allowResourceAdding?: boolean, allowResourceDeleting?: boolean, allowResourceUpdating?: boolean, allowTaskAdding?: boolean, allowTaskDeleting?: boolean, allowTaskUpdating?: boolean, enabled?: boolean };
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
     * @docid dxGanttOptions.tasks
     * @type Object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tasks?: { dataSource?: Array<any> | DataSource | DataSourceOptions, endExpr?: string | Function, keyExpr?: string | Function, parentIdExpr?: string | Function, progressExpr?: string | Function, startExpr?: string | Function, titleExpr?: string | Function };
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

declare global {
interface JQuery {
    dxGantt(): JQuery;
    dxGantt(options: "instance"): dxGantt;
    dxGantt(options: string): any;
    dxGantt(options: string, ...params: any[]): any;
    dxGantt(options: dxGanttOptions): JQuery;
}
}
export type Options = dxGanttOptions;

/** @deprecated use Options instead */
export type IOptions = dxGanttOptions;