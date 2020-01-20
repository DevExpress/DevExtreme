import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import dxDropDownEditor, {
    dxDropDownEditorOptions
} from './drop_down_editor/ui.drop_down_editor';

export interface dxColorBoxOptions extends dxDropDownEditorOptions<dxColorBox> {
    /**
     * @docid dxColorBoxOptions.applyButtonText
     * @type string
     * @default "OK"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyButtonText?: string;
    /**
     * @docid dxColorBoxOptions.applyValueMode
     * @type Enums.EditorApplyValueMode
     * @default "useButtons"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    applyValueMode?: 'instantly' | 'useButtons';
    /**
     * @docid dxColorBoxOptions.cancelButtonText
     * @type string
     * @default "Cancel"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cancelButtonText?: string;
    /**
     * @docid dxColorBoxOptions.editAlphaChannel
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editAlphaChannel?: boolean;
    /**
     * @docid dxColorBoxOptions.fieldTemplate
     * @type template|function
     * @default null
     * @type_function_param1 value:string
     * @type_function_param2 fieldElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((value: string, fieldElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxColorBoxOptions.keyStep
     * @type number
     * @default 1
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    keyStep?: number;
    /**
     * @docid dxColorBoxOptions.value
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: string;
}
/**
 * @docid dxColorBox
 * @isEditor
 * @inherits dxDropDownEditor
 * @module ui/color_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxColorBox extends dxDropDownEditor {
    constructor(element: Element, options?: dxColorBoxOptions)
    constructor(element: JQuery, options?: dxColorBoxOptions)
}

declare global {
interface JQuery {
    dxColorBox(): JQuery;
    dxColorBox(options: "instance"): dxColorBox;
    dxColorBox(options: string): any;
    dxColorBox(options: string, ...params: any[]): any;
    dxColorBox(options: dxColorBoxOptions): JQuery;
}
}
export type Options = dxColorBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxColorBoxOptions;