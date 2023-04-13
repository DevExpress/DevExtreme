/* eslint-disable max-classes-per-file */
import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    ComponentDisabledDate,
    dxCalendarOptions,
} from './calendar';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    Format,
} from '../localization';

import {
    Properties as PopupProperties,
} from './popup';

/** @public */
export type DateType = 'date' | 'datetime' | 'time';
/** @public */
export type DatePickerType = 'calendar' | 'list' | 'native' | 'rollers';

/** @public */
export type ChangeEvent = NativeEventInfo<dxDateBox, Event>;

/** @public */
export type ClosedEvent = EventInfo<dxDateBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxDateBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxDateBox, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxDateBox, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxDateBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxDateBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxDateBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxDateBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDateBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxDateBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxDateBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxDateBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxDateBox, KeyboardEvent>;

/** @public */
export type OpenedEvent = EventInfo<dxDateBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDateBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxDateBox, ClipboardEvent>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxDateBox, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/** @public */
export type DisabledDate = ComponentDisabledDate<dxDateBox>;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxDateBoxOptions extends dxDateBoxBaseOptions<dxDateBox> {
    /**
     * @docid
     * @default false
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid
     * @default 30
     * @public
     */
    interval?: number;
    /**
     * @docid
     * @default 'calendar'
     * @default 'native' &for(iOS)
     * @default 'native' &for(Android)
     * @public
     */
    pickerType?: DatePickerType;
    /**
     * @docid
     * @default true
     * @public
     */
    showAnalogClock?: boolean;
    /**
     * @docid
     * @default "date"
     * @public
     */
    type?: DateType;
    /**
     * @docid
     * @default null
     * @public
     */
    value?: Date | number | string;
}

/**
 * @namespace DevExpress.ui
 */
export interface dxDateBoxBaseOptions<TComponent> extends dxDropDownEditorOptions<TComponent> {
    /**
     * @docid
     * @default "OK"
     * @public
     */
    applyButtonText?: string;
    /**
     * @docid
     * @default {}
     * @public
     */
    calendarOptions?: dxCalendarOptions;
    /**
     * @docid
     * @default "Cancel"
     * @public
     */
    cancelButtonText?: string;
    /**
     * @docid
     * @default "Value is out of range"
     * @public
     */
    dateOutOfRangeMessage?: string;
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
     * @type_function_param1_field component:dxDateBox
     * @public
     */
    disabledDates?: Array<Date> | ((data: DisabledDate) => boolean);
    /**
     * @docid
     * @default null
     * @public
     */
    displayFormat?: Format;
    /**
     * @docid
     * @default "Value must be a date or time"
     * @public
     */
    invalidDateMessage?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    max?: Date | number | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    min?: Date | number | string;
    /**
     * @docid
     * @default ""
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @default "Today"
     * @public
     */
    todayButtonText?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    useMaskBehavior?: boolean;
    /**
     * @docid
     * @type dxPopupOptions
     */
    dropDownOptions?: PopupProperties;
}

/**
 * @docid
 * @isEditor
 * @inherits dxDropDownEditor
 * @namespace DevExpress.ui
 */
export class dxDateBoxBase<TProperties = Properties> extends dxDropDownEditor<TProperties> {
    /**
     * @docid
     * @publicName close()
     * @public
     */
    close(): void;
    /**
     * @docid
     * @publicName open()
     * @public
     */
    open(): void;
}

/**
 * @docid
 * @isEditor
 * @inherits dxDateBoxBase
 * @namespace DevExpress.ui
 * @public
 */
export default class dxDateBox extends dxDateBoxBase<Properties> {}

/**
 * @public
 * @namespace DevExpress.ui
 */
export type Properties = dxDateBoxOptions;

/** @deprecated use Properties instead */
export type Options = Properties;
