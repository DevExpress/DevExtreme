import {
    UserDefinedElement
} from '../core/element';

import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import dxPopover, {
    dxPopoverOptions
} from './popover';

/** @public */
export type ContentReadyEvent = EventInfo<dxTooltip>;

/** @public */
export type DisposingEvent = EventInfo<dxTooltip>;

/** @public */
export type HidingEvent = Cancelable & EventInfo<dxTooltip>;

/** @public */
export type HiddenEvent = EventInfo<dxTooltip>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxTooltip>;

/** @public */
export type OptionChangedEvent = EventInfo<dxTooltip> & ChangedOptionInfo;

/** @public */
export type ShowingEvent = EventInfo<dxTooltip>;

/** @public */
export type ShownEvent = EventInfo<dxTooltip>;

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
    constructor(element: UserDefinedElement, options?: dxTooltipOptions)
}

/** @public */
export type Properties = dxTooltipOptions;

/** @deprecated use Properties instead */
export type Options = dxTooltipOptions;

/** @deprecated use Properties instead */
export type IOptions = dxTooltipOptions;
