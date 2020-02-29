import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxCalendarOptions extends EditorOptions<dxCalendar> {
    /**
     * @docid dxCalendarOptions.activeStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid dxCalendarOptions.cellTemplate
     * @type template|function
     * @default "cell"
     * @type_function_param1 itemData:object
     * @type_function_param1_field1 date:Date
     * @type_function_param1_field2 view:string
     * @type_function_param1_field3 text:string
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cellTemplate?: template | ((itemData: { date?: Date, view?: string, text?: string }, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxCalendarOptions.dateSerializationFormat
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid dxCalendarOptions.disabledDates
     * @type Array<Date>|function(data)
     * @default null
     * @type_function_param1 data:object
     * @type_function_param1_field1 component:object
     * @type_function_param1_field2 date:Date
     * @type_function_param1_field3 view:string
     * @type_function_return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabledDates?: Array<Date> | ((data: { component?: any, date?: Date, view?: string }) => boolean);
    /**
     * @docid dxCalendarOptions.firstDayOfWeek
     * @type Enums.FirstDayOfWeek
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * @docid dxCalendarOptions.focusStateEnabled
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxCalendarOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxCalendarOptions.max
     * @type Date|number|string
     * @default new Date(3000, 0)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: Date | number | string;
    /**
     * @docid dxCalendarOptions.maxZoomLevel
     * @type Enums.CalendarZoomLevel
     * @default 'month'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxZoomLevel?: 'century' | 'decade' | 'month' | 'year';
    /**
     * @docid dxCalendarOptions.min
     * @type Date|number|string
     * @default new Date(1000, 0)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: Date | number | string;
    /**
     * @docid dxCalendarOptions.minZoomLevel
     * @type Enums.CalendarZoomLevel
     * @default 'century'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minZoomLevel?: 'century' | 'decade' | 'month' | 'year';
    /**
     * @docid dxCalendarOptions.name
     * @type string
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxCalendarOptions.showTodayButton
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showTodayButton?: boolean;
    /**
     * @docid dxCalendarOptions.value
     * @type Date|number|string
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: Date | number | string;
    /**
     * @docid dxCalendarOptions.zoomLevel
     * @type Enums.CalendarZoomLevel
     * @default 'month'
     * @fires dxCalendarOptions.onOptionChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    zoomLevel?: 'century' | 'decade' | 'month' | 'year';
}
/**
 * @docid dxCalendar
 * @isEditor
 * @inherits Editor
 * @module ui/calendar
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxCalendar extends Editor {
    constructor(element: Element, options?: dxCalendarOptions)
    constructor(element: JQuery, options?: dxCalendarOptions)
}

declare global {
interface JQuery {
    dxCalendar(): JQuery;
    dxCalendar(options: "instance"): dxCalendar;
    dxCalendar(options: string): any;
    dxCalendar(options: string, ...params: any[]): any;
    dxCalendar(options: dxCalendarOptions): JQuery;
}
}
export type Options = dxCalendarOptions;

/** @deprecated use Options instead */
export type IOptions = dxCalendarOptions;