import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import Store from '../data/abstract_store';

import {
    DataSourceOptions
} from '../data/data_source';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Widget, {
    format,
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type ContentReadyEvent = EventInfo<dxFilterBuilder>;

/** @public */
export type DisposingEvent = EventInfo<dxFilterBuilder>;

/** @public */
export type EditorPreparedEvent = EventInfo<dxFilterBuilder> & {
    readonly value?: any;
    readonly setValue: any;
    readonly editorElement: DxElement;
    readonly editorName: string;
    readonly dataField?: string;
    readonly filterOperation?: string;
    readonly updateValueTimeout?: number;
    readonly width?: number;
    readonly readOnly: boolean;
    readonly disabled: boolean;
    readonly rtlEnabled: boolean;
}

/** @public */
export type EditorPreparingEvent = Cancelable & EventInfo<dxFilterBuilder> & {
    readonly value?: any;
    readonly setValue: any;
    readonly editorElement?: DxElement;
    editorName: string;
    editorOptions?: any;
    readonly dataField?: string;
    readonly filterOperation?: string;
    updateValueTimeout?: number;
    readonly width?: number;
    readonly readOnly: boolean;
    readonly disabled: boolean;
    readonly rtlEnabled: boolean;
}

/** @public */
export type InitializedEvent = InitializedEventInfo<dxFilterBuilder>;

/** @public */
export type OptionChangedEvent = EventInfo<dxFilterBuilder> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = EventInfo<dxFilterBuilder> & {
    readonly value?: any;
    readonly previousValue?: any;
}

/** @public */
export type CustomOperationEditorTemplate = {
    readonly value?: string | number | Date;
    readonly field: dxFilterBuilderField;
    readonly setValue: Function;
}

/** @public */
export type FieldEditorTemplate = {
    readonly value?: string | number | Date;
    readonly filterOperation?: string;
    readonly field: dxFilterBuilderField;
    readonly setValue: Function;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxFilterBuilderOptions extends WidgetOptions<dxFilterBuilder> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowHierarchicalFields?: boolean;
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customOperations?: Array<dxFilterBuilderCustomOperation>;
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fields?: Array<dxFilterBuilderField>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    filterOperationDescriptions?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Between"
       */
      between?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Contains"
       */
      contains?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Ends with"
       */
      endsWith?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Equals"
       */
      equal?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Greater than"
       */
      greaterThan?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Greater than or equal to"
       */
      greaterThanOrEqual?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Is blank"
       */
      isBlank?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Is not blank"
       */
      isNotBlank?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Less than"
       */
      lessThan?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Less than or equal to"
       */
      lessThanOrEqual?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Does not contain"
       */
      notContains?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Does not equal"
       */
      notEqual?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Starts with"
       */
      startsWith?: string
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    groupOperationDescriptions?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "And"
       */
      and?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Not And"
       */
      notAnd?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default "Not Or"
       */
      notOr?: string,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
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
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxGroupLevel?: number;
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFilterBuilder
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 value:any
     * @type_function_param1_field5 setValue(newValue):any
     * @type_function_param1_field6 editorElement:DxElement
     * @type_function_param1_field7 editorName:string
     * @type_function_param1_field8 dataField:string
     * @type_function_param1_field9 filterOperation:string
     * @type_function_param1_field10 updateValueTimeout:number
     * @type_function_param1_field11 width:number
     * @type_function_param1_field12 readOnly:boolean
     * @type_function_param1_field13 disabled:boolean
     * @type_function_param1_field14 rtlEnabled:boolean
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorPrepared?: ((e: EditorPreparedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFilterBuilder
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 value:any
     * @type_function_param1_field5 setValue(newValue):any
     * @type_function_param1_field6 cancel:boolean
     * @type_function_param1_field7 editorElement:DxElement
     * @type_function_param1_field8 editorName:string
     * @type_function_param1_field9 editorOptions:object
     * @type_function_param1_field10 dataField:string
     * @type_function_param1_field11 filterOperation:string
     * @type_function_param1_field12 updateValueTimeout:number
     * @type_function_param1_field13 width:number
     * @type_function_param1_field14 readOnly:boolean
     * @type_function_param1_field15 disabled:boolean
     * @type_function_param1_field16 rtlEnabled:boolean
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onEditorPreparing?: ((e: EditorPreparingEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFilterBuilder
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 value:object
     * @type_function_param1_field5 previousValue:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxFilterBuilder extends Widget {
    constructor(element: UserDefinedElement, options?: dxFilterBuilderOptions)
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
 * @namespace DevExpress.ui
 */
export interface dxFilterBuilderCustomOperation {
    /**
     * @docid
     * @type_function_param1 filterValue:any
     * @type_function_param2 field:dxFilterBuilderField
     * @type_function_return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, field: dxFilterBuilderField) => string | Array<any> | Function);
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid
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
     * @type_function_param1 conditionInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 field:dxFilterBuilderField
     * @type_function_param1_field3 setValue:function
     * @type_function_param2 container:DxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorTemplate?: template | ((conditionInfo: CustomOperationEditorTemplate, container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hasValue?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
}

/**
 * @@docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxFilterBuilderField {
    /**
     * @docid
     * @type_function_param1 filterValue:any
     * @type_function_param2 selectedFilterOperation:string
     * @type_function_return Filter expression
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    calculateFilterExpression?: ((filterValue: any, selectedFilterOperation: string) => string | Array<any> | Function);
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid
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
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorOptions?: any;
    /**
     * @docid
     * @type_function_param1 conditionInfo:object
     * @type_function_param1_field1 value:string|number|date
     * @type_function_param1_field2 filterOperation:string
     * @type_function_param1_field3 field:dxFilterBuilderField
     * @type_function_param1_field4 setValue:function
     * @type_function_param2 container:DxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    editorTemplate?: template | ((conditionInfo: FieldEditorTemplate, container: DxElement) => string | UserDefinedElement);
    /**
     * @docid
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
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    format?: format;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    lookup?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      allowClearing?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       */
      dataSource?: Array<any> | DataSourceOptions | Store,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       * @type_function_param1 data:object
       * @type_function_return string
       */
      displayExpr?: string | ((data: any) => string),
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default undefined
       * @type_function_param1 data:object
       * @type_function_return string|number|boolean
       */
      valueExpr?: string | ((data: any) => string | number | boolean)
    };
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default "true"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    trueText?: string;
}

/** @public */
export type Properties = dxFilterBuilderOptions;

/** @deprecated use Properties instead */
export type Options = dxFilterBuilderOptions;

/** @deprecated use Properties instead */
export type IOptions = dxFilterBuilderOptions;
