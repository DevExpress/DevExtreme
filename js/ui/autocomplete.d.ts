import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import dxDropDownList, {
    dxDropDownListOptions,
    SelectionChangedInfo,
} from './drop_down_editor/ui.drop_down_list';

import {
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    Properties as PopupProperties,
} from './popup';

/** @public */
export type ChangeEvent = NativeEventInfo<dxAutocomplete, Event>;

/** @public */
export type ClosedEvent = EventInfo<dxAutocomplete>;

/** @public */
export type ContentReadyEvent = EventInfo<dxAutocomplete>;

/** @public */
export type CopyEvent = NativeEventInfo<dxAutocomplete, ClipboardEvent>;

/** @public */
export type CutEvent = NativeEventInfo<dxAutocomplete, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxAutocomplete>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxAutocomplete, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxAutocomplete, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxAutocomplete>;

/** @public */
export type InputEvent = NativeEventInfo<dxAutocomplete, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent>;

/** @public */
export type OpenedEvent = EventInfo<dxAutocomplete>;

/** @public */
export type OptionChangedEvent = EventInfo<dxAutocomplete> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxAutocomplete, ClipboardEvent>;

/** @public */
export type SelectionChangedEvent = EventInfo<dxAutocomplete> & SelectionChangedInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxAutocomplete, KeyboardEvent | MouseEvent | PointerEvent | Event> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxAutocompleteOptions extends dxDropDownListOptions<dxAutocomplete> {
    /**
     * @docid
     * @default 10
     * @public
     */
    maxItemCount?: number;
    /**
     * @docid
     * @default 1
     * @public
     */
    minSearchLength?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default null
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
 * @inherits dxDropDownList
 * @namespace DevExpress.ui
 * @public
 */
export default class dxAutocomplete extends dxDropDownList<dxAutocompleteOptions> { }

/** @public */
export type Properties = dxAutocompleteOptions;

/** @deprecated use Properties instead */
export type Options = dxAutocompleteOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

type Events = {
/**
 * @skip
 * @docid dxAutocompleteOptions.onChange
 * @type_function_param1 e:{ui/autocomplete:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onClosed
 * @type_function_param1 e:{ui/autocomplete:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onContentReady
 * @type_function_param1 e:{ui/autocomplete:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onCopy
 * @type_function_param1 e:{ui/autocomplete:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onCut
 * @type_function_param1 e:{ui/autocomplete:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onDisposing
 * @type_function_param1 e:{ui/autocomplete:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onEnterKey
 * @type_function_param1 e:{ui/autocomplete:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onFocusIn
 * @type_function_param1 e:{ui/autocomplete:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onFocusOut
 * @type_function_param1 e:{ui/autocomplete:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onInitialized
 * @type_function_param1 e:{ui/autocomplete:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onInput
 * @type_function_param1 e:{ui/autocomplete:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onItemClick
 * @type_function_param1 e:{ui/autocomplete:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onKeyDown
 * @type_function_param1 e:{ui/autocomplete:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onKeyUp
 * @type_function_param1 e:{ui/autocomplete:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onOpened
 * @type_function_param1 e:{ui/autocomplete:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onOptionChanged
 * @type_function_param1 e:{ui/autocomplete:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onPaste
 * @type_function_param1 e:{ui/autocomplete:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onSelectionChanged
 * @type_function_param1 e:{ui/autocomplete:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @skip
 * @docid dxAutocompleteOptions.onValueChanged
 * @type_function_param1 e:{ui/autocomplete:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
