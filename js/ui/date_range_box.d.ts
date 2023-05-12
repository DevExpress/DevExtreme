import {
  EventInfo,
  NativeEventInfo,
  InitializedEventInfo,
  ChangedOptionInfo,
} from '../events/index';

import {
  DxElement,
} from '../core/element';

import {
  ComponentDisabledDate,
} from './calendar';

import {
  DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import { DateBoxBase, DateBoxBaseOptions } from './date_box';

import {
  ValueChangedInfo,
} from './editor/editor';

/** @public */
export type ChangeEvent = NativeEventInfo<dxDateRangeBox>;

/** @public */
export type ClosedEvent = EventInfo<dxDateRangeBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxDateRangeBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxDateRangeBox, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxDateRangeBox, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxDateRangeBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxDateRangeBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxDateRangeBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDateRangeBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxDateRangeBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/** @public */
export type OpenedEvent = EventInfo<dxDateRangeBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDateRangeBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxDateRangeBox, ClipboardEvent>;

/** @public */
export type ValueChangedEvent =
    NativeEventInfo<dxDateRangeBox, KeyboardEvent | MouseEvent | PointerEvent | Event>
    & ValueChangedInfo;

/** @public */
export type DateRangeDisabledDate = ComponentDisabledDate<dxDateRangeBox>;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @public
 */
export type Properties = DateBoxBaseOptions<dxDateRangeBox> & {
    /**
       * @docid
       * @default null
       * @type_function_param1 data:object
       * @type_function_param1_field component:dxDateRangeBox
       * @public
       */
    disabledDates?: Array<Date> | ((data: DateRangeDisabledDate) => boolean);
    /**
     * @docid dxDateRangeBoxOptions.endDate
     * @default null
     * @public
     */
    endDate?: Date | number | string;
    /**
     * @docid dxDateRangeBoxOptions.endDateInputAttr
     * @default {}
     * @public
     */
    endDateInputAttr?: any;
    /**
     * @docid dxDateRangeBoxOptions.endDateLabel
     * @default "End Date"
     * @public
     */
    endDateLabel?: string;
    /**
     * @docid dxDateRangeBoxOptions.endDateName
     * @default ""
     * @public
     */
    endDateName?: string;
    /**
     * @docid dxDateRangeBoxOptions.endDateOutOfRangeMessage
     * @default "End date is out of range"
     * @public
     */
    endDateOutOfRangeMessage?: string;
    /**
     * @docid dxDateRangeBoxOptions.endDatePlaceholder
     * @default ""
     * @public
     */
    endDatePlaceholder?: string;
    /**
     * @docid dxDateRangeBoxOptions.endDateText
     * @readonly
     * @public
     */
    endDateText?: string;
    /**
     * @docid dxDateRangeBoxOptions.invalidEndDateMessage
     * @default "End value must be a date"
     * @public
     */
    invalidEndDateMessage?: string;
    /**
     * @docid dxDateRangeBoxOptions.invalidStartDateMessage
     * @default "Start value must be a date"
     * @public
     */
    invalidStartDateMessage?: string;
    /**
     * @docid dxDateRangeBoxOptions.multiView
     * @default true
     * @default false &for(iOS)
     * @default false &for(Android)
     * @public
     */
    multiView?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid dxDateRangeBoxOptions.startDate
     * @default null
     * @public
     */
    startDate?: Date | number | string;
    /**
     * @docid dxDateRangeBoxOptions.startDateInputAttr
     * @default {}
     * @public
     */
    startDateInputAttr?: any;
    /**
     * @docid dxDateRangeBoxOptions.startDateLabel
     * @default "Start Date"
     * @public
     */
    startDateLabel?: string;
    /**
     * @docid dxDateRangeBoxOptions.startDateName
     * @default ""
     * @public
     */
    startDateName?: string;
    /**
     * @docid dxDateRangeBoxOptions.startDateOutOfRangeMessage
     * @default "Start date is out of range"
     * @public
     */
    startDateOutOfRangeMessage?: string;
    /**
     * @docid dxDateRangeBoxOptions.startDatePlaceholder
     * @default ""
     * @public
     */
    startDatePlaceholder?: string;
    /**
     * @docid dxDateRangeBoxOptions.startDateText
     * @readonly
     * @public
     */
    startDateText?: string;
    /**
     * @docid dxDateRangeBoxOptions.value
     * @default [null, null]
     * @public
     */
    value?: Array<Date | number | string>;
};

/**
 * @namespace DevExpress.ui
 */
declare const DateRangeBoxBase: new() => Omit<DateBoxBase<Properties>, 'field'>;

/**
 * @docid
 * @isEditor
 * @inherits DateBoxBase
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDateRangeBox extends DateRangeBoxBase {
  /**
   * @docid
   * @publicName endDateField()
   * @public
   */
  endDateField(): DxElement;
  /**
   * @docid
   * @publicName startDateField()
   * @public
   */
  startDateField(): DxElement;
}

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

type Events = {
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onChange
 * @type_function_param1 e:{ui/date_range_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onClosed
 * @type_function_param1 e:{ui/date_range_box:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onContentReady
 * @type_function_param1 e:{ui/date_range_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onCopy
 * @type_function_param1 e:{ui/date_range_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onCut
 * @type_function_param1 e:{ui/date_range_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onDisposing
 * @type_function_param1 e:{ui/date_range_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/date_range_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/date_range_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/date_range_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onInitialized
 * @type_function_param1 e:{ui/date_range_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onInput
 * @type_function_param1 e:{ui/date_range_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/date_range_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/date_range_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onOpened
 * @type_function_param1 e:{ui/date_range_box:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/date_range_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onPaste
 * @type_function_param1 e:{ui/date_range_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @skip
 * @docid dxDateRangeBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/date_range_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
