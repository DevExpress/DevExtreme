/* eslint-disable max-classes-per-file */
import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

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

export type DateType = 'date' | 'datetime' | 'time';
export type DatePickerType = 'calendar' | 'list' | 'native' | 'rollers';

/**
 * The type of the change event handler&apos;s argument.
 */
export type ChangeEvent = NativeEventInfo<dxDateBox, Event>;

/**
 * The type of the closed event handler&apos;s argument.
 */
export type ClosedEvent = EventInfo<dxDateBox>;

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxDateBox>;

/**
 * The type of the copy event handler&apos;s argument.
 */
export type CopyEvent = NativeEventInfo<dxDateBox, ClipboardEvent>;

/**
 * The type of the cut event handler&apos;s argument.
 */
export type CutEvent = NativeEventInfo<dxDateBox, ClipboardEvent>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxDateBox>;

/**
 * The type of the enterKey event handler&apos;s argument.
 */
export type EnterKeyEvent = NativeEventInfo<dxDateBox, KeyboardEvent>;

/**
 * The type of the focusIn event handler&apos;s argument.
 */
export type FocusInEvent = NativeEventInfo<dxDateBox, FocusEvent>;

/**
 * The type of the focusOut event handler&apos;s argument.
 */
export type FocusOutEvent = NativeEventInfo<dxDateBox, FocusEvent>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxDateBox>;

/**
 * The type of the input event handler&apos;s argument.
 */
export type InputEvent = NativeEventInfo<dxDateBox, UIEvent & { target: HTMLInputElement }>;

/**
 * The type of the keyDown event handler&apos;s argument.
 */
export type KeyDownEvent = NativeEventInfo<dxDateBox, KeyboardEvent>;

export type KeyPressEvent = NativeEventInfo<dxDateBox, KeyboardEvent>;

/**
 * The type of the keyUp event handler&apos;s argument.
 */
export type KeyUpEvent = NativeEventInfo<dxDateBox, KeyboardEvent>;

/**
 * The type of the opened event handler&apos;s argument.
 */
export type OpenedEvent = EventInfo<dxDateBox>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxDateBox> & ChangedOptionInfo;

/**
 * The type of the paste event handler&apos;s argument.
 */
export type PasteEvent = NativeEventInfo<dxDateBox, ClipboardEvent>;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxDateBox, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

export type DisabledDate = ComponentDisabledDate<dxDateBox>;

export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxDateBoxOptions extends DateBoxBaseOptions<dxDateBox> {
    /**
     * Specifies whether or not adaptive UI component rendering is enabled on a small screen.
     */
    adaptivityEnabled?: boolean;
    /**
     * Specifies the message displayed if the specified date is later than the max value or earlier than the min value.
     */
    dateOutOfRangeMessage?: string;
    /**
     * Specifies dates that users cannot select. Applies only if pickerType is &apos;calendar&apos;.
     */
    disabledDates?: Array<Date> | ((data: DisabledDate) => boolean);
    /**
     * Specifies the attributes to be passed on to the underlying HTML element.
     */
    inputAttr?: any;
    /**
     * Specifies the interval between neighboring values in the popup list in minutes.
     */
    interval?: number;
    /**
     * Specifies the message displayed if the typed value is not a valid date or time.
     */
    invalidDateMessage?: string;
    /**
     * Specifies a text string used to annotate the editor&apos;s value.
     */
    label?: string;
    /**
     * Specifies the maximum number of characters you can enter into the textbox.
     */
    maxLength?: string | number;
    /**
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * Specifies the type of the date/time picker.
     */
    pickerType?: DatePickerType;
    /**
     * Specifies a placeholder for the input field.
     */
    placeholder?: string;
    /**
     * Specifies whether to show the analog clock in the value picker. Applies only if type is &apos;datetime&apos; and pickerType is &apos;calendar&apos;.
     */
    showAnalogClock?: boolean;
    /**
     * The read-only property that stores the text displayed by the UI component input element.
     */
    text?: string;
    /**
     * A format used to display date/time information.
     */
    type?: DateType;
    /**
     * Specifies the currently selected date and time.
     */
    value?: Date | number | string;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface DateBoxBaseOptions<TComponent> extends dxDropDownEditorOptions<TComponent> {
    /**
     * Specifies the Apply button&apos;s text.
     */
    applyButtonText?: string;
    /**
     * Configures the calendar&apos;s value picker.
     */
    calendarOptions?: dxCalendarOptions;
    /**
     * Specifies the Cancel button&apos;s text.
     */
    cancelButtonText?: string;
    /**
     * Specifies the date value serialization format.
     */
    dateSerializationFormat?: string | undefined;
    /**
     * Specifies the date&apos;s display format.
     */
    displayFormat?: Format;
    /**
     * The latest date that can be selected in the UI component.
     */
    max?: Date | number | string | undefined;
    /**
     * The earliest date that can be selected in the UI component.
     */
    min?: Date | number | string | undefined;
    /**
     * Specified the Today button&apos;s text.
     */
    todayButtonText?: string;
    /**
     * Specifies whether to use an input mask based on the displayFormat property.
     */
    useMaskBehavior?: boolean;
    /**
     * Configures the drop-down that holds the content.
     */
    dropDownOptions?: PopupProperties;
}

/**
 * A drop-down editor UI component.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export class DateBoxBase<TProperties = Properties> extends dxDropDownEditor<TProperties> {
    /**
     * Closes the drop-down editor.
     */
    close(): void;
    /**
     * Opens the drop-down editor.
     */
    open(): void;
}

/**
 * The DateBox is a UI component that displays date and time in a specified format, and enables a user to pick or type in the required date/time value.
 */
export default class dxDateBox extends DateBoxBase<Properties> {
    /**
     * Resets the value property to the value passed as an argument.
     */
    reset(value?: Date | number | string | null): void;
}

export type Properties = dxDateBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = Properties;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed when the UI component loses focus after the text field&apos;s content was changed using the keyboard.
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * A function that is executed once the drop-down editor is closed.
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * A function that is executed when the UI component is rendered and each time the component is repainted.
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * A function that is executed when the UI component&apos;s input has been copied.
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * A function that is executed when the UI component&apos;s input has been cut.
 */
onCut?: ((e: CutEvent) => void);
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function that is executed when the Enter key has been pressed while the UI component is focused.
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * A function that is executed when the UI component gets focus.
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * A function that is executed when the UI component loses focus.
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed each time the UI component&apos;s input is changed while the UI component is focused.
 */
onInput?: ((e: InputEvent) => void);
/**
 * A function that is executed when a user is pressing a key on the keyboard.
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * A function that is executed when a user releases a key on the keyboard.
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * A function that is executed once the drop-down editor is opened.
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * A function that is executed when the UI component&apos;s input has been pasted.
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * A function that is executed after the UI component&apos;s value is changed.
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
