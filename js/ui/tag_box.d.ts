import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import dxSelectBox, {
    dxSelectBoxOptions
} from './select_box';

export interface dxTagBoxOptions extends dxSelectBoxOptions<dxTagBox> {
    /**
     * @docid
     * @type Enums.EditorApplyValueMode
     * @default "instantly"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hideSelectedItems?: boolean;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxDisplayedTags?: number;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    multiline?: boolean;
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 multiTagElement:dxElement
     * @type_function_param1_field5 selectedItems:Array<string,number,Object>
     * @type_function_param1_field6 text:string
     * @type_function_param1_field7 cancel:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onMultiTagPreparing?: ((e: { component?: dxTagBox, element?: dxElement, model?: any, multiTagElement?: dxElement, selectedItems?: Array<string | number | any>, text?: string, cancel?: boolean }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:boolean
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectAllValueChanged?: ((e: { component?: dxTagBox, element?: dxElement, model?: any, value?: boolean }) => any);
    /**
     * @docid
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 addedItems:Array<string,number,Object>
     * @type_function_param1_field5 removedItems:Array<string,number,Object>
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxTagBox, element?: dxElement, model?: any, addedItems?: Array<string | number | any>, removedItems?: Array<string | number | any> }) => any);
    /**
     * @docid
     * @type Enums.SelectAllMode
     * @default 'page'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectAllMode?: 'allPages' | 'page';
    /**
     * @docid
     * @type Array<string,number,Object>
     * @readonly
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItems?: Array<string | number | any>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showDropDownButton?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showMultiTagOnly?: boolean;
    /**
     * @docid
     * @type template|function
     * @default "tag"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    tagTemplate?: template | ((itemData: any, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type Array<string,number,Object>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: Array<string | number | any>;
}
/**
 * @docid
 * @isEditor
 * @inherits dxSelectBox
 * @module ui/tag_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTagBox extends dxSelectBox {
    constructor(element: Element, options?: dxTagBoxOptions)
    constructor(element: JQuery, options?: dxTagBoxOptions)
}

declare global {
interface JQuery {
    dxTagBox(): JQuery;
    dxTagBox(options: "instance"): dxTagBox;
    dxTagBox(options: string): any;
    dxTagBox(options: string, ...params: any[]): any;
    dxTagBox(options: dxTagBoxOptions): JQuery;
}
}
export type Options = dxTagBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxTagBoxOptions;
