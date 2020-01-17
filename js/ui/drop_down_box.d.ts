import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource from '../data/data_source';

import dxDropDownEditor, {
    dxDropDownEditorOptions
} from './drop_down_editor/ui.drop_down_editor';

import {
    DataExpressionMixinOptions
} from './editor/ui.data_expression';

import {
    dxPopupOptions
} from './popup';

export interface dxDropDownBoxOptions extends DataExpressionMixinOptions<dxDropDownBox>, dxDropDownEditorOptions<dxDropDownBox> {
    /**
     * @docid dxDropDownBoxOptions.acceptCustomValue
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid dxDropDownBoxOptions.contentTemplate
     * @type template|function
     * @default 'content'
     * @type_function_param1 templateData:object
     * @type_function_param1_field1 component:dxDropDownBox
     * @type_function_param1_field2 value:any
     * @type_function_param2 contentElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((templateData: { component?: dxDropDownBox, value?: any }, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxDropDownBoxOptions.displayValueFormatter
     * @type function(value)
     * @type_function_param1 value:string|Array<any>
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayValueFormatter?: ((value: string | Array<any>) => string);
    /**
     * @docid dxDropDownBoxOptions.dropDownOptions
     * @type dxPopupOptions
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropDownOptions?: dxPopupOptions;
    /**
     * @docid dxDropDownBoxOptions.fieldTemplate
     * @type template|function
     * @default null
     * @type_function_param1 value:object
     * @type_function_param2 fieldElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((value: any, fieldElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxDropDownBoxOptions.openOnFieldClick
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    openOnFieldClick?: boolean;
    /**
     * @docid dxDropDownBoxOptions.valueChangeEvent
     * @type string
     * @default "change"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueChangeEvent?: string;
}
/**
 * @docid dxDropDownBox
 * @isEditor
 * @inherits DataExpressionMixin, dxDropDownEditor
 * @hasTranscludedContent
 * @module ui/drop_down_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxDropDownBox extends dxDropDownEditor {
    constructor(element: Element, options?: dxDropDownBoxOptions)
    constructor(element: JQuery, options?: dxDropDownBoxOptions)
    getDataSource(): DataSource;
}

declare global {
interface JQuery {
    dxDropDownBox(): JQuery;
    dxDropDownBox(options: "instance"): dxDropDownBox;
    dxDropDownBox(options: string): any;
    dxDropDownBox(options: string, ...params: any[]): any;
    dxDropDownBox(options: dxDropDownBoxOptions): JQuery;
}
}
export type Options = dxDropDownBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxDropDownBoxOptions;