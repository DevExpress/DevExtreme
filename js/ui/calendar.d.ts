import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    ChangedOptionInfo,
    EventInfo,
    InitializedEventInfo,
    NativeEventInfo,
} from '../events/index';

import {
    template,
} from '../core/templates/template';

import Editor, {
    ValueChangedInfo,
    EditorOptions,
} from './editor/editor';

import {
    FirstDayOfWeek,
} from '../common';

export {
    FirstDayOfWeek,
};

export interface ComponentDisabledDate<T> {
    component: T;
    readonly date: Date;
    readonly view: string;
}

/** @public */
export type CalendarZoomLevel = 'century' | 'decade' | 'month' | 'year';

/** @public */
export type ContentReadyEvent = EventInfo<dxCalendar>;

/** @public */
export type DisposingEvent = EventInfo<dxCalendar>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxCalendar>;

/** @public */
export type OptionChangedEvent = EventInfo<dxCalendar> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxCalendar, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/** @public */
export type CellTemplateData = {
    readonly date: Date;
    readonly view: string;
    readonly text?: string;
};

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
     * @type_function_param1_field component:object
     * @public
     */
    disabledDates?: Array<Date> | ((data: DisabledDate) => boolean);
    /**
     * @docid
     * @default undefined
     * @public
     */
    firstDayOfWeek?: FirstDayOfWeek;
    /**
     * @docid
     * @default true &for(desktop)
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
     * @default 'month'
     * @public
     */
    maxZoomLevel?: CalendarZoomLevel;
    /**
     * @docid
     * @default new Date(1000, 0)
     * @public
     */
    min?: Date | number | string;
    /**
     * @docid
     * @default 'century'
     * @public
     */
    minZoomLevel?: CalendarZoomLevel;
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
     * @default 'month'
     * @fires dxCalendarOptions.onOptionChanged
     * @public
     */
    zoomLevel?: CalendarZoomLevel;
}
/**
 * @docid
 * @isEditor
 * @inherits Editor
 * @namespace DevExpress.ui
 * @public
 */
export default class dxCalendar extends Editor<dxCalendarOptions> { }

/** @public */
export type Properties = dxCalendarOptions;

/** @deprecated use Properties instead */
export type Options = dxCalendarOptions;
