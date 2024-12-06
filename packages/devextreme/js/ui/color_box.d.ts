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
 * @docid _ui_color_box_ChangeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ChangeEvent = NativeEventInfo<dxColorBox, Event>;

/**
 * @docid _ui_color_box_ClosedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ClosedEvent = EventInfo<dxColorBox>;

/**
 * @docid _ui_color_box_CopyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CopyEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/**
 * @docid _ui_color_box_CutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CutEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/**
 * @docid _ui_color_box_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxColorBox>;

/**
 * @docid _ui_color_box_EnterKeyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type EnterKeyEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/**
 * @docid _ui_color_box_FocusInEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusInEvent = NativeEventInfo<dxColorBox, FocusEvent>;

/**
 * @docid _ui_color_box_FocusOutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusOutEvent = NativeEventInfo<dxColorBox, FocusEvent>;

/**
 * @docid _ui_color_box_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxColorBox>;

/**
 * @docid _ui_color_box_InputEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type InputEvent = NativeEventInfo<dxColorBox, UIEvent & { target: HTMLInputElement }>;

/**
 * @docid _ui_color_box_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyDownEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/**
 * @docid _ui_color_box_KeyUpEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyUpEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/**
 * @docid _ui_color_box_OpenedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type OpenedEvent = EventInfo<dxColorBox>;

/**
 * @docid _ui_color_box_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxColorBox> & ChangedOptionInfo;

/**
 * @docid _ui_color_box_PasteEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PasteEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/**
 * @docid _ui_color_box_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
export type ValueChangedEvent = NativeEventInfo<dxColorBox, KeyboardEvent | MouseEvent | PointerEvent | UIEvent | Event> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxColorBoxOptions extends dxDropDownEditorOptions<dxColorBox> {
    /**
     * @docid
     * @default "OK"
     * @public
     */
    applyButtonText?: string;
    /**
     * @docid
     * @default "useButtons"
     * @public
     */
    applyValueMode?: ApplyValueMode;
    /**
     * @docid
     * @default "Cancel"
     * @public
     */
    cancelButtonText?: string;
    /**
     * @docid
     * @default false
     * @public
     */
    editAlphaChannel?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_return string|Element|jQuery
     * @public
     */
    fieldTemplate?: template | ((value: string, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default 1
     * @public
     */
    keyStep?: number;
    /**
     * @docid
     * @public
     */
    value?: string;
    /**
     * @docid
     * @type dxPopupOptions
     */
    dropDownOptions?: PopupProperties;
}
/**
 * @docid
 * @isEditor
 * @inherits dxDropDownEditor
 * @namespace DevExpress.ui
 * @public
 */
export default class dxColorBox extends dxDropDownEditor<dxColorBoxOptions> {
    /**
     * @docid
     * @publicName reset(value)
     * @public
     */
    reset(value?: string | null): void;
}

/** @public */
export type Properties = dxColorBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxColorBoxOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onContentReady'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxColorBoxOptions.onChange
 * @type_function_param1 e:{ui/color_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @docid dxColorBoxOptions.onClosed
 * @type_function_param1 e:{ui/color_box:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @docid dxColorBoxOptions.onCopy
 * @type_function_param1 e:{ui/color_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @docid dxColorBoxOptions.onCut
 * @type_function_param1 e:{ui/color_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @docid dxColorBoxOptions.onDisposing
 * @type_function_param1 e:{ui/color_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxColorBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/color_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @docid dxColorBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/color_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @docid dxColorBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/color_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @docid dxColorBoxOptions.onInitialized
 * @type_function_param1 e:{ui/color_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxColorBoxOptions.onInput
 * @type_function_param1 e:{ui/color_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @docid dxColorBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/color_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @docid dxColorBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/color_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @docid dxColorBoxOptions.onOpened
 * @type_function_param1 e:{ui/color_box:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @docid dxColorBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/color_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxColorBoxOptions.onPaste
 * @type_function_param1 e:{ui/color_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @docid dxColorBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/color_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
