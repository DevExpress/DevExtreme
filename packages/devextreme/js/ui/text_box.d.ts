import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTextEditor, {
    dxTextEditorOptions,
} from './text_box/ui.text_editor.base';

export type TextBoxType = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

/**
 * The type of the change event handler&apos;s argument.
 */
export type ChangeEvent = NativeEventInfo<dxTextBox, Event>;

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxTextBox>;

/**
 * The type of the copy event handler&apos;s argument.
 */
export type CopyEvent = NativeEventInfo<dxTextBox, ClipboardEvent>;

/**
 * The type of the cut event handler&apos;s argument.
 */
export type CutEvent = NativeEventInfo<dxTextBox, ClipboardEvent>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxTextBox>;

/**
 * The type of the enterKey event handler&apos;s argument.
 */
export type EnterKeyEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/**
 * The type of the focusIn event handler&apos;s argument.
 */
export type FocusInEvent = NativeEventInfo<dxTextBox, FocusEvent>;

/**
 * The type of the focusOut event handler&apos;s argument.
 */
export type FocusOutEvent = NativeEventInfo<dxTextBox, FocusEvent>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxTextBox>;

/**
 * The type of the input event handler&apos;s argument.
 */
export type InputEvent = NativeEventInfo<dxTextBox, UIEvent & { target: HTMLInputElement }>;

/**
 * The type of the keyDown event handler&apos;s argument.
 */
export type KeyDownEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

export type KeyPressEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/**
 * The type of the keyUp event handler&apos;s argument.
 */
export type KeyUpEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxTextBox> & ChangedOptionInfo;

/**
 * The type of the paste event handler&apos;s argument.
 */
export type PasteEvent = NativeEventInfo<dxTextBox, ClipboardEvent>;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxTextBox, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTextBoxOptions<TComponent> extends dxTextEditorOptions<TComponent> {
    /**
     * Specifies the maximum number of characters you can enter into the textbox.
     */
    maxLength?: string | number;
    /**
     * The &apos;mode&apos; attribute value of the actual HTML input element representing the text box.
     */
    mode?: TextBoxType;
    /**
     * Specifies a value the UI component displays.
     */
    value?: string;
}
/**
 * The TextBox is a UI component that enables a user to enter and edit a single line of text.
 */
export default class dxTextBox<TProperties = Properties> extends dxTextEditor<TProperties> {
    /**
     * Resets the value property to the value passed as an argument.
     */
    reset(value?: string): void;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
interface TextBoxInstance extends dxTextBox<Properties> { }

export type Properties = dxTextBoxOptions<TextBoxInstance>;

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
