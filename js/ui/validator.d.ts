import {
    UserDefinedElement
} from '../core/element';

import DOMComponent, {
    DOMComponentOptions
} from '../core/dom_component';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import {
    AsyncRule,
    ValidationRule
} from './validation_rules';

/** @public */
export type DisposingEvent = EventInfo<dxValidator>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxValidator>;

/** @public */
export type OptionChangedEvent = EventInfo<dxValidator> & ChangedOptionInfo;

/** @public */
export type ValidatedEvent = {
    name?: string;
    isValid?: boolean;
    value?: any;
    validationRules?: Array<ValidationRule>;
    brokenRule?: ValidationRule;
    brokenRules?: ValidationRule;
    status?: 'valid' | 'invalid' | 'pending'
}

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
    onValidated?: ((validatedInfo: ValidatedEvent) => void);
    /**
     * @docid
     * @ref
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationGroup?: string;
    /**
     * @docid
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<ValidationRule>;
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
    constructor(element: UserDefinedElement, options?: dxValidatorOptions)
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
     * @type RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    brokenRule?: ValidationRule;
    /**
     * @docid
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    brokenRules?: Array<ValidationRule>;
    /**
     * @docid
     * @type Promise<dxValidatorResult>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    complete?: DxPromise<dxValidatorResult>;
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
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationRules?: Array<ValidationRule>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: any;
}

/** @public */
export type Options = dxValidatorOptions;

/** @deprecated use Options instead */
export type IOptions = dxValidatorOptions;
