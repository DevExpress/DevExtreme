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
} from './validation_engine';

export interface dxValidationGroupOptions extends DOMComponentOptions<dxValidationGroup> {
}
/**
 * @docid dxValidationGroup
 * @inherits DOMComponent
 * @hasTranscludedContent
 * @module ui/validation_group
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxValidationGroup extends DOMComponent {
    constructor(element: Element, options?: dxValidationGroupOptions)
    constructor(element: JQuery, options?: dxValidationGroupOptions)
    /**
     * @docid dxValidationGroup.reset
     * @publicName reset()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    reset(): void;
    /**
     * @docid dxValidationGroup.validate
     * @publicName validate()
     * @return dxValidationGroupResult
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validate(): dxValidationGroupResult;
}

export interface dxValidationGroupResult {
    /**
     * @docid dxValidationGroupResult.brokenRules
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    brokenRules?: Array<RequiredRule | NumericRule | RangeRule | StringLengthRule | CustomRule | CompareRule | PatternRule | EmailRule | AsyncRule>;
    /**
     * @docid dxValidationGroupResult.complete
     * @type Promise<dxValidationGroupResult>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    complete?: Promise<dxValidationGroupResult> | JQueryPromise<dxValidationGroupResult>;
    /**
     * @docid dxValidationGroupResult.isValid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    isValid?: boolean;
    /**
     * @docid dxValidationGroupResult.status
     * @type Enums.ValidationStatus
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    status?: 'valid' | 'invalid' | 'pending';
    /**
     * @docid dxValidationGroupResult.validators
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validators?: Array<any>;
}

declare global {
interface JQuery {
    dxValidationGroup(): JQuery;
    dxValidationGroup(options: "instance"): dxValidationGroup;
    dxValidationGroup(options: string): any;
    dxValidationGroup(options: string, ...params: any[]): any;
    dxValidationGroup(options: dxValidationGroupOptions): JQuery;
}
}
export type Options = dxValidationGroupOptions;

/** @deprecated use Options instead */
export type IOptions = dxValidationGroupOptions;
