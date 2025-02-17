import {
    NativeEventInfo,
} from '../../common/core/events';

import dxButton from '../button';

import Editor, {
    EditorOptions,
} from '../editor/editor';

import {
    LabelMode,
    EditorStyle,
    MaskMode,
    TextBoxPredefinedButton,
    TextEditorButton,
} from '../../common';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTextEditorOptions<TComponent> extends EditorOptions<TComponent> {
    /**
     * Allows you to add custom buttons to the input text field.
     */
    buttons?: Array<string | TextBoxPredefinedButton | TextEditorButton>;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Specifies whether the UI component changes its state when a user pauses on it.
     */
    hoverStateEnabled?: boolean;
    /**
     * Specifies the attributes to be passed on to the underlying HTML element.
     */
    inputAttr?: any;
    /**
     * Specifies a text string used to annotate the editor&apos;s value.
     */
    label?: string;
    /**
     * Specifies the label&apos;s display mode.
     */
    labelMode?: LabelMode;
    /**
     * The editor mask that specifies the custom format of the entered string.
     */
    mask?: string;
    /**
     * Specifies a mask placeholder. A single character is recommended.
     */
    maskChar?: string;
    /**
     * A message displayed when the entered text does not match the specified pattern.
     */
    maskInvalidMessage?: string;
    /**
     * Specifies custom mask rules.
     */
    maskRules?: any;
    /**
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * A function that is executed when the UI component loses focus after the text field&apos;s content was changed using the keyboard.
     */
    onChange?: ((e: NativeEventInfo<TComponent, Event>) => void);
    /**
     * A function that is executed when the UI component&apos;s input has been copied.
     */
    onCopy?: ((e: NativeEventInfo<TComponent, ClipboardEvent>) => void);
    /**
     * A function that is executed when the UI component&apos;s input has been cut.
     */
    onCut?: ((e: NativeEventInfo<TComponent, ClipboardEvent>) => void);
    /**
     * A function that is executed when the Enter key has been pressed while the UI component is focused.
     */
    onEnterKey?: ((e: NativeEventInfo<TComponent, KeyboardEvent>) => void);
    /**
     * A function that is executed when the UI component gets focus.
     */
    onFocusIn?: ((e: NativeEventInfo<TComponent, FocusEvent>) => void);
    /**
     * A function that is executed when the UI component loses focus.
     */
    onFocusOut?: ((e: NativeEventInfo<TComponent, FocusEvent>) => void);
    /**
     * A function that is executed each time the UI component&apos;s input is changed while the UI component is focused.
     */
    onInput?: ((e: NativeEventInfo<TComponent, UIEvent>) => void);
    /**
     * A function that is executed when a user is pressing a key on the keyboard.
     */
    onKeyDown?: ((e: NativeEventInfo<TComponent, KeyboardEvent>) => void);
    /**
     * A function that is executed when a user releases a key on the keyboard.
     */
    onKeyUp?: ((e: NativeEventInfo<TComponent, KeyboardEvent>) => void);
    /**
     * A function that is executed when the UI component&apos;s input has been pasted.
     */
    onPaste?: ((e: NativeEventInfo<TComponent, ClipboardEvent>) => void);
    /**
     * Specifies a text string displayed when the editor&apos;s value is empty.
     */
    placeholder?: string;
    /**
     * Specifies whether to display the Clear button in the UI component.
     */
    showClearButton?: boolean;
    /**
     * Specifies when the UI component shows the mask. Applies only if useMaskedValue is true.
     */
    showMaskMode?: MaskMode;
    /**
     * Specifies whether or not the UI component checks the inner text for spelling mistakes.
     */
    spellcheck?: boolean;
    /**
     * Specifies how the UI component&apos;s text field is styled.
     */
    stylingMode?: EditorStyle;
    /**
     * The read-only property that holds the text displayed by the UI component input element.
     */
    text?: string;
    /**
     * Specifies whether the value should contain mask characters or not.
     */
    useMaskedValue?: boolean;
    /**
     * Specifies the editor&apos;s value.
     */
    value?: any;
    /**
     * Specifies the DOM events after which the UI component&apos;s value should be updated.
     */
    valueChangeEvent?: string;
}
/**
 * A base class for text editing UI components.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export default class dxTextEditor<TProperties = Properties> extends Editor<TProperties> {
    /**
     * Removes focus from the input element.
     */
    blur(): void;
    /**
     * Sets focus to the input element representing the UI component.
     */
    focus(): void;
    /**
     * Gets an instance of a custom action button.
     */
    getButton(name: string): dxButton | undefined;
}

/**
 * @deprecated Use TextEditorButton from 'devextreme/common' instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type dxTextEditorButton = TextEditorButton;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
interface TextEditorInstance extends dxTextEditor<Properties> {}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Properties = dxTextEditorOptions<TextEditorInstance>;
