import {
    TElement
} from '../core/element';

import {
    ComponentHidingEvent,
    ComponentHiddenEvent,
    ComponentShowingEvent,
    ComponentShownEvent
} from './overlay';

import dxPopover, {
    dxPopoverOptions
} from './popover';

import {
    ComponentContentReadyEvent
} from './widget/ui.widget'

/**
 * @public
 */
export type ContentReadyEvent = ComponentContentReadyEvent<dxTooltip>;
/**
 * @public
 */
export type HidingEvent = ComponentHidingEvent<dxTooltip>;
/**
 * @public
 */
export type HiddenEvent = ComponentHiddenEvent<dxTooltip>;
/**
 * @public
 */
export type ShowingEvent = ComponentShowingEvent<dxTooltip>;
/**
 * @public
 */
export type ShownEvent = ComponentShownEvent<dxTooltip>;

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
