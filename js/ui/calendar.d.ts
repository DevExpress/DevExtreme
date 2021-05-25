import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo
} from '../events/index';

import {
    template
} from '../core/templates/template';

import Editor, {
    ValueChangedInfo,
    EditorOptions
} from './editor/editor';

export interface ComponentDisabledDate<T> {
    component: T;
    readonly date: Date;
    readonly view: string;
}

/** @public */
export type ContentReadyEvent = EventInfo<dxCalendar>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxCalendar> & ValueChangedInfo;

/** @public */
export type CellTemplateData = {
    readonly date: Date,
    readonly view: string,
    readonly text?: string
}

/** @public */
export type DisabledDate = ComponentDisabledDate<dxCalendar>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxCalendarOptions extends EditorOptions<dxCalendar> {
    /**
     * @docid
     * @default true
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @default "cell"
     * @type_function_param1 itemData:object
     * @type_function_param1_field1 date:Date
     * @type_function_param1_field2 view:string
     * @type_function_param1_field3 text:string
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    cellTemplate?: template | ((itemData: CellTemplateData, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default undefined
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 data:object
     * @type_function_param1_field1 component:object
     * @type_function_param1_field2 date:Date
     * @type_function_param1_field3 view:string
     * @type_function_return boolean
     * @public
     */
    disabledDates?: Array<Date> | ((data: DisabledDate) => boolean);
    /**
     * @docid
     * @type Enums.FirstDayOfWeek
     * @default undefined
     * @public
     */
    firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @default new Date(3000, 0)
     * @public
     */
    max?: Date | number | string;
    /**
     * @docid
     * @type Enums.CalendarZoomLevel
     * @default 'month'
     * @public
     */
    maxZoomLevel?: 'century' | 'decade' | 'month' | 'year';
    /**
     * @docid
     * @default new Date(1000, 0)
     * @public
     */
    min?: Date | number | string;
    /**
     * @docid
     * @type Enums.CalendarZoomLevel
     * @default 'century'
     * @public
     */
    minZoomLevel?: 'century' | 'decade' | 'month' | 'year';
    /**
     * @docid
     * @hidden false
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    showTodayButton?: boolean;
    /**
     * @docid
     * @default null
     * @public
     */
    value?: Date | number | string;
    /**
     * @docid
     * @type Enums.CalendarZoomLevel
     * @default 'month'
     * @fires dxCalendarOptions.onOptionChanged
     * @public
     */
    zoomLevel?: 'century' | 'decade' | 'month' | 'year';
}
/**
 * @docid
 * @isEditor
 * @inherits Editor
 * @module ui/calendar
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxCalendar extends Editor {
    constructor(element: UserDefinedElement, options?: dxCalendarOptions)
}

/** @public */
export type Properties = dxCalendarOptions;

/** @deprecated use Properties instead */
export type Options = dxCalendarOptions;

/** @deprecated use Properties instead */
export type IOptions = dxCalendarOptions;
