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
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowHierarchicalFields?: boolean;
    /**
     * @docid
     * @type Array<dxFilterBuilderCustomOperation>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customOperations?: Array<dxFilterBuilderCustomOperation>;
    /**
     * @docid
     * @type Array<dxFilterBuilderField>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fields?: Array<dxFilterBuilderField>;
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterOperationDescriptions?: {
      /**
       * @docid
       * @default "Between"
       */
      between?: string,
      /**
       * @docid
       * @default "Contains"
       */
      contains?: string,
      /**
       * @docid
       * @default "Ends with"
       */
      endsWith?: string,
      /**
       * @docid
       * @default "Equals"
       */
      equal?: string,
      /**
       * @docid
       * @default "Greater than"
       */
      greaterThan?: string,
      /**
       * @docid
       * @default "Greater than or equal to"
       */
      greaterThanOrEqual?: string,
      /**
       * @docid
       * @default "Is blank"
       */
      isBlank?: string,
      /**
       * @docid
       * @default "Is not blank"
       */
      isNotBlank?: string,
      /**
       * @docid
       * @default "Less than"
       */
      lessThan?: string,
      /**
       * @docid
       * @default "Less than or equal to"
       */
      lessThanOrEqual?: string,
      /**
       * @docid
       * @default "Does not contain"
       */
      notContains?: string,
      /**
       * @docid
       * @default "Does not equal"
       */
      notEqual?: string,
      /**
       * @docid
       * @default "Starts with"
       */
      startsWith?: string
    };
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupOperationDescriptions?: {
      /**
       * @docid
       * @default "And"
       */
      and?: string,
      /**
       * @docid
       * @default "Not And"
       */
      notAnd?: string,
      /**
       * @docid
       * @default "Not Or"
       */
      notOr?: string,
      /**
       * @docid
       * @default "Or"
       */
      or?: string
    };
    /**
     * @docid
     * @type Array<Enums.FilterBuilderGroupOperations>
     * @default ['and', 'or', 'notAnd', 'notOr']
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupOperations?: Array<'and' | 'or' | 'notAnd' | 'notOr'>;
    /**
     * @docid
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxGroupLevel?: number;
    /**
     * @docid
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
     * @docid
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
     * @docid
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
     * @docid
     * @type Filter expression
     * @default null
     * @fires dxFilterBuilderOptions.onValueChanged
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: string | Array<any> | Function;
}
/**
 * @docid
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
     * @docid
     * @publicName getFilterExpression()
     * @return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getFilterExpression(): string | Array<any> | Function;
}

/**
 * @docid
 * @type object
 */
export interface dxFilterBuilderCustomOperation {
    /**
     * @docid
     * @type function(filterValue, field)
     * @type_function_param1 filterValue:any
     * @type_function_param2 field:dxFilterBuilderField
     * @type_function_return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | Array<any> | Function);
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid
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
     * @docid
     * @type Array<Enums.FilterBuilderFieldDataType>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataTypes?: Array<'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime'>;
    /**
     * @docid
     * @type template|function
     * @type_function_param1 conditionInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 field:dxFilterBuilderField
     * @type_function_param1_field3 setValue:function
     * @type_function_param2 container:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorTemplate?: template | ((conditionInfo: { value?: string | number | Date, field?: dxFilterBuilderField, setValue?: Function }, container: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasValue?: boolean;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
}

/**
 * @@docid
 * @type object
 */
export interface dxFilterBuilderField {
    /**
     * @docid
     * @type function(filterValue, selectedFilterOperation)
     * @type_function_param1 filterValue:any
     * @type_function_param2 selectedFilterOperation:string
     * @type_function_return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | Array<any> | Function);
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid
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
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataField?: string;
    /**
     * @docid
     * @type Enums.FilterBuilderFieldDataType
     * @default "string"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
    /**
     * @docid
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorOptions?: any;
    /**
     * @docid
     * @type template|function
     * @type_function_param1 conditionInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 filterOperation:string
     * @type_function_param1_field3 field:dxFilterBuilderField
     * @type_function_param1_field4 setValue:function
     * @type_function_param2 container:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorTemplate?: template | ((conditionInfo: { value?: string | number | Date, filterOperation?: string, field?: dxFilterBuilderField, setValue?: Function }, container: dxElement) => string | Element | JQuery);
    /**
     * @docid
     * @type string
     * @default "false"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    falseText?: string;
    /**
     * @docid
     * @type Array<Enums.FilterBuilderFieldFilterOperations, string>
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterOperations?: Array<'=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | string>;
    /**
     * @docid
     * @type format
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    format?: format;
    /**
     * @docid
     * @type object
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    lookup?: {
      /**
       * @docid
       * @default false
       */
      allowClearing?: boolean,
      /**
       * @docid
       * @type Array<any>|DataSourceOptions|Store
       * @default undefined
       */
      dataSource?: Array<any> | DataSourceOptions | Store,
      /**
       * @docid
       * @type string|function(data)
       * @default undefined
       * @type_function_param1 data:object
       * @type_function_return string
       */
      displayExpr?: string | ((data: any) => string),
      /**
       * @docid
       * @type string|function(data)
       * @default undefined
       * @type_function_param1 data:object
       * @type_function_return string|number|boolean
       */
      valueExpr?: string | ((data: any) => string | number | boolean)
    };
    /**
     * @docid
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
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
