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
 * @docid _ui_tooltip_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxTooltip>;

/**
 * @docid _ui_tooltip_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxTooltip>;

/**
 * @docid _ui_tooltip_HidingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type HidingEvent = Cancelable & EventInfo<dxTooltip>;

/**
 * @docid _ui_tooltip_HiddenEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type HiddenEvent = EventInfo<dxTooltip>;

/**
 * @docid _ui_tooltip_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxTooltip>;

/**
 * @docid _ui_tooltip_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxTooltip> & ChangedOptionInfo;

/**
 * @docid _ui_tooltip_ShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,EventInfo
 */
export type ShowingEvent = Cancelable & EventInfo<dxTooltip>;

/**
 * @docid _ui_tooltip_ShownEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
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
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut' | 'onResize' | 'onResizeEnd' | 'onResizeStart' | 'onTitleRendered'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxTooltipOptions.onContentReady
 * @type_function_param1 e:{ui/tooltip:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxTooltipOptions.onDisposing
 * @type_function_param1 e:{ui/tooltip:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxTooltipOptions.onHidden
 * @type_function_param1 e:{ui/tooltip:HiddenEvent}
 */
onHidden?: ((e: HiddenEvent) => void);
/**
 * @docid dxTooltipOptions.onHiding
 * @type_function_param1 e:{ui/tooltip:HidingEvent}
 */
onHiding?: ((e: HidingEvent) => void);
/**
 * @docid dxTooltipOptions.onInitialized
 * @type_function_param1 e:{ui/tooltip:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxTooltipOptions.onOptionChanged
 * @type_function_param1 e:{ui/tooltip:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxTooltipOptions.onShowing
 * @type_function_param1 e:{ui/tooltip:ShowingEvent}
 */
onShowing?: ((e: ShowingEvent) => void);
/**
 * @docid dxTooltipOptions.onShown
 * @type_function_param1 e:{ui/tooltip:ShownEvent}
 */
onShown?: ((e: ShownEvent) => void);
};
///#ENDDEBUG
