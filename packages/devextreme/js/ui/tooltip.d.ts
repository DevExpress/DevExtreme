import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import dxPopover, {
    dxPopoverOptions,
} from './popover';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxTooltip>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxTooltip>;

/**
 * The type of the hiding event handler&apos;s argument.
 */
export type HidingEvent = Cancelable & EventInfo<dxTooltip>;

/**
 * The type of the hidden event handler&apos;s argument.
 */
export type HiddenEvent = EventInfo<dxTooltip>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxTooltip>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxTooltip> & ChangedOptionInfo;

/**
 * The type of the showing event handler&apos;s argument.
 */
export type ShowingEvent = Cancelable & EventInfo<dxTooltip>;

/**
 * The type of the shown event handler&apos;s argument.
 */
export type ShownEvent = EventInfo<dxTooltip>;

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> { }
/**
 * The Tooltip UI component displays a tooltip for a specified element on the page.
 */
export default class dxTooltip extends dxPopover<dxTooltipOptions> { }

export type Properties = dxTooltipOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxTooltipOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onResize' | 'onResizeEnd' | 'onResizeStart' | 'onTitleRendered'>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
type Events = {
/**
 * A function that is executed when the UI component is rendered and each time the component is repainted.
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * A function that is executed before the UI component is disposed of.
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * A function that is executed after the UI component is hidden.
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * A function that is executed before the UI component is hidden.
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * A function used in JavaScript frameworks to save the UI component instance.
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * A function that is executed after a UI component property is changed.
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * A function that is executed before the UI component is displayed.
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * A function that is executed after the UI component is displayed.
 */
onShown?: ((e: ShownEvent) => void);
};
///#ENDDEBUG
