import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import Store from '../data/abstract_store';

import {
    DataSourceOptions
} from '../data/data_source';

import Widget, {
    format,
    WidgetOptions
} from './widget/ui.widget';

export interface dxFilterBuilderOptions extends WidgetOptions<dxFilterBuilder> {
    /**
     * @docid dxFilterBuilderOptions.allowHierarchicalFields
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowHierarchicalFields?: boolean;
    /**
     * @docid dxFilterBuilderOptions.customOperations
     * @type Array<dxFilterBuilderCustomOperation>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customOperations?: Array<dxFilterBuilderCustomOperation>;
    /**
     * @docid dxFilterBuilderOptions.fields
     * @type Array<dxFilterBuilderField>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fields?: Array<dxFilterBuilderField>;
    /**
     * @docid dxFilterBuilderOptions.filterOperationDescriptions
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterOperationDescriptions?: { between?: string, contains?: string, endsWith?: string, equal?: string, greaterThan?: string, greaterThanOrEqual?: string, isBlank?: string, isNotBlank?: string, lessThan?: string, lessThanOrEqual?: string, notContains?: string, notEqual?: string, startsWith?: string };
    /**
     * @docid dxFilterBuilderOptions.groupOperationDescriptions
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupOperationDescriptions?: { and?: string, notAnd?: string, notOr?: string, or?: string };
    /**
     * @docid dxFilterBuilderOptions.groupOperations
     * @type Array<Enums.FilterBuilderGroupOperations>
     * @default ['and', 'or', 'notAnd', 'notOr']
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupOperations?: Array<'and' | 'or' | 'notAnd' | 'notOr'>;
    /**
     * @docid dxFilterBuilderOptions.maxGroupLevel
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxGroupLevel?: number;
    /**
     * @docid dxFilterBuilderOptions.onEditorPrepared
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:any
     * @type_function_param1_field5 setValue(newValue):any
     * @type_function_param1_field6 editorElement:dxElement
     * @type_function_param1_field7 editorName:string
     * @type_function_param1_field8 dataField:string
     * @type_function_param1_field9 filterOperation:string
     * @type_function_param1_field10 updateValueTimeout:number
     * @type_function_param1_field11 width:number
     * @type_function_param1_field12 readOnly:boolean
     * @type_function_param1_field13 disabled:boolean
     * @type_function_param1_field14 rtlEnabled:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorPrepared?: ((e: { component?: dxFilterBuilder, element?: dxElement, model?: any, value?: any, setValue?: any, editorElement?: dxElement, editorName?: string, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
    /**
     * @docid dxFilterBuilderOptions.onEditorPreparing
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:any
     * @type_function_param1_field5 setValue(newValue):any
     * @type_function_param1_field6 cancel:boolean
     * @type_function_param1_field7 editorElement:dxElement
     * @type_function_param1_field8 editorName:string
     * @type_function_param1_field9 editorOptions:object
     * @type_function_param1_field10 dataField:string
     * @type_function_param1_field11 filterOperation:string
     * @type_function_param1_field12 updateValueTimeout:number
     * @type_function_param1_field13 width:number
     * @type_function_param1_field14 readOnly:boolean
     * @type_function_param1_field15 disabled:boolean
     * @type_function_param1_field16 rtlEnabled:boolean
     * @extends Action
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorPreparing?: ((e: { component?: dxFilterBuilder, element?: dxElement, model?: any, value?: any, setValue?: any, cancel?: boolean, editorElement?: dxElement, editorName?: string, editorOptions?: any, dataField?: string, filterOperation?: string, updateValueTimeout?: number, width?: number, readOnly?: boolean, disabled?: boolean, rtlEnabled?: boolean }) => any);
    /**
     * @docid dxFilterBuilderOptions.onValueChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:object
     * @type_function_param1_field5 previousValue:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: dxFilterBuilder, element?: dxElement, model?: any, value?: any, previousValue?: any }) => any);
    /**
     * @docid dxFilterBuilderOptions.value
     * @type Filter expression
     * @default null
     * @fires dxFilterBuilderOptions.onValueChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: string | Array<any> | Function;
}
/**
 * @docid dxFilterBuilder
 * @inherits Widget
 * @module ui/filter_builder
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxFilterBuilder extends Widget {
    constructor(element: Element, options?: dxFilterBuilderOptions)
    constructor(element: JQuery, options?: dxFilterBuilderOptions)
    /**
     * @docid dxFilterBuilderMethods.getFilterExpression
     * @publicName getFilterExpression()
     * @return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getFilterExpression(): string | Array<any> | Function;
}

export interface dxFilterBuilderCustomOperation {
    /**
     * @docid dxFilterBuilderCustomOperation.calculateFilterExpression
     * @type function(filterValue, field)
     * @type_function_param1 filterValue:any
     * @type_function_param2 field:dxFilterBuilderField
     * @type_function_return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | Array<any> | Function);
    /**
     * @docid dxFilterBuilderCustomOperation.caption
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid dxFilterBuilderCustomOperation.customizeText
     * @type function(fieldInfo)
     * @type_function_param1 fieldInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 valueText:string
     * @type_function_param1_field3 field:dxFilterBuilderField
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string, field?: dxFilterBuilderField }) => string);
    /**
     * @docid dxFilterBuilderCustomOperation.dataTypes
     * @type Array<Enums.FilterBuilderFieldDataType>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataTypes?: Array<'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'>;
    /**
     * @docid dxFilterBuilderCustomOperation.editorTemplate
     * @type template|function
     * @type_function_param1 conditionInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 field:dxFilterBuilderField
     * @type_function_param1_field3 setValue:function
     * @type_function_param2 container:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorTemplate?: template | ((conditionInfo: { value?: string | number | Date, field?: dxFilterBuilderField, setValue?: Function }, container: dxElement) => string | Element | JQuery);
    /**
     * @docid dxFilterBuilderCustomOperation.hasValue
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasValue?: boolean;
    /**
     * @docid dxFilterBuilderCustomOperation.icon
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxFilterBuilderCustomOperation.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
}

export interface dxFilterBuilderField {
    /**
     * @docid dxFilterBuilderField.calculateFilterExpression
     * @type function(filterValue, selectedFilterOperation)
     * @type_function_param1 filterValue:any
     * @type_function_param2 selectedFilterOperation:string
     * @type_function_return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | Array<any> | Function);
    /**
     * @docid dxFilterBuilderField.caption
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid dxFilterBuilderField.customizeText
     * @type function(fieldInfo)
     * @type_function_param1 fieldInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 valueText:string
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeText?: ((fieldInfo: { value?: string | number | Date, valueText?: string }) => string);
    /**
     * @docid dxFilterBuilderField.dataField
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataField?: string;
    /**
     * @docid dxFilterBuilderField.dataType
     * @type Enums.FilterBuilderFieldDataType
     * @default "string"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
    /**
     * @docid dxFilterBuilderField.editorOptions
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorOptions?: any;
    /**
     * @docid dxFilterBuilderField.editorTemplate
     * @type template|function
     * @type_function_param1 conditionInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 filterOperation:string
     * @type_function_param1_field3 field:dxFilterBuilderField
     * @type_function_param1_field4 setValue:function
     * @type_function_param2 container:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorTemplate?: template | ((conditionInfo: { value?: string | number | Date, filterOperation?: string, field?: dxFilterBuilderField, setValue?: Function }, container: dxElement) => string | Element | JQuery);
    /**
     * @docid dxFilterBuilderField.falseText
     * @type string
     * @default "false"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    falseText?: string;
    /**
     * @docid dxFilterBuilderField.filterOperations
     * @type Array<Enums.FilterBuilderFieldFilterOperations, string>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | string>;
    /**
     * @docid dxFilterBuilderField.format
     * @type format
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    format?: format;
    /**
     * @docid dxFilterBuilderField.lookup
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    lookup?: { allowClearing?: boolean, dataSource?: Array<any> | DataSourceOptions | Store, displayExpr?: string | ((data: any) => string), valueExpr?: string | ((data: any) => string | number | boolean) };
    /**
     * @docid dxFilterBuilderField.name
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxFilterBuilderField.trueText
     * @type string
     * @default "true"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    trueText?: string;
}

declare global {
interface JQuery {
    dxFilterBuilder(): JQuery;
    dxFilterBuilder(options: "instance"): dxFilterBuilder;
    dxFilterBuilder(options: string): any;
    dxFilterBuilder(options: string, ...params: any[]): any;
    dxFilterBuilder(options: dxFilterBuilderOptions): JQuery;
}
}
export type Options = dxFilterBuilderOptions;

/** @deprecated use Options instead */
export type IOptions = dxFilterBuilderOptions;