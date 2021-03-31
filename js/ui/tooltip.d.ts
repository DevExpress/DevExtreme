import {
    TElement
} from '../core/element';

import {
    Cancelable,
    ComponentEvent
} from '../events';

import dxPopover, {
    dxPopoverOptions
} from './popover';

/**
 * @public
 */
export type ContentReadyEvent = ComponentEvent<dxTooltip>;
/**
 * @public
 */
export type HidingEvent = ComponentEvent<dxTooltip> & Cancelable;
/**
 * @public
 */
export type HiddenEvent = ComponentEvent<dxTooltip>;
/**
 * @public
 */
export type ShowingEvent = ComponentEvent<dxTooltip>;
/**
 * @public
 */
export type ShownEvent = ComponentEvent<dxTooltip>;

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
