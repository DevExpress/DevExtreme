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
  DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import { DateBoxBase, DateBoxBaseOptions } from './date_box';

import {
  ValueChangedInfo,
} from './editor/editor';

/** @public */
export type DateRangePickerType = 'calendar' | 'native';

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
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @public
 */
export type Properties = DateBoxBaseOptions<dxDateRangeBox> & {
    /**
     * @docid dxDateRangeBoxOptions.endDate
     * @default null
     * @public
     */
    endDate?: Date | number | string;
    /**
     * @docid dxDateRangeBoxOptions.pickerType
     * @default 'calendar'
     * @default 'native' &for(iOS)
     * @default 'native' &for(Android)
     * @public
     */
    pickerType?: DateRangePickerType;
    /**
     * @docid dxDateRangeBoxOptions.startDate
     * @default null
     * @public
     */
    startDate?: Date | number | string;
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
