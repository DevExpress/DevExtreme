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
 * @docid _ui_validator_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxValidator>;

/**
 * @docid _ui_validator_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxValidator>;

/**
 * @docid _ui_validator_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxValidator> & ChangedOptionInfo;

/**
 * @docid _ui_validator_ValidatedEvent
 * @public
 * @type object
 */
export type ValidatedEvent = {
    /** @docid _ui_validator_ValidatedEvent.name */
    name?: string;
    /** @docid _ui_validator_ValidatedEvent.isValid */
    isValid?: boolean;
    /**
     * @docid _ui_validator_ValidatedEvent.value
     * @type object
     */
    value?: any;
    /** @docid _ui_validator_ValidatedEvent.validationRules */
    validationRules?: Array<ValidationRule>;
    /** @docid _ui_validator_ValidatedEvent.brokenRule */
    brokenRule?: ValidationRule;
    /** @docid _ui_validator_ValidatedEvent.brokenRules */
    brokenRules?: Array<ValidationRule>;
    /** @docid _ui_validator_ValidatedEvent.status */
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
     * @type_function_param1 validatedInfo:{ui/validator:ValidatedEvent}
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
