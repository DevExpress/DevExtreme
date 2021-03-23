import {
    TElement
} from '../core/element';

import dxPopover, {
    dxPopoverOptions,
    ShownEvent,
    HidindEvent,
    HiddenEvent,
    ShowingEvent,
    ContentReadyEvent
} from './popover';

/**
 * @public
*/
export {
    ShownEvent,
    HidindEvent,
    HiddenEvent,
    ShowingEvent,
    ContentReadyEvent
}
export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> {
}
/**
 * @docid
 * @inherits dxPopover
 * @hasTranscludedContent
 * @module ui/tooltip
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTooltip extends dxPopover {
    constructor(element: TElement, options?: dxTooltipOptions)
}

export type Options = dxTooltipOptions;

/** @deprecated use Options instead */
export type IOptions = dxTooltipOptions;
