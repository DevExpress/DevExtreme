import {
    Cancelable,
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import dxPopover, {
    dxPopoverOptions,
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
export type ShowingEvent = Cancelable & EventInfo<dxTooltip>;

/** @public */
export type ShownEvent = EventInfo<dxTooltip>;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxTooltipOptions extends dxPopoverOptions<dxTooltip> { }
/**
 * @docid
 * @inherits dxPopover
 * @hasTranscludedContent
 * @namespace DevExpress.ui
 * @public
 */
export default class dxTooltip extends dxPopover<dxTooltipOptions> { }

/** @public */
export type Properties = dxTooltipOptions;

/** @deprecated use Properties instead */
export type Options = dxTooltipOptions;

///#DEBUG
type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onResize' | 'onResizeEnd' | 'onResizeStart' | 'onTitleRendered'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxTooltipOptions.onContentReady
 * @type_function_param1 e:{ui/tooltip:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxTooltipOptions.onDisposing
 * @type_function_param1 e:{ui/tooltip:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxTooltipOptions.onHidden
 * @type_function_param1 e:{ui/tooltip:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @skip
 * @docid dxTooltipOptions.onHiding
 * @type_function_param1 e:{ui/tooltip:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @skip
 * @docid dxTooltipOptions.onInitialized
 * @type_function_param1 e:{ui/tooltip:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxTooltipOptions.onOptionChanged
 * @type_function_param1 e:{ui/tooltip:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxTooltipOptions.onShowing
 * @type_function_param1 e:{ui/tooltip:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @skip
 * @docid dxTooltipOptions.onShown
 * @type_function_param1 e:{ui/tooltip:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
};
///#ENDDEBUG
