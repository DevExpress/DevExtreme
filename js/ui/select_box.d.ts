import {
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

export interface dxSelectBoxOptions<T = dxSelectBox> extends dxDropDownListOptions<T> {
    /**
     * @docid dxSelectBoxOptions.acceptCustomValue
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid dxSelectBoxOptions.fieldTemplate
     * @type template|function
     * @default null
     * @type_function_param1 selectedItem:object
     * @type_function_param2 fieldElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((selectedItem: any, fieldElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxSelectBoxOptions.onCustomItemCreating
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 text:string
     * @type_function_param1_field5 customItem:string|object|Promise<any>
     * @action
     * @default function(e) { if(!e.customItem) { e.customItem = e.text; } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCustomItemCreating?: ((e: { component?: T, element?: dxElement, model?: any, text?: string, customItem?: string | any | Promise<any> | JQueryPromise<any> }) => any);
    /**
     * @docid dxSelectBoxOptions.openOnFieldClick
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid dxSelectBoxOptions.placeholder
     * @type string
     * @default "Select"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    placeholder?: string;
    /**
     * @docid dxSelectBoxOptions.showDropDownButton
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid dxSelectBoxOptions.showSelectionControls
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showSelectionControls?: boolean;
    /**
     * @docid dxSelectBoxOptions.valueChangeEvent
     * @type string
     * @default "change"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueChangeEvent?: string;
}
/**
 * @docid dxSelectBox
 * @isEditor
 * @inherits dxDropDownList
 * @module ui/select_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSelectBox extends dxDropDownList {
    constructor(element: Element, options?: dxSelectBoxOptions)
    constructor(element: JQuery, options?: dxSelectBoxOptions)
}

declare global {
interface JQuery {
    dxSelectBox(): JQuery;
    dxSelectBox(options: "instance"): dxSelectBox;
    dxSelectBox(options: string): any;
    dxSelectBox(options: string, ...params: any[]): any;
    dxSelectBox(options: dxSelectBoxOptions): JQuery;
}
}
export type Options = dxSelectBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxSelectBoxOptions;