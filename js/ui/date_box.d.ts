import {
    ElementIntake
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    ComponentDisabledDate,
    dxCalendarOptions
} from './calendar';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    format
} from './widget/ui.widget';

/** @public */
export type ChangeEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type ClosedEvent = EventInfo<dxDateBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxDateBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type CutEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type DisposingEvent = EventInfo<dxDateBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxDateBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type OpenedEvent = EventInfo<dxDateBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxDateBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxDateBox>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxDateBox> & ValueChangedInfo;

/** @public */
export type DisabledDate = ComponentDisabledDate<dxDateBox>;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

export interface dxDateBoxOptions extends dxDropDownEditorOptions<dxDateBox> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    adaptivityEnabled?: boolean;
    /**
     * @docid
     * @default "OK"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyButtonText?: string;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calendarOptions?: dxCalendarOptions;
    /**
     * @docid
     * @default "Cancel"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelButtonText?: string;
    /**
     * @docid
     * @default "Value is out of range"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateOutOfRangeMessage?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dateSerializationFormat?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 data:object
     * @type_function_param1_field1 component:dxDateBox
     * @type_function_param1_field2 date:Date
     * @type_function_param1_field3 view:string
     * @type_function_return boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    disabledDates?: Array<Date> | ((data: DisabledDate) => boolean);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayFormat?: format;
    /**
     * @docid
     * @default 30
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    interval?: number;
    /**
     * @docid
     * @default "Value must be a date or time"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    invalidDateMessage?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: Date | number | string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: Date | number | string;
    /**
     * @docid
     * @type Enums.DateBoxPickerType
     * @default 'calendar'
     * @default 'native' [for](iOS)
     * @default 'native' [for](Android)
     * @default 'rollers' [for](Android_below_version_4.4)
     * @default 'rollers' [for](mobile_devices)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pickerType?: 'calendar' | 'list' | 'native' | 'rollers';
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showAnalogClock?: boolean;
    /**
     * @docid
     * @type Enums.DateBoxType
     * @default "date"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'date' | 'datetime' | 'time';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    useMaskBehavior?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: Date | number | string;
}
/**
 * @docid
 * @isEditor
 * @inherits dxDropDownEditor
 * @module ui/date_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxDateBox extends dxDropDownEditor {
    constructor(element: ElementIntake, options?: dxDateBoxOptions)
    /**
     * @docid
     * @publicName close()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    close(): void;
    /**
     * @docid
     * @publicName open()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    open(): void;
}

/** @public */
export type Options = dxDateBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxDateBoxOptions;
