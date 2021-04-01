import {
    TElement
} from '../core/element';

import {
    ComponentEvent,
    ComponentDisposingEvent,
    ComponentInitializedEvent,
    ComponentOptionChangedEvent
} from '../events';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

/** @public */
export type ContentReadyEvent = ComponentEvent<dxLoadIndicator>;

/** @public */
export type DisposingEvent = ComponentDisposingEvent<dxLoadIndicator>;

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxLoadIndicator>;

/** @public */
export type OptionChangedEvent = ComponentOptionChangedEvent<dxLoadIndicator>;

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
 * @public
 */
export default class dxLoadIndicator extends Widget {
    constructor(element: TElement, options?: dxLoadIndicatorOptions)
}

export type Options = dxLoadIndicatorOptions;

/** @deprecated use Options instead */
export type IOptions = dxLoadIndicatorOptions;
