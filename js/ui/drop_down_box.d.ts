import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

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
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    acceptCustomValue?: boolean;
    /**
     * @docid
     * @default 'content'
     * @type_function_param1 templateData:object
     * @type_function_param1_field1 component:dxDropDownBox
     * @type_function_param1_field2 value:any
     * @type_function_param2 contentElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contentTemplate?: template | ((templateData: { component?: dxDropDownBox, value?: any }, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<any> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @type_function_param1 value:string|Array<any>
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayValueFormatter?: ((value: string | Array<any>) => string);
    /**
     * @docid
     * @default null
     * @type_function_param1 value:object
     * @type_function_param2 fieldElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fieldTemplate?: template | ((value: any, fieldElement: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<any>;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    openOnFieldClick?: boolean;
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
