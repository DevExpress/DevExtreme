import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxTextEditor, {
    dxTextEditorButton,
    dxTextEditorOptions,
} from './text_box/ui.text_editor.base';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    Format,
  } from '../localization';

/** @public */
export type NumberBoxPredefinedButton = 'clear' | 'spins';
/** @public */
export type NumberBoxType = 'number' | 'text' | 'tel';

/** @public */
export type ChangeEvent = NativeEventInfo<dxNumberBox, Event>;

/** @public */
export type ContentReadyEvent = EventInfo<dxNumberBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxNumberBox, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxNumberBox, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxNumberBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxNumberBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxNumberBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxNumberBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxNumberBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxNumberBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxNumberBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxNumberBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxNumberBox, KeyboardEvent>;

/** @public */
export type OptionChangedEvent = EventInfo<dxNumberBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxNumberBox, ClipboardEvent>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxNumberBox, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxNumberBoxOptions extends dxTextEditorOptions<dxNumberBox> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    buttons?: Array<NumberBoxPredefinedButton | dxTextEditorButton>;
    /**
     * @docid
     * @default ""
     * @public
     */
    format?: Format;
    /**
     * @docid
     * @default "Value must be a number"
     * @public
     */
    invalidValueMessage?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    max?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    min?: number;
    /**
     * @docid
     * @default "text"
     * @default 'number' &for(mobile_devices)
     * @public
     */
    mode?: NumberBoxType;
    /**
     * @docid
     * @default false
     * @public
     */
    showSpinButtons?: boolean;
    /**
     * @docid
     * @default 1
     * @public
     */
    step?: number;
    /**
     * @docid
     * @default true
     * @default false &for(desktop)
     * @public
     */
    useLargeSpinButtons?: boolean;
    /**
     * @docid
     * @default 0
     * @public
     */
    value?: number;
}
/**
 * @docid
 * @isEditor
 * @inherits dxTextEditor
 * @namespace DevExpress.ui
 * @public
 */
export default class dxNumberBox extends dxTextEditor<dxNumberBoxOptions> { }

/** @public */
export type Properties = dxNumberBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxNumberBoxOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type Events = CheckedEvents<Properties, Required<{
/**
 * @skip
 * @docid dxNumberBoxOptions.onChange
 * @type_function_param1 e:{ui/number_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onContentReady
 * @type_function_param1 e:{ui/number_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onCopy
 * @type_function_param1 e:{ui/number_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onCut
 * @type_function_param1 e:{ui/number_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onDisposing
 * @type_function_param1 e:{ui/number_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/number_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/number_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/number_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onInitialized
 * @type_function_param1 e:{ui/number_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onInput
 * @type_function_param1 e:{ui/number_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/number_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/number_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/number_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onPaste
 * @type_function_param1 e:{ui/number_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @skip
 * @docid dxNumberBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/number_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
}>>;
