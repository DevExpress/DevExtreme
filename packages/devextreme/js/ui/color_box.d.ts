import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    template,
    ApplyValueMode,
} from '../common';

import dxDropDownEditor, {
    dxDropDownEditorOptions,
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    Properties as PopupProperties,
} from './popup';

/**
 * The type of the change event handler&apos;s argument.
 */
export type ChangeEvent = NativeEventInfo<dxColorBox, Event>;

/**
 * The type of the closed event handler&apos;s argument.
 */
export type ClosedEvent = EventInfo<dxColorBox>;

/**
 * The type of the copy event handler&apos;s argument.
 */
export type CopyEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/**
 * The type of the cut event handler&apos;s argument.
 */
export type CutEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxColorBox>;

/**
 * The type of the enterKey event handler&apos;s argument.
 */
export type EnterKeyEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/**
 * The type of the focusIn event handler&apos;s argument.
 */
export type FocusInEvent = NativeEventInfo<dxColorBox, FocusEvent>;

/**
 * The type of the focusOut event handler&apos;s argument.
 */
export type FocusOutEvent = NativeEventInfo<dxColorBox, FocusEvent>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxColorBox>;

/**
 * The type of the input event handler&apos;s argument.
 */
export type InputEvent = NativeEventInfo<dxColorBox, UIEvent & { target: HTMLInputElement }>;

/**
 * The type of the keyDown event handler&apos;s argument.
 */
export type KeyDownEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

export type KeyPressEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/**
 * The type of the keyUp event handler&apos;s argument.
 */
export type KeyUpEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/**
 * The type of the opened event handler&apos;s argument.
 */
export type OpenedEvent = EventInfo<dxColorBox>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxColorBox> & ChangedOptionInfo;

/**
 * The type of the paste event handler&apos;s argument.
 */
export type PasteEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxColorBox, KeyboardEvent | MouseEvent | PointerEvent | UIEvent | Event> & ValueChangedInfo;

export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxColorBoxOptions extends dxDropDownEditorOptions<dxColorBox> {
    /**
     * Specifies the text displayed on the button that applies changes and closes the drop-down editor.
     */
    applyButtonText?: string;
    /**
     * Specifies the way an end user applies the selected value.
     */
    applyValueMode?: ApplyValueMode;
    /**
     * Specifies the text displayed on the button that cancels changes and closes the drop-down editor.
     */
    cancelButtonText?: string;
    /**
     * Specifies whether or not the UI component value includes the alpha channel component.
     */
    editAlphaChannel?: boolean;
    /**
     * Specifies a custom template for the input field. Must contain the TextBox UI component.
     */
    fieldTemplate?: template | ((value: string, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies the size of a step by which a handle is moved using a keyboard shortcut.
     */
    keyStep?: number;
    /**
     * Specifies the currently selected value.
     */
    value?: string;
    /**
     * Configures the drop-down field which holds the content.
     */
    dropDownOptions?: PopupProperties;
}
/**
 * The ColorBox is a UI component that allows an end user to enter a color or pick it out from the drop-down editor.
 */
export default class dxColorBox extends dxDropDownEditor<dxColorBoxOptions> {
    /**
     * Resets the value property to the value passed as an argument.
     */
    reset(value?: string | null): void;
}

export type Properties = dxColorBoxOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxColorBoxOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onContentReady'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

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
