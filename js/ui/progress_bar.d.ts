import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import dxTrackBar, {
    dxTrackBarOptions,
} from './track_bar';

/** @public */
export type CompleteEvent = NativeEventInfo<dxProgressBar>;

/** @public */
export type ContentReadyEvent = EventInfo<dxProgressBar>;

/** @public */
export type DisposingEvent = EventInfo<dxProgressBar>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxProgressBar>;

/** @public */
export type OptionChangedEvent = EventInfo<dxProgressBar> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxProgressBar> & ValueChangedInfo;

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxProgressBarOptions extends dxTrackBarOptions<dxProgressBar> {
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:dxProgressBar
     * @action
     * @public
     */
    onComplete?: ((e: CompleteEvent) => void);
    /**
     * @docid
     * @default true
     * @public
     */
    showStatus?: boolean;
    /**
     * @docid
     * @default function(ratio, value) { return "Progress: " + Math.round(ratio * 100) + "%" }
     * @public
     */
    statusFormat?: string | ((ratio: number, value: number) => string);
    /**
     * @docid
     * @default 0
     * @public
     */
    value?: number | false;
}
/**
 * @docid
 * @inherits dxTrackBar
 * @namespace DevExpress.ui
 * @public
 */
export default class dxProgressBar extends dxTrackBar<dxProgressBarOptions> { }

/** @public */
export type Properties = dxProgressBarOptions;

/** @deprecated use Properties instead */
export type Options = dxProgressBarOptions;

type EventProps<T> = Extract<keyof T, `on${any}`>;
type CheckedEvents<TProps, TEvents extends { [K in EventProps<TProps>]: (e: any) => void } & Record<Exclude<keyof TEvents, keyof TProps>, never>> = TEvents;

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxProgressBarOptions.onComplete
 * @type_function_param1 e:{ui/progress_bar:CompleteEvent}
 */
onComplete?: ((e: CompleteEvent) => void);
/**
 * @skip
 * @docid dxProgressBarOptions.onContentReady
 * @type_function_param1 e:{ui/progress_bar:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxProgressBarOptions.onDisposing
 * @type_function_param1 e:{ui/progress_bar:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxProgressBarOptions.onInitialized
 * @type_function_param1 e:{ui/progress_bar:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxProgressBarOptions.onOptionChanged
 * @type_function_param1 e:{ui/progress_bar:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxProgressBarOptions.onValueChanged
 * @type_function_param1 e:{ui/progress_bar:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
