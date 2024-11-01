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
 * @docid _ui_validation_group_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxValidationGroup>;

/**
 * @docid _ui_validation_group_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxValidationGroup>;

/**
 * @docid _ui_validation_group_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxValidationGroup> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxValidationGroupOptions extends DOMComponentOptions<dxValidationGroup> {
}
/**
 * @docid
 * @inherits DOMComponent
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxValidationGroup extends DOMComponent<dxValidationGroupOptions> {
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
     * @return dxValidationGroupResult
     */
    validate(): ValidationResult;
}

/** @public */
export type ValidationResult = dxValidationGroupResult;

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 * @deprecated {ui/validation_group.ValidationResult}
 */
export interface dxValidationGroupResult {
    /**
     * @docid
     * @public
     */
    brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid
     * @type Promise<dxValidationGroupResult>
     * @public
     */
    complete?: DxPromise<dxValidationGroupResult>;
    /**
     * @docid
     * @public
     */
    isValid?: boolean;
    /**
     * @docid
     * @public
     */
    status?: ValidationStatus;
    /**
     * @docid
     * @public
     */
    validators?: Array<any>;
}

/** @public */
export type Properties = dxValidationGroupOptions;

/** @deprecated use Properties instead */
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
