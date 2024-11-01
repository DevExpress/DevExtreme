import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTextBox, {
    dxTextBoxOptions,
} from './text_box';

/**
 * @docid _ui_text_area_ChangeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ChangeEvent = NativeEventInfo<dxTextArea, Event>;

/**
 * @docid _ui_text_area_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxTextArea>;

/**
 * @docid _ui_text_area_CopyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CopyEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/**
 * @docid _ui_text_area_CutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CutEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/**
 * @docid _ui_text_area_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxTextArea>;

/**
 * @docid _ui_text_area_EnterKeyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type EnterKeyEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/**
 * @docid _ui_text_area_FocusInEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusInEvent = NativeEventInfo<dxTextArea, FocusEvent>;

/**
 * @docid _ui_text_area_FocusOutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusOutEvent = NativeEventInfo<dxTextArea, FocusEvent>;

/**
 * @docid _ui_text_area_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxTextArea>;

/**
 * @docid _ui_text_area_InputEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type InputEvent = NativeEventInfo<dxTextArea, UIEvent & { target: HTMLInputElement }>;

/**
 * @docid _ui_text_area_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyDownEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/**
 * @docid _ui_text_area_KeyUpEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyUpEvent = NativeEventInfo<dxTextArea, KeyboardEvent>;

/**
 * @docid _ui_text_area_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxTextArea> & ChangedOptionInfo;

/**
 * @docid _ui_text_area_PasteEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PasteEvent = NativeEventInfo<dxTextArea, ClipboardEvent>;

/**
 * @docid _ui_text_area_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxTextArea, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
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
    maxHeight?: number | string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    minHeight?: number | string | undefined;
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

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTextAreaOptions.onChange
 * @type_function_param1 e:{ui/text_area:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @docid dxTextAreaOptions.onContentReady
 * @type_function_param1 e:{ui/text_area:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxTextAreaOptions.onCopy
 * @type_function_param1 e:{ui/text_area:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @docid dxTextAreaOptions.onCut
 * @type_function_param1 e:{ui/text_area:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @docid dxTextAreaOptions.onDisposing
 * @type_function_param1 e:{ui/text_area:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTextAreaOptions.onEnterKey
 * @type_function_param1 e:{ui/text_area:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @docid dxTextAreaOptions.onFocusIn
 * @type_function_param1 e:{ui/text_area:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @docid dxTextAreaOptions.onFocusOut
 * @type_function_param1 e:{ui/text_area:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @docid dxTextAreaOptions.onInitialized
 * @type_function_param1 e:{ui/text_area:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTextAreaOptions.onInput
 * @type_function_param1 e:{ui/text_area:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @docid dxTextAreaOptions.onKeyDown
 * @type_function_param1 e:{ui/text_area:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @docid dxTextAreaOptions.onKeyUp
 * @type_function_param1 e:{ui/text_area:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @docid dxTextAreaOptions.onOptionChanged
 * @type_function_param1 e:{ui/text_area:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxTextAreaOptions.onPaste
 * @type_function_param1 e:{ui/text_area:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @docid dxTextAreaOptions.onValueChanged
 * @type_function_param1 e:{ui/text_area:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
