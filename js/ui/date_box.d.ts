import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentNativeEvent,
    ComponentDisposingEvent,
    ComponentInitializedEvent,
    ComponentOptionChangedEvent
} from '../events';

import {
    ComponentDisabledDateData,
    dxCalendarOptions
} from './calendar';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonDataModel
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo
} from './editor/editor';

import {
    format
} from './widget/ui.widget';

/**
 * @public
 */
export type ChangeEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type ClosedEvent = ComponentEvent<dxDateBox>;
/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxDateBox>;
/**
 * @public
 */
export type CopyEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type CutEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type DisposingEvent = ComponentDisposingEvent<dxDateBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type InitializedEvent = ComponentInitializedEvent<dxDateBox>;
/**
 * @public
 */
export type InputEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type OpenedEvent = ComponentEvent<dxDateBox>;
/**
 * @public
 */
export type OptionChangedEvent = ComponentOptionChangedEvent<dxDateBox>;
/**
 * @public
 */
export type PasteEvent = ComponentNativeEvent<dxDateBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentNativeEvent<dxDateBox> & ValueChangedInfo;

/**
 * @public
 */
export type DisabledDateData = ComponentDisabledDateData<dxDateBox>;
/**
 * @public
 */
export type DropDownButtonData = DropDownButtonDataModel;

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
