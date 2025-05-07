import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    TextEditorButton,
} from '../common';

import dxTextEditor, {
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

/**
 * @docid _ui_number_box_ChangeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ChangeEvent = NativeEventInfo<dxNumberBox, Event>;

/**
 * @docid _ui_number_box_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxNumberBox>;

/**
 * @docid _ui_number_box_CopyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CopyEvent = NativeEventInfo<dxNumberBox, ClipboardEvent>;

/**
 * @docid _ui_number_box_CutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CutEvent = NativeEventInfo<dxNumberBox, ClipboardEvent>;

/**
 * @docid _ui_number_box_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxNumberBox>;

/**
 * @docid _ui_number_box_EnterKeyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type EnterKeyEvent = NativeEventInfo<dxNumberBox, KeyboardEvent>;

/**
 * @docid _ui_number_box_FocusInEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusInEvent = NativeEventInfo<dxNumberBox, FocusEvent>;

/**
 * @docid _ui_number_box_FocusOutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusOutEvent = NativeEventInfo<dxNumberBox, FocusEvent>;

/**
 * @docid _ui_number_box_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxNumberBox>;

/**
 * @docid _ui_number_box_InputEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type InputEvent = NativeEventInfo<dxNumberBox, UIEvent & { target: HTMLInputElement }>;

/**
 * @docid _ui_number_box_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyDownEvent = NativeEventInfo<dxNumberBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxNumberBox, KeyboardEvent>;

/**
 * @docid _ui_number_box_KeyUpEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyUpEvent = NativeEventInfo<dxNumberBox, KeyboardEvent>;

/**
 * @docid _ui_number_box_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxNumberBox> & ChangedOptionInfo;

/**
 * @docid _ui_number_box_PasteEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PasteEvent = NativeEventInfo<dxNumberBox, ClipboardEvent>;

/**
 * @docid _ui_number_box_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxNumberBox, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | Event> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxNumberBoxOptions extends dxTextEditorOptions<dxNumberBox> {
    /**
     * @docid
     * @default undefined
     * @public
     */
    buttons?: Array<NumberBoxPredefinedButton | TextEditorButton>;
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
    max?: number | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    min?: number | undefined;
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
export default class dxNumberBox extends dxTextEditor<dxNumberBoxOptions> {
    /**
     * @docid
     * @publicName reset(value)
     * @public
     */
    reset(value?: number): void;
}

/** @public */
export type Properties = dxNumberBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxNumberBoxOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxNumberBoxOptions.onChange
 * @type_function_param1 e:{ui/number_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @docid dxNumberBoxOptions.onContentReady
 * @type_function_param1 e:{ui/number_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxNumberBoxOptions.onCopy
 * @type_function_param1 e:{ui/number_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @docid dxNumberBoxOptions.onCut
 * @type_function_param1 e:{ui/number_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @docid dxNumberBoxOptions.onDisposing
 * @type_function_param1 e:{ui/number_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxNumberBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/number_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @docid dxNumberBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/number_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @docid dxNumberBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/number_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @docid dxNumberBoxOptions.onInitialized
 * @type_function_param1 e:{ui/number_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxNumberBoxOptions.onInput
 * @type_function_param1 e:{ui/number_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @docid dxNumberBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/number_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @docid dxNumberBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/number_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @docid dxNumberBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/number_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxNumberBoxOptions.onPaste
 * @type_function_param1 e:{ui/number_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @docid dxNumberBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/number_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
