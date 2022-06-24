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
} from '../events/index';

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
} from './validation_rules';

import {
    ValidationStatus,
} from '../common';

export {
    ValidationStatus,
};

/** @public */
export type DisposingEvent = EventInfo<dxValidationGroup>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxValidationGroup>;

/** @public */
export type OptionChangedEvent = EventInfo<dxValidationGroup> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
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
