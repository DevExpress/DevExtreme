import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTextEditor, {
    dxTextEditorOptions,
} from './text_box/ui.text_editor.base';

/** @public */
export type TextBoxType = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

/** @public */
export type ChangeEvent = NativeEventInfo<dxTextBox, Event>;

/** @public */
export type ContentReadyEvent = EventInfo<dxTextBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxTextBox, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxTextBox, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxTextBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxTextBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxTextBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTextBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxTextBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/** @public */
export type OptionChangedEvent = EventInfo<dxTextBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxTextBox, ClipboardEvent>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxTextBox, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTextBoxOptions<TComponent> extends dxTextEditorOptions<TComponent> {
    /**
     * @docid
     * @default null
     * @public
     */
    maxLength?: string | number;
    /**
     * @docid
     * @default "text"
     * @public
     */
    mode?: TextBoxType;
    /**
     * @docid
     * @default ""
     * @public
     */
    value?: string;
}
/**
 * @docid
 * @isEditor
 * @inherits dxTextEditor
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTextBox<TProperties = Properties> extends dxTextEditor<TProperties> { }

interface TextBoxInstance extends dxTextBox<Properties> { }

/** @public */
export type Properties = dxTextBoxOptions<TextBoxInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type Events = CheckedEvents<Properties, Required<{
/**
 * @skip
 * @docid dxTextBoxOptions.onChange
 * @type_function_param1 e:{ui/text_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onContentReady
 * @type_function_param1 e:{ui/text_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onCopy
 * @type_function_param1 e:{ui/text_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onCut
 * @type_function_param1 e:{ui/text_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onDisposing
 * @type_function_param1 e:{ui/text_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/text_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/text_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/text_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onInitialized
 * @type_function_param1 e:{ui/text_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onInput
 * @type_function_param1 e:{ui/text_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/text_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/text_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/text_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onPaste
 * @type_function_param1 e:{ui/text_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @skip
 * @docid dxTextBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/text_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
}>>;
