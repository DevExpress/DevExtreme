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
export type InputEvent = NativeEventInfo<dxSelectBox, UIEvent>;

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
     * @type_function_param1 e:object
     * @type_function_param1_field component:this
     * @type_function_param1_field customItem:string|object|Promise<any>
     * @type_function_param1_field model:any
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
     * @public
     */
    valueChangeEvent?: string;

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
