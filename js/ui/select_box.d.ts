import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
    ItemInfo
} from '../events/index';

import {
    SelectionChangedInfo
} from './collection/ui.collection_widget.base';

import {
    DropDownButtonTemplateDataModel
} from './drop_down_editor/ui.drop_down_editor';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

import {
    ValueChangedInfo
} from './editor/editor';

export interface CustomItemCreatingInfo {
    readonly text?: string;
    customItem?: string | any | PromiseLike<any>;
}

/** @public */
export type ChangeEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type ClosedEvent = EventInfo<dxSelectBox>;

/** @public */
export type ContentReadyEvent = EventInfo<dxSelectBox>;

/** @public */
export type CopyEvent = NativeEventInfo<dxSelectBox>;
/** @public */
export type CustomItemCreatingEvent = EventInfo<dxSelectBox> & CustomItemCreatingInfo;

/** @public */
export type CutEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type DisposingEvent = EventInfo<dxSelectBox>;

/** @public */
export type EnterKeyEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxSelectBox>;

/** @public */
export type InputEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type ItemClickEvent = NativeEventInfo<dxSelectBox> & ItemInfo;

/** @public */
export type KeyDownEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type KeyPressEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type KeyUpEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type OpenedEvent = EventInfo<dxSelectBox>;

/** @public */
export type OptionChangedEvent = EventInfo<dxSelectBox> & ChangedOptionInfo;

/** @public */
export type PasteEvent = NativeEventInfo<dxSelectBox>;

/** @public */
export type SelectionChangedEvent = EventInfo<dxSelectBox> & SelectionChangedInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxSelectBox> & ValueChangedInfo;

/** @public */
export type DropDownButtonTemplateData = DropDownButtonTemplateDataModel;

/** @deprecated use Properties instead */
export interface dxSelectBoxOptions<T = dxSelectBox> extends dxDropDownListOptions<T> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default null
     * @type_function_param1 selectedItem:object
     * @type_function_param2 fieldElement:DxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 text:string
     * @type_function_param1_field5 customItem:string|object|Promise<any>
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @default function(e) { if(!e.customItem) { e.customItem = e.text; } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCustomItemCreating?: ((e: CustomItemCreatingEvent) => void);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid
     * @default "Select"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showSelectionControls?: boolean;
    /**
     * @docid
     * @default "change"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueChangeEvent?: string;
}
/**
 * @docid
 * @isEditor
 * @inherits dxDropDownList
 * @module ui/select_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSelectBox extends dxDropDownList {
    constructor(element: UserDefinedElement, options?: dxSelectBoxOptions)
}

/** @public */
export type Properties = dxSelectBoxOptions;

/** @deprecated use Properties instead */
export type Options = dxSelectBoxOptions;

/** @deprecated use Properties instead */
export type IOptions = dxSelectBoxOptions;
