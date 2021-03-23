import {
    TElement
} from '../core/element';

import {
    DisabledDateData,
    dxCalendarOptions
} from './calendar';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    CutEvent,
    CopyEvent,
    InputEvent,
    KeyUpEvent,
    PasteEvent,
    OpenedEvent,
    ClosedEvent,
    ChangeEvent,
    FocusInEvent,
    KeyDownEvent,
    EnterKeyEvent,
    FocusOutEvent,
    KeyPressEvent,
    ContentReadyEvent,
    ValueChangedEvent
} from './drop_down_editor/ui.drop_down_editor';

import {
    format
} from './widget/ui.widget';

/**
 * @public
*/
export {
    CutEvent,
    CopyEvent,
    InputEvent,
    KeyUpEvent,
    PasteEvent,
    OpenedEvent,
    ClosedEvent,
    ChangeEvent,
    FocusInEvent,
    KeyDownEvent,
    EnterKeyEvent,
    FocusOutEvent,
    KeyPressEvent,
    ContentReadyEvent,
    ValueChangedEvent,
    DisabledDateData
}
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
    disabledDates?: Array<Date> | ((data: DisabledDateData) => boolean);
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
    constructor(element: TElement, options?: dxDateBoxOptions)
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

export type Options = dxDateBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxDateBoxOptions;
