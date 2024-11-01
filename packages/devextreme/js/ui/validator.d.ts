import DOMComponent, {
    DOMComponentOptions,
} from '../core/dom_component';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import {
    AsyncRule,
    ValidationRule,
    ValidationStatus,
} from '../common';

export {
    ValidationStatus,
};

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
    status?: ValidationStatus;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxValidatorOptions extends DOMComponentOptions<dxValidator> {
    /**
     * @docid
     * @public
     */
    adapter?: {
      /**
       * @docid
       */
      applyValidationResults?: Function;
      /**
       * @docid
       */
      bypass?: Function;
      /**
       * @docid
       */
      focus?: Function;
      /**
       * @docid
       */
      getValue?: Function;
      /**
       * @docid
       */
      reset?: Function;
      /**
       * @docid
       */
      validationRequestsCallbacks?: Array<Function>;
    };
    /**
     * @docid
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type_function_param1 validatedInfo:Object
     * @type_function_param1_field value:Object
     * @type_function_param1_field validationRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @type_function_param1_field brokenRule:RequiredRule|NumericRule|RangeRule|StringLengthRule|CustomRule|CompareRule|PatternRule|EmailRule|AsyncRule
     * @type_function_param1_field brokenRules:Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @type_function_param1_field status:Enums.ValidationStatus
     * @action
     * @public
     */
    onValidated?: ((validatedInfo: ValidatedEvent) => void);
    /**
     * @docid
     * @ref
     * @public
     */
    validationGroup?: string;
    /**
     * @docid
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @public
     */
    validationRules?: Array<ValidationRule>;
}
/**
 * @docid
 * @inherits DOMComponent
 * @extension
 * @namespace DevExpress.ui
 * @public
 */
export default class dxValidator extends DOMComponent<dxValidatorOptions> {
    /**
     * @docid
     * @publicName focus()
     * @public
     */
    focus(): void;
    /**
     * @docid
     * @publicName reset()
     * @public
     */
    reset(): void;
    /**
     * @docid
     * @publicName validate()
     * @public
     * @return dxValidatorResult
     */
    validate(): ValidationResult;
}

/** @public */
export type ValidationResult = dxValidatorResult;

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 * @deprecated {ui/validator.ValidationResult}
 */
export interface dxValidatorResult {
    /**
     * @docid
     * @type RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule
     * @public
     */
    brokenRule?: ValidationRule;
    /**
     * @docid
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @public
     */
    brokenRules?: Array<ValidationRule>;
    /**
     * @docid
     * @type Promise<dxValidatorResult>
     * @public
     */
    complete?: DxPromise<dxValidatorResult>;
    /**
     * @docid
     * @public
     */
    isValid?: boolean;
    /**
     * @docid
     * @public
     */
    pendingRules?: Array<AsyncRule>;
    /**
     * @docid
     * @public
     */
    status?: ValidationStatus;
    /**
     * @docid
     * @type Array<RequiredRule,NumericRule,RangeRule,StringLengthRule,CustomRule,CompareRule,PatternRule,EmailRule,AsyncRule>
     * @public
     */
    validationRules?: Array<ValidationRule>;
    /**
     * @docid
     * @public
     */
    value?: any;
}

/** @public */
export type Properties = dxValidatorOptions;

/** @deprecated use Properties instead */
export type Options = dxValidatorOptions;
