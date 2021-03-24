import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    template
} from '../core/templates/template';

import dxDropDownList, {
    dxDropDownListOptions,
    ItemClickEvent,
    ValueChangedEvent,
    SelectionChangedEvent,
    CutEvent,
    CopyEvent,
    InputEvent,
    KeyUpEvent,
    PasteEvent,
    OpenedEvent,
    ClosedEvent,
    ChangeEvent,
    FocusInEvent,
    KeyDownEvent,
    EnterKeyEvent,
    FocusOutEvent,
    KeyPressEvent,
    ContentReadyEvent
} from './drop_down_editor/ui.drop_down_list';
import { BaseEvent } from '../events/index';

/**
 * @public
*/
export {
    ItemClickEvent,
    ValueChangedEvent,
    SelectionChangedEvent,
    CutEvent,
    CopyEvent,
    InputEvent,
    KeyUpEvent,
    PasteEvent,
    OpenedEvent,
    ClosedEvent,
    ChangeEvent,
    FocusInEvent,
    KeyDownEvent,
    EnterKeyEvent,
    FocusOutEvent,
    KeyPressEvent,
    ContentReadyEvent
}
/**
 * @public
*/
export interface CustomItemCreatingEvent<T> extends BaseEvent<T> {
    readonly text?: string,
    customItem?: string | any | TPromise<any> 
}
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
     * @type_function_param2 fieldElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: TElement) => string | TElement);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 text:string
     * @type_function_param1_field5 customItem:string|object|Promise<any>
     * @type_function_param1_field1 component:this
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @action
     * @default function(e) { if(!e.customItem) { e.customItem = e.text; } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCustomItemCreating?: ((e: CustomItemCreatingEvent<T>) => void);
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
    constructor(element: TElement, options?: dxSelectBoxOptions)
}

export type Options = dxSelectBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxSelectBoxOptions;
