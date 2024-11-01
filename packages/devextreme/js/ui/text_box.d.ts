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

/** @public */
export type TextBoxType = 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

/**
 * @docid _ui_text_box_ChangeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ChangeEvent = NativeEventInfo<dxTextBox, Event>;

/**
 * @docid _ui_text_box_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxTextBox>;

/**
 * @docid _ui_text_box_CopyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CopyEvent = NativeEventInfo<dxTextBox, ClipboardEvent>;

/**
 * @docid _ui_text_box_CutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CutEvent = NativeEventInfo<dxTextBox, ClipboardEvent>;

/**
 * @docid _ui_text_box_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxTextBox>;

/**
 * @docid _ui_text_box_EnterKeyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type EnterKeyEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/**
 * @docid _ui_text_box_FocusInEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusInEvent = NativeEventInfo<dxTextBox, FocusEvent>;

/**
 * @docid _ui_text_box_FocusOutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusOutEvent = NativeEventInfo<dxTextBox, FocusEvent>;

/**
 * @docid _ui_text_box_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxTextBox>;

/**
 * @docid _ui_text_box_InputEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type InputEvent = NativeEventInfo<dxTextBox, UIEvent & { target: HTMLInputElement }>;

/**
 * @docid _ui_text_box_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyDownEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/**
 * @docid _ui_text_box_KeyUpEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyUpEvent = NativeEventInfo<dxTextBox, KeyboardEvent>;

/**
 * @docid _ui_text_box_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxTextBox> & ChangedOptionInfo;

/**
 * @docid _ui_text_box_PasteEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PasteEvent = NativeEventInfo<dxTextBox, ClipboardEvent>;

/**
 * @docid _ui_text_box_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxTextBox, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
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
export default class dxTextBox<TProperties = Properties> extends dxTextEditor<TProperties> {
    /**
     * @docid
     * @publicName reset(value)
     * @public
     */
    reset(value?: string): void;
}

interface TextBoxInstance extends dxTextBox<Properties> { }

/** @public */
export type Properties = dxTextBoxOptions<TextBoxInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTextBoxOptions.onChange
 * @type_function_param1 e:{ui/text_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @docid dxTextBoxOptions.onContentReady
 * @type_function_param1 e:{ui/text_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxTextBoxOptions.onCopy
 * @type_function_param1 e:{ui/text_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @docid dxTextBoxOptions.onCut
 * @type_function_param1 e:{ui/text_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @docid dxTextBoxOptions.onDisposing
 * @type_function_param1 e:{ui/text_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTextBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/text_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @docid dxTextBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/text_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @docid dxTextBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/text_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @docid dxTextBoxOptions.onInitialized
 * @type_function_param1 e:{ui/text_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTextBoxOptions.onInput
 * @type_function_param1 e:{ui/text_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @docid dxTextBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/text_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @docid dxTextBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/text_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @docid dxTextBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/text_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxTextBoxOptions.onPaste
 * @type_function_param1 e:{ui/text_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @docid dxTextBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/text_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
