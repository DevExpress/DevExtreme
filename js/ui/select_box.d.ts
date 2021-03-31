import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    template
} from '../core/templates/template';

import {
    ComponentEvent,
    ComponentNativeEvent,
    ItemEvent
} from '../events';

import {
    ComponentSelectionChangedEvent,
    
} from './collection/ui.collection_widget.base';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

import {
    ComponentValueChangedEvent
} from './editor/editor';

export interface ComponentCustomItemCreatingEvent<T> extends ComponentEvent<T> {
    readonly text?: string;
    customItem?: string | any | TPromise<any>;
}

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxSelectBox>;
/**
 * @public
 */
export type ValueChangedEvent = ComponentValueChangedEvent<dxSelectBox>;
/**
 * @public
 */
export type ItemClickEvent = ComponentNativeEvent<dxSelectBox> & ItemEvent;
/**
 * @public
 */
export type SelectionChangedEvent = ComponentSelectionChangedEvent<dxSelectBox>;
/**
 * @public
 */
export type ClosedEvent = ComponentEvent<dxSelectBox>;
/**
 * @public
 */
export type OpenedEvent = ComponentEvent<dxSelectBox>;
/**
 * @public
 */
export type ChangeEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type CopyEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type CutEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type EnterKeyEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type FocusInEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type FocusOutEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type InputEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type KeyDownEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type KeyPressEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type KeyUpEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
 */
export type PasteEvent = ComponentNativeEvent<dxSelectBox>;
/**
 * @public
*/
export type CustomItemCreatingEvent = ComponentCustomItemCreatingEvent<dxSelectBox>;

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
    constructor(element: TElement, options?: dxSelectBoxOptions)
}

export type Options = dxSelectBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxSelectBoxOptions;
