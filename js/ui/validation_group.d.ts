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
    CompareRule,
    CustomRule,
    EmailRule,
    NumericRule,
    PatternRule,
    RangeRule,
    RequiredRule,
    StringLengthRule
} from './validation_rules';

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
 * @module ui/validation_group
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxValidationGroup extends DOMComponent<dxValidationGroupOptions> {
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
     * @return dxValidationGroupResult
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validate(): dxValidationGroupResult;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxValidationGroupResult {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid
     * @type Promise<dxValidationGroupResult>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    complete?: DxPromise<dxValidationGroupResult>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isValid?: boolean;
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
    validators?: Array<any>;
}

/** @public */
export type Properties = dxValidationGroupOptions;

/** @deprecated use Properties instead */
export type Options = dxValidationGroupOptions;

/** @deprecated use Properties instead */
export type IOptions = dxValidationGroupOptions;
