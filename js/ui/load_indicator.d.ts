import {
    UserDefinedElement
} from '../core/element';

import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type ContentReadyEvent = EventInfo<dxLoadIndicator>;

/** @public */
export type DisposingEvent = EventInfo<dxLoadIndicator>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxLoadIndicator>;

/** @public */
export type OptionChangedEvent = EventInfo<dxLoadIndicator> & ChangedOptionInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxLoadIndicatorOptions extends WidgetOptions<dxLoadIndicator> {
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    indicatorSrc?: string;
}
/**
 * @docid
 * @inherits Widget
 * @module ui/load_indicator
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @namespace DevExpress.ui
 * @public
 */
export default class dxLoadIndicator extends Widget {
    constructor(element: UserDefinedElement, options?: dxLoadIndicatorOptions)
}

/** @public */
export type Properties = dxLoadIndicatorOptions;

/** @deprecated use Properties instead */
export type Options = dxLoadIndicatorOptions;

/** @deprecated use Properties instead */
export type IOptions = dxLoadIndicatorOptions;
