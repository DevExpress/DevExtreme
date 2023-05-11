import {
    EventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Widget, {
    WidgetOptions,
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
     * @public
     */
    indicatorSrc?: string;
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxLoadIndicator extends Widget<dxLoadIndicatorOptions> { }

/** @public */
export type Properties = dxLoadIndicatorOptions;

/** @deprecated use Properties instead */
export type Options = dxLoadIndicatorOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

type Events = {
/**
 * @skip
 * @docid dxLoadIndicatorOptions.onContentReady
 * @type_function_param1 e:{ui/load_indicator:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxLoadIndicatorOptions.onDisposing
 * @type_function_param1 e:{ui/load_indicator:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxLoadIndicatorOptions.onInitialized
 * @type_function_param1 e:{ui/load_indicator:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxLoadIndicatorOptions.onOptionChanged
 * @type_function_param1 e:{ui/load_indicator:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
