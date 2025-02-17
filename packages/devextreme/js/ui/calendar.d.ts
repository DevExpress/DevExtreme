import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    ChangedOptionInfo,
    EventInfo,
    InitializedEventInfo,
    NativeEventInfo,
} from '../common/core/events';

import {
    template,
    FirstDayOfWeek,
} from '../common';

import Editor, {
    ValueChangedInfo,
    EditorOptions,
} from './editor/editor';

export {
    FirstDayOfWeek,
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ComponentDisabledDate<T> {
    component: T;
    readonly date: Date;
    readonly view: string;
}

export type CalendarZoomLevel = 'century' | 'decade' | 'month' | 'year';

export type CalendarSelectionMode = 'single' | 'multiple' | 'range';

export type WeekNumberRule = 'auto' | 'firstDay' | 'fullWeek' | 'firstFourDays';

export type ContentReadyEvent = EventInfo<dxCalendar>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxCalendar>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxCalendar>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxCalendar> & ChangedOptionInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxCalendar, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

export type CellTemplateData = {
    readonly date: Date;
    readonly view: string;
    readonly text?: string;
};

/**
 * Specifies dates that users cannot select.
 */
export type DisabledDate = ComponentDisabledDate<dxCalendar>;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxCalendarOptions extends EditorOptions<dxCalendar> {
    /**
     * Specifies whether the UI component changes its visual state as a result of user interaction.
     */
    activeStateEnabled?: boolean;
    /**
     * Specifies a custom template for calendar cells.
     */
    cellTemplate?: template | ((itemData: CellTemplateData, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies the date-time value serialization format.
     */
    dateSerializationFormat?: string | undefined;
    /**
     * Specifies dates that users cannot select.
     */
    disabledDates?: Array<Date> | ((data: DisabledDate) => boolean);
    /**
     * Specifies the first day of a week.
     */
    firstDayOfWeek?: FirstDayOfWeek | undefined;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * The latest date the UI component allows to select.
     */
    max?: Date | number | string;
    /**
     * Specifies the maximum zoom level of the calendar.
     */
    maxZoomLevel?: CalendarZoomLevel;
    /**
     * The earliest date the UI component allows to select.
     */
    min?: Date | number | string;
    /**
     * Specifies the minimum zoom level of the calendar.
     */
    minZoomLevel?: CalendarZoomLevel;
    /**
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * Specifies one of three selection modes: single, multiple, or range.
     */
    selectionMode?: CalendarSelectionMode;
    /**
     * Specifies whether a user can select a week by clicking on a week number.
     */
    selectWeekOnClick?: boolean;
    /**
     * Specifies whether or not the UI component displays a button that selects the current date.
     */
    showTodayButton?: boolean;
    /**
     * Specifies whether to display a column with week numbers.
     */
    showWeekNumbers?: boolean;
    /**
     * Specifies a week number calculation rule.
     */
    weekNumberRule?: WeekNumberRule;
    /**
     * An object or a value that specifies the date and time selected in the calendar.
     */
    value?: Date | number | string | Array<Date | number | string>;
    /**
     * Specifies the current calendar zoom level.
     */
    zoomLevel?: CalendarZoomLevel;
}
/**
 * The Calendar is a UI component that displays a calendar and allows an end user to select the required date within a specified date range.
 */
export default class dxCalendar extends Editor<dxCalendarOptions> {
    /**
     * Resets the value property to the value passed as an argument.
     */
    reset(value?: Date | number | string | Array<Date | number | string> | null): void;
}

export type Properties = dxCalendarOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxCalendarOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onContentReady' | 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxCalendarOptions.onDisposing
 * @type_function_param1 e:{ui/calendar:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxCalendarOptions.onInitialized
 * @type_function_param1 e:{ui/calendar:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxCalendarOptions.onOptionChanged
 * @type_function_param1 e:{ui/calendar:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxCalendarOptions.onValueChanged
 * @type_function_param1 e:{ui/calendar:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
