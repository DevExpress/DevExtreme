import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    template,
} from '../core/templates/template';

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

import {
    ApplyValueMode,
} from '../common';

/** @public */
export type ChangeEvent = NativeEventInfo<dxColorBox, Event>;

/** @public */
export type ClosedEvent = EventInfo<dxColorBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxColorBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxColorBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxColorBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxColorBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxColorBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxColorBox, KeyboardEvent>;

/** @public */
export type OpenedEvent = EventInfo<dxColorBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxColorBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxColorBox, ClipboardEvent>;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxColorBox, KeyboardEvent | MouseEvent | PointerEvent | UIEvent | Event> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
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
export default class dxColorBox extends dxDropDownEditor<dxColorBoxOptions> { }

/** @public */
export type Properties = dxColorBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxColorBoxOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onContentReady'>;

type Events = CheckedEvents<FilterOutHidden<Properties>, Required<{
/**
 * @skip
 * @docid dxColorBoxOptions.onChange
 * @type_function_param1 e:{ui/color_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onClosed
 * @type_function_param1 e:{ui/color_box:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onCopy
 * @type_function_param1 e:{ui/color_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onCut
 * @type_function_param1 e:{ui/color_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onDisposing
 * @type_function_param1 e:{ui/color_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/color_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/color_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/color_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onInitialized
 * @type_function_param1 e:{ui/color_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onInput
 * @type_function_param1 e:{ui/color_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/color_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/color_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onOpened
 * @type_function_param1 e:{ui/color_box:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/color_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onPaste
 * @type_function_param1 e:{ui/color_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @skip
 * @docid dxColorBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/color_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
}>>;
