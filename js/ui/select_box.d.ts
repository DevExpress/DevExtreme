import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../events/index';

import {
    DropDownButtonTemplateDataModel,
} from './drop_down_editor/ui.drop_down_editor';

import dxDropDownList, {
    dxDropDownListOptions,
    SelectionChangedInfo,
} from './drop_down_editor/ui.drop_down_list';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    Properties as PopupProperties,
} from './popup';

export interface CustomItemCreatingInfo {
    readonly text?: string;
    customItem?: string | any | PromiseLike<any>;
}

/** @public */
export type ChangeEvent = NativeEventInfo<dxSelectBox, Event>;

/** @public */
export type ClosedEvent = EventInfo<dxSelectBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxSelectBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxSelectBox, ClipboardEvent>;

/** @public */
export type CustomItemCreatingEvent = EventInfo<dxSelectBox> & CustomItemCreatingInfo;

/** @public */
export type CutEvent = NativeEventInfo<dxSelectBox, ClipboardEvent>;

/** @public */
export type DisposingEvent = EventInfo<dxSelectBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxSelectBox, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxSelectBox, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSelectBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxSelectBox, UIEvent & { target: HTMLInputElement }>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxSelectBox, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/** @public */
export type OpenedEvent = EventInfo<dxSelectBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSelectBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxSelectBox, ClipboardEvent>;

/** @public */
export type SelectionChangedEvent = EventInfo<dxSelectBox> & SelectionChangedInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxSelectBox, KeyboardEvent | MouseEvent | Event> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxSelectBoxOptions<TComponent> extends dxDropDownListOptions<TComponent> {
    /**
     * @docid
     * @default false
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 selectedItem:object
     * @type_function_return string|Element|jQuery
     * @public
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @section Utils
     * @type function
     * @docid
     * @type_function_param1 e:{ui/select_box:CustomItemCreatingEvent}
     * @action
     * @default function(e) { if(!e.customItem) { e.customItem = e.text; } }
     * @public
     */
    onCustomItemCreating?: ((e: EventInfo<TComponent> & CustomItemCreatingInfo) => void);
    /**
     * @docid
     * @default true
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @default "Select"
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default false
     * @public
     */
    showSelectionControls?: boolean;
    /**
     * @docid
     * @default "change"
     * @deprecated dxSelectBoxOptions.customItemCreateEvent
     * @public
     */
    valueChangeEvent?: string;

    /**
     * @docid
     * @default "change"
     * @public
     */
    customItemCreateEvent?: string;

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
export default class dxSelectBox<TProperties = Properties> extends dxDropDownList<TProperties> { }

interface SelectBoxInstance extends dxSelectBox<Properties> { }

/** @public */
export type Properties = dxSelectBoxOptions<SelectBoxInstance>;

/** @deprecated use Properties instead */
export type Options = Properties;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onCustomItemCreating'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxSelectBoxOptions.onChange
 * @type_function_param1 e:{ui/select_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onClosed
 * @type_function_param1 e:{ui/select_box:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onContentReady
 * @type_function_param1 e:{ui/select_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onCopy
 * @type_function_param1 e:{ui/select_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onCut
 * @type_function_param1 e:{ui/select_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onDisposing
 * @type_function_param1 e:{ui/select_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/select_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/select_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/select_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onInitialized
 * @type_function_param1 e:{ui/select_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onInput
 * @type_function_param1 e:{ui/select_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onItemClick
 * @type_function_param1 e:{ui/select_box:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/select_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/select_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onOpened
 * @type_function_param1 e:{ui/select_box:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/select_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onPaste
 * @type_function_param1 e:{ui/select_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onSelectionChanged
 * @type_function_param1 e:{ui/select_box:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @skip
 * @docid dxSelectBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/select_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
