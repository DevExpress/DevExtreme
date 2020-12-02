import '../jquery_augmentation';

import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

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
     * @docid dxValidatorOptions.adapter
     * @type Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    adapter?: { applyValidationResults?: Function, bypass?: Function, focus?: Function, getValue?: Function, reset?: Function, validationRequestsCallbacks?: Array<Function> };
    /**
     * @docid dxValidatorOptions.name
     * @type string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxValidatorOptions.onValidated
     * @type function(validatedInfo)
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
     * @docid dxValidatorOptions.validationGroup
     * @type string
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationGroup?: string;
    /**
     * @docid dxValidatorOptions.validationRules
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
}
/**
 * @docid dxValidator
 * @inherits DOMComponent
 * @extension
 * @module ui/validator
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxValidator extends DOMComponent {
    constructor(element: Element, options?: dxValidatorOptions)
    constructor(element: JQuery, options?: dxValidatorOptions)
    /**
     * @docid dxValidatorMethods.focus
     * @publicName focus()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focus(): void;
    /**
     * @docid dxValidatorMethods.reset
     * @publicName reset()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reset(): void;
    /**
     * @docid dxValidatorMethods.validate
     * @publicName validate()
     * @return dxValidatorResult
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validate(): dxValidatorResult;
}

export interface dxValidatorResult {
    /**
     * @docid dxValidatorResult.brokenRule
     * @type RequiredRule|NumericRule|RangeRule|StringLengthRule|CustomRule|CompareRule|PatternRule|EmailRule|AsyncRule
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    brokenRule?: RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule;
    /**
     * @docid dxValidatorResult.brokenRules
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid dxValidatorResult.complete
     * @type Promise<dxValidatorResult>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    complete?: Promise<dxValidatorResult> | JQueryPromise<dxValidatorResult>;
    /**
     * @docid dxValidatorResult.isValid
     * @type boolean
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isValid?: boolean;
    /**
     * @docid dxValidatorResult.pendingRules
     * @type Array<AsyncRule>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    pendingRules?: Array<AsyncRule>;
    /**
     * @docid dxValidatorResult.status
     * @type Enums.ValidationStatus
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    status?: 'valid' | 'invalid' | 'pending';
    /**
     * @docid dxValidatorResult.validationRules
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid dxValidatorResult.value
     * @type any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
}

declare global {
interface JQuery {
    dxValidator(): JQuery;
    dxValidator(options: "instance"): dxValidator;
    dxValidator(options: string): any;
    dxValidator(options: string, ...params: any[]): any;
    dxValidator(options: dxValidatorOptions): JQuery;
}
}
export type Options = dxValidatorOptions;

/** @deprecated use Options instead */
export type IOptions = dxValidatorOptions;
