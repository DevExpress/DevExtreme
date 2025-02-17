import {
  EventInfo,
  NativeEventInfo,
  InitializedEventInfo,
  ChangedOptionInfo,
} from '../common/core/events';

import {
  DxElement,
  UserDefinedElement,
} from '../core/element';

import {
  DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import { DateBoxBase, DateBoxBaseOptions } from './date_box';

import {
  ValueChangedInfo,
} from './editor/editor';

/**
 * The type of the change event handler&apos;s argument.
 */
export type ChangeEvent = NativeEventInfo<dxDateRangeBox>;

/**
 * The type of the closed event handler&apos;s argument.
 */
export type ClosedEvent = EventInfo<dxDateRangeBox>;

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxDateRangeBox>;

/**
 * The type of the copy event handler&apos;s argument.
 */
export type CopyEvent = NativeEventInfo<dxDateRangeBox, ClipboardEvent>;

/**
 * The type of the cut event handler&apos;s argument.
 */
export type CutEvent = NativeEventInfo<dxDateRangeBox, ClipboardEvent>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxDateRangeBox>;

/**
 * The type of the enterKey event handler&apos;s argument.
 */
export type EnterKeyEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/**
 * The type of the focusIn event handler&apos;s argument.
 */
export type FocusInEvent = NativeEventInfo<dxDateRangeBox, FocusEvent>;

/**
 * The type of the focusOut event handler&apos;s argument.
 */
export type FocusOutEvent = NativeEventInfo<dxDateRangeBox, FocusEvent>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxDateRangeBox>;

/**
 * The type of the input event handler&apos;s argument.
 */
export type InputEvent = NativeEventInfo<dxDateRangeBox, UIEvent & { target: HTMLInputElement }>;

/**
 * The type of the keyDown event handler&apos;s argument.
 */
export type KeyDownEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

export type KeyPressEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/**
 * The type of the keyUp event handler&apos;s argument.
 */
export type KeyUpEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent>;

/**
 * The type of the opened event handler&apos;s argument.
 */
export type OpenedEvent = EventInfo<dxDateRangeBox>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxDateRangeBox> & ChangedOptionInfo;

/**
 * The type of the paste event handler&apos;s argument.
 */
export type PasteEvent = NativeEventInfo<dxDateRangeBox, ClipboardEvent>;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxDateRangeBox, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * 
 */
export type Properties = Omit<DateBoxBaseOptions<dxDateRangeBox>, 'inputAttr' | 'label' | 'maxLength' | 'name' | 'placeholder' | 'text'> & {
    /**
     * Specifies whether the UI component disables date selection before the start date and after the end date.
     */
    disableOutOfRangeSelection?: boolean;
    /**
     * Specifies the range&apos;s end date.
     */
    endDate?: Date | number | string;
    /**
     * Specifies the attributes passed to the end date input field.
     */
    endDateInputAttr?: any;
    /**
     * Specifies the label of the end date input field.
     */
    endDateLabel?: string;
    /**
     * Specifies the name attribute of the end date input field.
     */
    endDateName?: string;
    /**
     * Specifies the message displayed if the specified end date is later than the max value or earlier than the min value.
     */
    endDateOutOfRangeMessage?: string;
    /**
     * Specifies a placeholder for the end date input field.
     */
    endDatePlaceholder?: string;
    /**
     * Returns the text displayed by the end date input field.
     */
    endDateText?: string;
    /**
     * Specifies a message for invalid end date input.
     */
    invalidEndDateMessage?: string;
    /**
     * Specifies a message for invalid start date input.
     */
    invalidStartDateMessage?: string;
    /**
     * Specifies whether the UI component displays a single-month calendar or a multi-month calendar.
     */
    multiView?: boolean;
    /**
     * Specifies whether a user can open the popup calendar by clicking an input field.
     */
    openOnFieldClick?: boolean;
    /**
     * Specifies the start date of date range.
     */
    startDate?: Date | number | string;
    /**
     * Specifies the attributes passed to the start date input field.
     */
    startDateInputAttr?: any;
    /**
     * Specifies a label of the start date input field.
     */
    startDateLabel?: string;
    /**
     * Specifies the name attribute of the start date input field.
     */
    startDateName?: string;
    /**
     * Specifies the message displayed if the specified start date is later than the max value or earlier than the min value.
     */
    startDateOutOfRangeMessage?: string;
    /**
     * Specifies a placeholder for the start date input field.
     */
    startDatePlaceholder?: string;
    /**
     * Returns the text displayed by the start date input field.
     */
    startDateText?: string;
    /**
     * An array that specifies the selected range (start and end dates).
     */
    value?: Array<Date | number | string>;
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
declare const DateRangeBoxBase: Omit<typeof DateBoxBase, 'new' | 'prototype'> & (new(element: UserDefinedElement, options?: Properties) => Omit<DateBoxBase<Properties>, 'field' | 'reset'>);

/**
 * DateRangeBox is a UI component that allows a user to select a date range (pick or enter start and end dates).
 */
export default class dxDateRangeBox extends DateRangeBoxBase {
  /**
   * Gets the `` element of the UI component&apos;s end date field.
   */
  endDateField(): DxElement;
  /**
   * Gets the `` element of the UI component&apos;s start date field.
   */
  startDateField(): DxElement;
  /**
   * Resets the value property to the value passed as an argument.
   */
  reset(value?: Array<Date | number | string | null>): void;
}

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
