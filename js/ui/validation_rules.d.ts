export interface AsyncRule {
    /**
     * @docid AsyncRule.ignoreEmptyValue
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid AsyncRule.message
     * @type string
     * @default 'Value is invalid'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid AsyncRule.reevaluate
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reevaluate?: boolean;
    /**
     * @docid AsyncRule.type
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    /**
     * @docid AsyncRule.validationCallback
     * @type function
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

export interface CompareRule {
    /**
     * @docid CompareRule.comparisonTarget
     * @type function
     * @type_function_return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    comparisonTarget?: (() => any);
    /**
     * @docid CompareRule.comparisonType
     * @type Enums.ComparisonOperator
     * @default '=='
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    comparisonType?: '!=' | '!==' | '<' | '<=' | '==' | '===' | '>' | '>=';
    /**
     * @docid CompareRule.ignoreEmptyValue
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid CompareRule.message
     * @type string
     * @default 'Values do not match'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid CompareRule.reevaluate
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reevaluate?: boolean;
    /**
     * @docid CompareRule.type
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}

export interface CustomRule {
    /**
     * @docid CustomRule.ignoreEmptyValue
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid CustomRule.message
     * @type string
     * @default 'Value is invalid'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid CustomRule.reevaluate
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reevaluate?: boolean;
    /**
     * @docid CustomRule.type
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
    /**
     * @docid CustomRule.validationCallback
     * @type function
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

export interface EmailRule {
    /**
     * @docid EmailRule.ignoreEmptyValue
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid EmailRule.message
     * @type string
     * @default 'Email is invalid'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid EmailRule.type
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}

export interface NumericRule {
    /**
     * @docid NumericRule.ignoreEmptyValue
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid NumericRule.message
     * @type string
     * @default 'Value should be a number'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid NumericRule.type
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}

export interface PatternRule {
    /**
     * @docid PatternRule.ignoreEmptyValue
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid PatternRule.message
     * @type string
     * @default 'Value does not match pattern'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid PatternRule.pattern
     * @type regexp|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pattern?: RegExp | string;
    /**
     * @docid PatternRule.type
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}

export interface RangeRule {
    /**
     * @docid RangeRule.ignoreEmptyValue
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid RangeRule.max
     * @type datetime|number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: Date | number;
    /**
     * @docid RangeRule.message
     * @type string
     * @default 'Value is out of range'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid RangeRule.min
     * @type datetime|number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: Date | number;
    /**
     * @docid RangeRule.reevaluate
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reevaluate?: boolean;
    /**
     * @docid RangeRule.type
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}

export interface RequiredRule {
    /**
     * @docid RequiredRule.message
     * @type string
     * @default 'Required'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid RequiredRule.trim
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    trim?: boolean;
    /**
     * @docid RequiredRule.type
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}

export interface StringLengthRule {
    /**
     * @docid StringLengthRule.ignoreEmptyValue
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    ignoreEmptyValue?: boolean;
    /**
     * @docid StringLengthRule.max
     * @type number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    max?: number;
    /**
     * @docid StringLengthRule.message
     * @type string
     * @default 'The length of the value is not correct'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    message?: string;
    /**
     * @docid StringLengthRule.min
     * @type number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    min?: number;
    /**
     * @docid StringLengthRule.trim
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    trim?: boolean;
    /**
     * @docid StringLengthRule.type
     * @type Enums.ValidationRuleType
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    type?: 'required' | 'numeric' | 'range' | 'stringLength' | 'custom' | 'compare' | 'pattern' | 'email' | 'async';
}
