import {
    TElement
} from '../core/element';

import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

import {
    TPromise
} from '../core/utils/deferred';

import {
    AsyncRule,
    CompareRule,
    CustomRule,
    EmailRule,
    NumericRule,
    PatternRule,
    RangeRule,
    RequiredRule,
    StringLengthRule
} from './validation_rules';

export interface dxValidatorOptions extends DOMComponentOptions<dxValidator> {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    adapter?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      applyValidationResults?: Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      bypass?: Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      focus?: Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      getValue?: Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      reset?: Function,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       */
      validationRequestsCallbacks?: Array<Function>
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type_function_param1 validatedInfo:Object
     * @type_function_param1_field1 name:string
     * @type_function_param1_field2 isValid:boolean
     * @type_function_param1_field3 value:Object
     * @type_function_param1_field4 validationRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @type_function_param1_field5 brokenRule:RequiredRule|NumericRule|RangeRule|StringLengthRule|CustomRule|CompareRule|PatternRule|EmailRule|AsyncRule
     * @type_function_param1_field6 brokenRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @type_function_param1_field7 status:Enums.ValidationStatus
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValidated?: ((validatedInfo: { name?: string, isValid?: boolean, value?: any, validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule, brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>, status?: 'valid' | 'invalid' | 'pending' }) => any);
    /**
     * @docid
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationGroup?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
}
/**
 * @docid
 * @inherits DOMComponent
 * @extension
 * @module ui/validator
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxValidator extends DOMComponent {
    constructor(element: TElement, options?: dxValidatorOptions)
    /**
     * @docid
     * @publicName focus()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focus(): void;
    /**
     * @docid
     * @publicName reset()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reset(): void;
    /**
     * @docid
     * @publicName validate()
     * @return dxValidatorResult
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validate(): dxValidatorResult;
}

/**
 * @docid
 * @type object
 */
export interface dxValidatorResult {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid
     * @type Promise<dxValidatorResult>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    complete?: TPromise<dxValidatorResult>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isValid?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pendingRules?: Array<AsyncRule>;
    /**
     * @docid
     * @type Enums.ValidationStatus
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    status?: 'valid' | 'invalid' | 'pending';
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
}

export type Options = dxValidatorOptions;

/** @deprecated use Options instead */
export type IOptions = dxValidatorOptions;
