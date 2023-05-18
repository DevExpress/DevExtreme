import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTextBox, {
    dxTextBoxOptions,
} from './text_box';

/** @public */
export type ChangeEvent = NativeEventInfo<dxTextArea, Event>;

/** @public */
export type ContentReadyEvent = EventInfo<dxTextArea>;

/** @public */
export type CopyEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxTextArea>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxTextArea, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxTextArea, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTextArea>;

/** @public */
export type InputEvent = NativeEventInfo<dxTextArea, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type OptionChangedEvent = EventInfo<dxTextArea> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxTextArea, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
    /**
     * @docid
     * @default false
     * @public
     */
    autoResizeEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    maxHeight?: number | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    minHeight?: number | string;
    /**
     * @docid
     * @default true
     * @public
     */
    spellcheck?: boolean;
}
/**
 * @docid
 * @isEditor
 * @inherits dxTextBox
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTextArea extends dxTextBox<dxTextAreaOptions> { }

/** @public */
export type Properties = dxTextAreaOptions;

/** @deprecated use Properties instead */
export type Options = dxTextAreaOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxTextAreaOptions.onChange
 * @type_function_param1 e:{ui/text_area:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onContentReady
 * @type_function_param1 e:{ui/text_area:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onCopy
 * @type_function_param1 e:{ui/text_area:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onCut
 * @type_function_param1 e:{ui/text_area:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onDisposing
 * @type_function_param1 e:{ui/text_area:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onEnterKey
 * @type_function_param1 e:{ui/text_area:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onFocusIn
 * @type_function_param1 e:{ui/text_area:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onFocusOut
 * @type_function_param1 e:{ui/text_area:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onInitialized
 * @type_function_param1 e:{ui/text_area:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onInput
 * @type_function_param1 e:{ui/text_area:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onKeyDown
 * @type_function_param1 e:{ui/text_area:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onKeyUp
 * @type_function_param1 e:{ui/text_area:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onOptionChanged
 * @type_function_param1 e:{ui/text_area:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onPaste
 * @type_function_param1 e:{ui/text_area:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @skip
 * @docid dxTextAreaOptions.onValueChanged
 * @type_function_param1 e:{ui/text_area:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
