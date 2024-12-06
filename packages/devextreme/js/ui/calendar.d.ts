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

export interface ComponentDisabledDate<T> {
    component: T;
    readonly date: Date;
    readonly view: string;
}

/** @public */
export type CalendarZoomLevel = 'century' | 'decade' | 'month' | 'year';

/** @public */
export type CalendarSelectionMode = 'single' | 'multiple' | 'range';

/** @public */
export type WeekNumberRule = 'auto' | 'firstDay' | 'fullWeek' | 'firstFourDays';

/** @public */
export type ContentReadyEvent = EventInfo<dxCalendar>;

/**
 * @docid _ui_calendar_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxCalendar>;

/**
 * @docid _ui_calendar_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxCalendar>;

/**
 * @docid _ui_calendar_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxCalendar> & ChangedOptionInfo;

/**
 * @docid _ui_calendar_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxCalendar, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/** @public */
export type CellTemplateData = {
    readonly date: Date;
    readonly view: string;
    readonly text?: string;
};

/**
 * @docid
 * @public
 * @type object
 */
export type DisabledDate = ComponentDisabledDate<dxCalendar>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
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
    dateSerializationFormat?: string | undefined;
    /**
     * @docid
     * @default null
     * @type_function_param1 data:DisabledDate
     * @public
     */
    disabledDates?: Array<Date> | ((data: DisabledDate) => boolean);
    /**
     * @docid
     * @default undefined
     * @public
     */
    firstDayOfWeek?: FirstDayOfWeek | undefined;
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
     * @default 'single'
     * @public
     */
    selectionMode?: CalendarSelectionMode;
    /**
     * @docid
     * @default true
     * @public
     */
    selectWeekOnClick?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showTodayButton?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showWeekNumbers?: boolean;
    /**
     * @docid
     * @default 'auto'
     * @public
     */
    weekNumberRule?: WeekNumberRule;
    /**
     * @docid
     * @default null
     * @public
     */
    value?: Date | number | string | Array<Date | number | string>;
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
export default class dxCalendar extends Editor<dxCalendarOptions> {
    /**
     * @docid
     * @publicName reset(value)
     * @public
     */
    reset(value?: Date | number | string | Array<Date | number | string> | null): void;
}

/** @public */
export type Properties = dxCalendarOptions;

/** @deprecated use Properties instead */
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
