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

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxValidator>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxValidator>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxValidator> & ChangedOptionInfo;

/**
 * The type of the validated event handler&apos;s argument.
 */
export type ValidatedEvent = {
    /**
     * The value of the name property.
     */
    name?: string;
    /**
     * Indicates whether the value satisfies all rules.
     */
    isValid?: boolean;
    /**
     * The validated value.
     */
    value?: any;
    /**
     * An array of validation rules specified for the current dxValidator object.
     */
    validationRules?: Array<ValidationRule>;
    /**
     * The object that represents the first broken rule on the list of specified validation rules.
     */
    brokenRule?: ValidationRule;
    /**
     * An array of validationRules that failed to pass the check.
     */
    brokenRules?: Array<ValidationRule>;
    /**
     * Indicates the validation status.
     */
    status?: ValidationStatus;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxValidatorOptions extends DOMComponentOptions<dxValidator> {
    /**
     * An object that specifies what and when to validate, and how to apply the validation result.
     */
    adapter?: {
      /**
       * A function that the Validator UI component calls after validating a specified value.
       */
      applyValidationResults?: Function;
      /**
       * A function that returns a Boolean value specifying whether or not to bypass validation.
       */
      bypass?: Function;
      /**
       * A function that sets focus to a validated editor when the corresponding ValidationSummary item is focused.
       */
      focus?: Function;
      /**
       * A function that returns the value to be validated.
       */
      getValue?: Function;
      /**
       * A function that resets the validated values.
       */
      reset?: Function;
      /**
       * Callbacks to be executed on the value validation.
       */
      validationRequestsCallbacks?: Array<Function>;
    };
    /**
     * Specifies the editor name to be used in the validation default messages.
     */
    name?: string;
    /**
     * A function that is executed after a value is validated.
     */
    onValidated?: ((validatedInfo: ValidatedEvent) => void);
    /**
     * Specifies the validation group the editor will be related to.
     */
    validationGroup?: string;
    /**
     * An array of validation rules to be checked for the editor with which the dxValidator object is associated.
     */
    validationRules?: Array<ValidationRule>;
}
/**
 * A UI component that is used to validate the associated DevExtreme editors against the defined validation rules.
 */
export default class dxValidator extends DOMComponent<dxValidatorOptions> {
    /**
     * Sets focus to the editor associated with the current Validator object.
     */
    focus(): void;
    /**
     * Resets the value and validation result of the editor associated with the current Validator object.
     */
    reset(): void;
    /**
     * Validates the value of the editor that is controlled by the current Validator object against the list of the specified validation rules.
     */
    validate(): ValidationResult;
}

export type ValidationResult = dxValidatorResult;

/**
 * A validation result.
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxValidatorResult {
    /**
     * A rule that failed to pass the check. Contains the first item from the brokenRules array.
     */
    brokenRule?: ValidationRule;
    /**
     * An array of the validationRules that failed to pass the check.
     */
    brokenRules?: Array<ValidationRule>;
    /**
     * A promise that is fulfilled when all async rules are validated.
     */
    complete?: DxPromise<dxValidatorResult>;
    /**
     * Indicates whether all the checked rules are satisfied.
     */
    isValid?: boolean;
    /**
     * An array of async rules whose promises are not fulfilled or rejected. Contains items only when the status is &apos;pending&apos;.
     */
    pendingRules?: Array<AsyncRule>;
    /**
     * Indicates the validation status.
     */
    status?: ValidationStatus;
    /**
     * Validation rules specified for the Validator.
     */
    validationRules?: Array<ValidationRule>;
    /**
     * The value being validated.
     */
    value?: any;
}

export type Properties = dxValidatorOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxValidatorOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onValidated'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxValidatorOptions.onDisposing
 * @type_function_param1 e:{ui/validator:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxValidatorOptions.onInitialized
 * @type_function_param1 e:{ui/validator:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxValidatorOptions.onOptionChanged
 * @type_function_param1 e:{ui/validator:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
