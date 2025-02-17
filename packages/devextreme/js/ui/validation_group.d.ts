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
    CompareRule,
    CustomRule,
    EmailRule,
    NumericRule,
    PatternRule,
    RangeRule,
    RequiredRule,
    StringLengthRule,
    ValidationStatus,
} from '../common';

export {
    ValidationStatus,
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxValidationGroup>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxValidationGroup>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxValidationGroup> & ChangedOptionInfo;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxValidationGroupOptions extends DOMComponentOptions<dxValidationGroup> {
}
/**
 * The ValidationGroup is a UI component that allows you to validate several editors simultaneously.
 */
export default class dxValidationGroup extends DOMComponent<dxValidationGroupOptions> {
    /**
     * Resets the value and validation result of the editors that are included to the current validation group.
     */
    reset(): void;
    /**
     * Validates rules of the validators that belong to the current validation group.
     */
    validate(): ValidationResult;
}

export type ValidationResult = dxValidationGroupResult;

/**
 * A group validation result.
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxValidationGroupResult {
    /**
     * An array of the validation rules that failed.
     */
    brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * A promise that is fulfilled when all async rules are validated.
     */
    complete?: DxPromise<dxValidationGroupResult>;
    /**
     * Indicates whether all the rules checked for the group are satisfied.
     */
    isValid?: boolean;
    /**
     * Indicates the validation status.
     */
    status?: ValidationStatus;
    /**
     * Validator UI components included in the validated group.
     */
    validators?: Array<any>;
}

export type Properties = dxValidationGroupOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxValidationGroupOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxValidationGroupOptions.onDisposing
 * @type_function_param1 e:{ui/validation_group:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxValidationGroupOptions.onInitialized
 * @type_function_param1 e:{ui/validation_group:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxValidationGroupOptions.onOptionChanged
 * @type_function_param1 e:{ui/validation_group:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
