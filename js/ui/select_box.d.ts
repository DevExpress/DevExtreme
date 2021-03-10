import '../jquery_augmentation';

import {
    TPromise
} from '../core';

import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import dxDropDownList, {
    dxDropDownListOptions
} from './drop_down_editor/ui.drop_down_list';

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
    fieldTemplate?: template | ((selectedItem: any, fieldElement: TElement) => string | Element | JQuery);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 text:string
     * @type_function_param1_field5 customItem:string|object|Promise<any>
     * @action
     * @default function(e) { if(!e.customItem) { e.customItem = e.text; } }
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCustomItemCreating?: ((e: { component?: T, element?: TElement, model?: any, text?: string, customItem?: string | any | TPromise<any> }) => any);
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
