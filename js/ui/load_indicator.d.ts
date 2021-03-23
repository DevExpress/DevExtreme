import {
    TElement
} from '../core/element';

import Widget, {
    WidgetOptions,
    ContentReadyEvent
} from './widget/ui.widget';

/**
 * @public
*/
export { ContentReadyEvent }
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
