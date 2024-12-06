import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo,
} from '../common/core/events';

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

/**
 * @docid
 * @hidden
 */
export interface CustomItemCreatingInfo {
    /** @docid */
    readonly text?: string;
    /**
     * @docid
     * @type string|object|Promise<any>
     */
    customItem?: string | any | PromiseLike<any>;
}

/**
 * @docid _ui_select_box_ChangeEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ChangeEvent = NativeEventInfo<dxSelectBox, Event>;

/**
 * @docid _ui_select_box_ClosedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ClosedEvent = EventInfo<dxSelectBox>;

/**
 * @docid _ui_select_box_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxSelectBox>;

/**
 * @docid _ui_select_box_CopyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CopyEvent = NativeEventInfo<dxSelectBox, ClipboardEvent>;

/**
 * @docid _ui_select_box_CustomItemCreatingEvent
 * @public
 * @type object
 * @inherits EventInfo,CustomItemCreatingInfo
 */
export type CustomItemCreatingEvent = EventInfo<dxSelectBox> & CustomItemCreatingInfo;

/**
 * @docid _ui_select_box_CutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type CutEvent = NativeEventInfo<dxSelectBox, ClipboardEvent>;

/**
 * @docid _ui_select_box_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxSelectBox>;

/**
 * @docid _ui_select_box_EnterKeyEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type EnterKeyEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/**
 * @docid _ui_select_box_FocusInEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusInEvent = NativeEventInfo<dxSelectBox, FocusEvent>;

/**
 * @docid _ui_select_box_FocusOutEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type FocusOutEvent = NativeEventInfo<dxSelectBox, FocusEvent>;

/**
 * @docid _ui_select_box_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxSelectBox>;

/**
 * @docid _ui_select_box_InputEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type InputEvent = NativeEventInfo<dxSelectBox, UIEvent & { target: HTMLInputElement }>;

/**
 * @docid _ui_select_box_ItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ItemInfo
 */
export type ItemClickEvent = NativeEventInfo<dxSelectBox, KeyboardEvent | MouseEvent | PointerEvent> & ItemInfo;

/**
 * @docid _ui_select_box_KeyDownEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyDownEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/**
 * @docid _ui_select_box_KeyUpEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type KeyUpEvent = NativeEventInfo<dxSelectBox, KeyboardEvent>;

/**
 * @docid _ui_select_box_OpenedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type OpenedEvent = EventInfo<dxSelectBox>;

/**
 * @docid _ui_select_box_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxSelectBox> & ChangedOptionInfo;

/**
 * @docid _ui_select_box_PasteEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type PasteEvent = NativeEventInfo<dxSelectBox, ClipboardEvent>;

/**
 * @docid _ui_select_box_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,_ui_drop_down_editor_ui_drop_down_list_SelectionChangedInfo
 */
export type SelectionChangedEvent = EventInfo<dxSelectBox> & SelectionChangedInfo;

/**
 * @docid _ui_select_box_ValueChangedEvent
 * @public
 * @type object
 * @inherits NativeEventInfo,ValueChangedInfo
 */
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

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onCustomItemCreating'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxSelectBoxOptions.onChange
 * @type_function_param1 e:{ui/select_box:ChangeEvent}
 */
onChange?: ((e: ChangeEvent) => void);
/**
 * @docid dxSelectBoxOptions.onClosed
 * @type_function_param1 e:{ui/select_box:ClosedEvent}
 */
onClosed?: ((e: ClosedEvent) => void);
/**
 * @docid dxSelectBoxOptions.onContentReady
 * @type_function_param1 e:{ui/select_box:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxSelectBoxOptions.onCopy
 * @type_function_param1 e:{ui/select_box:CopyEvent}
 */
onCopy?: ((e: CopyEvent) => void);
/**
 * @docid dxSelectBoxOptions.onCut
 * @type_function_param1 e:{ui/select_box:CutEvent}
 */
onCut?: ((e: CutEvent) => void);
/**
 * @docid dxSelectBoxOptions.onDisposing
 * @type_function_param1 e:{ui/select_box:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxSelectBoxOptions.onEnterKey
 * @type_function_param1 e:{ui/select_box:EnterKeyEvent}
 */
onEnterKey?: ((e: EnterKeyEvent) => void);
/**
 * @docid dxSelectBoxOptions.onFocusIn
 * @type_function_param1 e:{ui/select_box:FocusInEvent}
 */
onFocusIn?: ((e: FocusInEvent) => void);
/**
 * @docid dxSelectBoxOptions.onFocusOut
 * @type_function_param1 e:{ui/select_box:FocusOutEvent}
 */
onFocusOut?: ((e: FocusOutEvent) => void);
/**
 * @docid dxSelectBoxOptions.onInitialized
 * @type_function_param1 e:{ui/select_box:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxSelectBoxOptions.onInput
 * @type_function_param1 e:{ui/select_box:InputEvent}
 */
onInput?: ((e: InputEvent) => void);
/**
 * @docid dxSelectBoxOptions.onItemClick
 * @type_function_param1 e:{ui/select_box:ItemClickEvent}
 */
onItemClick?: ((e: ItemClickEvent) => void);
/**
 * @docid dxSelectBoxOptions.onKeyDown
 * @type_function_param1 e:{ui/select_box:KeyDownEvent}
 */
onKeyDown?: ((e: KeyDownEvent) => void);
/**
 * @docid dxSelectBoxOptions.onKeyUp
 * @type_function_param1 e:{ui/select_box:KeyUpEvent}
 */
onKeyUp?: ((e: KeyUpEvent) => void);
/**
 * @docid dxSelectBoxOptions.onOpened
 * @type_function_param1 e:{ui/select_box:OpenedEvent}
 */
onOpened?: ((e: OpenedEvent) => void);
/**
 * @docid dxSelectBoxOptions.onOptionChanged
 * @type_function_param1 e:{ui/select_box:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxSelectBoxOptions.onPaste
 * @type_function_param1 e:{ui/select_box:PasteEvent}
 */
onPaste?: ((e: PasteEvent) => void);
/**
 * @docid dxSelectBoxOptions.onSelectionChanged
 * @type_function_param1 e:{ui/select_box:SelectionChangedEvent}
 */
onSelectionChanged?: ((e: SelectionChangedEvent) => void);
/**
 * @docid dxSelectBoxOptions.onValueChanged
 * @type_function_param1 e:{ui/select_box:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
