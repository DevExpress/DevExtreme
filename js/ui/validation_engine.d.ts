import '../jquery_augmentation';

import {
    dxValidationGroupResult
} from './validation_group';

/**
 * @docid
 * @section Core
 * @namespace DevExpress
 * @module ui/validation_engine
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class validationEngine {
    /**
     * @docid
     * @section Core
     * @publicName getGroupConfig()
     * @return object
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static getGroupConfig(): any;
    /**
     * @docid
     * @section Core
     * @publicName getGroupConfig(group)
     * @param1 group:string|object
     * @return object
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static getGroupConfig(group: string | any): any;
    /**
     * @docid
     * @publicName registerModelForValidation(model)
     * @param1 model:object
     * @static
     * @prevFileNamespace DevExpress.integration
     * @public
     */
    static registerModelForValidation(model: any): void;
    /**
     * @docid
     * @section Core
     * @publicName resetGroup()
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static resetGroup(): void;
    /**
     * @docid
     * @section Core
     * @publicName resetGroup(group)
     * @param1 group:string|object
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static resetGroup(group: string | any): void;
    /**
     * @docid
     * @publicName unregisterModelForValidation(model)
     * @param1 model:object
     * @static
     * @prevFileNamespace DevExpress.integration
     * @public
     */
    static unregisterModelForValidation(model: any): void;
    /**
     * @docid
     * @section Core
     * @publicName validateGroup()
     * @return dxValidationGroupResult
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static validateGroup(): dxValidationGroupResult;
    /**
     * @docid
     * @section Core
     * @publicName validateGroup(group)
     * @param1 group:string|object
     * @return dxValidationGroupResult
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static validateGroup(group: string | any): dxValidationGroupResult;
    /**
     * @docid
     * @publicName validateModel(model)
     * @param1 model:object
     * @return object
     * @static
     * @prevFileNamespace DevExpress.integration
     * @public
     */
    static validateModel(model: any): any;
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
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
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
    validationCallback?: ((options: { value?: string | number, rule?: any, validator?: any, data?: any, column?: any, formItem?: any }) => Promise<any> | JQueryPromise<any>);
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
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
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
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
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
    validationCallback?: ((options: { value?: string | number, rule?: any, validator?: any, data?: any, column?: any, formItem?: any }) => boolean);
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
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
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
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
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
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
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
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
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
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
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
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}
