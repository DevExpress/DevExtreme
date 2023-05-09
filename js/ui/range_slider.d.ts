import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    ValueChangedInfo,
} from './editor/editor';

import {
    dxSliderBaseOptions,
} from './slider';

import dxTrackBar from './track_bar';

/** @public */
export type ContentReadyEvent = EventInfo<dxRangeSlider>;

/** @public */
export type DisposingEvent = EventInfo<dxRangeSlider>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxRangeSlider>;

/** @public */
export type OptionChangedEvent = EventInfo<dxRangeSlider> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxRangeSlider, KeyboardEvent | MouseEvent | PointerEvent | TouchEvent | UIEvent | Event> & ValueChangedInfo & {
    readonly start?: number;
    readonly end?: number;
    readonly value?: Array<number>;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxRangeSliderOptions extends dxSliderBaseOptions<dxRangeSlider> {
    /**
     * @docid
     * @default 60
     * @public
     */
    end?: number;
    /**
     * @docid
     * @default ""
     * @public
     */
    endName?: string;
    /**
     * @docid
     * @type_function_param1_field component:dxRangeSlider
     * @action
     * @default null
     * @type_function_param1_field value:array<number>
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * @docid
     * @default 40
     * @public
     */
    start?: number;
    /**
     * @docid
     * @default ""
     * @public
     */
    startName?: string;
    /**
     * @docid
     * @default [40, 60]
     * @public
     */
    value?: Array<number>;
}
/**
 * @docid
 * @isEditor
 * @inherits dxSliderBase
 * @namespace DevExpress.ui
 * @public
 */
export default class dxRangeSlider extends dxTrackBar<dxRangeSliderOptions> { }

/** @public */
export type Properties = dxRangeSliderOptions;

/** @deprecated use Properties instead */
export type Options = dxRangeSliderOptions;

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
 * @docid dxRangeSliderOptions.onContentReady
 * @type_function_param1 e:{ui/range_slider:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxRangeSliderOptions.onDisposing
 * @type_function_param1 e:{ui/range_slider:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxRangeSliderOptions.onInitialized
 * @type_function_param1 e:{ui/range_slider:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxRangeSliderOptions.onOptionChanged
 * @type_function_param1 e:{ui/range_slider:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @skip
 * @docid dxRangeSliderOptions.onValueChanged
 * @type_function_param1 e:{ui/range_slider:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
