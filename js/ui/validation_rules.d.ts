import {
    TPromise
} from '../core/utils/deferred';

/**
 * @public
 */
export interface ValidationCallbackData {
    value?: string | number,
    rule: any,
    validator: any,
    data?: any,
    column?: any,
    formItem?: any
}

/**
 * @docid
 * @section dxValidator
 * @type object
 */
export interface AsyncRule {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid
     * @default 'Value is invalid'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reevaluate?: boolean;
    /**
     * @docid
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type: 'async';
    /**
     * @docid
     * @type_function_return Promise<any>
     * @type_function_param1 options:object
     * @type_function_param1_field1 value:string|number
     * @type_function_param1_field2 rule:object
     * @type_function_param1_field3 validator:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 column:object
     * @type_function_param1_field6 formItem:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationCallback?: ((options: ValidationCallbackData) => TPromise<any>);
}

/**
 * @docid
 * @section dxValidator
 * @type object
 */
export interface CompareRule {
    /**
     * @docid
     * @type_function_return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    comparisonTarget?: (() => any);
    /**
     * @docid
     * @type Enums.ComparisonOperator
     * @default '=='
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    comparisonType?: '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid
     * @default 'Values do not match'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reevaluate?: boolean;
    /**
     * @docid
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type: 'compare';
}

/**
 * @docid
 * @type object
 * @section dxValidator
 */
export interface CustomRule {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid
     * @default 'Value is invalid'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reevaluate?: boolean;
    /**
     * @docid
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type: 'custom';
    /**
     * @docid
     * @type_function_return boolean
     * @type_function_param1 options:object
     * @type_function_param1_field1 value:string|number
     * @type_function_param1_field2 rule:object
     * @type_function_param1_field3 validator:object
     * @type_function_param1_field4 data:object
     * @type_function_param1_field5 column:object
     * @type_function_param1_field6 formItem:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationCallback?: ((options: ValidationCallbackData) => boolean);
}

/**
 * @docid
 * @type object
 * @section dxValidator
 */
export interface EmailRule {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid
     * @default 'Email is invalid'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type: 'email';
}

/**
 * @docid
 * @type object
 * @section dxValidator
 */
export interface NumericRule {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid
     * @default 'Value should be a number'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type: 'numeric';
}

/**
 * @docid
 * @type object
 * @section dxValidator
 */
export interface PatternRule {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid
     * @default 'Value does not match pattern'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @type regexp|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pattern?: RegExp | string;
    /**
     * @docid
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type: 'pattern';
}

/**
 * @docid
 * @type object
 * @section dxValidator
 */
export interface RangeRule {
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: Date | number;
    /**
     * @docid
     * @default 'Value is out of range'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: Date | number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reevaluate?: boolean;
    /**
     * @docid
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type: 'range';
}

/**
 * @docid
 * @type object
 * @section dxValidator
 */
export interface RequiredRule {
    /**
     * @docid
     * @default 'Required'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    trim?: boolean;
    /**
     * @docid
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type: 'required';
}

/**
 * @docid
 * @type object
 * @section dxValidator
 */
export interface StringLengthRule {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: number;
    /**
     * @docid
     * @default 'The length of the value is not correct'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: number;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    trim?: boolean;
    /**
     * @docid
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type: 'stringLength';
}

export type ValidationRule = AsyncRule | CompareRule | CustomRule | EmailRule | NumericRule | PatternRule | RangeRule | RequiredRule | StringLengthRule;
